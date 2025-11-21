"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import type { OrderData } from "@/app/page"

type OrderFormProps = {
  onComplete: (data: OrderData) => void
}

type BoxEntry = {
  boxNumber: string
  variety: string
  plantQuantity: number
}

export function OrderForm({ onComplete }: OrderFormProps) {
  const [orderNumber, setOrderNumber] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [description, setDescription] = useState("")
  const [boxes, setBoxes] = useState<BoxEntry[]>([])
  const [boxQuantity, setBoxQuantity] = useState<number>(0)

  const handleBoxQuantityChange = (value: string) => {
    const qty = Number.parseInt(value) || 0
    setBoxQuantity(qty)

    if (qty > boxes.length) {
      const newBoxes = [...boxes]
      for (let i = boxes.length; i < qty; i++) {
        newBoxes.push({ boxNumber: "", variety: "", plantQuantity: 0 })
      }
      setBoxes(newBoxes)
    } else {
      setBoxes(boxes.slice(0, qty))
    }
  }

  const updateBox = (index: number, field: keyof BoxEntry, value: string | number) => {
    const updated = [...boxes]
    updated[index] = { ...updated[index], [field]: value }
    setBoxes(updated)
  }

  const removeBox = (index: number) => {
    const updated = boxes.filter((_, i) => i !== index)
    setBoxes(updated)
    setBoxQuantity(updated.length)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderNumber || !date || !description || boxQuantity === 0) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    if (boxes.some((box) => !box.boxNumber.trim() || !box.variety.trim() || box.plantQuantity <= 0)) {
      alert("Por favor complete todos los datos de cada box (número, variedad y cantidad de plantas)")
      return
    }

    const totalPlants = boxes.reduce((sum, box) => sum + box.plantQuantity, 0)

    onComplete({
      orderNumber,
      date,
      description,
      boxes,
      totalBoxes: boxQuantity,
      totalPlants,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="orderNumber">Número de Orden *</Label>
          <Input
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Ej: ORD-2024-001"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Fecha del Pedido *</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción del Pedido *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describa los detalles del pedido..."
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="boxQuantity">Cantidad de Box *</Label>
        <Input
          id="boxQuantity"
          type="number"
          min="0"
          value={boxQuantity || ""}
          onChange={(e) => handleBoxQuantityChange(e.target.value)}
          placeholder="0"
          required
        />
      </div>

      {boxQuantity > 0 && (
        <Card className="p-4 bg-muted/50">
          <Label className="text-base mb-3 block">Detalles de Cada Box (Número, Variedad y Cantidad)</Label>
          <div className="space-y-4">
            {boxes.map((box, index) => (
              <Card key={index} className="p-4 bg-background border-2">
                <div className="flex items-start justify-between mb-3">
                  <Label className="text-sm font-semibold">Box {index + 1}</Label>
                  {boxes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBox(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`box-number-${index}`} className="text-xs text-muted-foreground">
                      Número de Box *
                    </Label>
                    <Input
                      id={`box-number-${index}`}
                      value={box.boxNumber}
                      onChange={(e) => updateBox(index, "boxNumber", e.target.value)}
                      placeholder="Ej: B001"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`box-variety-${index}`} className="text-xs text-muted-foreground">
                      Variedad *
                    </Label>
                    <Input
                      id={`box-variety-${index}`}
                      value={box.variety}
                      onChange={(e) => updateBox(index, "variety", e.target.value)}
                      placeholder="Ej: Kerman, Peters"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`box-plants-${index}`} className="text-xs text-muted-foreground">
                      Cantidad Plantas *
                    </Label>
                    <Input
                      id={`box-plants-${index}`}
                      type="number"
                      min="1"
                      value={box.plantQuantity || ""}
                      onChange={(e) => updateBox(index, "plantQuantity", Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm font-semibold">
              Total de Plantas: {boxes.reduce((sum, box) => sum + box.plantQuantity, 0)}
            </p>
          </div>
        </Card>
      )}

      <Button type="submit" className="w-full" size="lg">
        Continuar a Fase 2
      </Button>
    </form>
  )
}
