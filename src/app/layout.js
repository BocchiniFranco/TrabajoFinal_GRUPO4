'use client'; 

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer';
import AuthProvider from '../contexts/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
<html lang="es">
      <head>
        <title>Alquiler de autos</title>
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
