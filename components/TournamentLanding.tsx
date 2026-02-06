import React, { useEffect, useState } from 'react';
import { Tournament } from '../types';
import { Button } from './Button';

interface TournamentLandingProps {
  tournament: Tournament;
  onJoin: () => void;
}

export const TournamentLanding: React.FC<TournamentLandingProps> = ({ tournament, onJoin }) => {
  const [metadata, setMetadata] = useState<string>('');

  useEffect(() => {
    // Update page metadata for social sharing
    const tags = [
      `<meta property="og:title" content="${tournament.name} - ${tournament.sport} Tournament" />`,
      `<meta property="og:description" content="🏆 ${tournament.sport} Tournament at ${tournament.location}. ${tournament.maxPlayers - tournament.players.length} spots left! Join now to get on the poster." />`,
      `<meta property="og:image" content="${tournament.posterUrl || 'https://picsum.photos/seed/tournament/800/1200'}" />`,
      `<meta property="og:image:alt" content="${tournament.name} Tournament Poster" />`,
      `<meta property="og:url" content="${window.location.href}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="Riqochet" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${tournament.name} - ${tournament.sport} Tournament" />`,
      `<meta name="twitter:description" content="🏆 ${tournament.sport} Tournament at ${tournament.location}. ${tournament.maxPlayers - tournament.players.length} spots left!" />`,
      `<meta name="twitter:image" content="${tournament.posterUrl || 'https://picsum.photos/seed/tournament/800/1200'}" />`
    ];

    // Update document head
    const head = document.head;
    
    // Remove existing meta tags
    const existingMeta = head.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]');
    existingMeta.forEach(tag => tag.remove());

    // Add new meta tags
    tags.forEach(tagHtml => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = tagHtml;
      const metaTag = tempDiv.firstChild as HTMLMetaElement;
      head.appendChild(metaTag);
    });

    // Update page title
    document.title = `${tournament.name} - ${tournament.sport} Tournament | Riqochet`;

    setMetadata(tags.join('\n'));
  }, [tournament]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-card flex flex-col">
      {/* Hero Section with Tournament Poster */}
      <div className="relative h-96 overflow-hidden">
        {tournament.posterUrl ? (
          <img 
            src={tournament.posterUrl} 
            alt={`${tournament.name} Tournament Poster`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-black text-white mb-4">{tournament.name}</h1>
              <p className="text-xl text-white/80">{tournament.sport} Tournament</p>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-8">
          <div className="text-white">
            <h1 className="text-4xl font-black mb-2">{tournament.name}</h1>
            <div className="flex items-center gap-4 text-lg">
              <span className="flex items-center gap-2">
                🏆 {tournament.sport}
              </span>
              <span className="flex items-center gap-2">
                📍 {tournament.location}
              </span>
              <span className="flex items-center gap-2">
                📅 {tournament.date}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Details */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Details */}
            <div className="space-y-6">
              <div className="bg-surface p-6 rounded-xl border border-dark-800">
                <h2 className="text-2xl font-bold text-white mb-4">Tournament Details</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-dark-400">Sport:</span>
                    <span className="text-white font-medium">{tournament.sport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Location:</span>
                    <span className="text-white font-medium">{tournament.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Date:</span>
                    <span className="text-white font-medium">{tournament.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Mood:</span>
                    <span className="text-white font-medium">{tournament.mood}</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface p-6 rounded-xl border border-dark-800">
                <h3 className="text-xl font-bold text-white mb-3">Current Roster</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-dark-400">Players Joined:</span>
                  <span className="text-2xl font-bold text-primary">{tournament.players.length}/{tournament.maxPlayers}</span>
                </div>
                
                {tournament.players.length > 0 ? (
                  <div className="flex -space-x-2">
                    {tournament.players.map((player, index) => (
                      <div 
                        key={player.id}
                        className="w-12 h-12 rounded-full bg-primary border-2 border-surface flex items-center justify-center text-white font-bold text-sm"
                        style={{ zIndex: tournament.players.length - index }}
                      >
                        {player.nickname.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-400 italic">No players joined yet. Be the first!</p>
                )}
              </div>
            </div>

            {/* Right Column - Join Action */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-xl text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Join?</h3>
                <p className="text-white/90 mb-6">
                  {tournament.maxPlayers - tournament.players.length} spots remaining!
                </p>
                <Button onClick={onJoin} className="w-full text-lg">
                  Join Tournament
                </Button>
              </div>

              <div className="bg-surface p-6 rounded-xl border border-dark-800">
                <h3 className="text-lg font-bold text-white mb-3">How to Join</h3>
                <ol className="space-y-2 text-dark-300 text-sm">
                  <li>1. Click "Join Tournament" above</li>
                  <li>2. Enter your nickname</li>
                  <li>3. Your profile will be added to the poster!</li>
                  <li>4. Share with friends to fill the tournament</li>
                </ol>
              </div>

              <div className="bg-surface p-6 rounded-xl border border-dark-800">
                <h3 className="text-lg font-bold text-white mb-3">Share This Tournament</h3>
                <p className="text-dark-300 text-sm mb-4">
                  Share this link with friends to get more players!
                </p>
                <div className="bg-card p-3 rounded-lg border border-dark-700">
                  <code className="text-primary text-xs break-all">
                    {window.location.href}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
