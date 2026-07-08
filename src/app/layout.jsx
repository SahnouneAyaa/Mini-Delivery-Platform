import { Inter } from "next/font/google";
import Providers from "@/components/general/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="fr" dir="ltr">
      <body suppressHydrationWarning={true} className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}