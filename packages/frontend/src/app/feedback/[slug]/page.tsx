'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface LocationConfig {
  id: string;
  name: string;
  feedbackSlug: string;
  branding: {
    primaryColor?: string;
    logo?: string;
    thankYouTitle?: string;
    thankYouSubtitle?: string;
    positiveMessage?: string;
    negativeMessage?: string;
  };
}

interface FeedbackResult {
  feedbackId: string;
  action: 'redirect_google' | 'captured_private';
  googleReviewUrl?: string;
  message: string;
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
      if (!res.ok) {
        setError('Formulario no encontrado');
        return;
      }
      const data = await res.json();
      setConfig(data);
      setStep('rate');
    } catch {
      setError('Error al cargar el formulario');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${apiUrl}/api/v1/public/feedback/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment: comment || undefined,
          name: name || undefined,
          email: email || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error al enviar feedback');
        return;
      }

      setResult(data);
      setStep('result');

      // If positive and has Google URL, redirect after delay
      if (data.action === 'redirect_google' && data.googleReviewUrl) {
        setTimeout(() => {
          window.location.href = data.googleReviewUrl;
        }, 3000);
      }
    } catch {
      setError('Error de conexion');
    } finally {
      setSubmitting(false);
    }
  };

  const primaryColor = config?.branding?.primaryColor || '#2563eb';

  // Loading state
  if (step === 'loading') {
    if (error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-lg text-gray-600">{error}</p>
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

  // Result state
  if (step === 'result' && result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            {result.action === 'redirect_google' ? (
              <>
                <div className="mb-4 text-5xl">🎉</div>
                <h2 className="text-xl font-bold text-gray-900">Gracias!</h2>
                <p className="mt-3 text-gray-600">{result.message}</p>
                {result.googleReviewUrl && (
                  <p className="mt-4 text-sm text-gray-500">
                    Redirigiendo a Google en 3 segundos...
                  </p>
                )}
                {result.googleReviewUrl && (
                  <a
                    href={result.googleReviewUrl}
                    className="mt-4 inline-block rounded-lg px-6 py-2 text-sm font-medium text-white transition"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Dejar resena en Google
                  </a>
                )}
              </>
            ) : (
              <>
                <div className="mb-4 text-5xl">🙏</div>
                <h2 className="text-xl font-bold text-gray-900">Gracias por tu feedback</h2>
                <p className="mt-3 text-gray-600">{result.message}</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Rating + Comment form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
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
            <p className="mt-1 text-xs text-gray-400">{config?.name}</p>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Star Rating */}
          {step === 'rate' && (
            <div className="text-center">
              <div className="mb-6 flex justify-center gap-2">
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
                    className="text-4xl transition-transform hover:scale-110 sm:text-5xl"
                    aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
                  >
                    {star <= (hoveredStar || rating) ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Toca una estrella para calificar
              </p>
            </div>
          )}

          {/* Comment + Contact Info */}
          {step === 'comment' && (
            <div>
              {/* Selected rating display */}
              <div className="mb-4 text-center">
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
                  className="mt-1 text-xs text-brand-600 hover:underline"
                >
                  Cambiar calificacion
                </button>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label htmlFor="comment" className="mb-1 block text-sm font-medium text-gray-700">
                  Comentario (opcional)
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Cuentanos mas sobre tu experiencia..."
                />
              </div>

              {/* Optional contact info */}
              <div className="mb-4">
                <label htmlFor="name-input" className="mb-1 block text-sm font-medium text-gray-700">
                  Nombre (opcional)
                </label>
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email-input" className="mb-1 block text-sm font-medium text-gray-700">
                  Email (opcional)
                </label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full rounded-md py-2.5 text-sm font-medium text-white transition disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {submitting ? 'Enviando...' : 'Enviar feedback'}
              </button>
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
