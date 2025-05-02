import { getEvaluationById, getAgentById } from "@/app/actions"
import { notFound } from "next/navigation"
import EvaluationDetail from "@/components/evaluation-detail"

export default async function EvaluationDetailPage({ params }: { params: { id: string } }) {
  const evaluation = await getEvaluationById(params.id)

  if (!evaluation) {
    notFound()
  }

  const agent = await getAgentById(evaluation.agentId)
  const evaluateur = await getAgentById(evaluation.evaluateurId)

  return <EvaluationDetail evaluation={evaluation} agent={agent} evaluateur={evaluateur} id={params.id} />
}
