export function parseSectionRange(range?: string) {
  if (!range) {
    console.warn('parseSectionRange called with undefined range');
    return { startPerek: 1, startPasuk: 1, endPerek: 1, endPasuk: 1 };
  }

  const cleaned = range.replace(/^[^\d]+/, '').trim();

  const match = cleaned.match(/^(\d+:\d+)\s*-\s*(\d+:\d+|\d+)$/);

  if (!match) {
    throw new Error(`Invalid sectionRange format: "${range}"`);
  }

  const [startPerek, startPasuk] = match[1].split(':').map(Number);

  const endParts = match[2].split(':').map(Number);
  const endPerek = endParts.length === 2 ? endParts[0] : startPerek;
  const endPasuk = endParts.length === 2 ? endParts[1] : endParts[0];

  return { startPerek, startPasuk, endPerek, endPasuk };
}
