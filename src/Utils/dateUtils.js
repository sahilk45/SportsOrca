// Date utility functions for match display

export const formatMatchDate = (dateString) => {
  const date = new Date(dateString);
  
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getRelativeTime = (dateString) => {
  const now = new Date();
  const matchDate = new Date(dateString);
  const diffInMs = matchDate - now;
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Tomorrow';
  } else if (diffInDays < 7) {
    return `In ${diffInDays} days`;
  } else {
    const weeks = Math.floor(diffInDays / 7);
    return `In ${weeks} week${weeks > 1 ? 's' : ''}`;
  }
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};