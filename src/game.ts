import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import * as K from "./constants";

export type Direction = "up" | "down" | "left" | "right";
export type Screen =
  | "title"
  | "howto"
  | "countdown"
  | "playing"
  | "paused"
  | "cleared"
  | "gameover";
export type PredatorState = "den" | "wander" | "chase" | "search";
export interface Forager {
  x: number;
  y: number;
  tx: number;
  ty: number;
  dir: Direction;
  moving: boolean;
}
export interface Drifter {
  x: number;
  y: number;
  tx: number;
  ty: number;
  lit: boolean;
  mind: boolean;
  travel: boolean;
  dir: Direction;
}
export interface Predator {
  kind: K.PredatorKind;
  x: number;
  y: number;
  tx: number;
  ty: number;
  dir: Direction;
  state: PredatorState;
  released: boolean;
  mind: boolean;
  travel: boolean;
  speed: number;
  alert: boolean;
  lit: boolean;
  detectRange: number | null;
  hearingRange: number | null;
  hearingLock: boolean | null;
  flareCharging: boolean | null;
  flaring: boolean | null;
  flareRadius: number | null;
  fixX: number | null;
  fixY: number | null;
  timer: number;
  alertTimer: number;
  flareTimer: number;
  marked: number;
}
export interface Pulse {
  source: "forager" | "gloamfin";
  tint: "cyan" | "violet" | "orange";
  ox: number;
  oy: number;
  front: number;
  range: number;
}
export interface InkCloud {
  x: number;
  y: number;
  radius: number;
  remaining: number;
}
interface Images {
  glimmerfin: ImageBitmap[];
  lanternjaw: ImageBitmap[];
  gloamfin: ImageBitmap[];
  flarefish: ImageBitmap[];
  drifter: ImageBitmap[];
  bloom: ImageBitmap[];
  walls: ImageBitmap[];
}
export interface FathomState {
  version: 1;
  screen: Screen;
  menuIndex: number | null;
  titleIndex: number;
  depth: number;
  score: number;
  lives: number;
  muted: boolean;
  planktonRemaining: number;
  drifterIn: number;
  brightness: number;
  brightHold: number;
  visionRadius: number;
  windowRadius: number;
  sonar: { ready: boolean; cooldown: number; range: number };
  ink: { ready: boolean; cooldown: number };
  grid: {
    cols: number;
    rows: number;
    tile: number;
    originX: number;
    originY: number;
  };
  tiles: string[];
  plankton: string[];
  visibility: string[];
  forager: Forager;
  drifters: Drifter[];
  predators: Predator[];
  pulses: Pulse[];
  inkClouds: InkCloud[];
  simTime: number;
  accumulator: number;
  desired: Direction | null;
  screenTimer: number;
  playTime: number;
  images: Images;
}
type SnapshotBase = Omit<
  FathomState,
  | "accumulator"
  | "desired"
  | "screenTimer"
  | "playTime"
  | "images"
  | "drifters"
  | "predators"
>;
type Snapshot = SnapshotBase & {
  drifters: Array<Omit<Drifter, "dir">>;
  predators: Array<
    Omit<
      Predator,
      "fixX" | "fixY" | "timer" | "alertTimer" | "flareTimer" | "marked"
    >
  >;
};
type Rect = { x: number; y: number; w: number; h: number };
export interface FathomDebugApi {
  version: 1;
  reset(s: DeepReadonly<FathomState>): FathomState;
  snapshot(s: DeepReadonly<FathomState>): Snapshot;
  reconcile(s: DeepReadonly<FathomState>): FathomState;
  setScreen(s: DeepReadonly<FathomState>, v: Screen): FathomState;
  setMenuIndex(s: DeepReadonly<FathomState>, i: number): FathomState;
  setTitleIndex(s: DeepReadonly<FathomState>, i: number): FathomState;
  menuItemRect(s: DeepReadonly<FathomState>, i: number): Rect | null;
  setScore(s: DeepReadonly<FathomState>, n: number): FathomState;
  setLives(s: DeepReadonly<FathomState>, n: number): FathomState;
  setDepth(s: DeepReadonly<FathomState>, n: number): FathomState;
  setMaze(s: DeepReadonly<FathomState>, r: string[]): FathomState;
  setPlankton(
    s: DeepReadonly<FathomState>,
    x: number,
    y: number,
    p: boolean,
  ): FathomState;
  clearPlankton(s: DeepReadonly<FathomState>): FathomState;
  clearFog(s: DeepReadonly<FathomState>): FathomState;
  setForagerTile(
    s: DeepReadonly<FathomState>,
    x: number,
    y: number,
  ): FathomState;
  setForagerDir(s: DeepReadonly<FathomState>, d: Direction): FathomState;
  setBrightness(s: DeepReadonly<FathomState>, g: number): FathomState;
  setBrightHold(s: DeepReadonly<FathomState>, n: number): FathomState;
  clearPredators(s: DeepReadonly<FathomState>): FathomState;
  addPredator(
    s: DeepReadonly<FathomState>,
    k: K.PredatorKind,
    x: number,
    y: number,
  ): FathomState;
  setPredatorTile(
    s: DeepReadonly<FathomState>,
    i: number,
    x: number,
    y: number,
  ): FathomState;
  setPredatorDir(
    s: DeepReadonly<FathomState>,
    i: number,
    d: Direction,
  ): FathomState;
  setPredatorState(
    s: DeepReadonly<FathomState>,
    i: number,
    v: "den" | "wander" | "chase",
  ): FathomState;
  setPredatorReleased(
    s: DeepReadonly<FathomState>,
    i: number,
    v: boolean,
  ): FathomState;
  setPredatorMind(
    s: DeepReadonly<FathomState>,
    i: number,
    v: boolean,
  ): FathomState;
  setPredatorTravel(
    s: DeepReadonly<FathomState>,
    i: number,
    v: boolean,
  ): FathomState;
  spawnDrifter(s: DeepReadonly<FathomState>, x: number, y: number): FathomState;
  clearDrifters(s: DeepReadonly<FathomState>): FathomState;
  setDrifterMind(
    s: DeepReadonly<FathomState>,
    i: number,
    v: boolean,
  ): FathomState;
  setDrifterTravel(
    s: DeepReadonly<FathomState>,
    i: number,
    v: boolean,
  ): FathomState;
  setDrifterIn(s: DeepReadonly<FathomState>, n: number): FathomState;
  setSonarCooldown(s: DeepReadonly<FathomState>, n: number): FathomState;
  setInkCooldown(s: DeepReadonly<FathomState>, n: number): FathomState;
}

export const BACKGROUND = "#020712";
const directions: Direction[] = ["up", "down", "left", "right"];
const delta: Record<Direction, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};
const reverse: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};
const center = (x: number, y: number) => ({
  x: K.GRID_ORIGIN_X + x * K.TILE + 16,
  y: K.GRID_ORIGIN_Y + y * K.TILE + 16,
});
const tile = (x: number, y: number) => ({
  tx: Math.max(0, Math.min(35, Math.floor((x - K.GRID_ORIGIN_X) / K.TILE))),
  ty: Math.max(0, Math.min(17, Math.floor((y - K.GRID_ORIGIN_Y) / K.TILE))),
});
const layer = (c: string) => Array(K.GRID_ROWS).fill(c.repeat(K.GRID_COLS));
const int = (n: number, a: number, b = Infinity) => {
  if (!Number.isInteger(n) || n < a || n > b)
    throw Error("Fathom: invalid integer");
};
const num = (n: number, a: number, b = Infinity) => {
  if (!Number.isFinite(n) || n < a || n > b)
    throw Error("Fathom: invalid number");
};
function maze() {
  const a = Array.from({ length: 18 }, () => Array(36).fill("#"));
  for (let y = 1; y < 17; y++)
    for (let x = 1; x < 35; x++) if (x % 2 === 1 || y % 4 === 3) a[y][x] = ".";
  for (let x = 0; x < 36; x++) a[11][x] = ".";
  for (let y = 7; y <= 9; y++) for (let x = 16; x <= 19; x++) a[y][x] = "d";
  for (let y = 6; y <= 10; y++) a[y][15] = a[y][20] = "#";
  for (let x = 16; x <= 19; x++) a[6][x] = a[10][x] = "#";
  a[6][17] = "g";
  a[5][17] = ".";
  return a.map((r) => r.join(""));
}
const open = (s: DeepReadonly<FathomState>, x: number, y: number, p = false) =>
  x >= 0 &&
  x < 36 &&
  y >= 0 &&
  y < 18 &&
  (s.tiles[y][x] === "." || (p && "dg".includes(s.tiles[y][x])));
function next(
  s: DeepReadonly<FathomState>,
  x: number,
  y: number,
  d: Direction,
  p = false,
): [number, number] | null {
  const [dx, dy] = delta[d];
  let nx = x + dx;
  const ny = y + dy;
  if (d === "left" && x === 0) nx = 35;
  if (d === "right" && x === 35) nx = 0;
  return open(s, nx, ny, p) ? [nx, ny] : null;
}
const range = (d: number) =>
  Math.max(K.SONAR_RANGE_MIN, K.SONAR_RANGE_BASE - d + 1);
function speed(p: Pick<Predator, "kind" | "state">) {
  return p.kind === "lanternjaw" && (p.state === "wander" || p.state === "den")
    ? K.DRIFTER_SPEED
    : p.kind === "gloamfin" && p.state === "chase"
      ? K.GLOAMFIN_CHASE_SPEED
      : K.PREDATOR_SPEED;
}
function kinds(d: number) {
  const a = [...K.DEN_ORDER];
  for (let i = 2; i <= Math.min(d, 4); i++) a.push(K.ROSTER_ADD_ORDER[i - 2]);
  return a;
}
function predator(
  kind: K.PredatorKind,
  i: number,
  x = 16 + (i % 4),
  y = 8,
): Predator {
  const p: Predator = {
    kind,
    ...center(x, y),
    tx: x,
    ty: y,
    dir: "up",
    state: "den",
    released: false,
    mind: true,
    travel: true,
    speed: 0,
    alert: false,
    lit: false,
    detectRange: kind === "gloamfin" ? null : K.LANTERN_RANGE_BASE,
    hearingRange: kind === "gloamfin" ? K.GLOAMFIN_HEAR : null,
    hearingLock: kind === "gloamfin" ? false : null,
    flareCharging: kind === "flarefish" ? false : null,
    flaring: kind === "flarefish" ? false : null,
    flareRadius: kind === "flarefish" ? 0 : null,
    fixX: null,
    fixY: null,
    timer: 0,
    alertTimer: 0,
    flareTimer: K.FLARE_INTERVAL,
    marked: 0,
  };
  p.speed = speed(p);
  return p;
}
function reconcile(s: DeepReadonly<FathomState>): FathomState {
  const g = s.brightness,
    p = s.plankton.reduce(
      (n, r) => n + [...r].filter((c) => c === "*").length,
      0,
    );
  return {
    ...s,
    tiles: [...s.tiles],
    plankton: [...s.plankton],
    visibility: [...s.visibility],
    grid: { ...s.grid },
    forager: { ...s.forager, ...tile(s.forager.x, s.forager.y) },
    drifters: s.drifters.map((d) => ({ ...d, ...tile(d.x, d.y) })),
    predators: s.predators.map((q) => ({
      ...q,
      ...tile(q.x, q.y),
      speed: speed(q),
      detectRange:
        q.kind === "gloamfin"
          ? null
          : K.LANTERN_RANGE_BASE + K.LANTERN_RANGE_GAIN * g,
    })),
    pulses: s.pulses.map((p) => ({ ...p })),
    inkClouds: s.inkClouds.map((i) => ({ ...i })),
    sonar: {
      cooldown: s.sonar.cooldown,
      ready: s.sonar.cooldown === 0,
      range: range(s.depth),
    },
    ink: { cooldown: s.ink.cooldown, ready: s.ink.cooldown === 0 },
    planktonRemaining: p,
    visionRadius: K.VISION_MIN + K.VISION_GAIN * g,
    windowRadius: K.KINDLE_VISION_MIN + K.KINDLE_VISION_GAIN * g,
    images: s.images as Images,
  };
}
function fresh(images: Images, muted = false): FathomState {
  const tiles = maze(),
    c = center(17, 15);
  return reconcile({
    version: 1,
    screen: "title",
    menuIndex: 0,
    titleIndex: 0,
    depth: 1,
    score: 0,
    lives: K.START_LIVES,
    muted,
    planktonRemaining: 0,
    drifterIn: K.DRIFTER_INTERVAL,
    brightness: 0,
    brightHold: 0,
    visionRadius: K.VISION_MIN,
    windowRadius: K.KINDLE_VISION_MIN,
    sonar: { ready: true, cooldown: 0, range: 9 },
    ink: { ready: true, cooldown: 0 },
    grid: { cols: 36, rows: 18, tile: 32, originX: 64, originY: 80 },
    tiles,
    plankton: tiles.map((r) =>
      [...r].map((v) => (v === "." ? "*" : "-")).join(""),
    ),
    visibility: layer("u"),
    forager: { ...c, tx: 17, ty: 15, dir: "left", moving: false },
    drifters: [],
    predators: kinds(1).map((kind, index) => predator(kind, index)),
    pulses: [],
    inkClouds: [],
    simTime: 0,
    accumulator: 0,
    desired: null,
    screenTimer: 0,
    playTime: 0,
    images,
  });
}
function dive(s: DeepReadonly<FathomState>) {
  const n = fresh(s.images as Images, s.muted);
  return {
    ...n,
    titleIndex: s.titleIndex,
    screen: "countdown" as const,
    menuIndex: null,
    screenTimer: 2,
  };
}
const menu = (s: Screen) =>
  s === "title"
    ? K.TITLE_ITEMS
    : s === "paused"
      ? K.PAUSE_ITEMS
      : s === "gameover"
        ? K.GAMEOVER_ITEMS
        : null;
const rect = (i: number): Rect => ({ x: 440, y: 390 + i * 62, w: 400, h: 50 });
function checkTile(
  s: DeepReadonly<FathomState>,
  x: number,
  y: number,
  a: string,
) {
  int(x, 0, 35);
  int(y, 0, 17);
  if (!a.includes(s.tiles[y][x])) throw Error("Fathom: invalid tile");
}
function row(a: readonly string[], x: number, y: number, c: string) {
  const n = [...a];
  n[y] = n[y].slice(0, x) + c + n[y].slice(x + 1);
  return n;
}
function wp(
  s: DeepReadonly<FathomState>,
  i: number,
  f: (p: Predator) => Predator,
) {
  int(i, 0, s.predators.length - 1);
  return reconcile({
    ...s,
    predators: s.predators.map((p, j) =>
      j === i ? f({ ...p } as Predator) : ({ ...p } as Predator),
    ),
  } as FathomState);
}
function wd(
  s: DeepReadonly<FathomState>,
  i: number,
  f: (p: Drifter) => Drifter,
) {
  int(i, 0, s.drifters.length - 1);
  return reconcile({
    ...s,
    drifters: s.drifters.map((p, j) =>
      j === i ? f({ ...p } as Drifter) : ({ ...p } as Drifter),
    ),
  } as FathomState);
}
function debug(images: Images): FathomDebugApi {
  return {
    version: 1,
    reset: (s) => fresh(images, s.muted),
    snapshot: (s) => {
      const {
        accumulator,
        desired,
        screenTimer,
        playTime,
        images: _,
        ...v
      } = s;
      void accumulator;
      void desired;
      void screenTimer;
      void playTime;
      void _;
      return JSON.parse(
        JSON.stringify({
          ...v,
          drifters: s.drifters.map(({ dir, ...drifter }) => {
            void dir;
            return drifter;
          }),
          predators: s.predators.map(
            ({
              fixX,
              fixY,
              timer,
              alertTimer,
              flareTimer,
              marked,
              ...pred
            }) => {
              void fixX;
              void fixY;
              void timer;
              void alertTimer;
              void flareTimer;
              void marked;
              return pred;
            },
          ),
        }),
      ) as Snapshot;
    },
    reconcile,
    setScreen: (s, v) => {
      if (
        ![
          "title",
          "howto",
          "countdown",
          "playing",
          "paused",
          "cleared",
          "gameover",
        ].includes(v)
      )
        throw Error("Fathom: invalid screen");
      return {
        ...reconcile(s),
        screen: v,
        menuIndex:
          v === "title"
            ? s.titleIndex
            : v === "paused" || v === "gameover"
              ? 0
              : null,
        playTime: v === "playing" ? 0 : s.playTime,
      };
    },
    setMenuIndex: (s, i) => {
      const m = menu(s.screen);
      if (!m) throw Error("Fathom: no menu");
      int(i, 0, m.length - 1);
      return { ...reconcile(s), menuIndex: i };
    },
    setTitleIndex: (s, i) => {
      int(i, 0, 1);
      return { ...reconcile(s), titleIndex: i };
    },
    menuItemRect: (s, i) => {
      const m = menu(s.screen);
      return m && i >= 0 && i < m.length ? rect(i) : null;
    },
    setScore: (s, n) => {
      int(n, 0);
      return { ...reconcile(s), score: n };
    },
    setLives: (s, n) => {
      int(n, 0);
      return { ...reconcile(s), lives: n };
    },
    setDepth: (s, n) => {
      int(n, 1);
      return reconcile({
        ...s,
        depth: n,
        predators: kinds(n).map((kind, index) => predator(kind, index)),
      } as FathomState);
    },
    setMaze: (s, r) => {
      if (
        r.length !== 18 ||
        r.some((x) => x.length !== 36 || /[^#.gd]/.test(x)) ||
        ((r.some((x) => x.includes("d")) || r.some((x) => x.includes("g"))) &&
          r.join("").split("g").length !== 2)
      )
        throw Error("Fathom: invalid maze");
      return { ...reconcile(s), tiles: [...r] };
    },
    setPlankton: (s, x, y, p) => {
      checkTile(s, x, y, ".");
      return reconcile({
        ...s,
        plankton: row(s.plankton, x, y, p ? "*" : "-"),
      } as FathomState);
    },
    clearPlankton: (s) => ({
      ...reconcile(s),
      plankton: layer("-"),
      planktonRemaining: 0,
    }),
    clearFog: (s) => ({ ...reconcile(s), visibility: layer("u") }),
    setForagerTile: (s, x, y) => {
      checkTile(s, x, y, ".");
      return reconcile({
        ...s,
        forager: { ...s.forager, ...center(x, y), tx: x, ty: y, moving: false },
        desired: null,
      } as FathomState);
    },
    setForagerDir: (s, d) => {
      if (!directions.includes(d)) throw Error("Fathom: direction");
      return {
        ...reconcile(s),
        forager: { ...s.forager, dir: d, moving: false },
      };
    },
    setBrightness: (s, g) => {
      num(g, 0, 1);
      return reconcile({ ...s, brightness: g } as FathomState);
    },
    setBrightHold: (s, n) => {
      num(n, 0, K.BRIGHT_HOLD);
      return { ...reconcile(s), brightHold: n };
    },
    clearPredators: (s) => ({ ...reconcile(s), predators: [] }),
    addPredator: (s, k, x, y) => {
      if (!K.DEN_ORDER.includes(k)) throw Error("Fathom: kind");
      checkTile(s, x, y, ".");
      const p = {
        ...predator(k, s.predators.length, x, y),
        state: "wander" as const,
        released: true,
      };
      return reconcile({
        ...s,
        predators: [...s.predators.map((x) => ({ ...x })), p],
      } as FathomState);
    },
    setPredatorTile: (s, i, x, y) => {
      checkTile(s, x, y, ".dg");
      return wp(s, i, (p) => ({ ...p, ...center(x, y), tx: x, ty: y }));
    },
    setPredatorDir: (s, i, d) => {
      if (!directions.includes(d)) throw Error("Fathom: direction");
      return wp(s, i, (p) => ({ ...p, dir: d }));
    },
    setPredatorState: (s, i, v) =>
      wp(s, i, (p) => {
        if (!["den", "wander", "chase"].includes(v))
          throw Error("Fathom: state");
        checkTile(s, p.tx, p.ty, v === "den" ? "dg" : ".");
        return {
          ...p,
          state: v,
          fixX: v === "chase" ? s.forager.tx : null,
          fixY: v === "chase" ? s.forager.ty : null,
        };
      }),
    setPredatorReleased: (s, i, v) => wp(s, i, (p) => ({ ...p, released: v })),
    setPredatorMind: (s, i, v) => wp(s, i, (p) => ({ ...p, mind: v })),
    setPredatorTravel: (s, i, v) => wp(s, i, (p) => ({ ...p, travel: v })),
    spawnDrifter: (s, x, y) => {
      checkTile(s, x, y, ".");
      return {
        ...reconcile(s),
        drifters: [
          ...s.drifters.map((d) => ({ ...d })),
          {
            ...center(x, y),
            tx: x,
            ty: y,
            dir: "up",
            lit: false,
            mind: true,
            travel: true,
          },
        ],
      };
    },
    clearDrifters: (s) => ({ ...reconcile(s), drifters: [] }),
    setDrifterMind: (s, i, v) => wd(s, i, (d) => ({ ...d, mind: v })),
    setDrifterTravel: (s, i, v) => wd(s, i, (d) => ({ ...d, travel: v })),
    setDrifterIn: (s, n) => {
      num(n, 0, K.DRIFTER_INTERVAL);
      return { ...reconcile(s), drifterIn: n };
    },
    setSonarCooldown: (s, n) => {
      num(n, 0);
      return reconcile({
        ...s,
        sonar: { ...s.sonar, cooldown: n },
      } as FathomState);
    },
    setInkCooldown: (s, n) => {
      num(n, 0);
      return reconcile({ ...s, ink: { ...s.ink, cooldown: n } } as FathomState);
    },
  };
}

function bfs(
  s: DeepReadonly<FathomState>,
  sx: number,
  sy: number,
  tx: number,
  ty: number,
): Direction | null {
  const q: Array<[number, number, Direction | null]> = [[sx, sy, null]],
    seen = new Set([`${sx},${sy}`]);
  for (let h = 0; h < q.length; h++) {
    const [x, y, f] = q[h];
    if (x === tx && y === ty) return f;
    for (const d of directions) {
      const n = next(s, x, y, d, true);
      if (n && !seen.has(`${n}`)) {
        seen.add(`${n}`);
        q.push([n[0], n[1], f ?? d]);
      }
    }
  }
  return null;
}
function move<
  T extends { x: number; y: number; tx: number; ty: number; dir: Direction },
>(
  s: DeepReadonly<FathomState>,
  b: T,
  rate: number,
  choose: (x: number, y: number) => Direction | null,
  pred = false,
): T {
  const o = { ...b };
  let left = rate * K.TICK_DT;
  while (left > 0.0001) {
    const c = center(o.tx, o.ty);
    if (Math.hypot(o.x - c.x, o.y - c.y) < 0.01) {
      const d = choose(o.tx, o.ty);
      if (d) o.dir = d;
    }
    const n = next(s, o.tx, o.ty, o.dir, pred);
    if (!n) {
      o.x = c.x;
      o.y = c.y;
      break;
    }
    const nc = center(...n),
      wrap = Math.abs(nc.x - c.x) > 64,
      dist = wrap ? 32 : Math.hypot(nc.x - o.x, nc.y - o.y),
      z = Math.min(left, dist);
    o.x += delta[o.dir][0] * z;
    o.y += delta[o.dir][1] * z;
    left -= z;
    if (z >= dist - 0.001) {
      o.tx = n[0];
      o.ty = n[1];
      o.x = nc.x;
      o.y = nc.y;
    }
  }
  return o as T;
}
function sight(
  s: DeepReadonly<FathomState>,
  a: number,
  b: number,
  x: number,
  y: number,
) {
  const n = Math.ceil(Math.hypot(x - a, y - b) / 8);
  for (let i = 1; i < n; i++) {
    const t = tile(a + ((x - a) * i) / n, b + ((y - b) * i) / n);
    if (s.tiles[t.ty]?.[t.tx] === "#") return false;
  }
  return true;
}
function illuminate(s: FathomState) {
  const v = s.visibility.map((r) => [...r].map((c) => (c === "l" ? "r" : c)));
  for (let y = 0; y < 18; y++)
    for (let x = 0; x < 36; x++) {
      const c = center(x, y);
      if (
        Math.hypot(c.x - s.forager.x, c.y - s.forager.y) <= s.visionRadius &&
        sight(s, s.forager.x, s.forager.y, c.x, c.y)
      )
        v[y][x] = "l";
    }
  for (const p of s.predators)
    if (p.flaring)
      for (let y = 0; y < 18; y++)
        for (let x = 0; x < 36; x++) {
          const c = center(x, y);
          if (Math.hypot(c.x - p.x, c.y - p.y) <= K.FLARE_RADIUS) v[y][x] = "l";
        }
  return {
    ...s,
    visibility: v.map((r) => r.join("")),
    predators: s.predators.map((p) => ({
      ...p,
      lit: p.alert || p.marked > 0 || v[p.ty]?.[p.tx] === "l",
    })),
    drifters: s.drifters.map((d) => ({ ...d, lit: v[d.ty]?.[d.tx] === "l" })),
  };
}
function step(
  s: FathomState,
  held: Direction | null,
  sonar: boolean,
  ink: boolean,
  cues: Set<string>,
): FathomState {
  let n = reconcile({ ...s, simTime: s.simTime + K.TICK_DT } as FathomState);
  if (n.screen === "countdown") {
    n.screenTimer -= K.TICK_DT;
    if (n.screenTimer <= 0) {
      n.screen = "playing";
      n.playTime = 0;
    }
    return illuminate(n);
  }
  if (n.screen === "cleared") {
    n.screenTimer -= K.TICK_DT;
    if (n.screenTimer <= 0) {
      const d = n.depth + 1;
      n = {
        ...dive(n),
        depth: d,
        score: n.score,
        lives: n.lives,
        predators: kinds(d).map((kind, index) => predator(kind, index)),
      } as FathomState;
    }
    return reconcile(n);
  }
  if (n.screen !== "playing") return n;
  n.playTime += K.TICK_DT;
  if (held) n.desired = held;
  if (n.desired && reverse[n.forager.dir] === n.desired)
    n.forager.dir = n.desired;
  const before = n.forager;
  n.forager = move(n, n.forager, K.FORAGER_SPEED, (x, y) =>
    n.desired && next(n, x, y, n.desired)
      ? n.desired
      : next(n, x, y, n.forager.dir)
        ? n.forager.dir
        : null,
  );
  n.forager.moving =
    !!held && (before.x !== n.forager.x || before.y !== n.forager.y);
  if (sonar && n.sonar.cooldown === 0) {
    n.pulses.push({
      source: "forager",
      tint: "cyan",
      ox: n.forager.tx,
      oy: n.forager.ty,
      front: 0,
      range: n.sonar.range,
    });
    n.sonar.cooldown = K.SONAR_COOLDOWN;
    cues.add(K.CUES.sonar);
  }
  if (ink && n.ink.cooldown === 0) {
    n.inkClouds.push({
      x: n.forager.x,
      y: n.forager.y,
      radius: K.INK_RADIUS,
      remaining: K.INK_LIFE,
    });
    n.ink.cooldown = K.INK_COOLDOWN;
    cues.add(K.CUES.ink);
  }
  n.sonar.cooldown = Math.max(0, n.sonar.cooldown - K.TICK_DT);
  n.ink.cooldown = Math.max(0, n.ink.cooldown - K.TICK_DT);
  n.pulses = n.pulses
    .map((p) => ({ ...p, front: p.front + K.SONAR_WAVE_SPEED * K.TICK_DT }))
    .filter((p) => p.front <= p.range);
  n.inkClouds = n.inkClouds
    .map((i) => ({ ...i, remaining: i.remaining - K.TICK_DT }))
    .filter((i) => i.remaining > 0);
  if (n.brightHold > 0) n.brightHold = Math.max(0, n.brightHold - K.TICK_DT);
  else n.brightness *= Math.pow(0.5, K.TICK_DT / K.BRIGHT_HALFLIFE);
  if (n.plankton[n.forager.ty][n.forager.tx] === "*") {
    n.plankton = row(n.plankton, n.forager.tx, n.forager.ty, "-");
    n.score += K.SCORE_PLANKTON;
    n.brightness = Math.min(1, n.brightness + K.BRIGHT_PER_EAT);
    n.brightHold = K.BRIGHT_HOLD;
    cues.add(K.CUES.eat);
    if (n.planktonRemaining === 1) {
      n.score += K.SCORE_CLEAR;
      n.screen = "cleared";
      n.screenTimer = 2;
      cues.add(K.CUES.descend);
    }
  }
  n.drifters = n.drifters
    .filter((d) => {
      if (d.tx === n.forager.tx && d.ty === n.forager.ty) {
        n.score += K.SCORE_DRIFTER;
        return false;
      }
      return true;
    })
    .map((d) =>
      d.mind && d.travel
        ? move(
            n,
            d,
            K.DRIFTER_SPEED,
            (x, y) =>
              directions.find(
                (q) => q !== reverse[d.dir] && !!next(n, x, y, q),
              ) ?? reverse[d.dir],
          )
        : d,
    );
  n.drifterIn = Math.max(0, n.drifterIn - K.TICK_DT);
  if (
    n.drifterIn === 0 &&
    n.planktonRemaining > 0 &&
    n.drifters.length < K.DRIFTER_MAX
  ) {
    const gateY = n.tiles.findIndex((r) => r.includes("g"));
    const gateX = gateY < 0 ? -1 : n.tiles[gateY].indexOf("g");
    if (gateX >= 0) {
      const exits = directions
        .map((d) => next(n, gateX, gateY, d, true))
        .filter((v): v is [number, number] => v !== null)
        .filter(([x, y]) => n.tiles[y][x] === ".");
      const exit = exits[0];
      if (exit) {
        n.drifters.push({
          ...center(exit[0], exit[1]),
          tx: exit[0],
          ty: exit[1],
          dir: "up",
          lit: false,
          mind: true,
          travel: true,
        });
      }
    }
    n.drifterIn = K.DRIFTER_INTERVAL;
  }
  n.predators = n.predators.map((p, i) => {
    let q = {
      ...p,
      alertTimer: Math.max(0, p.alertTimer - K.TICK_DT),
      marked: Math.max(0, p.marked - K.TICK_DT),
    };
    q.alert = q.alertTimer > 0;
    if (!q.released && n.playTime >= i * K.DEN_RELEASE_GAP) q.released = true;
    if (!q.mind) return q;
    const d = Math.hypot(q.x - n.forager.x, q.y - n.forager.y),
      blind = n.inkClouds.some(
        (c) => Math.hypot(q.x - c.x, q.y - c.y) <= c.radius,
      ),
      detect =
        q.kind === "gloamfin"
          ? d <= K.GLOAMFIN_HEAR
          : !blind &&
            d <= K.LANTERN_RANGE_BASE + K.LANTERN_RANGE_GAIN * n.brightness &&
            sight(n, q.x, q.y, n.forager.x, n.forager.y);
    if (detect) {
      if (q.state !== "chase" && q.kind !== "lanternjaw")
        q.alertTimer = K.ALERT_TIME;
      q.state = "chase";
      q.fixX = n.forager.tx;
      q.fixY = n.forager.ty;
      q.timer = K.LINGER_TIME;
      q.hearingLock = q.kind === "gloamfin" ? true : null;
    } else if (q.state === "chase" && (q.timer -= K.TICK_DT) <= 0) {
      q.state = q.kind === "gloamfin" ? "search" : "wander";
      q.hearingLock = q.kind === "gloamfin" ? false : null;
    }
    if (q.kind === "flarefish" && q.state === "wander") {
      q.flareTimer -= K.TICK_DT;
      q.flareCharging = q.flareTimer <= K.FLARE_CHARGE && q.flareTimer > 0;
      q.flaring = q.flareTimer <= 0 && q.flareTimer > -K.FLARE_BLOOM;
      q.flareRadius = q.flaring ? K.FLARE_RADIUS : 0;
      if (Math.abs(q.flareTimer) < K.TICK_DT) cues.add(K.CUES.flare);
      if (q.flareTimer <= -K.FLARE_BLOOM) q.flareTimer = K.FLARE_INTERVAL;
    }
    if (q.travel && q.released) {
      if (q.state === "den") {
        const gy = n.tiles.findIndex((r) => r.includes("g")),
          gx = gy < 0 ? -1 : n.tiles[gy].indexOf("g");
        if (gx >= 0) {
          q = move(n, q, speed(q), (x, y) => bfs(n, x, y, gx, gy), true);
          if (q.tx === gx && q.ty === gy) q.state = "wander";
        }
      } else
        q = move(
          n,
          q,
          speed(q),
          (x, y) =>
            q.state === "chase" && q.fixX !== null && q.fixY !== null
              ? bfs(n, x, y, q.fixX, q.fixY)
              : (directions.find(
                  (z) => z !== reverse[q.dir] && !!next(n, x, y, z, true),
                ) ?? reverse[q.dir]),
          true,
        );
    }
    return q;
  });
  if (
    n.predators.some(
      (p) =>
        p.state !== "den" && p.tx === n.forager.tx && p.ty === n.forager.ty,
    )
  ) {
    cues.add(K.CUES.caught);
    if (n.lives === 0) {
      n.screen = "gameover";
      n.menuIndex = 0;
    } else {
      const score = n.score,
        lives = n.lives - 1,
        depth = n.depth,
        tiles = n.tiles,
        plankton = n.plankton,
        visibility = n.visibility;
      n = {
        ...dive(n),
        score,
        lives,
        depth,
        tiles,
        plankton,
        visibility,
        predators: kinds(depth).map((kind, index) => predator(kind, index)),
      } as FathomState;
    }
  }
  return illuminate(reconcile(n));
}

function confirm(s: FathomState) {
  if (s.screen === "title") {
    const i = s.menuIndex ?? 0;
    return i === 0
      ? dive({ ...s, titleIndex: i })
      : { ...s, titleIndex: i, screen: "howto" as const, menuIndex: null };
  }
  if (s.screen === "howto")
    return { ...s, screen: "title" as const, menuIndex: s.titleIndex };
  if (s.screen === "paused") {
    if (s.menuIndex === 0)
      return { ...s, screen: "playing" as const, menuIndex: null };
    if (s.menuIndex === 1) return dive(s);
    return {
      ...fresh(s.images, s.muted),
      titleIndex: s.titleIndex,
      menuIndex: s.titleIndex,
    };
  }
  if (s.screen === "gameover")
    return s.menuIndex === 0
      ? dive(s)
      : {
          ...fresh(s.images, s.muted),
          titleIndex: s.titleIndex,
          menuIndex: s.titleIndex,
        };
  return s;
}
function update(state: DeepReadonly<FathomState>, api: UpdateApi, dt: number) {
  let s = reconcile(state);
  if (api.input.pressed("mute")) api.audio.setMuted(!api.audio.muted());
  s.muted = api.audio.muted();
  if (s.screen === "playing" && api.input.pressed("pause")) {
    s.screen = "paused";
    s.menuIndex = 0;
    return s;
  }
  if (
    s.screen === "paused" &&
    (api.input.pressed("pause") || api.input.pressed("back"))
  ) {
    s.screen = "playing";
    s.menuIndex = null;
    return s;
  }
  const m = menu(s.screen);
  if (m) {
    if (api.input.pressed("up"))
      s.menuIndex = ((s.menuIndex ?? 0) - 1 + m.length) % m.length;
    if (api.input.pressed("down"))
      s.menuIndex = ((s.menuIndex ?? 0) + 1) % m.length;
    const p = api.input.pointer();
    for (let i = 0; i < m.length; i++) {
      const r = rect(i);
      if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h)
        s.menuIndex = i;
    }
    if (api.input.pressed("confirm") || api.input.pointerReleased())
      s = confirm(s);
  } else if (
    s.screen === "howto" &&
    (api.input.pressed("confirm") ||
      api.input.pressed("back") ||
      api.input.pointerReleased())
  )
    s = confirm(s);
  let a = s.accumulator + Math.max(0, Math.min(0.25, dt));
  const cues = new Set<string>(),
    held = directions.find((d) => api.input.value(d) > 0) ?? null,
    sonar = api.input.pressed("a"),
    ink = api.input.pressed("b");
  while (a + 1e-12 >= K.TICK_DT) {
    s = step(s, held, sonar, ink, cues);
    a -= K.TICK_DT;
  }
  s.accumulator = a;
  cues.forEach((c) => api.audio.play(c));
  return reconcile(s);
}

function text(
  c: CanvasRenderingContext2D,
  t: string,
  x: number,
  y: number,
  z = 22,
  color = "#d7fbff",
  align: CanvasTextAlign = "left",
) {
  c.font = `${z}px ui-monospace,monospace`;
  c.textAlign = align;
  c.fillStyle = color;
  c.fillText(t, x, y);
}
function mazeView(s: DeepReadonly<FathomState>, c: CanvasRenderingContext2D) {
  c.save();
  c.beginPath();
  c.arc(s.forager.x, s.forager.y, s.windowRadius, 0, Math.PI * 2);
  c.clip();
  c.fillStyle = "#07172a";
  c.fillRect(64, 80, 1152, 576);
  for (let y = 0; y < 18; y++)
    for (let x = 0; x < 36; x++) {
      const px = 64 + x * 32,
        py = 80 + y * 32,
        v = s.visibility[y][x];
      if (v === "u") {
        c.drawImage(s.images.walls[17], px, py);
        continue;
      }
      c.globalAlpha = v === "l" ? 1 : 0.28;
      const t = s.tiles[y][x];
      if (t === "#") {
        let m = 0;
        if (s.tiles[y - 1]?.[x] === "#") m |= 1;
        if (s.tiles[y]?.[x + 1] === "#") m |= 2;
        if (s.tiles[y + 1]?.[x] === "#") m |= 4;
        if (s.tiles[y]?.[x - 1] === "#") m |= 8;
        c.drawImage(s.images.walls[m], px, py);
      } else c.drawImage(s.images.walls[t === "g" ? 18 : 16], px, py);
      if (s.plankton[y][x] === "*") {
        c.fillStyle = "#8cfff2";
        c.beginPath();
        c.arc(px + 16, py + 16, 3, 0, 7);
        c.fill();
      }
    }
  c.globalAlpha = 1;
  for (const d of s.drifters) {
    c.fillStyle = "#ff9e43";
    c.beginPath();
    c.arc(d.x, d.y - 5, 4, 0, 7);
    c.fill();
    if (d.lit)
      c.drawImage(
        s.images.drifter[Math.floor(s.simTime * 8) % 8],
        d.x - 16,
        d.y - 16,
      );
  }
  c.restore();
  for (const p of s.predators) {
    if (p.kind === "lanternjaw" && p.state === "wander") {
      c.fillStyle = "#ff9e43";
      c.beginPath();
      c.arc(p.x, p.y - 5, 4, 0, 7);
      c.fill();
    }
    if (p.lit) {
      const b = { down: 0, up: 2, left: 4, right: 6 }[p.dir],
        a =
          p.kind === "lanternjaw"
            ? s.images.lanternjaw
            : p.kind === "gloamfin"
              ? s.images.gloamfin
              : s.images.flarefish,
        f =
          p.kind === "lanternjaw" && p.state === "wander"
            ? 8 + (Math.floor(s.simTime * 8) % 8)
            : b + (Math.floor(s.simTime * 7) % 2);
      c.drawImage(a[f], p.x - 16, p.y - 16);
    }
    if (p.kind === "flarefish" && (p.flaring || p.flareCharging)) {
      c.globalCompositeOperation = "screen";
      c.drawImage(
        s.images.bloom[p.flaring ? 5 : 2],
        p.x - 192,
        p.y - 192,
        384,
        384,
      );
      c.globalCompositeOperation = "source-over";
    }
  }
  for (const i of s.inkClouds) {
    c.fillStyle = "rgba(0,1,10,.8)";
    c.beginPath();
    c.arc(i.x, i.y, i.radius, 0, 7);
    c.fill();
  }
  for (const p of s.pulses) {
    c.strokeStyle =
      p.tint === "cyan"
        ? "#46f7ff"
        : p.tint === "violet"
          ? "#b66cff"
          : "#ff9b45";
    c.lineWidth = 4;
    c.beginPath();
    const o = center(p.ox, p.oy);
    c.arc(o.x, o.y, p.front * 32, 0, 7);
    c.stroke();
  }
  const f = { down: 0, up: 2, left: 4, right: 6 }[s.forager.dir];
  c.shadowColor = "#5ff8ff";
  c.shadowBlur = 18;
  c.drawImage(
    s.images.glimmerfin[
      f + (s.forager.moving ? Math.floor(s.simTime * 9) % 2 : 0)
    ],
    s.forager.x - 16,
    s.forager.y - 16,
  );
  c.shadowBlur = 0;
}
function render(s: DeepReadonly<FathomState>, api: RenderApi) {
  const c = api.ctx;
  c.imageSmoothingEnabled = false;
  c.fillStyle = BACKGROUND;
  c.fillRect(0, 0, 1280, 720);
  if (s.screen === "title") {
    text(c, K.TITLE_TEXT, 640, 235, 92, "#9ffcff", "center");
    text(c, K.TAGLINE_TEXT, 640, 292, 22, "#6599aa", "center");
  }
  if (["countdown", "playing", "paused", "cleared"].includes(s.screen))
    mazeView(s, c);
  if (["countdown", "playing", "paused", "cleared"].includes(s.screen)) {
    text(c, String(s.score).padStart(6, "0"), 76, 55, 42);
    text(c, K.DIVE_LABEL, 640, 35, 16, "#51798b", "center");
    text(c, `LIVES ${s.lives}`, 76, 700);
    text(c, `DEPTH ${s.depth}`, 640, 700, 20, "#9bd5dd", "center");
    text(
      c,
      `SONAR ${s.sonar.ready ? "READY" : s.sonar.cooldown.toFixed(1)}`,
      850,
      700,
      16,
    );
    text(
      c,
      `INK ${s.ink.ready ? "READY" : s.ink.cooldown.toFixed(1)}`,
      1080,
      700,
      16,
    );
  }
  const m = menu(s.screen);
  if (m) {
    if (s.screen === "paused") {
      c.fillStyle = "rgba(1,4,12,.76)";
      c.fillRect(360, 180, 560, 420);
      text(c, "PAUSED", 640, 290, 48, "#9ffcff", "center");
    }
    if (s.screen === "gameover") {
      text(c, "THE ABYSS CLAIMS YOU", 640, 190, 44, "#ff7098", "center");
      text(
        c,
        `SCORE ${s.score} • DEPTH ${s.depth}`,
        640,
        270,
        22,
        "#a9ced8",
        "center",
      );
    }
    m.forEach((v, i) => {
      const r = rect(i);
      if (i === s.menuIndex) {
        c.fillStyle = "rgba(75,238,255,.13)";
        c.fillRect(r.x, r.y, r.w, r.h);
        c.strokeStyle = "#69f5ff";
        c.strokeRect(r.x, r.y, r.w, r.h);
      }
      text(
        c,
        v,
        640,
        r.y + 34,
        22,
        i === s.menuIndex ? "#eaffff" : "#668b98",
        "center",
      );
    });
  }
  if (s.screen === "howto") {
    text(c, "HOW TO DIVE", 640, 90, 42, "#9ffcff", "center");
    [
      "ARROWS / WASD   swim",
      "SPACE           sonar",
      "SHIFT           ink",
      "ESC / P         pause",
      "M               mute",
      "",
      "GRAZE plankton to feed your light.",
      "LANTERNJAW hunts light. GLOAMFIN hunts sound.",
      "FLAREFISH reveals the abyss in sudden fire.",
      "Remember corridors—not danger.",
      "",
      "PRESS ENTER, SPACE, OR CLICK TO RETURN",
    ].forEach((v, i) =>
      text(
        c,
        v,
        640,
        155 + i * 38,
        19,
        i === 11 ? "#6feeff" : "#b4d9df",
        "center",
      ),
    );
  }
  if (s.screen === "countdown")
    text(c, "DIVE", 640, 370, 58, "#d9ffff", "center");
  if (s.screen === "cleared")
    text(c, `DEPTH ${s.depth} CLEARED`, 640, 370, 45, "#8fffd5", "center");
}
async function assets(api: InitApi<FathomState>) {
  const l = (f: string, n: number) =>
    Promise.all(
      Array.from({ length: n }, (_, i) =>
        api.assets.loadImage(`${f}/${i}.png`),
      ),
    );
  const [glimmerfin, lanternjaw, gloamfin, flarefish, drifter, bloom, walls] =
    await Promise.all([
      l("glimmerfin", 8),
      l("lanternjaw", 16),
      l("gloamfin", 8),
      l("flarefish", 8),
      l("drifter", 8),
      l("flare-bloom", 8),
      l("trench-walls", 19),
    ]);
  return { glimmerfin, lanternjaw, gloamfin, flarefish, drifter, bloom, walls };
}
export const game: Game<FathomState, FathomDebugApi> = {
  async initialize(api) {
    K.ACTIONS.forEach((a) =>
      api.input.register(a, { keys: [...K.BINDINGS[a]] }),
    );
    Object.values(K.CUES).forEach((v, i) =>
      api.audio.define(v, {
        wave: i % 2 ? "triangle" : "sine",
        freq: 180 + i * 70,
        freqTo: 120 + i * 35,
        gain: 0.16,
        durationMs: 90 + i * 18,
      }),
    );
    const im = await assets(api);
    api.diagnostics.register("screen", (s) => s.screen);
    api.diagnostics.register("depth", (s) => s.depth);
    api.diagnostics.register("score / lives", (s) => `${s.score} / ${s.lives}`);
    api.diagnostics.register("brightness", (s) => s.brightness.toFixed(3));
    api.diagnostics.register(
      "V / R",
      (s) => `${s.visionRadius.toFixed(0)} / ${s.windowRadius.toFixed(0)}`,
    );
    api.diagnostics.register(
      "sonar / ink",
      (s) => `${s.sonar.cooldown.toFixed(2)} / ${s.ink.cooldown.toFixed(2)}`,
    );
    api.diagnostics.register("plankton", (s) => s.planktonRemaining);
    api.diagnostics.register(
      "forager",
      (s) => `${s.forager.tx},${s.forager.ty} ${s.forager.dir}`,
    );
    api.diagnostics.register("predators", (s) =>
      s.predators
        .map(
          (p) =>
            `${p.kind}:${p.state}@${p.tx},${p.ty} ${p.speed}${p.alert ? "!" : ""}`,
        )
        .join(" | "),
    );
    return [fresh(im), debug(im)];
  },
  update,
  render,
};
