'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { mockLocations } from '@/lib/mock-data';

export default function QRGeneratorPage() {
  const [selectedLocation, setSelectedLocation] = useState(mockLocations[0]);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrSize, setQrSize] = useState(300);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [includeText, setIncludeText] = useState(true);
  const [customText, setCustomText] = useState('Dejanos tu opinion');
  const [logoInclude, setLogoInclude] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const feedbackUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/feedback/${selectedLocation.feedbackSlug}`
    : `https://localrankfeedback.com/feedback/${selectedLocation.feedbackSlug}`;

  useEffect(() => {
    generateQR();
  }, [selectedLocation, qrSize, fgColor, bgColor]);

  const generateQR = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(feedbackUrl, {
        width: qrSize,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: 'H',
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('Error generating QR:', err);
    }
  };

  const downloadQR = async (format: 'png' | 'svg') => {
    if (format === 'svg') {
      const svgString = await QRCode.toString(feedbackUrl, {
        type: 'svg',
        width: qrSize,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
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

    // PNG with optional text
    const canvas = document.createElement('canvas');
    const padding = 40;
    const textHeight = includeText ? 60 : 0;
    canvas.width = qrSize + padding * 2;
    canvas.height = qrSize + padding * 2 + textHeight;

    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // QR Code
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, padding, padding, qrSize, qrSize);

      // Text below QR
      if (includeText && customText) {
        ctx.fillStyle = fgColor;
        ctx.font = `bold ${Math.max(16, qrSize / 15)}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(customText, canvas.width / 2, qrSize + padding + 35);
      }

      // Location name at top
      ctx.fillStyle = fgColor;
      ctx.font = `${Math.max(12, qrSize / 25)}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(selectedLocation.name, canvas.width / 2, padding - 10);

      // Download
      const link = document.createElement('a');
      link.download = `qr-${selectedLocation.feedbackSlug}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = qrDataUrl;
  };

  const printQR = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code - ${selectedLocation.name}</title>
        <style>
          body { 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh; 
            margin: 0; 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          }
          .container {
            text-align: center;
            padding: 40px;
          }
          .location-name {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 20px;
          }
          .qr-image {
            width: ${qrSize}px;
            height: ${qrSize}px;
          }
          .custom-text {
            font-size: 22px;
            font-weight: 700;
            color: #333;
            margin-top: 20px;
          }
          .url-text {
            font-size: 11px;
            color: #999;
            margin-top: 10px;
            word-break: break-all;
          }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <p class="location-name">${selectedLocation.name}</p>
          <img src="${qrDataUrl}" class="qr-image" />
          ${includeText ? `<p class="custom-text">${customText}</p>` : ''}
          <p class="url-text">${feedbackUrl}</p>
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">QR Code Generator</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Settings */}
        <div className="space-y-5">
          {/* Location selector */}
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
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>

            <div className="mt-3">
              <label className="mb-1 block text-xs text-gray-500">URL del formulario</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={feedbackUrl}
                  className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600"
                />
                <button
                  onClick={copyLink}
                  className="rounded-md border border-gray-300 px-3 py-2 text-xs hover:bg-gray-50"
                >
                  📋 Copiar
                </button>
              </div>
            </div>
          </div>

          {/* QR Customization */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-medium text-gray-900">Personalizar QR</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Tamaño (px)</label>
                <select
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value={200}>200px (Pequeño)</option>
                  <option value={300}>300px (Normal)</option>
                  <option value={400}>400px (Grande)</option>
                  <option value={500}>500px (Poster)</option>
                  <option value={800}>800px (Impresion HD)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Color QR</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-9 w-10 cursor-pointer rounded border"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Color fondo</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-9 w-10 cursor-pointer rounded border"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text options */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-medium text-gray-900">Texto</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="include-text"
                  checked={includeText}
                  onChange={(e) => setIncludeText(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="include-text" className="text-sm text-gray-700">
                  Incluir texto debajo del QR
                </label>
              </div>
              {includeText && (
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Texto personalizado..."
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-medium text-gray-900">Descargar / Imprimir</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => downloadQR('png')}
                className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                📥 PNG
              </button>
              <button
                onClick={() => downloadQR('svg')}
                className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                📥 SVG
              </button>
              <button
                onClick={printQR}
                className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                🖨️ Imprimir
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="sticky top-6 rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-center font-medium text-gray-900">Vista previa</h3>

            <div className="flex flex-col items-center rounded-lg border-2 border-dashed border-gray-200 p-8" style={{ backgroundColor: bgColor }}>
              <p className="mb-3 text-sm font-medium" style={{ color: fgColor }}>
                {selectedLocation.name}
              </p>

              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  style={{ width: Math.min(qrSize, 280), height: Math.min(qrSize, 280) }}
                  className="rounded"
                />
              )}

              {includeText && customText && (
                <p className="mt-4 text-lg font-bold" style={{ color: fgColor }}>
                  {customText}
                </p>
              )}

              <p className="mt-2 text-xs text-gray-400 break-all text-center max-w-[250px]">
                {feedbackUrl}
              </p>
            </div>

            {/* Tips */}
            <div className="mt-5 rounded-md bg-blue-50 p-4">
              <p className="text-xs font-medium text-blue-800 mb-2">Tips para mejor resultado:</p>
              <ul className="space-y-1 text-xs text-blue-700">
                <li>• Imprime en tamaño minimo 5x5 cm para que se escanee bien</li>
                <li>• Coloca el QR en recepcion, junto a la caja, o en la sala de espera</li>
                <li>• Usa color oscuro sobre fondo claro para mejor contraste</li>
                <li>• El formato SVG es ideal para impresion profesional</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
