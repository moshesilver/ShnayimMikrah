export function parseSectionRef(sectionRef: string) {
  const match = sectionRef.match(/^.*?(\d+:\d+)\s*-\s*(\d+:\d+).*$/);

  if (!match) {
    throw new Error(
      `Invalid sectionRef format: "${sectionRef}". Expected "X:Y - A:B".`,
    );
  }

  const [startPerek, startPasuk] = match[1].split(':').map(Number);
  const [endPerek, endPasuk] = match[2].split(':').map(Number);

  return { startPerek, startPasuk, endPerek, endPasuk };
}
