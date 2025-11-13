"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUpload from "./image-upload"

interface CardFormProps {
  initialData?: any
  onSaved: () => void
}

export default function CardForm({ initialData, onSaved }: CardFormProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    table_number: "",
    logo_path: "",
    whatsapp: "",
    web_link: "",
    instagram: "",
    facebook: "",
    email: "",
  })

  useEffect(() => {
    fetchCategories()
    if (initialData) {
      setForm(initialData)
    }
  }, [initialData])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setForm((prev) => ({ ...prev, category_id: value }))
  }

  const handleImageUploaded = (url: string) => {
    setForm((prev) => ({ ...prev, logo_path: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = initialData ? "PUT" : "POST"
      const url = initialData ? `/api/cards/${initialData.id}` : "/api/cards"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        onSaved()
      } else {
        alert("Error al guardar la tarjeta")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al guardar la tarjeta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">Título</label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Nombre de la exposición"
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">Categoría</label>
          <Select value={form.category_id} onValueChange={handleSelectChange}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="text-white">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">Número de mesa/stand</label>
          <Input
            name="table_number"
            value={form.table_number}
            onChange={handleChange}
            placeholder="A1, B2, etc."
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">Logo/Imagen</label>
          <ImageUpload onImageUploaded={handleImageUploaded} initialImage={form.logo_path} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Breve descripción de la exposición"
          className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded min-h-24"
          required
        />
      </div>

      <div className="border-t border-slate-600 pt-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Datos de contacto y redes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contacto@ejemplo.com"
              className="bg-slate-700 border-slate-600 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp</label>
            <Input
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="+54 9 11 XXXX-XXXX"
              className="bg-slate-700 border-slate-600 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Sitio web</label>
            <Input
              name="web_link"
              value={form.web_link}
              onChange={handleChange}
              placeholder="https://ejemplo.com"
              className="bg-slate-700 border-slate-600 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Instagram</label>
            <Input
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="@usuario"
              className="bg-slate-700 border-slate-600 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Facebook</label>
            <Input
              name="facebook"
              value={form.facebook}
              onChange={handleChange}
              placeholder="facebook.com/usuario"
              className="bg-slate-700 border-slate-600 text-white text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? "Guardando..." : "Guardar tarjeta"}
        </Button>
      </div>
    </form>
  )
}
