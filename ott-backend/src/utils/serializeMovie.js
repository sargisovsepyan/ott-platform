// Преобразует документ фильма в объект для ответа API и добавляет URL превью-видео.
const serializeMovie = (movie) => {
    if (!movie) {
        return null;
    }

    const movieObject =
        typeof movie.toObject === "function" ? movie.toObject() : movie;

    const { video, ...publicMovieData } = movieObject;

    const uploadedVideoUrl = video?.url?.trim();

    const comingSoonVideoUrl =
        process.env.DEFAULT_COMING_SOON_VIDEO_URL?.trim() || null;

    return {
        ...publicMovieData,
        videoUrl: uploadedVideoUrl || comingSoonVideoUrl,
    };
};

module.exports = serializeMovie;