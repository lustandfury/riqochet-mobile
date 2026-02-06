import React from 'react';
import { Tournament } from '../types';

interface ChatPreviewProps {
  tournament: Tournament;
  onLinkClick: () => void;
}

export const ChatPreview: React.FC<ChatPreviewProps> = ({ tournament, onLinkClick }) => {
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/join/${tournament.id}` : '#';
  
  return (
    <div className="w-full max-w-md mx-auto bg-[#e5ddd5] p-4 rounded-xl shadow-inner min-h-[300px] flex flex-col gap-4 font-sans relative overflow-hidden">
        {/* Background Pattern - simplified */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-gradient-to-br from-[#dcf8c6] to-[#c7e8c8]"></div>

        {/* Timestamp */}
        <div className="text-center text-xs text-gray-500 font-medium mb-2 bg-[#dcf8c6]/80 inline-block px-2 rounded-lg mx-auto z-10">Today</div>

        {/* Message Bubble (Sender) */}
        <div className="self-end bg-[#dcf8c6] rounded-lg rounded-tr-none p-1 shadow-sm max-w-[85%] z-10">
            <div className="bg-[#f0f2f5] rounded overflow-hidden cursor-pointer hover:brightness-95 transition-all" onClick={onLinkClick}>
                {/* Meta Image - Real Tournament Poster */}
                <div className="h-40 bg-gray-300 relative overflow-hidden">
                    {tournament.posterUrl ? (
                         <img src={tournament.posterUrl} className="w-full h-full object-cover object-top" alt={`${tournament.name} Tournament Poster`} />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white/50">
                          <span className="text-2xl font-bold">{tournament.name}</span>
                        </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                        <span className="bg-black/60 text-white text-[10px] px-1 rounded">POSTER</span>
                    </div>
                </div>
                
                {/* Meta Text */}
                <div className="p-2 bg-[#f7f7f7] border-l-4 border-primary">
                    <h3 className="font-bold text-sm text-gray-800 line-clamp-1">{tournament.name}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">
                        🏆 {tournament.sport} | 📍 {tournament.location}. 
                        {tournament.maxPlayers - tournament.players.length} spots left! 
                        Join now to get on the poster.
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">riqochet.app • Tournament</p>
                </div>
            </div>
            
            {/* Message Text */}
            <div className="px-2 pb-1 pt-1">
                <p className="text-sm text-gray-800">Join my {tournament.sport} tournament! 🏆</p>
                <div className="flex justify-end items-end gap-1 mt-1">
                    <span className="text-[10px] text-gray-500">Just now</span>
                    <svg viewBox="0 0 16 15" width="16" height="15" className="text-primary fill-current"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.515.006l-.378-.483a.366.366 0 0 0-.512.006l-.378-.483a.364.364 0 0 0-.512.006l-3.258 3.185a.366.366 0 0 0-.512.006l-3.258 3.185a.364.364 0 0 0-.512.006zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.515.006l-.378-.483a.366.366 0 0 0-.512.006l-.378-.483a.364.364 0 0 0-.512.006zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.515.006l-.378-.483a.366.366 0 0 0-.512.006l-.378-.483a.364.364 0 0 0-.512.006z"></path></svg>
                </div>
            </div>
        </div>
    </div>
  );
};