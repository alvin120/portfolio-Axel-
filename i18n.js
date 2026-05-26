(function () {
'use strict';

/* ═══════════════════════════════════════════════════
   LANGUES DISPONIBLES
═══════════════════════════════════════════════════ */
const LANGS = {
  fr: { flag: '🇫🇷', name: 'Français' },
  en: { flag: '🇬🇧', name: 'English' },
  es: { flag: '🇪🇸', name: 'Español' },
  pt: { flag: '🇧🇷', name: 'Português' },
  zh: { flag: '🇨🇳', name: '中文' },
  de: { flag: '🇩🇪', name: 'Deutsch' },
  it: { flag: '🇮🇹', name: 'Italiano' },
  ja: { flag: '🇯🇵', name: '日本語' },
};

/* ═══════════════════════════════════════════════════
   TRADUCTIONS
═══════════════════════════════════════════════════ */
const T = {

/* ──────────────────── FRANÇAIS ──────────────────── */
fr: {
  nav_home:'Présentation', nav_exp:'Expériences', nav_skills:'Compétences',
  nav_trips:'Voyages', nav_restaurant:'Restaurant', nav_sites:'Sites Internet', nav_contact:'Contact',
  footer:'© 2026 Portfolio d\'Axel Tagrou. Tous droits réservés.',
  hero_tag:'Disponible pour de nouveaux projets',
  hero_greeting:'Bonjour, je suis',
  hero_subtitle:'Développeur Web Full Stack & IA passionné, je conçois des sites modernes, applications mobiles, maquettes design et expériences sur mesure depuis 2020.',
  hero_cta_contact:'Me contacter', hero_cta_sites:'Voir mes sites',
  stat_exp:'Années d\'expérience', stat_countries:'Pays visités', stat_sites:'Sites créés', stat_continents:'Continents explorés',
  about_title:'À propos <span>de moi</span>',
  about_p1:'Je suis Axel, développeur web full stack basé en France. Passionné par le numérique depuis 2020, je crée des sites web et applications modernes alliant performance, design soigné et expérience utilisateur optimale.',
  about_p2:'Curieux et toujours en veille technologique, je maîtrise aussi bien le front-end (HTML, CSS, JavaScript, React) que le back-end (PHP, Symfony, MySQL). J\'intègre également les outils d\'intelligence artificielle dans mes projets pour aller plus loin.',
  about_p3:'En dehors du code, je suis un grand voyageur — 18 pays visités sur 3 continents — ce qui nourrit ma créativité et mon ouverture d\'esprit.',
  services_title:'Ce que je fais',
  services_sub:'Des compétences variées pour répondre à tous vos besoins digitaux.',
  svc_web_title:'Développement Web', svc_web_desc:'Création de sites et d\'applications web modernes, responsive et performants, du front-end au back-end.',
  svc_ai_title:'Intégration IA', svc_ai_desc:'Intégration d\'outils d\'intelligence artificielle (ChatGPT, Claude, Gemini) pour enrichir vos projets numériques.',
  svc_creative_title:'Curiosité & Créativité', svc_creative_desc:'Passionné de voyages et de cultures du monde, je m\'inspire de mes expériences pour créer des designs uniques.',
  svc_seo_title:'Référencement SEO', svc_seo_desc:'Optimisation Google : balises meta, données structurées JSON-LD, sitemap, vitesse de chargement. Votre site en première page.',
  svc_sec_title:'Sécurité Web & App', svc_sec_desc:'Protection XSS, injections, HTTPS, en-têtes de sécurité, validation des formulaires et rate-limiting. Votre site et vos données protégés.',
  svc_arrow:'Voir mes compétences', svc_arrow_sites:'Voir mes sites', svc_arrow_trips:'Voir mes voyages',
  cta_title:'Vous avez un projet en tête ?',
  cta_sub:'N\'hésitez pas à me contacter, je serai ravi d\'échanger avec vous.',
  cta_btn:'Me contacter',
  contact_title:'Me Contacter',
  contact_sub:'Vous avez une question ou une proposition ? N\'hésitez pas à me faire signe !',
  form_name:'Nom *', form_email:'Email *', form_subject:'Sujet *', form_message:'Message *', form_send:'Envoyer',
  res_title:'Réserver une Table', res_sub:'Souhaitez-vous réserver une table pour le restaurant ?',
  res_name:'Nom *', res_phone:'Téléphone *', res_date:'Date *', res_time:'Heure *', res_guests:'Nombre de personnes *', res_btn:'Réserver',
  trips_title:'Mes Voyages',
  trips_intro:'J\'ai eu la chance de visiter 18 pays sur 3 continents. Découvrez mes destinations en bleu sur la carte ci-dessous.',
  trips_countries:'Pays Visités', trips_favorites:'Destinations Préférées',
  exp_title:'Mes Expériences',
  skills_title:'Mes Compétences',
  sites_title:'Mes Sites Internet',
  restaurant_title:'Galettes, Crêpes et ambiance chaleureuse',
  restaurant_sub:'Découvrez une sélection gourmande de galettes salées et crêpes sucrées, préparées avec soin et ingrédients frais.',
  menu_title:'Notre Menu',
},

/* ──────────────────── ENGLISH ──────────────────── */
en: {
  nav_home:'About', nav_exp:'Experience', nav_skills:'Skills',
  nav_trips:'Travel', nav_restaurant:'Restaurant', nav_sites:'Websites', nav_contact:'Contact',
  footer:'© 2026 Axel Tagrou\'s Portfolio. All rights reserved.',
  hero_tag:'Available for new projects',
  hero_greeting:'Hello, I am',
  hero_subtitle:'Passionate Full Stack Web & AI Developer, I design modern websites, mobile apps, design mockups and custom digital experiences since 2020.',
  hero_cta_contact:'Contact me', hero_cta_sites:'See my sites',
  stat_exp:'Years of experience', stat_countries:'Countries visited', stat_sites:'Sites created', stat_continents:'Continents explored',
  about_title:'About <span>me</span>',
  about_p1:'I\'m Axel, a full stack web developer based in France. Passionate about digital technology since 2020, I create modern websites and applications combining performance, clean design and optimal user experience.',
  about_p2:'Curious and always up to date with technology, I master both front-end (HTML, CSS, JavaScript, React) and back-end (PHP, Symfony, MySQL). I also integrate artificial intelligence tools into my projects.',
  about_p3:'Outside of coding, I\'m an avid traveler — 18 countries visited across 3 continents — which fuels my creativity and open-mindedness.',
  services_title:'What I do',
  services_sub:'Varied skills to meet all your digital needs.',
  svc_web_title:'Web Development', svc_web_desc:'Building modern, responsive and high-performance websites and web applications, from front-end to back-end.',
  svc_ai_title:'AI Integration', svc_ai_desc:'Integrating artificial intelligence tools (ChatGPT, Claude, Gemini) to enhance your digital projects.',
  svc_creative_title:'Curiosity & Creativity', svc_creative_desc:'Passionate about travel and world cultures, I draw inspiration from my experiences to create unique designs.',
  svc_seo_title:'SEO Optimization', svc_seo_desc:'Google optimization: meta tags, JSON-LD structured data, sitemap, page speed. Get your site to the first page.',
  svc_sec_title:'Web & App Security', svc_sec_desc:'XSS protection, injections, HTTPS, security headers, form validation and rate-limiting. Your site and data protected.',
  svc_arrow:'See my skills', svc_arrow_sites:'See my sites', svc_arrow_trips:'See my travels',
  cta_title:'Have a project in mind?',
  cta_sub:'Feel free to contact me, I\'ll be happy to discuss it with you.',
  cta_btn:'Contact me',
  contact_title:'Contact Me',
  contact_sub:'Have a question or a proposal? Feel free to reach out!',
  form_name:'Name *', form_email:'Email *', form_subject:'Subject *', form_message:'Message *', form_send:'Send',
  res_title:'Book a Table', res_sub:'Would you like to book a table at the restaurant?',
  res_name:'Name *', res_phone:'Phone *', res_date:'Date *', res_time:'Time *', res_guests:'Number of guests *', res_btn:'Book',
  trips_title:'My Travels',
  trips_intro:'I have had the chance to visit 18 countries across 3 continents. Discover my destinations in blue on the map below.',
  trips_countries:'Countries Visited', trips_favorites:'Favorite Destinations',
  exp_title:'My Experience',
  skills_title:'My Skills',
  sites_title:'My Websites',
  restaurant_title:'Galettes, Crêpes and warm atmosphere',
  restaurant_sub:'Discover a gourmet selection of savory galettes and sweet crêpes, prepared with care and fresh ingredients.',
  menu_title:'Our Menu',
},

/* ──────────────────── ESPAÑOL ──────────────────── */
es: {
  nav_home:'Presentación', nav_exp:'Experiencias', nav_skills:'Competencias',
  nav_trips:'Viajes', nav_restaurant:'Restaurante', nav_sites:'Sitios Web', nav_contact:'Contacto',
  footer:'© 2026 Portfolio de Axel Tagrou. Todos los derechos reservados.',
  hero_tag:'Disponible para nuevos proyectos',
  hero_greeting:'Hola, soy',
  hero_subtitle:'Desarrollador Web Full Stack e IA apasionado, diseño sitios web modernos, aplicaciones móviles, maquetas y experiencias a medida desde 2020.',
  hero_cta_contact:'Contáctame', hero_cta_sites:'Ver mis sitios',
  stat_exp:'Años de experiencia', stat_countries:'Países visitados', stat_sites:'Sitios creados', stat_continents:'Continentes explorados',
  about_title:'Acerca <span>de mí</span>',
  about_p1:'Soy Axel, desarrollador web full stack basado en Francia. Apasionado por lo digital desde 2020, creo sitios web y aplicaciones modernas que combinan rendimiento, diseño cuidado y experiencia de usuario óptima.',
  about_p2:'Curioso y siempre al día con la tecnología, domino tanto el front-end (HTML, CSS, JavaScript, React) como el back-end (PHP, Symfony, MySQL). También integro herramientas de inteligencia artificial en mis proyectos.',
  about_p3:'Fuera del código, soy un gran viajero — 18 países visitados en 3 continentes — lo que alimenta mi creatividad y apertura mental.',
  services_title:'Lo que hago',
  services_sub:'Habilidades variadas para satisfacer todas sus necesidades digitales.',
  svc_web_title:'Desarrollo Web', svc_web_desc:'Creación de sitios y aplicaciones web modernos, responsive y de alto rendimiento, de front-end a back-end.',
  svc_ai_title:'Integración IA', svc_ai_desc:'Integración de herramientas de inteligencia artificial (ChatGPT, Claude, Gemini) para enriquecer sus proyectos digitales.',
  svc_creative_title:'Curiosidad & Creatividad', svc_creative_desc:'Apasionado por los viajes y las culturas del mundo, me inspiro en mis experiencias para crear diseños únicos.',
  svc_seo_title:'SEO & Posicionamiento', svc_seo_desc:'Optimización Google: etiquetas meta, datos estructurados JSON-LD, sitemap, velocidad de carga. Su sitio en primera página.',
  svc_sec_title:'Seguridad Web & App', svc_sec_desc:'Protección XSS, inyecciones, HTTPS, cabeceras de seguridad, validación de formularios y rate-limiting.',
  svc_arrow:'Ver mis competencias', svc_arrow_sites:'Ver mis sitios', svc_arrow_trips:'Ver mis viajes',
  cta_title:'¿Tienes un proyecto en mente?',
  cta_sub:'No dudes en contactarme, estaré encantado de hablar contigo.',
  cta_btn:'Contáctame',
  contact_title:'Contáctame',
  contact_sub:'¿Tienes una pregunta o propuesta? ¡No dudes en escribirme!',
  form_name:'Nombre *', form_email:'Email *', form_subject:'Asunto *', form_message:'Mensaje *', form_send:'Enviar',
  res_title:'Reservar una Mesa', res_sub:'¿Deseas reservar una mesa en el restaurante?',
  res_name:'Nombre *', res_phone:'Teléfono *', res_date:'Fecha *', res_time:'Hora *', res_guests:'Número de personas *', res_btn:'Reservar',
  trips_title:'Mis Viajes',
  trips_intro:'He tenido la suerte de visitar 18 países en 3 continentes. Descubre mis destinos en azul en el mapa.',
  trips_countries:'Países Visitados', trips_favorites:'Destinos Favoritos',
  exp_title:'Mi Experiencia',
  skills_title:'Mis Competencias',
  sites_title:'Mis Sitios Web',
  restaurant_title:'Galettes, Crêpes y ambiente cálido',
  restaurant_sub:'Descubre una selección gourmet de galettes saladas y crêpes dulces, preparadas con cuidado e ingredientes frescos.',
  menu_title:'Nuestro Menú',
},

/* ──────────────────── PORTUGUÊS ──────────────────── */
pt: {
  nav_home:'Apresentação', nav_exp:'Experiências', nav_skills:'Competências',
  nav_trips:'Viagens', nav_restaurant:'Restaurante', nav_sites:'Sites Web', nav_contact:'Contato',
  footer:'© 2026 Portfólio de Axel Tagrou. Todos os direitos reservados.',
  hero_tag:'Disponível para novos projetos',
  hero_greeting:'Olá, eu sou',
  hero_subtitle:'Desenvolvedor Web Full Stack & IA apaixonado, crio sites modernos, aplicativos móveis, maquetes de design e experiências personalizadas desde 2020.',
  hero_cta_contact:'Entrar em contato', hero_cta_sites:'Ver meus sites',
  stat_exp:'Anos de experiência', stat_countries:'Países visitados', stat_sites:'Sites criados', stat_continents:'Continentes explorados',
  about_title:'Sobre <span>mim</span>',
  about_p1:'Sou Axel, desenvolvedor web full stack baseado na França. Apaixonado pelo digital desde 2020, crio sites e aplicações modernas combinando performance, design cuidadoso e experiência do usuário otimizada.',
  about_p2:'Curioso e sempre atualizado com a tecnologia, domino tanto o front-end (HTML, CSS, JavaScript, React) quanto o back-end (PHP, Symfony, MySQL). Também integro ferramentas de inteligência artificial nos meus projetos.',
  about_p3:'Fora do código, sou um grande viajante — 18 países visitados em 3 continentes — o que alimenta minha criatividade e abertura de espírito.',
  services_title:'O que faço',
  services_sub:'Habilidades variadas para atender todas as suas necessidades digitais.',
  svc_web_title:'Desenvolvimento Web', svc_web_desc:'Criação de sites e aplicações web modernos, responsivos e de alto desempenho, do front-end ao back-end.',
  svc_ai_title:'Integração IA', svc_ai_desc:'Integração de ferramentas de inteligência artificial (ChatGPT, Claude, Gemini) para enriquecer seus projetos digitais.',
  svc_creative_title:'Curiosidade & Criatividade', svc_creative_desc:'Apaixonado por viagens e culturas do mundo, me inspiro em minhas experiências para criar designs únicos.',
  svc_seo_title:'SEO & Posicionamento', svc_seo_desc:'Otimização Google: meta tags, dados estruturados JSON-LD, sitemap, velocidade de carregamento. Seu site na primeira página.',
  svc_sec_title:'Segurança Web & App', svc_sec_desc:'Proteção XSS, injeções, HTTPS, cabeçalhos de segurança, validação de formulários e rate-limiting.',
  svc_arrow:'Ver minhas competências', svc_arrow_sites:'Ver meus sites', svc_arrow_trips:'Ver minhas viagens',
  cta_title:'Tem um projeto em mente?',
  cta_sub:'Não hesite em me contatar, ficaria feliz em conversar com você.',
  cta_btn:'Entrar em contato',
  contact_title:'Entre em Contato',
  contact_sub:'Tem uma pergunta ou proposta? Não hesite em me escrever!',
  form_name:'Nome *', form_email:'Email *', form_subject:'Assunto *', form_message:'Mensagem *', form_send:'Enviar',
  res_title:'Reservar uma Mesa', res_sub:'Deseja reservar uma mesa no restaurante?',
  res_name:'Nome *', res_phone:'Telefone *', res_date:'Data *', res_time:'Hora *', res_guests:'Número de pessoas *', res_btn:'Reservar',
  trips_title:'Minhas Viagens',
  trips_intro:'Tive a chance de visitar 18 países em 3 continentes. Descubra meus destinos em azul no mapa.',
  trips_countries:'Países Visitados', trips_favorites:'Destinos Favoritos',
  exp_title:'Minha Experiência',
  skills_title:'Minhas Competências',
  sites_title:'Meus Sites',
  restaurant_title:'Galettes, Crêpes e ambiente acolhedor',
  restaurant_sub:'Descubra uma seleção gourmet de galettes salgadas e crêpes doces, preparadas com cuidado e ingredientes frescos.',
  menu_title:'Nosso Cardápio',
},

/* ──────────────────── 中文 ──────────────────── */
zh: {
  nav_home:'简介', nav_exp:'经验', nav_skills:'技能',
  nav_trips:'旅行', nav_restaurant:'餐厅', nav_sites:'网站', nav_contact:'联系',
  footer:'© 2026 Axel Tagrou 作品集。保留所有权利。',
  hero_tag:'正在接受新项目',
  hero_greeting:'你好，我是',
  hero_subtitle:'充满热情的全栈Web与AI开发者，自2020年起为客户打造现代网站、移动应用、设计原型和定制化数字体验。',
  hero_cta_contact:'联系我', hero_cta_sites:'查看网站',
  stat_exp:'年经验', stat_countries:'访问国家', stat_sites:'创建网站', stat_continents:'探索大洲',
  about_title:'关于<span>我</span>',
  about_p1:'我是Axel，一名驻法全栈Web开发者。自2020年起热衷于数字技术，致力于打造融合高性能、精致设计与最佳用户体验的现代网站和应用。',
  about_p2:'思维活跃，紧跟技术前沿。精通前端（HTML、CSS、JavaScript、React）与后端（PHP、Symfony、MySQL）技术，并将人工智能工具融入项目中。',
  about_p3:'工作之余，我热爱旅行——足迹遍及3大洲18个国家——这滋养了我的创造力与开放视野。',
  services_title:'我的服务',
  services_sub:'多样化技能，满足您所有数字化需求。',
  svc_web_title:'网站开发', svc_web_desc:'打造现代化、响应式、高性能的网站与Web应用，全栈覆盖。',
  svc_ai_title:'AI集成', svc_ai_desc:'集成人工智能工具（ChatGPT、Claude、Gemini）以丰富您的数字项目。',
  svc_creative_title:'好奇心与创意', svc_creative_desc:'热爱旅行与世界文化，从亲身体验中汲取灵感，创造独特设计。',
  svc_seo_title:'SEO优化', svc_seo_desc:'谷歌优化：元标签、JSON-LD结构化数据、站点地图、加载速度。让您的网站登上首页。',
  svc_sec_title:'网络与应用安全', svc_sec_desc:'XSS防护、注入攻击、HTTPS、安全标头、表单验证和限速。保护您的网站和数据。',
  svc_arrow:'查看技能', svc_arrow_sites:'查看网站', svc_arrow_trips:'查看旅行',
  cta_title:'有项目想法？',
  cta_sub:'欢迎随时联系我，很乐意与您交流探讨。',
  cta_btn:'联系我',
  contact_title:'联系我',
  contact_sub:'有问题或建议？欢迎随时与我联系！',
  form_name:'姓名 *', form_email:'邮箱 *', form_subject:'主题 *', form_message:'消息 *', form_send:'发送',
  res_title:'预订座位', res_sub:'您想在餐厅预订座位吗？',
  res_name:'姓名 *', res_phone:'电话 *', res_date:'日期 *', res_time:'时间 *', res_guests:'用餐人数 *', res_btn:'预订',
  trips_title:'我的旅行',
  trips_intro:'我有幸走访3大洲18个国家。地图上蓝色标注的即为我的目的地。',
  trips_countries:'已访问国家', trips_favorites:'最爱目的地',
  exp_title:'我的经历',
  skills_title:'我的技能',
  sites_title:'我的网站',
  restaurant_title:'可丽饼与温馨氛围',
  restaurant_sub:'精选咸味可丽饼和甜味薄饼，精心制作，使用新鲜食材。',
  menu_title:'菜单',
},

/* ──────────────────── DEUTSCH ──────────────────── */
de: {
  nav_home:'Präsentation', nav_exp:'Erfahrungen', nav_skills:'Kompetenzen',
  nav_trips:'Reisen', nav_restaurant:'Restaurant', nav_sites:'Webseiten', nav_contact:'Kontakt',
  footer:'© 2026 Portfolio von Axel Tagrou. Alle Rechte vorbehalten.',
  hero_tag:'Verfügbar für neue Projekte',
  hero_greeting:'Hallo, ich bin',
  hero_subtitle:'Leidenschaftlicher Full Stack Web- & KI-Entwickler, entwerfe ich seit 2020 moderne Websites, mobile Apps, Design-Mockups und maßgeschneiderte Erlebnisse.',
  hero_cta_contact:'Kontakt aufnehmen', hero_cta_sites:'Meine Websites',
  stat_exp:'Jahre Erfahrung', stat_countries:'Bereiste Länder', stat_sites:'Erstellte Websites', stat_continents:'Erkundete Kontinente',
  about_title:'Über <span>mich</span>',
  about_p1:'Ich bin Axel, ein Full Stack Webentwickler aus Frankreich. Seit 2020 begeistert von der digitalen Welt, erstelle ich moderne Websites und Anwendungen, die Performance, ansprechendes Design und optimale Nutzererfahrung vereinen.',
  about_p2:'Neugierig und immer auf dem neuesten Stand der Technik beherrsche ich sowohl Front-end (HTML, CSS, JavaScript, React) als auch Back-end (PHP, Symfony, MySQL). Ich integriere auch KI-Tools in meine Projekte.',
  about_p3:'Neben dem Code bin ich ein leidenschaftlicher Reisender — 18 Länder auf 3 Kontinenten — was meine Kreativität und Offenheit bereichert.',
  services_title:'Was ich mache',
  services_sub:'Vielfältige Kompetenzen für alle Ihre digitalen Bedürfnisse.',
  svc_web_title:'Webentwicklung', svc_web_desc:'Erstellung moderner, responsiver und leistungsstarker Websites und Web-Apps, von Front-end bis Back-end.',
  svc_ai_title:'KI-Integration', svc_ai_desc:'Integration von KI-Tools (ChatGPT, Claude, Gemini) zur Bereicherung Ihrer digitalen Projekte.',
  svc_creative_title:'Neugier & Kreativität', svc_creative_desc:'Als Reise- und Kulturenthusiast lasse ich mich von meinen Erfahrungen zu einzigartigen Designs inspirieren.',
  svc_seo_title:'SEO-Optimierung', svc_seo_desc:'Google-Optimierung: Meta-Tags, JSON-LD strukturierte Daten, Sitemap, Ladegeschwindigkeit. Ihre Website auf der ersten Seite.',
  svc_sec_title:'Web- & App-Sicherheit', svc_sec_desc:'XSS-Schutz, Injektionen, HTTPS, Sicherheits-Header, Formularvalidierung und Rate-Limiting.',
  svc_arrow:'Meine Kompetenzen', svc_arrow_sites:'Meine Websites', svc_arrow_trips:'Meine Reisen',
  cta_title:'Haben Sie ein Projekt?',
  cta_sub:'Kontaktieren Sie mich gerne, ich freue mich auf den Austausch.',
  cta_btn:'Kontakt aufnehmen',
  contact_title:'Kontakt',
  contact_sub:'Haben Sie eine Frage oder ein Angebot? Melden Sie sich gerne!',
  form_name:'Name *', form_email:'E-Mail *', form_subject:'Betreff *', form_message:'Nachricht *', form_send:'Senden',
  res_title:'Tisch reservieren', res_sub:'Möchten Sie einen Tisch im Restaurant reservieren?',
  res_name:'Name *', res_phone:'Telefon *', res_date:'Datum *', res_time:'Uhrzeit *', res_guests:'Personenanzahl *', res_btn:'Reservieren',
  trips_title:'Meine Reisen',
  trips_intro:'Ich hatte das Glück, 18 Länder auf 3 Kontinenten zu besuchen. Entdecken Sie meine Reiseziele in Blau auf der Karte.',
  trips_countries:'Bereiste Länder', trips_favorites:'Lieblingsreiseziele',
  exp_title:'Meine Erfahrungen',
  skills_title:'Meine Kompetenzen',
  sites_title:'Meine Webseiten',
  restaurant_title:'Galettes, Crêpes und gemütliche Atmosphäre',
  restaurant_sub:'Entdecken Sie eine feine Auswahl herzhafter Galettes und süßer Crêpes, sorgfältig mit frischen Zutaten zubereitet.',
  menu_title:'Unsere Speisekarte',
},

/* ──────────────────── ITALIANO ──────────────────── */
it: {
  nav_home:'Presentazione', nav_exp:'Esperienze', nav_skills:'Competenze',
  nav_trips:'Viaggi', nav_restaurant:'Ristorante', nav_sites:'Siti Web', nav_contact:'Contatto',
  footer:'© 2026 Portfolio di Axel Tagrou. Tutti i diritti riservati.',
  hero_tag:'Disponibile per nuovi progetti',
  hero_greeting:'Ciao, sono',
  hero_subtitle:'Sviluppatore Web Full Stack & IA appassionato, progetto siti web moderni, applicazioni mobili, mockup di design ed esperienze su misura dal 2020.',
  hero_cta_contact:'Contattami', hero_cta_sites:'Vedi i miei siti',
  stat_exp:'Anni di esperienza', stat_countries:'Paesi visitati', stat_sites:'Siti creati', stat_continents:'Continenti esplorati',
  about_title:'Su di <span>me</span>',
  about_p1:'Sono Axel, sviluppatore web full stack basato in Francia. Appassionato di digitale dal 2020, creo siti web e applicazioni moderne che uniscono performance, design curato e ottima esperienza utente.',
  about_p2:'Curioso e sempre aggiornato sulle tecnologie, padroneggio sia il front-end (HTML, CSS, JavaScript, React) che il back-end (PHP, Symfony, MySQL). Integro anche strumenti di intelligenza artificiale nei miei progetti.',
  about_p3:'Fuori dal codice, sono un grande viaggiatore — 18 paesi visitati su 3 continenti — il che alimenta la mia creatività e apertura mentale.',
  services_title:'Cosa faccio',
  services_sub:'Competenze variegate per soddisfare tutte le vostre esigenze digitali.',
  svc_web_title:'Sviluppo Web', svc_web_desc:'Creazione di siti e applicazioni web moderni, responsive e performanti, dal front-end al back-end.',
  svc_ai_title:'Integrazione IA', svc_ai_desc:'Integrazione di strumenti di intelligenza artificiale (ChatGPT, Claude, Gemini) per arricchire i vostri progetti digitali.',
  svc_creative_title:'Curiosità & Creatività', svc_creative_desc:'Appassionato di viaggi e culture del mondo, mi ispiro alle mie esperienze per creare design unici.',
  svc_seo_title:'SEO & Posizionamento', svc_seo_desc:'Ottimizzazione Google: meta tag, dati strutturati JSON-LD, sitemap, velocità di caricamento. Il vostro sito in prima pagina.',
  svc_sec_title:'Sicurezza Web & App', svc_sec_desc:'Protezione XSS, iniezioni, HTTPS, intestazioni di sicurezza, validazione dei moduli e rate-limiting.',
  svc_arrow:'Vedi le mie competenze', svc_arrow_sites:'Vedi i miei siti', svc_arrow_trips:'Vedi i miei viaggi',
  cta_title:'Hai un progetto in mente?',
  cta_sub:'Non esitare a contattarmi, sarò felice di parlarne con te.',
  cta_btn:'Contattami',
  contact_title:'Contattami',
  contact_sub:'Hai una domanda o una proposta? Non esitare a scrivermi!',
  form_name:'Nome *', form_email:'Email *', form_subject:'Oggetto *', form_message:'Messaggio *', form_send:'Invia',
  res_title:'Prenota un Tavolo', res_sub:'Desiderate prenotare un tavolo al ristorante?',
  res_name:'Nome *', res_phone:'Telefono *', res_date:'Data *', res_time:'Ora *', res_guests:'Numero di persone *', res_btn:'Prenota',
  trips_title:'I miei Viaggi',
  trips_intro:'Ho avuto la fortuna di visitare 18 paesi su 3 continenti. Scopri le mie destinazioni in blu sulla mappa.',
  trips_countries:'Paesi Visitati', trips_favorites:'Destinazioni Preferite',
  exp_title:'La mia Esperienza',
  skills_title:'Le mie Competenze',
  sites_title:'I miei Siti Web',
  restaurant_title:'Galettes, Crêpes e atmosfera accogliente',
  restaurant_sub:'Scoprite una selezione gourmand di galettes salate e crêpes dolci, preparate con cura e ingredienti freschi.',
  menu_title:'Il Nostro Menu',
},

/* ──────────────────── 日本語 ──────────────────── */
ja: {
  nav_home:'紹介', nav_exp:'経験', nav_skills:'スキル',
  nav_trips:'旅行', nav_restaurant:'レストラン', nav_sites:'ウェブサイト', nav_contact:'お問い合わせ',
  footer:'© 2026 Axel Tagrou のポートフォリオ。無断転載禁止。',
  hero_tag:'新しいプロジェクト受付中',
  hero_greeting:'こんにちは、私は',
  hero_subtitle:'情熱的なフルスタックWeb・AI開発者として、2020年からモダンなウェブサイト、モバイルアプリ、デザインモックアップ、カスタム体験を制作しています。',
  hero_cta_contact:'お問い合わせ', hero_cta_sites:'サイトを見る',
  stat_exp:'年の経験', stat_countries:'訪問国数', stat_sites:'制作サイト数', stat_continents:'訪問大陸数',
  about_title:'私<span>について</span>',
  about_p1:'私はAxel、フランス在住のフルスタックWeb開発者です。2020年からデジタルの世界に情熱を持ち、パフォーマンス・洗練されたデザイン・最高のユーザー体験を融合したウェブサイトとアプリを制作しています。',
  about_p2:'好奇心旺盛で常に技術トレンドをキャッチアップ。フロントエンド（HTML・CSS・JavaScript・React）からバックエンド（PHP・Symfony・MySQL）まで幅広く対応し、AIツールもプロジェクトに統合しています。',
  about_p3:'コード以外では、旅好きとして3大陸18カ国を訪問。多様な文化体験が私の創造性と柔軟な思考を育んでいます。',
  services_title:'私のサービス',
  services_sub:'あらゆるデジタルニーズに対応する多彩なスキル。',
  svc_web_title:'Web開発', svc_web_desc:'フロントエンドからバックエンドまで、モダンでレスポンシブ、高パフォーマンスなウェブサイト・アプリを制作。',
  svc_ai_title:'AI統合', svc_ai_desc:'ChatGPT・Claude・GeminiなどのAIツールをプロジェクトに統合し、デジタル体験を向上。',
  svc_creative_title:'好奇心と創造性', svc_creative_desc:'旅と世界の文化への情熱から独自のデザインインスピレーションを得ています。',
  svc_seo_title:'SEO最適化', svc_seo_desc:'Google最適化：メタタグ・JSON-LD構造化データ・サイトマップ・表示速度。検索結果の上位表示を実現。',
  svc_sec_title:'Webセキュリティ', svc_sec_desc:'XSS対策・SQLインジェクション・HTTPS・セキュリティヘッダー・フォームバリデーション・レート制限。',
  svc_arrow:'スキルを見る', svc_arrow_sites:'サイトを見る', svc_arrow_trips:'旅行を見る',
  cta_title:'プロジェクトをお持ちですか？',
  cta_sub:'お気軽にご連絡ください。喜んでお話しします。',
  cta_btn:'お問い合わせ',
  contact_title:'お問い合わせ',
  contact_sub:'ご質問やご提案がありましたら、お気軽にどうぞ！',
  form_name:'氏名 *', form_email:'メール *', form_subject:'件名 *', form_message:'メッセージ *', form_send:'送信',
  res_title:'テーブルを予約する', res_sub:'レストランのテーブルをご予約されますか？',
  res_name:'氏名 *', res_phone:'電話番号 *', res_date:'日付 *', res_time:'時間 *', res_guests:'人数 *', res_btn:'予約する',
  trips_title:'私の旅行',
  trips_intro:'3大陸18カ国を訪問しました。地図の青色でご確認ください。',
  trips_countries:'訪問国一覧', trips_favorites:'お気に入りの目的地',
  exp_title:'私の経験',
  skills_title:'私のスキル',
  sites_title:'私のウェブサイト',
  restaurant_title:'ガレット、クレープ、温かい雰囲気',
  restaurant_sub:'新鮮な食材を丁寧に使ったしょっぱいガレットと甘いクレープをお楽しみください。',
  menu_title:'メニュー',
},

}; // end T

/* ═══════════════════════════════════════════════════
   MAPPING SÉLECTEURS → CLÉS (sans data-i18n dans HTML)
═══════════════════════════════════════════════════ */
const SELMAP = [
  // Navigation par href
  { s:'a[href="index.html"]',        k:'nav_home' },
  { s:'a[href="experience.html"]',   k:'nav_exp' },
  { s:'a[href="compétence.html"]',   k:'nav_skills' },
  { s:'a[href="voyages.html"]',      k:'nav_trips' },
  { s:'a[href="accueil.html"]',      k:'nav_restaurant' },
  { s:'a[href="sites.html"]',        k:'nav_sites' },
  { s:'nav a[href="contact.html"]',  k:'nav_contact' },
  // Footer
  { s:'footer p', k:'footer', html:false },
];

/* ═══════════════════════════════════════════════════
   MOTEUR DE TRADUCTION
═══════════════════════════════════════════════════ */
function t(lang, key) {
  return (T[lang] && T[lang][key]) ? T[lang][key] : (T.fr[key] || '');
}

function apply(lang) {
  const d = document;

  // Sélecteurs directs
  SELMAP.forEach(({ s, k, html }) => {
    d.querySelectorAll(s).forEach(el => {
      if (html === false) el.textContent = t(lang, k);
      else el.textContent = t(lang, k);
    });
  });

  // data-i18n (innerHTML)
  d.querySelectorAll('[data-i18n]').forEach(el => {
    const v = t(lang, el.dataset.i18n);
    if (v) el.innerHTML = v;
  });

  // data-i18n-text (textContent uniquement)
  d.querySelectorAll('[data-i18n-text]').forEach(el => {
    const v = t(lang, el.dataset.i18nText);
    if (v) el.textContent = v;
  });

  // data-i18n-placeholder
  d.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const v = t(lang, el.dataset.i18nPlaceholder);
    if (v) el.placeholder = v;
  });

  // data-i18n-label (pour les labels de formulaire)
  d.querySelectorAll('[data-i18n-label]').forEach(el => {
    const v = t(lang, el.dataset.i18nLabel);
    if (v) el.textContent = v;
  });

  // Mettre à jour lang de la page
  document.documentElement.lang = lang;

  // Mettre à jour le switcher
  const cur = d.getElementById('i18nCurrent');
  if (cur) cur.textContent = LANGS[lang].flag + ' ' + lang.toUpperCase();
  d.querySelectorAll('.i18n-option').forEach(b => {
    b.classList.toggle('i18n-active', b.dataset.lang === lang);
  });
}

function setLang(lang) {
  if (!T[lang]) lang = 'fr';
  localStorage.setItem('i18n_lang', lang);
  apply(lang);
}

/* ═══════════════════════════════════════════════════
   CRÉATION DU SÉLECTEUR DE LANGUE
═══════════════════════════════════════════════════ */
function createSwitcher(lang) {
  const wrap = document.createElement('div');
  wrap.className = 'i18n-switcher';
  wrap.setAttribute('role', 'navigation');
  wrap.setAttribute('aria-label', 'Language selector');

  const options = Object.entries(LANGS).map(([code, info]) =>
    `<button class="i18n-option${code === lang ? ' i18n-active' : ''}" data-lang="${code}" role="option" aria-label="${info.name}">
       ${info.flag} ${info.name}
     </button>`
  ).join('');

  wrap.innerHTML = `
    <button class="i18n-btn" id="i18nBtn" aria-haspopup="listbox" aria-expanded="false" aria-label="Changer de langue">
      <i class="fas fa-globe" aria-hidden="true"></i>
      <span id="i18nCurrent">${LANGS[lang].flag} ${lang.toUpperCase()}</span>
      <i class="fas fa-chevron-down i18n-chevron" aria-hidden="true"></i>
    </button>
    <div class="i18n-dropdown" id="i18nDropdown" role="listbox" aria-label="Langues disponibles">
      ${options}
    </div>
  `;

  document.body.appendChild(wrap);

  const btn  = document.getElementById('i18nBtn');
  const drop = document.getElementById('i18nDropdown');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = drop.classList.toggle('i18n-open');
    btn.setAttribute('aria-expanded', open);
    btn.classList.toggle('i18n-open', open);
  });

  document.addEventListener('click', () => {
    drop.classList.remove('i18n-open');
    btn.classList.remove('i18n-open');
    btn.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      drop.classList.remove('i18n-open');
      btn.classList.remove('i18n-open');
    }
  });

  wrap.querySelectorAll('.i18n-option').forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      setLang(b.dataset.lang);
      drop.classList.remove('i18n-open');
      btn.classList.remove('i18n-open');
    });
  });
}

/* ═══════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const lang = localStorage.getItem('i18n_lang') || 'fr';
  createSwitcher(lang);
  if (lang !== 'fr') apply(lang);
});

})();
