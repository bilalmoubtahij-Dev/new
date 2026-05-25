import React from 'react';
import { motion } from 'framer-motion';
import { Section, FadeIn } from '../components/ui/Layout';
import { useLanguage } from '../context/LanguageContext';

const News = () => {
  const { t } = useLanguage();

  const events = [
    {
      title: t('news.event1.title'),
      type: t('news.event1.type'),
      image: "/images/summer-intensive.jpg",
      category: t('news.event1.category'),
      desc: t('news.event1.desc')
    },
    {
      title: t('news.event2.title'),
      type: t('news.event2.type'),
      image: "/images/conversation-clubs.jpg",
      category: t('news.event2.category'),
      desc: t('news.event2.desc')
    },
    {
      title: t('news.event3.title'),
      type: t('news.event3.type'),
      image: "/images/PUBLIC-SPEAKING.jpg",
      category: t('news.event3.category'),
      desc: t('news.event3.desc')
    },
    {
      title: t('news.event4.title'),
      type: t('news.event4.type'),
      image: "/images/IELTS.jpg",
      category: t('news.event4.category'),
      desc: t('news.event4.desc')
    },
    {
      title: t('news.event5.title'),
      type: t('news.event5.type'),
      image: "/images/university-prep.jpg",
      category: t('news.event5.category'),
      desc: t('news.event5.desc')
    },
    {
      title: t('news.event6.title'),
      type: t('news.event6.type'),
      image: "/images/SEMINAR.jpeg",
      category: t('news.event6.category'),
      desc: t('news.event6.desc')
    }
  ];

  return (
    <div className="bg-dark-900 min-h-screen pt-20">
      <div className="bg-dark-800 py-16 text-center px-4">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
            {t('news.title')}
        </motion.h1>
        <p className="text-gray-400">{t('news.subtitle')}</p>
      </div>

      <Section>
        <p className="text-gray-400 mb-8">{t('news.intro')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                    <div className="bg-dark-800 rounded-xl overflow-hidden border border-gray-800 group hover:border-orange-600/30 transition-all h-full flex flex-col">
                        <div className="relative h-48 overflow-hidden">
                            <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full z-10 ${
                                event.type === 'Upcoming' || event.type === 'قادم' ? 'bg-orange-600 text-white' : 'bg-gray-600 text-gray-200'
                            }`}>
                                {event.type}
                            </span>
                            <img 
                                src={event.image} 
                                alt={event.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60"></div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-4">
                                <span className="text-orange-500 text-xs font-bold border border-orange-500/30 px-2 py-1 rounded-full">{event.category}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors">{event.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">{event.desc}</p>
                        </div>
                    </div>
                </FadeIn>
            ))}
        </div>
      </Section>
    </div>
  );
};

export default News;