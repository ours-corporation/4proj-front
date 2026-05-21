export default function MentionsLegales() {
  const blocks = [
    {
      title: "Éditeur du site",
      items: [
        { label: "Nom du site", value: "Supfile" },
        { label: "URL", value: "https://supfile.dev-lecomte.fr" },
        { label: "Nature du projet", value: "Projet scolaire — 4ème année" },
        { label: "Coordonnées de l'éditeur", value: "Communiquées à l'hébergeur conformément à l'article 6-III-2 de la loi LCEN du 21 juin 2004." },
      ],
    },
    {
      title: "Hébergement",
      items: [
        { label: "Hébergeur", value: "OVHcloud" },
        { label: "Adresse", value: "2 rue Kellermann, 59100 Roubaix — France" },
        { label: "Site", value: "https://www.ovhcloud.com" },
        { label: "API Backend", value: "https://api-supfile.dev-lecomte.fr" },
      ],
    },
    {
      title: "Propriété intellectuelle",
      content: `Le site Supfile, son interface, son logo, sa charte graphique et l'ensemble de son contenu éditorial sont protégés par le droit d'auteur (© 2026 Supfile). Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sauf autorisation écrite préalable de l'éditeur.

Les fichiers stockés par les utilisateurs restent la propriété exclusive de leurs auteurs. Supfile ne revendique aucun droit de propriété sur les contenus déposés par ses utilisateurs.`,
    },
    {
      title: "Données personnelles et RGPD",
      content: `Supfile collecte et traite les données personnelles suivantes dans le cadre de la fourniture de son service :

• Données d'identification : adresse email, nom d'utilisateur
• Données d'authentification : identifiants OAuth Google et/ou GitHub (si connexion via ces services)
• Données de profil : photo de profil (optionnelle)
• Données de navigation et d'utilisation : quota de stockage utilisé, fichiers et dossiers créés, partages effectués
• Données techniques : tokens de session (stockés sous forme hachée, non lisibles)

Ces données sont collectées à des fins strictement nécessaires au fonctionnement du service. Elles ne sont ni vendues ni transmises à des tiers à des fins commerciales.

Conformément au Règlement (UE) 2016/679 du 27 avril 2016 (RGPD) et à la loi n° 78-17 du 6 janvier 1978 modifiée (Loi Informatique et Libertés), vous disposez des droits suivants :

• Droit d'accès à vos données ;
• Droit de rectification des données inexactes ;
• Droit à l'effacement (droit à l'oubli) ;
• Droit à la portabilité de vos données ;
• Droit d'opposition au traitement.

Pour exercer ces droits, vous pouvez contacter : contact@supfile.fr`,
    },
    {
      title: "Cookies",
      content: `Supfile utilise des cookies techniques strictement nécessaires au fonctionnement du service, notamment pour :

• Maintenir votre session utilisateur via des tokens JWT ;
• Mémoriser vos préférences d'interface (thème clair/sombre).

Aucun cookie de traçage publicitaire ou analytique tiers n'est déposé sur votre navigateur.`,
    },
    {
      title: "Responsabilité",
      content: `Supfile s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, Supfile ne peut garantir l'exhaustivité, la précision ou l'actualité des informations.

Supfile ne saurait être tenu responsable :
• Des dommages directs ou indirects liés à l'utilisation du service ;
• D'une interruption de service, d'une perte de données ou d'une indisponibilité temporaire ;
• Du contenu des sites tiers vers lesquels des liens peuvent pointer.

L'utilisateur est seul responsable des fichiers qu'il stocke et partage via la plateforme.`,
    },
    {
      title: "Droit applicable",
      content: `Les présentes mentions légales sont régies par le droit français. En cas de litige relatif à leur interprétation ou à leur exécution, les juridictions françaises seront seules compétentes.`,
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
              Mentions<br />
              <span className="bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] bg-clip-text text-transparent">Légales</span>
            </h1>
            <p className="text-[#555] text-[14px]">Dernière mise à jour : <span className="text-[#777]">21 mai 2026</span></p>
          </div>

          {/* Blocks */}
          <div className="flex flex-col gap-2">
            {blocks.map((block, i) => (
              <div key={i} className="border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-8 py-5 bg-[#111]">
                  <h2 className="font-['Syne',sans-serif] font-bold text-[17px] text-[#e8e8e8]">{block.title}</h2>
                </div>
                <div className="px-8 py-6 bg-[#0d0d0d] border-t border-white/[0.04]">
                  {block.items ? (
                    <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3">
                      {block.items.map((item, j) => (
                        <>
                          <dt key={`dt-${j}`} className="text-[13px] text-[#555] font-medium shrink-0">{item.label}</dt>
                          <dd key={`dd-${j}`} className="text-[13px] text-[#999] m-0">{item.value}</dd>
                        </>
                      ))}
                    </dl>
                  ) : (
                    block.content?.split("\n\n").map((para, j) => (
                      <p key={j} className="text-[14px] text-[#777] leading-[1.8] mb-4 last:mb-0 whitespace-pre-line">{para}</p>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer links */}
          <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-wrap gap-6 text-[13px]">
            <a href="/cgu" className="text-[#7c6ef8] hover:text-[#9d93f9] transition-colors no-underline">Conditions Générales d'Utilisation →</a>
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
