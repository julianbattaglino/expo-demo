"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import GalleryGrid from "@/components/gallery/gallery-grid"
import Link from "next/link"

interface Card {
  id: string
  title: string
  description: string
  category_id: string
  category_name: string
  table_number: string
  logo_path: string
  whatsapp: string
  web_link: string
  instagram: string
  facebook: string
  email: string
}

interface Category {
  id: string
  name: string
}

export default function Home() {
  const [cards, setCards] = useState<Card[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/cards").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
    ]).then(([cardsData, categoriesData]) => {
      setCards(cardsData)
      setCategories(categoriesData)
      setLoading(false)
    })
  }, [])

  const filteredCards = selectedCategory ? cards.filter((card) => card.category_id === selectedCategory) : cards

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Art Exhibition</h1>
            <p className="text-slate-400 text-sm mt-1">Descubre todas las exposiciones</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="border-slate-600 hover:bg-slate-800 text-slate-200 bg-transparent">
              Admin
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filters */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">Filtrar por categoría</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedCategory === null
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-400 text-sm">
            {filteredCards.length} {filteredCards.length === 1 ? "resultado" : "resultados"}
          </p>
        </div>

        {/* Gallery */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Cargando...</p>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No hay tarjetas en esta categoría.</p>
          </div>
        ) : (
          <GalleryGrid cards={filteredCards} />
        )}
      </main>
    </div>
  )
}
