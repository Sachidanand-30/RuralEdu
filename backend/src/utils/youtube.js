// src/utils/youtube.js

// Extract video ID from various YouTube URL formats
export const extractYoutubeId = (url) => {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }

    if (u.hostname.includes("youtube.com")) {
      return u.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
};

export const getYoutubeEmbedUrl = (url) => {
  const id = extractYoutubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}`;
};
