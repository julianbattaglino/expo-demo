"use client"

import ArtCard from "./art-card"

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

interface GalleryGridProps {
  cards: Card[]
}

export default function GalleryGrid({ cards }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <ArtCard key={card.id} card={card} />
      ))}
    </div>
  )
}
