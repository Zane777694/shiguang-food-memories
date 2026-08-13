"use client";

import { useState } from "react";

const parts = ["./downloads/shiguang.part1", "./downloads/shiguang.part2"];

export function ApkDownloadLink({ className, children }: { className: string; children: React.ReactNode }) {
  const [downloading, setDownloading] = useState(false);

  const download = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const responses = await Promise.all(parts.map((part) => fetch(part)));
      if (responses.some((response) => !response.ok)) throw new Error("APK download failed");
      const buffers = await Promise.all(responses.map((response) => response.arrayBuffer()));
      const blob = new Blob(buffers, { type: "application/vnd.android.package-archive" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "ShiGuang-v0.1.4-arm64-calendar-fix.apk";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      setDownloading(false);
    }
  };

  return <button className={className} type="button" onClick={download} disabled={downloading}>{downloading ? "正在准备下载…" : children}</button>;
}
