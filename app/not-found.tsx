import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
      <h1 className="text-6xl font-bold text-[#0a2158] mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page non trouvée</h2>
      <p className="text-muted-foreground mb-8 max-w-md">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <Button asChild>
        <Link href="/">Retour à l'accueil</Link>
      </Button>
    </div>
  )
}
