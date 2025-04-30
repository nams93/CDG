"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function EvaluationForm() {
  const [date, setDate] = useState("")
  const [evaluatedName, setEvaluatedName] = useState("")
  const [evaluatedId, setEvaluatedId] = useState("")
  const [evaluatorName, setEvaluatorName] = useState("")
  const [evaluatorFirstName, setEvaluatorFirstName] = useState("")
  const [evaluatorId, setEvaluatorId] = useState("")
  const [generalObservation, setGeneralObservation] = useState("")

  // État pour stocker les évaluations de compétences
  const [competences, setCompetences] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  })

  const handleCompetenceChange = (id: string, value: string) => {
    setCompetences((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Formulaire soumis", {
      date,
      evaluatedName,
      evaluatedId,
      evaluatorName,
      evaluatorFirstName,
      evaluatorId,
      competences,
      generalObservation,
    })
    // Ici vous pourriez ajouter la logique pour enregistrer ou imprimer le formulaire
  }

  const competencesList = [
    { id: 1, label: "Participation à la préparation de la mission : badges, clefs accès, codes" },
    { id: 2, label: "Attentif à la radio, anticipe les directions, vigilant pendant les environnements" },
    { id: 3, label: "Placements et déplacements" },
    { id: 4, label: "Respect des consignes de son CDE" },
    { id: 5, label: "Prise de contact" },
    { id: 6, label: "Comportement, attitude, esprit d'équipe" },
  ]

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
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
        <CardContent className="p-0">
          <div className="grid grid-cols-1 gap-0">
            <div className="bg-[#d6e4f2] p-4">
              <div className="flex items-center mb-2">
                <Label htmlFor="date" className="font-bold w-32">
                  DATE :
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="bg-[#d6e4f2] p-4">
              <div className="flex items-center mb-2">
                <Label htmlFor="evaluatedName" className="font-bold w-32">
                  NOM / PRÉNOM DE L'AGENT ÉVALUÉ :
                </Label>
                <Input
                  id="evaluatedName"
                  value={evaluatedName}
                  onChange={(e) => setEvaluatedName(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="bg-[#d6e4f2] p-4">
              <div className="flex items-center mb-2">
                <Label htmlFor="evaluatedId" className="font-bold w-32">
                  MATRICULE :
                </Label>
                <Input
                  id="evaluatedId"
                  value={evaluatedId}
                  onChange={(e) => setEvaluatedId(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="bg-[#ffc266] p-4">
              <div className="flex items-center mb-2">
                <Label htmlFor="evaluatorName" className="font-bold w-32">
                  NOM DE L'AGENT ÉVALUATEUR (N+1) :
                </Label>
                <Input
                  id="evaluatorName"
                  value={evaluatorName}
                  onChange={(e) => setEvaluatorName(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="bg-[#ffc266] p-4">
              <div className="flex items-center mb-2">
                <Label htmlFor="evaluatorFirstName" className="font-bold w-32">
                  PRÉNOM :
                </Label>
                <Input
                  id="evaluatorFirstName"
                  value={evaluatorFirstName}
                  onChange={(e) => setEvaluatorFirstName(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="bg-[#ffc266] p-4">
              <div className="flex items-center mb-2">
                <Label htmlFor="evaluatorId" className="font-bold w-32">
                  MATRICULE :
                </Label>
                <Input
                  id="evaluatorId"
                  value={evaluatorId}
                  onChange={(e) => setEvaluatorId(e.target.value)}
                  className="bg-white"
                />
              </div>
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
                        <RadioGroup
                          value={competences[competence.id as keyof typeof competences]}
                          onValueChange={(value) => handleCompetenceChange(competence.id.toString(), value)}
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

      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline" className="w-full">
          Réinitialiser
        </Button>
        <Button type="submit" className="w-full bg-[#0a2158] hover:bg-[#0a2158]/90">
          Enregistrer l'évaluation
        </Button>
        <Button type="button" variant="secondary" className="w-full">
          Imprimer
        </Button>
      </div>
    </form>
  )
}
