// Design system primitive tokens mapped to chip color roles
const COLOR_MAP: Record<string, { background: string; border: string; dark: string }> = {
  gray: { background: '#F3F4F6', border: '#C9CBCD', dark: '#212B36' },
  blue: { background: '#E6F0FF', border: '#92A9E0', dark: '#053299' },
  green: { background: '#D0FFE8', border: '#115B3B', dark: '#115B3B' },
  red: { background: '#FFEDE8', border: '#991A00', dark: '#991A00' },
  yellow: { background: '#FEF6D0', border: '#863B05', dark: '#863B05' },
  teal: { background: '#EAF5F4', border: '#56C6BE', dark: '#2B91B8' },
  violet: { background: '#F0EAFF', border: '#A988E6', dark: '#7F69B5' },
  rose: { background: '#F5E8ED', border: '#E9726B', dark: '#B34B5F' },
  amber: { background: '#F7F1E4', border: '#E7B04A', dark: '#A4751F' },
  cyan: { background: '#DFF3F9', border: '#77B6E3', dark: '#649EAF' },
  brand: { background: '#E4F8FB', border: '#BCC7F4', dark: '#BCC7F4' },
};

export function updateColor(color: any, newOpacity: number) {
  if (!color || typeof color !== 'string') return color;

  const entry = COLOR_MAP[color.toLowerCase()];
  if (entry) {
    // For named colors, return the border shade at the given opacity for backward compat
    return entry.border;
  }

  // Fallback: try rgba format
  const rgbaMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
  if (rgbaMatch) {
    const [, r, g, b] = rgbaMatch;
    return `rgba(${r}, ${g}, ${b}, ${newOpacity})`;
  }

  return color;
}

export function getChipColors(color: any): { background: string; border: string; text: string; icon: string } {
  if (!color || typeof color !== 'string') {
    return { background: 'transparent', border: color, text: color, icon: color };
  }

  const entry = COLOR_MAP[color.toLowerCase()];
  if (entry) {
    return {
      background: entry.background,
      border: entry.border,
      text: entry.dark,
      icon: entry.dark,
    };
  }

  // Fallback for unrecognized colors
  return { background: 'transparent', border: color, text: color, icon: color };
}
