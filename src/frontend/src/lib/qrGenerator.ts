/**
 * QR Code generator using CDN-loaded library
 * Uses qrcode-generator library loaded from CDN
 */

// Type definitions for qrcode-generator library
interface QRCodeGenerator {
  (typeNumber: number, errorCorrectionLevel: string): QRCodeInstance;
  stringToBytes(s: string): number[];
}

interface QRCodeInstance {
  addData(data: string): void;
  make(): void;
  createSvgTag(cellSize?: number, margin?: number): string;
  getModuleCount(): number;
  isDark(row: number, col: number): boolean;
}

declare global {
  interface Window {
    qrcode?: QRCodeGenerator;
  }
}

let qrLibraryLoaded = false;
let qrLibraryLoading = false;
const qrLibraryCallbacks: Array<() => void> = [];

/**
 * Load QR code library from CDN
 */
export async function loadQRLibrary(): Promise<boolean> {
  if (qrLibraryLoaded && window.qrcode) {
    return true;
  }

  if (qrLibraryLoading) {
    return new Promise((resolve) => {
      qrLibraryCallbacks.push(() => resolve(true));
    });
  }

  qrLibraryLoading = true;

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/qrcode-generator@1.4.4/qrcode.js';
    script.async = true;
    
    script.onload = () => {
      qrLibraryLoaded = true;
      qrLibraryLoading = false;
      qrLibraryCallbacks.forEach(cb => cb());
      qrLibraryCallbacks.length = 0;
      resolve(true);
    };
    
    script.onerror = () => {
      qrLibraryLoading = false;
      resolve(false);
    };
    
    document.head.appendChild(script);
  });
}

/**
 * Generate QR code SVG string
 */
export function generateQRCodeSVG(data: string, size: number = 256): string {
  if (!window.qrcode) {
    return '';
  }

  try {
    // Create QR code instance
    // Type 0 means auto-detect the best type
    // Error correction level 'M' = ~15% recovery
    const qr = window.qrcode(0, 'M');
    qr.addData(data);
    qr.make();

    // Calculate cell size based on desired output size
    const moduleCount = qr.getModuleCount();
    const margin = 4; // 4 modules margin on each side
    const totalModules = moduleCount + (margin * 2);
    const cellSize = Math.floor(size / totalModules);

    // Generate SVG
    const svg = qr.createSvgTag(cellSize, margin);
    return svg;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
}
