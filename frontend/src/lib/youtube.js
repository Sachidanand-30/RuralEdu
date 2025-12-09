export const getYoutubeEmbedUrl = (url) => {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed${u.pathname}`;
    }

    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    return null;
  } catch {
    return null;
  }
};

