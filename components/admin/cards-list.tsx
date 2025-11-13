"use client"

import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface CardsListProps {
  cards: any[]
  onEdit: (card: any) => void
  onDelete: (id: string) => void
}

export default function CardsList({ cards, onEdit, onDelete }: CardsListProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No hay tarjetas creadas aún.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-600">
            <th className="text-left py-3 px-4 text-slate-300 font-semibold">Título</th>
            <th className="text-left py-3 px-4 text-slate-300 font-semibold">Categoría</th>
            <th className="text-left py-3 px-4 text-slate-300 font-semibold">Mesa</th>
            <th className="text-left py-3 px-4 text-slate-300 font-semibold">Contacto</th>
            <th className="text-right py-3 px-4 text-slate-300 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.id} className="border-b border-slate-700 hover:bg-slate-700/50">
              <td className="py-3 px-4 text-slate-200">{card.title}</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs">{card.category_name}</span>
              </td>
              <td className="py-3 px-4 text-slate-200">{card.table_number}</td>
              <td className="py-3 px-4 text-slate-400 text-xs">
                {card.email && <div>📧 {card.email}</div>}
                {card.whatsapp && <div>📱 {card.whatsapp}</div>}
              </td>
              <td className="py-3 px-4 text-right space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(card)}
                  className="border-slate-600 hover:bg-slate-700 text-slate-300"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(card.id)}
                  className="border-red-600/50 hover:bg-red-600/10 text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
