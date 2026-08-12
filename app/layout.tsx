import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "食光｜记录每一餐，收藏每一刻",
  description: "食光是一款记录饮食与生活记忆的 App，让每一次用餐都成为值得保存的生活记忆。",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
