import Link from "next/link"
import { getEvaluations, getAgents } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, UserPlus } from "lucide-react"

export default async function EvaluationsPage({ searchParams }: { searchParams: { evaluateurId?: string } }) {
  const evaluateurId = searchParams.evaluateurId
  const evaluations = await getEvaluations(undefined, evaluateurId)
  const agents = await getAgents()

  // Créer un dictionnaire pour rechercher rapidement les agents par ID
  const agentsMap = agents.reduce(
    (acc, agent) => {
      acc[agent.id] = agent
      return acc
    },
    {} as Record<string, (typeof agents)[0]>,
  )

  // Obtenir la liste des évaluateurs pour le filtre
  const evaluateurs = agents.filter((agent) => agent.role === "evaluateur")

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Évaluations</h1>
        <div className="flex gap-2">
          {evaluateurId && (
            <Link href="/evaluations">
              <Button variant="outline">Voir toutes les évaluations</Button>
            </Link>
          )}
          <Link href="/evaluations/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle évaluation
            </Button>
          </Link>
        </div>
      </div>

      {!evaluateurId && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="font-medium">Filtrer par évaluateur:</div>
              <div className="flex flex-wrap gap-2">
                {evaluateurs.map((evaluateur) => (
                  <Link key={evaluateur.id} href={`/evaluations?evaluateurId=${evaluateur.id}`}>
                    <Button variant="outline" size="sm">
                      {evaluateur.nom} {evaluateur.prenom}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {evaluations.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                {agents.length === 0
                  ? "Aucun agent n'est enregistré dans le système. Veuillez d'abord ajouter des agents."
                  : "Aucune évaluation n'a été trouvée."}
              </p>
              <div className="flex justify-center gap-4">
                {agents.length === 0 ? (
                  <Link href="/evaluations/new?tab=ajouter-agent">
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Ajouter des agents
                    </Button>
                  </Link>
                ) : (
                  <Link href="/evaluations/new">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Créer une évaluation
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          evaluations.map((evaluation) => {
            const agent = agentsMap[evaluation.agentId]
            const evaluateur = agentsMap[evaluation.evaluateurId]

            // Déterminer la classe de couleur en fonction du pourcentage
            const getScoreColorClass = (percentage?: number) => {
              if (!percentage) return "bg-gray-100 text-gray-800"
              if (percentage >= 70) return "bg-green-100 text-green-800"
              if (percentage >= 40) return "bg-yellow-100 text-yellow-800"
              return "bg-red-100 text-red-800"
            }

            return (
              <Link href={`/evaluations/${evaluation.id}`} key={evaluation.id}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="font-medium">{agent ? `${agent.nom} ${agent.prenom}` : "Agent inconnu"}</p>
                      <p className="text-sm text-muted-foreground">
                        Évalué par: {evaluateur ? `${evaluateur.nom} ${evaluateur.prenom}` : "Évaluateur inconnu"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Date: {new Date(evaluation.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-[#0a2158] text-white px-3 py-1 rounded text-sm">
                        {evaluation.totalScore ||
                          Object.values(evaluation.competences).reduce(
                            (sum, value) => sum + Number.parseInt(value || "0"),
                            0,
                          )}
                        /{evaluation.maxScore || Object.keys(evaluation.competences).length * 3}
                      </div>
                      <div className={`px-3 py-1 rounded text-sm ${getScoreColorClass(evaluation.scorePercentage)}`}>
                        {evaluation.scorePercentage ||
                          Math.round(
                            (Object.values(evaluation.competences).reduce(
                              (sum, value) => sum + Number.parseInt(value || "0"),
                              0,
                            ) /
                              (Object.keys(evaluation.competences).length * 3)) *
                              100,
                          )}
                        %
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
