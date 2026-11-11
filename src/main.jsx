// Raíz de composición: aquí (y solo aquí) se conectan los adaptadores con la aplicación.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createExcuseService } from './application/excuseService.js';
import { createBrowserClock } from './infrastructure/browserClock.js';
import { createNavigatorVibrator } from './infrastructure/navigatorVibrator.js';
import { createWebAudioRingtone } from './infrastructure/webAudioRingtone.js';
import { createWebSpeechVoice } from './infrastructure/webSpeechVoice.js';
import App from './ui/App.jsx';

const service = createExcuseService({
  ringtone: createWebAudioRingtone(),
  voice: createWebSpeechVoice(),
  vibrator: createNavigatorVibrator(),
  clock: createBrowserClock(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App service={service} />
  </React.StrictMode>,
);
