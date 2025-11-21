"use client"

import { useState, useRef } from "react"
import { LoginForm } from "@/components/login-form"
import { OrderForm } from "@/components/order-form"
import { DistributionForm } from "@/components/distribution-form"
import { OrderSummary } from "@/components/order-summary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer, Download, LogOut } from "lucide-react"

export type OrderData = {
  orderNumber: string
  date: string
  description: string
  boxes: Array<{
    boxNumber: string
    variety: string
    plantQuantity: number
  }>
  totalBoxes: number
  totalPlants: number
}

export type DistributionEntry = {
  zone: string
  arch: string
  row: string
  plantQuantity: number
  lot: string
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [step, setStep] = useState<"order" | "distribution" | "summary">("order")
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [distributions, setDistributions] = useState<DistributionEntry[]>([])

  const printRef = useRef<HTMLDivElement>(null)

  // ----------------------------------------------------------------------
  // IMPRIMIR → usa el formato original de la hoja
  // ----------------------------------------------------------------------
  const handlePrint = () => {
    if (!printRef.current) return

    const printContent = printRef.current.innerHTML
    const printWindow = window.open("", "", "width=1200,height=800")

    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pedido - ${orderData?.orderNumber || ""}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              padding: 20mm;
              background: white;
              color: black;
            }
            @page {
              size: A4;
              margin: 10mm;
            }
            @media print {
              body { 
                padding: 0;
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
            .logo {
              max-width: 280px;
              height: auto;
              margin-bottom: 10px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 10px 0; 
              page-break-inside: auto;
            }
            tr { page-break-inside: avoid; page-break-after: auto; }
            th, td { 
              border: 1px solid #000; 
              padding: 8px; 
              text-align: left; 
              font-size: 11pt;
            }
            th { 
              background-color: #e5e7eb !important; 
              font-weight: 700; 
            }
            .border-4 { border: 4px solid #000; }
            .border-3 { border: 3px solid #000; }
            .border-2 { border: 2px solid #000; }
            .border { border: 1px solid #000; }
            .border-black { border-color: #000; }
            .p-2 { padding: 8px; }
            .p-3 { padding: 12px; }
            .p-4 { padding: 16px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-3 { margin-bottom: 12px; }
            .mb-4 { margin-bottom: 16px; }
            .mt-2 { margin-top: 8px; }
            .text-lg { font-size: 1.125rem; }
            .text-xl { font-size: 1.25rem; }
            .text-2xl { font-size: 1.5rem; }
            .text-xs { font-size: 0.75rem; }
            .text-sm { font-size: 0.875rem; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .flex { display: flex; }
            .items-start { align-items: flex-start; }
            .items-center { align-items: center; }
            .justify-between { justify-content: space-between; }
            .justify-center { justify-content: center; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .gap-3 { gap: 12px; }
            .gap-4 { gap: 16px; }
            .space-y-2 > * + * { margin-top: 8px; }
            .space-y-6 > * + * { margin-top: 24px; }
            .bg-gray-50 { background-color: #f9fafb !important; }
            .bg-gray-100 { background-color: #f3f4f6 !important; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 300)
  }

  // ----------------------------------------------------------------------
  // EXPORTAR PDF → abre la misma ventana para poder "Guardar como PDF"
  // ----------------------------------------------------------------------
  const handleExportPDF = () => {
    handlePrint()
  }

  const handleOrderComplete = (data: OrderData) => {
    setOrderData(data)
    setStep("distribution")
  }

  const handleDistributionComplete = (data: DistributionEntry[]) => {
    setDistributions(data)
    setStep("summary")
  }

  const handleReset = () => {
    setStep("order")
    setOrderData(null)
    setDistributions([])
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsAuthenticated(false)
              handleReset()
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">ACEMISPAIN</h1>
          <p className="text-muted-foreground">Sistema de Gestión de Pedidos - Plantas de Pistacho</p>
        </div>

        {step === "order" && (
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl">Fase 1: Datos del Pedido</CardTitle>
              <CardDescription>Complete la información básica del pedido</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <OrderForm onComplete={handleOrderComplete} />
            </CardContent>
          </Card>
        )}

        {step === "distribution" && orderData && (
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl">Fase 2: Distribución y Lotes</CardTitle>
              <CardDescription>Configure la distribución de {orderData.totalPlants} plantas</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <DistributionForm
                totalPlants={orderData.totalPlants}
                onComplete={handleDistributionComplete}
                onBack={() => setStep("order")}
              />
            </CardContent>
          </Card>
        )}

        {step === "summary" && orderData && (
          <div className="space-y-4">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-2xl">Resumen del Pedido</CardTitle>
                <CardDescription>Pedido completado - Listo para imprimir</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex gap-3 mb-6">
                  <Button onClick={handlePrint} className="flex-1">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir Pedido
                  </Button>
                  <Button onClick={handleExportPDF} variant="outline" className="flex-1 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar PDF
                  </Button>
                </div>

                {/* Versión visible original (la que ves en pantalla) */}
                <div ref={printRef}>
                  <OrderSummary orderData={orderData} distributions={distributions} />
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button onClick={handleReset} variant="secondary" className="w-full">
                    Crear Nuevo Pedido
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
