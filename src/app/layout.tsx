import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "KA Board",
  description: "KA 项目看板",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="h-full flex flex-col">
        <Providers>
          <Header />
          <div className="flex-1 min-h-0">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
