import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  isButton?: boolean;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Program {
  title: string;
  level?: string; // e.g., A1-C2
  description: string;
  features: string[];
  category: 'language' | 'academic';
}

export interface Testimonial {
  text: string;
  author: string;
  role: string;
  rating: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  type: 'Upcoming' | 'Concluded';
  category: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email: string;
  course: string;
  level: string;
  time: string;
  message?: string;
  date: string; // ISO date string of submission
  status: 'Pending' | 'Contacted' | 'Deal Closed' | 'Lost';
}