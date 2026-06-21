/**
 * Unit tests for Shadow Echo (bullet-noir) pure game logic.
 * Functions are copied from game.js so tests run in Node without a browser.
 */

// --- pure functions from game.js ---

function rect(x, y, w, h) {
  return { x, y, w, h };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function angleTo(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

function angleDelta(a, b) {
  return Math.atan2(Math.sin(b - a), Math.cos(b - a));
}

function hexAlpha(hex, alpha) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function pointInRect(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function segmentsIntersect(ax, ay, bx, by, cx, cy, dx, dy) {
  const det = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
  if (Math.abs(det) < 0.00001) return false;
  const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / det;
  const u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / det;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

function raySegment(px, py, rdx, rdy, x1, y1, x2, y2) {
  const sdx = x2 - x1;
  const sdy = y2 - y1;
  const den = rdx * sdy - rdy * sdx;
  if (Math.abs(den) < 0.00001) return null;
  const t = ((x1 - px) * sdy - (y1 - py) * sdx) / den;
  const u = ((x1 - px) * rdy - (y1 - py) * rdx) / den;
  if (t >= 0 && u >= 0 && u <= 1) return { x: px + rdx * t, y: py + rdy * t, d: t };
  return null;
}

function segmentRect(x1, y1, x2, y2, r) {
  if (pointInRect(x1, y1, r) || pointInRect(x2, y2, r)) return true;
  return (
    segmentsIntersect(x1, y1, x2, y2, r.x, r.y, r.x + r.w, r.y) ||
    segmentsIntersect(x1, y1, x2, y2, r.x + r.w, r.y, r.x + r.w, r.y + r.h) ||
    segmentsIntersect(x1, y1, x2, y2, r.x + r.w, r.y + r.h, r.x, r.y + r.h) ||
    segmentsIntersect(x1, y1, x2, y2, r.x, r.y + r.h, r.x, r.y)
  );
}

function makeAgent(options) {
  return {
    id: options.id,
    team: options.team,
    x: options.x,
    y: options.y,
    vx: 0,
    vy: 0,
    r: 18,
    hp: 100,
    maxHp: 100,
    angle: -Math.PI / 2,
    color: options.color || "#ffffff",
    controlled: !!options.controlled,
    weapon: options.weapon || {
      name: "RIFLE",
      mag: 18,
      ammo: 18,
      rate: 0.18,
      reload: 1.25,
      damage: 24,
      speed: 780,
      spread: 0.045,
      range: 0.86,
      noise: 270,
    },
    fireTimer: 0,
    reloadTimer: 0,
    footstep: 0,
    seenTimer: 0,
    lastHeard: null,
    ai: {
      state: "patrol",
      targetX: options.x,
      targetY: options.y,
      think: 0,
    },
  };
}

// --- tests ---

describe("rect()", () => {
  test("creates rect with correct properties", () => {
    expect(rect(10, 20, 100, 50)).toEqual({ x: 10, y: 20, w: 100, h: 50 });
  });

  test("accepts zero dimensions", () => {
    expect(rect(0, 0, 0, 0)).toEqual({ x: 0, y: 0, w: 0, h: 0 });
  });
});

describe("clamp()", () => {
  test("returns value within range unchanged", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  test("clamps below minimum", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  test("clamps above maximum", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  test("returns min when value equals min", () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  test("returns max when value equals max", () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });

  test("works with negative bounds", () => {
    expect(clamp(0, -10, -1)).toBe(-1);
    expect(clamp(-20, -10, -1)).toBe(-10);
  });
});

describe("dist()", () => {
  test("distance between same points is 0", () => {
    expect(dist({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0);
  });

  test("3-4-5 right triangle gives 5", () => {
    expect(dist({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  test("distance is symmetric", () => {
    const a = { x: 10, y: 20 };
    const b = { x: 40, y: 60 };
    expect(dist(a, b)).toBeCloseTo(dist(b, a));
  });

  test("horizontal distance", () => {
    expect(dist({ x: 0, y: 5 }, { x: 10, y: 5 })).toBeCloseTo(10);
  });
});

describe("angleTo()", () => {
  test("right is 0 radians", () => {
    expect(angleTo({ x: 0, y: 0 }, { x: 1, y: 0 })).toBeCloseTo(0);
  });

  test("down (canvas y-axis) is PI/2", () => {
    expect(angleTo({ x: 0, y: 0 }, { x: 0, y: 1 })).toBeCloseTo(Math.PI / 2);
  });

  test("left is ±PI", () => {
    expect(Math.abs(angleTo({ x: 0, y: 0 }, { x: -1, y: 0 }))).toBeCloseTo(Math.PI);
  });

  test("up is -PI/2", () => {
    expect(angleTo({ x: 0, y: 0 }, { x: 0, y: -1 })).toBeCloseTo(-Math.PI / 2);
  });
});

describe("angleDelta()", () => {
  test("same angle gives 0", () => {
    expect(angleDelta(0, 0)).toBeCloseTo(0);
  });

  test("quarter turn clockwise", () => {
    expect(angleDelta(0, Math.PI / 2)).toBeCloseTo(Math.PI / 2);
  });

  test("wraps: 270° CW equals 90° CCW", () => {
    expect(angleDelta(0, Math.PI * 1.5)).toBeCloseTo(-Math.PI / 2);
  });

  test("half turn", () => {
    expect(Math.abs(angleDelta(0, Math.PI))).toBeCloseTo(Math.PI);
  });
});

describe("hexAlpha()", () => {
  test("white with full opacity", () => {
    expect(hexAlpha("#ffffff", 1)).toBe("rgba(255,255,255,1)");
  });

  test("black with zero opacity", () => {
    expect(hexAlpha("#000000", 0)).toBe("rgba(0,0,0,0)");
  });

  test("game blue (#7fd0ff) at 0.5", () => {
    expect(hexAlpha("#7fd0ff", 0.5)).toBe("rgba(127,208,255,0.5)");
  });

  test("game red (#ff554e) at 0.75", () => {
    expect(hexAlpha("#ff554e", 0.75)).toBe("rgba(255,85,78,0.75)");
  });
});

describe("pointInRect()", () => {
  const box = rect(10, 10, 50, 30);

  test("centre of rect is inside", () => {
    expect(pointInRect(35, 25, box)).toBe(true);
  });

  test("point left of rect is outside", () => {
    expect(pointInRect(5, 25, box)).toBe(false);
  });

  test("point right of rect is outside", () => {
    expect(pointInRect(65, 25, box)).toBe(false);
  });

  test("point above rect is outside", () => {
    expect(pointInRect(35, 5, box)).toBe(false);
  });

  test("point below rect is outside", () => {
    expect(pointInRect(35, 45, box)).toBe(false);
  });

  test("top-left corner is inside", () => {
    expect(pointInRect(10, 10, box)).toBe(true);
  });

  test("bottom-right corner is inside", () => {
    expect(pointInRect(60, 40, box)).toBe(true);
  });
});

describe("segmentsIntersect()", () => {
  test("crossing diagonals intersect", () => {
    expect(segmentsIntersect(0, 0, 10, 10, 0, 10, 10, 0)).toBe(true);
  });

  test("horizontal parallel segments do not intersect", () => {
    expect(segmentsIntersect(0, 0, 10, 0, 0, 5, 10, 5)).toBe(false);
  });

  test("collinear non-overlapping segments do not intersect", () => {
    expect(segmentsIntersect(0, 0, 4, 0, 6, 0, 10, 0)).toBe(false);
  });

  test("T-intersection counts as intersect", () => {
    expect(segmentsIntersect(0, 5, 10, 5, 5, 0, 5, 10)).toBe(true);
  });

  test("segments sharing an endpoint intersect", () => {
    expect(segmentsIntersect(0, 0, 5, 5, 5, 5, 10, 0)).toBe(true);
  });
});

describe("raySegment()", () => {
  test("rightward ray hits vertical segment", () => {
    const hit = raySegment(0, 0, 1, 0, 5, -5, 5, 5);
    expect(hit).not.toBeNull();
    expect(hit.x).toBeCloseTo(5);
    expect(hit.y).toBeCloseTo(0);
    expect(hit.d).toBeCloseTo(5);
  });

  test("ray misses segment that is too far up", () => {
    expect(raySegment(0, 0, 1, 0, 5, 3, 5, 10)).toBeNull();
  });

  test("parallel ray returns null", () => {
    expect(raySegment(0, 0, 1, 0, 0, 5, 10, 5)).toBeNull();
  });

  test("ray behind segment (negative t) returns null", () => {
    expect(raySegment(10, 0, 1, 0, 5, -5, 5, 5)).toBeNull();
  });
});

describe("segmentRect()", () => {
  const box = rect(40, 40, 20, 20);

  test("segment crossing through box is blocked", () => {
    expect(segmentRect(30, 50, 70, 50, box)).toBe(true);
  });

  test("segment entirely outside is not blocked", () => {
    expect(segmentRect(0, 0, 10, 10, box)).toBe(false);
  });

  test("segment with endpoint inside box is blocked", () => {
    expect(segmentRect(0, 50, 50, 50, box)).toBe(true);
  });
});

describe("makeAgent()", () => {
  test("creates agent with specified position and team", () => {
    const a = makeAgent({ id: "p1", team: "blue", x: 100, y: 200 });
    expect(a.id).toBe("p1");
    expect(a.team).toBe("blue");
    expect(a.x).toBe(100);
    expect(a.y).toBe(200);
  });

  test("initialises HP to 100", () => {
    const a = makeAgent({ id: "p1", team: "red", x: 0, y: 0 });
    expect(a.hp).toBe(100);
    expect(a.maxHp).toBe(100);
  });

  test("defaults to not controlled", () => {
    const a = makeAgent({ id: "bot", team: "red", x: 0, y: 0 });
    expect(a.controlled).toBe(false);
  });

  test("sets controlled when option is true", () => {
    const a = makeAgent({ id: "player", team: "blue", x: 0, y: 0, controlled: true });
    expect(a.controlled).toBe(true);
  });

  test("defaults to RIFLE weapon", () => {
    const a = makeAgent({ id: "bot", team: "red", x: 0, y: 0 });
    expect(a.weapon.name).toBe("RIFLE");
    expect(a.weapon.ammo).toBe(18);
    expect(a.weapon.mag).toBe(18);
  });

  test("uses provided custom weapon", () => {
    const shotgun = {
      name: "SHOT", mag: 6, ammo: 6, rate: 0.55, reload: 1.35,
      damage: 12, speed: 720, spread: 0.22, pellets: 5, range: 0.72, noise: 290,
    };
    const a = makeAgent({ id: "g", team: "red", x: 0, y: 0, weapon: shotgun });
    expect(a.weapon.name).toBe("SHOT");
    expect(a.weapon.pellets).toBe(5);
  });

  test("AI starts in patrol state at spawn position", () => {
    const a = makeAgent({ id: "bot", team: "red", x: 300, y: 150 });
    expect(a.ai.state).toBe("patrol");
    expect(a.ai.targetX).toBe(300);
    expect(a.ai.targetY).toBe(150);
  });

  test("velocities and timers start at zero", () => {
    const a = makeAgent({ id: "bot", team: "red", x: 0, y: 0 });
    expect(a.vx).toBe(0);
    expect(a.vy).toBe(0);
    expect(a.fireTimer).toBe(0);
    expect(a.reloadTimer).toBe(0);
  });
});
