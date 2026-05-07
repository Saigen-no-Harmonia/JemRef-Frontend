import type { Metadata } from "next"
import { Inter, Noto_Sans_JP } from "next/font/google"
import { FirebaseAuthSync, RedirectResultHandler } from '@/features/auth/'
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "JemRef — 和文文献に特化した文献管理",
  description:
    "JemRefは、和文文献の登録・検索・共有を、はやく・正確に・ストレスなく行える文献管理サービスです。",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${notoSansJp.variable} antialiased`}>
        <FirebaseAuthSync />
        <RedirectResultHandler />
        {children}
      </body>
    </html>
  )
}
