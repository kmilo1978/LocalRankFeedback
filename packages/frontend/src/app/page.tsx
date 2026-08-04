import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* Logo / Brand */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            LocalRank <span className="text-brand-600">Feedback</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Reputacion + Retencion + Referidos + Remarketing para negocios locales
          </p>
        </div>

        {/* Feature highlights */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">⭐</div>
            <h3 className="font-semibold text-gray-900">Feedback Inteligente</h3>
            <p className="mt-2 text-sm text-gray-600">
              Captura feedback post-visita y dirige las resenas positivas a Google
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">🤖</div>
            <h3 className="font-semibold text-gray-900">Respuestas con IA</h3>
            <p className="mt-2 text-sm text-gray-600">
              Responde automaticamente a resenas de Google con el tono de tu marca
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">🔗</div>
            <h3 className="font-semibold text-gray-900">Referidos</h3>
            <p className="mt-2 text-sm text-gray-600">
              Convierte clientes satisfechos en embajadores con un programa de referidos
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/auth/login"
            className="rounded-lg bg-brand-600 px-8 py-3 font-medium text-white transition hover:bg-brand-700"
          >
            Iniciar sesion
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg border border-brand-600 px-8 py-3 font-medium text-brand-600 transition hover:bg-brand-50"
          >
            Crear cuenta gratis
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Prueba el formulario de feedback demo:{' '}
          <Link href="/feedback/clinica-sonrisa-centro" className="text-brand-600 underline">
            /feedback/clinica-sonrisa-centro
          </Link>
        </p>
      </div>
    </div>
  );
}
