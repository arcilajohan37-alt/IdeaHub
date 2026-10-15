import Link from "next/link";
import { Lightbulb, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
              <div className="bg-emerald-500 text-slate-950 p-1.5 rounded-lg">
                <Lightbulb className="w-4 h-4 fill-slate-950 stroke-slate-950" />
              </div>
              <span>Idea<span className="text-emerald-400">Hub</span></span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              La plataforma donde las ideas disruptivas se transforman en proyectos reales gracias al apoyo colaborativo de la comunidad.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Categorías</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/?category=tech" className="hover:text-emerald-400 transition-colors">⚡ Tecnología & Software</Link></li>
              <li><Link href="/?category=business" className="hover:text-emerald-400 transition-colors">💼 Negocios & Startups</Link></li>
              <li><Link href="/?category=art" className="hover:text-emerald-400 transition-colors">🎨 Arte & Creatividad</Link></li>
              <li><Link href="/?category=social" className="hover:text-emerald-400 transition-colors">🌱 Impacto Social</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Formas de Apoyo</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Colaboración Técnica</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Mentoría Especializada</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Recursos & Equipamiento</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Donación (Pledge MVP)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">IdeaHub MVP</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Desarrollado con Next.js App Router, Supabase RLS, PostgreSQL & Drizzle ORM.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-2 rounded-xl">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Construido para impulsar creadores</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} IdeaHub. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para la comunidad emprendedora.
          </p>
        </div>
      </div>
    </footer>
  );
}
