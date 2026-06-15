import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, CalendarDays } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Close dropdown on click outside
    const handleClickOutside = (e: MouseEvent) => {
        if (!(e.target as Element).closest('.nav-dropdown-container')) {
            setActiveDropdown(null);
        }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null); // Close dropdown on navigation
  }, [location]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.programs'), path: '/programs', hasDropdown: true },
    { name: t('nav.news'), path: '/news' },
  ];

  return (
    <>
      <nav className={`fixed w-full z-[100] transition-all duration-300 border-b border-transparent ${isScrolled || isOpen ? 'bg-[#0f0f0f]/95 backdrop-blur-md border-white/5 py-3' : 'bg-transparent py-4 md:py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center relative">
            
            {/* 1. Logo */}
            <div className="flex-shrink-0 z-50">
              <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                 <img 
                  src="/images/logo.png" 
                  alt="Highway Academy" 
                  className="h-16 md:h-20 lg:h-24 w-auto object-contain transition-all duration-300"
                 />
              </Link>
            </div>

            {/* 2. Center: Pill Navigation (Hidden on mobile & tablet) */}
            <div className="hidden lg:flex items-center justify-center absolute left-0 right-0 pointer-events-none">
              <div className="pointer-events-auto bg-[#1a1a1a] border border-white/5 rounded-full p-1.5 flex items-center shadow-2xl shadow-black/50 backdrop-blur-sm relative">
                  {navLinks.map((link) => {
                      const isActive = location.pathname === link.path || (link.path === '/programs' && location.pathname.startsWith('/programs'));
                      const isDropdownOpen = activeDropdown === link.path;

                      if (link.hasDropdown) {
                          return (
                              <div key={link.path} className="relative nav-dropdown-container">
                                  <button
                                      onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setActiveDropdown(isDropdownOpen ? null : link.path);
                                      }}
                                      className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
                                          isActive || isDropdownOpen
                                              ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                                              : 'text-gray-300 hover:text-white hover:bg-white/5'
                                      }`}
                                  >
                                      {link.name}
                                      <ChevronDown 
                                          size={14} 
                                          className={`mt-0.5 opacity-70 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                      />
                                  </button>
                                  
                                  {/* Dropdown Menu */}
                                  <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div 
                                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                          transition={{ duration: 0.2 }}
                                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl py-2 flex flex-col overflow-hidden z-50 origin-top"
                                        >
                                            <Link 
                                                to="/programs" 
                                                state={{ tab: 'language' }}
                                                onClick={() => setActiveDropdown(null)}
                                                className="px-6 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white text-left transition-colors flex items-center justify-between group"
                                            >
                                                {t('programs.tab.lang')}
                                            </Link>
                                            <div className="h-px bg-white/5 mx-4"></div>
                                            <Link 
                                                to="/programs" 
                                                state={{ tab: 'academic' }}
                                                onClick={() => setActiveDropdown(null)}
                                                className="px-6 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white text-left transition-colors flex items-center justify-between group"
                                            >
                                                {t('programs.tab.academic')}
                                            </Link>
                                        </motion.div>
                                    )}
                                  </AnimatePresence>
                              </div>
                          );
                      }

                      return (
                          <Link
                              key={link.name}
                              to={link.path}
                              className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
                                  isActive 
                                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                              }`}
                          >
                              {link.name}
                          </Link>
                      );
                  })}
              </div>
            </div>

            {/* 3. Right: Buttons + Mobile Menu */}
            <div className="flex items-center gap-2 md:gap-3 z-50">
               {/* Reserve Button - Responsive (Text visible on mobile now) */}
               <Link to="/reservation">
                <button className="bg-white/10 hover:bg-white/20 text-orange-500 border border-orange-600/30 hover:border-orange-500 px-3 py-2 lg:px-5 lg:py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-2">
                  <CalendarDays size={16} className="md:w-[18px] md:h-[18px]" />
                  <span>{t('nav.reserve')}</span>
                </button>
              </Link>

              <Link to="/contact" className="hidden lg:block">
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-orange-900/20 active:scale-95">
                  {t('nav.contact')}
                </button>
              </Link>

              {/* Mobile/Tablet Menu Button */}
              <button 
                  className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Toggle menu"
              >
                  {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 bg-dark-900 z-[90] lg:hidden flex flex-col pt-28 pb-10 px-6 overflow-y-auto h-[100dvh]"
          >
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <div key={link.name} className="border-b border-gray-800/50 last:border-0">
                        {/* Always render as simple Link on mobile/tablet */}
                        <Link
                            to={link.path}
                            className={`text-xl font-medium flex items-center justify-between w-full py-6 ${
                            location.pathname === link.path || (link.path === '/programs' && location.pathname.startsWith('/programs')) ? 'text-orange-500' : 'text-gray-200'
                            }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                  </div>
                ))}
                 
                 <div className="pt-8 space-y-4">
                    <Link 
                        to="/contact"
                        className="bg-orange-600 text-white text-center py-4 rounded-xl font-bold block w-full shadow-lg shadow-orange-900/20 active:scale-95 transition-transform"
                        onClick={() => setIsOpen(false)}
                    >
                        {t('nav.contactUs')}
                    </Link>
                </div>

                {/* Mobile Language Switcher */}
                <div className="pt-8 mt-auto flex justify-center gap-4 pb-10">
                    <button 
                        onClick={() => setLanguage('en')}
                        className={`flex-1 py-3 rounded-lg font-bold text-sm border transition-all ${
                            language === 'en' 
                            ? 'bg-orange-600 border-orange-600 text-white' 
                            : 'bg-dark-800 border-gray-700 text-gray-400'
                        }`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => setLanguage('ar')}
                        className={`flex-1 py-3 rounded-lg font-bold text-sm border transition-all ${
                            language === 'ar' 
                            ? 'bg-orange-600 border-orange-600 text-white' 
                            : 'bg-dark-800 border-gray-700 text-gray-400'
                        }`}
                    >
                        العربية
                    </button>
                </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;