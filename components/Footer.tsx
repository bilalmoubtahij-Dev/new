import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, GraduationCap, MapPin, Phone, Mail, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-dark-900 border-t border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <img 
                  src="/images/logo.png" 
                  alt="Highway Academy" 
                  className="h-14 w-auto object-contain"
                />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/highwayacademy/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com/highwayacademyFez?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {[
                { label: t('nav.about'), path: '/about' },
                { label: t('nav.programs'), path: '/programs' },
                { label: t('nav.news'), path: '/news' },
                { label: t('nav.contact'), path: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-2">
            <h3 className="text-white font-semibold mb-6">{t('footer.contactInfo')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <span>Montfleuri & Narjiss<br/>Fez, Morocco</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone className="w-5 h-5 text-orange-600 shrink-0" />
                <span>+212 535765701 - Montfleuri</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone className="w-5 h-5 text-orange-600 shrink-0" />
                <span>+212 535614990 - Narjiss</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail className="w-5 h-5 text-orange-600 shrink-0" />
                <span>highwayaca@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>{t('footer.rights')}</p>
          <Link to="/admin" className="mt-4 md:mt-0 opacity-20 hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
             <Lock size={12} /> Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;