# Fathom

Fathom is a bioluminescent deep-sea maze chase for the browser. Graze glowing plankton to feed your light, map the trench with sonar, and evade three predators that hunt by light, sound, and sudden flares. In the Kindle dive, explored ground is remembered but disappears beyond the circular window you carry through the abyss.

## Development

Install dependencies and start Vite:

```sh
npm ci
npm run dev
```

Create the static production site in `dist/` with `npm run build`. The output can be served from a site root or sub-path; `npm run preview` inspects it locally. Run `npm run typecheck`, `npm run lint`, `npm run format`, and `npm test` for the project checks.

## Controls

- Arrow keys or WASD: swim
- Space: cast sonar / confirm
- Left or right Shift: release ink
- Escape or P: pause
- Enter: confirm
- M: mute

Menus also support pointer and touch input. On-screen controls appear on touch devices.
