import { getAgents } from "@/app/actions"
import EvaluationForm from "@/components/evaluation-form"
import AgentForm from "@/components/agent-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function NewEvaluationPage() {
  const agents = await getAgents()
  const evaluateurs = await getAgents("evaluateur")
  const agentsCount = agents.filter((a) => a.role === "agent").length
  const evaluateursCount = evaluateurs.length

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Nouvelle évaluation</h1>

      {agentsCount === 0 || evaluateursCount === 0 ? (
        <div className="mb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-amber-800">
              {agentsCount === 0 && evaluateursCount === 0
                ? "Aucun agent ni évaluateur n'est enregistré dans le système. Veuillez en ajouter avant de créer une évaluation."
                : agentsCount === 0
                  ? "Aucun agent n'est enregistré dans le système. Veuillez en ajouter avant de créer une évaluation."
                  : "Aucun évaluateur n'est enregistré dans le système. Veuillez en ajouter avant de créer une évaluation."}
            </p>
          </div>

          <AgentForm />
        </div>
      ) : null}

      <Tabs defaultValue={agentsCount === 0 || evaluateursCount === 0 ? "ajouter-agent" : "nouvelle-evaluation"}>
        <TabsList className="mb-6">
          <TabsTrigger value="nouvelle-evaluation">Nouvelle évaluation</TabsTrigger>
          <TabsTrigger value="ajouter-agent">Ajouter un agent</TabsTrigger>
        </TabsList>

        <TabsContent value="nouvelle-evaluation">
          {agentsCount > 0 && evaluateursCount > 0 ? (
            <EvaluationForm agents={agents} evaluateurs={evaluateurs} />
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800">
                Veuillez d'abord ajouter au moins un agent et un évaluateur avant de créer une évaluation.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ajouter-agent">
          <AgentForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
