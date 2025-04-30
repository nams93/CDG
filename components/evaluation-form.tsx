"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AgentSelector } from "@/components/agent-selector"
import { type Agent, saveEvaluation } from "@/app/actions"
import { Loader2, Save, Printer, RotateCcw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface EvaluationFormProps {
  agents: Agent[]
  evaluateurs: Agent[]
}

export default function EvaluationForm({ agents, evaluateurs }: EvaluationFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [agentId, setAgentId] = useState("")
  const [evaluateurId, setEvaluateurId] = useState("")
  const [generalObservation, setGeneralObservation] = useState("")

  // État pour stocker les évaluations de compétences
  const [competences, setCompetences] = useState<Record<string, string>>({})

  const competencesList = [
    { id: "1", label: "Participation à la préparation de la mission : badges, clefs accès, codes" },
    { id: "2", label: "Attentif à la radio, anticipe les directions, vigilant pendant les environnements" },
    { id: "3", label: "Placements et déplacements" },
    { id: "4", label: "Respect des consignes de son CDE" },
    { id: "5", label: "Prise de contact" },
    { id: "6", label: "Comportement, attitude, esprit d'équipe" },
  ]

  // Calcul automatique du score total
  const totalScore = Object.values(competences).reduce((sum, value) => sum + Number.parseInt(value || "0"), 0)
  const maxPossibleScore = competencesList.length * 3
  const scorePercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0

  const handleCompetenceChange = (id: string, value: string) => {
    setCompetences((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!agentId || !evaluateurId) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner un agent et un évaluateur",
        variant: "destructive",
      })
      return
    }

    // Vérifier que toutes les compétences sont évaluées
    const competencesManquantes = competencesList.filter((comp) => !competences[comp.id])

    if (competencesManquantes.length > 0) {
      toast({
        title: "Évaluation incomplète",
        description: `Veuillez évaluer toutes les compétences (${competencesManquantes.length} manquantes)`,
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      try {
        const evaluation = await saveEvaluation({
          date,
          agentId,
          evaluateurId,
          competences,
          observation: generalObservation,
          status: "soumis",
          // Les statistiques seront calculées côté serveur
        })

        toast({
          title: "Évaluation enregistrée",
          description: "L'évaluation a été enregistrée avec succès",
        })

        router.push(`/evaluations/${evaluation.id}`)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'enregistrement",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <Card className="mb-6 border-0 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between bg-[#0a2158] text-white p-4">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded mr-4">
              <img src="/gpis-gie-logo.png" alt="GPIS GIE" className="h-10" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center">ÉVALUATION AGENT D'EXPLOITATION (ASM)</h1>
          <div className="w-[120px]"></div> {/* Spacer for alignment */}
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-4 grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="font-bold mb-2 block">
                DATE D'ÉVALUATION
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="flex items-center justify-end">
              <div className="flex flex-col items-end">
                <div className="bg-[#0a2158] text-white px-4 py-2 rounded-lg mb-2">
                  <span className="block text-sm">Score total</span>
                  <span className="text-2xl font-bold">
                    {totalScore}/{maxPossibleScore}
                  </span>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    scorePercentage >= 70
                      ? "bg-green-100 text-green-800"
                      : scorePercentage >= 40
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  <span className="block text-sm">Pourcentage</span>
                  <span className="text-2xl font-bold">{scorePercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="agent" className="font-bold mb-2 block">
              AGENT ÉVALUÉ
            </Label>
            <AgentSelector
              agents={agents.filter((a) => a.role === "agent")}
              value={agentId}
              onChange={setAgentId}
              placeholder="Sélectionner l'agent à évaluer..."
            />
          </div>

          <div>
            <Label htmlFor="evaluateur" className="font-bold mb-2 block">
              ÉVALUATEUR
            </Label>
            <AgentSelector
              agents={evaluateurs}
              value={evaluateurId}
              onChange={setEvaluateurId}
              placeholder="Sélectionner l'évaluateur..."
            />
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
                        <RadioGroup
                          value={competences[competence.id] || ""}
                          onValueChange={(value) => handleCompetenceChange(competence.id, value)}
                          className="flex justify-center"
                        >
                          <RadioGroupItem
                            value={value.toString()}
                            id={`competence-${competence.id}-${value}`}
                            className="h-5 w-5"
                          />
                        </RadioGroup>
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
          <Textarea
            value={generalObservation}
            onChange={(e) => setGeneralObservation(e.target.value)}
            className="min-h-[200px] w-full"
            placeholder="Saisissez vos observations ici..."
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-between gap-4">
        <Button type="button" variant="outline" className="flex-1" onClick={() => window.location.reload()}>
          <RotateCcw className="mr-2 h-4 w-4" /> Réinitialiser
        </Button>
        <Button type="submit" className="flex-1 bg-[#0a2158] hover:bg-[#0a2158]/90" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Enregistrer
            </>
          )}
        </Button>
        <Button type="button" variant="secondary" className="flex-1" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" /> Imprimer
        </Button>
      </div>
    </form>
  )
}
