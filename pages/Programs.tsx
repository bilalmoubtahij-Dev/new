import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Users, Award } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { Section, FadeIn, Button } from '../components/ui/Layout';
import { useLanguage } from '../context/LanguageContext';

const Programs = () => {
  const [activeTab, setActiveTab] = useState<'language' | 'academic'>('language');
  const { t, language } = useLanguage();
  const location = useLocation();
  const highlightId = location.state?.highlight;
  const testLevel = location.state?.testLevel;
  const testResultId = (location.state as any)?.testResultId;

  useEffect(() => {
    if (location.state && (location.state as any).tab) {
      setActiveTab((location.state as any).tab);
    }
  }, [location]);

  const languageCourses = [
    {
      id: 'general-english',
      title: t('programs.course.gen_eng.title'),
      reservationName: 'General English',
      level: "A1 - C2",
      desc: t('programs.course.gen_eng.desc'),
      features: [
        t('programs.course.gen_eng.f1'),
        t('programs.course.gen_eng.f2'),
        t('programs.course.gen_eng.f3'),
        t('programs.course.gen_eng.f4')
      ]
    },
    {
      title: t('programs.course.bus_eng.title'),
      reservationName: 'Business English',
      level: "B1 - C2",
      desc: t('programs.course.bus_eng.desc'),
      features: [
        t('programs.course.bus_eng.f1'),
        t('programs.course.bus_eng.f2'),
        t('programs.course.bus_eng.f3'),
        t('programs.course.bus_eng.f4')
      ]
    },
    {
      title: t('programs.course.toefl.title'),
      reservationName: 'TOEFL Preparation',
      level: "B2 - C2",
      desc: t('programs.course.toefl.desc'),
      features: [
        t('programs.course.toefl.f1'),
        t('programs.course.toefl.f2'),
        t('programs.course.toefl.f3'),
        t('programs.course.toefl.f4')
      ]
    },
    {
      title: t('programs.course.ielts.title'),
      reservationName: 'IELTS Preparation',
      level: "B2 - C2",
      desc: t('programs.course.ielts.desc'),
      features: [
        t('programs.course.ielts.f1'),
        t('programs.course.ielts.f2'),
        t('programs.course.ielts.f3'),
        t('programs.course.ielts.f4')
      ]
    },
    {
      title: t('programs.course.french.title'),
      reservationName: 'French Language',
      level: "A1 - C2",
      desc: t('programs.course.french.desc'),
      features: [
        t('programs.course.french.f1'),
        t('programs.course.french.f2'),
        t('programs.course.french.f3'),
        t('programs.course.french.f4')
      ]
    },
    {
      title: t('programs.course.arabic.title'),
      reservationName: 'Arabic Reading & Writing',
      level: t('programs.course.arabic.level'),
      desc: t('programs.course.arabic.desc'),
      features: [
        t('programs.course.arabic.f1'),
        t('programs.course.arabic.f2'),
        t('programs.course.arabic.f3'),
        t('programs.course.arabic.f4')
      ]
    }
  ];

  const academicCourses = [
    {
      title: t('programs.course.primary.title'),
      level: t('programs.course.primary.level'),
      desc: t('programs.course.primary.desc'),
      features: language === 'ar' ? [
        'الرياضيات', 'العربية', 'الفرنسية', 'الإنجليزية'
      ] : [
        'Mathematics', 'Arabic', 'French', 'English'
      ]
    },
    {
      title: t('programs.course.middle.title'),
      level: t('programs.course.middle.level'),
      desc: t('programs.course.middle.desc'),
      features: language === 'ar' ? [
        'الفرنسية', 'الإنجليزية', 'الفيزياء', 'العلوم', 'الرياضيات'
      ] : [
        'French', 'English', 'Physics', 'Science', 'Mathematics'
      ]
    },
    {
      title: t('programs.course.high.title'),
      level: t('programs.course.high.level'),
      desc: t('programs.course.high.desc'),
      features: language === 'ar' ? [
        'الإنجليزية', 'العربية', 'الفرنسية', 'الفلسفة', 'الفيزياء والكيمياء', 'علوم الحياة والأرض', 'الرياضيات', 'التاريخ والجغرافيا', 'التربية الإسلامية', 'الاقتصاد والتدبير', 'التكنولوجيا'
      ] : [
        'English', 'Arabic', 'French', 'Philosophy', 'Physics & Chemistry', 'Biology', 'Mathematics', 'History & Geography', 'Islamic Studies', 'Economics & Management', 'Technology'
      ]
    },
    {
      title: language === 'ar' ? 'الدعم الجامعي' : 'University Support',
      level: language === 'ar' ? 'الإجازة والدراسات العليا' : 'Undergraduate & Postgraduate',
      desc: language === 'ar' ? 'دروس خصوصية وتوجيه أكاديمي لطلاب الجامعات عبر مختلف التخصصات.' : 'Specialized tutoring and academic guidance for university students across various disciplines.',
      features: language === 'ar' ? [
        'الإنجليزية', 'الفرنسية', 'البيولوجيا', 'الكيمياء', 'الفيزياء', 'الاقتصاد', 'منهجية البحث', 'إنجليزية الأعمال', 'مهارات العرض'
      ] : [
        'English', 'French', 'Biology', 'Chemistry', 'Physics', 'Economics', 'Research Writing', 'Business English', 'Presentation Skills'
      ]
    }
  ];

  const courses = activeTab === 'language' ? languageCourses : academicCourses;

  return (
    <div className="bg-dark-900 min-h-screen pt-20">
      <div className="bg-dark-800 py-16 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold text-white mb-4"
        >
          {t('programs.title')}
        </motion.h1>
        <p className="text-gray-400 max-w-2xl mx-auto">{t('programs.subtitle')}</p>
      </div>

      <Section>
        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-dark-800 p-1 rounded-lg flex flex-col sm:flex-row border border-gray-700 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('language')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all w-full sm:w-auto ${activeTab === 'language' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
            >
              {t('programs.tab.lang')}
            </button>
            <button
              onClick={() => setActiveTab('academic')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all w-full sm:w-auto ${activeTab === 'academic' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
            >
              {t('programs.tab.academic')}
            </button>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course: any, idx) => {
            const isHighlighted = !!highlightId && highlightId === course.id;
            return (
              <FadeIn key={course.title} delay={idx * 0.1} className="h-full">
                <div className={`bg-dark-800 rounded-xl p-6 md:p-8 border transition-all group h-full relative flex flex-col ${isHighlighted ? 'border-orange-500 shadow-2xl shadow-orange-600/20 ring-2 ring-orange-500 scale-[1.02] z-10' : 'border-gray-800 hover:border-orange-600/30'
                  }`}>
                  {isHighlighted && (
                    <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce shadow-lg">
                      Recommended
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-orange-500 transition-colors pr-2">{course.title}</h3>
                    <span className="bg-orange-600 text-white text-[10px] md:text-xs px-2 py-1 rounded font-bold whitespace-nowrap" dir="ltr">{course.level}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-6 h-auto min-h-[48px]">{course.desc}</p>

                  <div className="space-y-4 mb-8">
                    <h4 className="text-orange-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-orange-500"></span> {activeTab === 'academic' ? (language === 'ar' ? 'المواد المشمولة:' : "What's Included:") : t('programs.features')}
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {course.features.map((feat: string, i: number) => (
                        <li key={i} className="flex items-center text-gray-400 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mr-2 shrink-0 rtl:ml-2 rtl:mr-0"></div>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto pt-6 border-t border-gray-800 flex flex-col justify-end">
                    <Link to="/reservation" state={{ autoCourse: course.reservationName || course.title, autoLevel: testLevel, testResultId }} className="w-full">
                      <Button className="w-full text-sm font-bold shadow-lg shadow-orange-600/10 hover:shadow-orange-600/20">Reserve This Course</Button>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </Section>

      {/* Features Row */}
      <Section className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FadeIn delay={0.2}>
            <div className="bg-dark-800/50 p-8 rounded-xl border border-gray-800 text-center">
              <Clock className="w-10 h-10 text-orange-600 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">{t('programs.flexible')}</h3>
              <p className="text-gray-400 text-sm">{t('programs.flexible.desc')}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="bg-dark-800/50 p-8 rounded-xl border border-gray-800 text-center">
              <Users className="w-10 h-10 text-orange-600 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">{t('programs.size')}</h3>
              <p className="text-gray-400 text-sm">{t('programs.size.desc')}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="bg-dark-800/50 p-8 rounded-xl border border-gray-800 text-center">
              <Award className="w-10 h-10 text-orange-600 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">{t('programs.certified')}</h3>
              <p className="text-gray-400 text-sm">{t('programs.certified.desc')}</p>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <div className="bg-gradient-to-r from-dark-800 to-dark-900 border border-gray-800 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t('programs.cta.title')}</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">{t('programs.cta.desc')}</p>
          <Link to="/contact">
            <Button variant="outline">{t('programs.cta.btn')}</Button>
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default Programs;