"use client"

import { Mail, MapPin, Globe, Instagram, Facebook, MessageCircle } from "lucide-react"
import Image from "next/image"

interface Card {
  id: string
  title: string
  description: string
  category_name: string
  table_number: string
  logo_path: string
  whatsapp: string
  web_link: string
  instagram: string
  facebook: string
  email: string
}

export default function ArtCard({ card }: { card: Card }) {
  const contactIcons = [
    {
      icon: Mail,
      link: card.email ? `mailto:${card.email}` : null,
      label: "Email",
    },
    {
      icon: MessageCircle,
      link: card.whatsapp ? `https://wa.me/${card.whatsapp.replace(/\D/g, "")}` : null,
      label: "WhatsApp",
    },
    {
      icon: Globe,
      link: card.web_link,
      label: "Web",
    },
    {
      icon: Instagram,
      link: card.instagram ? `https://instagram.com/${card.instagram.replace("@", "")}` : null,
      label: "Instagram",
    },
    {
      icon: Facebook,
      link: card.facebook ? `https://facebook.com/${card.facebook}` : null,
      label: "Facebook",
    },
  ]

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors group">
      {/* Logo/Image Section */}
      <div className="relative bg-gradient-to-br from-slate-700 to-slate-800 h-48 overflow-hidden flex items-center justify-center border-b border-slate-700">
        {card.logo_path ? (
          <Image
            src={card.logo_path || "/placeholder.svg"}
            alt={card.title}
            width={300}
            height={200}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="text-4xl text-slate-600">🎨</div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Category Badge */}
        <div className="inline-block mb-3">
          <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-semibold">
            {card.category_name}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{card.title}</h3>

        {/* Location */}
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">Mesa {card.table_number}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 mb-4 line-clamp-3">{card.description}</p>

        {/* Contact Icons */}
        <div className="flex gap-2 flex-wrap">
          {contactIcons.map((contact) => {
            const Icon = contact.icon
            return contact.link ? (
              <a
                key={contact.label}
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                title={contact.label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ) : null
          })}
        </div>
      </div>
    </div>
  )
}
