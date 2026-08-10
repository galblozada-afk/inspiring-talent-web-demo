const db = require('../db');

const publishedAt = '2026-08-08T12:00:00.000Z';

const posts = [
  {
    slug: 'cultura-de-coaching',
    title: 'Cultura de coaching: cómo convertir el aprendizaje en una práctica cotidiana',
    excerpt: 'Una cultura de coaching no se construye con una sola capacitación: requiere conversaciones, escucha y responsabilidad compartida.',
    cover_image: '/assets/img/program-coaching.jpg',
    status: 'published',
    published_at: publishedAt,
    content_html: `
      <p>Una cultura de coaching aparece cuando las conversaciones de desarrollo dejan de depender de un momento anual y pasan a formar parte de la manera en que un equipo trabaja. No se trata de que todas las personas sean coaches: se trata de crear mejores condiciones para pensar, aprender y actuar.</p>
      <h2>¿Qué cambia en una organización?</h2>
      <p>En vez de resolver de inmediato por otras personas, los líderes empiezan a hacer preguntas que aclaran el objetivo, abren posibilidades y devuelven responsabilidad. La retroalimentación se vuelve más frecuente y los acuerdos se revisan con mayor honestidad.</p>
      <h2>Cuatro prácticas que hacen la diferencia</h2>
      <ul>
        <li>Definir con claridad el propósito de cada conversación de desarrollo.</li>
        <li>Escuchar antes de ofrecer una solución o una recomendación.</li>
        <li>Convertir los aprendizajes en acuerdos observables y fechas de revisión.</li>
        <li>Reconocer el progreso sin dejar de atender los retos pendientes.</li>
      </ul>
      <h2>El papel de los líderes</h2>
      <p>El liderazgo sigue siendo dirección y decisión; el coaching agrega una forma más consciente de acompañar. Una pregunta bien formulada puede ayudar a una persona a reconocer recursos propios, explorar opciones y comprometerse con un siguiente paso.</p>
      <h2>Un punto de partida realista</h2>
      <p>Comienza por elegir un equipo, un reto concreto y una rutina breve de conversaciones. Observa qué cambia, ajusta y escala con intención. Los marcos de competencias de ICF destacan la ética, la confianza, la escucha y el aprendizaje orientado a la acción como bases del coaching profesional.</p>
      <p><a href="https://coachingfederation.org/credentialing/coaching-competencies/icf-core-competencies/" target="_blank" rel="noopener">Consulta el marco de competencias de ICF</a>.</p>
      <p>Si quieres llevar estas prácticas a tu organización, en Inspiring Talent podemos diseñar un proceso que responda a tu contexto.</p>`
  },
  {
    slug: 'liderazgo-en-tiempos-de-cambio',
    title: 'Liderazgo en tiempos de cambio: competencias que sostienen a los equipos',
    excerpt: 'En momentos de incertidumbre, liderar no es tener todas las respuestas: es generar claridad, confianza y capacidad de adaptación.',
    cover_image: '/assets/img/program-formacion.jpg',
    status: 'published',
    published_at: publishedAt,
    content_html: `
      <p>Los cambios de estrategia, tecnología o estructura exigen más que un comunicado. Las personas necesitan entender qué permanece, qué se modifica y cómo pueden participar en el siguiente paso. Ahí el liderazgo tiene un papel decisivo.</p>
      <h2>Claridad sin falsas certezas</h2>
      <p>Comunicar con claridad no significa prometer lo que todavía no se sabe. Significa compartir el propósito, distinguir los hechos de las hipótesis y sostener un espacio para preguntas. La transparencia reduce rumores y permite que el equipo se concentre en lo que sí puede hacer.</p>
      <h2>Competencias para practicar en el día a día</h2>
      <ul>
        <li>Comunicación directa, respetuosa y consistente.</li>
        <li>Escucha activa para comprender preocupaciones y señales del equipo.</li>
        <li>Priorización: menos iniciativas, con objetivos y responsables claros.</li>
        <li>Retroalimentación frecuente que combine reconocimiento y dirección.</li>
      </ul>
      <h2>El equipo necesita ritmo</h2>
      <p>Durante un cambio, los acuerdos cortos y revisables suelen funcionar mejor que los planes rígidos. Reuniones breves de seguimiento, decisiones visibles y espacios para aprender de los errores ayudan a que la adaptación sea colectiva.</p>
      <h2>Cuida las condiciones de trabajo</h2>
      <p>El desempeño sostenible depende también de entornos donde las personas puedan participar con seguridad y respeto. La Organización Mundial de la Salud recomienda intervenciones que atiendan las condiciones del trabajo y apoyen la salud mental en el ámbito laboral.</p>
      <p><a href="https://www.who.int/publications/i/item/9789240053052" target="_blank" rel="noopener">Revisa las guías de la OMS sobre salud mental en el trabajo</a>.</p>
      <p>Fortalecer estas capacidades no elimina la complejidad, pero le da a los equipos mejores herramientas para atravesarla juntos.</p>`
  },
  {
    slug: 'nom-037-guia-practica-teletrabajo',
    title: 'NOM-037: una guía práctica para organizaciones con teletrabajo',
    excerpt: 'Una lectura inicial de la NOM-037-STPS-2023 para ordenar conversaciones, responsabilidades y condiciones de seguridad y salud en teletrabajo.',
    cover_image: '/assets/img/service-nom037.png',
    status: 'published',
    published_at: publishedAt,
    content_html: `
      <p>El teletrabajo requiere acuerdos claros y una mirada preventiva. La NOM-037-STPS-2023 establece condiciones de seguridad y salud en el trabajo para esta modalidad en México. Este artículo es una orientación general y no sustituye la revisión de la norma ni la asesoría especializada aplicable a cada centro de trabajo.</p>
      <h2>Empieza por entender tu realidad</h2>
      <p>Identifica qué puestos realizan teletrabajo, con qué frecuencia, desde qué lugares y qué recursos necesitan. Esta información ayuda a diferenciar entre una práctica ocasional y una modalidad que requiere un sistema de gestión más estructurado.</p>
      <h2>Una lista de trabajo para organizarse</h2>
      <ul>
        <li>Revisar la política de teletrabajo y comunicarla de manera accesible.</li>
        <li>Definir responsabilidades de empresa y personas trabajadoras.</li>
        <li>Identificar condiciones de seguridad y salud en los lugares de teletrabajo.</li>
        <li>Establecer canales para reportar riesgos, incidentes o necesidades.</li>
        <li>Capacitar a líderes y equipos sobre las prácticas acordadas.</li>
      </ul>
      <h2>Más allá del documento</h2>
      <p>El cumplimiento es más sólido cuando se integra a la operación. Las personas necesitan saber a quién acudir, cómo pedir apoyo y qué hábitos ayudan a prevenir riesgos. Los líderes, por su parte, requieren criterios para gestionar objetivos, carga de trabajo y comunicación sin invadir la vida personal.</p>
      <h2>Convierte el cumplimiento en una conversación útil</h2>
      <p>Un programa de implementación puede reunir revisión documental, capacitación y seguimiento para que las medidas se entiendan y se sostengan. El objetivo es construir condiciones de trabajo más claras y saludables, no únicamente completar una lista.</p>
      <p><a href="https://www.dof.gob.mx/nota_detalle_popup.php?codigo=5687271" target="_blank" rel="noopener">Consulta la publicación oficial de la NOM-037-STPS-2023 en el Diario Oficial de la Federación</a>.</p>
      <p>En Inspiring Talent podemos ayudarte a conversar sobre los retos de teletrabajo de tu organización y definir los siguientes pasos.</p>`
  }
];

function seedPosts(database) {
  let created = 0;
  let skipped = 0;
  for (const post of posts) {
    if (database.slugExists(post.slug)) {
      skipped += 1;
      continue;
    }
    database.insertBlogPost(post);
    created += 1;
  }
  return { created, skipped };
}

if (require.main === module) {
  const result = seedPosts(db);
  console.log(`Artículos creados: ${result.created}. Artículos existentes: ${result.skipped}.`);
}

module.exports = { posts, seedPosts };
