'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { mockLocationConfig } from '@/lib/mock-data';

interface LocationConfig {
  id: string;
  name: string;
  feedbackSlug: string;
  googleReviewUrl?: string;
  branding: {
    primaryColor?: string;
    logo?: string;
    thankYouTitle?: string;
    thankYouSubtitle?: string;
    positiveMessage?: string;
    negativeMessage?: string;
  };
  settings: {
    reviewGateThreshold?: number;
  };
}

interface FeedbackResult {
  feedbackId: string;
  action: 'redirect_google' | 'captured_private';
  googleReviewUrl?: string;
  message: string;
  notificationSent?: boolean;
}

export default function FeedbackFormPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [config, setConfig] = useState<LocationConfig | null>(null);
  const [step, setStep] = useState<'loading' | 'rate' | 'comment' | 'result'>('loading');
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<FeedbackResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchConfig();
  }, [slug]);

  const fetchConfig = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/public/feedback/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setStep('rate');
        return;
      }
    } catch {
      // Backend not available
    }

    // Mock fallback
    if (slug === 'clinica-sonrisa-centro' || slug === 'clinica-sonrisa-norte') {
      setConfig({
        ...mockLocationConfig,
        feedbackSlug: slug,
        name: slug === 'clinica-sonrisa-norte'
          ? 'Clinica Dental Sonrisa - Sede Norte'
          : mockLocationConfig.name,
      });
      setStep('rate');
    } else {
      setError('Formulario no encontrado');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    const threshold = config?.settings?.reviewGateThreshold || 4;

    // Try real API
    try {
      const res = await fetch(`${apiUrl}/api/v1/public/feedback/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment: comment || undefined,
          name: name || undefined,
          email: email || undefined,
          phone: phone || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setStep('result');

        // 4-5 stars: redirect to GMB
        if (data.action === 'redirect_google' && data.googleReviewUrl) {
          setTimeout(() => {
            window.location.href = data.googleReviewUrl;
          }, 3000);
        }
        setSubmitting(false);
        return;
      }
    } catch {
      // Backend not available, simulate
    }

    // Mock response (Review Gate logic)
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (rating >= threshold) {
      // 4-5 STARS → Direct to Google Maps Business review
      setResult({
        feedbackId: 'mock-' + Date.now(),
        action: 'redirect_google',
        googleReviewUrl: config?.googleReviewUrl,
        message:
          config?.branding?.positiveMessage ||
          'Nos alegra que hayas tenido una excelente experiencia! Te invitamos a compartirla en Google.',
      });
    } else {
      // 1-3 STARS → Captured privately, notification sent to owner
      setResult({
        feedbackId: 'mock-' + Date.now(),
        action: 'captured_private',
        notificationSent: true,
        message:
          config?.branding?.negativeMessage ||
          'Gracias por tu feedback. Nuestro equipo ha sido notificado y tomara accion.',
      });
    }

    setStep('result');
    setSubmitting(false);
  };

  const primaryColor = config?.branding?.primaryColor || '#2563eb';

  // Loading / Error
  if (step === 'loading') {
    if (error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <div className="mb-4 text-5xl">😕</div>
            <p className="text-lg text-gray-600">{error}</p>
            <p className="mt-2 text-sm text-gray-400">Verifica que el link sea correcto</p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // ===========================
  // RESULT SCREEN
  // ===========================
  if (step === 'result' && result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            {/* ======= 4-5 STARS: REDIRECT TO GOOGLE ======= */}
            {result.action === 'redirect_google' ? (
              <>
                <div className="mb-4 text-5xl">🎉</div>
                <h2 className="text-xl font-bold text-gray-900">Nos alegra mucho!</h2>
                <p className="mt-3 text-gray-600">{result.message}</p>

                {result.googleReviewUrl && (
                  <div className="mt-6">
                    <a
                      href={result.googleReviewUrl}
                      className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                      </svg>
                      Dejar resena en Google
                    </a>
                    <p className="mt-3 text-xs text-gray-400">
                      Redirigiendo automaticamente en 3 segundos...
                    </p>
                  </div>
                )}

                {!result.googleReviewUrl && (
                  <div className="mt-4 rounded-md bg-green-50 p-3">
                    <p className="text-sm text-green-700">
                      Tu feedback positivo ha sido registrado. Gracias!
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* ======= 1-3 STARS: CAPTURED PRIVATELY + NOTIFICATION ======= */
              <>
                <div className="mb-4 text-5xl">🙏</div>
                <h2 className="text-xl font-bold text-gray-900">Gracias por tu honestidad</h2>
                <p className="mt-3 text-gray-600">{result.message}</p>

                {/* Notification confirmation */}
                <div className="mt-5 rounded-lg bg-blue-50 p-4">
                  <div className="flex items-center justify-center gap-2 text-blue-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Equipo notificado</span>
                  </div>
                  <p className="mt-2 text-xs text-blue-600">
                    Hemos enviado tu feedback al responsable del negocio por WhatsApp y email.
                    Se pondran en contacto contigo pronto.
                  </p>
                </div>

                {/* What happens next */}
                <div className="mt-4 space-y-2 text-left">
                  <p className="text-xs font-medium text-gray-500 uppercase">Que sigue:</p>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-500">✓</span>
                    <p className="text-xs text-gray-600">Tu feedback fue registrado de forma privada</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-500">✓</span>
                    <p className="text-xs text-gray-600">El equipo recibio una alerta inmediata</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-blue-500">→</span>
                    <p className="text-xs text-gray-600">Un responsable revisara tu caso y tomara accion</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <p className="mt-6 text-xs text-gray-400">
            Powered by LocalRank Feedback
          </p>
        </div>
      </div>
    );
  }

  // ===========================
  // FORM: RATING + COMMENT
  // ===========================
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-gray-900">
              {config?.branding?.thankYouTitle || 'Como fue tu experiencia?'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {config?.branding?.thankYouSubtitle || 'Tu opinion es muy importante para nosotros'}
            </p>
            <p className="mt-2 text-xs font-medium" style={{ color: primaryColor }}>
              {config?.name}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* STEP 1: Star Rating */}
          {step === 'rate' && (
            <div className="text-center">
              <div className="mb-6 flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => {
                      setRating(star);
                      setStep('comment');
                    }}
                    className="text-4xl transition-transform hover:scale-125 active:scale-95 sm:text-5xl"
                    aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
                  >
                    {star <= (hoveredStar || rating) ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Toca una estrella para calificar
              </p>

              {/* Rating labels */}
              <div className="mt-3 flex justify-between px-2 text-xs text-gray-400">
                <span>Muy mal</span>
                <span>Excelente</span>
              </div>
            </div>
          )}

          {/* STEP 2: Comment + Contact Info */}
          {step === 'comment' && (
            <div>
              {/* Selected rating display */}
              <div className="mb-5 text-center">
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-2xl">
                      {star <= rating ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setStep('rate')}
                  className="mt-1 text-xs hover:underline"
                  style={{ color: primaryColor }}
                >
                  Cambiar calificacion
                </button>
              </div>

              {/* Contextual hint based on rating */}
              {rating <= 3 && (
                <div className="mb-4 rounded-md bg-amber-50 border border-amber-200 p-3">
                  <p className="text-xs text-amber-800">
                    💬 Tu comentario es privado y nos ayuda a mejorar. El equipo sera notificado directamente.
                  </p>
                </div>
              )}

              {rating >= 4 && (
                <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-3">
                  <p className="text-xs text-green-800">
                    🎉 Despues de enviar, te invitaremos a compartir tu experiencia en Google.
                  </p>
                </div>
              )}

              {/* Comment */}
              <div className="mb-3">
                <label htmlFor="comment" className="mb-1 block text-sm font-medium text-gray-700">
                  {rating <= 3 ? 'Que podemos mejorar?' : 'Que fue lo que mas te gusto?'} (opcional)
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={
                    rating <= 3
                      ? 'Cuentanos que paso para poder solucionarlo...'
                      : 'Tu experiencia nos motiva a seguir mejorando...'
                  }
                />
              </div>

              {/* Contact info - more important for negative */}
              <div className="mb-3">
                <label htmlFor="name-input" className="mb-1 block text-sm font-medium text-gray-700">
                  Nombre {rating <= 3 && <span className="text-xs text-gray-400">(para contactarte)</span>}
                </label>
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email-input" className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="phone-input" className="mb-1 block text-sm font-medium text-gray-700">
                  WhatsApp / Telefono {rating <= 3 && <span className="text-xs text-gray-400">(para que te contactemos)</span>}
                </label>
                <input
                  id="phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="+57 300 123 4567"
                />
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full rounded-md py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Enviar feedback'
                )}
              </button>

              <p className="mt-3 text-center text-xs text-gray-400">
                {rating <= 3
                  ? 'Tu feedback es privado y no sera publicado'
                  : 'En el siguiente paso podras dejar una resena en Google'}
              </p>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Powered by LocalRank Feedback
        </p>
      </div>
    </div>
  );
}
