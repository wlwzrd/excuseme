import React from 'react';

// Contenido de las páginas informativas del menú. Texto en lenguaje sencillo.
const UPDATED = '11 de noviembre de 2026';
const REPO_URL = 'https://github.com/wlwzrd/excuseme';

const H = ({ children }) => <h3 className="text-sm font-semibold text-slate-100 mt-5 mb-1.5">{children}</h3>;
const P = ({ children }) => <p className="text-sm text-slate-300 leading-relaxed mb-2">{children}</p>;
const Li = ({ children }) => <li className="text-sm text-slate-300 leading-relaxed">{children}</li>;
const Ul = ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-2">{children}</ul>;
const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer" className="text-emerald-400 underline underline-offset-2">
    {children}
  </a>
);
const Updated = () => <p className="text-xs text-slate-400 mb-3">Última actualización: {UPDATED}</p>;

function About() {
  return (
    <>
      <P>
        ExcuseMe te ayuda a salir de una conversación que no termina: eliges una excusa, tu teléfono simula una
        llamada entrante y una voz te da el motivo perfecto para retirarte.
      </P>
      <H>Cómo funciona</H>
      <Ul>
        <Li>Elige cuánto debe tardar la llamada: ahora, 5, 10 o 30 segundos.</Li>
        <Li>Toca una excusa: Familia, Empresa o Random.</Li>
        <Li>Cuando suene, contesta y escucha el guion. O recházala, si con verla basta.</Li>
      </Ul>
      <H>Qué no es</H>
      <P>
        La llamada es una simulación dentro de esta página. No es una llamada telefónica real, no usa tu línea ni
        tu saldo, y nadie más participa en ella.
      </P>
      <H>El proyecto</H>
      <P>
        ExcuseMe es un proyecto personal de código abierto, pensado para usarse con humor y en situaciones
        inofensivas. El código y la documentación del producto están en <A href={REPO_URL}>GitHub</A>.
      </P>
    </>
  );
}

function Privacy() {
  return (
    <>
      <Updated />
      <P>
        ExcuseMe no pide tu nombre, tu teléfono, tu correo ni tus contactos, y no tiene cuentas de usuario. Esto es
        lo único que se registra y para qué.
      </P>
      <H>Qué medimos</H>
      <P>Medimos el uso de forma anónima para saber si la app sirve y cómo mejorarla:</P>
      <Ul>
        <Li>Que alguien abrió la app y desde qué enlace llegó (por ejemplo, una story o un mensaje).</Li>
        <Li>Qué excusa y qué retardo se eligieron.</Li>
        <Li>Si la llamada se contestó, se colgó o se rechazó, y cuánto duró.</Li>
        <Li>La calificación de 1 a 5, si decides darla.</Li>
        <Li>Si se tocó el botón de compartir.</Li>
      </Ul>
      <H>Con qué herramienta</H>
      <P>
        Usamos Google Analytics, un servicio de Google. Google recibe esos eventos junto con datos técnicos de tu
        navegador (como el tipo de dispositivo y una ubicación aproximada) y los trata según su propia{' '}
        <A href="https://policies.google.com/privacy">política de privacidad</A>.
      </P>
      <H>Cookies y datos guardados en tu navegador</H>
      <Ul>
        <Li>
          <strong className="text-slate-200">Cookies de Google Analytics:</strong> sirven para distinguir a un
          visitante de otro sin saber quién es.
        </Li>
        <Li>
          <strong className="text-slate-200">Un identificador aleatorio de ExcuseMe:</strong> se guarda en tu
          navegador para saber si es tu primera visita y en cuántos días distintos has usado la app. No se envía a
          ningún servidor.
        </Li>
      </Ul>
      <H>Cómo evitar la medición</H>
      <Ul>
        <Li>Borra los datos de este sitio desde los ajustes de tu navegador para eliminar las cookies y el identificador.</Li>
        <Li>
          Usa el modo de navegación privada, un bloqueador de rastreadores o el{' '}
          <A href="https://tools.google.com/dlpage/gaoptout">complemento de inhabilitación de Google Analytics</A>.
        </Li>
      </Ul>
      <P>La app funciona igual si la medición está bloqueada.</P>
      <H>Contacto</H>
      <P>
        Para preguntas o solicitudes sobre esta política, abre un caso en el{' '}
        <A href={`${REPO_URL}/issues`}>repositorio del proyecto</A>.
      </P>
    </>
  );
}

function Terms() {
  return (
    <>
      <Updated />
      <P>Al usar ExcuseMe aceptas estas condiciones. Si no estás de acuerdo, no uses la app.</P>
      <H>Qué ofrece la app</H>
      <P>
        ExcuseMe simula una llamada entrante en la pantalla de tu dispositivo con fines de entretenimiento. No
        realiza llamadas reales ni envía mensajes.
      </P>
      <H>Uso responsable</H>
      <Ul>
        <Li>Úsala con humor y en situaciones inofensivas.</Li>
        <Li>No la uses para engañar a alguien de forma que le cause daño, ni para evadir obligaciones legales, laborales o de seguridad.</Li>
        <Li>No la uses para simular una emergencia real ante autoridades o servicios de emergencia.</Li>
      </Ul>
      <P>Lo que hagas con la app es responsabilidad tuya.</P>
      <H>Sin garantías</H>
      <P>
        La app se ofrece tal como está, sin garantía de que funcione siempre ni en todos los dispositivos. El sonido,
        la voz y la vibración dependen de tu navegador y de tu teléfono, y pueden no estar disponibles.
      </P>
      <H>Marcas</H>
      <P>
        ExcuseMe es un proyecto independiente. No está afiliado, patrocinado ni respaldado por WhatsApp, Meta ni
        ninguna otra empresa de mensajería.
      </P>
      <H>Código abierto</H>
      <P>
        El código se publica bajo licencia MIT en <A href={REPO_URL}>GitHub</A>.
      </P>
      <H>Cambios</H>
      <P>Estas condiciones pueden cambiar. La fecha de arriba indica la versión vigente.</P>
    </>
  );
}

export const PAGES = Object.freeze({
  about: { title: 'Acerca de ExcuseMe', Content: About },
  privacy: { title: 'Privacidad y cookies', Content: Privacy },
  terms: { title: 'Términos y condiciones', Content: Terms },
});
