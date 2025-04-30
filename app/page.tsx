import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, Users, BarChart, UserPlus } from "lucide-react"
import { getAgents } from "@/app/actions"

export default async function HomePage() {
  const agents = await getAgents()
  const agentsCount = agents.filter((a) => a.role === "agent").length
  const evaluateursCount = agents.filter((a) => a.role === "evaluateur").length

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Système d'Évaluation GPIS</h1>
        <p className="text-xl text-muted-foreground">Gérez et suivez les évaluations des agents d'exploitation</p>
      </div>

      {agentsCount === 0 || evaluateursCount === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 text-center">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">Configuration requise</h2>
          <p className="mb-4">
            Pour commencer à utiliser le système d'évaluation, vous devez d'abord ajouter des agents et des évaluateurs.
          </p>
          <Button asChild>
            <Link href="/evaluations/new?tab=ajouter-agent">
              <UserPlus className="mr-2 h-4 w-4" /> Ajouter des agents
            </Link>
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/evaluations/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader>
              <ClipboardList className="h-8 w-8 text-[#0a2158] mb-2" />
              <CardTitle>Nouvelle évaluation</CardTitle>
              <CardDescription>Créer une évaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Créez rapidement une nouvelle évaluation pour un agent d'exploitation.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#0a2158] hover:bg-[#0a2158]/90">Commencer</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/evaluations">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader>
              <Users className="h-8 w-8 text-[#0a2158] mb-2" />
              <CardTitle>Consulter les évaluations</CardTitle>
              <CardDescription>Historique des évaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Consultez l'historique des évaluations réalisées et leurs résultats.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Accéder
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/statistiques">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader>
              <BarChart className="h-8 w-8 text-[#0a2158] mb-2" />
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>Par évaluateur</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Consultez les statistiques des évaluations regroupées par évaluateur.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Accéder
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </div>

      <div className="mt-12 text-center">
        <Button asChild size="lg" className="bg-[#0a2158] hover:bg-[#0a2158]/90">
          <Link href="/evaluations/new">Créer une nouvelle évaluation</Link>
        </Button>
      </div>
    </div>
  )
}
