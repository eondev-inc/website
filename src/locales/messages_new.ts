const messages = {
  es: {
    header: {
      headerHome: 'Inicio',
      headerAbout: 'Acerca',
      headerNews: 'Noticias',
      headerCTA: 'Contacto',
      selectLanguage: 'Idioma',
      viewOnGithub: 'Ver en GitHub'
    },
    footer: {
      mainMessage: 'Es una iniciativa personal con el proposito de crear una marca que permita impulsar el desarrollo de aplicaciones web enfocadas en las necesidades de los usuarios',
      followMe: 'S\u00edgueme en',
      navigation: 'Navegaci\u00f3n',
      technologies: 'Tecnolog\u00edas',
      contact: 'Contacto',
      projectInMind: '\u00bfTienes un proyecto en mente?',
      letsChat: 'Conversemos',
      allRightsReserved: 'Todos los derechos reservados',
      availableForProjects: 'Disponible para proyectos'
    },
    home: {
      aboutMe: {
        // Textos antiguos mantenidos para compatibilidad
        meFirts: 'Experiencia laboral',
        meTitle: 'Hola! Soy yerffrey Romero',
        meSubs: 'Desarrollador Fullstack',
        meDescription: 'Ingeniero en Computaci\u00f3n, con 7+ a\u00f1os de experiencia, trabajando en empresas como Starken, Izit, Tu Clase, tu pa\u00eds e I-Med. centrado en el desarrollo de aplicaciones Web con stack tecnol\u00f3gico NodeJS',
        meButton: 'Saber m\u00e1s',
        meAltImage: 'coding-me',
        meSeeMore: 'Ver m\u00e1s',
        // Nuevos textos para el hero moderno
        availability: 'Disponible para proyectos',
        greeting: 'Hola, soy',
        name: 'Yerffrey Romero',
        title: 'Desarrollador Full Stack',
        description: 'Ingeniero en Computaci\u00f3n con m\u00e1s de 7 a\u00f1os de experiencia creando aplicaciones web modernas y escalables. Especializado en el ecosistema JavaScript/TypeScript, enfocado en brindar soluciones tecnol\u00f3gicas que generen valor real a los usuarios.',
        yearsExp: 'A\u00f1os de experiencia',
        projects: 'Proyectos completados',
        technologies: 'Tecnolog\u00edas',
        techStack: 'Stack tecnol\u00f3gico principal',
        cta: 'Ver mi trabajo',
        contact: 'Conversemos',
        followMe: 'S\u00edgueme en',
        imageAlt: 'Yerffrey Romero desarrollando c\u00f3digo',
        status: 'Activo',
        statusDetail: 'Trabajando en nuevos proyectos'
      }
    },
    experiences: {
      node: {
        title: 'NodeJS',
        description: 'Experiencia en desarrollo de aplicaciones en NodeJS haciendo uso de frameworks o librerias tales como express, NestJS, Fastify, entre otros.'
      },
      database: {
        title: 'Base de datos',
        description: 'Experiencia en uso de base de datos relacionales y no relacionales tales como MySQL, MongoDB, DocumentDB, entre otros.'
      },
      webdevelopment: {
        title: 'Desarrollo Web',
        description: 'Experiencia en uso de librerias y/o framework para desarrollo de aplicaciones web, uso de Angular, Vuejs (v3) y tambi\u00e9n uso de framework fullstack NuxtJS (v3), entre otros.'
      }
    },
    news: {
      title: 'Noticias'
    },
    blog: {
      title: 'Noticias',
      subtitle: 'Art\u00edculos y reflexiones sobre desarrollo web, tecnolog\u00eda y mejores pr\u00e1cticas',
      searchPlaceholder: 'Buscar art\u00edculos...',
      loadingArticles: 'Cargando art\u00edculos...',
      retryingArticles: 'Reintentando cargar art\u00edculos...',
      errorLoadingArticles: 'Error al cargar los art\u00edculos',
      noArticlesFound: 'No se encontraron art\u00edculos',
      articlesInterest: '\u00bfTe interesan m\u00e1s art\u00edculos sobre desarrollo web?',
      viewAllArticles: 'Ver todos los art\u00edculos',
      filterBy: 'Filtrar por',
      articles: 'art\u00edculos',
      articlesCount: {
        3: '3 art\u00edculos',
        6: '6 art\u00edculos',
        9: '9 art\u00edculos',
        12: '12 art\u00edculos'
      }
    },
    experience: {
      title: 'Experiencia T\u00e9cnica',
      subtitle: 'Tecnolog\u00edas y herramientas con las que he trabajado para crear soluciones escalables',
      learnMore: '\u00bfQuieres saber m\u00e1s sobre mi experiencia t\u00e9cnica?'
    },
    callToAction: {
      title: 'Trabajemos Juntos',
      subtitle: '\u00bfTienes un proyecto en mente? Me encantar\u00eda escuchar tus ideas y ayudarte a convertirlas en realidad.',
      name: 'Nombre',
      namePlaceholder: 'Tu nombre completo',
      email: 'Email',
      emailPlaceholder: 'tu@email.com',
      message: 'Mensaje',
      messagePlaceholder: 'Cu\u00e9ntame sobre tu proyecto o idea...',
      send: 'Enviar Mensaje',
      sending: 'Enviando...',
      emailSubject: 'Contacto desde Portfolio',
      emailContactInfo: 'Informaci\u00f3n de contacto',
      emailMessage: 'Mensaje',
      emailFooter: 'Este mensaje fue enviado desde tu portfolio web.'
    }
  },
  en: {
    header: {
      headerHome: 'Home',
      headerAbout: 'About',
      headerNews: 'News',
      headerCTA: 'Contact',
      selectLanguage: 'Language',
      viewOnGithub: 'View on GitHub'
    },
    footer: {
      mainMessage: 'It is a personal initiative with the purpose of creating a brand that allows to boost the development of web applications focused on the needs of users',
      followMe: 'Follow me on',
      navigation: 'Navigation',
      technologies: 'Technologies',
      contact: 'Contact',
      projectInMind: 'Have a project in mind?',
      letsChat: "Let's talk",
      allRightsReserved: 'All rights reserved',
      availableForProjects: 'Available for projects'
    },
    home: {
      aboutMe: {
        // Legacy keys for compatibility
        meFirts: 'Professional experience',
        meTitle: 'Hi! I am Yerffrey Romero',
        meSubs: 'Fullstack Developer',
        meDescription: 'Computer Engineer, with 7+ years of experience, working in companies such as Starken, Izit, Tu Clase, tu pa\u00eds and I-Med. Focused on the development of Web applications with NodeJS technology stack.',
        meButton: 'Learn more',
        meAltImage: 'coding-me',
        meSeeMore: 'See more',
        // Modern hero keys
        availability: 'Available for hire',
        greeting: "Hi, I'm",
        name: 'Yerffrey Romero',
        title: 'Full Stack Developer',
        description: 'Computer Engineer with 7+ years of experience creating robust web applications. Specialized in modern technologies and scalable solutions.',
        yearsExp: 'Years Experience',
        projects: 'Projects Completed',
        technologies: 'Technologies',
        techStack: 'Tech Stack',
        cta: 'View My Work',
        contact: 'Get In Touch',
        followMe: 'Follow me on',
        imageAlt: 'Yerffrey Romero coding',
        status: 'Active',
        statusDetail: 'Working on new projects'
      }
    },
    experiences: {
      node: {
        title: 'NodeJS',
        description: 'Experience in developing applications in NodeJS making use of frameworks or libraries such as express, NestJS, Fastify, among others.'
      },
      database: {
        title: 'Database',
        description: 'Experience in using relational and non-relational databases such as MySQL, MongoDB, DocumentDB, among others.'
      },
      webdevelopment: {
        title: 'Web Development',
        description: 'Experience in using libraries and/or frameworks for web application development, use of Angular, Vuejs (v3) and also use of fullstack framework NuxtJS (v3), among others.'
      }
    },
    news: {
      title: 'News'
    },
    blog: {
      title: 'News',
      subtitle: 'Articles and reflections on web development, technology and best practices',
      searchPlaceholder: 'Search articles...',
      loadingArticles: 'Loading articles...',
      retryingArticles: 'Retrying to load articles...',
      errorLoadingArticles: 'Error loading articles',
      noArticlesFound: 'No articles found',
      articlesInterest: 'Interested in more web development articles?',
      viewAllArticles: 'View all articles',
      filterBy: 'Filter by',
      articles: 'articles',
      articlesCount: {
        3: '3 articles',
        6: '6 articles',
        9: '9 articles',
        12: '12 articles'
      }
    },
    experience: {
      title: 'Technical Experience',
      subtitle: "Technologies and tools I've worked with to create scalable solutions",
      learnMore: 'Want to know more about my technical experience?'
    },
    callToAction: {
      title: "Let's Work Together",
      subtitle: "Have a project in mind? I'd love to hear your ideas and help you turn them into reality.",
      name: 'Name',
      namePlaceholder: 'Your full name',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      message: 'Message',
      messagePlaceholder: 'Tell me about your project or idea...',
      send: 'Send Message',
      sending: 'Sending...',
      emailSubject: 'Contact from Portfolio',
      emailContactInfo: 'Contact information',
      emailMessage: 'Message',
      emailFooter: 'This message was sent from your web portfolio.'
    }
  }
}

export default messages
