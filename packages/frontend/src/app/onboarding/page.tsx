'use client';

import { useState } from 'react';

type Step = 'negocio' | 'sede' | 'branding' | 'plataformas' | 'listo';

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>('negocio');
  const [data, setData] = useState({
    businessName: '', industry: '', name: '', email: '', phone: '',
    locationName: '', address: '', googleReviewUrl: '',
    primaryColor: '#2563eb', bannerColor: '#2563eb', topMessage: 'Tu opinion nos importa',
    platforms: ['google'],
  });

  const steps: { key: Step; label: string; icon: string }[] = [
    { key: 'negocio', label: 'Tu negocio', icon: '1' },
    { key: 'sede', label: 'Sede', icon: '2' },
    { key: 'branding', label: 'Diseño', icon: '3' },
    { key: 'plataformas', label: 'Plataformas', icon: '4' },
    { key: 'listo', label: 'Listo', icon: '5' },
  ];
  const currentIndex = steps.findIndex((s) => s.key === step);
  const next = () => { const n = steps[currentIndex + 1]; if (n) setStep(n.key); };
  const back = () => { const p = steps[currentIndex - 1]; if (p) setStep(p.key); };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Progress */}
      <div className="mx-auto max-w-2xl px-4 mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${i <= currentIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s.icon}</div>
              {i < steps.length - 1 && <div className={`mx-1 h-1 w-8 rounded sm:w-16 ${i < currentIndex ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          {steps.map((s) => <span key={s.key}>{s.label}</span>)}
        </div>
      </div>

      {/* Card */}
      <div className="mx-auto max-w-lg px-4">
        <div className="rounded-xl bg-white p-8 shadow-lg">

          {step === 'negocio' && (<div>
            <h2 className="text-xl font-bold text-gray-900">Cuentanos sobre tu negocio</h2>
            <p className="mt-1 text-sm text-gray-600">Configuracion inicial - toma 2 minutos</p>
            <div className="mt-6 space-y-4">
              <div><label className="mb-1 block text-sm font-medium text-gray-700">Nombre del negocio *</label><input type="text" value={data.businessName} onChange={(e)=>setData({...data,businessName:e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Clinica Dental Sonrisa" /></div>
              <div><label className="mb-1 block text-sm font-medium text-gray-700">Industria</label><select value={data.industry} onChange={(e)=>setData({...data,industry:e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"><option value="">Selecciona...</option><option value="dental">Clinica Dental</option><option value="fisio">Fisioterapia</option><option value="estetica">Estetica / Belleza</option><option value="gym">Gimnasio / Fitness</option><option value="medico">Consultorio Medico</option><option value="veterinaria">Veterinaria</option><option value="restaurante">Restaurante</option><option value="otro">Otro</option></select></div>
              <div><label className="mb-1 block text-sm font-medium text-gray-700">Tu nombre *</label><input type="text" value={data.name} onChange={(e)=>setData({...data,name:e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Dr. Juan Perez" /></div>
              <div><label className="mb-1 block text-sm font-medium text-gray-700">WhatsApp para alertas *</label><input type="tel" value={data.phone} onChange={(e)=>setData({...data,phone:e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="+57 300 123 4567" /></div>
            </div>
          </div>)}

          {step === 'sede' && (<div>
            <h2 className="text-xl font-bold text-gray-900">Configura tu primera sede</h2>
            <p className="mt-1 text-sm text-gray-600">Puedes agregar mas sedes despues desde el panel</p>
            <div className="mt-6 space-y-4">
              <div><label className="mb-1 block text-sm font-medium text-gray-700">Nombre de la sede</label><input type="text" value={data.locationName} onChange={(e)=>setData({...data,locationName:e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Sede Principal" /></div>
              <div><label className="mb-1 block text-sm font-medium text-gray-700">Direccion</label><input type="text" value={data.address} onChange={(e)=>setData({...data,address:e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Calle 50 #10-20, Bogota" /></div>
              <div><label className="mb-1 block text-sm font-medium text-gray-700">Link de Google Reviews</label><input type="url" value={data.googleReviewUrl} onChange={(e)=>setData({...data,googleReviewUrl:e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="https://g.page/r/XXXXX/review" /><p className="mt-1 text-xs text-gray-400">Busca tu negocio en Google Maps → "Escribir reseña" → copia el link</p></div>
            </div>
          </div>)}

          {step === 'branding' && (<div>
            <h2 className="text-xl font-bold text-gray-900">Personaliza tu formulario</h2>
            <p className="mt-1 text-sm text-gray-600">Tus clientes veran esto al calificar</p>
            <div className="mt-6 space-y-4">
              <div><label className="mb-2 block text-sm font-medium text-gray-700">Color principal</label><div className="flex gap-3">{['#2563eb','#059669','#7c3aed','#dc2626','#d97706','#0891b2'].map((c)=>(<button key={c} onClick={()=>setData({...data,primaryColor:c,bannerColor:c})} className={`h-9 w-9 rounded-full border-2 transition ${data.primaryColor===c?'border-gray-900 scale-110':'border-transparent hover:scale-105'}`} style={{backgroundColor:c}} />))}</div></div>
              <div><label className="mb-1 block text-sm font-medium text-gray-700">Mensaje del formulario</label><input type="text" value={data.topMessage} onChange={(e)=>setData({...data,topMessage:e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" /></div>
              <div className="rounded-lg border overflow-hidden"><div className="px-4 py-3 text-center text-white text-sm font-bold" style={{backgroundColor:data.bannerColor}}>{data.businessName||'Tu Negocio'}</div><div className="bg-white p-4 text-center"><p className="font-medium text-gray-800 text-sm">{data.topMessage}</p><p className="mt-2 text-xl">☆ ☆ ☆ ☆ ☆</p></div></div>
            </div>
          </div>)}

          {step === 'plataformas' && (<div>
            <h2 className="text-xl font-bold text-gray-900">Donde enviar las reseñas?</h2>
            <p className="mt-1 text-sm text-gray-600">Cuando un cliente da 4-5 estrellas, lo enviamos a estas plataformas</p>
            <div className="mt-6 space-y-3">
              {[{id:'google',name:'Google Maps',icon:'🔍',desc:'La mas importante para SEO local'},{id:'doctoralia',name:'Doctoralia',icon:'👨‍⚕️',desc:'Para profesionales de salud'},{id:'facebook',name:'Facebook',icon:'📘',desc:'Si tienes pagina activa'},{id:'tripadvisor',name:'TripAdvisor',icon:'🦉',desc:'Restaurantes y turismo'},{id:'trustpilot',name:'Trustpilot',icon:'⭐',desc:'Servicios y e-commerce'}].map((p)=>(
                <label key={p.id} className={`flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition ${data.platforms.includes(p.id)?'border-blue-500 bg-blue-50':'border-gray-200 hover:border-gray-300'}`}><input type="checkbox" checked={data.platforms.includes(p.id)} onChange={(e)=>{if(e.target.checked)setData({...data,platforms:[...data.platforms,p.id]});else setData({...data,platforms:data.platforms.filter(x=>x!==p.id)})}} className="h-4 w-4 rounded border-gray-300" /><span className="text-xl">{p.icon}</span><div><p className="text-sm font-medium text-gray-900">{p.name}</p><p className="text-xs text-gray-500">{p.desc}</p></div></label>
              ))}
            </div>
          </div>)}

          {step === 'listo' && (<div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-gray-900">Todo listo!</h2>
            <p className="mt-2 text-gray-600">Tu cuenta esta configurada. Descarga tu QR y ponlo en recepcion.</p>
            <div className="mt-5 space-y-2 text-left rounded-lg bg-gray-50 p-4 text-sm"><p><strong>Negocio:</strong> {data.businessName}</p><p><strong>Sede:</strong> {data.locationName||'Principal'}</p><p><strong>Plataformas:</strong> {data.platforms.join(', ')}</p><p><strong>WhatsApp alertas:</strong> {data.phone}</p></div>
            <div className="mt-6 space-y-3"><a href="/dashboard/qr" className="block w-full rounded-md bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 text-center">Descargar mi QR</a><a href="/dashboard" className="block w-full rounded-md border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 text-center">Ir al panel</a></div>
          </div>)}

          {step !== 'listo' && (<div className="mt-8 flex justify-between">{currentIndex>0?(<button onClick={back} className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Atras</button>):<div/>}<button onClick={next} className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">Siguiente</button></div>)}

        </div>
      </div>
    </div>
  );
}
