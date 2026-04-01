import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SyncSocial Demo App",
  description: "Standalone demo app for SyncSocial using mock data only",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="relative overflow-x-hidden">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <defs>
              <radialGradient id="g1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="g2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="g3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse className="blob-1" cx="25%" cy="20%" rx="400" ry="350" fill="url(#g1)" />
            <ellipse className="blob-2" cx="75%" cy="60%" rx="350" ry="400" fill="url(#g2)" />
            <ellipse className="blob-3" cx="50%" cy="80%" rx="450" ry="300" fill="url(#g3)" />
          </svg>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        {children}
      </body>
    </html>
  );
}
