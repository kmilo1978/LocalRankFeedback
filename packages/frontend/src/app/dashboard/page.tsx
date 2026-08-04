'use client';

import { useEffect, useState } from 'react';

interface Stats {
  total: number;
  averageRating: number;
  directedToGoogle: number;
  distribution: Record<number, number>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real stats from API once location is selected
    // For now, show placeholder data
    setStats({
      total: 47,
      averageRating: 4.2,
      directedToGoogle: 35,
      distribution: { 1: 2, 2: 3, 3: 5, 4: 12, 5: 25 },
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-brand-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Feedback"
          value={stats?.total.toString() || '0'}
          icon="📝"
        />
        <StatCard
          label="Rating Promedio"
          value={stats?.averageRating.toFixed(1) || '0'}
          icon="⭐"
        />
        <StatCard
          label="Dirigidos a Google"
          value={stats?.directedToGoogle.toString() || '0'}
          icon="🔗"
          subtitle={`${stats ? Math.round((stats.directedToGoogle / stats.total) * 100) : 0}% del total`}
        />
        <StatCard
          label="Tickets Abiertos"
          value="3"
          icon="🎫"
          subtitle="Requieren atencion"
        />
      </div>

      {/* Rating Distribution */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Distribucion de Ratings
        </h2>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats?.distribution[star] || 0;
            const total = stats?.total || 1;
            const percentage = Math.round((count / total) * 100);

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-8 text-sm font-medium text-gray-700">
                  {star}⭐
                </span>
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-16 text-right text-sm text-gray-600">
                  {count} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  subtitle,
}: {
  label: string;
  value: string;
  icon: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
      {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
}
