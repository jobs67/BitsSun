
import React, { useState } from 'react';
import { View, Message, Language } from './types';
import LandingScreen from './components/LandingScreen';
import ChatScreen from './components/ChatScreen';
import UtilityScreen from './components/UtilityScreen';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [messages, setMessages] = useState<Message[]>([]);
  const [touristLanguage, setTouristLanguage] = useState<Language>(Language.EN_US);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const renderView = () => {
    switch (currentView) {
      case View.LANDING:
        return <LandingScreen onStart={() => setCurrentView(View.CHAT)} />;
      case View.CHAT:
        return (
          <ChatScreen
            messages={messages}
            onAddMessage={addMessage}
            onClear={clearMessages}
            onOpenUtility={() => setCurrentView(View.UTILITY)}
            onBack={() => setCurrentView(View.LANDING)}
            touristLanguage={touristLanguage}
            onTouristLanguageChange={setTouristLanguage}
          />
        );
      case View.UTILITY:
        return (
          <UtilityScreen
            onBack={() => setCurrentView(View.CHAT)}
            onAddMessage={addMessage}
            touristLanguage={touristLanguage}
          />
        );
      default:
        return <LandingScreen onStart={() => setCurrentView(View.CHAT)} />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-body">
      <div className="relative w-full max-w-[480px] h-[100dvh] bg-white shadow-2xl overflow-hidden flex flex-col border-x border-slate-200">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
