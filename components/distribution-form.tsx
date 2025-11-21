"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import type { DistributionEntry } from "@/app/page"

type DistributionFormProps = {
  totalPlants: number
  onComplete: (data: DistributionEntry[]) => void
  onBack: () => void
}

export function DistributionForm({ totalPlants, onComplete, onBack }: DistributionFormProps) {
  const [entries, setEntries] = useState<DistributionEntry[]>([
    {
      zone: "",
      arch: "",
      row: "",
      plantQuantity: 0,
      lot: "",
    },
  ])

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        zone: "",
        arch: "",
        row: "",
        plantQuantity: 0,
        lot: "",
      },
    ])
  }

  const removeEntry = (index: number) => {
    if (entries.length === 1) return
    setEntries(entries.filter((_, i) => i !== index))
  }

  const updateEntry = (index: number, field: keyof DistributionEntry, value: string | number) => {
    const updated = [...entries]
    updated[index] = { ...updated[index], [field]: value }
    setEntries(updated)
  }

  const getTotalDistributed = () => {
    return entries.reduce((sum, entry) => sum + entry.plantQuantity, 0)
  }

  const getLotTotals = () => {
    const totals: Record<string, number> = {}
    entries.forEach((entry) => {
      if (entry.lot) {
        totals[entry.lot] = (totals[entry.lot] || 0) + entry.plantQuantity
      }
    })
    return totals
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (entries.some((entry) => !entry.zone || !entry.arch || !entry.row || !entry.lot || entry.plantQuantity === 0)) {
      alert("Por favor complete todos los campos en todas las entradas")
      return
    }

    const totalDistributed = getTotalDistributed()

    // 👇 NUEVA LÓGICA
    if (totalDistributed === 0) {
      alert("Debes distribuir al menos una planta")
      return
    }

    if (totalDistributed > totalPlants) {
      alert(
        `La suma de plantas distribuidas (${totalDistributed}) es mayor que el total del pedido (${totalPlants})`,
      )
      return
    }
    // 👆 Permite cantidades menores o iguales al total

    onComplete(entries)
  }

  const totalDistributed = getTotalDistributed()
  const remaining = totalPlants - totalDistributed
  const lotTotals = getLotTotals()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Pedido</p>
            <p className="text-2xl font-bold text-primary">{totalPlants}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Distribuidas</p>
            <p className="text-2xl font-bold text-accent">{totalDistributed}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Restantes</p>
            <p className={`text-2xl font-bold ${remaining === 0 ? "text-primary" : "text-destructive"}`}>{remaining}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <Card key={index} className="p-4 border-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Distribución {index + 1}</h3>
              {entries.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEntry(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`zone-${index}`}>Zona *</Label>
                <Input
                  id={`zone-${index}`}
                  value={entry.zone}
                  onChange={(e) => updateEntry(index, "zone", e.target.value)}
                  placeholder="Ej: Norte, Sur..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`arch-${index}`}>Arco de Vivero *</Label>
                <Input
                  id={`arch-${index}`}
                  value={entry.arch}
                  onChange={(e) => updateEntry(index, "arch", e.target.value)}
                  placeholder="Ej: A1, B2..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`row-${index}`}>Fila *</Label>
                <Input
                  id={`row-${index}`}
                  value={entry.row}
                  onChange={(e) => updateEntry(index, "row", e.target.value)}
                  placeholder="Ej: 1, 2, 3..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`plantQty-${index}`}>Cantidad de Plantas *</Label>
                <Input
                  id={`plantQty-${index}`}
                  type="number"
                  min="0"
                  value={entry.plantQuantity || ""}
                  onChange={(e) => updateEntry(index, "plantQuantity", Number.parseInt(e.target.value) || 0)}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`lot-${index}`}>Lote *</Label>
                <Input
                  id={`lot-${index}`}
                  value={entry.lot}
                  onChange={(e) => updateEntry(index, "lot", e.target.value)}
                  placeholder="Ej: L-2024-001"
                  required
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button type="button" variant="outline" onClick={addEntry} className="w-full bg-transparent">
        <Plus className="mr-2 h-4 w-4" />
        Agregar Otra Distribución
      </Button>

      {Object.keys(lotTotals).length > 0 && (
        <Card className="p-4 bg-accent/10 border-accent/20">
          <h3 className="font-semibold mb-3">Total por Lote</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(lotTotals).map(([lot, total]) => (
              <div key={lot} className="bg-background rounded p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">{lot}</p>
                <p className="text-xl font-bold text-accent">{total}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          Volver
        </Button>
        <Button type="submit" className="flex-1">
          Finalizar Pedido
        </Button>
      </div>
    </form>
  )
}
