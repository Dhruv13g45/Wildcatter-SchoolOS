import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle.jsx';
import {
  School,
  Bot,
  MessageSquare,
  CreditCard,
  CalendarDays,
  FileSearch,
  Bus,
  Network,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Users,
  Sparkles,
  Zap,
  ChevronRight,
  Lock,
  Cpu,
  Monitor,
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [activeRole, setActiveRole] = useState('Admin');

  const userFlowSteps = [
    {
      step: '01',
      title: 'Easy WhatsApp Admissions',
      tag: 'For Parents & Students',
      icon: MessageSquare,
      summary:
        'No more long paper admission forms. Parents simply send a message on WhatsApp, attach the student’s marksheet, and receive an instant admission evaluation.',
      details: [
        'Parents can apply from anywhere using WhatsApp',
        'Upload Class 10 marksheets or certificates directly in chat',
        'Automatic eligibility check saves hours of manual desk work',
      ],
    },
    {
      step: '02',
      title: 'Instant Document & Stream Qualification',
      tag: 'AI Assistant',
      icon: Bot,
      summary:
        'The Admissions AI reads grades from uploaded marksheets, calculates total percentages, and suggests whether the student qualifies for Science, Commerce, or Arts.',
      details: [
        'Scans marks in less than half a second',
        'Matches student strengths with school cutoff criteria',
        'Instantly creates the student profile in the school records',
      ],
    },
    {
      step: '03',
      title: 'One Unified School Directory',
      tag: 'Connected Profiles',
      icon: Network,
      summary:
        'Students, teachers, parents, and alumni live in one shared school record. As students graduate into alumni, their history stays intact without duplicate files.',
      details: [
        'Eliminates lost records and disconnected spreadsheets',
        'Tracks academic progress, awards, and certifications over time',
        'Connects students to their campus, bus route, and fee bills',
      ],
    },
    {
      step: '04',
      title: 'Instant Teacher Substitutions',
      tag: 'Under 10 Seconds',
      icon: CalendarDays,
      summary:
        'When a teacher calls in sick, the Timetable Assistant automatically finds an available teacher who teaches the same subject and reassigns the period in seconds.',
      details: [
        'Finds and assigns qualified replacements in under 10 seconds',
        'Balances teacher workloads so no one is overloaded',
        'Notifies students and administrators of schedule updates instantly',
      ],
    },
    {
      step: '05',
      title: 'Chalkboard Lesson Tracker',
      tag: 'Academic Assistance',
      icon: FileSearch,
      summary:
        'Teachers can snap a quick photo of their classroom blackboard at the end of class. The system checks covered topics against the official CBSE or ICSE syllabus.',
      details: [
        'Extracts handwritten lesson notes and formulas from photos',
        'Flags whether teaching is on pace or running behind schedule',
        'Helps teachers finish the annual curriculum on time',
      ],
    },
    {
      step: '06',
      title: 'Automatic Fee Payments & Split Transfers',
      tag: 'School Finance',
      icon: CreditCard,
      summary:
        'Parents pay fees online with one click. Payments automatically route shares to the school account, bus contractor, and uniform vendor in a single payment.',
      details: [
        'Direct payment links sent to parents on WhatsApp',
        'Automated split transfers to contractors and vendor accounts',
        'Instant digital receipts and scholarship waiver deductions',
      ],
    },
    {
      step: '07',
      title: 'Live School Bus Tracker & Alerts',
      tag: 'Student Safety',
      icon: Bus,
      summary:
        'Parents and school transport heads can track school buses live on the road, check arrival times, and receive automatic alerts 5 minutes before the bus arrives.',
      details: [
        'Live GPS speed and location updates on school buses',
        'Automatic arrival alerts sent to parents before pickup',
        'Eliminates anxious morning calls to the front desk',
      ],
    },
  ];

  const roleProfiles = {
    Admin: {
      title: 'School Principals & Administrators',
      description: 'Complete visibility into all school operations, finances, and staffing.',
      capabilities: [
        'Executive dashboard showing active students, fee collections, and staff',
        'Automatic fee split payments across tuition, bus operators, and uniform vendors',
        'Manage campuses across CBSE, ICSE, and IB boards',
        'Review automated actions taken by all 6 AI school assistants',
      ],
    },
    Faculty: {
      title: 'Teachers & Department Heads',
      description: 'Focus on teaching while automated tools handle logistics and schedules.',
      capabilities: [
        'Automatic substitute coverage whenever you need to take sick leave',
        'Upload blackboard photos to check lesson pacing against the board syllabus',
        'View daily timetables and assigned classroom labs',
        'Manage student attendance and grades with zero manual paperwork',
      ],
    },
    Student: {
      title: 'Students & Alumni',
      description: 'Easy access to your daily schedule, exam info, and school history.',
      capabilities: [
        'View your updated daily period schedule with live substitute teacher info',
        'Check upcoming subject lessons and study topics',
        'Graduates transition smoothly to alumni status keeping all past records',
        'Direct access to fee receipts and academic achievements',
      ],
    },
    Applicant: {
      title: 'Parents & New Applicants',
      description: 'Smooth, friendly admissions and complete peace of mind for student safety.',
      capabilities: [
        'Apply for school admission right from WhatsApp without tedious paper forms',
        'Receive instant admission recommendations based on Class 10 marks',
        'Track your child’s school bus live and get arrival alerts',
        'Pay tuition fees easily with secure digital checkout links',
      ],
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white flex flex-col transition-colors duration-200">
      {/* Top Header with Breathing Room */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl px-6 sm:px-10 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  School<span className="text-indigo-600 dark:text-indigo-400">OS</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-md">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-zinc-500 hidden sm:block">
                All-in-One School Operating System
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <ThemeToggle />
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Generous Breathing Room */}
      <section className="relative pt-16 pb-24 px-6 sm:px-12 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Smart School Management Made Simple</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            The Complete School Operating System for <span className="text-indigo-600 dark:text-indigo-400">Modern Education</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            SchoolOS connects parents, teachers, students, and administrators on one smooth platform. Parents apply over WhatsApp, sick teachers get instant substitutes, fee payments split automatically, and buses send live arrival alerts.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Create School Account</span>
            </Link>

            <Link
              to="/login"
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-zinc-900 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition flex items-center space-x-2 shadow-sm"
            >
              <Lock className="w-4 h-4 text-indigo-500" />
              <span>Sign In</span>
            </Link>

            <button
              onClick={() => {
                const el = document.getElementById('user-flow');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3.5 rounded-2xl text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-semibold text-sm transition flex items-center space-x-1.5"
            >
              <span>See How Everything Works</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Highlights Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-zinc-400">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>WhatsApp Inbound Admissions</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Instant Teacher Substitution (&lt;10s)</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Live School Bus GPS Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Interactive Guide with Breathing Room */}
      <section id="user-flow" className="py-20 px-6 sm:px-12 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Step-by-Step Tour</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              How Everything Works in SchoolOS
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Explore how each feature works to make school days smooth, organized, and stress-free.
            </p>
          </div>

          {/* Stepper Grid with Generous Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Step Selection List */}
            <div className="lg:col-span-5 space-y-3">
              {userFlowSteps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeStep === idx;
                return (
                  <button
                    key={step.step}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start space-x-3.5 ${
                      isActive
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-950/70 dark:border-indigo-500 dark:text-white shadow-md'
                        : 'bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                    }`}
                  >
                    <span className={`font-mono text-xs font-bold mt-0.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                      {step.step}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold">{step.title}</h3>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                      </div>
                      <p className={`text-xs mt-0.5 ${isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-400'}`}>{step.tag}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step Details Display Card */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                    Step {userFlowSteps[activeStep].step} • {userFlowSteps[activeStep].tag}
                  </span>
                  <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400">
                    {React.createElement(userFlowSteps[activeStep].icon, { className: 'w-5 h-5' })}
                  </div>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {userFlowSteps[activeStep].title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                  {userFlowSteps[activeStep].summary}
                </p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Key Benefits:
                  </h4>
                  <ul className="space-y-2.5">
                    {userFlowSteps[activeStep].details.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-sm text-slate-700 dark:text-zinc-200">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200/80 dark:border-zinc-800">
                  <button
                    onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : userFlowSteps.length - 1))}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    ← Previous Step
                  </button>

                  <button
                    onClick={() => setActiveStep((prev) => (prev < userFlowSteps.length - 1 ? prev + 1 : 0))}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Showcase Section with Breathing Room */}
      <section className="py-20 px-6 sm:px-12 bg-slate-50 dark:bg-zinc-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Designed for Every Role in School
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Select your role below to see how SchoolOS simplifies your daily work.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Object.keys(roleProfiles).map((r) => (
              <button
                key={r}
                onClick={() => setActiveRole(r)}
                className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition shadow-xs ${
                  activeRole === r
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                }`}
              >
                {r === 'Applicant' ? 'Parent / Applicant' : r === 'Faculty' ? 'Teacher' : r}
              </button>
            ))}
          </div>

          {/* Active Role Card */}
          <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Tailored for {activeRole === 'Applicant' ? 'Parents' : activeRole}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {roleProfiles[activeRole].title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                {roleProfiles[activeRole].description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
              {roleProfiles[activeRole].capabilities.map((cap, i) => (
                <div key={i} className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700 dark:text-zinc-300 leading-snug">{cap}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <Link
                to={`/register?role=${activeRole}`}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center space-x-2"
              >
                <span>Register as {activeRole === 'Applicant' ? 'Parent' : activeRole}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-12 border-t border-slate-200 dark:border-zinc-800 text-center text-xs text-slate-400 dark:text-zinc-500">
        <p>© 2026 SchoolOS Enterprise — All-in-One School Operating System.</p>
      </footer>
    </div>
  );
};
