export const MAX_PREVIEW_VIDEO_SIZE = 200 * 1024 * 1024;

export function getPreviewVideoUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : "";
  } catch {
    return "";
  }
}

export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 bytes";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validatePreviewVideoFile(file) {
  if (!file) {
    return "";
  }

  const hasMp4Extension = file.name?.toLocaleLowerCase().endsWith(".mp4");
  const hasSupportedMimeType =
    !file.type || file.type.toLocaleLowerCase() === "video/mp4";

  if (!hasMp4Extension || !hasSupportedMimeType) {
    return "Choose an MP4 video file.";
  }

  if (!Number.isFinite(file.size) || file.size <= 0) {
    return "The selected video file is empty or invalid.";
  }

  if (file.size > MAX_PREVIEW_VIDEO_SIZE) {
    return "Movie videos must be 200 MB or smaller.";
  }

  return "";
}
