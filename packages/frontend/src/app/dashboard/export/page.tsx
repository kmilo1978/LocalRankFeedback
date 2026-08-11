'use client';

import { useState } from 'react';
import { mockContacts } from '@/lib/mock-data';

export default function ExportPage() {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [segment, setSegment] = useState('all');
  const [fields, setFields] = useState(['name', 'email', 'phone', 'source', 'feedbackCount']);

  const toggleField = (field: string) => {
    if (fields.includes(field)) setFields(fields.filter((f) => f !== field));
    else setFields([...fields, field]);
  };

  const handleExport = async () => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 1000));

    if (format === 'csv') {
      const headers = fields.join(',');
      const rows = mockContacts.map((c: any) => fields.map((f) => c[f] || '').join(','));
      const csv = [headers, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `localrank-contactos-${segment}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const data = mockContacts.map((c: any) => {
        const obj: any = {};
        fields.forEach((f) => { obj[f] = c[f]; });
        return obj;
      });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `localrank-contactos-${segment}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    setExporting(false);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exportar Contactos</h1>
        <p className="mt-1 text-sm text-gray-600">Descarga tus contactos para Google Ads Customer Match, email marketing o CRM externo</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          {/* Segment */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-semibold text-gray-900">Segmento</h3>
            <div className="space-y-2">
              {[
                { id: 'all', label: 'Todos los contactos', count: 347 },
                { id: 'promoters', label: 'Promotores (4-5 estrellas)', count: 264 },
                { id: 'detractors', label: 'Detractores (1-3 estrellas)', count: 48 },
                { id: 'with_consent', label: 'Con consentimiento marketing', count: 198 },
                { id: 'referrers', label: 'Con referidos activos', count: 24 },
                { id: 'recent', label: 'Ultimos 30 dias', count: 89 },
              ].map((s) => (
                <label key={s.id} className={`flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition ${segment === s.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="segment" value={s.id} checked={segment === s.id} onChange={() => setSegment(s.id)} className="h-4 w-4 text-blue-600" />
                  <div className="flex-1 flex justify-between"><span className="text-sm text-gray-900">{s.label}</span><span className="text-xs text-gray-500">{s.count}</span></div>
                </label>
              ))}
            </div>
          </div>

          {/* Fields */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-semibold text-gray-900">Campos a incluir</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'name', label: 'Nombre' },
                { id: 'email', label: 'Email' },
                { id: 'phone', label: 'Telefono' },
                { id: 'source', label: 'Fuente' },
                { id: 'feedbackCount', label: 'Num. feedback' },
                { id: 'createdAt', label: 'Fecha registro' },
              ].map((f) => (
                <label key={f.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={fields.includes(f.id)} onChange={() => toggleField(f.id)} className="h-4 w-4 rounded border-gray-300" />
                  {f.label}
                </label>
              ))}
            </div>
          </div>

          {/* Format + Export */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-semibold text-gray-900">Formato</h3>
            <div className="flex gap-3 mb-4">
              <button onClick={() => setFormat('csv')} className={`flex-1 rounded-md border-2 p-3 text-center text-sm ${format === 'csv' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <p className="font-medium">📄 CSV</p>
                <p className="text-xs text-gray-500">Excel, Google Ads</p>
              </button>
              <button onClick={() => setFormat('json')} className={`flex-1 rounded-md border-2 p-3 text-center text-sm ${format === 'json' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <p className="font-medium">📋 JSON</p>
                <p className="text-xs text-gray-500">APIs, CRMs</p>
              </button>
            </div>
            <button onClick={handleExport} disabled={exporting} className="w-full rounded-md bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {exporting ? 'Exportando...' : exported ? '✅ Descargado!' : `Exportar ${format.toUpperCase()}`}
            </button>
          </div>
        </div>

        {/* Use cases */}
        <div className="rounded-lg border bg-white p-5 shadow-sm h-fit">
          <h3 className="mb-4 font-semibold text-gray-900">Para que usar la exportacion?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3"><span className="text-xl">📊</span><div><p className="text-sm font-medium text-gray-900">Google Ads Customer Match</p><p className="text-xs text-gray-500">Sube emails/telefonos de promotores para crear audiencias similares</p></div></div>
            <div className="flex items-start gap-3"><span className="text-xl">📧</span><div><p className="text-sm font-medium text-gray-900">Email Marketing</p><p className="text-xs text-gray-500">Importa a Mailchimp, SendGrid o ActiveCampaign para newsletters</p></div></div>
            <div className="flex items-start gap-3"><span className="text-xl">📱</span><div><p className="text-sm font-medium text-gray-900">WhatsApp Broadcast</p><p className="text-xs text-gray-500">Lista de telefonos con consentimiento para envios masivos</p></div></div>
            <div className="flex items-start gap-3"><span className="text-xl">🔄</span><div><p className="text-sm font-medium text-gray-900">CRM Externo</p><p className="text-xs text-gray-500">Sincroniza con HubSpot, Salesforce, Pipedrive, etc.</p></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
