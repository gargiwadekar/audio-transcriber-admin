"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";

export async function deleteTranscriptAction(transcriptId: string) {
  await requireAdminSession();

  await prisma.transcript.delete({
    where: {
      id: transcriptId,
    },
  });

  revalidatePath("/dashboard");
}

