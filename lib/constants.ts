export const APP_NAME = "Audio Transcriber Admin";
export const ADMIN_EMAIL = "admin@audiotranscriber.com";
export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "Admin@123";

export const ACCEPTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/aac",
] as const;

export const ACCEPTED_AUDIO_EXTENSIONS = [".mp3", ".wav", ".m4a"] as const;
export const MAX_AUDIO_DURATION_SECONDS = 59;
export const MAX_AUDIO_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const GEMINI_MODEL = "gemini-2.5-flash";

