import Link from "next/link"
import { getEvaluationsByEvaluateur } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, User, UserPlus } from "lucide-react"

export default async function StatistiquesPage() {
  const evaluateursData = await getEvaluationsByEvaluateur()

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Statistiques des évaluations</h1>
        </div>
      </div>

      {evaluateursData.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Aucun évaluateur n'est enregistré dans le système. Veuillez d'abord ajouter des évaluateurs.
            </p>
            <Link href="/evaluations/new?tab=ajouter-agent">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Ajouter des évaluateurs
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {evaluateursData.map(({ evaluateur, evaluations, stats }) => (
            <Card key={evaluateur.id} className="overflow-hidden">
              <CardHeader className="bg-[#0a2158] text-white">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {evaluateur.nom} {evaluateur.prenom} ({evaluateur.matricule})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 bg-[#f8f9fa] border-b">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-muted-foreground">Évaluations réalisées</p>
                      <p className="text-2xl font-bold">{stats.totalEvaluations}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-muted-foreground">Score moyen</p>
                      <p className="text-2xl font-bold">{stats.scoreMoyen} points</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-muted-foreground">Pourcentage moyen</p>
                      <p className="text-2xl font-bold">{stats.pourcentageMoyen}%</p>
                    </div>
                  </div>
                </div>

                {evaluations.length > 0 ? (
                  <div className="p-4">
                    <h3 className="font-medium mb-3">Évaluations récentes</h3>
                    <div className="space-y-3">
                      {evaluations.slice(0, 5).map((evaluation) => (
                        <Link href={`/evaluations/${evaluation.id}`} key={evaluation.id}>
                          <div className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-[#0a2158]" />
                              <div>
                                <p className="font-medium">Agent évalué: {evaluation.agentId}</p>
                                <p className="text-sm text-muted-foreground">
                                  Date: {new Date(evaluation.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-[#0a2158] text-white px-2 py-1 rounded text-sm">
                                {evaluation.totalScore}/{evaluation.maxScore}
                              </div>
                              <div
                                className={`px-2 py-1 rounded text-sm ${
                                  evaluation.scorePercentage && evaluation.scorePercentage >= 70
                                    ? "bg-green-100 text-green-800"
                                    : evaluation.scorePercentage && evaluation.scorePercentage >= 40
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {evaluation.scorePercentage}%
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}

                      {evaluations.length > 5 && (
                        <div className="text-center mt-4">
                          <Button variant="outline" asChild>
                            <Link href={`/evaluations?evaluateurId=${evaluateur.id}`}>
                              Voir toutes les évaluations ({evaluations.length})
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    Aucune évaluation réalisée par cet évaluateur.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
