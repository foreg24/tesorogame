import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "La Isla del Tesoro Matemático",
  description: "Un videojuego RPG educativo para niños de 7-8 años para fortalecer el pensamiento lógico-matemático",
  keywords: "educativo, matemáticas, niños, juego, RPG, primaria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-ocean-50">
        {children}
      </body>
    </html>
  );
}
