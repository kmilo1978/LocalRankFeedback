'use client';

import { useState } from 'react';

const providers = [
  {
    id: 'openai', name: 'OpenAI', logo: '🟢', description: 'GPT-4o, GPT-3.5. El mas popular.',
    models: [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', desc: 'Rapido y economico' },
      { id: 'gpt-4o', name: 'GPT-4o', desc: 'Mejor calidad' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', desc: 'Economico' },
    ],
  },
  {
    id: 'nvidia', name: 'NVIDIA NIM', logo: '🟩', description: 'Llama, Mixtral via NVIDIA. Gratis para empezar.',
    models: [
      { id: 'meta/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', desc: 'Potente y gratis' },
      { id: 'meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', desc: 'Rapido' },
      { id: 'mistralai/mixtral-8x22b-instruct-v0.1', name: 'Mixtral 8x22B', desc: 'Excelente en español' },
    ],
  },
  {
    id: 'openrouter', name: 'OpenRouter', logo: '🔀', description: 'Acceso a 100+ modelos. Modelos gratis disponibles.',
    models: [
      { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B (GRATIS)', desc: 'Sin costo' },
      { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', desc: 'Rapido' },
      { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', desc: 'Alta calidad' },
      { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (GRATIS)', desc: 'Sin costo' },
    ],
  },
  {
    id: 'groq', name: 'Groq', logo: '⚡', description: 'Ultra rapido. Gratis con limites generosos.',
    models: [
      { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B', desc: 'Rapido y potente' },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', desc: 'Instantaneo' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', desc: 'Buen balance' },
    ],
  },
  {
    id: 'anthropic', name: 'Anthropic (Claude)', logo: '🟠', description: 'Claude 3. Excelente en español y tono profesional.',
    models: [
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', desc: 'Rapido' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', desc: 'Balance' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', desc: 'Premium' },
    ],
  },
  {
    id: 'google', name: 'Google (Gemini)', logo: '🔵', description: 'Gemini 1.5/2.0. Gratis con API key.',
    models: [
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'Gratis y rapido' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'Alta calidad' },
      { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', desc: 'Ultima generacion' },
    ],
  },
];

export default function AiSettingsPage() {
  const [selectedProvider, setSelectedProvider] = useState('openrouter');
  const [selectedModel, setSelectedModel] = useState('meta-llama/llama-3.1-8b-instruct:free');
  const [apiKey, setApiKey] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(300);
  const [brandTone, setBrandTone] = useState('profesional, amable y cercano');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentProvider = providers.find((p) => p.id === selectedProvider);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    // Simulate AI response generation
    await new Promise((r) => setTimeout(r, 2000));
    setTestResult(
      `Hola Maria! Muchas gracias por visitarnos y por tomarte el tiempo de compartir tu experiencia. Nos alegra saber que la atencion fue de tu agrado y que el tratamiento cumplio tus expectativas. Nuestro equipo trabaja cada dia para ofrecer el mejor servicio. Te esperamos en tu proxima visita!`
    );
    setTesting(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuracion de IA</h1>
          <p className="mt-1 text-sm text-gray-600">Elige el proveedor y modelo para generar respuestas automaticas a reseñas</p>
        </div>
        {saved && <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Guardado</span>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Provider selection */}
        <div className="lg:col-span-2 space-y-5">
          {/* Providers */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-semibold text-gray-900">Proveedor de IA</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProvider(p.id); setSelectedModel(p.models[0].id); }}
                  className={`rounded-lg border-2 p-3 text-left transition ${
                    selectedProvider === p.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{p.logo}</span>
                    <span className="text-sm font-medium text-gray-900">{p.name}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">{p.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Model selection */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-semibold text-gray-900">Modelo ({currentProvider?.name})</h3>
            <div className="space-y-2">
              {currentProvider?.models.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition ${
                    selectedModel === m.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input type="radio" name="model" value={m.id} checked={selectedModel === m.id} onChange={() => setSelectedModel(m.id)} className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                  </div>
                  {m.name.includes('GRATIS') && <span className="ml-auto rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Free</span>}
                </label>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-semibold text-gray-900">API Key</h3>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder={`Tu API key de ${currentProvider?.name}...`}
            />
            <p className="mt-2 text-xs text-gray-500">
              {selectedProvider === 'openrouter' && '→ Obtenla gratis en openrouter.ai/keys'}
              {selectedProvider === 'nvidia' && '→ Obtenla gratis en build.nvidia.com'}
              {selectedProvider === 'groq' && '→ Obtenla gratis en console.groq.com/keys'}
              {selectedProvider === 'openai' && '→ Obtenla en platform.openai.com/api-keys'}
              {selectedProvider === 'anthropic' && '→ Obtenla en console.anthropic.com'}
              {selectedProvider === 'google' && '→ Obtenla gratis en aistudio.google.com/apikey'}
            </p>
          </div>

          {/* Brand tone */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-semibold text-gray-900">Tono de marca</h3>
            <textarea
              value={brandTone}
              onChange={(e) => setBrandTone(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Describe el tono que quieres para las respuestas..."
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {['profesional y amable', 'cercano y casual', 'formal y corporativo', 'divertido y fresco', 'empatico y cuidadoso'].map((t) => (
                <button key={t} onClick={() => setBrandTone(t)} className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50">{t}</button>
              ))}
            </div>
          </div>

          {/* Advanced */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-semibold text-gray-900">Avanzado</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Temperatura ({temperature})</label>
                <input type="range" min="0" max="1" step="0.1" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-gray-400"><span>Preciso</span><span>Creativo</span></div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Max tokens</label>
                <select value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option value={150}>150 (corto)</option>
                  <option value={300}>300 (normal)</option>
                  <option value={500}>500 (largo)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Test & Preview */}
        <div>
          <div className="sticky top-6 space-y-4">
            <div className="rounded-lg border bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">Probar</h3>
              <p className="text-xs text-gray-500 mb-3">Genera una respuesta de prueba para ver como queda</p>
              <div className="rounded-md bg-gray-50 p-3 mb-3">
                <p className="text-xs text-gray-500">Reseña de ejemplo:</p>
                <p className="text-sm text-gray-700 mt-1">"Excelente servicio, muy profesionales. El doctor explico todo con detalle."</p>
                <p className="text-xs text-gray-400 mt-1">⭐⭐⭐⭐⭐ - Maria Garcia</p>
              </div>
              <button
                onClick={handleTest}
                disabled={testing}
                className="w-full rounded-md bg-purple-600 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {testing ? '🤖 Generando...' : '🤖 Generar respuesta de prueba'}
              </button>
              {testResult && (
                <div className="mt-3 rounded-md border border-green-200 bg-green-50 p-3">
                  <p className="text-xs font-medium text-green-700 mb-1">Respuesta generada:</p>
                  <p className="text-sm text-green-800">{testResult}</p>
                  <p className="mt-2 text-xs text-green-600">Modelo: {selectedModel} | Provider: {selectedProvider}</p>
                </div>
              )}
            </div>

            <div className="rounded-lg border bg-white p-5 shadow-sm">
              <h3 className="mb-2 font-semibold text-gray-900">Resumen</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Proveedor:</span> <strong>{currentProvider?.name}</strong></p>
                <p><span className="text-gray-500">Modelo:</span> <strong>{currentProvider?.models.find(m => m.id === selectedModel)?.name}</strong></p>
                <p><span className="text-gray-500">Temperatura:</span> {temperature}</p>
                <p><span className="text-gray-500">Tono:</span> {brandTone}</p>
              </div>
            </div>

            <button onClick={handleSave} className="w-full rounded-md bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700">
              Guardar configuracion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
