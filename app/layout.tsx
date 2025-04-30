import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Système d'Évaluation GPIS",
  description: "Système de gestion des évaluations des agents d'exploitation",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <header className="bg-[#0a2158] text-white p-4">
          <div className="container flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <div className="bg-white p-1 rounded mr-4">
                <img src="/gpis-gie-logo.png" alt="GPIS GIE" className="h-8" />
              </div>
              <h1 className="text-xl font-bold">Système d'Évaluation</h1>
            </Link>
            <nav>
              <ul className="flex gap-6">
                <li>
                  <Link href="/evaluations/new" className="hover:underline">
                    Nouvelle évaluation
                  </Link>
                </li>
                <li>
                  <Link href="/evaluations" className="hover:underline">
                    Historique
                  </Link>
                </li>
                <li>
                  <Link href="/statistiques" className="hover:underline">
                    Statistiques
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
