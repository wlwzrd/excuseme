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

## 📂 Estructura del Proyecto

```text
ExcuseMe/
├── index.html          # Documento HTML principal
├── package.json        # Configuración de dependencias y scripts de Node.js
├── README.md           # Guía de uso y documentación del proyecto
├── vite.config.js      # Configuración del empaquetador Vite
└── src/
    ├── main.jsx        # Punto de entrada de React
    └── App.jsx         # Componente principal con la lógica de chat, llamada y voz
```

---

## 🎨 Personalización

Puedes modificar o agregar más voces y guiones en el objeto `SCENARIOS` ubicado dentro del archivo `src/App.jsx`.

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. ¡Sientes libre de adaptarlo y usarlo cuando necesites una buena excusa!
