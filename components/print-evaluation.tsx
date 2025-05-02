"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import type { Evaluation } from "@/app/actions"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { toast } from "@/components/ui/use-toast"

interface PrintEvaluationProps {
  evaluation?: Evaluation
  agent?: { nom: string; prenom: string; matricule: string }
  evaluateur?: { nom: string; prenom: string; matricule: string }
  printRef: React.RefObject<HTMLDivElement>
}

export function PrintEvaluation({ printRef }: PrintEvaluationProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  const handleDownloadPDF = async () => {
    if (!printRef.current) return

    toast({
      title: "Génération du PDF en cours",
      description: "Veuillez patienter pendant la génération du document...",
    })

    try {
      const element = printRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")

      // Déterminer l'orientation en fonction de la largeur et de la hauteur
      const orientation = canvas.width > canvas.height ? "l" : "p"

      // Créer un nouveau document PDF avec la bonne orientation
      const pdf = new jsPDF({
        orientation: orientation,
        unit: "mm",
      })

      // Calculer les dimensions pour ajuster l'image au format PDF
      const imgWidth = orientation === "p" ? 210 : 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Ajouter l'image au PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      // Télécharger le PDF
      const date = new Date().toISOString().split("T")[0]
      pdf.save(`evaluation-gpis-${date}.pdf`)

      toast({
        title: "PDF généré avec succès",
        description: "Le document a été téléchargé.",
      })
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handlePrint} className="print:hidden">
        <Printer className="mr-2 h-4 w-4" /> Imprimer
      </Button>
      <Button variant="secondary" onClick={handleDownloadPDF} className="print:hidden">
        <Printer className="mr-2 h-4 w-4" /> Télécharger PDF
      </Button>
    </div>
  )
}
