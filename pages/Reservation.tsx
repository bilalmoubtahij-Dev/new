import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, CheckCircle2, ChevronDown, AlertTriangle } from 'lucide-react';
import { Section, FadeIn, Button } from '../components/ui/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { Reservation as ReservationType } from '../types';
import { sanitizeInput } from '../utils/sanitize';
import { supabase } from '../utils/supabase';

const Reservation = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const autoCourse = location.state?.autoCourse || '';
  const autoLevel = location.state?.autoLevel || '';
  const testResultId = (location.state as any)?.testResultId;

  const userInfo = location.state?.userInfo || null;

  const [formData, setFormData] = useState({
    name: userInfo?.fullName || '',
    phone: userInfo?.phone || '',
    email: userInfo?.email || '',
    course: autoCourse,
    level: autoLevel,
    time: '',
    message: '',
    _honey: '' // native formsubmit honeypot
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);

  const courses = [
    { name: 'General English', levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
    { name: 'Business English', levels: ['B1', 'B2', 'C1', 'C2'] },
    { name: 'TOEFL Preparation', levels: ['B2', 'C1', 'C2'] },
    { name: 'IELTS Preparation', levels: ['B2', 'C1', 'C2'] },
    { name: 'French Language', levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
    { name: 'Arabic Reading & Writing', levels: ['All Levels'] },
    { name: 'Primary School Support', levels: ['Mathematics', 'Arabic', 'French', 'English'] },
    { name: 'Middle School Support', levels: ['French', 'English', 'Physics', 'Science', 'Mathematics'] },
    { name: 'High School Support', levels: ['English', 'Arabic', 'French', 'Philosophy', 'Physics & Chemistry', 'Biology', 'Mathematics', 'History & Geography', 'Islamic Studies', 'Economics & Management', 'Technology'] },
    { name: 'University Support', levels: ['English', 'French', 'Biology', 'Chemistry', 'Physics', 'Economics', 'Research Writing', 'Business English', 'Presentation Skills'] },
  ];

  const availableLevels = courses.find(c => c.name === formData.course)?.levels || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset level if course changes
    if (e.target.name === 'course') {
        setFormData(prev => ({ ...prev, course: e.target.value, level: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone || !formData.email || !formData.course || !formData.level || !formData.time) {
        setError('res.error');
        return;
    }

    const sanitizedData = {
        name: sanitizeInput(formData.name),
        phone: sanitizeInput(formData.phone),
        email: sanitizeInput(formData.email),
        course: sanitizeInput(formData.course),
        level: sanitizeInput(formData.level),
        time: sanitizeInput(formData.time),
        message: sanitizeInput(formData.message)
    };

    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        let userIp = '';
        try {
            const ipRes = await fetch('https://api.ipify.org?format=json');
            if (ipRes.ok) {
                const ipData = await ipRes.json();
                userIp = ipData.ip || '';
            }
        } catch (e) {
            console.error('Could not fetch IP', e);
        }

        // If not admin, check for any previous reservations from this email, phone, or name
        if (!session) {
            const safeEmail = sanitizedData.email.replace(/,/g, '').trim();
            const safePhone = sanitizedData.phone.replace(/,/g, '').trim();
            const safeName = sanitizedData.name.replace(/,/g, '').trim();

            // Securely check for duplicates using the Postgres RPC function
            const { data: duplicateStatus, error: rpcError } = await supabase.rpc('check_duplicate_reservation', {
                p_email: safeEmail,
                p_phone: safePhone,
                p_name: safeName,
                p_ip: userIp
            });

            if (rpcError) {
                console.error("RPC Error:", rpcError);
            }

            const hasLocalFlag = localStorage.getItem(`reserved_${sanitizedData.email}`) === 'true';

            if (duplicateStatus === 'ip_limit') {
                setError('res.limit.ip.error');
                return;
            }

            if (duplicateStatus === 'data_limit' || hasLocalFlag) {
                setError('res.limit.error');
                return;
            }
        }

        let dbError = null;

        if (testResultId) {
            const { error } = await supabase.from('test_results').update({
                reservation_course: sanitizedData.course,
                reservation_level: sanitizedData.level,
                reservation_time: sanitizedData.time,
                reservation_message: sanitizedData.message,
                reservation_status: 'Pending',
                ip_address: userIp
            }).eq('id', testResultId);
            dbError = error;
        } else {
            const { error } = await supabase.from('reservations').insert([
                {
                    name: sanitizedData.name,
                    phone: sanitizedData.phone,
                    email: sanitizedData.email,
                    course: sanitizedData.course,
                    level: sanitizedData.level,
                    time: sanitizedData.time,
                    message: sanitizedData.message,
                    status: 'Pending',
                    ip_address: userIp
                }
            ]);
            dbError = error;
        }

        if (dbError) {
            console.error('Supabase error:', dbError);
            setError('Failed to send reservation. Please try again later.');
            return;
        }
    } catch (err) {
        console.error('Network error:', err);
        setError('Network error. Please try again.');
        return;
    }

    localStorage.setItem(`reserved_${sanitizedData.email}`, 'true');
    setSubmitted(true);
    window.scrollTo(0,0);
  };

  if (submitted) {
      return (
          <div className="bg-dark-900 min-h-screen pt-32 flex items-center justify-center p-4">
              <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-dark-800 p-8 md:p-12 rounded-2xl border border-gray-800 text-center max-w-lg w-full"
              >
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">{t('res.success')}</h2>
                  <p className="text-gray-400 mb-8">{t('res.success.desc')}</p>
                  <Button onClick={() => window.location.href = '/'}>Return Home</Button>
              </motion.div>
          </div>
      );
  }

  return (
    <div className="bg-dark-900 min-h-screen pt-32 pb-16">
      <Section>
        <div className="max-w-2xl mx-auto">
            <FadeIn>
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                        <CalendarCheck className="text-orange-600 w-10 h-10" />
                        {t('res.title')}
                    </h1>
                    <p className="text-gray-400">{t('res.subtitle')}</p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm font-medium">
                        <AlertTriangle size={16} />
                        {t('res.limit.note')}
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.2}>
                <form onSubmit={handleSubmit} className="bg-dark-800 p-8 rounded-xl border border-gray-800 space-y-6 shadow-2xl">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-sm text-center">
                            {error.startsWith('res.') ? t(error) : error}
                        </div>
                    )}
                    <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" value={formData._honey} onChange={handleChange} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">{t('res.form.fullname')} <span className="text-orange-600">*</span></label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name} 
                                onChange={handleChange}
                                readOnly={!!testResultId}
                                className={`w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none transition-colors ${!!testResultId ? 'opacity-70 cursor-not-allowed' : 'focus:border-orange-600 focus:ring-1 focus:ring-orange-600'}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">{t('res.form.phone')} <span className="text-orange-600">*</span></label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone} 
                                onChange={handleChange}
                                readOnly={!!testResultId}
                                className={`w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none transition-colors ${!!testResultId ? 'opacity-70 cursor-not-allowed' : 'focus:border-orange-600 focus:ring-1 focus:ring-orange-600'}`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">{t('res.form.email')} <span className="text-orange-600">*</span></label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email} 
                            onChange={handleChange}
                            readOnly={!!testResultId}
                            className={`w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none transition-colors ${!!testResultId ? 'opacity-70 cursor-not-allowed' : 'focus:border-orange-600 focus:ring-1 focus:ring-orange-600'}`}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 relative">
                            <label className="text-sm font-medium text-gray-400">{t('res.form.course')} <span className="text-orange-600">*</span></label>
                            <div className="relative">
                                <div 
                                    onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
                                    className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus-within:border-orange-600 flex justify-between items-center cursor-pointer transition-colors hover:border-gray-500"
                                >
                                    <span className={formData.course ? "text-white truncate pr-2" : "text-gray-500 truncate pr-2"}>
                                       {formData.course || "Select a course..."}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${isCourseDropdownOpen ? "rotate-180" : ""}`} />
                                </div>
                                <AnimatePresence>
                                    {isCourseDropdownOpen && (
                                        <motion.ul 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute z-50 w-full mt-2 bg-dark-800 border border-gray-700 rounded-lg shadow-2xl shadow-black/50 overflow-y-auto max-h-[220px]"
                                        >
                                            {courses.map(c => (
                                                <li 
                                                    key={c.name}
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, course: c.name, level: '' }));
                                                        setIsCourseDropdownOpen(false);
                                                    }}
                                                    className={`p-3 text-sm cursor-pointer hover:bg-orange-600 hover:text-white transition-colors border-b border-gray-700/50 last:border-0 ${formData.course === c.name ? "bg-orange-600/20 text-orange-500" : "text-gray-300"}`}
                                                >
                                                    {c.name}
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <div className="space-y-2 relative">
                            <label className="text-sm font-medium text-gray-400">{t('res.form.level')} <span className="text-orange-600">*</span></label>
                            <div className="relative">
                                <div 
                                    onClick={() => formData.course && setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                                    className={`w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white flex justify-between items-center transition-colors ${!formData.course ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-500 focus-within:border-orange-600"}`}
                                >
                                    <span className={formData.level ? "text-white truncate pr-2" : "text-gray-500 truncate pr-2"}>
                                       {formData.level || (formData.course ? 'Select Level...' : 'Select Course First')}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${isLevelDropdownOpen ? "rotate-180" : ""}`} />
                                </div>
                                <AnimatePresence>
                                    {isLevelDropdownOpen && formData.course && (
                                        <motion.ul 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute z-50 w-full mt-2 bg-dark-800 border border-gray-700 rounded-lg shadow-2xl shadow-black/50 overflow-y-auto max-h-[220px]"
                                        >
                                            {availableLevels.map(lvl => (
                                                <li 
                                                    key={lvl}
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, level: lvl }));
                                                        setIsLevelDropdownOpen(false);
                                                    }}
                                                    className={`p-3 text-sm cursor-pointer hover:bg-orange-600 hover:text-white transition-colors border-b border-gray-700/50 last:border-0 ${formData.level === lvl ? "bg-orange-600/20 text-orange-500" : "text-gray-300"}`}
                                                >
                                                    {lvl}
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-400">{t('res.form.time')} <span className="text-orange-600">*</span></label>
                         <input 
                            type="text" 
                            name="time"
                            placeholder="e.g. Weekdays After 6PM, Saturday Morning"
                            value={formData.time} 
                            onChange={handleChange}
                            className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:border-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-600 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">{t('res.form.msg')}</label>
                        <textarea 
                            name="message"
                            rows={4}
                            value={formData.message} 
                            onChange={handleChange}
                            className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:border-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-600 transition-colors"
                        ></textarea>
                    </div>

                    <Button type="submit" className="w-full font-bold text-lg">{t('res.form.submit')}</Button>
                </form>
            </FadeIn>
        </div>
      </Section>
    </div>
  );
};

export default Reservation;