"use server"

import { revalidatePath } from "next/cache"

// Types pour notre base de données
export type Agent = {
  id: string
  matricule: string
  nom: string
  prenom: string
  role: "evaluateur" | "agent"
}

export type Evaluation = {
  id: string
  date: string
  agentId: string
  evaluateurId: string
  competences: Record<string, string>
  observation: string
  status: "brouillon" | "soumis" | "validé"
  createdAt: string
  updatedAt: string
  // Ajout des champs pour les statistiques
  totalScore?: number
  maxScore?: number
  scorePercentage?: number
}

// Simulation d'une base de données persistante (en production, utilisez une vraie base de données)
const agents: Agent[] = []
const evaluations: Evaluation[] = []

// Actions serveur
export async function getAgents(role?: "evaluateur" | "agent") {
  // Simuler un délai de réseau
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (role) {
    return agents.filter((agent) => agent.role === role)
  }
  return agents
}

export async function getAgentById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return agents.find((agent) => agent.id === id)
}

export async function createAgent(agent: Omit<Agent, "id">) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newAgent: Agent = {
    ...agent,
    id: Math.random().toString(36).substring(2, 9),
  }

  agents.push(newAgent)
  revalidatePath("/evaluations/new")
  revalidatePath("/evaluations")
  revalidatePath("/statistiques")

  return newAgent
}

export async function getEvaluations(agentId?: string, evaluateurId?: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  let filteredEvaluations = [...evaluations]

  if (agentId) {
    filteredEvaluations = filteredEvaluations.filter((evaluation) => evaluation.agentId === agentId)
  }

  if (evaluateurId) {
    filteredEvaluations = filteredEvaluations.filter((evaluation) => evaluation.evaluateurId === evaluateurId)
  }

  // Trier par date décroissante (plus récent en premier)
  return filteredEvaluations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getEvaluationById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return evaluations.find((evaluation) => evaluation.id === id)
}

export async function getEvaluationsByEvaluateur() {
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Récupérer tous les évaluateurs
  const evaluateurs = agents.filter((agent) => agent.role === "evaluateur")

  // Créer un objet avec les évaluations regroupées par évaluateur
  const result = await Promise.all(
    evaluateurs.map(async (evaluateur) => {
      const evaluationsParEvaluateur = await getEvaluations(undefined, evaluateur.id)

      // Calculer les statistiques pour cet évaluateur
      const totalEvaluations = evaluationsParEvaluateur.length
      const scoreTotal = evaluationsParEvaluateur.reduce((sum, evaluation) => sum + (evaluation.totalScore || 0), 0)
      const scoreMoyen = totalEvaluations > 0 ? Math.round(scoreTotal / totalEvaluations) : 0
      const pourcentageMoyen =
        evaluationsParEvaluateur.reduce((sum, evaluation) => sum + (evaluation.scorePercentage || 0), 0) /
        (totalEvaluations || 1)

      return {
        evaluateur,
        evaluations: evaluationsParEvaluateur,
        stats: {
          totalEvaluations,
          scoreMoyen,
          pourcentageMoyen: Math.round(pourcentageMoyen),
        },
      }
    }),
  )

  return result
}

export async function saveEvaluation(evaluation: Omit<Evaluation, "id" | "createdAt" | "updatedAt">) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Calculer les statistiques
  const competencesValues = Object.values(evaluation.competences).map((v) => Number.parseInt(v || "0"))
  const totalScore = competencesValues.reduce((sum, value) => sum + value, 0)
  const maxScore = competencesValues.length * 3
  const scorePercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

  const now = new Date().toISOString()
  const newEvaluation: Evaluation = {
    ...evaluation,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: now,
    updatedAt: now,
    totalScore,
    maxScore,
    scorePercentage,
  }

  evaluations.push(newEvaluation)
  revalidatePath("/evaluations")
  revalidatePath("/statistiques")
  return newEvaluation
}

export async function updateEvaluation(id: string, data: Partial<Evaluation>) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const index = evaluations.findIndex((evaluation) => evaluation.id === id)
  if (index !== -1) {
    // Recalculer les statistiques si les compétences ont été modifiées
    let statsUpdate = {}
    if (data.competences) {
      const competencesValues = Object.values(data.competences).map((v) => Number.parseInt(v || "0"))
      const totalScore = competencesValues.reduce((sum, value) => sum + value, 0)
      const maxScore = competencesValues.length * 3
      const scorePercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

      statsUpdate = {
        totalScore,
        maxScore,
        scorePercentage,
      }
    }

    evaluations[index] = {
      ...evaluations[index],
      ...data,
      ...statsUpdate,
      updatedAt: new Date().toISOString(),
    }
    revalidatePath("/evaluations")
    revalidatePath(`/evaluations/${id}`)
    revalidatePath("/statistiques")
    return evaluations[index]
  }
  return null
}
