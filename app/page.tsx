import { ReactNode } from "react";

const IconFolder = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="url(#icon-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const IconShare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="url(#icon-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="url(#icon-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="url(#icon-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="url(#icon-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="url(#icon-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const IconFolderSm = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const IconImageSm = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const IconVideoSm = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </svg>
);

export default function Home() {
  const features: { icon: ReactNode; name: string; desc: string }[] = [
    { icon: <IconFolder />, name: "Stockage organisé", desc: "Créez des dossiers, déplacez et renommez vos fichiers. Une arborescence claire pour retrouver vos données en un instant." },
    { icon: <IconShare />, name: "Partage avancé", desc: "Partagez avec ou sans mot de passe, définissez des dates d'expiration et contrôlez les permissions en lecture ou écriture." },
    { icon: <IconEye />, name: "Aperçu intégré", desc: "Visualisez images, vidéos, PDF, Markdown et fichiers audio directement dans le navigateur sans télécharger." },
    { icon: <IconSearch />, name: "Recherche puissante", desc: "Filtrez par nom, type, catégorie et taille. La recherche est instantanée sur l'ensemble de vos données." },
    { icon: <IconTrash />, name: "Corbeille & récupération", desc: "Les fichiers supprimés ne disparaissent pas immédiatement. Restaurez vos données à tout moment depuis la corbeille." },
    { icon: <IconShield />, name: "Authentification sécurisée", desc: "Connectez-vous via email, Google ou GitHub. Vos données sont protégées par des tokens JWT et des sessions sécurisées." },
  ];

  const steps = [
    { n: "1", title: "Créez votre compte", desc: "Inscrivez-vous avec votre email ou en un clic via Google ou GitHub. C'est gratuit, sans carte bancaire." },
    { n: "2", title: "Uploadez vos fichiers", desc: "Glissez-déposez vos fichiers et dossiers. Votre espace de 30 Go vous attend immédiatement." },
    { n: "3", title: "Partagez en un clic", desc: "Générez un lien de partage sécurisé et envoyez-le à vos collaborateurs en quelques secondes." },
  ];

  const mockFiles = [
    { Icon: IconFolderSm, color: "#7c6ef8", bg: "bg-[#7c6ef8]/[0.18]", name: "Documents", size: "4.2 Go" },
    { Icon: IconImageSm, color: "#42aff0", bg: "bg-[#42aff0]/[0.18]", name: "Photos", size: "8.1 Go" },
    { Icon: IconVideoSm, color: "#a78bfa", bg: "bg-[rgba(167,139,250,0.15)]", name: "Vidéos", size: "6.1 Go" },
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
          50%       { opacity: 1;   transform: translateX(-50%) scale(1.08); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0.25; }
        }
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) rotate(-2deg) translateY(0); }
          50%       { transform: translate(-50%, -50%) rotate(1deg) translateY(-14px); }
        }
        @keyframes fb1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        @keyframes fb2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(9px); } }
        @keyframes upanim { 0% { width:18%; } 50% { width:82%; } 100% { width:18%; } }
        .glow-anim   { animation: glowPulse 7s ease-in-out infinite; }
        .blink-anim  { animation: blink 2.2s ease-in-out infinite; }
        .float-anim  { animation: float 5.5s ease-in-out infinite; }
        .fb1-anim    { animation: fb1 4.5s ease-in-out infinite; }
        .fb2-anim    { animation: fb2 4.5s ease-in-out 1.2s infinite; }
        .upload-anim { animation: upanim 2.2s ease-in-out infinite; }
        .steps-line::before {
          content: '';
          position: absolute; top: 27px;
          left: calc(16.67% + 12px); right: calc(16.67% + 12px);
          height: 1px;
          background: linear-gradient(90deg, rgba(124,110,248,0.4), rgba(66,175,240,0.4));
        }
        @media (max-width: 767px) {
          .steps-line::before { display: none; }
        }
        @font-face {
          font-family: 'Syne';
          font-style: normal;
          font-weight: 700 800;
          font-display: swap;
          src: local('Syne');
          ascent-override: 90%;
          descent-override: 20%;
          line-gap-override: 0%;
        }
        .cta-glow::before {
          content: '';
          position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
          width: 700px; height: 300px; pointer-events: none;
          background: radial-gradient(ellipse, rgba(124,110,248,0.12) 0%, transparent 65%);
        }
        @media (max-width: 767px) {
          .cta-glow::before { width: 100%; }
        }
      `}</style>

      <svg width="0" height="0" className="absolute overflow-hidden">
        <defs>
          <linearGradient id="icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c6ef8" />
            <stop offset="100%" stopColor="#42aff0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="bg-[#0d0d0d] text-[#ededed] font-['DM_Sans',sans-serif] overflow-x-hidden">

        <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 md:px-12 py-4 bg-[#0d0d0d]/75 backdrop-blur-2xl border-b border-white/[0.07]">
          <a href="/" className="flex items-center gap-2.5 no-underline">
            <svg width="34" height="34" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="lg-nav" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c6ef8" /><stop offset="100%" stopColor="#42aff0" />
                </linearGradient>
              </defs>
              <rect fill="#0d0d0d" stroke="#7c6ef8" strokeWidth="3" x="2" y="2" width="96" height="96" rx="22" ry="22" />
              <path fill="url(#lg-nav)" d="M72 82H28C16 82 6 73 6 62C6 52 13 43.5 23 41.5C23 30 32 21 44 21C53 21 60.5 26 64 33C66 32.5 68 32 70 32C80 32 88 40 88 50C88 67 81 78 72 82Z" />
              <polygon fill="#0d0d0d" points="50,30 38,48 45,48 45,62 55,62 55,48 62,48" />
            </svg>
            <span className="font-['Syne',sans-serif] text-[18px] font-bold bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] bg-clip-text text-transparent">Supfile</span>
          </a>
          <div className="flex gap-2">
            <a href="/login" className="px-3 md:px-[18px] py-2 rounded-lg text-xs md:text-sm text-[#bbb] border border-[#7c6ef8]/25 hover:border-[#7c6ef8] hover:text-white transition-all no-underline">Se connecter</a>
            <a href="/register" className="px-3 md:px-[18px] py-2 rounded-lg text-xs md:text-sm font-medium text-white bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] hover:opacity-90 hover:-translate-y-px transition-all no-underline">S'inscrire</a>
          </div>
        </nav>

        <section className="min-h-screen flex items-center px-4 md:px-12 pt-28 md:pt-32 pb-14 md:pb-20 relative overflow-hidden">
          <div
            className="glow-anim absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(124,110,248,0.14) 0%, rgba(66,175,240,0.07) 45%, transparent 70%)" }}
          />
          <div className="max-w-[1160px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#7c6ef8]/[0.08] border border-[#7c6ef8]/[0.22] rounded-full px-3.5 py-1.5 mb-6 text-[11px] text-[#9d93f9] font-medium tracking-widest uppercase">
                <span className="blink-anim w-1.5 h-1.5 rounded-full bg-[#7c6ef8]" />
                Stockage cloud nouvelle génération
              </div>
              <h1 className="font-['Syne',sans-serif] font-extrabold leading-[1.02] -tracking-[2.5px] mb-6" style={{ fontSize: "clamp(52px, 5.5vw, 82px)" }}>
                <span className="bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] bg-clip-text text-transparent">Stockez.</span><br />
                <span className="bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] bg-clip-text text-transparent">Partagez.</span><br />
                <span>Maîtrisez.</span>
              </h1>
              <p className="text-[15px] md:text-[17px] text-[#5e5e6e] font-light leading-[1.75] max-w-[460px] mb-8 md:mb-10">
                La plateforme de gestion de fichiers cloud conçue pour votre productivité. Sécurisez, organisez et partagez vos données en toute simplicité.
              </p>
              <div className="flex gap-3 flex-wrap">
                <a href="/register" className="px-8 py-3.5 rounded-[10px] text-[15px] font-medium text-white bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] shadow-[0_0_40px_rgba(124,110,248,0.28)] hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(124,110,248,0.5)] transition-all no-underline inline-block">Commencer gratuitement</a>
                <a href="/login" className="px-8 py-3.5 rounded-[10px] text-[15px] text-[#aaa] border border-white/[0.09] bg-white/[0.03] hover:border-white/[0.18] hover:text-white hover:bg-white/[0.06] transition-all no-underline inline-block">Se connecter</a>
              </div>
            </div>

            <div className="hidden md:block relative h-[500px]">
              <div className="float-anim absolute top-1/2 left-1/2 w-[300px] bg-[rgba(18,18,22,0.92)] border border-[#7c6ef8]/[0.18] rounded-[18px] p-[22px] backdrop-blur-[30px] shadow-[0_40px_90px_rgba(0,0,0,0.65),0_0_0_1px_rgba(124,110,248,0.08)]">
                <div className="flex items-center gap-1.5 mb-[18px]">
                  <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                  <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                  <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                  <span className="ml-auto text-[10px] text-[#444] font-medium">Mon Espace · 18.4 / 30 Go</span>
                </div>
                <div className="bg-white/[0.05] rounded h-[5px] overflow-hidden mb-1.5">
                  <div className="h-full w-[62%] bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] rounded" />
                </div>
                <div className="text-[10px] text-[#444] mb-4">18.4 Go utilisés sur 30 Go</div>
                <div className="flex flex-col gap-1.5">
                  {mockFiles.map((f) => (
                    <div key={f.name} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-white/[0.025] border border-white/[0.04]">
                      <span className={`w-[26px] h-[26px] rounded-md ${f.bg} flex items-center justify-center shrink-0`}>
                        <f.Icon color={f.color} />
                      </span>
                      <span className="text-[12px] text-[#ccc] flex-1">{f.name}</span>
                      <span className="text-[10px] text-[#444]">{f.size}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="fb1-anim absolute top-[12%] right-[-5px] flex items-center gap-2 bg-[rgba(16,16,20,0.96)] border border-white/[0.09] rounded-[10px] px-3.5 py-2.5 text-[12px] whitespace-nowrap backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7c6ef8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span className="text-[#bbb]">Lien partagé</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(40,200,64,0.15)] text-[#4CAF50] border border-[rgba(40,200,64,0.25)]">Actif</span>
              </div>

              <div className="fb2-anim absolute bottom-[20%] left-[-25px] bg-[rgba(16,16,20,0.96)] border border-white/[0.09] rounded-[10px] px-3.5 py-2.5 text-[12px] whitespace-nowrap backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-1.5 text-[11px] text-[#999] mb-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#42aff0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Envoi en cours…
                </div>
                <div className="bg-white/[0.07] rounded h-1 w-[110px] overflow-hidden">
                  <div className="upload-anim h-full bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] rounded" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 md:px-12 py-16 md:py-[110px]">
          <p className="text-center text-[11px] text-[#7c6ef8] uppercase tracking-[2.5px] font-medium mb-2.5">Fonctionnalités</p>
          <h2 className="font-['Syne',sans-serif] font-bold text-center -tracking-[1px] mb-3.5" style={{ fontSize: "clamp(26px, 3.5vw, 46px)" }}>Tout ce dont vous avez besoin</h2>
          <p className="text-center text-[#666] text-[15px] md:text-[16px] font-light leading-[1.65] max-w-[500px] mx-auto mb-10 md:mb-[60px]">Une suite complète d'outils pour gérer vos fichiers au quotidien, sans compromis.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-[18px] max-w-[1080px] mx-auto">
            {features.map((f, i) => (
              <div key={i} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-7 transition-all duration-300 hover:border-[#7c6ef8]/35 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.35),0_0_0_1px_rgba(124,110,248,0.08)]">
                <div className="w-[46px] h-[46px] rounded-[11px] bg-[#7c6ef8]/10 border border-[#7c6ef8]/[0.18] flex items-center justify-center mb-[18px]">
                  {f.icon}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <span className="font-['Syne',sans-serif] font-bold text-[#e8e8e8]" style={{ fontSize: 16, lineHeight: 2 }}>{f.name}</span>
                </div>
                <div className="text-[13.5px] text-[#555] leading-[1.65] font-light">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 md:px-12 py-16 md:py-[110px]" style={{ background: "linear-gradient(180deg, transparent, rgba(124,110,248,0.04) 50%, transparent)" }}>
          <p className="text-center text-[11px] text-[#7c6ef8] uppercase tracking-[2.5px] font-medium mb-2.5">Démarrage</p>
          <h2 className="font-['Syne',sans-serif] font-bold text-center -tracking-[1px] mb-3.5" style={{ fontSize: "clamp(26px, 3.5vw, 46px)" }}>Simple à prendre en main</h2>
          <p className="text-center text-[#666] text-[15px] md:text-[16px] font-light leading-[1.65] max-w-[500px] mx-auto mb-10 md:mb-[60px]">Opérationnel en moins de 2 minutes, sans carte bancaire requise.</p>
          <div className="steps-line grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 max-w-[880px] mx-auto relative">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-[54px] h-[54px] rounded-full bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] flex items-center justify-center font-['Syne',sans-serif] text-xl font-extrabold text-white mx-auto mb-5 relative z-10 shadow-[0_0_28px_rgba(124,110,248,0.45)]">{s.n}</div>
                <div className="font-['Syne',sans-serif] text-[17px] font-semibold text-[#ddd] mb-2.5">{s.title}</div>
                <div className="text-[13.5px] text-[#555] leading-[1.65] font-light">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-glow mx-4 md:mx-12 mb-14 md:mb-[90px] rounded-[18px] md:rounded-[22px] bg-[#7c6ef8]/[0.05] border border-[#7c6ef8]/[0.18] px-6 md:px-12 py-14 md:py-20 text-center relative overflow-hidden">
          <h2 className="font-['Syne',sans-serif] font-extrabold -tracking-[1.5px] mb-3.5" style={{ fontSize: "clamp(30px, 4vw, 50px)" }}>
            Prêt à <span className="bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] bg-clip-text text-transparent">démarrer</span> ?
          </h2>
          <p className="text-[#4a4a5a] text-[14px] md:text-[16px] font-light mb-7 md:mb-9">Rejoignez Supfile et prenez le contrôle de vos fichiers dès aujourd'hui.</p>
          <a href="/register" className="px-8 py-3.5 rounded-[10px] text-[15px] font-medium text-white bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] shadow-[0_0_40px_rgba(124,110,248,0.28)] hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(124,110,248,0.5)] transition-all no-underline inline-block">Créer mon compte gratuitement</a>
        </section>

        <footer className="border-t border-white/[0.07] px-4 md:px-12 py-8 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <a href="/" className="flex items-center gap-2 no-underline">
            <svg width="22" height="22" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="lg-ft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c6ef8" /><stop offset="100%" stopColor="#42aff0" />
                </linearGradient>
              </defs>
              <rect fill="#0d0d0d" stroke="#7c6ef8" strokeWidth="3" x="2" y="2" width="96" height="96" rx="22" ry="22" />
              <path fill="url(#lg-ft)" d="M72 82H28C16 82 6 73 6 62C6 52 13 43.5 23 41.5C23 30 32 21 44 21C53 21 60.5 26 64 33C66 32.5 68 32 70 32C80 32 88 40 88 50C88 67 81 78 72 82Z" />
              <polygon fill="#0d0d0d" points="50,30 38,48 45,48 45,62 55,62 55,48 62,48" />
            </svg>
            <span className="font-['Syne',sans-serif] text-sm font-semibold bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] bg-clip-text text-transparent">Supfile</span>
          </a>
          <span className="text-[12px] text-[#333] order-last md:order-none">© 2026 Supfile. Tous droits réservés.</span>
          <div className="flex flex-wrap justify-center gap-4 md:gap-5">
            <a href="/cgu" className="text-[12px] text-[#333] no-underline hover:text-[#888] transition-colors">CGU</a>
            <a href="/mentions-legales" className="text-[12px] text-[#333] no-underline hover:text-[#888] transition-colors">Mentions légales</a>
            <a href="/login" className="text-[12px] text-[#333] no-underline hover:text-[#888] transition-colors">Connexion</a>
            <a href="/register" className="text-[12px] text-[#333] no-underline hover:text-[#888] transition-colors">Inscription</a>
          </div>
        </footer>
      </div>
    </>
  );
}
