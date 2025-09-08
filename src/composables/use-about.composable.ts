import { AboutMe } from '@/interfaces/about-me.interface'

const useAboutMe = () => {
  const aboutMeResume: any[] = [
    {
      es: [
        {
          title: 'Líder Técnico - Imed SA',
          description: `Como Líder Técnico en la célula Escritorio Médico en Imed S.A, 
          lideré y coordiné el 
          trabajo del equipo de desarrollo del producto Escritorio Médico para mantener y mejorar la arquitectura 
          técnica del producto. Identifiqué y resolví problemas técnicos y trabajé con 
          otros líderes técnicos y equipos de la empresa para asegurar la calidad y 
          eficiencia del desarrollo del producto.`,
          url: 'https://escritoriomedico.i-med.cl/',
          fromTo: 'Febrero. 2023 - Actualidad'
        },
        {
          title: 'Desarrollador Fullstack - Imed SA',
          description: `Como Desarrollador Fullstack en Imed S.A, logré mejorar significativamente 
          el producto mimed.com utilizando tecnologías avanzadas como NuxtJS, Vuejs y Tailwindcss 
          para la capa de presentación y el framework NestJS para la capa de modelo de negocio. 
          También desarrollé servicios API REST y procesos ETL en la herramienta Pentaho.
          En general, contribuí al 
          crecimiento y éxito del producto al aportar mis habilidades a la calidad del producto.`,
          url: 'https://mimed.com',
          fromTo: 'Sept. 2021 - Febrero 2023'
        },
        {
          title: 'Desarrollador Fullstack - Izit SpA',
          description: `Las principales tareas desempeñadas en el cargo se encuentra el desarrollo de servicios y diseñar arquitectura que soporta dichos servicios, principalmente utilizando tecnologías en la nube AWS.
          Desarrollo backend en Node.js, Java, PHP, MySQL, y servidores Apache2, manejo y
          control de versiones de software con GIT, investigación de nuevas tecnologías para el
          desarrollo de aplicaciones del lado del servidor y servicios internos de soporte.`,
          url: 'https://web.archive.org/web/20200919024522/https://www.izitapp.com/',
          fromTo: 'Sept. 2019 - Ago. 2021'
        },
        {
          title: 'Ingeniero de software - Tu Clase, tu país',
          description: `Desarrollador de aplicaciones Web, Móvil entre otras, desarrollo en 
          distintos lenguajes de programación FullStack JavaScript, Angular 2, Android, entre 
          otros, asimismo, encargado de mantenimiento de usuarios de la plataforma E-Learning Tuclase.cl 

          Manejo de arquitectura en la Nube para el despliegue de aplicaciones AWS (EC2 y RDS).`,
          url: 'https://tuclase.cl',
          fromTo: 'Ago. 2017 - Ago. 2019'
        },
        {
          title: 'Analista desarrollador - Staken SA',
          description: `Analista Desarrollador en el área de Proyectos de TI, desarrollo bajo esquema Web, Html, Js, Css3, PHP, así como, Nodejs, Express y MongoDB.

          Experiencia en arquitectura en la Nube, AWS y sus distintos servicios (EC2, RDS, CodeCommit, Cognito, ApiGateway, Lambda, entre otros).
          
          Desarrollo de sistemas administrativos y de gestión para clientes internos.

          Desarrollo de soluciones de software en ambiente móvil (Android).`,
          url: 'https://starken.cl',
          fromTo: 'Dic. 2015 - Jul. 2017'
        }
      ],
      en: [
        {
          title: 'Technical Leader - Imed SA',
          description: 'As a Technical Leader in the Medical Desktop cell at Imed S.A, I led and coordinated the work of the development team for the Medical Desktop product to maintain and improve the technical architecture of the product. I identified and resolved technical problems and worked with other technical leaders and teams in the company to ensure the quality and efficiency of the product development.',
          url: 'https://escritoriomedico.cl',
          fromTo: 'Feb. 2023 - Present'
        },
        {
          title: 'Fullstack Developer - Imed SA',
          description: "As a Fullstack Developer at Imed S.A, I significantly improved the mimed.com product using advanced technologies such as NuxtJS, Vuejs, and Tailwindcss for the presentation layer and the NestJS framework for the business logic layer. I also developed REST API services and ETL processes using the Pentaho tool. Overall, I contributed to the growth and success of the product by bringing my skills to the product's quality.",
          url: 'https://mimed.com',
          fromTo: 'Sept. 2021 - Feb. 2023'
        },
        {
          title: 'Fullstack Developer - Izit SpA',
          description: `The main tasks carried out in the position include the development of services and designing architecture that supports these services, mainly using AWS cloud technologies.
          Backend development in Node.js, Java, PHP, MySQL, and Apache2 servers, software version management with GIT, research of new technologies for server-side application development, and internal support services.`,
          url: 'https://web.archive.org/web/20200919024522/https://www.izitapp.com/',
          fromTo: 'Sept. 2019 - Aug. 2021'
        },
        {
          title: 'Software Engineer - Your Class, Your Country',
          description: `Web and Mobile application developer among others, development in different programming languages FullStack JavaScript, Angular 2, Android, among others. Also, responsible for maintaining users of the Tuclase.cl E-Learning platform.
        
          Management of Cloud architecture for application deployment AWS (EC2 and RDS).`,
          url: 'https://tuclase.cl',
          fromTo: 'Aug. 2017 - Aug. 2019'
        },
        {
          title: 'Developer Analyst - Staken SA',
          description: `Developer Analyst in the IT Projects area, development under the Web scheme, Html, Js, Css3, PHP, as well as Nodejs, Express, and MongoDB.
        
          Experience in Cloud architecture, AWS, and its various services (EC2, RDS, CodeCommit, Cognito, ApiGateway, Lambda, among others).
        
          Development of administrative and management systems for internal clients.
        
          Development of software solutions in the mobile environment (Android).`,
          url: 'https://starken.cl',
          fromTo: 'Dec. 2015 - Jul. 2017'
        }
      ]
    }
  ]

  return {
    aboutMeResume
  }
}

export default useAboutMe
