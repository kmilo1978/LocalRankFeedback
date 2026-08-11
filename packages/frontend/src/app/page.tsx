import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="text-xl font-bold text-gray-900">
            LocalRank <span className="text-blue-600">Feedback</span>
          </div>
          <div className="hidden items-center gap-6 sm:flex">
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Precios</Link>
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">Iniciar sesion</Link>
            <Link href="/auth/register" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Prueba gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
            Mas de 500 negocios locales confian en nosotros
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Convierte cada visita en<br />
            <span className="text-blue-600">reseñas de 5 estrellas</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Captura el feedback de tus pacientes y clientes al salir. Los satisfechos van directo a Google. 
            Los insatisfechos te llegan a ti por WhatsApp para que los recuperes antes de que publiquen una reseña negativa.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register"
              className="rounded-lg bg-blue-600 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Empezar gratis — 14 dias
            </Link>
            <Link
              href="/feedback/clinica-sonrisa-centro"
              className="rounded-lg border border-gray-300 px-8 py-3.5 text-base font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Ver demo en vivo
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">Sin tarjeta de credito. Configura en 5 minutos.</p>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="border-t bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">El problema que nadie resuelve</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Los negocios locales pierden clientes por reseñas negativas que pudieron evitarse con una simple conversacion a tiempo.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-red-100 bg-white p-6">
              <div className="mb-3 text-3xl">😡</div>
              <h3 className="font-semibold text-gray-900">Sin filtro</h3>
              <p className="mt-2 text-sm text-gray-600">
                Un cliente insatisfecho publica directo en Google. Tu rating baja. No te enteraste a tiempo.
              </p>
            </div>
            <div className="rounded-xl border border-orange-100 bg-white p-6">
              <div className="mb-3 text-3xl">🤷</div>
              <h3 className="font-semibold text-gray-900">Sin datos</h3>
              <p className="mt-2 text-sm text-gray-600">
                No sabes que piensan tus clientes al salir. Solo te enteras cuando ya es publico y tarde.
              </p>
            </div>
            <div className="rounded-xl border border-yellow-100 bg-white p-6">
              <div className="mb-3 text-3xl">📉</div>
              <h3 className="font-semibold text-gray-900">Sin crecimiento</h3>
              <p className="mt-2 text-sm text-gray-600">
                Los clientes satisfechos se van sin dejar reseña. Tu competencia tiene mas reviews y se lleva los nuevos pacientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Como funciona</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              Un flujo simple que se activa despues de cada visita. Sin complicaciones.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">1</div>
              <h3 className="font-semibold text-gray-900">El cliente sale</h3>
              <p className="mt-2 text-sm text-gray-600">
                Escanea un QR, recibe un SMS o le llega un link por WhatsApp
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">2</div>
              <h3 className="font-semibold text-gray-900">Califica su visita</h3>
              <p className="mt-2 text-sm text-gray-600">
                En 10 segundos da su calificacion de 1 a 5 estrellas
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">3a</div>
              <h3 className="font-semibold text-gray-900">4-5 estrellas</h3>
              <p className="mt-2 text-sm text-gray-600">
                Va directo a Google a dejar su reseña publica. Tu rating sube.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600">3b</div>
              <h3 className="font-semibold text-gray-900">1-3 estrellas</h3>
              <p className="mt-2 text-sm text-gray-600">
                Te llega un WhatsApp inmediato. Contactas al cliente y lo recuperas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Resultados que ves en semanas, no meses</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <BenefitCard
              icon="⭐"
              stat="+300%"
              title="Mas reseñas en Google"
              description="Negocios que usan LocalRank triplican sus reseñas de 5 estrellas en los primeros 60 dias."
            />
            <BenefitCard
              icon="🛡️"
              stat="85%"
              title="Reseñas negativas evitadas"
              description="Intercepta la insatisfaccion antes de que llegue a Google. Resuelve en privado."
            />
            <BenefitCard
              icon="📱"
              stat="<30s"
              title="Alertas inmediatas"
              description="Feedback negativo te llega por WhatsApp al instante. Actua antes de que sea tarde."
            />
            <BenefitCard
              icon="📊"
              stat="4.7★"
              title="Rating promedio"
              description="Nuestros clientes mantienen un rating promedio de 4.7 en Google Maps."
            />
            <BenefitCard
              icon="🔄"
              stat="3x"
              title="Mas referidos"
              description="Activa un programa de referidos automatico con tus clientes mas satisfechos."
            />
            <BenefitCard
              icon="💰"
              stat="+40%"
              title="Mas clientes nuevos"
              description="Mejor rating + mas reseñas + referidos = mas pacientes nuevos cada mes."
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Lo que dicen nuestros clientes</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <TestimonialCard
              quote="En 2 meses pasamos de 12 a 47 reseñas en Google. El rating subio de 3.8 a 4.6. Los pacientes nuevos mencionan que nos encontraron por las reseñas."
              name="Dra. Maria Lopez"
              role="Clinica Dental Sonrisa"
              stars={5}
            />
            <TestimonialCard
              quote="Lo mejor es que me llega un WhatsApp cuando alguien sale insatisfecho. He recuperado al menos 10 pacientes que se hubieran ido a la competencia."
              name="Carlos Mendez"
              role="FisioCenter"
              stars={5}
            />
            <TestimonialCard
              quote="Antes pediamos reseñas de forma manual y era incomodo. Ahora el QR hace todo el trabajo. Tenemos 4.8 estrellas con 200+ reseñas."
              name="Andrea Ruiz"
              role="Studio Belleza Integral"
              stars={5}
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="border-t bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Para todo tipo de negocio local</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              Cualquier negocio que recibe clientes presencialmente puede beneficiarse.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              '🦷 Clinicas dentales',
              '💆 Centros de estetica',
              '🏋️ Gimnasios',
              '🩺 Consultorios medicos',
              '🧘 Fisioterapeutas',
              '💇 Peluquerias',
              '🐾 Veterinarias',
              '🍽️ Restaurantes',
              '🏥 Clinicas especializadas',
              '👁️ Opticas',
              '🧖 Spas',
              '📚 Academias',
            ].map((item) => (
              <span key={item} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Empieza a proteger tu reputacion hoy
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Configura tu cuenta en 5 minutos. Sin tarjeta de credito. 
            Empieza a recibir feedback de tus clientes desde el primer dia.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register"
              className="rounded-lg bg-blue-600 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Crear mi cuenta gratis
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-gray-300 px-8 py-3.5 text-base font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Ver planes y precios
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-900 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
            <div>
              <div className="text-lg font-bold text-white">
                LocalRank <span className="text-blue-400">Feedback</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                La plataforma de reputacion online para negocios locales.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white">Producto</h4>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-gray-400">Feedback Post-Visita</p>
                <p className="text-sm text-gray-400">Review Gate</p>
                <p className="text-sm text-gray-400">Respuestas con IA</p>
                <p className="text-sm text-gray-400">Programa de Referidos</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white">Industrias</h4>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-gray-400">Clinicas Dentales</p>
                <p className="text-sm text-gray-400">Fisioterapeutas</p>
                <p className="text-sm text-gray-400">Centros de Estetica</p>
                <p className="text-sm text-gray-400">Gimnasios</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white">Empresa</h4>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-gray-400">Precios</p>
                <p className="text-sm text-gray-400">Contacto</p>
                <p className="text-sm text-gray-400">Politica de privacidad</p>
                <p className="text-sm text-gray-400">Terminos de servicio</p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">
              2024 LocalRank Feedback. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BenefitCard({ icon, stat, title, description }: { icon: string; stat: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-bold text-blue-600">{stat}</span>
      </div>
      <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, name, role, stars }: { quote: string; name: string; role: string; stars: number }) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-3 flex gap-0.5">
        {Array.from({ length: stars }).map((_, i) => (
          <span key={i} className="text-sm">⭐</span>
        ))}
      </div>
      <p className="text-sm text-gray-700 italic">&ldquo;{quote}&rdquo;</p>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
    </div>
  );
}
