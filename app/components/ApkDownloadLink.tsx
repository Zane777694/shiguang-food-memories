"use client";

const downloadUrl =
  "https://github.com/Zane777694/shiguang-food-memories/releases/download/v0.1.4/ShiGuang-v0.1.4-arm64-calendar-fix.apk";

export function ApkDownloadLink({ className, children }: { className: string; children: React.ReactNode }) {
  return <a className={className} href={downloadUrl}>{children}</a>;
}
