"use client"

import { useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"
import { PrintEvaluation } from "@/components/print-evaluation"
import Image from "next/image"
import type { Evaluation } from "@/app/actions"

interface EvaluationDetailProps {
  evaluation: Evaluation
  agent: { nom: string; prenom: string; matricule: string } | null
  evaluateur: { nom: string; prenom: string; matricule: string } | null
  id: string
}

export default function EvaluationDetail({ evaluation, agent, evaluateur, id }: EvaluationDetailProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const competencesList = [
    { id: "1", label: "Participation à la préparation de la mission : badges, clefs accès, codes" },
    { id: "2", label: "Attentif à la radio, anticipe les directions, vigilant pendant les environnements" },
    { id: "3", label: "Placements et déplacements" },
    { id: "4", label: "Respect des consignes de son CDE" },
    { id: "5", label: "Prise de contact" },
    { id: "6", label: "Comportement, attitude, esprit d'équipe" },
  ]

  // Utiliser les statistiques stockées ou les calculer si elles ne sont pas disponibles
  const totalScore =
    evaluation.totalScore ||
    Object.values(evaluation.competences).reduce((sum, value) => sum + Number.parseInt(value || "0"), 0)
  const maxScore = evaluation.maxScore || competencesList.length * 3
  const scorePercentage = evaluation.scorePercentage || (maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0)

  // Déterminer la classe de couleur en fonction du pourcentage
  const getScoreColorClass = (percentage: number) => {
    if (percentage >= 70) return "bg-green-100 text-green-800 score-percentage-high"
    if (percentage >= 40) return "bg-yellow-100 text-yellow-800 score-percentage-medium"
    return "bg-red-100 text-red-800 score-percentage-low"
  }

  return (
    <div className="container py-6 print-container">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/evaluations">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Détail de l'évaluation</h1>
        </div>
        <div className="flex gap-2">
          <PrintEvaluation printRef={printRef} />
          <Link href={`/evaluations/${id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </Link>
        </div>
      </div>

      <div ref={printRef}>
        <Card className="mb-6 border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between bg-[#0a2158] text-white p-4">
            <div className="flex items-center">
              <div className="bg-white p-2 rounded mr-4">
                <Image src="/gpis-gie-logo.png" alt="GPIS GIE" width={100} height={40} />
              </div>
            </div>
            <h1 className="text-xl font-bold text-center">ÉVALUATION AGENT D'EXPLOITATION (ASM)</h1>
            <div className="w-[120px]"></div>
          </CardHeader>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-4 grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-bold">Date d'évaluation</p>
                <p>
                  {new Date(evaluation.date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center justify-end">
                <div className="flex flex-col items-end">
                  <div className="bg-[#0a2158] text-white px-4 py-2 rounded-lg mb-2 score-total">
                    <span className="block text-sm">Score total</span>
                    <span className="text-2xl font-bold">
                      {totalScore}/{maxScore}
                    </span>
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${getScoreColorClass(scorePercentage)}`}>
                    <span className="block text-sm">Pourcentage</span>
                    <span className="text-2xl font-bold">{scorePercentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-bold">Agent évalué</p>
                <p>{agent ? `${agent.nom} ${agent.prenom} (${agent.matricule})` : "Agent inconnu"}</p>
              </div>

              <div>
                <p className="font-bold">Évaluateur</p>
                <p>
                  {evaluateur
                    ? `${evaluateur.nom} ${evaluateur.prenom} (${evaluateur.matricule})`
                    : "Évaluateur inconnu"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="bg-[#0a2158] text-white p-4">
            <h2 className="text-lg font-bold text-center">ÉVALUATION DES COMPÉTENCES</h2>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 w-8 text-center">#</th>
                    <th className="border p-2 text-left">Compétence</th>
                    <th className="border p-2 w-24 bg-[#d6e4f2] text-center">
                      <div>Non maîtrisé</div>
                      <div className="font-bold">0</div>
                    </th>
                    <th className="border p-2 w-24 bg-[#d6e4f2] text-center">
                      <div>En cours d'acquisition</div>
                      <div className="font-bold">1</div>
                    </th>
                    <th className="border p-2 w-24 bg-[#d6e4f2] text-center">
                      <div>Partiellement acquis</div>
                      <div className="font-bold">2</div>
                    </th>
                    <th className="border p-2 w-24 bg-[#d6e4f2] text-center">
                      <div>Maîtrisé</div>
                      <div className="font-bold">3</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {competencesList.map((competence) => (
                    <tr key={competence.id}>
                      <td className="border p-2 text-center">{competence.id}</td>
                      <td className="border p-2">{competence.label}</td>
                      {[0, 1, 2, 3].map((value) => (
                        <td key={value} className="border p-2 text-center">
                          {evaluation.competences[competence.id] === value.toString() && (
                            <div className="h-4 w-4 rounded-full bg-[#0a2158] mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="bg-[#0a2158] text-white p-4">
            <h2 className="text-lg font-bold text-center">OBSERVATION GÉNÉRALE</h2>
          </CardHeader>
          <CardContent className="p-4">
            <div className="min-h-[200px] border p-4 rounded-md whitespace-pre-wrap">
              {evaluation.observation || "Aucune observation"}
            </div>
          </CardContent>
        </Card>

        <div className="hidden print:block mt-8 pt-8 border-t">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-bold mb-2">Signature de l'agent évalué :</p>
              <div className="h-20 border rounded-md"></div>
            </div>
            <div>
              <p className="font-bold mb-2">Signature de l'évaluateur :</p>
              <div className="h-20 border rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
