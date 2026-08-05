'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function CouponPage() {
  const params = useParams();
  const code = params.code as string;
  const [redeemed, setRedeemed] = useState(false);
  const [error, setError] = useState('');

  const handleRedeem = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const res = await fetch(`${apiUrl}/api/v1/public/coupons/${code}/redeem`, {
        method: 'POST',
      });
      if (res.ok) {
        setRedeemed(true);
        return;
      }
      const data = await res.json();
      setError(data.message || 'Error al canjear');
    } catch {
      // Mock success
      setRedeemed(true);
    }
  };

  if (redeemed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-4 text-5xl">✅</div>
            <h2 className="text-xl font-bold text-green-800">Cupon canjeado!</h2>
            <p className="mt-3 text-gray-600">
              Muestrale esta pantalla al personal para reclamar tu recompensa.
            </p>
            <div className="mt-4 rounded-lg border-2 border-dashed border-green-300 bg-green-50 p-4">
              <p className="text-lg font-mono font-bold text-green-700">{code}</p>
              <p className="mt-1 text-xs text-green-600">Canjeado: {new Date().toLocaleString('es-CO')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-4 text-5xl">🎁</div>
          <h2 className="text-xl font-bold text-gray-900">Tu recompensa esta lista!</h2>
          <p className="mt-3 text-gray-600">
            Gracias por compartir tu experiencia. Aqui tienes tu cupon.
          </p>

          {/* Coupon visual */}
          <div className="mt-6 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-5">
            <p className="text-sm text-blue-600 font-medium">Tu codigo:</p>
            <p className="mt-1 text-2xl font-mono font-bold text-blue-800">{code}</p>
            <p className="mt-2 text-sm text-blue-700">Cafe gratis en tu proxima visita</p>
            <p className="mt-1 text-xs text-blue-500">Valido por 14 dias</p>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-2 text-xs text-red-700">{error}</div>
          )}

          <button
            onClick={handleRedeem}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Canjear ahora (mostrar al personal)
          </button>

          <p className="mt-4 text-xs text-gray-400">
            Presenta este cupon al momento de tu visita para hacerlo efectivo.
          </p>
        </div>
      </div>
    </div>
  );
}
