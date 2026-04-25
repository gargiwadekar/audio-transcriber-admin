"use client";

import { useCallback, useState } from "react";

type UploadResult = {
  success: boolean;
  transcriptId: string;
  message: string;
};

export function useUploadTranscript() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadTranscript = useCallback((file: File) => {
    return new Promise<UploadResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      setIsUploading(true);
      setProgress(0);
      formData.append("file", file);

      xhr.upload.addEventListener("progress", (event) => {
        if (!event.lengthComputable) {
          return;
        }

        setProgress(Math.round((event.loaded / event.total) * 100));
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
          return;
        }

        setIsUploading(false);

        try {
          const payload = JSON.parse(xhr.responseText) as
            | UploadResult
            | { error: string };

          if (xhr.status >= 200 && xhr.status < 300 && "success" in payload) {
            setProgress(100);
            resolve(payload);
            return;
          }

          const message = "error" in payload ? payload.error : "Upload failed.";
          reject(new Error(message));
        } catch {
          reject(new Error("Unexpected upload response."));
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        reject(new Error("Network error while uploading audio."));
      };

      xhr.open("POST", "/api/transcripts/upload");
      xhr.send(formData);
    });
  }, []);

  return {
    progress,
    isUploading,
    uploadTranscript,
    reset() {
      setProgress(0);
      setIsUploading(false);
    },
  };
}
