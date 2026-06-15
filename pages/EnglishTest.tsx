import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, RefreshCcw, PenTool, GripVertical, Volume2, Square, Headphones, BookOpen, BrainCircuit, ShieldAlert, Clock, Languages, Download } from 'lucide-react';
import { Button } from '../components/ui/Layout';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { sanitizeInput } from '../utils/sanitize';
import { supabase } from '../utils/supabase';

import { ALL_QUESTIONS, Question, QuestionType, SkillType } from '../src/data/questions';

const SKILL_ORDER: SkillType[] = ['Grammar & Vocabulary', 'Reading', 'Listening', 'Writing'];

const DASHBOARD_TRANSLATIONS = {
  en: {
    welcome: "Welcome",
    subtitle: "You are about to start the language test",
    questions: "Questions",
    rulesTitle: "Testing Rules",
    rule1_1: "You have exactly ",
    rule1_time: "40 minutes",
    rule1_2: " to complete all 4 sections. The timer cannot be paused.",
    rule2: "You can only take the test once. You cannot repeat the test to practice.",
    rule3: "You will not lose points for incorrect answers.",
    rule4: "Once you submit an exercise, you cannot go back to change your answer.",
    antiCheatTitle: "Strict Anti-Cheat System Active",
    antiCheatDesc: "If you switch browser tabs, open another window, or leave this page for more than 7 seconds, your test will be permanently cancelled.",
    startBtn: "I Understand, Start Test",
    skills: {
      "Grammar & Vocabulary": "Grammar & Vocabulary",
      "Reading": "Reading",
      "Listening": "Listening",
      "Writing": "Writing"
    }
  },
  ar: {
    welcome: "مرحباً",
    subtitle: "أنت على وشك بدء اختبار اللغة",
    questions: "سؤالاً",
    rulesTitle: "قواعد الاختبار",
    rule1_1: "لديك ",
    rule1_time: "40 دقيقة",
    rule1_2: " بالضبط لإكمال جميع الأقسام الأربعة. لا يمكن إيقاف المؤقت.",
    rule2: "يمكنك إجراء الاختبار مرة واحدة فقط. لا يمكنك تكرار الاختبار للتدريب.",
    rule3: "لن تفقد نقاطاً بسبب الإجابات الخاطئة.",
    rule4: "بمجرد إرسال التمرين، لا يمكنك العودة لتغيير إجابتك.",
    antiCheatTitle: "نظام صارم لمكافحة الغش نشط",
    antiCheatDesc: "إذا قمت بتبديل علامات تبويب المتصفح، أو فتح نافذة أخرى، أو مغادرة هذه الصفحة لأكثر من 7 ثوانٍ، فسيتم إلغاء اختبارك نهائياً.",
    startBtn: "أفهم ذلك، ابدأ الاختبار",
    skills: {
      "Grammar & Vocabulary": "القواعد والمفردات",
      "Reading": "القراءة",
      "Listening": "الاستماع",
      "Writing": "الكتابة"
    }
  }
};

// UI Components
const DragAndDropQuestionUI = ({ question, value, onChange }: { question: Question, value: string[], onChange: (v: string[]) => void }) => {
  const [items, setItems] = useState<{ id: string, text: string }[]>(() => {
    let sourceArray = value && value.length > 0 ? value : [...(question.draggableItems || [])];
    if (!value || value.length === 0) {
      for (let i = sourceArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sourceArray[i], sourceArray[j]] = [sourceArray[j], sourceArray[i]];
      }
      if (question.correctOrder && JSON.stringify(sourceArray) === JSON.stringify(question.correctOrder) && sourceArray.length > 1) {
        const temp = sourceArray[0];
        sourceArray[0] = sourceArray[1];
        sourceArray[1] = temp;
      }
    }
    return sourceArray.map((text, index) => ({ id: `uuid-${index}`, text }));
  });

  useEffect(() => {
    if ((!value || value.length === 0) && items) {
      onChange(items.map(item => item.text));
    }
  }, [value, onChange, items]);

  const handleReorder = (newOrder: { id: string, text: string }[]) => {
    setItems(newOrder);
    onChange(newOrder.map(item => item.text));
  };

  return (
    <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-2 md:space-y-3 relative z-10 w-full">
      {items.map((item) => (
        <Reorder.Item
          key={item.id}
          value={item}
          className="p-3 md:p-4 rounded-xl border border-gray-700 bg-dark-900 cursor-grab active:cursor-grabbing flex items-center gap-2 md:gap-3 text-white hover:border-orange-600 transition-colors shadow-sm relative z-50 bg-opacity-100 will-change-transform touch-none"
        >
          <GripVertical className="text-gray-500 shrink-0 w-4 h-4 md:w-5 md:h-5" />
          <span className="font-medium text-sm md:text-lg pointer-events-none select-none break-words text-wrap">{item.text}</span>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};

const MatchingQuestionUI = ({ question, value, onChange }: { question: Question, value: Record<string, string>, onChange: (v: Record<string, string>) => void }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<{ x1: number, y1: number, x2: number, y2: number }[]>([]);

  const safeValue = value || {};

  const updateLines = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines: any[] = [];

    Object.entries(safeValue).forEach(([leftId, rightId]) => {
      const leftEl = leftRefs.current[leftId];
      const rightEl = rightRefs.current[rightId];
      if (leftEl && rightEl) {
        const lRect = leftEl.getBoundingClientRect();
        const rRect = rightEl.getBoundingClientRect();
        newLines.push({
          x1: lRect.right - containerRect.left,
          y1: lRect.top + lRect.height / 2 - containerRect.top,
          x2: rRect.left - containerRect.left,
          y2: rRect.top + rRect.height / 2 - containerRect.top
        });
      }
    });
    setLines(newLines);
  };

  useLayoutEffect(() => {
    const t = setTimeout(() => updateLines(), 50);
    window.addEventListener('resize', updateLines);
    return () => { clearTimeout(t); window.removeEventListener('resize', updateLines); };
  }, [safeValue, question]);

  const handleLeftClick = (id: string) => setSelectedLeft(id === selectedLeft ? null : id);

  const handleRightClick = (id: string) => {
    if (selectedLeft) {
      const newVal = { ...safeValue, [selectedLeft]: id };
      Object.keys(newVal).forEach(lId => { if (lId !== selectedLeft && newVal[lId] === id) delete newVal[lId]; });
      onChange(newVal);
      setSelectedLeft(null);
    } else {
      const matchingLeft = Object.keys(safeValue).find(lId => safeValue[lId] === id);
      if (matchingLeft) {
        const newVal = { ...safeValue };
        delete newVal[matchingLeft];
        onChange(newVal);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full flex justify-between gap-2 md:gap-12 pb-4">
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block" style={{ zIndex: 0 }}>
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5.5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#ea580c" />
          </marker>
        </defs>
        {lines.map((line, i) => (
          <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#ea580c" strokeWidth="2.5" markerEnd="url(#arrowhead)" />
        ))}
      </svg>

      <div className="flex flex-col gap-2 md:gap-4 w-1/2 z-10">
        <div className="text-gray-400 font-medium mb-1 md:mb-2 text-center text-[10px] md:text-xs uppercase tracking-wider shrink-0">Tap a term</div>
        {question.leftItems?.map((item, index) => {
          const isMatched = Object.keys(safeValue).includes(item.id);
          return (
            <div
              key={item.id}
              ref={el => leftRefs.current[item.id] = el}
              onClick={() => handleLeftClick(item.id)}
              className={`relative p-2 md:p-4 min-h-[48px] md:min-h-[60px] text-xs md:text-base border shadow-md rounded-xl cursor-pointer transition select-none flex items-center justify-center text-center break-words ${selectedLeft === item.id ? "border-orange-500 bg-orange-500 shadow-orange-900/50 text-white transform scale-100 md:scale-105" : isMatched ? "border-orange-500/50 bg-dark-800 text-white opacity-60 md:opacity-100" : "border-gray-700 bg-dark-900 text-gray-300 hover:border-gray-500"
                }`}
            >
              <div className={`absolute -left-2 -top-2 w-5 h-5 md:hidden rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ring-2 ring-dark-900 ${isMatched || selectedLeft === item.id ? 'bg-orange-600 text-white' : 'bg-dark-700 border border-gray-600 text-gray-300'}`}>{index + 1}</div>
              {item.text}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 md:gap-4 w-1/2 z-10">
        <div className="text-gray-400 font-medium mb-1 md:mb-2 text-center text-[10px] md:text-xs uppercase tracking-wider shrink-0">Then tap meaning</div>
        {question.rightItems?.map(item => {
          const isMatched = Object.values(safeValue).includes(item.id);
          const matchEntry = Object.entries(safeValue).find(([lId, rId]) => rId === item.id);
          const matchedLeftIndex = matchEntry ? question.leftItems?.findIndex(l => l.id === matchEntry[0]) : -1;
          const badgeNumber = matchedLeftIndex !== undefined && matchedLeftIndex >= 0 ? matchedLeftIndex + 1 : null;
          return (
            <div
              key={item.id}
              ref={el => rightRefs.current[item.id] = el}
              onClick={() => handleRightClick(item.id)}
              className={`relative p-2 md:p-4 min-h-[48px] md:min-h-[60px] text-xs md:text-base border shadow-md rounded-xl cursor-pointer transition select-none flex items-center justify-center text-center break-words ${isMatched ? "border-orange-500/50 bg-dark-800 text-white opacity-60 md:opacity-100" : selectedLeft ? "border-gray-300 bg-dark-900 border-dashed text-gray-100 hover:bg-dark-800 animate-pulse" : "border-gray-700 bg-dark-900 text-gray-300 hover:border-gray-500"
                }`}
            >
              {badgeNumber !== null && <div className="absolute -right-2 -top-2 w-5 h-5 md:hidden bg-orange-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-dark-900">{badgeNumber}</div>}
              {item.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CircularProgress = ({ percentage, label, level }: { percentage: number, label: string, level: string }) => {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center w-full">
      <div className="relative w-20 h-20 md:w-32 md:h-32 mb-2 md:mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} stroke="#1f2937" strokeWidth="8" fill="transparent" />
          <circle cx="64" cy="64" r={radius} stroke="#ea580c" strokeWidth="8" strokeLinecap="round" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg md:text-2xl font-bold text-[#ea580c]">{percentage}</span>
        </div>
      </div>
      <span className="font-bold text-white mb-1 text-xs md:text-lg whitespace-nowrap">{label}</span>
      <span className="text-[10px] md:text-sm text-gray-400 whitespace-nowrap">{level}</span>
    </div>
  );
};

const EnglishTest = () => {
  const { language } = useLanguage();
  const [testPhase, setTestPhase] = useState<TestPhase>('welcome');
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 minutes in seconds
  const [cheatCountdown, setCheatCountdown] = useState<number | null>(null);

  const [score, setScore] = useState(0);
  const [skillScores, setSkillScores] = useState<Record<string, number>>({});

  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // New States for Certification
  const [userInfo, setUserInfo] = useState({ fullName: '', email: '', phone: '+212', isSchoolStudent: null as boolean | null });
  const [testDate, setTestDate] = useState<Date | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [resultEmailSent, setResultEmailSent] = useState(false);
  const [testResultId, setTestResultId] = useState<string | null>(null);
  const testResultIdRef = useRef<string | null>(null);
  const audioObjRef = useRef<HTMLAudioElement | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  const [isStudentStatusLocked, setIsStudentStatusLocked] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const checkExistingStudentStatus = async () => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email);
    const isPhoneValid = /^\+212(0?[567])[0-9]{8}$/.test(userInfo.phone);

    if (!isEmailValid && !isPhoneValid) return;
    
    setIsCheckingEmail(true);
    try {
      let query = supabase.from('test_results')
        .select('is_school_student')
        .not('is_school_student', 'is', null)
        .order('created_at', { ascending: true })
        .limit(1);

      if (isEmailValid && isPhoneValid) {
         query = query.or(`email.eq.${userInfo.email},phone.eq.${userInfo.phone}`);
      } else if (isEmailValid) {
         query = query.eq('email', userInfo.email);
      } else if (isPhoneValid) {
         query = query.eq('phone', userInfo.phone);
      }

      const { data: previousTests } = await query;
        
      if (previousTests && previousTests.length > 0) {
        const dbStatus = previousTests[0].is_school_student;
        setUserInfo(prev => ({ ...prev, isSchoolStudent: dbStatus }));
        setIsStudentStatusLocked(true);
        if (isEmailValid) localStorage.setItem(`highway_student_status_${userInfo.email}`, String(dbStatus));
        if (isPhoneValid) localStorage.setItem(`highway_student_status_${userInfo.phone}`, String(dbStatus));
      } else {
        // Only unlock if localStorage doesn't have it either
        let savedStatus = null;
        if (isEmailValid) savedStatus = localStorage.getItem(`highway_student_status_${userInfo.email}`);
        if (!savedStatus && isPhoneValid) savedStatus = localStorage.getItem(`highway_student_status_${userInfo.phone}`);
        
        if (savedStatus === null) {
            setIsStudentStatusLocked(false);
        } else {
            setUserInfo(prev => ({ ...prev, isSchoolStudent: savedStatus === 'true' }));
            setIsStudentStatusLocked(true);
        }
      }
    } catch (err) {
      console.warn("Could not check existing status");
    }
    setIsCheckingEmail(false);
  };

  useEffect(() => {
    // Check local storage for existing student status for this email or phone
    const savedByEmail = userInfo.email ? localStorage.getItem(`highway_student_status_${userInfo.email}`) : null;
    const savedByPhone = userInfo.phone ? localStorage.getItem(`highway_student_status_${userInfo.phone}`) : null;
    const savedStatus = savedByEmail || savedByPhone;

    if (savedStatus !== null) {
      setUserInfo(prev => ({ ...prev, isSchoolStudent: savedStatus === 'true' }));
      setIsStudentStatusLocked(true);
    } else {
      setIsStudentStatusLocked(false);
    }
  }, [userInfo.email, userInfo.phone]);

  useEffect(() => {
    const isPhoneValid = /^\+212(0?[567])[0-9]{8}$/.test(userInfo.phone);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email);
    const isNameValid = userInfo.fullName.trim().length > 2;
    const isStudentSelected = userInfo.isSchoolStudent !== null;
    setIsFormValid(isPhoneValid && isEmailValid && isNameValid && isStudentSelected);
  }, [userInfo]);

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      const pdfWidth = 210; // Standard A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${userInfo.fullName.replace(/\s+/g, '_')}_Highway_Academy_Certificate.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
    }
    setIsGeneratingPDF(false);
  };

  const sendTestRegistration = async () => {
    const sanitizedUser = {
      fullName: sanitizeInput(userInfo.fullName),
      email: sanitizeInput(userInfo.email),
      phone: sanitizeInput(userInfo.phone)
    };

    try {
      // Force database enforcement of first choice as the absolute source of truth
      let finalStudentStatus = userInfo.isSchoolStudent;
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedUser.email);
      const isPhoneValid = /^\+212(0?[567])[0-9]{8}$/.test(sanitizedUser.phone);
      
      let query = supabase.from('test_results')
        .select('is_school_student')
        .not('is_school_student', 'is', null)
        .order('created_at', { ascending: true })
        .limit(1);

      if (isEmailValid && isPhoneValid) {
         query = query.or(`email.eq.${sanitizedUser.email},phone.eq.${sanitizedUser.phone}`);
      } else if (isEmailValid) {
         query = query.eq('email', sanitizedUser.email);
      } else if (isPhoneValid) {
         query = query.eq('phone', sanitizedUser.phone);
      }

      const { data: previousTests } = await query;
      
      if (previousTests && previousTests.length > 0) {
         finalStudentStatus = previousTests[0].is_school_student;
      }

      const { data, error } = await supabase.from('test_results').insert([
        {
          name: sanitizedUser.fullName,
          email: sanitizedUser.email,
          phone: sanitizedUser.phone,
          is_school_student: finalStudentStatus,
          status: 'Started'
        }
      ]).select('id').single();
      
      if (error) {
        console.error('Supabase API Error (Registration):', error);
      } else if (data) {
        setTestResultId(data.id);
        testResultIdRef.current = data.id;
      }
    } catch (err) {
      console.warn('Database notification failed:', err);
    }
  };

  // Send result email with certificate PDF link (via GoFile.io — free, no account needed)
  const sendTestResult = async (finalScore: number, finalSkillScores: Record<string, number>) => {
    const resultData = getLevel(finalScore);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const sanitizedUser = {
      fullName: sanitizeInput(userInfo.fullName),
      email: sanitizeInput(userInfo.email),
      phone: sanitizeInput(userInfo.phone)
    };

    let certificateUrl = '';

    // Step 1: Generate PDF blob from certificate and upload to Supabase Storage
    if (certificateRef.current) {
      try {
        const canvas = await html2canvas(certificateRef.current, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = 210;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfWidth, pdfHeight] });
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const pdfBlob = pdf.output('blob');

        const fileName = `${sanitizedUser.fullName.replace(/\\s+/g, '_')}_${Date.now()}.pdf`;
        const { data, error } = await supabase.storage
            .from('certificates')
            .upload(fileName, pdfBlob, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (data) {
            const { data: publicUrlData } = supabase.storage.from('certificates').getPublicUrl(fileName);
            certificateUrl = publicUrlData.publicUrl;
        } else if (error) {
            console.error('Supabase storage upload error:', error);
        }
      } catch (err) {
        console.warn('Certificate upload failed:', err);
      }
    }

    // Step 2: Save to Supabase
    try {
      const updatePayload = {
        score: finalScore,
        level: resultData.level,
        grammar_score: finalSkillScores['Grammar & Vocabulary'] ?? 0,
        reading_score: finalSkillScores['Reading'] ?? 0,
        listening_score: finalSkillScores['Listening'] ?? 0,
        writing_score: finalSkillScores['Writing'] ?? 0,
        status: 'Completed',
        certificate_url: certificateUrl
      };

      const idToUpdate = testResultIdRef.current || testResultId;
      if (idToUpdate) {
        await supabase.from('test_results').update(updatePayload).eq('id', idToUpdate);
      } else {
        const { data: existingData } = await supabase.from('test_results')
            .select('id')
            .eq('email', sanitizedUser.email)
            .eq('phone', sanitizedUser.phone)
            .eq('status', 'Started')
            .order('created_at', { ascending: false })
            .limit(1);

        if (existingData && existingData.length > 0) {
            await supabase.from('test_results').update(updatePayload).eq('id', existingData[0].id);
        } else {
            await supabase.from('test_results').insert([{
              name: sanitizedUser.fullName,
              email: sanitizedUser.email,
              phone: sanitizedUser.phone,
              is_school_student: userInfo.isSchoolStudent,
              ...updatePayload
            }]);
        }
      }
    } catch (err) {
      console.warn('Result DB update failed:', err);
    }
  };

  // Fire result email once the 'result' phase renders the certificate in the DOM
  useEffect(() => {
    if (testPhase !== 'result' || resultEmailSent) return;
    // Short delay to ensure the hidden certificate <div> is in the DOM
    const timer = setTimeout(async () => {
      await sendTestResult(score, skillScores);
      setResultEmailSent(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [testPhase, resultEmailSent]);

  const handleStartTest = () => {
    if (userInfo.email && userInfo.isSchoolStudent !== null) {
      localStorage.setItem(`highway_student_status_${userInfo.email}`, String(userInfo.isSchoolStudent));
    }
    if (userInfo.phone && userInfo.isSchoolStudent !== null) {
      localStorage.setItem(`highway_student_status_${userInfo.phone}`, String(userInfo.isSchoolStudent));
    }
    sendTestRegistration(); // fire-and-forget, non-blocking
    setTestDate(new Date());
    setTestPhase('section_intro');
  };

  const currentSkill = SKILL_ORDER[currentSkillIndex];
  const currentSkillQuestions = ALL_QUESTIONS.filter(q => q.skill === currentSkill);
  const q = currentSkillQuestions[currentQuestionIndex];

  // Anti-cheat visibility detection
  useEffect(() => {
    if (testPhase !== 'testing' && testPhase !== 'section_intro') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCheatCountdown(7);
      } else {
        setCheatCountdown(null);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [testPhase]);

  // Anti-cheat countdown execution
  useEffect(() => {
    if (cheatCountdown === null) return;

    if (cheatCountdown <= 0) {
      setTestPhase('cancelled');
      setCheatCountdown(null);
      return;
    }

    const timer = setInterval(() => {
      setCheatCountdown(prev => prev !== null ? prev - 1 : null);
    }, 1000);

    return () => clearInterval(timer);
  }, [cheatCountdown]);

  // Global Timer Execution
  useEffect(() => {
    if (testPhase !== 'testing' && testPhase !== 'section_intro') return;

    if (timeLeft <= 0) {
      calculateResult();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [testPhase, timeLeft]);

  // Audio Cleanup
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (audioObjRef.current) {
        audioObjRef.current.pause();
        audioObjRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    };
  }, [currentQuestionIndex, currentSkillIndex, testPhase]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  const playAudio = (text: string, questionId: number) => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      if (audioObjRef.current) {
        audioObjRef.current.pause();
        audioObjRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      return;
    }

    const playNativeFallback = () => {
        window.speechSynthesis.cancel(); // Clear any pending speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
    };

    if (questionId) {
        const audioUrl = `/audio/q_${questionId}.mp3`;
        const audio = new Audio(audioUrl);
        audioObjRef.current = audio;
        
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
            playNativeFallback();
        };
        
        audio.play().then(() => {
            setIsPlaying(true);
        }).catch(() => {
            playNativeFallback();
        });
    } else {
        playNativeFallback();
    }
  };

  // validateTextWithApi removed to allow students to submit incorrect/misspelled words

  const isAnswerValid = (ans: any, quest: Question) => {
    if (quest.type === 'multiple_choice' || quest.type === 'true_false') return typeof ans === 'number';
    if (quest.type === 'multiple_select') return Array.isArray(ans) && ans.length > 0;
    if (quest.type === 'text_input') return typeof ans === 'string' && ans.trim().length > 0;
    if (quest.type === 'drag_and_drop') return Array.isArray(ans) && ans.length === (quest.draggableItems?.length || 0);
    if (quest.type === 'matching') {
      if (!ans || typeof ans !== 'object') return false;
      return Object.keys(ans).length === (quest.leftItems?.length || 0);
    }
    return false;
  };

  const handleNext = async () => {
    const ans = answers[q.id];
    if (!isAnswerValid(ans, q) || isValidating) return;

    if (q.type === 'text_input' && typeof ans === 'string') {
      if (ans.trim().length === 0) {
        setValidationError("Please enter your answer.");
        return;
      }
    }

    setValidationError('');
    if (currentQuestionIndex < currentSkillQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Reached end of skill section
      if (currentSkillIndex < SKILL_ORDER.length - 1) {
        setCurrentSkillIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
        setTestPhase('section_intro');
        window.scrollTo(0, 0);
      } else {
        calculateResult();
      }
    }
  };

  const calculateResult = () => {
    let globalCorrect = 0;
    const scoresBySkill: Record<string, { correct: number, total: number }> = {};
    SKILL_ORDER.forEach(s => scoresBySkill[s] = { correct: 0, total: 0 });

    ALL_QUESTIONS.forEach(quest => {
      const ans = answers[quest.id];
      scoresBySkill[quest.skill].total += 1;
      let isCorrect = false;

      if ((quest.type === 'multiple_choice' || quest.type === 'true_false') && ans === quest.correctOption) isCorrect = true;
      else if (quest.type === 'multiple_select' && Array.isArray(ans)) {
        if (quest.correctOptions && JSON.stringify([...ans].sort()) === JSON.stringify([...quest.correctOptions].sort())) isCorrect = true;
      }
      else if (quest.type === 'text_input' && typeof ans === 'string') {
        const userInput = ans.trim().toLowerCase();
        const correctAnswers = quest.correctText?.map(t => t.trim().toLowerCase()) || [];
        if (correctAnswers.includes(userInput) && userInput !== "") isCorrect = true;
      } else if (quest.type === 'drag_and_drop' && Array.isArray(ans)) {
        if (quest.correctOrder && JSON.stringify(ans) === JSON.stringify(quest.correctOrder)) isCorrect = true;
      } else if (quest.type === 'matching' && typeof ans === 'object' && !Array.isArray(ans) && ans !== null) {
        if (quest.correctMatches) {
          let matchesAll = true;
          const keys = Object.keys(quest.correctMatches);
          if (Object.keys(ans).length !== keys.length) matchesAll = false;
          else {
            for (let k of keys) {
              if (ans[k] !== quest.correctMatches[k]) { matchesAll = false; break; }
            }
          }
          if (matchesAll && keys.length > 0) isCorrect = true;
        }
      }

      if (isCorrect) {
        globalCorrect += 1;
        scoresBySkill[quest.skill].correct += 1;
      }
    });

    const finalSkillScores: Record<string, number> = {};
    SKILL_ORDER.forEach(s => {
      const total = scoresBySkill[s].total;
      finalSkillScores[s] = total > 0 ? Math.round((scoresBySkill[s].correct / total) * 100) : 0;
    });

    setSkillScores(finalSkillScores);
    setScore(ALL_QUESTIONS.length > 0 ? Math.round((globalCorrect / ALL_QUESTIONS.length) * 100) : 0);
    setTestDate(new Date());
    setTestPhase('result');
    window.scrollTo(0, 0);
  };

  const getLevel = (scorePercent: number) => {
    if (scorePercent <= 20) return { level: "A0", label: "Novice", color: "text-gray-500", desc: "You are taking your first steps in English. We recommend our Foundations (A0) Program." };
    if (scorePercent <= 30) return { level: "A1", label: "Beginner", color: "text-red-500", desc: "You are at the start of your journey. We recommend our General English (A1) Program." };
    if (scorePercent <= 50) return { level: "A2", label: "Elementary", color: "text-orange-500", desc: "You can communicate in simple situations. We recommend our General English (A2) Program." };
    if (scorePercent <= 70) return { level: "B1", label: "Intermediate", color: "text-yellow-500", desc: "You have a solid foundation. We recommend our General English (B1) Program to help you advance." };
    if (scorePercent <= 85) return { level: "B2", label: "Upper Intermediate", color: "text-blue-500", desc: "You are fluent in many situations. We recommend our General English (B2) Program." };
    return { level: "C1", label: "Advanced", color: "text-green-500", desc: "Excellent! You have a strong command of English. We recommend our General English (C1) Program." };
  };

  const getSkillIcon = (skillName: string, className: string = "w-6 h-6") => {
    switch (skillName) {
      case 'Reading': return <BookOpen className={className} />;
      case 'Writing': return <PenTool className={className} />;
      case 'Listening': return <Headphones className={className} />;
      default: return <BrainCircuit className={className} />;
    }
  };

  // ---------------- RENDERS ----------------
  const t = DASHBOARD_TRANSLATIONS[language as keyof typeof DASHBOARD_TRANSLATIONS];

  if (testPhase === 'welcome') {
    return (
      <div className="bg-dark-900 min-h-screen pt-32 pb-12 flex flex-col items-center p-4 relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-3xl w-full text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4">{t.welcome}</h1>
          <p className="text-lg md:text-xl text-gray-400">{t.subtitle}</p>
        </div>

        <div className="w-full max-w-4xl bg-dark-800 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 bg-dark-900/50 p-4 md:p-8 border-b border-gray-800 items-start gap-y-6 md:gap-y-0">
            {SKILL_ORDER.map(s => (
              <div key={s} className="flex flex-col items-center justify-start p-2 md:p-4 text-center h-full">
                <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center text-orange-500 mb-3 shrink-0">
                  {getSkillIcon(s, "w-6 h-6")}
                </div>
                <div className="h-10 flex items-start justify-center mb-1">
                  <h3 className="font-bold text-white text-xs md:text-sm lg:text-base leading-tight">{t.skills[s as keyof typeof t.skills]}</h3>
                </div>
                <p className="text-[10px] md:text-xs font-bold text-gray-500">{ALL_QUESTIONS.filter(q => q.skill === s).length} {t.questions}</p>
              </div>
            ))}
          </div>

          <div className="p-8 md:p-12 space-y-6 text-gray-300">
            <h3 className="text-white font-bold text-xl mb-4 border-b border-gray-800 pb-4">{t.rulesTitle}</h3>
            <ul className="space-y-4 list-disc px-5 text-sm md:text-base leading-relaxed">
              <li>{t.rule1_1}<strong className="text-white">{t.rule1_time}</strong>{t.rule1_2}</li>
              <li>{t.rule2}</li>
              <li>{t.rule3}</li>
              <li>{t.rule4}</li>
            </ul>

            <div className="mt-8 p-6 bg-red-900/20 border border-red-900/50 rounded-xl flex gap-4 items-start">
              <ShieldAlert className="w-8 h-8 text-red-500 shrink-0" />
              <div>
                <h4 className="text-red-400 font-bold mb-1">{t.antiCheatTitle}</h4>
                <p className="text-sm text-red-300/80">{t.antiCheatDesc}</p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-800 pt-6">
              <h4 className="text-white font-bold mb-4">Required Information for Certification</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                  <input type="text" value={userInfo.fullName} onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors" placeholder="e.g. Kenza Elmkaddem" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <div className="relative">
                    <input 
                        type="email" 
                        value={userInfo.email} 
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} 
                        onBlur={() => checkExistingStudentStatus()}
                        className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors" 
                        placeholder="e.g. kenza@example.com" 
                    />
                    {isCheckingEmail && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number (Morocco Only)</label>
                  <div className={`flex w-full bg-dark-900 border ${userInfo.phone.length > 4 && !/^\+212(0?[567])[0-9]{8}$/.test(userInfo.phone) ? 'border-red-500' : 'border-gray-700'} rounded-lg overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-colors`}>
                    <div className="bg-dark-800 text-gray-400 p-3 select-none border-r border-gray-700 flex items-center justify-center font-medium pointer-events-none">
                      +212
                    </div>
                    <input
                      type="text"
                      value={userInfo.phone.replace(/^\+212/, '')}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        const limit = val.startsWith('0') ? 10 : 9;
                        setUserInfo({ ...userInfo, phone: '+212' + val.slice(0, limit) });
                      }}
                      onBlur={() => checkExistingStudentStatus()}
                      className="w-full bg-transparent p-3 text-white outline-none"
                      placeholder="6XXXXXXXX or 06XXXXXXXX"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format: 9 digits starting with 5, 6, 7 (or 10 digits starting with 0).</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Are you currently a student at Highway Academy? (هل أنت طالب حالي في أكاديمية هايواي؟)</label>
                  
                  {isStudentStatusLocked ? (
                    <div className="mb-3 text-xs text-orange-500 bg-orange-500/10 p-2 rounded border border-orange-500/20">
                      You have already chosen this option previously. It cannot be changed. (لقد قمت باختيار هذا الخيار مسبقاً، ولا يمكن تغييره).
                    </div>
                  ) : (
                    <div className="mb-3 text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded border border-yellow-500/20 flex items-start gap-2">
                      <span className="mt-0.5">⚠️</span>
                      <p>Note: Please make sure to choose correctly. This choice is permanent and cannot be changed if you retake the test. (ملاحظة: يرجى الاختيار بدقة، هذا الخيار دائم ولا يمكن تغييره لاحقاً).</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button type="button" disabled={isStudentStatusLocked} onClick={() => setUserInfo({ ...userInfo, isSchoolStudent: true })} className={`flex-1 py-3 rounded-lg border text-center transition-colors ${userInfo.isSchoolStudent === true ? 'bg-orange-600 border-orange-500 text-white' : 'bg-dark-900 border-gray-700 text-gray-300 hover:border-orange-500'} ${isStudentStatusLocked && userInfo.isSchoolStudent !== true ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      Yes / نعم
                    </button>
                    <button type="button" disabled={isStudentStatusLocked} onClick={() => setUserInfo({ ...userInfo, isSchoolStudent: false })} className={`flex-1 py-3 rounded-lg border text-center transition-colors ${userInfo.isSchoolStudent === false ? 'bg-orange-600 border-orange-500 text-white' : 'bg-dark-900 border-gray-700 text-gray-300 hover:border-orange-500'} ${isStudentStatusLocked && userInfo.isSchoolStudent !== false ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      No / لا
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 border-t border-gray-800 bg-dark-900/50 flex justify-center">
            <Button disabled={!isFormValid} onClick={handleStartTest} className={`w-full max-w-sm text-lg py-4 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}>{t.startBtn}</Button>
          </div>
        </div>
      </div>
    );
  }

  if (testPhase === 'section_intro') {
    return (
      <div className="bg-dark-900 min-h-screen pt-32 pb-12 flex flex-col items-center p-4">
        <div className="max-w-2xl w-full text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4">{currentSkill}</h1>
          <p className="text-lg md:text-xl text-gray-400">You are about to start the {currentSkill.toLowerCase()} section.</p>
        </div>

        <div className="w-full max-w-2xl bg-dark-800 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl text-center">
          <div className="bg-dark-900/50 p-12 border-b border-gray-800 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-orange-600/10 flex items-center justify-center text-orange-500 mb-6">
              {getSkillIcon(currentSkill, "w-10 h-10")}
            </div>
            <h3 className="font-bold text-2xl text-white mb-2">{currentSkill}</h3>
            <p className="font-bold text-gray-500 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" /> {formatTime(timeLeft)} remaining overall
            </p>
          </div>

          <div className="p-8 md:p-12 space-y-4 text-gray-300 text-left">
            <ul className="space-y-4 list-disc pl-5 text-sm md:text-base leading-relaxed">
              <li>The questions in this section may get harder or easier to adapt to your level.</li>
              <li>You will not lose points for incorrect answers.</li>
              <li>Once you submit an answer, you cannot go back.</li>
            </ul>
          </div>

          <div className="p-6 md:p-8 border-t border-gray-800 bg-dark-900/50 flex justify-center">
            <Button onClick={() => setTestPhase('testing')} className="w-full max-w-xs text-lg py-3">Start Section</Button>
          </div>
        </div>
      </div>
    );
  }

  if (testPhase === 'cancelled') {
    return (
      <div className="bg-dark-900 min-h-screen pt-32 md:pt-40 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-red-900/10 border border-red-900/50 rounded-2xl p-8 md:p-12 max-w-xl w-full text-center shadow-2xl"
        >
          <ShieldAlert className="w-24 h-24 text-red-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4 text-red-500">Test Cancelled</h1>
          <p className="text-gray-300 mb-8 leading-relaxed">
            You have violated the testing rules by leaving the active tab or window. To maintain the integrity of the language test, your session has been terminated and your progress was not saved.
          </p>
          <Link to="/">
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">Return to Home</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (testPhase === 'result') {
    const resultData = getLevel(score);
    return (
      <div className="bg-dark-900 min-h-screen pt-24 pb-12 flex flex-col items-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full text-center mb-8 md:mb-12"
        >
          <h2 className="text-xl md:text-2xl text-gray-400 mb-2">Overall Language Level</h2>
          <h1 className={`text-5xl md:text-7xl font-bold mb-4 ${resultData.color}`}>{resultData.level}</h1>
          <h3 className="text-xl md:text-2xl text-white font-medium mb-4 md:mb-6">{resultData.label} ({score}%)</h3>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed px-4 md:px-0">{resultData.desc}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="w-full max-w-4xl bg-dark-800 rounded-2xl border border-gray-800 p-8 md:p-12 shadow-2xl mb-12"
        >
          <h3 className="text-white font-bold text-xl mb-8 border-b border-gray-800 pb-4 text-center">Section Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-start">
            {SKILL_ORDER.map((skill, idx) => {
              const skillScore = skillScores[skill] || 0;
              const skillLevel = getLevel(skillScore);
              return (
                <FadeIn key={skill} delay={0.3 + (idx * 0.1)}>
                  <CircularProgress percentage={skillScore} label={skill} level={`${skillLevel.level} ${skillLevel.label}`} />
                </FadeIn>
              );
            })}
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl w-full justify-center mt-4">
          <Link to="/programs" state={{ tab: 'language', highlight: 'general-english', testLevel: resultData.level, testResultId: testResultIdRef.current || testResultId, userInfo }} className="w-full sm:w-auto">
            <Button className="w-full py-4 px-8">View Recommended Courses</Button>
          </Link>
          <Button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="w-full sm:w-auto py-4 px-8 bg-dark-800 border border-gray-700 text-white hover:bg-dark-700 flex items-center justify-center gap-2"
          >
            {isGeneratingPDF ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {isGeneratingPDF ? "Generating PDF..." : "Download Certificate PDF"}
          </Button>
        </div>

        {/* Hidden Certificate Component for PDF Generation */}
        <div className="absolute top-[-9999px] left-[-9999px]">
          <div ref={certificateRef}>
            <CertificateComponent userInfo={userInfo} testDate={testDate} score={score} skillScores={skillScores} getLevel={getLevel} />
          </div>
        </div>
      </div>
    );
  }

  // TESTING PHASE
  const previousSkills = SKILL_ORDER.slice(0, currentSkillIndex);
  const previousQuestionsCount = previousSkills.reduce((acc, skill) => acc + ALL_QUESTIONS.filter(q => q.skill === skill).length, 0);
  const progress = Math.min(((previousQuestionsCount + currentQuestionIndex) / ALL_QUESTIONS.length) * 100, 100);

  return (
    <div className="bg-dark-900 min-h-screen pt-24 md:pt-32 pb-12 px-2 md:px-4 relative">
      {/* Cheat Countdown Overlay */}
      <AnimatePresence>
        {cheatCountdown !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-red-900/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center"
          >
            <ShieldAlert className="w-32 h-32 text-red-500 mb-8 animate-pulse" />
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-2 md:mb-4">WARNING</h1>
            <p className="text-lg md:text-2xl text-red-200 mb-6 md:mb-8 max-w-2xl">Return to this tab immediately! Your test will be cancelled in:</p>
            <div className="text-7xl md:text-9xl font-black text-white">{cheatCountdown}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex flex-row justify-between items-center px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-600/10 flex items-center justify-center text-orange-500">
              {getSkillIcon(currentSkill, "w-5 h-5")}
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white leading-tight">{currentSkill}</h1>
              <p className="text-gray-400 text-xs md:text-sm">Question {currentQuestionIndex + 1} of {currentSkillQuestions.length}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-orange-500 font-bold md:text-lg mb-1">
              <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
            </div>
            <p className="text-gray-500 text-xs">{Math.round(progress)}% Complete</p>
          </div>
        </div>

        <div className="bg-gray-800 h-2 rounded-full mb-8 overflow-hidden mx-2 md:mx-0">
          <motion.div className="h-full bg-orange-600" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
        </div>

        <div className="bg-dark-800/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-gray-800 p-4 md:p-10 shadow-lg min-h-[400px] flex flex-col relative overflow-hidden mx-1 md:mx-2">
          <AnimatePresence mode='popLayout'>
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, position: 'absolute' }} transition={{ duration: 0.3 }}
              className="w-full h-full flex-1 flex flex-col"
            >
              {q.passage && (
                <div className="bg-dark-900/50 border border-gray-700 p-4 md:p-6 rounded-xl mb-6 text-gray-300 leading-relaxed italic text-sm md:text-base shadow-inner">
                  "{q.passage}"
                </div>
              )}

              {q.audioText && (
                <div className="mb-6 flex flex-col items-center justify-center bg-dark-900/30 p-6 rounded-xl border border-dashed border-gray-700">
                  <button
                    onClick={() => playAudio(q.audioText!, q.id)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-orange-600 hover:bg-orange-700 text-white hover:scale-105'}`}
                  >
                    {isPlaying ? <Square className="w-6 h-6 fill-current" /> : <Volume2 className="w-8 h-8 pl-1" />}
                  </button>
                  <span className="text-gray-400 text-xs mt-3">{isPlaying ? 'Stop Audio' : 'Play Audio'}</span>
                </div>
              )}

              <h2 className="text-lg md:text-2xl font-medium text-white mb-6 md:mb-8 leading-relaxed">{q.question}</h2>

              <div className="space-y-3">
                {(q.type === 'multiple_choice' || q.type === 'true_false') && q.options?.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => { const newA = { ...answers }; newA[q.id] = idx; setAnswers(newA); }}
                    className={`w-full text-left p-3 md:p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group text-sm md:text-base ${answers[q.id] === idx ? 'bg-orange-600/10 border-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.1)]' : 'bg-dark-900 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-dark-900/80 hover:shadow-md'}`}
                  >
                    <span className="pr-2">{option}</span>
                    {answers[q.id] === idx && <CheckCircle2 className="w-5 h-5 text-orange-600" />}
                  </button>
                ))}

                {q.type === 'multiple_select' && q.options?.map((option, idx) => {
                  const selected = (answers[q.id] || []) as number[];
                  const isSelected = selected.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        let newSelected = [...selected];
                        if (isSelected) newSelected = newSelected.filter(i => i !== idx);
                        else newSelected.push(idx);
                        const newA = { ...answers }; newA[q.id] = newSelected; setAnswers(newA);
                      }}
                      className={`w-full text-left p-3 md:p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group text-sm md:text-base ${isSelected ? 'bg-orange-600/10 border-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.1)]' : 'bg-dark-900 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-dark-900/80 hover:shadow-md'}`}
                    >
                      <span className="pr-2">{option}</span>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'border-orange-600 bg-orange-600' : 'border-gray-600'}`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })}

                {q.type === 'text_input' && (
                  <div className="w-full">
                    <input
                      type="text"
                      className={`w-full bg-dark-900 border ${validationError ? 'border-red-500 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-gray-700 hover:border-gray-500 focus:border-orange-600 shadow-[0_4px_20px_rgba(0,0,0,0.1)]'} rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:bg-orange-600/5 focus:outline-none transition-all duration-200`}
                      placeholder="Type your answer here..."
                      value={(answers[q.id] as string) || ""}
                      onChange={(e) => { setValidationError(''); const newA = { ...answers }; newA[q.id] = e.target.value; setAnswers(newA); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                    />
                    {validationError && <p className="text-red-500 text-sm mt-3 flex items-center gap-2"><AlertCircle size={16} /> {validationError}</p>}
                  </div>
                )}

                {q.type === 'drag_and_drop' && <DragAndDropQuestionUI question={q} value={answers[q.id]} onChange={(v) => { const newA = { ...answers }; newA[q.id] = v; setAnswers(newA); }} />}
                {q.type === 'matching' && <MatchingQuestionUI question={q} value={answers[q.id]} onChange={(v) => { const newA = { ...answers }; newA[q.id] = v; setAnswers(newA); }} />}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 md:mt-10 pt-4 md:pt-6 border-t border-gray-700/50 flex justify-end items-center gap-1 md:gap-2">
            <Button
              onClick={handleNext}
              className="px-3 md:px-8 py-2 md:py-3 text-[11px] md:text-base flex items-center justify-center gap-1 md:gap-2 font-bold shadow-lg shadow-orange-900/20 tracking-tight"
              disabled={!isAnswerValid(answers[q.id], q) || isValidating}
            >
              {isValidating ? (
                <><RefreshCcw className="w-3 h-3 md:w-5 md:h-5 animate-spin shrink-0" /> Verifying...</>
              ) : (
                <>
                  <span>{currentQuestionIndex === currentSkillQuestions.length - 1 ? (currentSkillIndex === SKILL_ORDER.length - 1 ? 'Finish Test' : 'Next Section') : 'Next Question'}</span>
                  <ChevronRight className="w-3 h-3 md:w-5 md:h-5 shrink-0" />
                </>
              )}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay }}>
    {children}
  </motion.div>
);

const CertificateComponent = ({ userInfo, testDate, score, skillScores, getLevel }: any) => {
  const resultData = getLevel(score);
  const dateStr = testDate ? testDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div className="bg-white w-[800px] h-[1800px] p-0 flex flex-col items-center relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif', color: '#1a202c' }}>
      {/* Header */}
      <div className="w-full flex flex-col items-center pt-0 pb-6 bg-white z-10">
        <div className="flex items-center justify-center mb-0 mt-2">
          <img
            src="/logo-dark.png"
            alt="Highway Academy Logo"
            className="h-[276px] w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center w-full max-w-2xl mb-12 -mt-10 px-4 relative z-20">
          <div className="flex-grow h-px bg-[#ea580c] opacity-40"></div>
          <div className="bg-[#ea580c] text-white px-8 pt-0 pb-4 mx-4 rounded-md text-sm font-bold tracking-[0.2em] shadow-sm uppercase">
            English Certificate
          </div>
          <div className="flex-grow h-px bg-[#ea580c] opacity-40"></div>
        </div>
        <p className="text-gray-500 text-sm font-medium mt-2 mb-2">This is to certify that</p>
        <h1 className="text-5xl font-bold text-gray-900 mb-2">{userInfo.fullName}</h1>
        <p className="text-gray-600 text-base leading-relaxed max-w-lg text-center">
          has successfully completed the Highway Academy English Assessment on <span className="font-bold text-gray-900">{dateStr}</span> and has earned level:
        </p>
      </div>

      {/* Center Graphic */}
      <div className="relative w-[380px] h-[380px] flex items-center justify-center my-2 z-10">
        {/* 8-pointed star effect using rotated squares */}
        <div className="absolute inset-0 flex items-center justify-center opacity-80">
          <div className="w-[280px] h-[280px] bg-orange-200/50 transform rotate-0 absolute">
            <div className="w-full h-full border-[15px] border-orange-400/20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(234, 88, 12, 0.2) 5px, rgba(234, 88, 12, 0.2) 10px)' }}></div>
          </div>
          <div className="w-[280px] h-[280px] bg-orange-300/40 transform rotate-45 absolute">
            <div className="w-full h-full border-[15px] border-orange-500/30" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(234, 88, 12, 0.3) 5px, rgba(234, 88, 12, 0.3) 10px)' }}></div>
          </div>
        </div>

        {/* Center Badge */}
        <div className="relative z-10 text-center flex flex-col items-center justify-center h-full pb-4">
          <div className="font-bold text-white text-xl mb-2 drop-shadow-md">HIGHWAY ACADEMY</div>
          <div className="text-[76px] font-black text-white drop-shadow-lg mb-8 leading-none">{score}/100</div>
          <div className="text-2xl font-bold text-white drop-shadow-md">{resultData.level} {resultData.label}</div>
        </div>
      </div>

      {/* Bottom Section - Blue Background */}
      <div className="absolute bottom-0 left-0 w-full bg-[#eff6ff] pt-[220px] pb-16 px-12 flex flex-col items-center" style={{ height: '1100px' }}>
        <div className="w-full absolute top-[-50px] flex justify-center">
          <div className="w-[800px] h-[100px] bg-[#eff6ff] rounded-[50%_50%_0_0/100%_100%_0_0]"></div>
        </div>

        <h2 className="text-[30px] font-bold text-[#1a202c] mb-10 relative z-20 tracking-tight">Understanding the results</h2>

        <div className="w-full max-w-3xl flex flex-col gap-6 relative z-20">
          {/* Headers */}
          <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
            <div className="font-bold text-sm text-gray-800">HIGHWAY</div>
            <div className="grid grid-cols-6 gap-2">
              {['0-20', '21-30', '31-40', '41-50', '51-60', '61-70'].map((range, i) => (
                <div key={i} className={`flex items-center justify-center h-[64px] text-center font-bold text-xl leading-none ${score >= parseInt(range.split('-')[0]) && score <= parseInt(range.split('-')[1] || '100') ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-gray-500'}`}>{range === '61-70' ? '71-100' : range}</div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
            <div className="font-bold text-sm text-gray-800">CEFR</div>
            <div className="grid grid-cols-6 gap-2">
              {[
                { l: 'A0', d: 'Novice' }, { l: 'A1', d: 'Beginner' }, { l: 'A2', d: 'Elementary' },
                { l: 'B1', d: 'Intermediate' }, { l: 'B2', d: 'Upper\nIntermediate' }, { l: 'C1', d: 'Advanced' }
              ].map((level, i) => {
                const isCurrent = resultData.level === level.l || (resultData.level === 'C2' && level.l === 'C1');
                const displayL = resultData.level === 'C2' && i === 5 ? 'C2' : level.l;
                const displayD = resultData.level === 'C2' && i === 5 ? 'Proficient' : level.d;
                return (
                  <div key={i} className={`flex flex-col items-center justify-center text-center h-[64px] ${isCurrent ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-gray-500'}`}>
                    <div className="font-bold text-xl leading-none mb-1">{displayL}</div>
                    <div className="text-[11px] leading-none whitespace-pre-line">{displayD}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-gray-600 max-w-2xl mt-8 mb-4 relative z-20 leading-loose">
          The achieved level is <span className="font-bold">{score}/100</span> on the Highway Academy score scale and <span className="font-bold">{resultData.level} {resultData.label}</span> according to the Common European Framework of Reference (CEFR). The score is calculated as an average of the skill section scores.
        </p>

        {/* Bottom Stats Cards */}
        <div className="w-full max-w-[740px] bg-[#1c1c1c] rounded-2xl shadow-lg p-8 mt-5 flex flex-col relative z-20">
          <h3 className="text-white font-bold text-[19px] mb-8 border-b border-[#2a323c] pb-5 text-center tracking-wide">Section Breakdown</h3>
          <div className="flex justify-between w-full">
            {['Grammar & Vocabulary', 'Reading', 'Listening', 'Writing'].map(skill => {
              const sScore = skillScores[skill] || 0;
              const sLevel = getLevel(sScore);
              const radius = 34;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (sScore / 100) * circumference;
              return (
                <div key={skill} className="flex flex-col items-center flex-1 px-2">
                  <div className="relative w-[88px] h-[88px] mb-5">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r={radius} stroke="#2a323c" strokeWidth="6" fill="transparent" />
                      <circle cx="40" cy="40" r={radius} stroke="#ea580c" strokeWidth="6" strokeLinecap="round" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[#ea580c] font-bold text-2xl">
                      <span className="relative top-[-10px]">{sScore}</span>
                    </div>
                  </div>
                  <div className="font-bold text-[15px] text-white text-center leading-tight mb-1.5">{skill}</div>
                  <div className="text-[13px] text-gray-400 font-normal">{sLevel.level} {sLevel.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* User Info Container (Moved to bottom) */}
        <div className="w-full max-w-[740px] flex flex-col items-center mt-6 relative z-20 bg-white/60 border border-blue-100 rounded-xl p-5 shadow-sm">
          <div className="text-sm font-bold text-gray-800 mb-3 border-b border-blue-100 pb-2 px-8">Candidate Info:</div>
          <div className="flex items-center justify-center gap-12 w-full">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest mb-1.5">Email Address</span>
              <span className="text-sm font-bold text-gray-800">{userInfo.email}</span>
            </div>
            <div className="w-[1px] h-8 bg-blue-100"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest mb-1.5">Phone Number</span>
              <span className="text-sm font-bold text-gray-800">{userInfo.phone}</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 text-xs font-bold text-gray-500 z-20">highwayacademy.ma</div>
      </div>
    </div>
  );
};

export default EnglishTest;