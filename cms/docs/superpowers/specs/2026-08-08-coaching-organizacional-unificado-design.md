# Coaching Organizacional Unificado

## Objetivo

Reemplazar la sección genérica de Coaching Organizacional por una página propia que reúna Coaching Ejecutivo y de Liderazgo, Coaching Sistémico de Equipos, Cultura de Coaching y Líder Coach. La experiencia debe explicar cómo estas prácticas se conectan para acompañar cambios reales, en lugar de presentarlas como servicios aislados.

## Audiencias

- Empresas y responsables de RH/L&D que patrocinan un proceso de desarrollo.
- Líderes, gerentes y ejecutivos que quieren fortalecer su práctica de liderazgo.
- Equipos que necesitan alinear conversaciones, acuerdos y colaboración.
- Coaches internos y líderes que buscan incorporar competencias de coaching en su día a día.

## Estructura de la página

1. **Hero editorial existente.** Conserva el recurso visual propio de Coaching Organizacional, título a la izquierda y llamado a contacto.
2. **Contexto y retos.** Una sección breve que conecta los retos de cambio con cuatro síntomas: decisiones aisladas, prioridades desalineadas, conversaciones difíciles postergadas y aprendizaje que no llega a la práctica.
3. **Ruta de cambio conectada.** Cuatro estaciones visuales y accesibles: Liderazgo ejecutivo, Equipos sistémicos, Líder coach y Cultura de coaching. Cada una comunica audiencia, foco de trabajo y resultados esperados en términos de práctica, no garantías numéricas.
4. **Cómo se acompaña.** Secuencia: comprender el contexto, acordar el foco, practicar en el trabajo y dar seguimiento. La visual debe señalar que la ruta puede comenzar en cualquiera de los cuatro niveles.
5. **Elige dónde empezar.** Tres accesos para Empresas/RH, Líderes y Equipos/Coaches internos; cada uno lleva al formulario de contacto con un parámetro de servicio relevante.
6. **Cierre.** CTA de contacto consistente con la captura actual en panel administrativo.

## Diseño e interacción

- Crear una plantilla específica para la ruta `/coaching-organizacional`; las demás páginas de servicio conservan su plantilla actual.
- Usar azul marino, verde oficial, blanco y la ilustración ya creada para el hero.
- Incorporar una línea/ruta visual que conecte los cuatro niveles y tarjetas con expansión progresiva en clic o teclado. En móvil se convierte en una pila de tarjetas clara.
- Aplicar animaciones de aparición cuando cada bloque entra al viewport, con `prefers-reduced-motion` respetado. No se aplican movimientos automáticos que dificulten leer.
- La información visible inicial contiene lo esencial; el detalle se revela sin depender exclusivamente de hover para que funcione en táctil y teclado.

## Contenido y límites

- El contenido integra las ideas publicadas previamente por Inspiring Talent: acompañamiento ejecutivo, efectividad de equipos, cultura de coaching y desarrollo de competencias de líder coach.
- Se evita afirmar mejoras porcentuales o resultados garantizados sin evidencia específica por cliente.
- No se cambia la cabecera, footer, formulario de contacto, panel administrativo ni otras páginas.

## Arquitectura y pruebas

- Nueva vista `views/pages/coaching-page.ejs` y estilos/JS aislados para no afectar las plantillas genéricas.
- La ruta pública renderizará esta vista solo para el slug `coaching-organizacional`.
- Se mantendrán los enlaces de CTA a `/contacto`, usando parámetros para preseleccionar el motivo donde aplique.
- Pruebas de integración verificarán la nueva vista, los cuatro niveles, los accesos de audiencia y la carga de recursos propios.
