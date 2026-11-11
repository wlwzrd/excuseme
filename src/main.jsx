// Raíz de composición: aquí (y solo aquí) se conectan los adaptadores con la aplicación.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createExcuseService } from './application/excuseService.js';
import { GA_MEASUREMENT_ID, SHARE_CAMPAIGN } from './config.js';
import { createBrowserClock } from './infrastructure/browserClock.js';
import { channelFromQuery } from './infrastructure/campaign.js';
import { createGoogleAnalytics } from './infrastructure/googleAnalytics.js';
import { createLocalVisitorStore } from './infrastructure/localVisitorStore.js';
import { createNavigatorVibrator } from './infrastructure/navigatorVibrator.js';
import { createWebAudioRingtone } from './infrastructure/webAudioRingtone.js';
import { createWebSharer } from './infrastructure/webSharer.js';
import { createWebSpeechVoice } from './infrastructure/webSpeechVoice.js';
import App from './ui/App.jsx';

const service = createExcuseService({
  ringtone: createWebAudioRingtone(),
  voice: createWebSpeechVoice(),
  vibrator: createNavigatorVibrator(),
  clock: createBrowserClock(),
  analytics: createGoogleAnalytics(GA_MEASUREMENT_ID),
  visitor: createLocalVisitorStore(),
  sharer: createWebSharer({
    url: `${window.location.origin}${window.location.pathname}${SHARE_CAMPAIGN}`,
    title: 'ExcuseMe',
    text: '¿Atrapado en una conversación? Que te llamen con la excusa perfecta.',
  }),
  channel: channelFromQuery(window.location.search),
});
service.start();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App service={service} />
  </React.StrictMode>,
);
