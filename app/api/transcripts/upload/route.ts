export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { parseBuffer } from "music-metadata";

import {
  MAX_AUDIO_DURATION_SECONDS,
  MAX_AUDIO_FILE_SIZE_BYTES,
} from "@/lib/constants";
import { transcribeAudio } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromHeaders } from "@/lib/session";
import { isAcceptedAudioType } from "@/utils/file";

export async function POST(request: Request) {
  try {
    const session = await getAdminSessionFromHeaders(request.headers);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Audio file is required." }, { status: 400 });
    }

    if (!isAcceptedAudioType(file.name, file.type)) {
      return NextResponse.json(
        { error: "Only MP3, WAV, and M4A files are allowed." },
        { status: 400 },
      );
    }

    if (file.size > MAX_AUDIO_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size exceeds the 10 MB limit." },
        { status: 400 },
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const metadata = await parseBuffer(fileBuffer, {
      mimeType: file.type || undefined,
    });
    const duration = metadata.format.duration ?? 0;

    if (!duration || duration > MAX_AUDIO_DURATION_SECONDS) {
      return NextResponse.json(
        { error: "Audio duration must be less than 1 minute." },
        { status: 400 },
      );
    }

    const transcriptText = await transcribeAudio({
      audioBuffer: fileBuffer,
      mimeType: file.type || "audio/mpeg",
      fileName: file.name,
    });

    const transcript = await prisma.transcript.create({
      data: {
        fileName: file.name,
        transcriptText,
      },
    });

    return NextResponse.json({
      success: true,
      transcriptId: transcript.id,
      message: "Audio uploaded and transcribed successfully.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected transcription failure.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
