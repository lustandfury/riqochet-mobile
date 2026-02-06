import React, { useState, useEffect } from 'react';
import { generatePoster } from './services/geminiService';
import { Button } from './components/Button';
import { PosterCard } from './components/PosterCard';
import { ChatPreview } from './components/ChatPreview';
import { AppView, Tournament, Player } from './types';

// Icons
const ArrowLeftIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const ShareIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
const SparklesIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;

function App() {
  const [view, setView] = useState<AppView>(AppView.CREATE);
  const [loading, setLoading] = useState(false);
  const [tournament, setTournament] = useState<Tournament>({
    id: '',
    name: '',
    sport: 'Basketball',
    location: 'Central Park Courts',
    date: 'Saturday, 10 AM',
    maxPlayers: 10,
    mood: 'Urban Grit',
    ownerId: 'owner-1',
    players: [],
  });

  // Handle Input Changes for creation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTournament(prev => ({ ...prev, [name]: value }));
  };

  // 1. Create Tournament & Generate Initial Poster
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Create Owner Player
    const owner: Player = { id: 'owner-1', nickname: 'Host', joinedAt: Date.now() };
    const updatedTournament = { ...tournament, id: 'tourney-1', players: [owner] };

    try {
      const posterUrl = await generatePoster({
        name: updatedTournament.name,
        sport: updatedTournament.sport,
        location: updatedTournament.location,
        mood: updatedTournament.mood,
        playerCount: 1
      });
      
      setTournament({ ...updatedTournament, posterUrl });
      setView(AppView.DASHBOARD);
    } catch (err) {
      console.error(err);
      alert("Failed to generate artifacts. Check API Key.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Join Flow & Re-Generate Poster
  const handleJoin = async (nickname: string) => {
    setLoading(true);
    const newPlayer: Player = { id: `p-${Date.now()}`, nickname, joinedAt: Date.now() };
    const updatedPlayers = [...tournament.players, newPlayer];
    const updatedTournament = { ...tournament, players: updatedPlayers };
    
    // Optimistic Update
    setTournament(updatedTournament);
    setView(AppView.DASHBOARD); // Return to dashboard to see "evolution"

    // Trigger AI Evolution
    try {
      const posterUrl = await generatePoster({
        name: updatedTournament.name,
        sport: updatedTournament.sport,
        location: updatedTournament.location,
        mood: updatedTournament.mood,
        playerCount: updatedPlayers.length
      });
      setTournament(prev => ({ ...prev, posterUrl }));
    } catch (err) {
      console.error("Evolution failed", err);
    } finally {
      setLoading(false);
    }
  };

  // --- VIEWS ---

  const renderCreateView = () => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-riq-900">
      <div className="w-full max-w-lg space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-riq-400 to-riq-accent">
            RIQOCHET
          </h1>
          <p className="mt-2 text-gray-400">Initialize Tournament & Generate Artifacts</p>
        </div>

        <form onSubmit={handleCreate} className="bg-riq-800 p-8 rounded-2xl shadow-xl border border-riq-700 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Tournament Name</label>
              <input 
                required
                name="name" 
                value={tournament.name} 
                onChange={handleInputChange}
                className="w-full bg-riq-900 border border-riq-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-riq-500 outline-none" 
                placeholder="e.g. Summer Slam 24"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Sport</label>
                  <select name="sport" value={tournament.sport} onChange={handleInputChange} className="w-full bg-riq-900 border border-riq-700 rounded-lg p-3 text-white">
                    <option>Basketball</option>
                    <option>Soccer</option>
                    <option>Tennis</option>
                    <option>Padel</option>
                    <option>Gaming</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Mood</label>
                  <select name="mood" value={tournament.mood} onChange={handleInputChange} className="w-full bg-riq-900 border border-riq-700 rounded-lg p-3 text-white">
                    <option>Urban Grit</option>
                    <option>Neon Future</option>
                    <option>Classic Prestige</option>
                    <option>High Energy</option>
                  </select>
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
              <input 
                name="location" 
                value={tournament.location} 
                onChange={handleInputChange}
                className="w-full bg-riq-900 border border-riq-700 rounded-lg p-3 text-white" 
              />
            </div>
          </div>

          <Button type="submit" isLoading={loading} className="w-full">
            <SparklesIcon />
            Create & Generate Poster
          </Button>
          
          {!process.env.API_KEY && (
             <p className="text-xs text-yellow-500/80 text-center">
               Note: No API_KEY found. Using mock image generator.
             </p>
          )}
        </form>
      </div>
    </div>
  );

  const renderDashboardView = () => (
    <div className="min-h-screen bg-riq-900 p-4 pb-24">
      <header className="flex justify-between items-center mb-6">
        <button onClick={() => setView(AppView.CREATE)} className="text-gray-400 hover:text-white">
          <ArrowLeftIcon />
        </button>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">Live</span>
        </div>
      </header>

      <main className="flex flex-col items-center space-y-8">
        
        {/* The Artifact */}
        <div className="w-full max-w-sm relative">
            <PosterCard tournament={tournament} loading={loading} />
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-riq-800 px-4 py-1 rounded-full border border-riq-700 text-xs text-riq-400 shadow-lg whitespace-nowrap">
               AI Artifact v{tournament.players.length}.0
            </div>
        </div>

        {/* Action Area */}
        <div className="w-full max-w-sm space-y-4">
           <div className="bg-riq-800/50 p-4 rounded-xl border border-riq-700/50">
              <div className="flex justify-between items-center mb-2">
                 <h3 className="text-sm font-bold text-gray-300">Roster ({tournament.players.length}/{tournament.maxPlayers})</h3>
                 <span className="text-xs text-riq-400">Filling up...</span>
              </div>
              <div className="flex -space-x-2 overflow-hidden">
                 {tournament.players.map((p, i) => (
                    <div key={p.id} className="w-8 h-8 rounded-full bg-riq-700 border-2 border-riq-800 flex items-center justify-center text-xs font-bold text-white relative" style={{zIndex: 10-i}}>
                       {p.nickname.charAt(0)}
                    </div>
                 ))}
                 {Array.from({length: Math.min(3, tournament.maxPlayers - tournament.players.length)}).map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-riq-800/50 border-2 border-riq-800 border-dashed"></div>
                 ))}
              </div>
           </div>

           <Button onClick={() => setView(AppView.SHARE_PREVIEW)} className="w-full">
             <ShareIcon /> Share Invite Link
           </Button>
        </div>
      </main>
    </div>
  );

  const renderSharePreview = () => (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
         <button onClick={() => setView(AppView.DASHBOARD)} className="text-gray-600 font-medium flex items-center gap-1">
           <ArrowLeftIcon /> Back
         </button>
         <h2 className="text-gray-800 font-bold">Preview</h2>
      </div>
      
      <ChatPreview tournament={tournament} onLinkClick={() => setView(AppView.JOIN)} />
      
      <div className="mt-8 text-center text-sm text-gray-500 max-w-xs">
        <p>This is how your link appears in WhatsApp/iMessage. The image is dynamically pulled from your AI poster.</p>
      </div>
    </div>
  );

  const renderJoinView = () => {
    const [nickname, setNickname] = useState('');
    
    return (
      <div className="min-h-screen bg-riq-900 relative overflow-hidden flex flex-col">
        {/* Background Blur */}
        <div className="absolute inset-0 z-0">
           {tournament.posterUrl && <img src={tournament.posterUrl} className="w-full h-full object-cover opacity-20 blur-xl" alt="bg" />}
           <div className="absolute inset-0 bg-gradient-to-t from-riq-900 via-riq-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col p-6">
           <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-32 h-32 rounded-xl overflow-hidden shadow-2xl border-2 border-riq-500 rotate-3">
                 {tournament.posterUrl && <img src={tournament.posterUrl} className="w-full h-full object-cover" alt="thumb" />}
              </div>
              
              <div>
                <h1 className="text-3xl font-black text-white uppercase italic">{tournament.name}</h1>
                <p className="text-riq-400 font-medium">{tournament.sport} • {tournament.location}</p>
              </div>

              <div className="bg-riq-800/80 backdrop-blur p-6 rounded-2xl border border-riq-700 w-full max-w-sm">
                 <h3 className="text-lg font-bold text-white mb-4">Join the Squad</h3>
                 <p className="text-sm text-gray-400 mb-4">Join early to be featured on the official tournament poster.</p>
                 
                 <form onSubmit={(e) => { e.preventDefault(); if(nickname) handleJoin(nickname); }} className="space-y-4">
                    <input 
                      autoFocus
                      placeholder="Your Nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full bg-riq-900/50 border border-riq-600 rounded-lg p-3 text-white text-center font-bold focus:ring-2 focus:ring-riq-500 outline-none"
                    />
                    <Button type="submit" className="w-full" disabled={!nickname}>
                      Confirm & Join
                    </Button>
                 </form>
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {view === AppView.CREATE && renderCreateView()}
      {view === AppView.DASHBOARD && renderDashboardView()}
      {view === AppView.SHARE_PREVIEW && renderSharePreview()}
      {view === AppView.JOIN && renderJoinView()}
    </>
  );
}

export default App;