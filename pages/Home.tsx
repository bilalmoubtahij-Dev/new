import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Award, Users, Target, BookOpen, Languages, GraduationCap, Star, Quote, ChevronLeft, ChevronRight, PenTool } from 'lucide-react';
import { Section, FadeIn, Button } from '../components/ui/Layout';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  // Mock data for the carousel using the existing translation for the first one
  // and hardcoded values for the others to create the 3-card effect requested
  const testimonials = [
    {
      id: 1,
      text: t('home.quote'),
      author: t('home.quote.author'),
      role: t('home.quote.role'),
      rating: 5
    },
    {
      id: 2,
      text: "The academic support has been incredible. My understanding of complex math concepts has improved drastically thanks to the patient tutors.",
      author: "Yasmine Benali",
      role: "High School Student",
      rating: 5
    },
    {
      id: 3,
      text: "Highway Academy helped me achieve the IELTS score I needed for my university application abroad. Forever grateful!",
      author: "Omar Kabbaj",
      role: "IELTS Student",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
        nextSlide();
    }, 5000); // Slow time switch (5 seconds)
    return () => clearInterval(interval);
  }, [activeIndex]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getPosition = (index: number) => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex - 1 + testimonials.length) % testimonials.length) return 'left';
    if (index === (activeIndex + 1) % testimonials.length) return 'right';
    return 'hidden';
  };

  const getCardVariants = (position: string) => {
    const transition = { duration: 0.8, ease: "easeInOut" as const };
    const isMobile = window.innerWidth < 768; // Simple mobile check
    
    switch (position) {
      case 'center':
        return {
          x: '0%',
          scale: 1,
          opacity: 1,
          zIndex: 20,
          filter: 'blur(0px)',
          display: 'block',
          transition
        };
      case 'left':
        return {
          x: isMobile ? '0%' : '-50%', // On mobile, stack behind or fade out
          scale: isMobile ? 0.9 : 0.85,
          opacity: isMobile ? 0 : 0.5,
          zIndex: 10,
          filter: 'blur(1px)',
          display: isMobile ? 'none' : 'block',
          transition
        };
      case 'right':
        return {
          x: isMobile ? '0%' : '50%', // On mobile, stack behind or fade out
          scale: isMobile ? 0.9 : 0.85,
          opacity: isMobile ? 0 : 0.5,
          zIndex: 10,
          filter: 'blur(1px)',
          display: isMobile ? 'none' : 'block',
          transition
        };
      default:
        return {
          x: '0%',
          scale: 0.5,
          opacity: 0,
          zIndex: 0,
          display: 'none',
          transition
        };
    }
  };

  return (
    <div className="bg-dark-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] md:h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/classroom-bg.jpg" 
            alt="Students learning" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/90 via-dark-900/70 to-dark-900"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            {t('home.hero.title1')} <br />
            <span className="text-orange-600 block mt-2 md:inline md:mt-0">{t('home.hero.title2')}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed px-4"
          >
            {t('home.hero.desc')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          >
            <Link to="/programs" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">{t('home.explore')}</Button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">{t('nav.contact')}</Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Why Choose Us */}
      <Section className="bg-dark-900">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">{t('home.why.title')}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">{t('home.why.subtitle')}</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Brain, title: t('home.feature.tutors'), desc: t('home.feature.tutors.desc') },
            { icon: Award, title: t('home.feature.results'), desc: t('home.feature.results.desc') },
            { icon: Users, title: t('home.feature.support'), desc: t('home.feature.support.desc') },
            { icon: Target, title: t('home.feature.personal'), desc: t('home.feature.personal.desc') }
          ].map((feature, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="bg-dark-800 p-8 rounded-xl border border-gray-800 hover:border-orange-600/50 transition-colors h-full flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-orange-600/10 flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                  <feature.icon className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Path to Excellence */}
      <Section className="bg-dark-800/50">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">{t('home.path.title')}</h2>
            <p className="text-gray-400 text-sm md:text-base">{t('home.path.subtitle')}</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: BookOpen, 
              title: t('home.prog.academic'), 
              desc: t('home.prog.academic.desc'),
              points: ["Primary to University", "All Subjects", "Individual & Group Sessions"],
              tab: "academic"
            },
            { 
              icon: Languages, 
              title: t('home.prog.lang'), 
              desc: t('home.prog.lang.desc'),
              points: ["English & French", "All Levels (A1-C2)", "Conversation Practice"],
              tab: "language"
            },
            { 
              icon: GraduationCap, 
              title: t('home.prog.exam'), 
              desc: t('home.prog.exam.desc'),
              points: ["TOEFL & IELTS", "National Exams", "Mock Tests"],
              tab: "language"
            }
          ].map((program, idx) => (
            <FadeIn key={idx} delay={idx * 0.2}>
              <div className="bg-dark-900 rounded-xl p-8 border border-gray-800 h-full flex flex-col hover:border-orange-600/30 transition-all">
                <div className="w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center mb-6 mx-auto shadow-lg shadow-orange-900/30">
                  <program.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">{program.title}</h3>
                <p className="text-gray-400 text-center mb-8 text-sm leading-relaxed">{program.desc}</p>
                
                <Link to="/programs" state={{ tab: program.tab }} className="w-full mt-auto">
                    <Button variant="outline" className="w-full text-sm py-2">{t('home.learnMore')}</Button>
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* English Test CTA Section */}
      <Section className="py-8">
        <FadeIn>
            <div className="bg-dark-800 rounded-2xl p-8 md:p-12 text-center border border-gray-800 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600"></div>
                <div className="w-16 h-16 bg-dark-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-700">
                    <PenTool className="w-8 h-8 text-orange-600" />
                </div>
                
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">{t('home.test.title')}</h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-base md:text-lg">
                    {t('home.test.desc')}
                </p>
                
                <Link to="/test" className="inline-block w-full sm:w-auto">
                    <Button className="font-bold flex items-center justify-center mx-auto gap-2 w-full sm:w-auto">
                        {t('home.test.btn')} <PenTool size={18} />
                    </Button>
                </Link>
            </div>
        </FadeIn>
      </Section>

      {/* Testimonials */}
      <Section className="bg-dark-900 overflow-hidden">
        <div className="max-w-6xl mx-auto">
           <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">{t('home.testimonials.title')}</h2>
                <p className="text-gray-400 text-sm md:text-base">{t('home.testimonials.subtitle')}</p>
              </div>

              {/* Carousel Container */}
              <div className="relative h-[450px] md:h-[400px] flex items-center justify-center">
                <div className="absolute w-full h-full flex items-center justify-center perspective-1000">
                  {testimonials.map((testimonial, index) => {
                    const position = getPosition(index);
                    const variants = getCardVariants(position);
                    
                    return (
                      <motion.div
                        key={testimonial.id}
                        initial={false}
                        animate={variants}
                        className="absolute w-[90%] md:w-[65%] max-w-2xl px-4 md:px-0"
                      >
                         <div className="bg-dark-800 p-8 md:p-12 rounded-2xl border border-gray-800 relative shadow-2xl h-full flex flex-col justify-center">
                            <Quote className="absolute top-6 left-6 md:top-8 md:left-8 text-orange-600/20 w-12 h-12 md:w-16 md:h-16" />
                            <div className="flex space-x-1 mb-6 relative z-10">
                                {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-orange-600 fill-orange-600" />)}
                            </div>
                            <blockquote className="text-lg md:text-xl text-gray-200 italic mb-8 leading-relaxed font-light relative z-10">
                                "{testimonial.text}"
                            </blockquote>
                            <div className="relative z-10">
                                <cite className="not-italic text-white font-bold block text-lg">{testimonial.author}</cite>
                                <span className="text-orange-500 text-sm">{testimonial.role}</span>
                            </div>
                          </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Navigation Buttons */}
                <button 
                    onClick={prevSlide}
                    className="absolute left-2 md:left-4 z-30 p-2 bg-dark-800/80 rounded-full border border-gray-700 text-white hover:bg-orange-600 hover:border-orange-600 transition-all backdrop-blur-sm"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                    onClick={nextSlide}
                    className="absolute right-2 md:right-4 z-30 p-2 bg-dark-800/80 rounded-full border border-gray-700 text-white hover:bg-orange-600 hover:border-orange-600 transition-all backdrop-blur-sm"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              
              {/* Pagination Dots */}
              <div className="flex justify-center space-x-3 mt-8">
                  {testimonials.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`transition-all duration-300 rounded-full ${
                            idx === activeIndex ? 'w-8 h-2 bg-orange-600' : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
                        }`}
                    />
                  ))}
              </div>
           </FadeIn>
        </div>
      </Section>
    </div>
  );
};

export default Home;