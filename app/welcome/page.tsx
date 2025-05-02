import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ShieldCheck } from "lucide-react"
import Image from "next/image"

export default function WelcomePage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-8">
          <Image src="/gpis-gie-logo.png" alt="GPIS GIE" width={200} height={80} priority />
        </div>

        <Card className="mb-8">
          <CardHeader className="bg-[#0a2158] text-white text-center">
            <CardTitle className="text-2xl">Bienvenue au Système d'Évaluation GPIS</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <ShieldCheck className="h-16 w-16 text-[#0a2158]" />
              </div>
              <h2 className="text-xl font-bold mb-4">Accès réservé à la Direction des Opérations</h2>
              <p className="text-muted-foreground mb-6">
                Ce système est exclusivement destiné à la Direction des Opérations (DirOps) du GPIS GIE. Il permet
                d'évaluer les compétences des agents d'exploitation, de suivre leur progression et d'analyser les
                résultats.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 w-full">
                <p className="text-amber-800 font-medium">
                  Toute utilisation non autorisée de ce système est strictement interdite et pourra faire l'objet de
                  sanctions.
                </p>
              </div>
              <Button asChild size="lg" className="bg-[#0a2158] hover:bg-[#0a2158]/90">
                <Link href="/">
                  Accéder au système <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GPIS GIE - Tous droits réservés</p>
          <p>Groupement Parisien Inter-bailleurs de Surveillance</p>
        </div>
      </div>
    </div>
  )
}
