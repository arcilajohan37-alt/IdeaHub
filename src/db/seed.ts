import { db } from "@/db";
import { profiles, projects, supports, projectUpdates } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  const existingProjects = await db.select().from(projects).limit(1);
  if (existingProjects.length > 0) {
    console.log("Database already contains data, skipping seed.");
    return;
  }

  console.log("Seeding database with sample projects...");

  const defaultPassword = await bcrypt.hash("password123", 10);

  // 1. Create Sample Users
  const [user1] = await db.insert(profiles).values({
    name: "Elena Rostova",
    email: "elena@ideahub.dev",
    passwordHash: defaultPassword,
    bio: "Ingeniera de software y apasionada por las tecnologías limpias y el impacto social.",
    location: "Ciudad de México, México",
    skills: ["TypeScript", "Next.js", "AI", "Sostenibilidad"],
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  }).returning();

  const [user2] = await db.insert(profiles).values({
    name: "Carlos Mendoza",
    email: "carlos@ideahub.dev",
    passwordHash: defaultPassword,
    bio: "Fundador de startups gastronómicas y mentor de negocios en aceleradoras de Latinoamérica.",
    location: "Bogotá, Colombia",
    skills: ["Modelos de Negocio", "Marketing", "Gastronomía", "Ventas"],
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  }).returning();

  const [user3] = await db.insert(profiles).values({
    name: "Sofía Valenzuela",
    email: "sofia@ideahub.dev",
    passwordHash: defaultPassword,
    bio: "Artista multidisciplinaria, curadora digital y defensora del arte comunitario.",
    location: "Buenos Aires, Argentina",
    skills: ["Diseño UI/UX", "Ilustración", "Gestión Cultural", "Web3"],
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  }).returning();

  // 2. Create Sample Projects
  const [p1] = await db.insert(projects).values({
    userId: user1.id,
    title: "Ecoliá: Plataforma de Reciclaje Urbano Inteligente",
    summary: "Conectando hogares, clasificadores locales y centros de reciclaje con sensores IoT y recompensas digitales.",
    description: `Ecoliá busca revolucionar el reciclaje en las ciudades de Latinoamérica.

### El Problema
Más del 80% de los residuos reciclables en nuestras ciudades termina en vertederos debido a la falta de separación en origen y logística ineficiente.

### Nuestra Solución
1. **Puntos limpios inteligentes**: Contenedores con sensores de llenado y pesaje automatizado.
2. **App Móvil de Recompensas**: Los vecinos escanean sus bolsas de reciclaje y ganan puntos canjeables por transporte público o descuentos locales.
3. **Red de Recolectores**: Optimizamos las rutas de recolección en tiempo real para optimizar costos de combustible en un 40%.`,
    category: "tech",
    location: "Ciudad de México",
    tags: ["iot", "sostenibilidad", "reciclaje", "movilidad"],
    status: "building",
    coverImageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80",
    goalAmount: "25000.00",
  }).returning();

  const [p2] = await db.insert(projects).values({
    userId: user2.id,
    title: "Mercado Raíces: De la Granja a la Mesa sin Intermediarios",
    summary: "Mercado digital directo que permite a pequeños agricultores vender sus cosechas orgánicas a restaurantes y familias.",
    description: `Queremos empoderar al agricultor local eliminando las 5 capas de intermediarios que encarecen los alimentos.

### ¿Cómo funciona?
- Los productores publican su oferta semanal de cosecha.
- Los chefs y familias hacen pedidos conjuntos en su zona.
- Entregamos en camionetas eléctricas agrupadas por distrito.`,
    category: "business",
    location: "Bogotá",
    tags: ["agricultura", "alimentación", "comercio-justo", "logistica"],
    status: "running",
    coverImageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&auto=format&fit=crop&q=80",
    goalAmount: "15000.00",
  }).returning();

  const [p3] = await db.insert(projects).values({
    userId: user3.id,
    title: "Galería Urbana VR: Reivindicando el Arte Mural Calle",
    summary: "Escaneo 3D y plataforma inmersiva en realidad virtual para preservar y democratizar el arte urbano de Latinoamérica.",
    description: `El arte urbano es efímero y a menudo destruido por el desarrollo inmobiliario. 
    
Nuestra propuesta digitaliza en ultra-alta definición los murales más emblemáticos de Buenos Aires, Medellín y CDMX, creando galerías accesibles para escuelas y amantes del arte de todo el mundo.`,
    category: "art",
    location: "Buenos Aires",
    tags: ["vr", "arte-urbano", "cultura", "3d"],
    status: "idea",
    coverImageUrl: "https://images.unsplash.com/photo-1561055657-b9e0bf0fa360?w=800&auto=format&fit=crop&q=80",
    goalAmount: "10000.00",
  }).returning();

  const [p4] = await db.insert(projects).values({
    userId: user1.id,
    title: "EduRed: Alfabetización Digital para Comunidades Rurales",
    summary: "Kits educativos offline accionados por energía solar con servidores Raspberry Pi cargados con Wikipedia y cursos interactivos.",
    description: `Millones de niños en zonas rurales carecen de acceso estable a internet. EduRed transmite una red Wi-Fi local desde un dispositivo solar compacto, entregando contenidos pedagógicos de máxima calidad sin costo de datos.`,
    category: "social",
    location: "Oaxaca, México",
    tags: ["educacion", "hardware", "solar", "social-impact"],
    status: "building",
    coverImageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
    goalAmount: "18000.00",
  }).returning();

  // 3. Create Sample Supports
  await db.insert(supports).values([
    {
      projectId: p1.id,
      userId: user2.id,
      type: "MENTOR",
      message: "Te puedo asesorar con la estructuración del pitch para levantar capital semilla y la estrategia comercial con los municipios.",
      anonymous: false,
      status: "accepted",
    },
    {
      projectId: p1.id,
      userId: user3.id,
      type: "COLLABORATE",
      message: "Me encantaría diseñar la interfaz UI/UX de la app móvil y las ilustraciones de la campaña de concienciación.",
      anonymous: false,
      status: "accepted",
    },
    {
      projectId: p1.id,
      userId: user2.id,
      type: "DONATE",
      amount: "500.00",
      message: "Gran iniciativa. Dejo mi compromiso de pledge de $500 USD para financiar el primer contenedor inteligente.",
      anonymous: true,
      status: "accepted",
    },
    {
      projectId: p2.id,
      userId: user1.id,
      type: "RESOURCE",
      message: "Tengo acceso a un lote de sensores de temperatura IoT y GPS que les pueden servir para las camionetas refrigeradas.",
      anonymous: false,
      status: "pending",
    },
    {
      projectId: p3.id,
      userId: user2.id,
      type: "COLLABORATE",
      message: "Conozco varios colectivos de artistas en Bogotá que estarían fascinados de subir sus murales a la plataforma.",
      anonymous: false,
      status: "pending",
    },
  ]);

  // 4. Create Sample Updates
  await db.insert(projectUpdates).values([
    {
      projectId: p1.id,
      title: "¡Primer prototipo físico de contenedor instalado en la UAM!",
      content: "Hoy instalamos el primer prototipo de Ecoliá en la Universidad Autónoma. En solo 4 horas recibimos 120 kg de botellas PET y 45 estudiantes se registraron en la prueba piloto.",
      links: [{ label: "Ver fotos del prototipo", url: "https://github.com" }],
    },
    {
      projectId: p1.id,
      title: "Llegamos al 40% de la meta de validación comunitaria",
      content: "Queremos agradecer a todos los mentores y colaboradores que se han sumado esta semana. Estamos ultimando los esquemas del circuito impreso del sensor de peso.",
      links: [],
    },
    {
      projectId: p2.id,
      title: "Alianza firmada con 15 productores de la sabana de Bogotá",
      content: "Esta semana concretamos el acuerdo de precio justo con la asociación de horticultores locales. Comenzaremos las pruebas de reparto el próximo mes.",
      links: [{ label: "Reporte de Prensa", url: "https://news.ycombinator.com" }],
    },
  ]);

  console.log("Database seeded successfully!");
}
