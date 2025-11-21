"use client"
import type { OrderData, DistributionEntry } from "@/app/page"
import Image from "next/image"

type OrderSummaryProps = {
  orderData: OrderData
  distributions: DistributionEntry[]
}

export function OrderSummary({ orderData, distributions }: OrderSummaryProps) {
  const getLotTotals = () => {
    const totals: Record<string, number> = {}
    distributions.forEach((entry) => {
      totals[entry.lot] = (totals[entry.lot] || 0) + entry.plantQuantity
    })
    return totals
  }

  const lotTotals = getLotTotals()

  const totalDistributed = distributions.reduce((sum, dist) => sum + dist.plantQuantity, 0)
  const remainingPlants = orderData.totalPlants - totalDistributed

  return (
    <div className="space-y-6 bg-white text-black p-8 print:p-0">
      {/* Header */}
      <div className="border-4 border-black p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Image
              src="/acemispain-logo.png"
              alt="ACEMISPAIN Nursery"
              width={180}
              height={90}
              className="object-contain"
            />
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">FORMATO</p>
            <p className="text-xl font-bold">PREPARACIÓN DE PEDIDO</p>
            <p className="text-xs mt-2">Código: P-11-F-01</p>
            <p className="text-xs">Revisión: 0</p>
            <p className="text-xs">Fecha: {new Date().toLocaleDateString("es-ES")}</p>
            <p className="text-xs">Página 1 de 1</p>
          </div>
        </div>

        <div className="border-2 border-black p-3 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold">ORDEN DE COMPRA:</p>
              <p className="text-lg">{orderData.orderNumber}</p>
            </div>
            <div>
              <p className="font-bold">FECHA PREVISTA DE ENTREGA:</p>
              <p className="text-sm">________________</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="font-bold">FECHA DE PEDIDO:</p>
              <p className="text-lg">{new Date(orderData.date).toLocaleDateString("es-ES")}</p>
            </div>
            <div>
              <p className="font-bold">FECHA DE RETIRADA:</p>
              <p className="text-sm">________________</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="font-bold mb-2">Descripción Pedido:</p>
          <p className="border border-black p-2 min-h-[40px]">{orderData.description}</p>
        </div>

        <div className="border-2 border-black">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black bg-gray-100">
                <th className="border-r border-black p-2 text-left">Nº Box</th>
                <th className="border-r border-black p-2 text-left">PRODUCTO (Variedad)</th>
                <th className="p-2 text-center">UNIDADES/PALETS</th>
              </tr>
            </thead>
            <tbody>
              {orderData.boxes.map((box, index) => (
                <tr key={index} className={index < orderData.boxes.length - 1 ? "border-b border-black" : ""}>
                  <td className="border-r border-black p-2 font-semibold">{box.boxNumber}</td>
                  <td className="border-r border-black p-2">{box.variety}</td>
                  <td className="p-2 text-center font-bold">{box.plantQuantity}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-black bg-gray-100">
                <td className="border-r border-black p-2 font-bold" colSpan={2}>
                  TOTAL ({orderData.totalBoxes} boxes)
                </td>
                <td className="p-2 text-center font-bold text-lg">{orderData.totalPlants}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Distribution Section */}
        <div className="border-3 border-black p-4 mt-4">
          <h2 className="text-xl font-bold mb-4">DISTRIBUCIÓN Y LOTES</h2>

          <table className="w-full border-2 border-black mb-4">
            <thead>
              <tr className="border-b-2 border-black bg-gray-100">
                <th className="border-r border-black p-2 text-left">Zona</th>
                <th className="border-r border-black p-2 text-left">Arco Vivero</th>
                <th className="border-r border-black p-2 text-left">Fila</th>
                <th className="border-r border-black p-2 text-center">Cant. Plantas</th>
                <th className="p-2 text-left">Lote</th>
              </tr>
            </thead>
            <tbody>
              {distributions.map((dist, index) => (
                <tr key={index} className="border-b border-black">
                  <td className="border-r border-black p-2">{dist.zone}</td>
                  <td className="border-r border-black p-2">{dist.arch}</td>
                  <td className="border-r border-black p-2">{dist.row}</td>
                  <td className="border-r border-black p-2 text-center font-bold">{dist.plantQuantity}</td>
                  <td className="p-2">{dist.lot}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Lot Totals */}
          <div className="border-2 border-black p-3 bg-gray-50">
            <p className="font-bold mb-3 text-lg">TOTAL POR LOTE:</p>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(lotTotals).map(([lot, total]) => (
                <div key={lot} className="border-2 border-black p-3 bg-white">
                  <p className="text-sm font-semibold mb-1">Lote: {lot}</p>
                  <p className="text-2xl font-bold">{total} plantas</p>
                </div>
              ))}
            </div>
          </div>

          {remainingPlants > 0 && (
            <div className="border-2 border-red-600 bg-red-50 p-4 mt-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-lg">PLANTAS RESTANTES (SIN DISTRIBUIR):</p>
                <p className="text-3xl font-bold text-red-600">{remainingPlants} plantas</p>
              </div>
              <p className="text-sm mt-2 text-red-700">
                Total del pedido: {orderData.totalPlants} | Distribuidas: {totalDistributed} | Restantes:{" "}
                {remainingPlants}
              </p>
            </div>
          )}
        </div>

        {/* Inspection Section */}
        <div className="border-3 border-black p-4 mt-4">
          <h2 className="text-lg font-bold mb-3">INSPECCIÓN EN SALIDA</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border-2 border-black p-3">
              <p className="font-bold mb-2">Conforme:</p>
              <div className="space-y-2">
                <div>
                  <p className="text-sm">Fecha: _________________</p>
                </div>
                <div>
                  <p className="text-sm">Firma: _________________</p>
                </div>
              </div>
            </div>
            <div className="border-2 border-black p-3">
              <p className="font-bold mb-2">No Conforme:</p>
              <div className="space-y-2">
                <div>
                  <p className="text-sm">Motivos: _________________</p>
                </div>
                <div>
                  <p className="text-sm">Fecha: _________________</p>
                </div>
                <div>
                  <p className="text-sm">Firma: _________________</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-black p-3">
            <p className="font-bold mb-2">Descripción:</p>
            <div className="min-h-[60px] border border-black p-2 mb-3"></div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 border-2 border-black" />
                <span>ACEPTADA</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 border-2 border-black" />
                <span>PEDIDO ANULADO</span>
              </label>
            </div>
            <div className="mt-3">
              <p className="text-sm">Firma Revisión: _________________</p>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
