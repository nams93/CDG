"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createAgent } from "@/app/actions"
import { Loader2, UserPlus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function AgentForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [matricule, setMatricule] = useState("")
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [role, setRole] = useState<"agent" | "evaluateur">("agent")

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
        await createAgent({
          matricule,
          nom,
          prenom,
          role,
        })

        toast({
          title: "Agent créé",
          description: `L'agent ${nom} ${prenom} a été créé avec succès`,
        })

        // Réinitialiser le formulaire
        setMatricule("")
        setNom("")
        setPrenom("")
        setRole("agent")

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Ajouter un nouvel agent
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
                <UserPlus className="mr-2 h-4 w-4" /> Ajouter l'agent
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
