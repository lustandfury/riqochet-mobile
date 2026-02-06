import React from 'react';
import { Tournament } from '../types';

interface ChatPreviewProps {
  tournament: Tournament;
  onLinkClick: () => void;
}

export const ChatPreview: React.FC<ChatPreviewProps> = ({ tournament, onLinkClick }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-[#e5ddd5] p-4 rounded-xl shadow-inner min-h-[300px] flex flex-col gap-4 font-sans relative overflow-hidden">
        {/* Background Pattern Mock */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png')] bg-repeat space-x-4"></div>

        {/* Timestamp */}
        <div className="text-center text-xs text-gray-500 font-medium mb-2 bg-[#dcf8c6]/80 inline-block px-2 rounded-lg mx-auto z-10">Today</div>

        {/* Message Bubble (Sender) */}
        <div className="self-end bg-[#dcf8c6] rounded-lg rounded-tr-none p-1 shadow-sm max-w-[85%] z-10 animate-fade-in-up">
            <div className="bg-[#f0f2f5] rounded overflow-hidden cursor-pointer hover:brightness-95 transition-all" onClick={onLinkClick}>
                {/* Meta Image */}
                <div className="h-40 bg-gray-300 relative overflow-hidden">
                    {tournament.posterUrl ? (
                         <img src={tournament.posterUrl} className="w-full h-full object-cover object-top" alt="Preview" />
                    ) : (
                        <div className="w-full h-full bg-riq-800 flex items-center justify-center text-white/50">No Image</div>
                    )}
                    <div className="absolute bottom-2 left-2">
                        <span className="bg-black/60 text-white text-[10px] px-1 rounded">GIF</span>
                    </div>
                </div>
                
                {/* Meta Text */}
                <div className="p-2 bg-[#f7f7f7] border-l-4 border-riq-500">
                    <h3 className="font-bold text-sm text-gray-800 line-clamp-1">{tournament.name}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">
                        🏆 {tournament.sport} | 📍 {tournament.location}. 
                        {tournament.maxPlayers - tournament.players.length} spots left! 
                        Join now to get on the poster.
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 lowercase">riqochet.app • 2 min read</p>
                </div>
            </div>
            
            {/* Message Text */}
            <div className="px-2 pb-1 pt-1">
                <p className="text-sm text-gray-800">Hey! Spots filling up for the tourney. Tap to join 👇</p>
                <div className="flex justify-end items-end gap-1 mt-1">
                    <span className="text-[10px] text-gray-500">10:42 AM</span>
                    <svg viewBox="0 0 16 15" width="16" height="15" className="text-blue-500 fill-current"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-7.674a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-7.674a.366.366 0 0 0-.064-.512z"></path></svg>
                </div>
            </div>
        </div>
    </div>
  );
};