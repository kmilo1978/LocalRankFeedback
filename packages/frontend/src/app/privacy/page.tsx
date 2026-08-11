import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b"><div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4"><Link href="/" className="text-xl font-bold text-gray-900">LocalRank <span className="text-blue-600">Feedback</span></Link></div></nav>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Politica de Privacidad</h1>
        <p className="mt-2 text-sm text-gray-500">Ultima actualizacion: Agosto 2026</p>

        <div className="mt-8 space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Informacion que recopilamos</h2>
            <p className="mt-2">Recopilamos informacion que usted nos proporciona voluntariamente al usar nuestros servicios:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>Datos de cuenta:</strong> nombre, email, telefono, nombre del negocio</li>
              <li><strong>Datos de feedback:</strong> calificacion (1-5), comentarios opcionales</li>
              <li><strong>Datos de contacto de clientes:</strong> nombre, email, telefono (solo si el cliente los proporciona voluntariamente)</li>
              <li><strong>Datos de uso:</strong> paginas visitadas, acciones realizadas en la plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Como usamos la informacion</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Proporcionar y mantener nuestros servicios</li>
              <li>Enviar notificaciones de feedback al negocio (WhatsApp/email)</li>
              <li>Generar reportes y estadisticas para el negocio</li>
              <li>Mejorar nuestros servicios</li>
              <li>Comunicaciones de marketing (solo con consentimiento explicito)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Consentimiento</h2>
            <p className="mt-2">Solo enviamos comunicaciones de marketing cuando el usuario ha dado su consentimiento explicito mediante checkbox. El consentimiento se registra con fecha, hora, canal y version de la politica. El usuario puede revocar su consentimiento en cualquier momento.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Compartir informacion</h2>
            <p className="mt-2">No vendemos ni compartimos datos personales con terceros, excepto:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Con el negocio al que el cliente dio su feedback (la relacion directa)</li>
              <li>Proveedores de servicio necesarios (hosting, email, SMS) bajo acuerdos de confidencialidad</li>
              <li>Cuando sea requerido por ley</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Seguridad</h2>
            <p className="mt-2">Implementamos medidas de seguridad incluyendo: encriptacion de datos en transito (HTTPS), tokens OAuth encriptados, acceso basado en roles, y logs de auditoria. No almacenamos informacion clinica ni de salud, solo experiencia de servicio.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Retencion de datos</h2>
            <p className="mt-2">Mantenemos los datos mientras la cuenta este activa. Al cancelar, los datos se eliminan en un plazo de 30 dias. Los datos de feedback anonimizados pueden mantenerse para estadisticas agregadas.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. Derechos del usuario</h2>
            <p className="mt-2">Tienes derecho a: acceder a tus datos, rectificarlos, eliminarlos, revocar consentimientos, y solicitar portabilidad. Para ejercer estos derechos, contactanos a privacidad@localrankfeedback.com</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. Contacto</h2>
            <p className="mt-2">Para consultas sobre privacidad: privacidad@localrankfeedback.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
