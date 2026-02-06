import React from 'react';
import { Tournament } from '../types';

interface PosterCardProps {
  tournament: Tournament;
  loading?: boolean;
}

export const PosterCard: React.FC<PosterCardProps> = ({ tournament, loading }) => {
  return (
    <div className="relative group w-full max-w-sm mx-auto aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-riq-800 bg-riq-900">
      
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-riq-900/80 backdrop-blur-sm">
           <div className="relative w-20 h-20">
             <div className="absolute top-0 left-0 w-full h-full border-4 border-riq-500/30 rounded-full animate-ping"></div>
             <div className="absolute top-0 left-0 w-full h-full border-4 border-t-riq-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
           </div>
           <p className="mt-4 text-riq-accent font-semibold animate-pulse">Generating AI Artifact...</p>
        </div>
      )}

      {/* Image Layer */}
      {tournament.posterUrl ? (
        <img 
          src={tournament.posterUrl} 
          alt="Tournament Poster" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-riq-800 to-riq-900 flex items-center justify-center">
          <span className="text-riq-700 font-bold text-6xl opacity-20">?</span>
        </div>
      )}

      {/* Overlay Layer (The Riqochet Branding) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
        <div className="transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-riq-accent/20 text-riq-accent px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border border-riq-accent/30">
              {tournament.sport}
            </span>
            <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
              {tournament.date}
            </span>
          </div>
          <h2 className="text-3xl font-black text-white leading-tight uppercase italic tracking-tighter mb-1 drop-shadow-lg">
            {tournament.name}
          </h2>
          <div className="flex items-center justify-between text-sm font-medium text-gray-300 border-t border-white/10 pt-3 mt-2">
             <span className="flex items-center gap-1">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               {tournament.location}
             </span>
             <span className="text-riq-accent">
               {tournament.players.length} / {tournament.maxPlayers} Joined
             </span>
          </div>
        </div>
      </div>

      {/* Riqochet Watermark */}
      <div className="absolute top-4 right-4 z-10 opacity-50 mix-blend-overlay">
        <span className="font-black text-white/50 text-xs tracking-[0.2em] rotate-90 origin-top-right absolute top-0 right-0">RIQOCHET</span>
      </div>
    </div>
  );
};