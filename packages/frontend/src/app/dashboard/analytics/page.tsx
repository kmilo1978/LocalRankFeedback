'use client';

export default function AnalyticsPage() {
  const nps = 72;
  const weeklyData = [
    { day: 'Lun', feedback: 8, google: 5 },
    { day: 'Mar', feedback: 12, google: 9 },
    { day: 'Mie', feedback: 6, google: 4 },
    { day: 'Jue', feedback: 15, google: 11 },
    { day: 'Vie', feedback: 18, google: 14 },
    { day: 'Sab', feedback: 10, google: 7 },
    { day: 'Dom', feedback: 4, google: 3 },
  ];
  const maxFeedback = Math.max(...weeklyData.map(d => d.feedback));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Analytics</h1>

      {/* Top metrics */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="NPS Score" value={nps.toString()} color="blue" subtitle={nps > 50 ? 'Excelente' : 'Bueno'} />
        <MetricCard label="Tasa de respuesta" value="42%" color="green" subtitle="+5% vs mes anterior" />
        <MetricCard label="Rating Google" value="4.7" color="yellow" subtitle="De 4.2 hace 60 dias" />
        <MetricCard label="Clientes recuperados" value="12" color="purple" subtitle="De 14 tickets este mes" />
      </div>

      {/* Chart - Weekly feedback */}
      <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-gray-900">Feedback esta semana</h3>
        <div className="flex items-end gap-3 h-40">
          {weeklyData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center gap-0.5">
                <div className="w-full rounded-t bg-blue-500" style={{ height: `${(d.feedback / maxFeedback) * 120}px` }} title={`${d.feedback} feedback`}></div>
                <div className="w-full rounded-t bg-green-400" style={{ height: `${(d.google / maxFeedback) * 120}px` }} title={`${d.google} a Google`}></div>
              </div>
              <span className="text-xs text-gray-500">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-blue-500"></span> Total feedback</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-green-400"></span> Dirigidos a Google</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* NPS Gauge */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">Net Promoter Score (NPS)</h3>
          <div className="text-center">
            <div className="relative mx-auto h-32 w-32">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#2563eb" strokeWidth="12" strokeDasharray={`${nps * 2.51} 251`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{nps}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">Promotores: 78% | Detractores: 6%</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded bg-green-50 p-2"><p className="font-bold text-green-700">78%</p><p className="text-gray-500">Promotores (4-5)</p></div>
            <div className="rounded bg-gray-50 p-2"><p className="font-bold text-gray-700">16%</p><p className="text-gray-500">Neutros (3)</p></div>
            <div className="rounded bg-red-50 p-2"><p className="font-bold text-red-700">6%</p><p className="text-gray-500">Detractores (1-2)</p></div>
          </div>
        </div>

        {/* Channel performance */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">Rendimiento por canal</h3>
          <div className="space-y-4">
            <ChannelRow icon="📷" name="QR en recepcion" sent={120} responses={52} rate={43} />
            <ChannelRow icon="📱" name="WhatsApp" sent={85} responses={38} rate={45} />
            <ChannelRow icon="💬" name="SMS" sent={40} responses={14} rate={35} />
            <ChannelRow icon="📧" name="Email" sent={60} responses={12} rate={20} />
          </div>
        </div>

        {/* Top keywords from feedback */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">Temas frecuentes en feedback</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { word: 'atencion', count: 23, sentiment: 'positive' },
              { word: 'puntualidad', count: 18, sentiment: 'positive' },
              { word: 'profesional', count: 15, sentiment: 'positive' },
              { word: 'espera', count: 12, sentiment: 'negative' },
              { word: 'limpieza', count: 10, sentiment: 'positive' },
              { word: 'precio', count: 8, sentiment: 'neutral' },
              { word: 'amable', count: 7, sentiment: 'positive' },
              { word: 'demora', count: 6, sentiment: 'negative' },
              { word: 'recomendado', count: 5, sentiment: 'positive' },
            ].map((t) => (
              <span key={t.word} className={`rounded-full px-3 py-1 text-xs font-medium ${
                t.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                t.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {t.word} ({t.count})
              </span>
            ))}
          </div>
        </div>

        {/* Conversion funnel */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">Embudo de conversion</h3>
          <div className="space-y-3">
            <FunnelStep label="Formularios abiertos" value={320} percentage={100} />
            <FunnelStep label="Calificaron" value={210} percentage={66} />
            <FunnelStep label="Dejaron comentario" value={145} percentage={45} />
            <FunnelStep label="Fueron a Google" value={98} percentage={31} />
            <FunnelStep label="Confirmaron reseña" value={72} percentage={23} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color, subtitle }: { label: string; value: string; color: string; subtitle: string }) {
  const colors: Record<string, string> = { blue: 'text-blue-600', green: 'text-green-600', yellow: 'text-yellow-600', purple: 'text-purple-600' };
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
      <p className="text-sm text-gray-700">{label}</p>
      <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}

function ChannelRow({ icon, name, sent, responses, rate }: { icon: string; name: string; sent: number; responses: number; rate: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between text-sm"><span className="text-gray-700">{name}</span><span className="font-medium text-gray-900">{rate}%</span></div>
        <div className="mt-1 h-2 rounded-full bg-gray-100"><div className="h-full rounded-full bg-blue-500" style={{ width: `${rate}%` }} /></div>
        <p className="mt-0.5 text-xs text-gray-400">{responses}/{sent} respuestas</p>
      </div>
    </div>
  );
}

function FunnelStep({ label, value, percentage }: { label: string; value: number; percentage: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm"><span className="text-gray-700">{label}</span><span className="font-medium">{value} ({percentage}%)</span></div>
      <div className="mt-1 h-3 rounded-full bg-gray-100"><div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${percentage}%` }} /></div>
    </div>
  );
}
