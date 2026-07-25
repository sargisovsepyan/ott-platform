// Преобразует документ фильма в объект для ответа API и добавляет URL превью-видео.
const serializeMovie = (movie) => {
    if (!movie) {
        return null;
    }

    const movieObject =
        typeof movie.toObject === "function" ? movie.toObject() : movie;

    const { previewVideo, ...publicMovieData } = movieObject;

    const customPreviewVideoUrl = previewVideo?.url?.trim();

    const defaultPreviewVideoUrl =
        process.env.DEFAULT_PREVIEW_VIDEO_URL?.trim() || null;

    return {
        ...publicMovieData,
        previewVideoUrl: customPreviewVideoUrl || defaultPreviewVideoUrl,
    };
};

module.exports = serializeMovie;