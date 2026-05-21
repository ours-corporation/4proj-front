export default function CGU() {
  const sections = [
    {
      title: "1. Objet",
      content: `Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions dans lesquelles Supfile met à disposition de ses utilisateurs une plateforme de stockage, d'organisation et de partage de fichiers en ligne, accessible à l'adresse supfile.dev-lecomte.fr.

Toute utilisation du service implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le service.`,
    },
    {
      title: "2. Description du service",
      content: `Supfile est une plateforme cloud permettant à ses utilisateurs de :

• Stocker des fichiers de tout type dans un espace personnel sécurisé (quota de 30 Go par défaut) ;
• Organiser leurs fichiers au sein d'une arborescence de dossiers ;
• Prévisualiser des fichiers directement depuis le navigateur (images, vidéos, PDF, Markdown, audio, JSON, texte brut) ;
• Partager des fichiers et dossiers, avec ou sans mot de passe, avec une date d'expiration optionnelle, en lecture ou en écriture ;
• Effectuer des recherches avancées par nom, type, catégorie et taille ;
• Récupérer des fichiers supprimés depuis la corbeille.

Le service est accessible depuis tout navigateur web moderne et depuis l'application mobile Supfile.`,
    },
    {
      title: "3. Inscription et compte utilisateur",
      content: `L'accès aux fonctionnalités de Supfile requiert la création d'un compte. L'inscription est gratuite et peut s'effectuer par :

• Email et mot de passe ;
• Authentification via Google OAuth 2.0 ;
• Authentification via GitHub OAuth.

L'utilisateur s'engage à fournir des informations exactes et à les maintenir à jour. Il est seul responsable de la confidentialité de ses identifiants de connexion. Tout accès au service effectué à l'aide de ses identifiants est réputé émanant de l'utilisateur.

En cas de compromission de son compte, l'utilisateur doit en informer immédiatement Supfile et modifier ses identifiants dans les meilleurs délais.`,
    },
    {
      title: "4. Utilisation du service",
      content: `L'utilisateur s'engage à utiliser Supfile de manière conforme aux présentes CGU, à la législation en vigueur et aux droits des tiers. Il est notamment interdit de :

• Stocker, partager ou diffuser tout contenu illicite (contenu pédopornographique, contenu incitant à la haine, données volées, logiciels malveillants, etc.) ;
• Utiliser le service à des fins commerciales de revente sans autorisation préalable ;
• Tenter de contourner les mécanismes de sécurité, d'authentification ou de quota ;
• Accéder aux données d'autres utilisateurs sans leur consentement ;
• Utiliser le service pour mener des attaques informatiques ou des campagnes de spam.

Supfile se réserve le droit de suspendre ou résilier tout compte en violation de ces règles, sans préavis ni indemnité.`,
    },
    {
      title: "5. Stockage et quota",
      content: `Chaque compte bénéficie d'un espace de stockage de 30 Go par défaut. La taille maximale par fichier est de 50 Go.

L'utilisateur est informé de l'utilisation de son quota en temps réel depuis son tableau de bord. Lorsque le quota est atteint, de nouveaux envois de fichiers sont bloqués jusqu'à libération d'espace.

Supfile ne garantit pas la disponibilité permanente des fichiers stockés. Il est fortement conseillé à l'utilisateur de conserver des copies de sauvegarde de ses données importantes. Supfile ne saurait être tenu responsable d'une perte de données résultant d'une défaillance technique.`,
    },
    {
      title: "6. Partage de fichiers",
      content: `L'utilisateur peut partager des fichiers ou dossiers de deux façons :

• Partage privé : avec un autre utilisateur Supfile identifié, avec des permissions de lecture ou d'écriture ;
• Partage public : via un lien unique, pouvant être protégé par un mot de passe et assorti d'une date d'expiration.

L'utilisateur est seul responsable des contenus qu'il partage et des personnes avec lesquelles il les partage. Il s'assure de disposer des droits nécessaires sur les fichiers partagés.

Les liens de partage publics actifs sont accessibles à quiconque en possède l'URL. L'utilisateur est invité à utiliser les options de protection (mot de passe, expiration) pour les contenus sensibles.`,
    },
    {
      title: "7. Propriété intellectuelle",
      content: `L'utilisateur conserve l'intégralité des droits de propriété intellectuelle sur les fichiers qu'il stocke sur Supfile.

En utilisant le service, l'utilisateur accorde à Supfile une licence non exclusive, mondiale, gratuite et limitée aux seules fins techniques nécessaires au fonctionnement du service (stockage, affichage, transmission, génération de miniatures).

La plateforme Supfile (code source, interface, logo, marque) est la propriété exclusive de ses auteurs. Toute reproduction, modification ou exploitation à des fins commerciales est interdite sans autorisation écrite préalable.`,
    },
    {
      title: "8. Protection des données personnelles",
      content: `Dans le cadre du service, Supfile collecte et traite les données suivantes :

• Données d'identification : adresse email, nom d'utilisateur, identifiants OAuth (Google ID, GitHub ID) ;
• Données de profil : photo de profil (optionnelle) ;
• Données d'utilisation : quota de stockage, historique des fichiers et dossiers, partages effectués ;
• Données techniques : tokens de session (stockés sous forme hachée).

Ces données sont collectées dans le seul but de fournir le service et ne sont pas transmises à des tiers à des fins commerciales.

Conformément au Règlement Général sur la Protection des Données (RGPD), l'utilisateur dispose d'un droit d'accès, de rectification, d'effacement et de portabilité de ses données. Pour exercer ces droits, contactez : contact@supfile.fr.`,
    },
    {
      title: "9. Disponibilité du service",
      content: `Supfile s'efforce d'assurer la disponibilité du service 24h/24 et 7j/7. Toutefois, des interruptions peuvent survenir pour maintenance, mise à jour ou en cas de force majeure.

Le service est fourni « en l'état ». Supfile ne garantit pas l'absence d'erreurs, de bugs ou d'interruptions. La responsabilité de Supfile ne saurait être engagée en cas de perte de données, d'indisponibilité du service ou de dommages indirects.`,
    },
    {
      title: "10. Résiliation",
      content: `L'utilisateur peut supprimer son compte à tout moment depuis les paramètres de son profil. La suppression du compte entraîne la suppression définitive de l'ensemble des fichiers, dossiers et partages associés.

Supfile se réserve le droit de suspendre ou supprimer tout compte sans préavis en cas de violation des présentes CGU ou de la loi applicable.`,
    },
    {
      title: "11. Modification des CGU",
      content: `Supfile se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle. La poursuite de l'utilisation du service après modification vaut acceptation des nouvelles conditions.`,
    },
    {
      title: "12. Droit applicable",
      content: `Les présentes CGU sont régies par le droit français. En cas de litige, les parties s'efforceront de trouver une solution amiable avant tout recours judiciaire. À défaut, les tribunaux français seront seuls compétents.`,
    },
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet" />

      <div className="bg-[#0d0d0d] text-[#ededed] font-['DM_Sans',sans-serif] min-h-screen">

        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-12 py-4 bg-[#0d0d0d]/75 backdrop-blur-2xl border-b border-white/[0.07]">
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
          <div className="flex gap-2.5">
            <a href="/login" className="px-[18px] py-2 rounded-lg text-sm text-[#bbb] border border-[#7c6ef8]/25 hover:border-[#7c6ef8] hover:text-white transition-all no-underline">Se connecter</a>
            <a href="/register" className="px-[18px] py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] hover:opacity-90 hover:-translate-y-px transition-all no-underline">S'inscrire</a>
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-[860px] mx-auto px-6 pt-36 pb-24">

          {/* Header */}
          <div className="mb-14">
            <p className="text-[11px] text-[#7c6ef8] uppercase tracking-[2.5px] font-medium mb-3">Légal</p>
            <h1 className="font-['Syne',sans-serif] font-extrabold text-[42px] -tracking-[1.5px] mb-4">
              Conditions Générales<br />
              <span className="bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] bg-clip-text text-transparent">d'Utilisation</span>
            </h1>
            <p className="text-[#555] text-[14px]">Dernière mise à jour : <span className="text-[#777]">21 mai 2026</span></p>
          </div>

          {/* Intro */}
          <div className="bg-[#141414] border border-[#7c6ef8]/[0.15] rounded-2xl px-8 py-6 mb-10 text-[14px] text-[#888] leading-[1.75]">
            Bienvenue sur <strong className="text-[#bbb]">Supfile</strong>. En accédant à la plateforme et en créant un compte, vous acceptez sans réserve les présentes Conditions Générales d'Utilisation. Nous vous invitons à les lire attentivement avant toute utilisation du service.
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-2">
            {sections.map((s, i) => (
              <div key={i} className="border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-8 py-5 bg-[#111]">
                  <h2 className="font-['Syne',sans-serif] font-bold text-[17px] text-[#e8e8e8]">{s.title}</h2>
                </div>
                <div className="px-8 py-6 bg-[#0d0d0d] border-t border-white/[0.04]">
                  {s.content.split("\n\n").map((para, j) => (
                    <p key={j} className="text-[14px] text-[#777] leading-[1.8] mb-4 last:mb-0 whitespace-pre-line">{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer links */}
          <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-wrap gap-6 text-[13px]">
            <a href="/mentions-legales" className="text-[#7c6ef8] hover:text-[#9d93f9] transition-colors no-underline">Mentions légales →</a>
            <a href="/" className="text-[#555] hover:text-[#888] transition-colors no-underline">Retour à l'accueil</a>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.07] px-12 py-8 flex items-center justify-between">
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
          <span className="text-[12px] text-[#333]">© 2026 Supfile. Tous droits réservés.</span>
          <div className="flex gap-5">
            <a href="/cgu" className="text-[12px] text-[#333] no-underline hover:text-[#888] transition-colors">CGU</a>
            <a href="/mentions-legales" className="text-[12px] text-[#333] no-underline hover:text-[#888] transition-colors">Mentions légales</a>
          </div>
        </footer>
      </div>
    </>
  );
}
