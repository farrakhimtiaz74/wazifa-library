import React from 'react'
import { Search } from 'lucide-react'
export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || 'Search wazifa, e.g. stress, debt, barakah…'} className="w-full rounded-2xl border border-gold/25 bg-white/5 dark:bg-white/5 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-gold" />
    </div>
  )
}
