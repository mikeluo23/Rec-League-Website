import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { apiGet } from "@/lib/api";
import type { DivisionOption } from "@/lib/divisions";
import "./globals.css";
import Nav from "./components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TDL Advanced Stats",
  description: "Players, teams, games, box scores, leaderboards, and division filters.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let divisions: DivisionOption[] = [];

  try {
    divisions = await apiGet<DivisionOption[]>("/divisions");
  } catch {
    divisions = [];
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <Nav divisions={divisions} />
        {children}
      </body>
    </html>
  );
}
