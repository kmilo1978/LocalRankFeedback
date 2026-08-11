import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-gray-900">
            LocalRank <span className="text-blue-600">Feedback</span>
          </Link>
          <div className="hidden items-center gap-6 sm:flex">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Inicio</Link>
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">Iniciar sesion</Link>
            <Link href="/auth/register" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Prueba gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Planes simples, sin sorpresas
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
          Elige el plan que se adapta a tu negocio. Todos incluyen 14 dias gratis para probar sin compromiso.
        </p>

        {/* Billing toggle */}
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 p-1">
          <span className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white">Mensual</span>
          <span className="px-4 py-1.5 text-sm text-gray-600">Anual (-20%)</span>
        </div>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* STARTER */}
          <PlanCard
            name="Starter"
            price="49"
            period="/mes por sede"
            description="Ideal para negocios con una sede que quieren empezar a gestionar su reputacion."
            cta="Empezar gratis"
            ctaStyle="border"
            features={[
              { text: '1 sede incluida', included: true },
              { text: 'Formulario de feedback personalizable', included: true },
              { text: 'Review Gate (filtro automatico)', included: true },
              { text: 'Alertas por WhatsApp y Email', included: true },
              { text: 'Panel de metricas basico', included: true },
              { text: 'QR Code para tu negocio', included: true },
              { text: 'Hasta 200 feedback/mes', included: true },
              { text: 'Logo y colores personalizados', included: true },
              { text: 'Respuestas IA a rese�as', included: false },
              { text: 'Programa de referidos', included: false },
              { text: 'WhatsApp masivo', included: false },
              { text: 'Google Ads remarketing', included: false },
            ]}
          />

          {/* GROWTH - Popular */}
          <PlanCard
            name="Growth"
            price="99"
            period="/mes por sede"
            description="Para negocios que quieren crecer con referidos, remarketing y respuestas automaticas."
            cta="Empezar gratis"
            ctaStyle="primary"
            popular
            features={[
              { text: 'Hasta 5 sedes', included: true },
              { text: 'Todo lo del plan Starter', included: true },
              { text: 'Respuestas IA a rese�as de Google', included: true },
              { text: 'Programa de referidos automatico', included: true },
              { text: 'Envio de WhatsApp y SMS', included: true },
              { text: 'Captura de datos para remarketing', included: true },
              { text: 'Google Ads Customer Match', included: true },
              { text: 'Hasta 1,000 feedback/mes', included: true },
              { text: '200 creditos SMS/mes', included: true },
              { text: 'Reportes semanales por email', included: true },
              { text: 'Soporte prioritario', included: true },
              { text: 'Whitelabel', included: false },
            ]}
          />

          {/* AGENCY */}
          <PlanCard
            name="Agencia"
            price="249"
            period="/mes (hasta 10 sedes)"
            description="Para agencias de marketing que gestionan la reputacion de multiples clientes."
            cta="Contactar ventas"
            ctaStyle="border"
            features={[
              { text: 'Hasta 50 sedes', included: true },
              { text: 'Todo lo del plan Growth', included: true },
              { text: 'Panel multi-cliente', included: true },
              { text: 'Whitelabel (tu marca)', included: true },
              { text: 'Dominio personalizado', included: true },
              { text: 'Plantillas IA por cliente', included: true },
              { text: 'Hasta 10,000 feedback/mes', included: true },
              { text: '1,000 creditos SMS/mes', included: true },
              { text: 'API de integracion', included: true },
              { text: 'Manager de cuenta dedicado', included: true },
              { text: 'Onboarding personalizado', included: true },
              { text: 'SLA 99.9% uptime', included: true },
            ]}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">Preguntas frecuentes</h2>

          <div className="mt-10 space-y-6">
            <FaqItem
              question="Puedo probar antes de pagar?"
              answer="Si. Todos los planes incluyen 14 dias gratis sin necesidad de tarjeta de credito. Puedes configurar tu cuenta, generar tu QR y empezar a recibir feedback desde el primer dia."
            />
            <FaqItem
              question="Que pasa si supero el limite de feedback mensual?"
              answer="Te avisamos cuando estes cerca del limite. Si lo superas, el sistema sigue funcionando pero te sugerimos pasar al siguiente plan. No cortamos el servicio de forma abrupta."
            />
            <FaqItem
              question="Puedo cambiar de plan en cualquier momento?"
              answer="Si. Puedes subir o bajar de plan cuando quieras. Los cambios se aplican en el siguiente ciclo de facturacion. Si subes de plan, se prorratea la diferencia."
            />
            <FaqItem
              question="Necesito conocimientos tecnicos para configurarlo?"
              answer="No. La configuracion toma 5 minutos: creas tu cuenta, agregas tu sede con el link de Google Reviews, personalizas colores y mensajes, y listo. Te damos un QR para imprimir."
            />
            <FaqItem
              question="Como funciona el envio de WhatsApp?"
              answer="Las alertas de feedback negativo llegan a tu WhatsApp personal sin costo adicional. Para envios masivos (invitaciones de referidos, recordatorios), usamos creditos de la plataforma incluidos en tu plan."
            />
            <FaqItem
              question="Que es el Review Gate?"
              answer="Es el filtro inteligente que decide hacia donde va cada feedback. Si el cliente da 4 o 5 estrellas, lo dirigimos a Google para que deje una rese�a publica. Si da 1 a 3, capturamos su opinion de forma privada y te alertamos para que lo contactes."
            />
            <FaqItem
              question="Puedo cancelar cuando quiera?"
              answer="Si. No hay contratos de permanencia. Puedes cancelar desde tu panel en cualquier momento. Tu cuenta seguira activa hasta el fin del periodo pagado."
            />
            <FaqItem
              question="Ofrecen descuento por pago anual?"
              answer="Si. Con el pago anual obtienes 2 meses gratis (equivalente a un 20% de descuento). Contactanos para planes anuales."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Todavia tienes dudas?
          </h2>
          <p className="mt-3 text-gray-600">
            Agenda una llamada de 15 minutos con nuestro equipo. Te mostramos como funciona con tu negocio especifico.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Empezar gratis ahora
            </Link>
            <a
              href="https://wa.me/573001234567?text=Hola!%20Me%20interesa%20LocalRank%20Feedback"
              target="_blank"
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              💬 Escribir por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer mini */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm text-gray-500">
            2024 LocalRank Feedback. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

function PlanCard({
  name,
  price,
  period,
  description,
  cta,
  ctaStyle,
  features,
  popular,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  cta: string;
  ctaStyle: 'primary' | 'border';
  features: { text: string; included: boolean }[];
  popular?: boolean;
}) {
  return (
    <div className={`relative rounded-2xl border p-8 ${popular ? 'border-blue-600 shadow-xl shadow-blue-100' : 'border-gray-200'}`}>
      {popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-medium text-white">
          Mas popular
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>

      <div className="mt-6">
        <span className="text-4xl font-bold text-gray-900">${price}</span>
        <span className="text-sm text-gray-500"> USD {period}</span>
      </div>

      <Link
        href="/auth/register"
        className={`mt-6 block w-full rounded-lg py-3 text-center text-sm font-medium transition ${
          ctaStyle === 'primary'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        {cta}
      </Link>

      <div className="mt-8 space-y-3">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-2.5">
            {feature.included ? (
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <h3 className="font-medium text-gray-900">{question}</h3>
      <p className="mt-2 text-sm text-gray-600">{answer}</p>
    </div>
  );
}
