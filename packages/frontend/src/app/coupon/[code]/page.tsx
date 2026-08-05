'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface CouponInfo {
  code: string;
  rewardTitle: string;
  rewardDescription: string;
  expiresAt: string | null;
  status: 'valid' | 'redeemed' | 'expired' | 'not_found';
  redeemedAt?: string;
  locationName?: string;
}

export default function CouponPage() {
  const params = useParams();
  const code = params.code as string;
  const [coupon, setCoupon] = useState<CouponInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    verifyCoupon();
  }, [code]);

  const verifyCoupon = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/public/coupons/${code}/verify`);
      if (res.ok) {
        const data = await res.json();
        setCoupon(data);
        setLoading(false);
        return;
      }
    } catch {
      // Backend not available, use mock
    }

    // Mock: simulate a valid single-use coupon
    setCoupon({
      code,
      rewardTitle: 'Cafe gratis',
      rewardDescription: 'Disfruta un cafe gratis en tu proxima visita como agradecimiento',
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'valid',
      locationName: 'Clinica Dental Sonrisa',
    });
    setLoading(false);
  };

  const handleRedeem = async () => {
    setRedeeming(true);
    setError('');

    try {
      const res = await fetch(`${apiUrl}/api/v1/public/coupons/${code}/redeem`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setCoupon({
          ...coupon!,
          status: 'redeemed',
          redeemedAt: new Date().toISOString(),
        });
        setRedeeming(false);
        return;
      }
      const data = await res.json();
      setError(data.message || 'Error al canjear');
    } catch {
      // Mock: mark as redeemed
      setCoupon({
        ...coupon!,
        status: 'redeemed',
        redeemedAt: new Date().toISOString(),
      });
    }
    setRedeeming(false);
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Verificando cupon...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (!coupon || coupon.status === 'not_found') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-4 text-5xl">❌</div>
            <h2 className="text-xl font-bold text-gray-900">Cupon no encontrado</h2>
            <p className="mt-3 text-gray-600">
              Este codigo no existe o el enlace es incorrecto.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Already redeemed
  if (coupon.status === 'redeemed') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-4 text-5xl">✅</div>
            <h2 className="text-xl font-bold text-green-800">Cupon canjeado</h2>
            <p className="mt-3 text-gray-600">
              Este cupon ya fue utilizado. Cada cupon es de un solo uso.
            </p>
            <div className="mt-4 rounded-lg border-2 border-dashed border-green-300 bg-green-50 p-4">
              <p className="text-sm text-green-600 font-medium">Codigo usado:</p>
              <p className="text-lg font-mono font-bold text-green-700">{coupon.code}</p>
              {coupon.redeemedAt && (
                <p className="mt-2 text-xs text-green-600">
                  Canjeado: {new Date(coupon.redeemedAt).toLocaleString('es-CO')}
                </p>
              )}
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Si tienes dudas, contacta al negocio directamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Expired
  if (coupon.status === 'expired' || (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-4 text-5xl">⏰</div>
            <h2 className="text-xl font-bold text-gray-900">Cupon expirado</h2>
            <p className="mt-3 text-gray-600">
              Lo sentimos, este cupon ya no es valido. Cada cupon tiene una fecha de vencimiento.
            </p>
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500 font-mono">{coupon.code}</p>
              {coupon.expiresAt && (
                <p className="mt-1 text-xs text-gray-400">
                  Expiro: {new Date(coupon.expiresAt).toLocaleDateString('es-CO')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Valid - ready to redeem (single use)
  const daysLeft = coupon.expiresAt
    ? Math.ceil((new Date(coupon.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-4 text-5xl">🎁</div>
          <h2 className="text-xl font-bold text-gray-900">{coupon.rewardTitle}</h2>
          <p className="mt-2 text-gray-600">{coupon.rewardDescription}</p>

          {coupon.locationName && (
            <p className="mt-1 text-sm text-blue-600 font-medium">{coupon.locationName}</p>
          )}

          {/* Coupon visual */}
          <div className="mt-6 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-5">
            <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">Codigo unico</p>
            <p className="mt-2 text-3xl font-mono font-bold text-blue-800 tracking-wider">{coupon.code}</p>
            {daysLeft !== null && (
              <p className="mt-3 text-xs text-blue-600">
                {daysLeft > 0
                  ? `Valido por ${daysLeft} dia${daysLeft > 1 ? 's' : ''} mas`
                  : 'Expira hoy'}
              </p>
            )}
          </div>

          {/* Single use warning */}
          <div className="mt-4 flex items-center justify-center gap-1.5 rounded-md bg-amber-50 border border-amber-200 p-2.5">
            <span className="text-sm">⚠️</span>
            <p className="text-xs font-medium text-amber-800">
              Este cupon es de un solo uso. Una vez canjeado no podra usarse de nuevo.
            </p>
          </div>

          {error && (
            <div className="mt-3 rounded-md bg-red-50 p-2 text-xs text-red-700">{error}</div>
          )}

          <button
            onClick={handleRedeem}
            disabled={redeeming}
            className="mt-5 w-full rounded-lg bg-blue-600 py-3.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {redeeming ? 'Canjeando...' : 'Canjear cupon'}
          </button>

          <p className="mt-3 text-xs text-gray-400">
            Muestra esta pantalla al personal del negocio al momento de tu visita.
          </p>
        </div>
      </div>
    </div>
  );
}
