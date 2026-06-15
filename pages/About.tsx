import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart } from 'lucide-react';
import { Section, FadeIn } from '../components/ui/Layout';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-dark-900 min-h-screen pt-20">
      
      {/* Header */}
      <div className="bg-dark-800 py-20 text-center px-4">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
            {t('about.title')}
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-3xl mx-auto text-lg"
        >
            {t('about.subtitle')}
        </motion.p>
      </div>

      {/* Mission & Vision */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn>
                <div className="bg-dark-800 p-8 rounded-xl border border-gray-800 h-full text-center">
                    <div className="w-16 h-16 mx-auto bg-orange-600/10 rounded-full flex items-center justify-center mb-6">
                        <Target className="w-8 h-8 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">{t('about.mission')}</h2>
                    <p className="text-gray-400 leading-relaxed">
                        {t('about.mission.desc')}
                    </p>
                </div>
            </FadeIn>
            <FadeIn delay={0.2}>
                <div className="bg-dark-800 p-8 rounded-xl border border-gray-800 h-full text-center">
                    <div className="w-16 h-16 mx-auto bg-orange-600/10 rounded-full flex items-center justify-center mb-6">
                        <Eye className="w-8 h-8 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">{t('about.vision')}</h2>
                    <p className="text-gray-400 leading-relaxed">
                        {t('about.vision.desc')}
                    </p>
                </div>
            </FadeIn>
        </div>
      </Section>

      {/* About Content */}
      <Section className="py-8 pt-0">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-gray-300 space-y-6 leading-relaxed bg-dark-800/30 p-8 md:p-12 rounded-2xl border border-gray-800/50">
                <h2 className="text-3xl font-bold text-white text-center mb-8">{t('about.title')}</h2>
                <p>{t('about.content.1')}</p>
                <p>{t('about.content.2')}</p>
                <p>{t('about.content.3')}</p>
            </div>
          </FadeIn>
      </Section>

      {/* Founder Section */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
                <div className="space-y-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">{t('about.founder.title')}</h2>
                    </div>
                    
                    <div className="w-12 h-12 bg-orange-600/10 rounded-lg flex items-center justify-center border border-orange-600/30">
                        <Heart className="w-6 h-6 text-orange-600" />
                    </div>

                    <blockquote className="text-xl text-orange-500 font-medium italic border-l-4 border-orange-600 pl-6 py-2">
                        "{t('about.founder.quote')}"
                    </blockquote>

                    <p className="text-gray-400">{t('about.founder.desc1')}</p>
                    <p className="text-gray-400">{t('about.founder.desc2')}</p>
                </div>
            </FadeIn>
            
            <FadeIn delay={0.3} className="flex justify-center">
                <div className="bg-white p-4 pb-16 rotate-2 shadow-2xl max-w-md w-full relative group hover:rotate-0 transition-transform duration-500">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-32 h-8 bg-orange-600/20 backdrop-blur-sm transform -rotate-2"></div>
                     <img 
                        src="/images/mr-driss.jpg" 
                        alt="Mr. Driss" 
                        className="w-full h-[500px] object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                    />
                     <div className="absolute bottom-4 left-0 w-full text-center">
                        <h3 className="font-handwriting text-2xl font-bold text-gray-900">Mr. Driss</h3>
                        <p className="text-orange-600 font-medium text-sm">{t('about.founder.role')}</p>
                        <p className="text-gray-500 text-xs mt-1">{t('about.founder.exp')}</p>
                     </div>
                </div>
            </FadeIn>
        </div>
      </Section>
    </div>
  );
};

export default About;