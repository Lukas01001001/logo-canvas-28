// src/utils/randomLogoPlacement.ts

export type PositionAndSize = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getSectors(num: number, width: number, height: number) {
  const cols = Math.ceil(Math.sqrt(num));
  const rows = Math.ceil(num / cols);
  const w = width / cols;
  const h = height / rows;
  return Array.from({ length: num }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      x0: col * w,
      y0: row * h,
      x1: (col + 1) * w,
      y1: (row + 1) * h,
    };
  });
}

// Avoids collisions and maintains margin from the edge
export function generateClusteredLayout(
  clients: { id: number; industry?: string | null }[],
  canvasWidth: number,
  canvasHeight: number,
  logoWidth = 100,
  logoHeight = 100,
  collisionMargin = 8,
  edgeMargin = 10,
  maxTries = 100
): Record<number, PositionAndSize> {
  // 1. Group customers by industry
  const grouped = new Map<string, number[]>();
  for (const client of clients) {
    const industry = client.industry || "other";
    if (!grouped.has(industry)) grouped.set(industry, []);
    grouped.get(industry)!.push(client.id);
  }
  const industryList = Array.from(grouped.keys());
  const numGroups = industryList.length;

  // 2. Get sectors for every industry
  const sectors = getSectors(
    numGroups,
    canvasWidth - 2 * edgeMargin,
    canvasHeight - 2 * edgeMargin
  );

  const layout: Record<number, PositionAndSize> = {};
  const boxes: PositionAndSize[] = [];
  industryList.forEach((industry, idx) => {
    const ids = grouped.get(industry)!;
    const sector = sectors[idx];
    // Sector borders
    const sectorX0 = edgeMargin + sector.x0;
    const sectorX1 = edgeMargin + sector.x1 - logoWidth;
    const sectorY0 = edgeMargin + sector.y0;
    const sectorY1 = edgeMargin + sector.y1 - logoHeight;
    ids.forEach((id) => {
      let tries = 0;
      let pos: PositionAndSize;
      do {
        pos = {
          x: getRandomInt(sectorX0, sectorX1),
          y: getRandomInt(sectorY0, sectorY1),
          width: logoWidth,
          height: logoHeight,
        };
        tries++;
      } while (
        boxes.some(
          (box) =>
            pos.x < box.x + box.width + collisionMargin &&
            pos.x + pos.width + collisionMargin > box.x &&
            pos.y < box.y + box.height + collisionMargin &&
            pos.y + pos.height + collisionMargin > box.y
        ) &&
        tries < maxTries
      );
      layout[id] = pos;
      boxes.push(pos);
    });
  });
  return layout;
}
