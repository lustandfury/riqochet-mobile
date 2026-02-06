import { Tournament } from '../types';

export const generateShareLink = (tournament: Tournament): string => {
  // Generate a unique share link for this tournament
  const baseUrl = window.location.origin;
  const shareId = btoa(`${tournament.id}-${Date.now()}`).substring(0, 12);
  return `${baseUrl}/join/${shareId}`;
};

export const generateOpenGraphTags = (tournament: Tournament): string => {
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

  return tags.join('\n');
};
