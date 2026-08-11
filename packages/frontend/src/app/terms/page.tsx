import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b"><div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4"><Link href="/" className="text-xl font-bold text-gray-900">LocalRank <span className="text-blue-600">Feedback</span></Link></div></nav>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Terminos de Servicio</h1>
        <p className="mt-2 text-sm text-gray-500">Ultima actualizacion: Agosto 2026</p>

        <div className="mt-8 space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Aceptacion de los terminos</h2>
            <p className="mt-2">Al registrarte y usar LocalRank Feedback, aceptas estos terminos de servicio. Si no estas de acuerdo, no uses la plataforma.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Descripcion del servicio</h2>
            <p className="mt-2">LocalRank Feedback es una plataforma SaaS que permite a negocios locales capturar feedback de clientes, gestionar su reputacion online, generar reseñas y administrar programas de referidos. El servicio se proporciona "tal cual" y puede modificarse sin previo aviso.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Cuentas y acceso</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Debes proporcionar informacion veraz al registrarte</li>
              <li>Eres responsable de mantener la confidencialidad de tu cuenta</li>
              <li>Una cuenta corresponde a un negocio (plan agencia permite multiples)</li>
              <li>Nos reservamos el derecho de suspender cuentas que violen estos terminos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Uso aceptable</h2>
            <p className="mt-2">No puedes usar LocalRank Feedback para:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Generar reseñas falsas o manipular calificaciones</li>
              <li>Enviar spam o comunicaciones no solicitadas</li>
              <li>Recopilar datos de clientes sin su consentimiento</li>
              <li>Cualquier actividad ilegal o que viole derechos de terceros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Pagos y suscripciones</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Los planes se cobran mensualmente por adelantado</li>
              <li>El periodo de prueba gratuito es de 14 dias</li>
              <li>Puedes cancelar en cualquier momento sin penalidad</li>
              <li>No hay reembolsos por periodos parciales no utilizados</li>
              <li>Los precios pueden cambiar con 30 dias de aviso previo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Propiedad intelectual</h2>
            <p className="mt-2">LocalRank Feedback y su tecnologia son propiedad de LocalRank. Los datos de tu negocio y clientes son tuyos. Nos otorgas licencia limitada para procesar esos datos en el contexto del servicio.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. Limitacion de responsabilidad</h2>
            <p className="mt-2">LocalRank Feedback no se hace responsable por: perdidas de negocio, reseñas publicadas por terceros en Google u otras plataformas, interrupciones temporales del servicio, o acciones tomadas por los clientes del negocio.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. Modificaciones</h2>
            <p className="mt-2">Podemos modificar estos terminos. Te notificaremos por email con al menos 15 dias de anticipacion. El uso continuado del servicio implica aceptacion de los nuevos terminos.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">9. Contacto</h2>
            <p className="mt-2">Para consultas legales: legal@localrankfeedback.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
