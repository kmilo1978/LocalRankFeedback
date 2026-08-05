'use client';

import { mockStats, mockFeedbackList } from '@/lib/mock-data';

export default function DashboardPage() {
  const stats = mockStats;
  const recentFeedback = mockFeedbackList.slice(0, 5);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          Demo Mode
        </span>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Feedback"
          value={stats.total.toString()}
          icon="📝"
          trend="+12 esta semana"
        />
        <StatCard
          label="Rating Promedio"
          value={stats.averageRating.toFixed(1)}
          icon="⭐"
          trend="+0.2 vs mes anterior"
        />
        <StatCard
          label="Dirigidos a Google"
          value={stats.directedToGoogle.toString()}
          icon="🔗"
          trend={`${Math.round((stats.directedToGoogle / stats.total) * 100)}% del total`}
        />
        <StatCard
          label="Tickets Abiertos"
          value="2"
          icon="🎫"
          trend="Requieren atencion"
          alert
        />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Rating Distribution */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Distribucion de Ratings
          </h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star] || 0;
              const total = stats.total || 1;
              const percentage = Math.round((count / total) * 100);

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-12 text-sm font-medium text-gray-700">
                    {star} {'⭐'}
                  </span>
                  <div className="h-5 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: star >= 4 ? '#22c55e' : star === 3 ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </div>
                  <span className="w-20 text-right text-sm text-gray-600">
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Feedback Reciente
          </h2>
          <div className="space-y-3">
            {recentFeedback.map((fb) => (
              <div key={fb.id} className="flex items-start gap-3 rounded-md border p-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="text-xs">
                      {s <= fb.rating ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm text-gray-900">
                    {fb.comment || '(Sin comentario)'}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {fb.contact?.name || 'Anonimo'} - {formatTimeAgo(fb.createdAt)}
                  </p>
                </div>
                {fb.directedToGoogle ? (
                  <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    Google
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">
                    Privado
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6 rounded-lg border bg-blue-50 p-5">
        <h3 className="font-medium text-blue-900">Links rapidos para probar</h3>
        <div className="mt-2 flex flex-wrap gap-3">
          <a
            href="/feedback/clinica-sonrisa-centro"
            target="_blank"
            className="rounded-md bg-white px-3 py-1.5 text-sm text-blue-700 shadow-sm hover:bg-blue-100"
          >
            📋 Formulario Feedback (Centro)
          </a>
          <a
            href="/feedback/clinica-sonrisa-norte"
            target="_blank"
            className="rounded-md bg-white px-3 py-1.5 text-sm text-blue-700 shadow-sm hover:bg-blue-100"
          >
            📋 Formulario Feedback (Norte)
          </a>
          <a
            href="/dashboard/tickets"
            className="rounded-md bg-white px-3 py-1.5 text-sm text-blue-700 shadow-sm hover:bg-blue-100"
          >
            🎫 Ver Tickets
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  trend,
  alert,
}: {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  alert?: boolean;
}) {
  return (
    <div className={`rounded-lg border bg-white p-5 shadow-sm ${alert ? 'border-orange-200' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        {alert && <span className="h-2 w-2 rounded-full bg-orange-500"></span>}
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
      {trend && <p className="mt-1 text-xs text-gray-400">{trend}</p>}
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Hace un momento';
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Ayer';
  return `Hace ${days} dias`;
}
