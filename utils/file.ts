import path from "path";

import {
  ACCEPTED_AUDIO_EXTENSIONS,
  ACCEPTED_AUDIO_TYPES,
} from "@/lib/constants";

export function isAcceptedAudioType(fileName: string, mimeType: string) {
  const extension = path.extname(fileName).toLowerCase();

  return (
    ACCEPTED_AUDIO_EXTENSIONS.includes(
      extension as (typeof ACCEPTED_AUDIO_EXTENSIONS)[number],
    ) ||
    ACCEPTED_AUDIO_TYPES.includes(mimeType as (typeof ACCEPTED_AUDIO_TYPES)[number])
  );
}

