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

// Avoids collisions and maintains margin from the edge
export function generateRandomLayout(
  ids: number[],
  canvasWidth: number,
  canvasHeight: number,
  logoWidth = 100,
  logoHeight = 100,
  collisionMargin = 8,
  edgeMargin = 10,
  maxTries = 100
): Record<number, PositionAndSize> {
  const layout: Record<number, PositionAndSize> = {};

  const boxes: PositionAndSize[] = [];
  ids.forEach((id) => {
    let tries = 0;
    let pos: PositionAndSize;
    const maxX = Math.max(edgeMargin, canvasWidth - logoWidth - edgeMargin);
    const maxY = Math.max(edgeMargin, canvasHeight - logoHeight - edgeMargin);

    do {
      pos = {
        x: getRandomInt(edgeMargin, maxX),
        y: getRandomInt(edgeMargin, maxY),
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
  return layout;
}
