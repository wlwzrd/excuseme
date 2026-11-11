import React, { useCallback, useState } from 'react';
import { isActive } from '../domain/call.js';
import CallScreen from './components/CallScreen.jsx';
import DelaySelector from './components/DelaySelector.jsx';
import Header from './components/Header.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import InputBar from './components/InputBar.jsx';
import MessageList from './components/MessageList.jsx';
import { PAGES } from './pages/pages.jsx';
import { useExcuseService } from './useExcuseService.js';

export default function App({ service }) {
  const { delay, call, messages, isSpeaking } = useExcuseService(service);
  const [pageId, setPageId] = useState(null);
  const closePage = useCallback(() => setPageId(null), []);
  const page = pageId ? PAGES[pageId] : null;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-950 font-sans shadow-2xl relative border-x border-slate-800">
      <Header onShare={service.share} onOpenPage={setPageId} />
      <DelaySelector delay={delay} onChange={service.setDelay} />
      <MessageList
        messages={messages}
        call={call}
        onSelectScenario={service.selectScenario}
        onRate={service.rate}
      />
      <InputBar />
      {page && (
        <InfoPanel title={page.title} onClose={closePage}>
          <page.Content />
        </InfoPanel>
      )}
      {isActive(call) && (
        <CallScreen
          call={call}
          isSpeaking={isSpeaking}
          onAnswer={service.answer}
          onReject={service.reject}
          onHangUp={service.hangUp}
          onToggleMute={service.toggleMute}
        />
      )}
    </div>
  );
}
