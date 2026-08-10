const internalPages = {
  'coaching-organizacional': {
    slug: 'coaching-organizacional',
    navLabel: 'Coaching',
    eyebrow: 'Desarrollo organizacional',
    title: 'Coaching para liderar el cambio',
    intro: 'Acompañamos a líderes, equipos y organizaciones a convertir los retos de cambio en conversaciones, decisiones y acciones más efectivas.',
    focus: 'El coaching abre un espacio de reflexión y práctica para que las personas encuentren nuevas formas de relacionarse, colaborar y lograr resultados sostenibles.',
    image: '/assets/img/program-coaching.jpg',
    sections: [
      { title: 'Coaching ejecutivo y de liderazgo', text: 'Para líderes que necesitan ampliar su perspectiva, fortalecer sus conversaciones y tomar decisiones con mayor claridad.', items: ['Definición de objetivos de desarrollo', 'Conversaciones de liderazgo con intención', 'Acompañamiento individual y confidencial'] },
      { title: 'Coaching sistémico de equipos', text: 'Procesos para alinear al equipo alrededor de un propósito compartido y construir acuerdos que se sostengan en el día a día.', items: ['Confianza y colaboración', 'Coordinación de acciones', 'Conversaciones para resolver tensiones'] },
      { title: 'Cultura de coaching', text: 'Una cultura se transforma cuando el desarrollo deja de ser un evento aislado y se convierte en una práctica cotidiana.', items: ['Líderes que preguntan y escuchan mejor', 'Retroalimentación orientada al aprendizaje', 'Responsabilidad compartida por el crecimiento'] }
    ],
    ctaTitle: 'Conversemos sobre el reto que hoy enfrenta tu organización',
    ctaText: 'Diseñamos un acompañamiento de acuerdo con las personas, el momento y los objetivos de tu empresa.'
  },
  formacion: {
    slug: 'formacion',
    navLabel: 'Formación',
    eyebrow: 'Aprendizaje aplicado',
    title: 'Competencias que se convierten en acción',
    intro: 'Diseñamos experiencias de formación para que las personas desarrollen habilidades relevantes y las lleven a las conversaciones y decisiones de su trabajo.',
    focus: 'Combinamos contenido, práctica y acompañamiento para que el aprendizaje responda al contexto real de cada organización.',
    image: '/assets/img/program-formacion.jpg',
    sections: [
      { title: 'Bootcamps de habilidades humanas', text: 'Sesiones dinámicas para desarrollar capacidades indispensables en entornos de cambio.', items: ['Comunicación asertiva', 'Liderazgo e inteligencia emocional', 'Negociación y manejo de conflicto', 'Gestión del tiempo y resiliencia'] },
      { title: 'Programas de liderazgo', text: 'Trayectorias de aprendizaje para líderes que necesitan acompañar el desempeño y hacer crecer a sus equipos.', items: ['Líder coach', 'Mentoría y acompañamiento', 'Toma de decisiones', 'Colaboración y trabajo en equipo'] },
      { title: 'Formación para coaches', text: 'Espacios de actualización y práctica para quienes buscan enriquecer su ejercicio profesional.', items: ['Mentoría', 'Supervisión', 'Práctica reflexiva', 'Desarrollo continuo'] }
    ],
    ctaTitle: 'Construyamos una experiencia de aprendizaje útil',
    ctaText: 'Cuéntanos qué habilidades requiere tu equipo y diseñemos un programa a la medida.'
  },
  'evaluacion-de-talento': {
    slug: 'evaluacion-de-talento',
    navLabel: 'Evaluación',
    eyebrow: 'Decisiones con información',
    title: 'Evalúa el talento con una mirada integral',
    intro: 'Transformamos información sobre comportamientos, motivadores y competencias en conversaciones de desarrollo y mejores decisiones para las personas y los equipos.',
    focus: 'La evaluación no es una etiqueta: es un punto de partida para reconocer fortalezas, identificar oportunidades y enfocar el desarrollo.',
    image: '/assets/img/program-evaluacion.jpg',
    sections: [
      { title: 'Comportamientos y comunicación', text: 'Herramientas que ayudan a comprender preferencias de comunicación y estilos de comportamiento en contextos de trabajo.', items: ['DISC individual', 'TEAM DISC', 'Conversaciones sobre estilos de colaboración'] },
      { title: 'Inteligencia emocional y factores impulsores', text: 'Información para abrir conversaciones sobre autoconocimiento, motivación y respuesta ante los retos.', items: ['Inteligencia emocional', 'Fuerzas impulsoras', 'Diagnóstico de estrés no clínico'] },
      { title: 'Alineación y retroalimentación', text: 'Procesos que conectan la información con objetivos de desempeño y desarrollo.', items: ['Talent Alignment', 'Evaluación 360°', 'Planes de desarrollo individuales y de equipo'] },
      { title: 'Selección y movilidad interna', text: 'Información que acompaña decisiones de incorporación, promoción y sucesión sin sustituir el criterio humano.', items: ['Definición de perfil', 'Entrevistas por competencias', 'Comparación con necesidades del rol'] },
      { title: 'De reporte a acción', text: 'El valor aparece cuando los resultados se traducen en una conversación y un compromiso de desarrollo.', items: ['Sesión de devolución', 'Prioridades de desarrollo', 'Seguimiento con líder y equipo'] }
    ],
    ctaTitle: 'Convirtamos datos en desarrollo',
    ctaText: 'Te ayudamos a elegir y facilitar el proceso de evaluación adecuado para tu objetivo.'
  },
  'soluciones-para-empresas': {
    slug: 'soluciones-para-empresas',
    navLabel: 'Empresas',
    eyebrow: 'Soluciones conectadas',
    title: 'El talento se mueve en conjunto',
    intro: 'Integramos formación, coaching organizacional y evaluación de talento para acompañar los retos que hoy necesitan moverse en tu empresa.',
    focus: 'Partimos de una conversación para entender el contexto, acordar un foco y convertir el desarrollo en prácticas que se puedan sostener.',
    image: '/assets/img/solutions-enterprise-hero.png',
    journey: [
      { phase: '01', title: 'Atracción', text: 'Claridad del perfil y las capacidades que el negocio necesita.' },
      { phase: '02', title: 'Incorporación', text: 'Onboarding que acelera acuerdos, contexto y colaboración.' },
      { phase: '03', title: 'Desarrollo', text: 'Formación, coaching y evaluación orientados a retos reales.' },
      { phase: '04', title: 'Liderazgo', text: 'Preparación de talento clave, sucesión y movilidad interna.' },
      { phase: '05', title: 'Cambio', text: 'Equipos que sostienen conversaciones y aprendizaje en transición.' }
    ],
    sections: [
      { title: 'Desarrollo de liderazgo', text: 'Para organizaciones que necesitan líderes capaces de dar dirección, sostener conversaciones y movilizar a sus equipos.', items: ['Talleres y bootcamps', 'Programas de líder coach', 'Coaching ejecutivo'] },
      { title: 'Equipos y cultura', text: 'Para fortalecer la colaboración, la coordinación y las prácticas que hacen posible el trabajo colectivo.', items: ['Coaching de equipos', 'Cultura de coaching', 'Habilidades de comunicación y negociación'] },
      { title: 'Talento y cumplimiento', text: 'Para tomar decisiones de desarrollo con información y atender los retos del teletrabajo.', items: ['Evaluación de talento', 'Planes de desarrollo', 'Programa de acompañamiento NOM-037'] }
    ],
    ctaTitle: 'Hagamos espacio para el cambio que tu organización necesita',
    ctaText: 'Agenda una conversación inicial para identificar qué combinación de soluciones puede servir a tu empresa.'
  },
  nosotros: {
    slug: 'nosotros',
    navLabel: 'Nosotros',
    eyebrow: 'Inspiring Talent',
    title: 'Hacer que las cosas sucedan hace la diferencia',
    intro: 'Somos un equipo de profesionales que acompaña a personas y empresas en el desarrollo de su talento, con experiencia en comportamiento humano, aprendizaje y transformación organizacional.',
    focus: 'Nuestro compromiso es promover una mayor conciencia en las habilidades personales y profesionales para impulsar eficiencia, productividad y progreso compartido.',
    image: '/assets/img/service-nosotros.png',
    sections: [
      { title: 'Nuestra forma de acompañar', text: 'Escuchamos el contexto, retamos con respeto y diseñamos experiencias que se conectan con lo que las personas necesitan hacer.', items: ['Diagnóstico y conversación inicial', 'Diseño contextualizado', 'Práctica y reflexión', 'Seguimiento orientado a la acción'] },
      { title: 'Nuestros valores', text: 'Tres principios orientan el trabajo que hacemos con cada cliente y equipo.', items: ['Aprendizaje', 'Creatividad', 'Compromiso'] },
      { title: 'Para personas y organizaciones', text: 'Creamos espacios para desarrollar capacidades que ayudan a liderar, colaborar y enfrentar los retos del trabajo contemporáneo.', items: ['Liderazgo', 'Coaching', 'Formación', 'Evaluación de talento'] }
    ],
    ctaTitle: 'Conozcamos el desafío que quieres transformar',
    ctaText: 'Estamos listos para conversar sobre las personas, equipos y objetivos que quieres impulsar.'
  }
};

function getInternalPage(slug) {
  return internalPages[slug] || null;
}

module.exports = { internalPages, getInternalPage };
