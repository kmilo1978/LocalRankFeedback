'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { mockLocations } from '@/lib/mock-data';

export default function QRGeneratorPage() {
  const [selectedLocation, setSelectedLocation] = useState(mockLocations[0]);
  const [qrDataUrl, setQrDataUrl] = useState('');

  // QR settings
  const [qrSize, setQrSize] = useState(300);
  const [qrColor, setQrColor] = useState('#000000');

  // Card/poster design
  const [cardBgColor, setCardBgColor] = useState('#2563eb');
  const [cardTextColor, setCardTextColor] = useState('#ffffff');
  const [topMessage, setTopMessage] = useState('Tu opinion nos importa');
  const [bottomMessage, setBottomMessage] = useState('Escanea el codigo QR y cuentanos como fue tu experiencia');
  const [ctaText, setCtaText] = useState('Dejanos tu opinion');
  const [logoUrl, setLogoUrl] = useState('');
  const [showLogo, setShowLogo] = useState(true);
  const [cardStyle, setCardStyle] = useState<'modern' | 'minimal' | 'bold' | 'elegant'>('modern');

  const feedbackUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/feedback/${selectedLocation.feedbackSlug}`
    : `https://localrankfeedback.com/feedback/${selectedLocation.feedbackSlug}`;

  useEffect(() => {
    generateQR();
  }, [selectedLocation, qrSize, qrColor]);

  const generateQR = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(feedbackUrl, {
        width: qrSize,
        margin: 2,
        color: {
          dark: qrColor,
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('Error generating QR:', err);
    }
  };

  const downloadPNG = () => {
    const canvas = document.createElement('canvas');
    const width = 600;
    const height = 900;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = cardBgColor;
    ctx.roundRect(0, 0, width, height, 20);
    ctx.fill();

    // Logo or business name
    ctx.fillStyle = cardTextColor;
    if (showLogo && logoUrl) {
      // Logo will be handled as text fallback for now
      ctx.font = 'bold 22px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(selectedLocation.name, width / 2, 60);
    } else {
      ctx.font = 'bold 22px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(selectedLocation.name, width / 2, 60);
    }

    // Top message
    ctx.font = 'bold 32px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(topMessage, width / 2, 130);

    // Bottom message (wrapped)
    ctx.font = '16px -apple-system, sans-serif';
    ctx.fillStyle = cardTextColor + 'cc';
    const words = bottomMessage.split(' ');
    let line = '';
    let y = 170;
    for (const word of words) {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > width - 80) {
        ctx.fillText(line, width / 2, y);
        line = word + ' ';
        y += 22;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, width / 2, y);

    // QR code white background
    const qrBoxSize = 320;
    const qrX = (width - qrBoxSize) / 2;
    const qrY = 220;
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(qrX, qrY, qrBoxSize, qrBoxSize, 16);
    ctx.fill();

    // QR code image
    const img = new Image();
    img.onload = () => {
      const padding = 20;
      ctx.drawImage(img, qrX + padding, qrY + padding, qrBoxSize - padding * 2, qrBoxSize - padding * 2);

      // CTA text below QR
      ctx.fillStyle = cardTextColor;
      ctx.font = 'bold 24px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ctaText, width / 2, qrY + qrBoxSize + 50);

      // Stars decoration
      ctx.font = '28px serif';
      ctx.fillText('⭐⭐⭐⭐⭐', width / 2, qrY + qrBoxSize + 90);

      // URL at bottom
      ctx.fillStyle = cardTextColor + '80';
      ctx.font = '12px -apple-system, sans-serif';
      ctx.fillText(feedbackUrl, width / 2, height - 40);

      // Powered by
      ctx.font = '10px -apple-system, sans-serif';
      ctx.fillText('Powered by LocalRank Feedback', width / 2, height - 20);

      // Download
      const link = document.createElement('a');
      link.download = `qr-poster-${selectedLocation.feedbackSlug}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = qrDataUrl;
  };

  const downloadQROnly = async (format: 'png' | 'svg') => {
    if (format === 'svg') {
      const svgString = await QRCode.toString(feedbackUrl, {
        type: 'svg',
        width: qrSize,
        margin: 2,
        color: { dark: qrColor, light: '#ffffff' },
        errorCorrectionLevel: 'H',
      });
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-${selectedLocation.feedbackSlug}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    // Just the QR as PNG
    const link = document.createElement('a');
    link.download = `qr-${selectedLocation.feedbackSlug}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const printPoster = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Poster - ${selectedLocation.name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
          .poster {
            width: 400px;
            background: ${cardBgColor};
            border-radius: 20px;
            padding: 40px 30px;
            text-align: center;
            color: ${cardTextColor};
          }
          .logo-name { font-size: 16px; font-weight: 600; opacity: 0.9; margin-bottom: 20px; }
          .top-msg { font-size: 26px; font-weight: 700; margin-bottom: 8px; }
          .bottom-msg { font-size: 13px; opacity: 0.8; margin-bottom: 24px; line-height: 1.4; }
          .qr-box { background: white; border-radius: 16px; padding: 20px; display: inline-block; margin-bottom: 20px; }
          .qr-box img { width: 220px; height: 220px; }
          .cta { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
          .stars { font-size: 22px; margin-bottom: 16px; }
          .url { font-size: 9px; opacity: 0.5; word-break: break-all; }
          @media print { body { background: white; } .poster { box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="poster">
          <p class="logo-name">${selectedLocation.name}</p>
          <h1 class="top-msg">${topMessage}</h1>
          <p class="bottom-msg">${bottomMessage}</p>
          <div class="qr-box"><img src="${qrDataUrl}" /></div>
          <p class="cta">${ctaText}</p>
          <p class="stars">⭐⭐⭐⭐⭐</p>
          <p class="url">${feedbackUrl}</p>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(feedbackUrl);
  };

  // Preset styles
  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'modern':
        setCardBgColor('#2563eb'); setCardTextColor('#ffffff'); setQrColor('#000000');
        setTopMessage('Tu opinion nos importa'); setCtaText('Dejanos tu opinion');
        setCardStyle('modern');
        break;
      case 'minimal':
        setCardBgColor('#ffffff'); setCardTextColor('#111827'); setQrColor('#111827');
        setTopMessage('Como fue tu experiencia?'); setCtaText('Escanea aqui');
        setCardStyle('minimal');
        break;
      case 'bold':
        setCardBgColor('#7c3aed'); setCardTextColor('#ffffff'); setQrColor('#4c1d95');
        setTopMessage('Nos encantaria saber tu opinion!'); setCtaText('Escanea y opina');
        setCardStyle('bold');
        break;
      case 'elegant':
        setCardBgColor('#1f2937'); setCardTextColor('#f9fafb'); setQrColor('#1f2937');
        setTopMessage('Valoramos tu experiencia'); setCtaText('Comparte tu opinion');
        setCardStyle('elegant');
        break;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">QR Code Generator</h1>
        <p className="mt-1 text-sm text-gray-600">Personaliza y descarga el QR para tu negocio</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Settings Panel */}
        <div className="space-y-4">
          {/* Location */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-gray-700">Sede</label>
            <select
              value={selectedLocation.id}
              onChange={(e) => {
                const loc = mockLocations.find((l) => l.id === e.target.value);
                if (loc) setSelectedLocation(loc);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {mockLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
            <div className="mt-2 flex gap-2">
              <input type="text" readOnly value={feedbackUrl} className="flex-1 rounded-md border bg-gray-50 px-3 py-1.5 text-xs text-gray-500" />
              <button onClick={copyLink} className="rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50">📋</button>
            </div>
          </div>

          {/* Presets */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-gray-700">Estilo predefinido</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'modern', label: 'Moderno', color: '#2563eb' },
                { id: 'minimal', label: 'Minimal', color: '#ffffff' },
                { id: 'bold', label: 'Vibrante', color: '#7c3aed' },
                { id: 'elegant', label: 'Elegante', color: '#1f2937' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`rounded-md border-2 p-2 text-center text-xs transition ${
                    cardStyle === p.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="mx-auto mb-1 h-6 w-6 rounded-full border" style={{ backgroundColor: p.color }}></div>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-gray-700">Colores</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Fondo</label>
                <div className="flex gap-1.5">
                  <input type="color" value={cardBgColor} onChange={(e) => setCardBgColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded border" />
                  <input type="text" value={cardBgColor} onChange={(e) => setCardBgColor(e.target.value)} className="flex-1 rounded border px-2 text-xs" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Texto</label>
                <div className="flex gap-1.5">
                  <input type="color" value={cardTextColor} onChange={(e) => setCardTextColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded border" />
                  <input type="text" value={cardTextColor} onChange={(e) => setCardTextColor(e.target.value)} className="flex-1 rounded border px-2 text-xs" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">QR Code</label>
                <div className="flex gap-1.5">
                  <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded border" />
                  <input type="text" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="flex-1 rounded border px-2 text-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-gray-700">Logo</h3>
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                id="show-logo"
                checked={showLogo}
                onChange={(e) => setShowLogo(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="show-logo" className="text-sm text-gray-700">Mostrar logo/nombre</label>
            </div>
            {showLogo && (
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="https://tudominio.com/logo.png (opcional)"
              />
            )}
            <p className="mt-1 text-xs text-gray-400">Si no hay logo, se muestra el nombre de la sede</p>
          </div>

          {/* Messages */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-gray-700">Mensajes</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Titulo principal</label>
                <input
                  type="text"
                  value={topMessage}
                  onChange={(e) => setTopMessage(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Tu opinion nos importa"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Descripcion</label>
                <input
                  type="text"
                  value={bottomMessage}
                  onChange={(e) => setBottomMessage(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Escanea el codigo y cuentanos..."
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Texto CTA (debajo del QR)</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Dejanos tu opinion"
                />
              </div>
            </div>
          </div>

          {/* Download Actions */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-gray-700">Descargar</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={downloadPNG} className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                📥 Poster PNG
              </button>
              <button onClick={printPoster} className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                🖨️ Imprimir Poster
              </button>
              <button onClick={() => downloadQROnly('png')} className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                📥 Solo QR (PNG)
              </button>
              <button onClick={() => downloadQROnly('svg')} className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                📥 Solo QR (SVG)
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <div className="sticky top-6">
            <p className="mb-3 text-center text-sm font-medium text-gray-700">Vista previa</p>

            {/* Poster preview */}
            <div
              className="mx-auto max-w-[320px] rounded-2xl p-8 text-center shadow-xl transition-all"
              style={{ backgroundColor: cardBgColor, color: cardTextColor }}
            >
              {/* Logo / Name */}
              {showLogo && (
                <div className="mb-4">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="mx-auto h-8 w-auto object-contain" />
                  ) : (
                    <p className="text-sm font-semibold opacity-90">{selectedLocation.name}</p>
                  )}
                </div>
              )}

              {/* Top message */}
              <h2 className="text-xl font-bold leading-tight">{topMessage}</h2>

              {/* Description */}
              <p className="mt-2 text-xs opacity-80 leading-relaxed">{bottomMessage}</p>

              {/* QR */}
              <div className="mx-auto mt-5 inline-block rounded-xl bg-white p-4">
                {qrDataUrl && (
                  <img src={qrDataUrl} alt="QR" className="h-44 w-44" />
                )}
              </div>

              {/* CTA */}
              <p className="mt-4 text-lg font-bold">{ctaText}</p>

              {/* Stars */}
              <p className="mt-1 text-base">⭐⭐⭐⭐⭐</p>

              {/* URL */}
              <p className="mt-4 text-[9px] opacity-40 break-all">{feedbackUrl}</p>
            </div>

            {/* Size selector below preview */}
            <div className="mt-4 text-center">
              <label className="text-xs text-gray-500">Resolucion QR: </label>
              <select
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="rounded border px-2 py-1 text-xs"
              >
                <option value={200}>200px</option>
                <option value={300}>300px</option>
                <option value={400}>400px</option>
                <option value={600}>600px HD</option>
                <option value={800}>800px Print</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
