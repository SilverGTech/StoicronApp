# Pomodoro (PWA)

Timer pomodoro instalable en iPhone sin App Store, sin Mac y sin pagarle a Apple.
Vite + React + TypeScript + `vite-plugin-pwa`.

## Correr en local

```bash
npm install
npm run dev            # http://localhost:5173
npm run dev -- --host  # para abrirla desde el celular en la misma red WiFi
```

> Desde el celular por IP local la UI funciona, pero **no se puede instalar**
> ni registrar el service worker: eso exige HTTPS. Para instalarla, despliégala.

## Desplegar (gratis, con HTTPS)

Cualquiera sirve. El build es estático: comando `npm run build`, carpeta `dist`.

- **Vercel:** sube el repo a GitHub → "Import project" → listo (detecta Vite solo).
- **Netlify:** "Add new site" → repo → build `npm run build`, publish `dist`.
- **Cloudflare Pages:** "Create project" → repo → preset "Vite".

Cada `git push` despliega una versión nueva; la app instalada se actualiza sola
la próxima vez que la abras (`registerType: 'autoUpdate'`).

## Instalar en el iPhone

1. Abre la URL en **Safari** (en iOS 16.4+ también sirve otro navegador, pero Safari es lo seguro).
2. Botón **Compartir** → **Añadir a pantalla de inicio**.
3. Ábrela desde el ícono: pantalla completa y funciona offline.

## Cómo funciona el timer (y por qué así)

iOS congela el JavaScript cuando la app pasa a segundo plano o bloqueas el teléfono,
así que un `setInterval` que cuente segundos se queda parado.

En vez de contar, guardamos **cuándo termina** la fase (`endsAt`) en `localStorage`.
El tiempo restante siempre es `endsAt - Date.now()`. Al volver a la app
(`visibilitychange`, `focus`, `pageshow`) se llama a `settle()`, que procesa todas las fases
que hayan terminado mientras tanto (incluso varias si tienes el auto-arranque activo).

Archivo clave: `src/hooks/usePomodoro.ts`.

## Estructura

```
src/
  App.tsx                    UI principal
  components/Ring.tsx        Anillo de progreso (SVG)
  components/SettingsSheet   Hoja de ajustes
  hooks/usePomodoro.ts       Lógica del timer (timestamps + catch-up)
  hooks/useWakeLock.ts       Mantener pantalla encendida
  lib/sound.ts               Campana con Web Audio (sin archivos)
  lib/storage.ts             localStorage seguro
  lib/types.ts               Tipos y valores por defecto
public/                      Íconos (incl. apple-touch-icon)
vite.config.ts               Manifest y service worker
```

## Limitaciones conocidas en iOS

- **Sin aviso con la app cerrada (todavía).** Una web app en iOS no puede programar
  notificaciones locales. La solución es Web Push (iOS 16.4+, solo app instalada)
  con un backend mínimo que mande el push cuando termine la fase. → Próximo paso.
- **El sonido solo suena con la app abierta**, y respeta el modo silencio.
- **Wake lock**: si iOS está en modo ahorro de batería puede ignorarlo.
- Los datos viven en `localStorage` del iPhone: si borras la app, se pierden.

## Próximos pasos

- [ ] Notificación push al terminar (Cloudflare Worker + Web Push / VAPID)
- [ ] Historial por día / semana
- [ ] Etiquetar pomodoros por tarea
