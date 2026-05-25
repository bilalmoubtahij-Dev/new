import React from 'react';
import { motion } from 'framer-motion';

export const Section = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <section className={`py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto ${className}`}>
    {children}
  </section>
);

export const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = "", 
  onClick,
  type = "button",
  disabled = false
}: { 
  children: React.ReactNode, 
  variant?: 'primary' | 'outline' | 'ghost', 
  className?: string,
  onClick?: () => void,
  type?: "button" | "submit" | "reset",
  disabled?: boolean
}) => {
  const baseStyles = "px-6 py-3 rounded-md font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  const variants = {
    primary: "bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-900/20",
    outline: "border-2 border-orange-600 text-white hover:bg-orange-600/10",
    ghost: "text-gray-300 hover:text-white hover:bg-white/5"
  };

  return (
    <button 
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
