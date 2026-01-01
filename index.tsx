
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
    "Cinturón",
    "Lencería de encaje",
    "Besos en el cuello",
    "Sexo anal",
    "Striptease",
    "Cubos de hielo",
    "Lubricante",
    "Vibrador",
    "Ascensor",
    "Oría",
    "Sexo oral"
  ]
};

const Icons = {
  Drink: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 22h2"/><path d="M5 2h14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M18 7v11a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V7"/><path d="M12 2v5"/></svg>,
  Flame: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  Draw: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3Z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z"/><path d="m2 2 5 5"/><path d="m8.5 8.5 7 7"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Refresh: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>,
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ff0055" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};

const App = () => {
  const [screen, setScreen] = useState('age_check');
  const [players, setPlayers] = useState<{id: number, name: string, points: number}[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [mode, setMode] = useState<null | 'truth_or_shot' | 'never_have_i_ever' | 'pictorami'>(null);
  const [currentContent, setCurrentContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [pool, setPool] = useState({...LOCAL_CARDS});
  const [newPlayerName, setNewPlayerName] = useState("");
  const [usedContent, setUsedContent] = useState<string[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const getAiContent = async (selectedMode: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let prompt = "";
      if (selectedMode === 'truth_or_shot') {
        prompt = "Genera una pregunta de 'Verdad' muy picante, sexual y prohibida para adultos. Sin censura. Español Latino. Máximo 12 palabras.";
      } else if (selectedMode === 'never_have_i_ever') {
        prompt = "Genera un 'Yo nunca nunca' extremadamente sexual y atrevido para adultos. Español Latino. Máximo 12 palabras.";
      } else {
        prompt = "Genera UNA SOLA PALABRA o frase cortísima (máximo 2 palabras) de un objeto, acción o fetiche sexual para un juego de dibujo. Solo la palabra.";
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "Eres un DJ animador de fiestas para adultos. Tu lenguaje es crudo, directo y sexy. No saludes, no uses comillas, solo entrega el reto/pregunta/palabra.",
          temperature: 0.95,
        }
      });
      return response.text.trim();
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const getNextCard = async (selectedMode: 'truth_or_shot' | 'never_have_i_ever' | 'pictorami') => {
    setLoading(true);
    let card = "";

    // Lógica para evitar repeticiones
    const findUniqueCard = async () => {
      if (pool[selectedMode].length > 0) {
        const randomIndex = Math.floor(Math.random() * pool[selectedMode].length);
        const selectedCard = pool[selectedMode][randomIndex];
        // Quitar del pool local
        const newSubPool = pool[selectedMode].filter((_, i) => i !== randomIndex);
        setPool(prev => ({...prev, [selectedMode]: newSubPool}));
        return selectedCard;
      } else {
        // Si el pool local se agota, usamos IA asegurando que no se repita en el historial de esta sesión
        let aiCard = await getAiContent(selectedMode);
        let retries = 0;
        while (aiCard && usedContent.includes(aiCard) && retries < 3) {
          aiCard = await getAiContent(selectedMode);
          retries++;
        }
        return aiCard || "¡Error de conexión! Castigo: 2 shots.";
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
      if (success) {
        newPlayers[activePlayerIndex].points += 10;
      }
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

  // --- Funciones de Dibujo ---
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#bc13fe';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => { isDrawing.current = false; };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const HomeButton = () => (
    <button 
      onClick={() => setScreen('entry')}
      className="fixed top-6 left-6 z-[100] glass p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/20 active:scale-90 shadow-lg"
    >
      <Icons.Home />
    </button>
  );

  // --- Pantallas ---

  if (screen === 'underage') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-in fade-in zoom-in duration-700 bg-[#050505]">
        <div className="mb-8 p-6 rounded-full bg-red-500/10 border-4 border-red-500 animate-pulse">
          <Icons.Lock />
        </div>
        <h1 className="font-bebas text-6xl mb-4 text-red-500 tracking-wider">PACIENCIA, PECADOR...</h1>
        <p className="text-zinc-400 text-xl max-w-xs leading-relaxed">
          Este territorio es solo para adultos. Te esperamos cuando cumplas la mayoría de edad para liberar tus instintos.
        </p>
        <div className="mt-12 w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
      </div>
    );
  }

  if (screen === 'age_check') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-in fade-in duration-500">
        <div className="glass p-10 rounded-[40px] max-w-md w-full border-t-4 border-[#ff0055] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl -z-10"></div>
          <h1 className="font-bebas text-8xl mb-6 neon-text-red">18+</h1>
          <p className="text-xl mb-10 font-medium text-zinc-300">Este juego contiene contenido sexual explícito y retos prohibidos.</p>
          <div className="flex flex-col gap-4">
            <button onClick={() => setScreen('entry')} className="btn-primary py-5 rounded-2xl font-black text-xl uppercase tracking-widest shadow-lg shadow-red-500/20">Soy Mayor</button>
            {/* Fix: Added missing logic to set screen to 'underage' when clicking the second button */}
            <button onClick={() => setScreen('underage')} className="py-3 text-zinc-500 hover:text-zinc-300 transition-colors">Soy Menor de Edad</button>
          </div>
        </div>
      </div>
    );
  }

  // --- Entry Screen Fix: Added the missing entry screen logic ---
  if (screen === 'entry') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
        <h1 className="font-bebas text-6xl mb-8 text-white tracking-tighter">PREVIOS <span className="text-[#ff0055]">HOT</span></h1>
        
        <div className="w-full glass p-6 rounded-3xl mb-8 border-l-4 border-[#ff0055]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Icons.Users /> PECADORES:</h2>
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={newPlayerName} 
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Nombre del pecador..."
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex-grow focus:outline-none focus:border-[#ff0055] transition-all"
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
            />
            <button onClick={addPlayer} className="btn-primary px-6 rounded-xl">+</button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {players.map(p => (
              <span key={p.id} className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-white/5 animate-in zoom-in">
                {p.name}
                <button onClick={() => setPlayers(players.filter(pl => pl.id !== p.id))} className="text-white/40 hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 w-full">
          <button 
            disabled={players.length < 2}
            onClick={() => { setMode('truth_or_shot'); getNextCard('truth_or_shot'); setScreen('game'); }}
            className="group glass p-6 rounded-3xl border border-white/10 hover:border-[#ff0055] transition-all text-left flex items-center justify-between disabled:opacity-50"
          >
            <div>
              <h3 className="text-2xl font-black mb-1 group-hover:text-[#ff0055] transition-colors">VERDAD O SHOT</h3>
              <p className="text-white/40 text-sm">Preguntas que te harán sonrojar.</p>
            </div>
            <div className="text-[#ff0055]"><Icons.Flame /></div>
          </button>

          <button 
            disabled={players.length < 2}
            onClick={() => { setMode('never_have_i_ever'); getNextCard('never_have_i_ever'); setScreen('game'); }}
            className="group glass p-6 rounded-3xl border border-white/10 hover:border-[#bc13fe] transition-all text-left flex items-center justify-between disabled:opacity-50"
          >
            <div>
              <h3 className="text-2xl font-black mb-1 group-hover:text-[#bc13fe] transition-colors">YO NUNCA NUNCA</h3>
              <p className="text-white/40 text-sm">Confiesa tus pecados más oscuros.</p>
            </div>
            <div className="text-[#bc13fe]"><Icons.Drink /></div>
          </button>

          <button 
            disabled={players.length < 2}
            onClick={() => { setMode('pictorami'); getNextCard('pictorami'); setScreen('game'); }}
            className="group glass p-6 rounded-3xl border border-white/10 hover:border-cyan-400 transition-all text-left flex items-center justify-between disabled:opacity-50"
          >
            <div>
              <h3 className="text-2xl font-black mb-1 group-hover:text-cyan-400 transition-colors">PICTORAMI</h3>
              <p className="text-white/40 text-sm">Dibuja el fetiche y que adivinen.</p>
            </div>
            <div className="text-cyan-400"><Icons.Draw /></div>
          </button>
        </div>
        
        {players.length < 2 && (
          <p className="mt-4 text-zinc-500 text-sm italic">Mínimo 2 pecadores para empezar...</p>
        )}
      </div>
    );
  }

  // --- Game Screen Fix: Added the missing game screen logic ---
  if (screen === 'game') {
    const currentPlayer = players[activePlayerIndex];

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-in fade-in duration-500 overflow-hidden">
        <HomeButton />
        
        <div className="fixed top-8 right-8 text-right bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-widest text-[#ff0055] font-black">Turno de:</p>
          <p className="text-2xl font-black">{currentPlayer?.name}</p>
          <p className="text-xs text-zinc-500">{currentPlayer?.points} pts</p>
        </div>

        <div className="w-full max-w-2xl">
          {loading ? (
            <div className="flex flex-col items-center gap-6 py-20">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-[#ff0055]/20 border-t-[#ff0055] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icons.Flame />
                </div>
              </div>
              <p className="font-bebas text-2xl animate-pulse text-zinc-400">PREPARANDO EL PECADO...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 items-center">
              
              {mode === 'pictorami' ? (
                <div className="w-full flex flex-col gap-4 items-center">
                   <div className="glass p-8 rounded-3xl w-full text-center border-b-4 border-cyan-400">
                    <p className="text-xs uppercase tracking-[0.2em] mb-4 text-cyan-400 font-black">DIBUJA ESTO:</p>
                    <h2 className="text-4xl font-black text-white">{currentContent}</h2>
                  </div>
                  
                  <div className="relative w-full aspect-square max-w-[500px] bg-white rounded-3xl overflow-hidden shadow-2xl cursor-crosshair border-8 border-white">
                    <canvas 
                      ref={canvasRef}
                      width={500}
                      height={500}
                      className="w-full h-full touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    <button 
                      onClick={clearCanvas}
                      className="absolute top-4 right-4 p-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-full shadow-lg transition-all active:scale-90"
                    >
                      <Icons.Refresh />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass p-12 rounded-[50px] w-full text-center relative overflow-hidden group border-t-4 border-[#ff0055] min-h-[300px] flex flex-col justify-center">
                   <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#ff0055]/5 blur-3xl rounded-full"></div>
                   <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#bc13fe]/5 blur-3xl rounded-full"></div>
                   <p className="text-xs uppercase tracking-[0.3em] mb-8 text-[#ff0055] font-black italic">
                    {mode === 'truth_or_shot' ? 'Dile la verdad o toma un shot' : 'Si lo has hecho, toma un shot'}
                   </p>
                   <h2 className="text-4xl md:text-5xl font-black leading-tight text-white mb-4 drop-shadow-lg">
                    "{currentContent}"
                   </h2>
                </div>
              )}

              <div className="flex gap-4 w-full max-w-md">
                <button 
                  onClick={() => handleNextTurn(false)}
                  className="flex-1 py-5 rounded-2xl bg-zinc-900 border border-white/10 font-bold hover:bg-zinc-800 transition-all active:scale-95"
                >
                  PASO / SHOT
                </button>
                <button 
                  onClick={() => handleNextTurn(true)}
                  className="flex-1 py-5 rounded-2xl bg-gradient-to-r from-[#ff0055] to-[#bc13fe] font-bold shadow-lg shadow-red-500/20 hover:brightness-110 transition-all active:scale-95"
                >
                  {mode === 'pictorami' ? 'ADIVINADO!' : 'CUMPLIDO!'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

// --- Rendering Fix: Added root rendering call ---
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
