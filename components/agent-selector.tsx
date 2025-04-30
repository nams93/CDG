"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Agent } from "@/app/actions"

interface AgentSelectorProps {
  agents: Agent[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function AgentSelector({
  agents,
  value,
  onChange,
  placeholder = "Sélectionner un agent...",
}: AgentSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  useEffect(() => {
    if (value) {
      const agent = agents.find((agent) => agent.id === value)
      setSelectedAgent(agent || null)
    } else {
      setSelectedAgent(null)
    }
  }, [value, agents])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedAgent ? `${selectedAgent.nom} ${selectedAgent.prenom} (${selectedAgent.matricule})` : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un agent..." />
          <CommandList>
            <CommandEmpty>Aucun agent trouvé.</CommandEmpty>
            <CommandGroup>
              {agents.map((agent) => (
                <CommandItem
                  key={agent.id}
                  value={`${agent.nom} ${agent.prenom} ${agent.matricule}`}
                  onSelect={() => {
                    onChange(agent.id)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === agent.id ? "opacity-100" : "opacity-0")} />
                  {agent.nom} {agent.prenom} ({agent.matricule})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
