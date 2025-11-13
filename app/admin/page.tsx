"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import CardForm from "@/components/admin/card-form"
import CardsList from "@/components/admin/cards-list"
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  const router = useRouter()
  const [cards, setCards] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCard, setEditingCard] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const response = await fetch("/api/cards")
      const data = await response.json()
      if (!response.ok) {
        console.error("Failed to fetch cards, server returned error:", data)
        setCards([])
        return
      }

      setCards(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch cards:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    router.push("/logout")
  }

  const handleCardSaved = () => {
    setShowForm(false)
    setEditingCard(null)
    fetchCards()
  }

  const handleEdit = (card: any) => {
    setEditingCard(card)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro que deseas eliminar esta tarjeta?")) return

    try {
      const response = await fetch(`/api/cards/${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchCards()
      }
    } catch (error) {
      console.error("Failed to delete card:", error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Panel Admin</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-slate-200 border-slate-600 hover:bg-slate-700 bg-transparent"
          >
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {/* Action Buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => {
              setEditingCard(null)
              setShowForm(!showForm)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {showForm ? "Cerrar formulario" : "Agregar nueva tarjeta"}
          </Button>
        </div>

        {/* Form Section */}
        {showForm && (
          <UICard className="mb-6 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">{editingCard ? "Editar tarjeta" : "Nueva tarjeta"}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardForm initialData={editingCard} onSaved={handleCardSaved} />
            </CardContent>
          </UICard>
        )}

        {/* Cards List Section */}
        <UICard className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Tarjetas ({cards.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-400">Cargando...</p>
            ) : (
              <CardsList cards={cards} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </CardContent>
        </UICard>
      </main>
    </div>
  )
}
