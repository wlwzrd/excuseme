# ExcuseMe - Generador de Llamadas de Emergencia (Estilo WhatsApp)

**ExcuseMe** es una aplicación web interactiva diseñada para ayudarte a salir disimuladamente de situaciones incómodas, reuniones aburridas o conversatorios de los que deseas retirarte. Simula una conversación de WhatsApp que finaliza con una llamada entrante realista con voz sintetizada por Inteligencia Artificial (Web Speech API).

---

## 🚀 Características Principales

- 📱 **Interfaz Fiel a WhatsApp (Dark Mode):** Diseño estilizado con el encabezado clásico de WhatsApp, indicador de "escribiendo...", tarjetas interactivas de respuesta rápida y burbujas de mensaje de audio.
- ⏱️ **Temporizador de Retardo Configurable:** Elige cuándo deseas recibir la llamada (`0s` inmediato, `5s`, `10s` o `30s`) para presionar enviar, dejar el teléfono sobre la mesa y esperar la excusa perfecta en frente de todos.
- 🎭 **3 Escenarios de Excusa Incluidos:**
  1. **Familia:** Emergencia doméstica o necesidad urgente en casa.
  2. **Empresa:** Emergencia laboral crítica con un servidor o cliente clave.
  3. **Random:** Situación impredecible y curiosa para romper la tensión.
- 📞 **Pantalla de Llamada Entrante Interactiva:**
  - Estilo de llamada de teléfono inteligente con botones para contestar o rechazar.
  - Efectos de sonido y tonos de llamada sintetizados en tiempo real mediante la **Web Audio API**.
  - Vibración integrada (en dispositivos móviles compatibles) mediante la **Vibration API**.
- 🎙️ **Simulación de Voz en Vivo:** Al contestar, una voz interactiva (Web Speech API) lee el guion exacto de la excusa en español, acompañada de un ecualizador de ondas de voz animado.
- 📑 **Registro de Llamada:** Al finalizar o rechazar la llamada, se envía una confirmación al chat con el estado y la duración de la misma.

---

## 🛠️ Requisitos Técnicos

Para ejecutar este proyecto localmente se requiere:
- **Node.js** (versión 16.x o superior)
- **npm**, **yarn** o **pnpm**
- Navegador moderno con soporte para **Web Speech API** y **Web Audio API** (Google Chrome, Microsoft Edge, Safari o Brave).

---

## 📦 Instalación y Configuración

1. **Extraer el proyecto:**
   Extrae el archivo ZIP en una carpeta de tu preferencia.

2. **Instalar dependencias:**
   Abre una terminal en la carpeta raíz del proyecto y ejecuta:
   ```bash
   npm install
   ```

3. **Ejecutar en modo de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre el enlace local generado por Vite (usualmente `http://localhost:5173`) en tu navegador.

4. **Construir para Producción:**
   ```bash
   npm run build
   ```
   Los archivos listos para despliegue se generarán dentro de la carpeta `dist/`.

---

## 📂 Arquitectura (hexagonal)

El código está organizado en puertos y adaptadores. Las dependencias apuntan siempre hacia adentro: la interfaz y la infraestructura conocen a la aplicación y al dominio, nunca al revés.

```text
src/
├── domain/                 # Reglas puras: sin React ni APIs del navegador
│   ├── scenarios.js            # Catálogo de excusas
│   ├── call.js                 # Máquina de estados de la llamada
│   └── chat.js                 # Contenido de los mensajes del chat
├── application/            # Casos de uso y puertos
│   ├── excuseService.js        # Programar, contestar, rechazar, colgar, silenciar
│   └── ports.js                # Contratos: RingtonePlayer, VoiceSpeaker, Vibrator, Clock
├── infrastructure/         # Adaptadores que implementan los puertos
│   ├── webAudioRingtone.js     # Web Audio API
│   ├── webSpeechVoice.js       # Web Speech API
│   ├── navigatorVibrator.js    # Vibration API
│   └── browserClock.js         # Reloj y temporizadores
├── ui/                     # React: solo pinta el estado y dispara casos de uso
│   ├── App.jsx
│   ├── useExcuseService.js
│   ├── scenarioStyles.js
│   └── components/
└── main.jsx                # Raíz de composición: conecta adaptadores y aplicación
test/                       # Pruebas del dominio y de los casos de uso (sin navegador)
```

### Pruebas

```bash
npm test
```

Usan el ejecutor de pruebas integrado de Node (sin dependencias extra) y adaptadores falsos en lugar del navegador.

### Cómo extenderlo

- **Nuevas excusas:** agrégalas en `src/domain/scenarios.js` y, si quieres icono y color propios, en `src/ui/scenarioStyles.js`.
- **Otro tono o voz** (un MP3, una voz de IA): escribe un adaptador nuevo en `src/infrastructure/` que cumpla el puerto y cámbialo en `src/main.jsx`.
- **WhatsApp con Twilio (planeado):** las credenciales de Twilio no pueden vivir en el navegador, así que irá en un backend pequeño. `domain/` y `application/` son JavaScript puro y se reutilizan tal cual en Node; Twilio entra como un adaptador más.

---

## 🧭 Documentación de producto

El proyecto simula el ciclo completo de un producto: ideación, análisis, desarrollo, despliegue y valor. Los PRDs de cada fase y las decisiones están en [`docs/`](docs/README.md).

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. ¡Sientes libre de adaptarlo y usarlo cuando necesites una buena excusa!
