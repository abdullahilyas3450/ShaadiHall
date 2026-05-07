import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "@/store/authStore";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShaadiHall - Premium Hall Booking System",
  description: "Book the perfect venue for your special event with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={cn(inter.className, "h-full antialiased text-gray-900")}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
