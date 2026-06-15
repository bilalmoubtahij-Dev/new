import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="hidden md:flex fixed bottom-10 right-8 z-50 items-center gap-3" dir="ltr">
      <button 
        onClick={() => setLanguage('en')}
        className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border ${
            language === 'en' 
            ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-900/30' 
            : 'bg-[#1a1a1a] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
        }`}
      >
        EN
      </button>
      <button 
        onClick={() => setLanguage('ar')}
        className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border ${
            language === 'ar' 
            ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-900/30' 
            : 'bg-[#1a1a1a] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
        }`}
      >
        عربي
      </button>
    </div>
  );
};

export default LanguageSelector;