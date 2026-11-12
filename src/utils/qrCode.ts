// Lightweight deterministic QR Code Pattern Generator for frontend simulation
// Produces authentic 21x21 / 25x25 matrix with finder patterns, timing patterns, and data hash

export function generateQRCodeMatrix(text: string, size = 25): boolean[][] {
  const matrix: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

  // Helper to draw 7x7 finder pattern
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        } else {
          matrix[startY + r][startX + c] = false;
        }
      }
    }
  };

  // Top-left finder
  drawFinder(0, 0);
  // Top-right finder
  drawFinder(size - 7, 0);
  // Bottom-left finder
  drawFinder(0, size - 7);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Generate deterministic data fill based on text hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Don't overwrite finders or timing lines
      const inFinderTL = r <= 7 && c <= 7;
      const inFinderTR = r <= 7 && c >= size - 8;
      const inFinderBL = r >= size - 8 && c <= 7;
      const onTiming = r === 6 || c === 6;

      if (!inFinderTL && !inFinderTR && !inFinderBL && !onTiming) {
        // pseudo-random pseudo-deterministic bit
        const bit = ((hash * (r * size + c + 13)) ^ (text.charCodeAt(c % text.length) * 31)) % 7;
        matrix[r][c] = bit % 2 === 0;
      }
    }
  }

  return matrix;
}

export function drawQRCodeToCanvas(
  canvas: HTMLCanvasElement, 
  text: string, 
  pixelSize = 240, 
  margin = 20
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const matrixSize = 25;
  const matrix = generateQRCodeMatrix(text, matrixSize);
  
  canvas.width = pixelSize;
  canvas.height = pixelSize;

  // Background white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, pixelSize, pixelSize);

  const usable = pixelSize - (margin * 2);
  const cellSize = usable / matrixSize;

  ctx.fillStyle = '#0F172A';
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (matrix[r][c]) {
        ctx.fillRect(
          margin + c * cellSize, 
          margin + r * cellSize, 
          cellSize + 0.3, 
          cellSize + 0.3
        );
      }
    }
  }
}

export function downloadQRCodePNG(code: string, productName: string): void {
  const canvas = document.createElement('canvas');
  drawQRCodeToCanvas(canvas, code, 360, 24);

  // Add caption at bottom
  const fullCanvas = document.createElement('canvas');
  fullCanvas.width = 360;
  fullCanvas.height = 420;
  const ctx = fullCanvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 360, 420);
  ctx.drawImage(canvas, 0, 0);

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(code, 180, 380);

  ctx.fillStyle = '#64748B';
  ctx.font = '11px sans-serif';
  ctx.fillText(productName.slice(0, 35), 180, 400);

  const link = document.createElement('a');
  link.download = `QRCode_${code}.png`;
  link.href = fullCanvas.toDataURL('image/png');
  link.click();
}
