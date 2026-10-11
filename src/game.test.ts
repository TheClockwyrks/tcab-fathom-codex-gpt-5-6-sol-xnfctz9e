import { describe, expect, it, vi } from "vitest";
import type { InitApi } from "@clockwyrks/simple-2d";
import { game, type FathomState } from "./game";
import { BRIGHT_HOLD, FATHOM_DEBUG_VERSION, START_LIVES } from "./constants";

async function setup() {
  const register = vi.fn();
  const define = vi.fn();
  const diagnostics = vi.fn();
  const api = {
    input: { register, layout: () => null },
    audio: { define, load: vi.fn() },
    assets: {
      loadImage: vi.fn(async () => ({})),
      loadAudio: vi.fn(),
      load: vi.fn(),
      resolve: vi.fn(),
    },
    diagnostics: { register: diagnostics },
    events: { on: vi.fn() },
    viewport: vi.fn(),
  } as unknown as InitApi<FathomState>;
  const [state, debug] = await game.initialize(api);
  return { state, debug, register, define, diagnostics };
}

describe("Fathom contract", () => {
  it("initializes the title, registrations, state, and debug API", async () => {
    const { state, debug, register, define, diagnostics } = await setup();
    expect(state.screen).toBe("title");
    expect(state.lives).toBe(START_LIVES);
    expect(debug.version).toBe(FATHOM_DEBUG_VERSION);
    expect(register).toHaveBeenCalledTimes(10);
    expect(define).toHaveBeenCalledTimes(7);
    expect(diagnostics.mock.calls.length).toBeGreaterThanOrEqual(9);
  });

  it("poses and reconciles derived sensing state", async () => {
    const { state, debug } = await setup();
    const bright = debug.setBrightness(state, 1);
    expect(bright.visionRadius).toBe(160);
    expect(bright.windowRadius).toBe(320);
    const held = debug.setBrightHold(bright, BRIGHT_HOLD);
    expect(held.brightHold).toBe(BRIGHT_HOLD);
    expect(debug.snapshot(held).brightness).toBe(1);
  });

  it("manipulates fixtures without mutating input", async () => {
    const { state, debug } = await setup();
    const before = debug.snapshot(state);
    const spot = state.tiles
      .flatMap((r, y) => [...r].map((c, x) => ({ c, x, y })))
      .find((v) => v.c === ".")!;
    const moved = debug.setForagerTile(state, spot.x, spot.y);
    expect(debug.clearPlankton(moved).planktonRemaining).toBe(0);
    expect(debug.snapshot(state)).toEqual(before);
    expect(moved.forager).toMatchObject({
      tx: spot.x,
      ty: spot.y,
      moving: false,
    });
  });
});
