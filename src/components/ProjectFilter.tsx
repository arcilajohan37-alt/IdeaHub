"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, MapPin, Tag, Filter, X, Sparkles } from "lucide-react";

export default function ProjectFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentSearch = searchParams.get("q") || "";
  const currentTag = searchParams.get("tag") || "";
  const currentLocation = searchParams.get("location") || "";

  const [search, setSearch] = useState(currentSearch);
  const [location, setLocation] = useState(currentLocation);
  const [tag, setTag] = useState(currentTag);

  function updateParams(newParams: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset pagination to page 1 on filter change
    params.delete("page");

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: search, location, tag });
  }

  function clearFilters() {
    setSearch("");
    setLocation("");
    setTag("");
    startTransition(() => {
      router.push("/");
    });
  }

  const categories = [
    { id: "", label: "🔥 Todos" },
    { id: "tech", label: "⚡ Tecnología" },
    { id: "business", label: "💼 Negocios" },
    { id: "art", label: "🎨 Arte" },
    { id: "social", label: "🌱 Social" },
  ];

  const statuses = [
    { id: "", label: "Todos los Estados" },
    { id: "idea", label: "💡 En Idea" },
    { id: "building", label: "🛠️ En Construcción" },
    { id: "running", label: "🚀 En Marcha" },
    { id: "done", label: "🎉 Completado" },
  ];

  const hasActiveFilters = currentCategory || currentStatus || currentSearch || currentTag || currentLocation;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl mb-8 space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {categories.map((cat) => {
          const isActive = currentCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => updateParams({ category: cat.id })}
              className={`px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-[1.02]"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search Bar & Secondary Filters */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search query input */}
        <div className="md:col-span-5 relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título, palabra clave o resumen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Location Filter */}
        <div className="md:col-span-3 relative">
          <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Ciudad / País..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Status Dropdown */}
        <div className="md:col-span-2">
          <select
            value={currentStatus}
            onChange={(e) => updateParams({ status: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-3 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            {statuses.map((st) => (
              <option key={st.id} value={st.id}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit & Clear */}
        <div className="md:col-span-2 flex items-center gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-2xl text-sm transition-all shadow-md shadow-emerald-500/20"
          >
            {isPending ? "Buscando..." : "Filtrar"}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              title="Limpiar Filtros"
              className="p-3 bg-slate-800 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-2xl border border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
