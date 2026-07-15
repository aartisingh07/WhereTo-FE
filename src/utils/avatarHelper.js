/**
 * Reusable onError handler for avatar images.
 * Replaces any broken or restricted avatar URLs (such as Google default silhouettes)
 * with a clean, high-contrast DiceBear SVG placeholder.
 */
export const handleAvatarError = (e, username) => {
  e.target.onerror = null; // Prevent infinite loops if DiceBear itself is down
  const seed = username ? encodeURIComponent(username) : 'user';
  e.target.src = `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`;
};
