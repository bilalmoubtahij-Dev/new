import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { Section, FadeIn, Button } from '../components/ui/Layout';
import { useLanguage } from '../context/LanguageContext';
import { sanitizeInput } from '../utils/sanitize';
import { supabase } from '../utils/supabase';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-800 rounded-lg overflow-hidden bg-dark-800">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
                <span className="text-white font-medium text-sm md:text-base">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {isOpen && (
                <div className="px-6 py-4 border-t border-gray-800 bg-dark-900/50">
                    <p className="text-gray-400 text-sm leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
};

const Contact = () => {
  const [activeLoc, setActiveLoc] = useState<'montfleuri' | 'narjiss'>('montfleuri');
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', _honey: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    
    const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        subject: sanitizeInput(formData.subject),
        message: sanitizeInput(formData.message)
    };

    try {
      const { error } = await supabase.from('contacts').insert([
        {
          name: sanitizedData.name,
          email: sanitizedData.email,
          subject: sanitizedData.subject,
          message: sanitizedData.message,
          status: 'Unread'
        }
      ]);

      if (error) {
        console.error('Supabase error:', error);
        setFormError('Failed to send message. Please try again later.');
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error('Network error:', err);
      setFormError('Network error. Please try again.');
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setSubmitted(true);
  };

  const faqs = language === 'ar' ? [
    { q: "ما هي المواد التي تدرسونها؟", a: "نقدم دروس تقوية شاملة في جميع المواد من المدرسة الابتدائية إلى المرحلة الجامعية، بما في ذلك الرياضيات والعلوم واللغات والأدب والدورات المتخصصة للتحضير للامتحانات." },
    { q: "ما هو حجم فصولكم؟", a: "نحافظ على فصول دراسية صغيرة الحجم بحد أقصى 18 طالبًا في كل فصل لضمان الاهتمام الشخصي والتعلم الفعال لكل طالب." },
    { q: "هل تقدمون دروساً خصوصية فردية؟", a: "نعم، نحن نقدم كلاً من الفصول الجماعية وجلسات التدريس الفردية الخاصة بناءً على احتياجاتك وتفضيلاتك الخاصة." },
    { q: "ما هي ساعات عملكم؟", a: "نحن نفتح أبوابنا من الاثنين إلى السبت من الساعة 9:00 صباحًا حتى 11:00 مساءً، مع خيارات جدولة مرنة تشمل الفصول الصباحية والمسائية والليلية." },
    { q: "كيف يمكنني التسجيل في دورة؟", a: "يمكنك التسجيل بزيارة أي من مواقعنا، أو الاتصال بنا مباشرة، أو ملء نموذج الاتصال في هذه الصفحة. سنقوم بتحديد موعد استشارة لمناقشة أهدافك والتوصية بأفضل برنامج." },
    { q: "هل تحضرون الطلاب للامتحانات الدولية؟", a: "نعم، نقدم دورات تحضيرية متخصصة لاختبارات TOEFL و IELTS و DELF و DALF وغيرها من اختبارات إتقان اللغة الدولية." },
    { q: "ما الذي يجعل أكاديمية هاي واي مختلفة؟", a: "نهجنا المخصص ومدربونا ذوو الخبرة والفصول الصغيرة وسجلنا الحافل بنجاح الطلاب هو ما يميزنا. نحن نركز على أسلوب التعلم الفردي وأهداف كل طالب." },
    { q: "هل هناك أي قيود عمرية؟", a: "نرحب بالطلاب من جميع الأعمار، من أطفال المدارس الابتدائية إلى طلاب الجامعات والمهنيين العاملين الذين يتطلعون إلى تعزيز مهاراتهم." }
  ] : [
    { q: "What subjects do you teach?", a: "We offer comprehensive tutoring across all subjects from primary school to university level, including Mathematics, Sciences, Languages, Literature, and specialized exam preparation courses." },
    { q: "What are your class sizes?", a: "We maintain small class sizes with a maximum of 18 students per class to ensure personalized attention and effective learning for each student." },
    { q: "Do you offer individual tutoring?", a: "Yes, we offer both group classes and individual one-on-one tutoring sessions based on your specific needs and preferences." },
    { q: "What are your operating hours?", a: "We are open Monday to Saturday from 9:00 AM to 11:00 PM, with flexible scheduling options including morning, afternoon, and evening classes." },
    { q: "How do I enroll in a course?", a: "You can enroll by visiting either of our locations, calling us directly, or filling out the contact form on this page. We'll schedule a consultation to discuss your goals and recommend the best program." },
    { q: "Do you prepare students for international exams?", a: "Yes, we offer specialized preparation courses for TOEFL, IELTS, DELF, DALF, and other international language proficiency exams." },
    { q: "What makes Highway Academy different?", a: "Our personalized approach, experienced instructors, small class sizes, and proven track record of student success set us apart. We focus on each student's individual learning style and goals." },
    { q: "Are there any age restrictions?", a: "We welcome students of all ages, from primary school children to university students and working professionals looking to enhance their skills." }
  ];

  return (
    <div className="bg-dark-900 min-h-screen pt-20">
      <div className="bg-dark-800 py-16 text-center px-4">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
            {t('contact.title')}
        </motion.h1>
        <p className="text-gray-400">{t('contact.subtitle')}</p>
      </div>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column: Info */}
            <FadeIn>
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-orange-600 pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4">{t('contact.getInTouch')}</h2>
                        <div className="bg-dark-800 p-6 rounded-xl border border-gray-800 space-y-6">
                            
                            <div>
                                <h3 className="text-orange-500 font-bold mb-3 flex items-center gap-2">
                                    <MapPin className="w-5 h-5" /> Highway Academy Montfleuri
                                </h3>
                                <p className="text-gray-300 text-sm leading-relaxed mb-2">Montfleuri, Fez, Morocco</p>
                                <p className="text-gray-400 text-xs">2nd Floor, Near Imperial Cafe</p>
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-300">
                                    <Phone className="w-4 h-4 text-orange-600" /> +212 535765701
                                </div>
                                <a href="https://www.google.com/maps?q=34.00595865995687,-4.984858206671568" target="_blank" rel="noopener noreferrer" className="text-orange-500 text-xs mt-2 inline-block underline hover:text-orange-400">{t('contact.viewMap')}</a>
                            </div>

                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="text-orange-500 font-bold mb-3 flex items-center gap-2">
                                    <MapPin className="w-5 h-5" /> Highway Academy Narjiss
                                </h3>
                                <p className="text-gray-300 text-sm leading-relaxed mb-2">Narjiss, Fez, Morocco</p>
                                <p className="text-gray-400 text-xs">Narjiss Avenue, near Pharmacy</p>
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-300">
                                    <Phone className="w-4 h-4 text-orange-600" /> +212 535614990
                                </div>
                                <a href="https://www.google.com/maps?q=34.008281113881154,-4.969071282883572" target="_blank" rel="noopener noreferrer" className="text-orange-500 text-xs mt-2 inline-block underline hover:text-orange-400">{t('contact.viewMap')}</a>
                            </div>

                        </div>
                    </div>

                    <div className="bg-dark-800 p-6 rounded-xl border border-gray-800">
                        <h3 className="text-white font-bold mb-4">{t('contact.general')}</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Mail className="w-5 h-5 text-orange-600" /> info@highwayacademy.ma
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Clock className="w-5 h-5 text-orange-600" /> Monday - Saturday: 9:00 AM - 11:00 PM
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Right Column: Locations & Form */}
            <div className="space-y-8">
                
                {/* Map Toggle */}
                <FadeIn delay={0.2}>
                    <div className="bg-dark-800 rounded-xl border border-gray-800 overflow-hidden">
                        <div className="flex border-b border-gray-700">
                            <button 
                                onClick={() => setActiveLoc('montfleuri')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                                    activeLoc === 'montfleuri' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                Montfleuri
                            </button>
                            <button 
                                onClick={() => setActiveLoc('narjiss')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                                    activeLoc === 'narjiss' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                Narjiss
                            </button>
                        </div>
                        <div className="h-64 bg-gray-700 relative">
                             {/* Mock Map Image */}
                             <img 
                                src="/images/contact-location.jpg" 
                                className="w-full h-full object-cover opacity-50" 
                                alt="Map location"
                             />
                             <div className="absolute inset-0 flex items-center justify-center">
                                <a href={activeLoc === 'montfleuri' ? "https://www.google.com/maps?q=34.00595865995687,-4.984858206671568" : "https://www.google.com/maps?q=34.008281113881154,-4.969071282883572"} target="_blank" rel="noopener noreferrer" className="text-center group cursor-pointer hover:scale-110 transition-transform">
                                    <MapPin className="w-10 h-10 text-orange-600 mx-auto drop-shadow-lg group-hover:text-orange-500" />
                                    <span className="text-white font-bold drop-shadow-md group-hover:text-orange-500">{t('contact.openMap')}</span>
                                </a>
                             </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Contact Form */}
                <FadeIn delay={0.3}>
                    <div id="contact-form" className="bg-dark-800 p-8 rounded-xl border border-gray-800 scroll-mt-24">
                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center text-center py-6 space-y-4"
                            >
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                                <p className="text-gray-400 text-sm">Thank you for reaching out. We'll get back to you shortly.</p>
                                <button
                                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                                    className="text-orange-500 text-sm underline hover:text-orange-400"
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                <h3 className="text-white font-bold mb-6">{t('contact.sendMessage')}</h3>
                                {formError && (
                                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center mb-4">
                                        {formError}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" value={formData._honey} onChange={handleChange} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-400 text-xs mb-1">{t('contact.form.name')}</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-dark-900 border border-gray-700 rounded-md p-3 text-white text-sm focus:border-orange-600 focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-xs mb-1">{t('contact.form.email')}</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-dark-900 border border-gray-700 rounded-md p-3 text-white text-sm focus:border-orange-600 focus:outline-none transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-xs mb-1">{t('contact.form.subject')}</label>
                                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-dark-900 border border-gray-700 rounded-md p-3 text-white text-sm focus:border-orange-600 focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-xs mb-1">{t('contact.form.message')}</label>
                                        <textarea name="message" rows={4} value={formData.message} onChange={handleChange} className="w-full bg-dark-900 border border-gray-700 rounded-md p-3 text-white text-sm focus:border-orange-600 focus:outline-none transition-colors"></textarea>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? 'Sending...' : t('contact.form.btn')}
                                    </Button>
                                </form>
                            </>
                        )}
                    </div>
                </FadeIn>
            </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-dark-900/50 pt-0">
          <div className="max-w-3xl mx-auto">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">{t('contact.faq.title')}</h2>
                <p className="text-gray-400">{t('contact.faq.subtitle')}</p>
             </div>
             <div className="space-y-4">
                {faqs.map((item, idx) => (
                    <FadeIn key={idx} delay={0.4 + (idx * 0.1)}>
                        <FAQItem question={`Q: ${item.q}`} answer={item.a} />
                    </FadeIn>
                ))}
             </div>
             <div className="text-center mt-12">
                 <p className="text-gray-400 mb-4">{t('contact.stillQuestions')}</p>
                 <Button onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
                     {t('contact.contactDirect')}
                 </Button>
             </div>
          </div>
      </Section>
    </div>
  );
};

export default Contact;