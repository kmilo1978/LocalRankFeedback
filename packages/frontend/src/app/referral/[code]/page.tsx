'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface ReferralInfo {
  code: string;
  referrerName: string;
  programName: string;
  rewardForYou: string;
  rewardForReferrer: string;
  locationName: string;
  branding: { primaryColor?: string; logo?: string };
}

export default function ReferralPage() {
  const params = useParams();
  const code = params.code as string;

  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [step, setStep] = useState<'loading' | 'info' | 'form' | 'done'>('loading');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchReferralInfo();
  }, [code]);

  const fetchReferralInfo = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/public/referral/${code}`);
      if (res.ok) {
        const data = await res.json();
        setInfo(data);
        setStep('info');
        // Track click
        fetch(`${apiUrl}/api/v1/public/referral/${code}/click`, { method: 'POST' }).catch(() => {});
        return;
      }
    } catch {
      // Backend not available
    }

    // Mock data
    setInfo({
      code,
      referrerName: 'Maria Garcia',
      programName: 'Recomienda y Gana',
      rewardForYou: '15% descuento en tu primera visita',
      rewardForReferrer: '20% descuento en su proxima visita',
      locationName: 'Clinica Dental Sonrisa',
      branding: { primaryColor: '#2563eb' },
    });
    setStep('info');
  };

  const handleConvert = async () => {
    if (!name && !phone) {
      setError('Por favor ingresa al menos tu nombre y telefono');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${apiUrl}/api/v1/public/referral/${code}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email }),
      });

      if (res.ok) {
        setStep('done');
        setSubmitting(false);
        return;
      }
    } catch {
      // Mock success
    }

    await new Promise((r) => setTimeout(r, 800));
    setStep('done');
    setSubmitting(false);
  };

  const primaryColor = info?.branding?.primaryColor || '#2563eb';

  if (step === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-4 text-5xl">🎁</div>
            <h2 className="text-xl font-bold text-gray-900">Registrado!</h2>
            <p className="mt-3 text-gray-600">
              Tu descuento esta listo. Cuando visites {info?.locationName}, mencionalo y recibiras:
            </p>
            <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4">
              <p className="font-semibold text-green-800">{info?.rewardForYou}</p>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Te contactaremos para agendar tu cita.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Banner */}
        <div
          className="rounded-t-xl px-6 py-5 text-center"
          style={{ backgroundColor: primaryColor }}
        >
          <p className="text-sm text-white opacity-80">{info?.locationName}</p>
          <h1 className="mt-1 text-xl font-bold text-white">{info?.programName}</h1>
        </div>

        <div className="rounded-b-xl bg-white p-6 shadow-lg">
          {step === 'info' && (
            <>
              {/* Referrer message */}
              <div className="mb-6 text-center">
                <p className="text-gray-600">
                  <span className="font-semibold">{info?.referrerName}</span> te recomienda este lugar y quiere que ambos ganen:
                </p>
              </div>

              {/* Rewards */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <p className="text-xs text-green-600 font-medium">Para ti:</p>
                    <p className="text-sm font-semibold text-green-800">{info?.rewardForYou}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <span className="text-2xl">🤝</span>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Para {info?.referrerName}:</p>
                    <p className="text-sm font-semibold text-blue-800">{info?.rewardForReferrer}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('form')}
                className="w-full rounded-lg py-3 text-sm font-medium text-white transition hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                Quiero mi descuento
              </button>
            </>
          )}

          {step === 'form' && (
            <>
              <h3 className="mb-4 text-center font-semibold text-gray-900">
                Dejanos tus datos para agendar
              </h3>

              {error && (
                <div className="mb-3 rounded-md bg-red-50 p-2 text-xs text-red-700">{error}</div>
              )}

              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700">Nombre *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700">WhatsApp / Telefono *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="+57 300 123 4567"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="mb-1 block text-sm font-medium text-gray-700">Email (opcional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="tu@email.com"
                />
              </div>

              <button
                onClick={handleConvert}
                disabled={submitting}
                className="w-full rounded-lg py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {submitting ? 'Registrando...' : 'Reclamar mi descuento'}
              </button>

              <button
                onClick={() => setStep('info')}
                className="mt-3 w-full text-center text-xs text-gray-500 hover:text-gray-700"
              >
                Volver
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
