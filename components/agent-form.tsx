"use client"

import type React from "react"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createAgent, getAgents } from "@/app/actions"
import { Loader2, UserPlus, ClipboardList } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function AgentForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isLoadingAgents, setIsLoadingAgents] = useState(false)
  const [hasAgent, setHasAgent] = useState(false)
  const [hasEvaluateur, setHasEvaluateur] = useState(false)
  const [lastAddedAgent, setLastAddedAgent] = useState<string | null>(null)
  const [lastAddedEvaluateur, setLastAddedEvaluateur] = useState<string | null>(null)

  const [matricule, setMatricule] = useState("")
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [role, setRole] = useState<"agent" | "evaluateur">("agent")

  // Vérifier si nous avons au moins un agent et un évaluateur
  useEffect(() => {
    const checkAgents = async () => {
      setIsLoadingAgents(true)
      try {
        const allAgents = await getAgents()
        setHasAgent(allAgents.some((a) => a.role === "agent"))
        setHasEvaluateur(allAgents.some((a) => a.role === "evaluateur"))
      } catch (error) {
        console.error("Erreur lors de la vérification des agents:", error)
      } finally {
        setIsLoadingAgents(false)
      }
    }

    checkAgents()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!matricule || !nom || !prenom) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      try {
        const newAgent = await createAgent({
          matricule,
          nom,
          prenom,
          role,
        })

        toast({
          title: "Agent créé",
          description: `${role === "agent" ? "L'agent" : "L'évaluateur"} ${nom} ${prenom} a été créé avec succès`,
        })

        // Mettre à jour l'état local
        if (role === "agent") {
          setHasAgent(true)
          setLastAddedAgent(newAgent.id)
        } else {
          setHasEvaluateur(true)
          setLastAddedEvaluateur(newAgent.id)
        }

        // Réinitialiser le formulaire
        setMatricule("")
        setNom("")
        setPrenom("")

        // Changer automatiquement le rôle si nécessaire
        if (role === "agent" && !hasEvaluateur) {
          setRole("evaluateur")
        } else if (role === "evaluateur" && !hasAgent) {
          setRole("agent")
        }

        // Rafraîchir la page
        router.refresh()
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création de l'agent",
          variant: "destructive",
        })
      }
    })
  }

  const startEvaluation = () => {
    if (lastAddedAgent && lastAddedEvaluateur) {
      router.push(`/evaluations/new?agentId=${lastAddedAgent}&evaluateurId=${lastAddedEvaluateur}`)
    } else {
      router.push("/evaluations/new")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Ajouter un {role === "agent" ? "agent" : "évaluateur"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="matricule" className="mb-2 block">
                Matricule
              </Label>
              <Input
                id="matricule"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                placeholder="Ex: A001"
                required
              />
            </div>

            <div>
              <Label htmlFor="role" className="mb-2 block">
                Rôle
              </Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as "agent" | "evaluateur")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="agent" id="role-agent" />
                  <Label htmlFor="role-agent">Agent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="evaluateur" id="role-evaluateur" />
                  <Label htmlFor="role-evaluateur">Évaluateur</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom" className="mb-2 block">
                Nom
              </Label>
              <Input
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value.toUpperCase())}
                placeholder="Nom de famille"
                required
              />
            </div>

            <div>
              <Label htmlFor="prenom" className="mb-2 block">
                Prénom
              </Label>
              <Input
                id="prenom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création en cours...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" /> Ajouter {role === "agent" ? "l'agent" : "l'évaluateur"}
              </>
            )}
          </Button>
        </form>
      </CardContent>

      {hasAgent && hasEvaluateur && (
        <CardFooter className="border-t pt-4">
          <Button onClick={startEvaluation} className="w-full bg-[#0a2158] hover:bg-[#0a2158]/90">
            <ClipboardList className="mr-2 h-4 w-4" />
            Commencer une évaluation
          </Button>
        </CardFooter>
      )}

      {!hasAgent && !hasEvaluateur && (
        <CardFooter className="border-t pt-4">
          <div className="w-full text-center text-sm text-muted-foreground">
            Ajoutez au moins un agent et un évaluateur pour commencer une évaluation.
          </div>
        </CardFooter>
      )}

      {((hasAgent && !hasEvaluateur) || (!hasAgent && hasEvaluateur)) && (
        <CardFooter className="border-t pt-4">
          <div className="w-full text-center text-sm text-muted-foreground">
            {hasAgent && !hasEvaluateur
              ? "Vous avez ajouté un agent. Ajoutez maintenant un évaluateur."
              : "Vous avez ajouté un évaluateur. Ajoutez maintenant un agent."}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
