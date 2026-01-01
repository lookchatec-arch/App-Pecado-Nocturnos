
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Banco de Tarjetas Locales (Español Latino) ---
const LOCAL_CARDS = {
  truth_or_shot: [
    "¿Cuál es tu fantasía más sucia que nunca has contado?",
    "¿A quién de los presentes le darías un beso apasionado?",
    "¿Cuál es el lugar más atrevido donde has tenido sexo?",
    "¿Qué es lo más raro que has buscado en una página XXX?",
    "¿Has fingido un orgasmo para terminar rápido?",
    "¿Alguna vez te han pillado 'en pleno acto'?",
    "¿Cuál es tu posición favorita y por qué?",
    "¿Qué es lo que más te prende de la persona que tienes a la izquierda?",
    "¿Has grabado un video íntimo con tu celular?",
    "¿Cuál el mensaje más caliente que has enviado?",
    "¿Has tenido un trío o te gustaría tenerlo?",
    "¿Qué parte del cuerpo te gusta más que te besen?",
    "¿Alguna vez has usado juguetes sexuales con pareja?",
    "¿Cuál ha sido tu peor experiencia en la cama?",
    "¿Has tenido sexo en un lugar público?"
  ],
  never_have_i_ever: [
    "Yo nunca nunca he tenido sexo en un carro.",
    "Yo nunca nunca he mandado un nude por accidente.",
    "Yo nunca nunca he tenido un amigo con derechos.",
    "Yo nunca nunca he ido a un motel.",
    "Yo nunca nunca he usado lencería para alguien.",
    "Yo nunca nunca he tenido un sueño húmedo con alguien de aquí.",
    "Yo nunca nunca he besado a alguien de mi mismo sexo.",
    "Yo nunca nunca he hecho un trío.",
    "Yo nunca nunca he tenido sexo en la primera cita.",
    "Yo nunca nunca me he grabado teniendo relaciones.",
    "Yo nunca nunca he usado Tinder para algo de una noche.",
    "Yo nunca nunca he tenido sexo en el trabajo.",
    "Yo nunca nunca he fingido estar ebrio para decir algo atrevido.",
    "Yo nunca nunca he tenido una aventura de una noche y me arrepentí.",
    "Yo nunca nunca he fantaseado con el/la ex de un amigo."
  ],
  pictorami: [
    "Un 69",
    "Esposas de cuero",
    "Ducha caliente",
    "Un consolador",
    "Cinturón de castidad",
    "Lencería de encaje",
    "Besos en el cuello",
    "Sexo anal",
    "Hacer un Striptease",
    "Cubos de hielo",
    "Lubricante",
    "Un vibrador",
    "Sexo en un ascensor",
    "Una orgía",
    "Sexo oral"
  ]
};

const Icons = {
  Drink: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 22h2"/><path d="M5 2h14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M18 7v11a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V7"/><path d="M12 2v5"/></svg>,
  Flame: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  Draw: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3Z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z"/><path d="m2 2 5 5"/><path d="m8.5 8.5 7 7"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Sun: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
  Moon: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
};

const App = () => {
  const [screen, setScreen] = useState('age_check');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [players, setPlayers] = useState<{id: number, name: string, points: number}[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [mode, setMode] = useState<null | 'truth_or_shot' | 'never_have_i_ever' | 'pictorami'>(null);
  const [currentContent, setCurrentContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [pool, setPool] = useState({...LOCAL_CARDS});
  const [newPlayerName, setNewPlayerName] = useState("");
  const [usedContent, setUsedContent] = useState<string[]>([]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const getAiContent = async (selectedMode: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let prompt = "";
      if (selectedMode === 'truth_or_shot') {
        prompt = "Genera una pregunta de 'Verdad' muy picante, sexual y prohibida para adultos. Sin censura. Español Latino. Máximo 12 palabras.";
      } else if (selectedMode === 'never_have_i_ever') {
        prompt = "Genera un 'Yo nunca nunca' extremadamente sexual y atrevido para adultos. Español Latino. Máximo 12 palabras.";
      } else {
        prompt = "Genera una palabra de un objeto o acción sexual para dibujar. Solo la palabra, máximo 2 palabras.";
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "Eres un animador de despedidas de soltero. Tu lenguaje es atrevido y directo. No uses saludos, ni comillas, solo la frase o palabra.",
          temperature: 0.95,
        }
      });
      return response.text.trim();
    } catch (e) {
      return null;
    }
  };

  const getNextCard = async (selectedMode: 'truth_or_shot' | 'never_have_i_ever' | 'pictorami') => {
    setLoading(true);
    let card = "";

    const findUniqueCard = async () => {
      if (pool[selectedMode].length > 0) {
        const randomIndex = Math.floor(Math.random() * pool[selectedMode].length);
        const selectedCard = pool[selectedMode][randomIndex];
        const newSubPool = pool[selectedMode].filter((_, i) => i !== randomIndex);
        setPool(prev => ({...prev, [selectedMode]: newSubPool}));
        return selectedCard;
      } else {
        let aiCard = await getAiContent(selectedMode);
        let retries = 0;
        while (aiCard && usedContent.includes(aiCard) && retries < 3) {
          aiCard = await getAiContent(selectedMode);
          retries++;
        }
        return aiCard || "¡Error! Castigo: 2 shots.";
      }
    };

    card = await findUniqueCard();
    setUsedContent(prev => [...prev, card]);
    setCurrentContent(card);
    setLoading(false);
  };

  const handleNextTurn = (success: boolean) => {
    if (players.length > 0) {
      const newPlayers = [...players];
      if (success) newPlayers[activePlayerIndex].points += 10;
      setPlayers(newPlayers);
      setActivePlayerIndex((prev) => (prev + 1) % players.length);
    }
    if (mode) getNextCard(mode);
  };

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, {id: Date.now(), name: newPlayerName.trim(), points: 0}]);
      setNewPlayerName("");
    }
  };

  const HomeButton = () => (
    <div className="fixed top-6 left-6 z-[100] flex gap-2">
      <button 
        onClick={() => setScreen('entry')}
        className={`glass p-3 rounded-full transition-all active:scale-90 border border-white/20 shadow-lg ${theme === 'dark' ? 'bg-white/5 text-white/60 hover:text-white' : 'bg-black/5 text-black/60 hover:text-black'}`}
      >
        <Icons.Home />
      </button>
      <button 
        onClick={toggleTheme}
        className={`glass p-3 rounded-full transition-all active:scale-90 border border-white/20 shadow-lg ${theme === 'dark' ? 'bg-white/5 text-white/60 hover:text-white' : 'bg-black/5 text-black/60 hover:text-black'}`}
      >
        {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 selection:bg-[#ff0055] selection:text-white font-sans ${theme === 'dark' ? 'bg-[#0a0a0c] text-white club-gradient' : 'bg-[#f8f9fa] text-[#1a1a1a] light-theme'}`}>
      
      {screen === 'underage' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-in fade-in duration-1000">
          <div className={`mb-8 p-6 rounded-full animate-pulse border-4 ${theme === 'dark' ? 'bg-red-500/10 border-red-500' : 'bg-red-500/20 border-red-600'}`}>
            <Icons.Lock />
          </div>
          <h1 className={`font-bebas text-7xl mb-4 tracking-wider ${theme === 'dark' ? 'text-red-500' : 'text-red-700'}`}>PROHIBIDO</h1>
          <p className={`text-2xl max-w-sm leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Te esperamos cuando seas mayor de edad para liberar tus instintos. Vuelve pronto.
          </p>
          <div className={`mt-12 w-32 h-1 rounded-full blur-sm ${theme === 'dark' ? 'bg-red-500/50' : 'bg-red-700/50'}`}></div>
        </div>
      )}

      {screen === 'age_check' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className={`glass p-12 rounded-[50px] max-w-md w-full border-t-8 border-[#ff0055] shadow-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
            <h1 className={`font-bebas text-9xl mb-6 drop-shadow-[0_0_15px_rgba(255,0,85,0.5)] ${theme === 'dark' ? 'text-white' : 'text-black'}`}>18+</h1>
            <p className={`text-xl mb-12 font-semibold ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Este juego contiene contenido sexual explícito y lenguaje para adultos.</p>
            <div className="flex flex-col gap-5">
              <button onClick={() => setScreen('entry')} className="btn-primary py-6 rounded-3xl font-black text-2xl uppercase tracking-widest shadow-xl text-white">Soy Mayor</button>
              <button onClick={() => setScreen('underage')} className={`py-4 transition-colors uppercase text-sm font-bold tracking-widest ${theme === 'dark' ? 'text-zinc-500 hover:text-red-500' : 'text-zinc-400 hover:text-red-600'}`}>Soy Menor</button>
            </div>
          </div>
        </div>
      )}

      {screen === 'entry' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-5 relative">
          <button 
            onClick={toggleTheme}
            className={`absolute top-6 right-6 p-3 rounded-full glass border border-white/20 shadow-lg ${theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'}`}
          >
            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
          </button>

          <h1 className="font-bebas text-8xl mb-4 italic tracking-tighter text-center">PECADOS <span className="text-[#ff0055]">HOT</span></h1>
          <p className="text-[#ff0055] font-black uppercase tracking-[0.4em] mb-12 text-xs">Cero Censura</p>
          
          <div className={`w-full glass p-6 rounded-[35px] mb-10 border border-white/10 ${theme === 'dark' ? '' : 'bg-black/[0.02]'}`}>
            <h2 className={`text-sm font-black mb-4 flex items-center gap-2 uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}><Icons.Users /> Pecadores:</h2>
            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={newPlayerName} 
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Nombre..."
                className={`border rounded-2xl px-5 py-3 flex-grow focus:outline-none focus:border-[#ff0055] transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              />
              <button onClick={addPlayer} className="btn-primary px-6 rounded-2xl font-bold text-xl text-white">+</button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {players.map(p => (
                <span key={p.id} className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-3 border ${theme === 'dark' ? 'bg-white/10 border-white/5 text-white' : 'bg-black/5 border-black/10 text-black'}`}>
                  {p.name}
                  <button onClick={() => setPlayers(players.filter(pl => pl.id !== p.id))} className="text-red-500 opacity-50 hover:opacity-100 transition-opacity">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full">
            <button 
              disabled={players.length < 2}
              onClick={() => { setMode('truth_or_shot'); getNextCard('truth_or_shot'); setScreen('game'); }}
              className={`glass p-6 rounded-[30px] border border-white/10 hover:border-[#ff0055] transition-all text-left flex items-center justify-between disabled:opacity-30 disabled:cursor-not-allowed group ${theme === 'dark' ? '' : 'hover:bg-black/[0.02]'}`}
            >
              <div>
                <h3 className={`text-2xl font-black mb-1 group-hover:text-[#ff0055] ${theme === 'dark' ? 'text-white' : 'text-black'}`}>VERDAD O SHOT</h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Confiesa o fondo</p>
              </div>
              <div className="text-[#ff0055]"><Icons.Flame /></div>
            </button>

            <button 
              disabled={players.length < 2}
              onClick={() => { setMode('never_have_i_ever'); getNextCard('never_have_i_ever'); setScreen('game'); }}
              className={`glass p-6 rounded-[30px] border border-white/10 hover:border-[#bc13fe] transition-all text-left flex items-center justify-between disabled:opacity-30 disabled:cursor-not-allowed group ${theme === 'dark' ? '' : 'hover:bg-black/[0.02]'}`}
            >
              <div>
                <h3 className={`text-2xl font-black mb-1 group-hover:text-[#bc13fe] ${theme === 'dark' ? 'text-white' : 'text-black'}`}>YO NUNCA NUNCA</h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Si lo has hecho, bebes</p>
              </div>
              <div className="text-[#bc13fe]"><Icons.Drink /></div>
            </button>

            <button 
              disabled={players.length < 2}
              onClick={() => { setMode('pictorami'); getNextCard('pictorami'); setScreen('game'); }}
              className={`glass p-6 rounded-[30px] border border-white/10 hover:border-cyan-400 transition-all text-left flex items-center justify-between disabled:opacity-30 disabled:cursor-not-allowed group ${theme === 'dark' ? '' : 'hover:bg-black/[0.02]'}`}
            >
              <div>
                <h3 className={`text-2xl font-black mb-1 group-hover:text-cyan-400 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>PICTORAMI HOT</h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Dibuja y adivinen</p>
              </div>
              <div className="text-cyan-400"><Icons.Draw /></div>
            </button>
          </div>
        </div>
      )}

      {screen === 'game' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-in fade-in">
          <HomeButton />
          
          <div className={`fixed top-8 right-8 text-right p-4 rounded-3xl border border-white/10 backdrop-blur-xl z-50 glass ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
            <p className="text-[10px] uppercase tracking-widest text-[#ff0055] font-black">Turno de:</p>
            <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{players[activePlayerIndex]?.name}</p>
            <p className="text-xs text-zinc-500 font-bold">{players[activePlayerIndex]?.points} PTS</p>
          </div>

          <div className="w-full max-w-2xl mt-12">
            {loading ? (
              <div className="flex flex-col items-center gap-6 py-24">
                <div className={`w-20 h-20 border-8 rounded-full animate-spin ${theme === 'dark' ? 'border-white/5 border-t-[#ff0055]' : 'border-black/5 border-t-[#ff0055]'}`}></div>
                <p className="font-bebas text-3xl animate-pulse text-[#ff0055]">SOLTANDO LA BOMBA...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-8 items-center">
                
                {mode === 'pictorami' ? (
                  <div className="w-full flex flex-col gap-6 items-center animate-in zoom-in duration-500">
                    <div className={`glass p-12 md:p-20 rounded-[60px] w-full text-center relative overflow-hidden border-b-8 border-cyan-400 shadow-2xl min-h-[350px] flex flex-col justify-center ${theme === 'dark' ? '' : 'bg-black/[0.02]'}`}>
                      <p className="text-xs uppercase tracking-[0.5em] mb-10 text-cyan-500 font-black italic">DIBUJA ESTO:</p>
                      <h2 className={`text-5xl md:text-7xl font-black leading-tight drop-shadow-2xl uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                        {currentContent}
                      </h2>
                    </div>
                    <div className={`p-6 rounded-3xl text-center max-w-md ${theme === 'dark' ? 'bg-white/5 text-zinc-500' : 'bg-black/5 text-zinc-600'}`}>
                      <p className="text-sm font-bold uppercase tracking-widest italic">Toma un papel o usa tu imaginación. ¡Dibuja esto y que los demás adivinen!</p>
                    </div>
                  </div>
                ) : (
                  <div className={`glass p-12 md:p-20 rounded-[60px] w-full text-center relative overflow-hidden border-t-8 border-[#ff0055] min-h-[350px] flex flex-col justify-center shadow-2xl shadow-red-500/10 ${theme === 'dark' ? '' : 'bg-black/[0.02]'}`}>
                     <p className="text-xs uppercase tracking-[0.5em] mb-10 text-[#ff0055] font-black italic">
                      {mode === 'truth_or_shot' ? 'Dilo o Shot' : 'Yo Nunca Nunca'}
                     </p>
                     <h2 className={`text-4xl md:text-6xl font-black leading-tight drop-shadow-2xl ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      "{currentContent}"
                     </h2>
                  </div>
                )}

                <div className="flex gap-4 w-full max-w-md mt-6">
                  <button 
                    onClick={() => handleNextTurn(false)}
                    className={`flex-1 py-6 rounded-[30px] border font-black uppercase tracking-widest active:scale-95 transition-all text-red-500 ${theme === 'dark' ? 'bg-zinc-900 border-white/10 hover:bg-zinc-800' : 'bg-white border-black/10 hover:bg-zinc-100'}`}
                  >
                    SHOT 🥃
                  </button>
                  <button 
                    onClick={() => handleNextTurn(true)}
                    className="flex-1 py-6 rounded-[30px] btn-primary font-black uppercase tracking-widest active:scale-95 shadow-xl shadow-red-500/20 text-white"
                  >
                    HOT 🔥
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
