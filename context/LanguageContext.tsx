import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.programs': 'Programs',
    'nav.news': 'News & Events',
    'nav.contact': 'Contact',
    'nav.contactUs': 'Contact Us',
    'nav.reserve': 'Reserve Now',

    // Home
    'home.hero.title1': 'Learning today...',
    'home.hero.title2': 'Leading tomorrow.',
    'home.hero.desc': "Highway Academy Fez - Morocco's premier private education center. Expert language courses (English, French), IELTS/TOEFL preparation, and academic support from primary to university level.",
    'home.explore': 'Explore Our Programs',
    'home.why.title': 'Why Choose Highway Academy?',
    'home.why.subtitle': 'We combine expertise, innovation, and personalized attention to create the perfect learning environment.',
    'home.feature.tutors': 'Expert Tutors',
    'home.feature.tutors.desc': 'Learn from the best minds in Fez, dedicated to your growth.',
    'home.feature.results': 'Proven Results',
    'home.feature.results.desc': 'Track record of academic excellence and student achievement.',
    'home.feature.support': 'Supportive Environment',
    'home.feature.support.desc': 'Collaborative atmosphere that encourages growth and success.',
    'home.feature.personal': 'Personalized Learning',
    'home.feature.personal.desc': 'Tailored approach to meet each student\'s unique needs effectively.',
    'home.path.title': 'Find Your Path to Excellence',
    'home.path.subtitle': 'Choose from our comprehensive range of educational programs designed to meet your specific learning goals.',
    'home.prog.academic': 'Academic Support',
    'home.prog.academic.desc': 'Comprehensive tutoring from primary school to university level across all subjects.',
    'home.prog.lang': 'Language Courses',
    'home.prog.lang.desc': 'Master English, French, and other languages with our expert instructors.',
    'home.prog.exam': 'Exam Preparation',
    'home.prog.exam.desc': 'Specialized preparation for TOEFL, IELTS, and national examinations.',
    'home.learnMore': 'Learn More',
    'home.test.title': 'Test Your English Level',
    'home.test.desc': 'Take our professional language test to discover your English proficiency level from A1 to C2. 95 questions, 40 minutes, instant results.',
    'home.test.btn': 'Start Free Test',
    'home.testimonials.title': 'What Our Students Say',
    'home.testimonials.subtitle': "Don't just take our word for it. Here's what our students have to say.",
    'home.quote': "The conversation clubs are fantastic! They helped me gain confidence in speaking English and made many new friends along the way.",
    'home.quote.author': 'Mehdi Tazi',
    'home.quote.role': 'Conversation Club Student',

    // About
    'about.title': 'About Highway Academy',
    'about.subtitle': "Dedicated to excellence in education, we've been shaping futures and building success stories in Fez for years.",
    'about.mission': 'Our Mission',
    'about.mission.desc': 'To provide exceptional educational support and language training that empowers students to achieve their academic goals and unlock their full potential.',
    'about.vision': 'Our Vision',
    'about.vision.desc': 'To be the leading educational academy in Morocco, recognized for our innovative teaching methods and commitment to student success.',
    'about.content.1': 'Highway Academy was founded with a clear purpose: to bridge the gap between traditional education and the personalized learning that every student deserves. Located in the heart of Fez, we serve students from primary school through university level, offering comprehensive academic support and specialized language courses.',
    'about.content.2': 'Our academy stands out through our commitment to individualized attention, innovative teaching methodologies, and a deep understanding of each student\'s unique learning style. We believe that education is not one-size-fits-all, which is why we tailor our approach to meet the specific needs and goals of every learner who walks through our doors.',
    'about.content.3': "With locations in both Montfleuri and Narjiss, we've made quality education accessible to families across Fez. Our experienced educators bring passion, expertise, and dedication to every lesson, creating an environment where students feel supported, challenged, and inspired to excel.",
    'about.founder.title': 'Meet Our Founder: Mr. Driss',
    'about.founder.quote': "I believe that with the right guidance, anyone can learn, grow, and succeed. Education is not just about transferring knowledge—it's about igniting curiosity, building confidence, and empowering students to become the leaders of tomorrow.",
    'about.founder.desc1': "Mr. Driss's journey in education began over 15 years ago when he first stepped into a classroom as a young teacher. What started as a career quickly became a calling when he witnessed the transformative power of personalized education.",
    'about.founder.desc2': "Throughout his career, he noticed that many bright students were struggling not because they lacked ability, but because traditional teaching methods didn't align with their learning styles. This observation sparked his passion for developing innovative, student-centered approaches to education.",
    'about.founder.role': 'Founder & Director',
    'about.founder.exp': '15+ Years in Education',

    // Programs
    'programs.title': 'Our Programs',
    'programs.subtitle': 'Discover our comprehensive range of educational programs designed to meet your specific learning goals and academic aspirations.',
    'programs.tab.lang': 'Language & Skills Courses',
    'programs.tab.academic': 'Academic Support',
    'programs.features': 'Key Features:',
    'programs.flexible': 'Flexible Scheduling',
    'programs.flexible.desc': 'Morning, afternoon, and evening classes to fit your schedule.',
    'programs.size': 'Small Class Sizes',
    'programs.size.desc': 'Maximum 8 students per class for personalized attention.',
    'programs.certified': 'Certified Instructors',
    'programs.certified.desc': 'All our teachers are qualified and experienced professionals.',
    'programs.cta.title': 'Ready to Start Your Learning Journey?',
    'programs.cta.desc': 'Contact us today to discuss your educational goals and find the perfect program for you.',
    'programs.cta.btn': 'Schedule Consultation',

    // Programs - Language Courses
    'programs.course.gen_eng.title': 'General English',
    'programs.course.gen_eng.desc': 'Comprehensive English language training covering all four skills: speaking, listening, reading, and writing.',
    'programs.course.gen_eng.f1': 'Interactive lessons',
    'programs.course.gen_eng.f2': 'Conversation practice',
    'programs.course.gen_eng.f3': 'Grammar mastery',
    'programs.course.gen_eng.f4': 'Vocabulary building',

    'programs.course.bus_eng.title': 'Business English',
    'programs.course.bus_eng.desc': 'Professional English for workplace communication, presentations, and business correspondence.',
    'programs.course.bus_eng.f1': 'Business vocabulary',
    'programs.course.bus_eng.f2': 'Professional communication',
    'programs.course.bus_eng.f3': 'Presentation skills',
    'programs.course.bus_eng.f4': 'Email writing',

    'programs.course.toefl.title': 'TOEFL Preparation',
    'programs.course.toefl.desc': 'Intensive preparation for the TOEFL exam with practice tests and targeted skill development.',
    'programs.course.toefl.f1': 'Mock exams',
    'programs.course.toefl.f2': 'Test strategies',
    'programs.course.toefl.f3': 'Time management',
    'programs.course.toefl.f4': 'Score improvement',

    'programs.course.ielts.title': 'IELTS Preparation',
    'programs.course.ielts.desc': 'Comprehensive IELTS preparation covering all four modules with expert guidance.',
    'programs.course.ielts.f1': 'Band score improvement',
    'programs.course.ielts.f2': 'Speaking practice',
    'programs.course.ielts.f3': 'Writing techniques',
    'programs.course.ielts.f4': 'Listening skills',

    'programs.course.french.title': 'French Language',
    'programs.course.french.desc': 'Complete French language program from beginner to advanced levels.',
    'programs.course.french.f1': 'Native speaker instruction',
    'programs.course.french.f2': 'Cultural immersion',
    'programs.course.french.f3': 'DELF/DALF prep',
    'programs.course.french.f4': 'Conversation clubs',

    'programs.course.arabic.title': 'Arabic Reading & Writing',
    'programs.course.arabic.level': 'All levels',
    'programs.course.arabic.desc': 'Comprehensive Arabic literacy program designed specifically for children and teenagers.',
    'programs.course.arabic.f1': 'Age-appropriate curriculum',
    'programs.course.arabic.f2': 'Interactive learning',
    'programs.course.arabic.f3': 'Cultural context',
    'programs.course.arabic.f4': 'Progress tracking',

    // Programs - Academic Courses
    'programs.course.primary.title': 'Primary Support',
    'programs.course.primary.level': 'Grades 1-6',
    'programs.course.primary.desc': 'Building strong foundations in Math, Science, and Languages for young learners.',
    'programs.course.primary.f1': 'Homework help',
    'programs.course.primary.f2': 'Concept reinforcement',
    'programs.course.primary.f3': 'Study habits',
    'programs.course.primary.f4': 'Confidence building',

    'programs.course.middle.title': 'Middle School Support',
    'programs.course.middle.level': 'Grades 7-9',
    'programs.course.middle.desc': 'Subject-specific tutoring to navigate the challenges of middle school curriculum.',
    'programs.course.middle.f1': 'Math & Physics',
    'programs.course.middle.f2': 'Language Arts',
    'programs.course.middle.f3': 'Exam preparation',
    'programs.course.middle.f4': 'Critical thinking',

    'programs.course.high.title': 'High School Support',
    'programs.course.high.level': 'Grades 10-12',
    'programs.course.high.desc': 'Advanced tutoring for high school subjects and Baccalaureate preparation.',
    'programs.course.high.f1': 'Advanced Math/Physics',
    'programs.course.high.f2': 'Science specialization',
    'programs.course.high.f3': 'National exam prep',
    'programs.course.high.f4': 'University guidance',

    // News
    'news.title': 'News & Events',
    'news.subtitle': 'Stay updated with the latest news, events, and announcements from Highway Academy.',
    'news.intro': "Don't miss out on these exciting upcoming events and programs.",
    
    // News Items
    'news.event1.title': 'Summer Intensive Courses',
    'news.event1.type': 'Upcoming',
    'news.event1.category': 'Academic Programs',
    'news.event1.desc': 'Join our comprehensive summer program designed to boost academic performance.',

    'news.event2.title': 'Conversation Clubs (All Levels)',
    'news.event2.type': 'Upcoming',
    'news.event2.category': 'Language Practice',
    'news.event2.desc': 'Join our weekly conversation clubs to practice English and French in a relaxed environment.',

    'news.event3.title': 'Public Speaking Workshop',
    'news.event3.type': 'Upcoming',
    'news.event3.category': 'Skills Development',
    'news.event3.desc': 'Develop confidence and communication skills in our intensive public speaking workshop.',

    'news.event4.title': 'IELTS Success Stories',
    'news.event4.type': 'Concluded',
    'news.event4.category': 'Student Success',
    'news.event4.desc': 'Celebrating our students who achieved outstanding IELTS scores and secured university admissions.',

    'news.event5.title': 'University Preparation Workshop',
    'news.event5.type': 'Concluded',
    'news.event5.category': 'Workshops',
    'news.event5.desc': 'Free workshop for high school students covering university application processes.',

    'news.event6.title': 'Teacher Training Seminar',
    'news.event6.type': 'Concluded',
    'news.event6.category': 'Professional Development',
    'news.event6.desc': 'Professional development seminar for our educators focusing on innovative teaching methodologies.',

    // Contact
    'contact.title': 'Contact & FAQ',
    'contact.subtitle': 'Get in touch with us or find answers to frequently asked questions.',
    'contact.getInTouch': 'Get in Touch',
    'contact.general': 'General Information',
    'contact.viewMap': 'View on Google Maps',
    'contact.openMap': 'Open in Google Maps',
    'contact.sendMessage': 'Send us a Message',
    'contact.form.name': 'Your Name',
    'contact.form.email': 'Your Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Your Message',
    'contact.form.btn': 'Send Message',
    'contact.faq.title': 'Frequently Asked Questions',
    'contact.faq.subtitle': 'Find answers to common questions about our programs, enrollment process, and services.',
    'contact.stillQuestions': 'Still have questions? We\'re here to help!',
    'contact.contactDirect': 'Contact Us Directly',

    // Reservation
    'res.title': 'Reserve Your Spot',
    'res.subtitle': 'Join Highway Academy today. Fill out the form below to book your course.',
    'res.form.fullname': 'Full Name',
    'res.form.phone': 'Phone Number',
    'res.form.email': 'Email Address',
    'res.form.course': 'Select Course',
    'res.form.level': 'Select Level',
    'res.form.time': 'Preferred Time',
    'res.form.msg': 'Additional Message (Optional)',
    'res.form.submit': 'Reserve Now',
    'res.success': 'Reservation Successful!',
    'res.success.desc': 'We have received your reservation request. Our team will contact you shortly to confirm your enrollment.',
    'res.error': 'Please fill in all required fields.',
    'res.limit.note': 'Note: You can only make one reservation per person (email, phone, or name).',
    'res.limit.error': 'You have already submitted a reservation using this name, email, or phone number. Our team will contact you soon.',
    'res.limit.ip.error': 'Too many reservations from this device. Please wait 24 hours before trying again.',

    // Footer
    'footer.desc': 'Where academic excellence meets personalized learning. Let us guide you to success.',
    'footer.quickLinks': 'Quick Links',
    'footer.contactInfo': 'Contact Info',
    'footer.rights': '© 2026 Highway Academy. All rights reserved.',
  },
  ar: {
    // Navbar
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.programs': 'برامجنا',
    'nav.news': 'أخبار وأحداث',
    'nav.contact': 'اتصل بنا',
    'nav.contactUs': 'تواصل معنا',
    'nav.reserve': 'احجز الآن',

    // Home
    'home.hero.title1': 'تعلم اليوم...',
    'home.hero.title2': 'قد الغد.',
    'home.hero.desc': 'أكاديمية هاي واي فاس - مركز التعليم الخاص الأول في المغرب. دورات لغة متخصصة (الإنجليزية، الفرنسية)، تحضير IELTS/TOEFL، ودعم أكاديمي من الابتدائي إلى الجامعي.',
    'home.explore': 'اكتشف برامجنا',
    'home.why.title': 'لماذا تختار أكاديمية هاي واي؟',
    'home.why.subtitle': 'نجمع بين الخبرة والابتكار والاهتمام الشخصي لخلق بيئة تعليمية مثالية.',
    'home.feature.tutors': 'أساتذة خبراء',
    'home.feature.tutors.desc': 'تعلم من أفضل العقول في فاس، المكرسين لنموك.',
    'home.feature.results': 'نتائج مثبتة',
    'home.feature.results.desc': 'سجل حافل من التميز الأكاديمي وإنجازات الطلاب.',
    'home.feature.support': 'بيئة داعمة',
    'home.feature.support.desc': 'جو تعاوني يشجع على النمو والنجاح.',
    'home.feature.personal': 'تعلم مخصص',
    'home.feature.personal.desc': 'نهج مصمم خصيصًا لتلبية الاحتياجات الفريدة لكل طالب بفعالية.',
    'home.path.title': 'ابحث عن طريقك نحو التميز',
    'home.path.subtitle': 'اختر من بين مجموعتنا الشاملة من البرامج التعليمية المصممة لتحقيق أهدافك.',
    'home.prog.academic': 'الدعم الأكاديمي',
    'home.prog.academic.desc': 'دروس خصوصية شاملة من المدرسة الابتدائية إلى المستوى الجامعي في جميع المواد.',
    'home.prog.lang': 'دورات اللغات',
    'home.prog.lang.desc': 'أتقن الإنجليزية والفرنسية ولغات أخرى مع مدرسينا الخبراء.',
    'home.prog.exam': 'التحضير للامتحانات',
    'home.prog.exam.desc': 'تحضير متخصص لاختبارات TOEFL و IELTS والامتحانات الوطنية.',
    'home.learnMore': 'اعرف المزيد',
    'home.test.title': 'اختبر مستواك في الإنجليزية',
    'home.test.desc': 'قم بإجراء اختبار اللغة الاحترافي الخاص بنا لاكتشاف مستواك في اللغة الإنجليزية من A1 إلى C2. 95 سؤالاً، 40 دقيقة، نتائج فورية.',
    'home.test.btn': 'ابدأ الاختبار المجاني',
    'home.testimonials.title': 'ماذا يقول طلابنا',
    'home.testimonials.subtitle': 'لا تأخذ كلمتنا فقط. إليك ما يقوله طلابنا.',
    'home.quote': "أندية المحادثة رائعة! ساعدتني على اكتساب الثقة في التحدث باللغة الإنجليزية وتكوين العديد من الصداقات الجديدة.",
    'home.quote.author': 'مهدي تازي',
    'home.quote.role': 'طالب في نادي المحادثة',

    // About
    'about.title': 'عن أكاديمية هاي واي',
    'about.subtitle': 'مكرسون للتميز في التعليم، نحن نشكل المستقبل ونبني قصص النجاح في فاس منذ سنوات.',
    'about.mission': 'مهمتنا',
    'about.mission.desc': 'توفير دعم تعليمي استثنائي وتدريب لغوي يمكّن الطلاب من تحقيق أهدافهم الأكاديمية وإطلاق العنان لإمكاناتهم الكاملة.',
    'about.vision': 'رؤيتنا',
    'about.vision.desc': 'أن نكون الأكاديمية التعليمية الرائدة في المغرب، المعترف بها لطرق التدريس المبتكرة والتزامنا بنجاح الطلاب.',
    'about.content.1': 'تأسست أكاديمية هاي واي بهدف واضح: سد الفجوة بين التعليم التقليدي والتعلم المخصص الذي يستحقه كل طالب. نقع في قلب فاس، ونخدم الطلاب من المرحلة الابتدائية حتى الجامعية.',
    'about.content.2': 'تتميز أكاديميتنا من خلال التزامنا بالاهتمام الفردي، ومنهجيات التدريس المبتكرة، والفهم العميق لأسلوب التعلم الفريد لكل طالب. نحن نؤمن بأن التعليم ليس مقاسًا واحدًا يناسب الجميع.',
    'about.content.3': 'مع مواقعنا في كل من مونفلوري ونرجس، جعلنا التعليم الجيد في متناول العائلات في جميع أنحاء فاس. يجلب معلمونا ذوو الخبرة الشغف والخبرة والتفاني في كل درس.',
    'about.founder.title': 'تعرف على المؤسس: السيد إدريس',
    'about.founder.quote': "أؤمن أنه بالتوجيه الصحيح، يمكن لأي شخص أن يتعلم وينمو وينجح. التعليم ليس مجرد نقل للمعرفة—إنه إشعال للفضول وبناء للثقة.",
    'about.founder.desc1': 'بدأت رحلة السيد إدريس في التعليم منذ أكثر من 15 عامًا. ما بدأ كمهنة سرعان ما أصبح دعوة عندما شهد القوة التحويلية للتعليم المخصص.',
    'about.founder.desc2': 'طوال حياته المهنية، لاحظ أن العديد من الطلاب الأذكياء كانوا يعانون ليس لأنهم يفتقرون إلى القدرة، بل لأن طرق التدريس التقليدية لم تتوافق مع أساليب تعلمهم.',
    'about.founder.role': 'المؤسس والمدير',
    'about.founder.exp': 'أكثر من 15 عامًا في التعليم',

    // Programs
    'programs.title': 'برامجنا',
    'programs.subtitle': 'اكتشف مجموعتنا الشاملة من البرامج التعليمية المصممة لتلبية أهدافك التعليمية وتطلعاتك الأكاديمية.',
    'programs.tab.lang': 'دورات اللغات والمهارات',
    'programs.tab.academic': 'الدعم الأكاديمي',
    'programs.features': 'الميزات الرئيسية:',
    'programs.flexible': 'جداول مرنة',
    'programs.flexible.desc': 'فصول صباحية ومسائية لتناسب جدولك.',
    'programs.size': 'فصول صغيرة العدد',
    'programs.size.desc': 'حد أقصى 8 طلاب لكل فصل للاهتمام الشخصي.',
    'programs.certified': 'مدربون معتمدون',
    'programs.certified.desc': 'جميع معلمينا محترفون مؤهلون وذوو خبرة.',
    'programs.cta.title': 'مستعد لبدء رحلتك التعليمية؟',
    'programs.cta.desc': 'اتصل بنا اليوم لمناقشة أهدافك التعليمية والعثور على البرنامج المثالي لك.',
    'programs.cta.btn': 'جدولة استشارة',

    // Programs - Language Courses
    'programs.course.gen_eng.title': 'الإنجليزية العامة',
    'programs.course.gen_eng.desc': 'تدريب شامل للغة الإنجليزية يغطي جميع المهارات الأربع: التحدث والاستماع والقراءة والكتابة.',
    'programs.course.gen_eng.f1': 'دروس تفاعلية',
    'programs.course.gen_eng.f2': 'ممارسة المحادثة',
    'programs.course.gen_eng.f3': 'إتقان القواعد',
    'programs.course.gen_eng.f4': 'بناء المفردات',

    'programs.course.bus_eng.title': 'الإنجليزية للأعمال',
    'programs.course.bus_eng.desc': 'لغة إنجليزية احترافية للتواصل في مكان العمل والعروض التقديمية والمراسلات التجارية.',
    'programs.course.bus_eng.f1': 'مفردات الأعمال',
    'programs.course.bus_eng.f2': 'التواصل المهني',
    'programs.course.bus_eng.f3': 'مهارات العرض',
    'programs.course.bus_eng.f4': 'كتابة رسائل البريد الإلكتروني',

    'programs.course.toefl.title': 'التحضير لاختبار TOEFL',
    'programs.course.toefl.desc': 'إعداد مكثف لامتحان TOEFL مع اختبارات تدريبية وتطوير المهارات المستهدفة.',
    'programs.course.toefl.f1': 'امتحانات تجريبية',
    'programs.course.toefl.f2': 'استراتيجيات الاختبار',
    'programs.course.toefl.f3': 'إدارة الوقت',
    'programs.course.toefl.f4': 'تحسين الدرجات',

    'programs.course.ielts.title': 'التحضير لاختبار IELTS',
    'programs.course.ielts.desc': 'إعداد شامل لـ IELTS يغطي جميع الوحدات الأربع مع توجيه الخبراء.',
    'programs.course.ielts.f1': 'تحسين درجة النطاق',
    'programs.course.ielts.f2': 'ممارسة التحدث',
    'programs.course.ielts.f3': 'تقنيات الكتابة',
    'programs.course.ielts.f4': 'مهارات الاستماع',

    'programs.course.french.title': 'اللغة الفرنسية',
    'programs.course.french.desc': 'برنامج اللغة الفرنسية الكامل من المبتدئين إلى المستويات المتقدمة.',
    'programs.course.french.f1': 'تعليم من قبل ناطقين أصليين',
    'programs.course.french.f2': 'الانغماس الثقافي',
    'programs.course.french.f3': 'التحضير لـ DELF/DALF',
    'programs.course.french.f4': 'أندية المحادثة',

    'programs.course.arabic.title': 'القراءة والكتابة بالعربية',
    'programs.course.arabic.level': 'جميع المستويات',
    'programs.course.arabic.desc': 'برنامج شامل لمحو الأمية العربية مصمم خصيصًا للأطفال والمراهقين.',
    'programs.course.arabic.f1': 'منهج مناسب للعمر',
    'programs.course.arabic.f2': 'تعلم تفاعلي',
    'programs.course.arabic.f3': 'سياق ثقافي',
    'programs.course.arabic.f4': 'تتبع التقدم',

    // Programs - Academic Courses
    'programs.course.primary.title': 'الدعم الابتدائي',
    'programs.course.primary.level': 'الصفوف 1-6',
    'programs.course.primary.desc': 'بناء أسس قوية في الرياضيات والعلوم واللغات للمتعلمين الصغار.',
    'programs.course.primary.f1': 'المساعدة في الواجبات المنزلية',
    'programs.course.primary.f2': 'تعزيز المفاهيم',
    'programs.course.primary.f3': 'عادات الدراسة',
    'programs.course.primary.f4': 'بناء الثقة',

    'programs.course.middle.title': 'الدعم الإعدادي',
    'programs.course.middle.level': 'الصفوف 7-9',
    'programs.course.middle.desc': 'دروس خصوصية خاصة بالموضوع للتنقل في تحديات مناهج المدارس الإعدادية.',
    'programs.course.middle.f1': 'الرياضيات والفيزياء',
    'programs.course.middle.f2': 'فنون اللغة',
    'programs.course.middle.f3': 'التحضير للامتحانات',
    'programs.course.middle.f4': 'التفكير النقدي',

    'programs.course.high.title': 'الدعم الثانوي',
    'programs.course.high.level': 'الصفوف 10-12',
    'programs.course.high.desc': 'دروس خصوصية متقدمة لمواد المدرسة الثانوية والتحضير للبكالوريا.',
    'programs.course.high.f1': 'رياضيات/فيزياء متقدمة',
    'programs.course.high.f2': 'التخصص العلمي',
    'programs.course.high.f3': 'التحضير للامتحان الوطني',
    'programs.course.high.f4': 'التوجيه الجامعي',

    // News
    'news.title': 'الأخبار والأحداث',
    'news.subtitle': 'ابق على اطلاع بآخر الأخبار والأحداث والإعلانات من أكاديمية هاي واي.',
    'news.intro': 'لا تفوت هذه الأحداث والبرامج المثيرة القادمة.',

    // News Items
    'news.event1.title': 'دورات صيفية مكثفة',
    'news.event1.type': 'قادم',
    'news.event1.category': 'برامج أكاديمية',
    'news.event1.desc': 'انضم إلى برنامجنا الصيفي الشامل المصمم لتعزيز الأداء الأكاديمي.',

    'news.event2.title': 'نوادي المحادثة (جميع المستويات)',
    'news.event2.type': 'قادم',
    'news.event2.category': 'ممارسة اللغة',
    'news.event2.desc': 'انضم إلى نوادي المحادثة الأسبوعية لممارسة الإنجليزية والفرنسية في بيئة مريحة.',

    'news.event3.title': 'ورشة عمل التحدث أمام الجمهور',
    'news.event3.type': 'قادم',
    'news.event3.category': 'تطوير المهارات',
    'news.event3.desc': 'طوّر الثقة ومهارات التواصل في ورشة العمل المكثفة للتحدث أمام الجمهور.',

    'news.event4.title': 'قصص نجاح IELTS',
    'news.event4.type': 'مكتمل',
    'news.event4.category': 'نجاح الطلاب',
    'news.event4.desc': 'نحتفل بطلابنا الذين حققوا درجات متميزة في IELTS وحصلوا على قبول جامعي.',

    'news.event5.title': 'ورشة التحضير للجامعة',
    'news.event5.type': 'مكتمل',
    'news.event5.category': 'ورش عمل',
    'news.event5.desc': 'ورشة عمل مجانية لطلاب المدارس الثانوية تغطي عمليات التقديم للجامعات.',

    'news.event6.title': 'ندوة تدريب المعلمين',
    'news.event6.type': 'مكتمل',
    'news.event6.category': 'التطوير المهني',
    'news.event6.desc': 'ندوة تطوير مهني لمعلمينا تركز على منهجيات التدريس المبتكرة.',

    // Contact
    'contact.title': 'الاتصال والأسئلة الشائعة',
    'contact.subtitle': 'تواصل معنا أو اعثر على إجابات للأسئلة الشائعة.',
    'contact.getInTouch': 'تواصل معنا',
    'contact.general': 'معلومات عامة',
    'contact.viewMap': 'عرض على خرائط جوجل',
    'contact.openMap': 'فتح في خرائط جوجل',
    'contact.sendMessage': 'أرسل لنا رسالة',
    'contact.form.name': 'اسمك',
    'contact.form.email': 'بريدك الإلكتروني',
    'contact.form.subject': 'الموضوع',
    'contact.form.message': 'رسالتك',
    'contact.form.btn': 'إرسال الرسالة',
    'contact.faq.title': 'الأسئلة الشائعة',
    'contact.faq.subtitle': 'اعثر على إجابات للأسئلة الشائعة حول برامجنا وعملية التسجيل وخدماتنا.',
    'contact.stillQuestions': 'لا تزال لديك أسئلة؟ نحن هنا للمساعدة!',
    'contact.contactDirect': 'اتصل بنا مباشرة',

    // Reservation
    'res.title': 'احجز مقعدك',
    'res.subtitle': 'انضم إلى أكاديمية هاي واي اليوم. املأ النموذج أدناه لحجز دورتك.',
    'res.form.fullname': 'الاسم الكامل',
    'res.form.phone': 'رقم الهاتف',
    'res.form.email': 'البريد الإلكتروني',
    'res.form.course': 'اختر الدورة',
    'res.form.level': 'اختر المستوى',
    'res.form.time': 'الوقت المفضل',
    'res.form.msg': 'رسالة إضافية (اختياري)',
    'res.form.submit': 'احجز الآن',
    'res.success': 'تم الحجز بنجاح!',
    'res.success.desc': 'لقد استلمنا طلب الحجز الخاص بك. سيتصل بك فريقنا قريباً لتأكيد تسجيلك.',
    'res.error': 'يرجى ملء جميع الحقول المطلوبة.',
    'res.limit.note': 'ملاحظة: يمكنك إجراء حجز واحد فقط لكل شخص (الاسم، البريد الإلكتروني، أو رقم الهاتف).',
    'res.limit.error': 'لقد تم تقديم حجز مسبقاً باستخدام هذا الاسم أو البريد الإلكتروني أو رقم الهاتف. سيتم التواصل معك قريباً.',
    'res.limit.ip.error': 'تم تقديم العديد من الحجوزات من هذا الجهاز. يرجى الانتظار 24 ساعة قبل المحاولة مرة أخرى.',

    // Footer
    'footer.desc': 'حيث يلتقي التميز الأكاديمي بالتعلم المخصص. دعنا نرشدك إلى النجاح.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.contactInfo': 'معلومات الاتصال',
    'footer.rights': '© 2026 أكاديمية هاي واي. جميع الحقوق محفوظة.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};