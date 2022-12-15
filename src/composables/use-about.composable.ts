import { AboutMe } from '@/interfaces/about-me.interface'

const useAboutMe = () => {
  const aboutMeResume: AboutMe[] = [
    {
      title: 'Desarrollador Fullstack',
      description: `Las principales funciones del cargo incluyen la mantención y
      el desarrollo de mejoras para el producto mimed.com, el cuál está construído
      con el stack NuxtJS, Vuejs y Tailwindcss para la capa de presentación. Para la capa
      del modelo de negocio la principal tarea es mantener y desarrollar servicios API REST 
      haciendo uso del framework NestJS.
      Otras de las tareas realizadas en el cargo es desarrollar procesos ETL en la herramienta
      pentaho.`,
      url: 'https://mimed.com',
      fromTo: 'Sept. 2021 - Actualidad'
    },
    {
      title: 'Desarrollador Fullstack',
      description: `Las principales tareas desempeñadas en el cargo se encuentra el desarrollo de servicios y diseñar arquitectura que soporta dichos servicios, principalmente utilizando tecnologías en la nube AWS.
      Desarrollo backend en Node.js, Java, PHP, MySQL, y servidores Apache2, manejo y
      control de versiones de software con GIT, investigación de nuevas tecnologías para el
      desarrollo de aplicaciones del lado del servidor y servicios internos de soporte.`,
      url: 'https://izitapp.com',
      fromTo: 'Sept. 2019 - Ago. 2021'
    },
    {
      title: 'Ingeniero de software',
      description: `Desarrollador de aplicaciones Web, Móvil entre otras, desarrollo en 
      distintos lenguajes de programación FullStack JavaScript, Angular 2, Android, entre 
      otros, asimismo, encargado de mantenimiento de usuarios de la plataforma E-Learning Tuclase.cl 

      Manejo de arquitectura en la Nube para el despliegue de aplicaciones AWS (EC2 y RDS).`,
      url: 'https://tuclase.cl',
      fromTo: 'Ago. 2017 - Ago. 2019'
    },
    {
      title: 'Analista desarrollador',
      description: `Analista Desarrollador en el área de Proyectos de TI, desarrollo bajo esquema Web, Html, Js, Css3, PHP, así como, Nodejs, Express y MongoDB.

      Experiencia en arquitectura en la Nube, AWS y sus distintos servicios (EC2, RDS, CodeCommit, Cognito, ApiGateway, Lambda, entre otros).
      
      Desarrollo de sistemas administrativos y de gestión para clientes internos.
      
      Desarrollo de soluciones de software en ambiente móvil (Android).`,
      url: 'https://customers.mystarken.cl',
      fromTo: 'Dic. 2015 - Jul. 2017'
    }
  ]

  return {
    aboutMeResume
  }
}

export default useAboutMe
