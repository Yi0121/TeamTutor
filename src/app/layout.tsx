import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TeamTutor - 智慧虛擬課堂',
  description: '基於 Multi-Agent 與 RAG 技術的教育平台',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
