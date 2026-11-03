import React, { useEffect, useRef, useState } from 'react';
import {
  Mail,
  ExternalLink,
  Code,
  Server,
  Database,
  Layout,
  Menu,
  X,
  Sun,
  Moon,
  Cpu,
  Briefcase,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';

const profileImg = '/profile.jpg';

const projects = [
  {
    slug: 'sim-mahasiswa',
    title: 'SIM Mahasiswa',
    desc: 'Aplikasi Sistem Informasi Akademik berbasis web untuk pengelolaan data mahasiswa menggunakan Laravel, PHP, dan MySQL.',
    tech: ['Laravel', 'PHP', 'MySQL', 'Tailwind CSS'],
    image: '/sim-mahasiswa.png',
  },
  {
    slug: 'kedai-hitam-putih',
    title: 'Kedai Hitam Putih - Perancangan & Prototype Design',
    desc: 'Perancangan antarmuka dan pembuatan prototype design untuk sistem manajemen Kedai Hitam Putih.',
    tech: ['UI/UX Design', 'Figma', 'Prototype'],
    image: '/kedai-hitam-putih.png',
  },
  {
    slug: 'pengawas-proyek',
    title: 'Pengawas Proyek Lapangan',
    desc: 'Mengawasi aktivitas proyek di lapangan, mengoordinasikan pekerja, dan memantau progres pekerjaan.',
    tech: ['Koordinasi Tim', 'Pengawasan', 'Komunikasi'],
    image: '/pengawas-proyek.png',
  },
];

const academicProjects = projects.filter(
  (project) => project.slug !== 'pengawas-proyek',
);

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const scrollProgressRef = useRef(null);
  const spotlightCardRef = useRef(null);
  const [projectSlug, setProjectSlug] = useState(() =>
    window.location.hash.startsWith('#/proyek/')
      ? window.location.hash.slice('#/proyek/'.length)
      : '',
  );
  const selectedProject = projects.find(
    (project) => project.slug === projectSlug,
  );1

  const accentText = darkMode ? 'text-violet-300' : 'text-violet-800';
  const accentHoverText = darkMode
    ? 'hover:text-violet-200'
    : 'hover:text-violet-900';
  const navText = darkMode ? 'text-slate-300' : 'text-slate-800';

  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  const clearSpotlight = (card) => {
    card?.style.removeProperty('--pointer-x');
    card?.style.removeProperty('--pointer-y');
    if (spotlightCardRef.current === card) spotlightCardRef.current = null;
  };

  const handlePointerMove = (event) => {
    if (event.pointerType !== 'mouse') return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const card = target.closest('.interactive-card');
    if (!card) {
      clearSpotlight(spotlightCardRef.current);
      return;
    }

    if (spotlightCardRef.current !== card) {
      clearSpotlight(spotlightCardRef.current);
      spotlightCardRef.current = card;
    }

    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  };

  const handlePointerOut = (event) => {
    if (!(event.target instanceof Element)) return;

    const card = event.target.closest('.interactive-card');
    const nextTarget =
      event.relatedTarget instanceof Element
        ? event.relatedTarget.closest('.interactive-card')
        : null;
    if (card && card !== nextTarget) clearSpotlight(card);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setProjectSlug(
        hash.startsWith('#/proyek/') ? hash.slice('#/proyek/'.length) : '',
      );
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight > 0
          ? Math.min(window.scrollY / scrollableHeight, 1)
          : 0;
      if (!scrollProgressRef.current) return;
      scrollProgressRef.current.style.transform = `scaleX(${progress})`;
      scrollProgressRef.current.setAttribute(
        'aria-valuenow',
        String(Math.round(progress * 100)),
      );
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    updateProgress();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const revealObserver = reduceMotion
      ? null
      : new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
        );
    const activeSectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    sections.forEach((section) => {
      activeSectionObserver.observe(section);
      if (section.id !== 'home' && revealObserver) {
        section.classList.add('reveal-pending');
        revealObserver.observe(section);
      }
    });

    return () => {
      revealObserver?.disconnect();
      activeSectionObserver.disconnect();
    };
  }, [projectSlug]);

  useEffect(() => {
    if (projectSlug || window.location.hash !== '#projects') return undefined;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [projectSlug]);

  const skills = [
    {
      name: 'React.js / Frontend',
      icon: <Code className={`w-6 h-6 ${accentText}`} />,
    },
    {
      name: 'Laravel & PHP',
      icon: <Server className="w-6 h-6 text-red-500" />,
    },
    {
      name: 'Node.js & Python',
      icon: <Database className="w-6 h-6 text-green-500" />,
    },
    {
      name: 'Figma UI/UX Design',
      icon: <Layout className="w-6 h-6 text-pink-500" />,
    },
    {
      name: 'MySQL & Database',
      icon: <Database className="w-6 h-6 text-indigo-400" />,
    },
    {
      name: 'C/C++ & Processing',
      icon: <Cpu className="w-6 h-6 text-amber-400" />,
    },
  ];

  const hobbies = [
    {
      name: 'Mobile Legends (Gaming)',
      icon: (
        <img
          src="/mobile-legends-55.png"
          alt="Ikon Mobile Legends 5v5"
          className="w-full h-full object-cover"
        />
      ),
      desc: 'Bermain game MOBA secara kompetitif dan kasual.',
    },
  ];

  const navLinks = [
    { label: 'Beranda', href: '#home' },
    { label: 'Tentang', href: '#about' },
    { label: 'Pengalaman', href: '#experience' },
    { label: 'Hobi', href: '#hobbies' },
    { label: 'Keahlian', href: '#skills' },
    { label: 'Proyek', href: '#projects' },
    { label: 'Kontak', href: '#contact' },
  ];

  const sectionClass = 'py-20 px-6';
  const containerClass = 'max-w-6xl mx-auto';
  const cardClass = darkMode
    ? 'bg-slate-900 border-slate-800'
    : 'bg-white border-slate-200 shadow-sm';

  const mutedText = darkMode ? 'text-slate-400' : 'text-slate-600';
  const headingText = darkMode ? 'text-white' : 'text-slate-900';

  if (selectedProject) {
    return (
      <main
        className={`project-detail-page min-h-screen px-6 py-10 sm:py-16 ${
          darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
        }`}
      >
        <div className="mx-auto max-w-5xl">
          <a
            href="#projects"
            className={`inline-flex items-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
              darkMode
                ? 'text-violet-300 hover:text-violet-200'
                : 'text-violet-700 hover:text-violet-900'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke proyek
          </a>

          <article className="project-detail-card mt-8 overflow-hidden rounded-3xl border border-violet-500/20 bg-slate-900/70 shadow-2xl shadow-violet-950/20">
            <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-violet-600/30 via-fuchsia-500/10 to-slate-900 sm:h-[26rem]">
              <Briefcase
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-violet-300"
              />
              <img
                src={selectedProject.image}
                alt={`Preview ${selectedProject.title}`}
                className="project-detail-image h-full w-full object-cover object-top"
                onError={(event) => event.currentTarget.remove()}
              />
            </div>

            <div className="p-6 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
                Detail Proyek
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
                {selectedProject.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
                {selectedProject.desc}
              </p>

              <div className="mt-8 border-t border-slate-700 pt-6">
                <h2 className="text-lg font-semibold text-white">
                  Teknologi dan tools
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedProject.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href="#projects"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-violet-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke portofolio
              </a>
            </div>
          </article>
        </div>
      </main>
    );
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      className={`min-h-screen font-sans transition-colors duration-300 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes gradientShift {
          to {
            background-position: 200% center;
          }
        }
        .animate-gradient-text {
          background-image: linear-gradient(
            90deg,
            #a78bfa,
            #f0abfc,
            #c4b5fd,
            #a78bfa
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 5s linear infinite;
        }
        @keyframes buttonShine {
          0%,
          65% {
            transform: translateX(-160%) rotate(25deg);
          }
          100% {
            transform: translateX(360%) rotate(25deg);
          }
        }
        .button-shine {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }
        .button-shine::after {
          content: '';
          position: absolute;
          inset: -50% auto -50% -30%;
          z-index: 0;
          width: 28%;
          background: rgba(255, 255, 255, 0.24);
          filter: blur(2px);
          transform: translateX(-160%) rotate(25deg);
          animation: buttonShine 3.8s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes detailEnter {
          from {
            opacity: 0;
            transform: translateY(28px) scale(0.98);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes detailImageDrift {
          from {
            transform: scale(1.02);
          }
          to {
            transform: scale(1.09);
          }
        }
        .project-detail-card {
          animation: detailEnter 750ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .project-detail-image {
          animation: detailImageDrift 12s ease-in-out alternate infinite;
        }
        .button-shine > * {
          position: relative;
          z-index: 1;
        }
        .nav-link {
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          right: 0;
          bottom: -6px;
          left: 0;
          height: 2px;
          border-radius: 9999px;
          background: linear-gradient(90deg, #8b5cf6, #e879f9);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 250ms ease;
        }
        .nav-link:hover::after,
        .nav-link:focus-visible::after,
        .nav-link-active::after {
          transform: scaleX(1);
        }
        section.reveal-pending {
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 700ms ease,
            transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        section.reveal-pending.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes cardReveal {
          from {
            opacity: 0;
            filter: blur(5px);
          }
          to {
            opacity: 1;
            filter: blur(0);
          }
        }
        section.reveal-pending.is-visible .interactive-card {
          animation: cardReveal 600ms ease both;
        }
        section.reveal-pending.is-visible .interactive-card:nth-child(2) {
          animation-delay: 90ms;
        }
        section.reveal-pending.is-visible .interactive-card:nth-child(3) {
          animation-delay: 180ms;
        }
        section.reveal-pending.is-visible .interactive-card:nth-child(4) {
          animation-delay: 270ms;
        }
        .scroll-progress-bar {
          position: fixed;
          inset: 0 0 auto;
          z-index: 60;
          height: 3px;
          background: linear-gradient(90deg, #8b5cf6, #e879f9, #67e8f9);
          box-shadow: 0 0 12px rgba(167, 139, 250, 0.7);
          transform: scaleX(0);
          transform-origin: left;
          pointer-events: none;
        }
        @keyframes gentleBounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(6px);
          }
        }
        .animate-gentle-bounce {
          animation: gentleBounce 1.8s ease-in-out infinite;
        }
        @keyframes profileOrbit {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes orbitLabelCounter {
          to {
            transform: rotate(-360deg);
          }
        }
        @keyframes auroraBreathe {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.94) rotate(-8deg);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.08) rotate(8deg);
          }
        }
        .hero-aurora {
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(86vw, 46rem);
          aspect-ratio: 1;
          border-radius: 50%;
          background: conic-gradient(
            from 40deg,
            transparent 0deg,
            rgba(139, 92, 246, 0.12) 65deg,
            rgba(232, 121, 249, 0.19) 125deg,
            transparent 190deg,
            rgba(103, 232, 249, 0.1) 250deg,
            transparent 320deg
          );
          filter: blur(35px);
          animation: auroraBreathe 12s ease-in-out infinite;
          pointer-events: none;
        }
        .profile-orbit {
          position: absolute;
          inset: -13%;
          z-index: 2;
          border: 2px solid rgba(196, 181, 253, 0.78);
          border-radius: 50%;
          box-shadow:
            0 0 12px rgba(167, 139, 250, 0.72),
            0 0 38px rgba(139, 92, 246, 0.4),
            inset 0 0 26px rgba(139, 92, 246, 0.18);
          animation: profileOrbit 32s linear infinite;
          pointer-events: none;
        }
        .profile-orbit::before {
          content: '';
          position: absolute;
          inset: 11%;
          border: 1px dashed rgba(232, 121, 249, 0.65);
          border-radius: 50%;
        }
        .profile-orbit::after {
          content: '';
          position: absolute;
          top: 8%;
          left: 50%;
          width: 0.85rem;
          height: 0.85rem;
          border: 2px solid #fff;
          border-radius: 50%;
          background: #e879f9;
          box-shadow:
            0 0 8px #fff,
            0 0 18px #e879f9,
            0 0 32px rgba(139, 92, 246, 0.95);
          transform: translateX(-50%);
        }
        @keyframes orbitStarTwinkle {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.65) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(45deg);
          }
        }
        .orbit-star {
          position: absolute;
          z-index: 3;
          width: 0.7rem;
          height: 0.7rem;
          clip-path: polygon(
            50% 0,
            62% 38%,
            100% 50%,
            62% 62%,
            50% 100%,
            38% 62%,
            0 50%,
            38% 38%
          );
          background: linear-gradient(135deg, #fff, #e879f9 58%, #8b5cf6);
          filter: drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px #e879f9);
          animation: orbitStarTwinkle 2.8s ease-in-out infinite;
          pointer-events: none;
        }
        .orbit-star:nth-child(4) {
          top: 16%;
          left: 8%;
          width: 0.9rem;
          height: 0.9rem;
        }
        .orbit-star:nth-child(5) {
          top: 13%;
          right: 14%;
          animation-delay: 700ms;
        }
        .orbit-star:nth-child(6) {
          top: 48%;
          right: 1%;
          width: 0.8rem;
          height: 0.8rem;
          animation-delay: 1.3s;
        }
        .orbit-star:nth-child(7) {
          right: 17%;
          bottom: 12%;
          width: 0.95rem;
          height: 0.95rem;
          animation-delay: 350ms;
        }
        .orbit-star:nth-child(8) {
          bottom: 17%;
          left: 7%;
          animation-delay: 1.7s;
        }
        .orbit-star:nth-child(9) {
          top: 48%;
          left: 0;
          width: 0.8rem;
          height: 0.8rem;
          animation-delay: 1s;
        }
        .orbit-marker {
          position: absolute;
          display: flex;
          width: max-content;
        }
        .orbit-marker:nth-child(1) {
          top: -1rem;
          left: 50%;
          transform: translateX(-50%);
        }
        .orbit-marker:nth-child(2) {
          top: 50%;
          right: -1.5rem;
          transform: translateY(-50%);
        }
        .orbit-marker:nth-child(3) {
          bottom: -1rem;
          left: 50%;
          transform: translateX(-50%);
        }
        .orbit-label {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border: 1px solid rgba(196, 181, 253, 0.72);
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.96);
          padding: 0.5rem 0.85rem;
          color: #f5eaff;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          box-shadow:
            0 0 18px rgba(139, 92, 246, 0.28),
            0 8px 28px rgba(2, 6, 23, 0.55);
          animation: orbitLabelCounter 32s linear infinite;
        }
        .orbit-label::before {
          content: '';
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 50%;
          background: #c4b5fd;
          box-shadow: 0 0 10px rgba(196, 181, 253, 0.9);
        }
        @keyframes profileRingSpin {
          to {
            transform: rotate(360deg);
          }
        }
        .profile-frame {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: 6px;
          box-shadow:
            0 0 18px rgba(139, 92, 246, 0.45),
            0 0 38px rgba(232, 121, 249, 0.2);
        }
        .profile-frame::before {
          content: '';
          position: absolute;
          inset: -100%;
          z-index: 0;
          background: conic-gradient(
            from 0deg,
            #ffffff 0deg,
            #8b5cf6,
            #e879f9 90deg,
            #67e8f9 150deg,
            #ffffff 190deg,
            #8b5cf6 260deg,
            #e879f9 320deg,
            #ffffff 360deg
          );
          animation: profileRingSpin 4s linear infinite;
        }
        .profile-frame-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: calc(2rem - 6px);
          background: #020617;
        }
        @keyframes profileShine {
          0%,
          62% {
            transform: translateX(-140%) skewX(-18deg);
            opacity: 0;
          }
          70% {
            opacity: 0.75;
          }
          86%,
          100% {
            transform: translateX(140%) skewX(-18deg);
            opacity: 0;
          }
        }
        .profile-frame-inner::after {
          content: '';
          position: absolute;
          inset: -20% auto -20% -45%;
          z-index: 2;
          width: 38%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
          );
          filter: blur(5px);
          opacity: 0;
          transform: translateX(-140%) skewX(-18deg);
          animation: profileShine 5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes sparkle {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.55) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(45deg);
          }
        }
        .profile-sparkle {
          position: absolute;
          z-index: 2;
          width: 14px;
          height: 14px;
          background: linear-gradient(135deg, #fff, #e879f9 55%, #8b5cf6);
          clip-path: polygon(
            50% 0,
            62% 38%,
            100% 50%,
            62% 62%,
            50% 100%,
            38% 62%,
            0 50%,
            38% 38%
          );
          filter: drop-shadow(0 0 8px rgba(232, 121, 249, 0.9));
          animation: sparkle 1.8s ease-in-out infinite;
          pointer-events: none;
        }
        .profile-sparkle:nth-child(2) {
          animation-delay: 600ms;
        }
        .profile-sparkle:nth-child(3) {
          animation-delay: 1.1s;
        }
        .profile-sparkle:nth-child(4) {
          animation-delay: 350ms;
        }
        .social-link svg {
          transition: transform 250ms ease;
        }
        .social-link:hover svg,
        .social-link:focus-visible svg {
          transform: rotate(-8deg) scale(1.12);
        }
        @keyframes contactPulse {
          0% {
            opacity: 0.65;
            transform: scale(0.9);
          }
          100% {
            opacity: 0;
            transform: scale(1.55);
          }
        }
        @keyframes contactIconFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .contact-icon-shell {
          position: relative;
          isolation: isolate;
          box-shadow: 0 0 28px rgba(139, 92, 246, 0.16);
        }
        .contact-icon-shell::before,
        .contact-icon-shell::after {
          content: '';
          position: absolute;
          inset: -5px;
          z-index: -1;
          border: 1px solid rgba(167, 139, 250, 0.65);
          border-radius: 1.1rem;
          animation: contactPulse 2.4s ease-out infinite;
          pointer-events: none;
        }
        .contact-icon-shell::after {
          animation-delay: 1.2s;
        }
        .contact-icon {
          animation: contactIconFloat 2.8s ease-in-out infinite;
        }
        @keyframes floatTag {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .floating-tag {
          animation: floatTag 3s ease-in-out infinite;
        }
        .floating-tag:nth-child(2) {
          animation-delay: 350ms;
        }
        .floating-tag:nth-child(3) {
          animation-delay: 700ms;
        }
        .section-title::after {
          content: '';
          display: block;
          width: 3.5rem;
          height: 3px;
          margin: 1rem auto 0;
          border-radius: 9999px;
          background: linear-gradient(90deg, #8b5cf6, #e879f9, #8b5cf6);
          background-size: 200% 100%;
          animation: gradientShift 4s linear infinite;
        }
        .interactive-card {
          background-image: radial-gradient(
            260px circle at var(--pointer-x, -1000px) var(--pointer-y, -1000px),
            rgba(167, 139, 250, 0.13),
            transparent 75%
          );
          background-repeat: no-repeat;
          transition:
            transform 250ms ease,
            box-shadow 250ms ease,
            border-color 250ms ease;
        }
        .interactive-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 35px rgba(139, 92, 246, 0.12);
        }
        .interactive-card .card-icon {
          transition: transform 250ms ease;
        }
        .interactive-card:hover .card-icon {
          transform: scale(1.12) rotate(-4deg);
        }
        .experience-card {
          position: relative;
          overflow: hidden;
        }
        .experience-card::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 3px;
          background: linear-gradient(
            180deg,
            #8b5cf6,
            #e879f9,
            rgba(103, 232, 249, 0.35)
          );
          transform: scaleY(0.35);
          transform-origin: top;
          transition: transform 650ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .experience-card::after {
          content: '';
          position: absolute;
          top: 14px;
          left: 14px;
          width: 9px;
          height: 9px;
          border: 2px solid #e879f9;
          border-radius: 50%;
          background: #8b5cf6;
          box-shadow: 0 0 12px rgba(232, 121, 249, 0.8);
          transition: box-shadow 300ms ease;
        }
        .experience-card:hover::before,
        .experience-card:focus-within::before {
          transform: scaleY(1);
        }
        .experience-card:hover::after,
        .experience-card:focus-within::after {
          box-shadow:
            0 0 8px rgba(232, 121, 249, 0.95),
            0 0 20px rgba(139, 92, 246, 0.75);
        }
        .skill-card {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }
        .skill-card::after {
          content: '';
          position: absolute;
          inset: -60% auto -60% -45%;
          z-index: 0;
          width: 35%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(196, 181, 253, 0.26),
            rgba(255, 255, 255, 0.55),
            rgba(232, 121, 249, 0.26),
            transparent
          );
          filter: blur(7px);
          transform: translateX(-180%) rotate(18deg);
          pointer-events: none;
        }
        .skill-card > * {
          position: relative;
          z-index: 1;
        }
        @keyframes skillFlash {
          from {
            transform: translateX(-180%) rotate(18deg);
          }
          to {
            transform: translateX(520%) rotate(18deg);
          }
        }
        .skill-card:hover::after,
        .skill-card:focus-within::after {
          animation: skillFlash 1.4s ease-out;
        }
        .skill-card:hover {
          box-shadow:
            0 0 0 1px rgba(167, 139, 250, 0.3),
            0 16px 38px rgba(139, 92, 246, 0.2);
        }
        .hobby-icon img {
          transition: transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .hobby-card:hover .hobby-icon img,
        .hobby-card:focus-within .hobby-icon img {
          transform: scale(1.2) rotate(8deg);
        }
        .hobby-card:hover .hobby-icon,
        .hobby-card:focus-within .hobby-icon {
          box-shadow:
            0 0 0 2px rgba(167, 139, 250, 0.45),
            0 0 22px rgba(139, 92, 246, 0.42);
        }
        .hobby-icon {
          transition: box-shadow 300ms ease;
        }
        .project-preview img {
          transition: transform 600ms ease;
        }
        .interactive-card:hover .project-preview img {
          transform: scale(1.06);
        }
        .project-preview {
          position: relative;
          overflow: hidden;
        }
        .project-preview::after {
          content: '';
          position: absolute;
          top: -45%;
          left: -20%;
          width: 140%;
          height: 24%;
          opacity: 0;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(255, 255, 255, 0.72),
            rgba(196, 181, 253, 0.35),
            transparent
          );
          filter: blur(5px);
          transform: rotate(-12deg) translateY(-180%);
          pointer-events: none;
        }
        @keyframes projectScan {
          0% {
            opacity: 0;
            transform: rotate(-12deg) translateY(-180%);
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 0.85;
          }
          100% {
            opacity: 0;
            transform: rotate(-12deg) translateY(750%);
          }
        }
        .interactive-card:hover .project-preview::after,
        .interactive-card:focus-within .project-preview::after {
          animation: projectScan 1.1s ease-in-out;
        }
        .project-card {
          position: relative;
        }
        .project-card::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            120deg,
            transparent 15%,
            rgba(167, 139, 250, 0.9),
            rgba(232, 121, 249, 0.9),
            transparent 85%
          );
          opacity: 0;
          transition: opacity 300ms ease;
          pointer-events: none;
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
        .project-card:hover::before,
        .project-card:focus-within::before {
          opacity: 1;
        }
        @keyframes statusLight {
          0%,
          100% {
            opacity: 1;
            box-shadow: 0 0 8px rgba(74, 222, 128, 0.8);
          }
          50% {
            opacity: 0.35;
            box-shadow: 0 0 2px rgba(74, 222, 128, 0.3);
          }
        }
        .animate-status-light {
          animation: statusLight 1.2s ease-in-out infinite;
        }
        @keyframes floatGlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(18px, -24px, 0) scale(1.08);
          }
        }
        .animate-float-glow {
          animation: floatGlow 9s ease-in-out infinite;
        }
        .animate-float-glow-delayed {
          animation: floatGlow 11s ease-in-out 1.5s infinite reverse;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-status-light,
          .animate-float-glow,
          .animate-float-glow-delayed,
          .hero-aurora,
          .profile-orbit,
          .orbit-star,
          .orbit-label,
          .animate-gradient-text,
          section.reveal-pending.is-visible .interactive-card,
          .project-detail-card,
          .project-detail-image,
          .section-title::after,
          .button-shine::after,
          .floating-tag,
          .animate-gentle-bounce,
          .profile-frame::before,
          .profile-frame-inner::after,
          .profile-sparkle,
          .project-preview::after,
          .skill-card::after,
          .contact-icon-shell::before,
          .contact-icon-shell::after,
          .contact-icon {
            animation: none;
          }
          .project-card::before {
            transition: none;
          }
          .experience-card::before,
          .experience-card::after {
            transition: none;
          }
          .experience-card::before {
            transform: scaleY(1);
          }
          .skill-card:hover {
            box-shadow: none;
          }
          .profile-sparkle {
            display: none;
          }
          .interactive-card,
          .interactive-card .card-icon,
          .hobby-icon,
          .hobby-icon img,
          .nav-link::after,
          .social-link svg,
          section.reveal-pending {
            transition: none;
          }
          section.reveal-pending {
            opacity: 1;
            transform: none;
          }
          .nav-link:hover::after,
          .nav-link:focus-visible::after {
            transform: none;
          }
          .interactive-card:hover {
            transform: none;
            box-shadow: none;
          }
          .interactive-card:hover .card-icon,
          .hobby-card:hover .hobby-icon img {
            transform: none;
          }
          .hobby-card:hover .hobby-icon {
            box-shadow: none;
          }
        }
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 80px;
        }
      `}</style>
      <div
        ref={scrollProgressRef}
        className="scroll-progress-bar"
        role="progressbar"
        aria-label="Progres gulir halaman"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow="0"
      />

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 border-b backdrop-blur-md transition-colors duration-300 ${
          darkMode
            ? 'bg-slate-950/90 border-slate-800'
            : 'bg-white/90 border-slate-200'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="#home"
            className="inline-flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight"
            onClick={() => setIsOpen(false)}
          >
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-sm font-extrabold text-white shadow-md shadow-violet-500/20"
            >
              Mi
            </span>
            <span className={headingText}>Muhammad Ikbal</span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={activeSection === item.href.slice(1) ? 'location' : undefined}
                className={`nav-link text-sm transition-colors ${accentHoverText} ${navText} ${
                  activeSection === item.href.slice(1)
                    ? `nav-link-active ${darkMode ? 'text-violet-300' : 'text-violet-700'}`
                    : ''
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-500/20 transition-colors"
              aria-label="Ganti tema"
              title="Ganti tema"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500" />
              )}
            </button>

            <button
              onClick={() => setIsOpen((previous) => !previous)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-500/20"
              aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div
            className={`md:hidden border-t px-6 py-4 space-y-3 ${
              darkMode
                ? 'bg-slate-950 border-slate-800'
                : 'bg-white border-slate-200'
            }`}
          >
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                aria-current={activeSection === item.href.slice(1) ? 'location' : undefined}
                className={`nav-link block py-2 transition-colors ${accentHoverText} ${navText} ${
                  activeSection === item.href.slice(1)
                    ? `nav-link-active ${darkMode ? 'text-violet-300' : 'text-violet-700'}`
                    : ''
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* BERANDA */}
      <section
        id="home"
        className={`relative isolate min-h-screen flex items-center overflow-hidden ${sectionClass} pt-32`}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -top-24 right-[8%] h-72 w-72 rounded-full blur-3xl animate-float-glow ${
            darkMode ? 'bg-violet-600/20' : 'bg-violet-300/35'
          }`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-8 left-[12%] h-64 w-64 rounded-full blur-3xl animate-float-glow-delayed ${
            darkMode ? 'bg-fuchsia-500/10' : 'bg-fuchsia-300/25'
          }`}
        />
        <div aria-hidden="true" className="hero-aurora" />
        <div className={`${containerClass} relative z-10 w-full`}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 ${accentText} text-sm mb-6`}>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-status-light" />
                Mahasiswa & Web Developer
              </div>

              <h1
                className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${headingText}`}
              >
                Halo, saya
                <span className="animate-gradient-text block">
                  Muhammad Ikbal.
                </span>
              </h1>

              <p className={`text-lg leading-relaxed mb-8 ${mutedText}`}>
                Saya tertarik pada pengembangan web, teknologi, database, dan
                kecerdasan buatan. Saya senang mempelajari hal baru serta
                membangun solusi digital yang bermanfaat.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#projects"
                  className="button-shine inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors"
                >
                  <Briefcase className="w-5 h-5" />
                  Lihat Proyek
                </a>

                <a
                  href="#contact"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors ${
                    darkMode
                      ? 'border-slate-700 hover:bg-slate-900'
                      : 'border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  Hubungi Saya
                </a>
              </div>

              <a
                href="#about"
                className={`inline-flex items-center gap-2 mt-12 text-sm ${mutedText} ${accentHoverText}`}
              >
                Kenali saya lebih lanjut
                <ChevronDown className="animate-gentle-bounce w-4 h-4" />
              </a>
            </div>

            {/* FOTO PROFIL */}
            <div className="flex justify-center animate-fade-in-up">
              <div className="flex flex-col items-center">
                <div className="profile-stage relative w-[min(74vw,20rem)] sm:w-80 lg:w-96">
                  <div className="profile-orbit" aria-hidden="true">
                    <span className="orbit-marker">
                      <span className="orbit-label">CREATIVE</span>
                    </span>
                    <span className="orbit-marker">
                      <span className="orbit-label">BUILD</span>
                    </span>
                    <span className="orbit-marker">
                      <span className="orbit-label">INNOVATE</span>
                    </span>
                    <span className="orbit-star" />
                    <span className="orbit-star" />
                    <span className="orbit-star" />
                    <span className="orbit-star" />
                    <span className="orbit-star" />
                    <span className="orbit-star" />
                  </div>
                  <span aria-hidden="true" className="profile-sparkle -top-2 right-[12%]" />
                  <span aria-hidden="true" className="profile-sparkle top-[28%] -right-2" />
                  <span aria-hidden="true" className="profile-sparkle -bottom-2 left-[18%]" />
                  <span aria-hidden="true" className="profile-sparkle top-[58%] -left-2" />
                  <div className="profile-frame h-[min(74vw,20rem)] w-full sm:h-80 lg:h-96 rounded-[2rem] mb-5 shrink-0 transition-transform duration-500 hover:scale-[1.03]">
                    <div className="profile-frame-inner">
                      <img
                        src={profileImg}
                        alt="Muhammad Ikbal"
                        className="w-full h-full object-cover scale-110 object-center transition-transform duration-700 hover:scale-125"
                      />
                    </div>
                  </div>
                </div>

                <p className={`mt-2 text-lg sm:text-xl ${mutedText}`}>
                  Tech Enthusiast
                </p>

                <div className="flex flex-wrap justify-center gap-2.5 mt-6">
                  {['React', 'Python', 'Laravel'].map((tech) => (
                    <span
                      key={tech}
                      className={`floating-tag text-base px-5 py-2.5 rounded-full bg-violet-500/10 ${accentText} border border-violet-500/20`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TENTANG SAYA */}
      <section
        id="about"
        className={`${sectionClass} ${
          darkMode ? 'bg-slate-900/40' : 'bg-white'
        }`}
      >
        <div className={containerClass}>
          <div className="max-w-3xl mx-auto text-center">
            <span className={`font-semibold text-sm uppercase tracking-widest ${accentText}`}>
              Tentang Saya
            </span>

            <h2 className={`section-title text-3xl sm:text-4xl font-bold mt-3 mb-6 ${headingText}`}>
              Mengenal Saya Lebih Dekat
            </h2>

            <p className={`leading-relaxed text-lg ${mutedText}`}>
              Saya adalah seorang mahasiswa yang memiliki minat dalam dunia
              teknologi informasi, khususnya pengembangan aplikasi web,
              pemrograman, pengolahan database, dan machine learning. Melalui
              berbagai proyek, saya terus mengembangkan kemampuan teknis,
              kreativitas, serta kemampuan memecahkan masalah.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mt-10">
              {[
                {
                  value: 'Web',
                  label: 'Development',
                  icon: <Code className="w-7 h-7 text-violet-400" />,
                },
                {
                  value: 'AI',
                  label: 'Machine Learning',
                  icon: <Cpu className="w-7 h-7 text-violet-400" />,
                },
                {
                  value: 'UI/UX',
                  label: 'Design',
                  icon: <Layout className="w-7 h-7 text-pink-400" />,
                },
              ].map((item) => (
                <div
                  key={item.value}
                  className={`interactive-card p-6 rounded-2xl border hover:border-violet-500/50 ${cardClass}`}
                >
                  <div className="card-icon w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-500/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className={`text-2xl font-bold ${accentText}`}>
                    {item.value}
                  </h3>
                  <p className={`text-sm mt-2 ${mutedText}`}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PENGALAMAN */}
      <section
        id="experience"
        className={`${sectionClass} ${
          darkMode ? 'bg-slate-900/40' : 'bg-white'
        }`}
      >
        <div className={containerClass}>
          <div className="text-center mb-12">
            <span className={`font-semibold text-sm uppercase tracking-widest ${accentText}`}>
              Perjalanan Saya
            </span>

            <h2 className={`section-title text-3xl sm:text-4xl font-bold mt-3 ${headingText}`}>
              Pengalaman
            </h2>

            <p className={`mt-4 ${mutedText}`}>
              Pengalaman saya mencakup pengawasan kerja lapangan serta proyek akademik di bidang teknologi.
            </p>
          </div>

          <div className={`interactive-card mx-auto mb-8 max-w-4xl overflow-hidden rounded-2xl border ${cardClass}`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="px-6 py-4 text-left text-lg font-bold text-violet-300">
                  Pengalaman Kerja Lapangan
                </caption>
                <thead>
                  <tr className={darkMode ? 'bg-slate-800/80' : 'bg-slate-100'}>
                    <th
                      scope="col"
                      className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider ${mutedText}`}
                    >
                      Posisi
                    </th>
                    <th
                      scope="col"
                      className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider ${mutedText}`}
                    >
                      Tanggung Jawab
                    </th>
                    <th
                      scope="col"
                      className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider ${mutedText}`}
                    >
                      Kompetensi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={darkMode ? 'border-t border-slate-800' : 'border-t border-slate-200'}>
                    <th
                      scope="row"
                      className={`px-6 py-5 align-top text-sm font-bold ${headingText}`}
                    >
                      Pengawas Proyek Lapangan
                    </th>
                    <td className={`px-6 py-5 align-top text-sm leading-relaxed ${mutedText}`}>
                      Mengawasi aktivitas kerja di lapangan, mengoordinasikan
                      pekerja, dan memantau progres pekerjaan.
                    </td>
                    <td className={`px-6 py-5 align-top text-sm leading-relaxed ${mutedText}`}>
                      Koordinasi tim, komunikasi, dan pemantauan pekerjaan.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {academicProjects.map((project) => (
              <article
                key={project.title}
                className={`experience-card interactive-card p-6 rounded-2xl border ${cardClass}`}
              >
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 ${accentText} border border-violet-500/20`}>
                  Pengalaman Akademik
                </span>

                <h3 className={`text-lg font-bold mt-4 mb-3 ${headingText}`}>
                  {project.title}
                </h3>

                <p className={`text-sm leading-relaxed ${mutedText}`}>
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className={`px-2.5 py-1 rounded-full text-xs bg-violet-500/10 ${accentText}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* HOBI */}
      <section
        id="hobbies"
        className={`${sectionClass} ${
          darkMode ? 'bg-slate-900/40' : 'bg-white'
        }`}
      >
        <div className={containerClass}>
          <div className="text-center mb-12">
            <span className={`font-semibold text-sm uppercase tracking-widest ${accentText}`}>
              Di Luar Teknologi
            </span>

            <h2 className={`section-title text-3xl sm:text-4xl font-bold mt-3 ${headingText}`}>
              Hobi & Minat
            </h2>
          </div>

          <div className="grid gap-6 max-w-xl mx-auto">
            {hobbies.map((hobby) => (
              <div
                key={hobby.name}
                className={`hobby-card interactive-card flex gap-5 items-start p-6 rounded-2xl border hover:border-violet-500/50 ${cardClass}`}
              >
                <div className="hobby-icon card-icon w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-slate-500/10 flex items-center justify-center">
                  {hobby.icon}
                </div>

                <div>
                  <h3 className={`text-lg font-bold mb-2 ${headingText}`}>
                    {hobby.name}
                  </h3>

                  <p className={`text-sm leading-relaxed ${mutedText}`}>
                    {hobby.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEAHLIAN */}
      <section id="skills" className={sectionClass}>
        <div className={containerClass}>
          <div className="text-center mb-12">
            <span className={`font-semibold text-sm uppercase tracking-widest ${accentText}`}>
              Kemampuan
            </span>

            <h2 className={`section-title text-3xl sm:text-4xl font-bold mt-3 ${headingText}`}>
              Keahlian Saya
            </h2>

            <p className={`mt-4 ${mutedText}`}>
              Teknologi dan perangkat yang saya pelajari.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className={`skill-card interactive-card p-6 rounded-2xl border hover:border-violet-500/50 ${cardClass}`}
              >
                <div className="card-icon w-12 h-12 rounded-xl bg-slate-500/10 flex items-center justify-center mb-4">
                  {skill.icon}
                </div>

                <h3 className={`font-semibold ${headingText}`}>
                  {skill.name}
                </h3>

                <p className={`text-sm mt-2 ${mutedText}`}>
                  Terus belajar dan mengembangkan kemampuan.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROYEK */}
      <section id="projects" className={sectionClass}>
        <div className={containerClass}>
          <div className="text-center mb-12">
            <span className={`font-semibold text-sm uppercase tracking-widest ${accentText}`}>
              Portofolio
            </span>

            <h2 className={`section-title text-3xl sm:text-4xl font-bold mt-3 ${headingText}`}>
              Proyek Pilihan
            </h2>

            <p className={`mt-4 ${mutedText}`}>
              Beberapa proyek dan pekerjaan yang saya pelajari.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {projects.map((project) => (
              <article
                key={project.title}
                className={`project-card interactive-card flex flex-col rounded-2xl border overflow-hidden hover:border-violet-500/50 ${cardClass}`}
              >
                <div className="card-icon project-preview relative h-40 shrink-0 bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-slate-800 flex items-center justify-center">
                  <Briefcase
                    aria-hidden="true"
                    className={`absolute h-16 w-16 ${accentText}`}
                  />
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={`Preview ${project.title}`}
                      className="w-full h-full object-cover object-top"
                      onError={(event) => event.currentTarget.remove()}
                    />
                  ) : (
                    <Database
                      aria-hidden="true"
                      className={`relative z-10 h-16 w-16 ${accentText}`}
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className={`text-xl font-bold mb-3 ${headingText}`}>
                    {project.title}
                  </h3>

                  <p className={`text-sm leading-relaxed mb-5 ${mutedText} flex-1`}>
                    {project.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className={`px-3 py-1 rounded-full text-xs bg-violet-500/10 ${accentText} border border-violet-500/20`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <a
                    href={`#/proyek/${project.slug}`}
                    className={`mt-auto inline-flex items-center gap-2 text-sm font-semibold ${accentText} ${accentHoverText}`}
                  >
                    Lihat Detail
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* KONTAK */}
      <section
        id="contact"
        className={`${sectionClass} ${
          darkMode ? 'bg-slate-900/40' : 'bg-white'
        }`}
      >
        <div className={`${containerClass} text-center`}>
          <div className="max-w-2xl mx-auto">
            <div className="contact-icon-shell card-icon w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
              <Mail className={`contact-icon w-8 h-8 ${accentText}`} />
            </div>

            <span className={`font-semibold text-sm uppercase tracking-widest ${accentText}`}>
              Hubungi Saya
            </span>

            <h2 className={`section-title text-3xl sm:text-4xl font-bold mt-3 mb-5 ${headingText}`}>
              Mari Terhubung!
            </h2>

            <p className={`leading-relaxed mb-8 ${mutedText}`}>
              Tertarik berdiskusi tentang teknologi, pengembangan aplikasi, atau
              peluang kolaborasi? Silakan hubungi saya.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.instagram.com/mhmmd_iqbal279/"
                target="_blank"
                rel="noreferrer"
                className={`social-link interactive-card inline-flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors ${
                  darkMode
                    ? 'border-slate-700 hover:bg-slate-800'
                    : 'border-slate-300 hover:bg-slate-100'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="instagram-gradient" x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFDC80" />
                      <stop offset=".35" stopColor="#F77737" />
                      <stop offset=".68" stopColor="#E1306C" />
                      <stop offset="1" stopColor="#833AB4" />
                    </linearGradient>
                  </defs>
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="url(#instagram-gradient)" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" stroke="url(#instagram-gradient)" strokeWidth="2" />
                  <circle cx="18" cy="6" r="1" fill="#E1306C" />
                </svg>
                @mhmmd_iqbal279
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href="https://www.tiktok.com/@Ikbalzzz"
                target="_blank"
                rel="noreferrer"
                className={`social-link interactive-card inline-flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors ${
                  darkMode
                    ? 'border-slate-700 hover:bg-slate-800'
                    : 'border-slate-300 hover:bg-slate-100'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#25F4EE" d="M8 20.5a6.5 6.5 0 0 1 0-13v3.2a3.3 3.3 0 1 0 3.3 3.3V2h3.3c.3 2.2 1.7 4 4 4.6v3.3a8.2 8.2 0 0 1-4-1.7V14a6.6 6.6 0 0 1-6.6 6.5Z" transform="translate(-1.2 1)" />
                  <path fill="#FE2C55" d="M8 20.5a6.5 6.5 0 0 1 0-13v3.2a3.3 3.3 0 1 0 3.3 3.3V2h3.3c.3 2.2 1.7 4 4 4.6v3.3a8.2 8.2 0 0 1-4-1.7V14a6.6 6.6 0 0 1-6.6 6.5Z" transform="translate(1.2 -1)" />
                  <path fill="currentColor" d="M8 20.5a6.5 6.5 0 0 1 0-13v3.2a3.3 3.3 0 1 0 3.3 3.3V2h3.3c.3 2.2 1.7 4 4 4.6v3.3a8.2 8.2 0 0 1-4-1.7V14a6.6 6.6 0 0 1-6.6 6.5Z" />
                </svg>
                @Ikbalzzz
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href="mailto:muhikbalbtg@gmail.com"
                className={`social-link interactive-card inline-flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors ${
                  darkMode
                    ? 'border-slate-700 hover:bg-slate-800'
                    : 'border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Mail className="w-5 h-5 text-[#EA4335]" />
                <span className="font-semibold">muhikbalbtg@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className={`border-t px-6 py-8 ${
          darkMode ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div className={`${containerClass} flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <a href="#home" className="inline-flex items-center gap-2 text-lg font-bold">
            <span
              aria-hidden="true"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-xs font-extrabold text-white"
            >
              Mi
            </span>
            <span className={headingText}>Muhammad Ikbal</span>
          </a>

          <a
            href="#home"
            className={`text-sm ${accentText} ${accentHoverText}`}
          >
            Kembali ke atas ↑
          </a>
        </div>
      </footer>
    </div>
  );
}