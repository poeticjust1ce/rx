import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import NotificationListener from "@/components/NotificationListener";

const font = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: {
    default: "RX Global - Inventory & Attendance System",
    template: "%s | RX Global Sales",
  },
  description:
    "Inventory management and employee attendance system for RX Global Sales and Marketing Corp.",

  authors: [{ name: "RX Global Sales and Marketing Corp." }],
  creator: "RX Global IT Team",
  publisher: "RX Global Sales and Marketing Corp.",
  metadataBase: new URL("https://rxglobal.site"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RX Global - Business Management System",
    description:
      "Integrated inventory and attendance solution for RX Global Sales",
    url: "https://rxglobal.site",
    siteName: "RX Global Sales",
    locale: "en_PH",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <NotificationListener />
      <body className={`${font.variable} font-sans antialiased`}>
        <div className="flex min-h-screen">
          <aside className="hidden lg:block w-64 bg-card shadow-md"></aside>

          <main className="flex-1 p-6">{children}</main>
        </div>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
