// Map of named colors to their RGB values and a darker text-safe variant
const COLOR_MAP: Record<string, { r: number; g: number; b: number; dark: string }> = {
  red: { r: 239, g: 68, b: 68, dark: '#991b1b' },
  orange: { r: 249, g: 115, b: 22, dark: '#9a3412' },
  amber: { r: 245, g: 158, b: 11, dark: '#92400e' },
  yellow: { r: 234, g: 179, b: 8, dark: '#854d0e' },
  lime: { r: 132, g: 204, b: 22, dark: '#3f6212' },
  green: { r: 34, g: 197, b: 94, dark: '#166534' },
  emerald: { r: 16, g: 185, b: 129, dark: '#065f46' },
  teal: { r: 20, g: 184, b: 166, dark: '#115e59' },
  cyan: { r: 6, g: 182, b: 212, dark: '#155e75' },
  sky: { r: 14, g: 165, b: 233, dark: '#075985' },
  blue: { r: 59, g: 130, b: 246, dark: '#1e40af' },
  indigo: { r: 99, g: 102, b: 241, dark: '#3730a3' },
  violet: { r: 139, g: 92, b: 246, dark: '#5b21b6' },
  purple: { r: 168, g: 85, b: 247, dark: '#6b21a8' },
  fuchsia: { r: 217, g: 70, b: 239, dark: '#86198f' },
  pink: { r: 236, g: 72, b: 153, dark: '#9d174d' },
  rose: { r: 244, g: 63, b: 94, dark: '#9f1239' },
  gray: { r: 107, g: 114, b: 128, dark: '#374151' },
  slate: { r: 100, g: 116, b: 139, dark: '#334155' },
  zinc: { r: 113, g: 113, b: 122, dark: '#3f3f46' },
  neutral: { r: 115, g: 115, b: 115, dark: '#404040' },
  stone: { r: 120, g: 113, b: 108, dark: '#44403c' },
};

function getColorEntry(color: any): { r: number; g: number; b: number; dark: string } | null {
  if (!color || typeof color !== 'string') return null;

  const named = COLOR_MAP[color.toLowerCase()];
  if (named) return named;

  // Fallback: try rgba format
  const rgbaMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
  if (rgbaMatch) {
    const r = Number(rgbaMatch[1]);
    const g = Number(rgbaMatch[2]);
    const b = Number(rgbaMatch[3]);
    // Darken by 40% for text
    const dark = `rgb(${Math.round(r * 0.5)}, ${Math.round(g * 0.5)}, ${Math.round(b * 0.5)})`;
    return { r, g, b, dark };
  }

  return null;
}

export function updateColor(color: any, newOpacity: number) {
  const entry = getColorEntry(color);
  if (!entry) return color;
  return `rgba(${entry.r}, ${entry.g}, ${entry.b}, ${newOpacity})`;
}

export function getChipColors(color: any): { background: string; border: string; text: string; icon: string } {
  const entry = getColorEntry(color);
  if (!entry) {
    return { background: 'transparent', border: color, text: color, icon: color };
  }

  return {
    background: `rgba(${entry.r}, ${entry.g}, ${entry.b}, 0.1)`,
    border: `rgba(${entry.r}, ${entry.g}, ${entry.b}, 0.3)`,
    text: entry.dark,
    icon: entry.dark,
  };
}
