'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

const industries: Record<string, { title: string; icon: string; description: string; problems: string[]; benefits: string[]; stats: { reviews: string; rating: string; recovery: string }; testimonial: { quote: string; name: string; role: string } }> = {
  clinicas: {
    title: 'Clinicas Dentales',
    icon: '🦷',
    description: 'Mas pacientes nuevos con mejor reputacion online. Protege tu clinica de reseñas negativas y convierte cada visita en una reseña de 5 estrellas.',
    problems: ['Pacientes insatisfechos publican en Google sin darte oportunidad de resolver', 'Los pacientes contentos se van sin dejar reseña', 'Tu competencia tiene mas reseñas y se lleva los nuevos pacientes', 'No tienes forma de medir la satisfaccion real'],
    benefits: ['Intercepta insatisfaccion antes de que sea publica', 'Automatiza la solicitud de reseñas post-consulta', 'Recibe alerta por WhatsApp cuando hay un problema', 'Sube tu rating a 4.7+ en 60 dias'],
    stats: { reviews: '3x mas reseñas', rating: '4.7 promedio', recovery: '85% recuperados' },
    testimonial: { quote: 'En 2 meses pasamos de 3.8 a 4.6 en Google. Los pacientes nuevos mencionan que nos eligieron por las reseñas.', name: 'Dra. Maria Lopez', role: 'Clinica Dental Sonrisa, Bogota' },
  },
  gimnasios: {
    title: 'Gimnasios y Fitness',
    icon: '🏋️',
    description: 'Retiene miembros, atrae nuevos con reseñas positivas, y activa un programa de referidos que crece solo.',
    problems: ['Alta rotacion de miembros sin saber por que se van', 'Competencia agresiva en precio y cercania', 'No capturas el momento de satisfaccion post-clase', 'Los referidos son boca a boca sin trackeo'],
    benefits: ['Feedback despues de cada clase o sesion', 'Programa de referidos automatico con premios', 'Cupones de recompensa que generan recompra', 'Dashboard con NPS y tendencias de satisfaccion'],
    stats: { reviews: '4x reseñas en Google', rating: '4.8 promedio', recovery: '40% mas referidos' },
    testimonial: { quote: 'El programa de referidos nos trajo 30 miembros nuevos en un mes. El QR en recepcion hace todo el trabajo.', name: 'Carlos Mendez', role: 'FitZone Gym, Medellin' },
  },
  estetica: {
    title: 'Centros de Estetica',
    icon: '💆',
    description: 'Tus clientas satisfechas son tu mejor publicidad. Automatiza las reseñas y los referidos para crecer sin pagar mas en ads.',
    problems: ['Las clientas satisfechas no dejan reseña por pereza', 'Las insatisfechas si publican y dañan tu imagen', 'Dependes de Instagram para atraer nuevas clientas', 'No tienes forma sistematica de pedir recomendaciones'],
    benefits: ['QR elegante en recepcion que pide feedback al salir', 'Clientas de 5 estrellas van directo a Google/Facebook', 'Cupon de descuento automatico post-reseña (genera retorno)', 'Programa de referidos: "Invita a una amiga y ambas ganan"'],
    stats: { reviews: '5x reseñas mensuales', rating: '4.9 promedio', recovery: '60% usan cupones' },
    testimonial: { quote: 'Antes dependia 100% de Instagram. Ahora Google me trae clientas nuevas cada semana gracias a las reseñas.', name: 'Andrea Ruiz', role: 'Studio Belleza Integral, Cali' },
  },
  restaurantes: {
    title: 'Restaurantes',
    icon: '🍽️',
    description: 'Mas reseñas positivas en Google y TripAdvisor. Detecta problemas de servicio antes de que se vuelvan publicos.',
    problems: ['Una mala reseña puede ahuyentar docenas de comensales', 'No sabes si el cliente salio satisfecho hasta que publica', 'Competencia feroz por visibilidad en Google Maps', 'No tienes mecanismo para incentivar reseñas organicas'],
    benefits: ['QR en la mesa o en la cuenta para feedback inmediato', 'Comensales de 4-5 estrellas van a Google/TripAdvisor', 'Alerta inmediata al gerente si hay insatisfaccion', 'Respuestas IA a reseñas con el tono de tu marca'],
    stats: { reviews: '3x reseñas en Google', rating: '4.6 promedio', recovery: '90% alertas atendidas' },
    testimonial: { quote: 'Detectamos un problema recurrente con el tiempo de espera gracias al feedback. Lo resolvimos antes de que llegara a Google.', name: 'Chef Diego Torres', role: 'Restaurante La Mesa, Bogota' },
  },
};

export default function IndustryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const industry = industries[slug];

  if (!industry) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Industria no encontrada</p>
          <Link href="/" className="mt-4 text-blue-600 hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"><Link href="/" className="text-xl font-bold text-gray-900">LocalRank <span className="text-blue-600">Feedback</span></Link><Link href="/auth/register" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Prueba gratis</Link></div></nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="text-5xl mb-4">{industry.icon}</div>
        <h1 className="text-4xl font-bold text-gray-900">LocalRank para {industry.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">{industry.description}</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/auth/register" className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700">Empezar gratis</Link>
          <Link href="/feedback/clinica-sonrisa-centro" className="rounded-lg border border-gray-300 px-8 py-3 font-medium text-gray-700 hover:bg-gray-50">Ver demo</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-blue-50 py-12">
        <div className="mx-auto max-w-4xl px-4 grid grid-cols-3 gap-8 text-center">
          <div><p className="text-3xl font-bold text-blue-700">{industry.stats.reviews}</p><p className="text-sm text-gray-600">en Google Maps</p></div>
          <div><p className="text-3xl font-bold text-blue-700">{industry.stats.rating}</p><p className="text-sm text-gray-600">rating alcanzado</p></div>
          <div><p className="text-3xl font-bold text-blue-700">{industry.stats.recovery}</p><p className="text-sm text-gray-600">clientes recuperados</p></div>
        </div>
      </section>

      {/* Problems */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Problemas que resolvemos</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {industry.problems.map((p, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-4">
              <span className="text-red-500 text-lg">✗</span>
              <p className="text-sm text-gray-700">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Como lo solucionamos</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {industry.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 p-4">
                <span className="text-green-600 text-lg">✓</span>
                <p className="text-sm text-gray-700">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-lg italic text-gray-700">"{industry.testimonial.quote}"</p>
          <p className="mt-4 font-medium text-gray-900">{industry.testimonial.name}</p>
          <p className="text-sm text-gray-500">{industry.testimonial.role}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-blue-600 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white">Empieza a proteger la reputacion de tu {industry.title.toLowerCase()}</h2>
          <p className="mt-2 text-blue-100">14 dias gratis. Sin tarjeta. Configura en 5 minutos.</p>
          <Link href="/auth/register" className="mt-6 inline-block rounded-lg bg-white px-8 py-3 font-medium text-blue-600 hover:bg-blue-50">Crear cuenta gratis</Link>
        </div>
      </section>
    </div>
  );
}
