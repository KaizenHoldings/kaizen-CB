# Button System — Kaizen Casa de Bolsa

## 1. Propósito

Este documento define los dos patrones de botón autorizados para la web:

1. **Action Button:** CTA principal con transición de flechas y expansión de color.
2. **Download Button:** control compacto para descargar documentos.

Los códigos recibidos son referencias de comportamiento, no medidas ni colores definitivos. Durante el desarrollo se deben adaptar a la posición, longitud del texto, superficie, densidad y viewport, siempre respetando `BRAND.md`.

---

## 2. Principios generales

- Crear componentes reutilizables; nunca duplicar el código para cada sección.
- El texto debe recibirse por props y no quedar hardcoded.
- El ancho debe adaptarse al contenido.
- No imponer `width` fija a los CTA principales.
- Mantener una altura táctil mínima de `44 px`.
- Utilizar Sora semibold para etiquetas.
- Conservar foco visible, estados disabled y semántica correcta.
- Respetar `prefers-reduced-motion`.
- Usar Tailwind y/o CSS modular; no instalar `styled-components` solo por los ejemplos.
- Los skills pueden ajustar medidas, ritmo y easing, pero no eliminar el comportamiento central ni las reglas de accesibilidad.

---

## 3. Semántica

El componente debe renderizar el elemento correcto:

- `Link` de Next.js para navegación interna.
- `<a>` para recursos o destinos externos.
- `<button>` para acciones, submits y eventos.

No usar un `<div>` clickeable.

Se deben preservar según corresponda:

- `href`
- `type`
- `target`
- `rel`
- `download`
- `aria-label`
- `aria-describedby`
- `disabled`
- eventos existentes

Los textos visuales duplicados por la animación deben marcarse con `aria-hidden="true"`. El elemento interactivo debe mantener un único nombre accesible.

---

## 4. Tokens compartidos

Los nombres pueden integrarse en el sistema global de Tailwind o CSS, conservando estos valores de marca:

```css
:root {
  --kcb-navy: #0e3048;
  --kcb-blue: #205890;
  --kcb-blue-2: #3e7cb0;
  --kcb-tint: #eaf1f8;
  --kcb-white: #ffffff;
  --kcb-ink: #1b2a3a;
  --kcb-line: rgba(14, 48, 72, 0.10);
  --kcb-emerald: #0e9f6e;
  --kcb-ease: cubic-bezier(0.23, 1, 0.32, 1);
  --kcb-focus: #0e9f6e;
}
```

Los botones deben poder redefinir sus variables según el fondo, sin introducir colores fuera de la paleta.

---

## 5. Action Button

### 5.1. Usos

Utilizar para:

- CTA del navbar.
- CTA principal y secundario del hero cuando tengan una acción clara.
- “Abrir cuenta”.
- “Quiero asesoría”.
- Acciones de registro o contacto.
- Suscripción al newsletter cuando se decida usar este patrón.

No utilizar para:

- Hamburger o cerrar menú.
- Tabs de persona natural/jurídica.
- Acordeones.
- Paginación compacta.
- Iconos sociales.
- Controles de carrusel.
- Descargas de documentos.
- Enlaces de texto dentro de publicaciones.

### 5.2. Comportamiento obligatorio

- En reposo se ve la etiqueta y una flecha a la derecha.
- En hover o focus-visible, la flecha derecha sale del botón.
- Una segunda flecha entra desde la izquierda.
- La etiqueta se desplaza ligeramente hacia la derecha.
- Una superficie circular o radial se expande hasta cubrir el fondo.
- El color del texto y los iconos cambia para mantener contraste.
- En active, el botón reduce su escala de forma muy sutil.
- La animación no debe provocar layout shift.

### 5.3. API conceptual

```tsx
type ActionButtonProps = {
  children: React.ReactNode;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  surface?: 'light' | 'dark' | 'blue';
  emphasis?: 'primary' | 'secondary' | 'accent';
  fullWidth?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
};
```

`fullWidth` debe ser una decisión de composición, no el comportamiento por defecto. En móvil puede activarse para grupos verticales o formularios.

### 5.4. Estructura de referencia

```tsx
<button className="kcb-action" data-surface="light" data-emphasis="primary">
  <svg className="kcb-action__arrow kcb-action__arrow--enter" aria-hidden="true" />
  <span className="kcb-action__label" aria-hidden="true">Abrir cuenta</span>
  <span className="kcb-action__fill" aria-hidden="true" />
  <svg className="kcb-action__arrow kcb-action__arrow--exit" aria-hidden="true" />
</button>
```

El nombre accesible debe provenir del contenido real del botón o de `aria-label`, no de las dos copias animadas.

### 5.5. CSS base adaptable

```css
.kcb-action {
  --btn-bg: transparent;
  --btn-fg: var(--kcb-blue);
  --btn-border: var(--kcb-blue);
  --btn-fill: var(--kcb-blue);
  --btn-hover-fg: var(--kcb-white);

  position: relative;
  isolation: isolate;
  display: inline-flex;
  inline-size: fit-content;
  max-inline-size: 100%;
  min-block-size: 2.75rem;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  gap: 0.5rem;
  padding-block: clamp(0.75rem, 1vw, 0.95rem);
  padding-inline: clamp(1.25rem, 2.4vw, 2.25rem);
  border: 2px solid var(--btn-border);
  border-radius: 999px;
  background: var(--btn-bg);
  color: var(--btn-fg);
  font-family: 'Sora', system-ui, sans-serif;
  font-size: clamp(0.875rem, 0.82rem + 0.2vw, 1rem);
  font-weight: 600;
  line-height: 1;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 0 0 0 transparent;
  transition:
    color 420ms var(--kcb-ease),
    border-color 420ms var(--kcb-ease),
    border-radius 420ms var(--kcb-ease),
    box-shadow 420ms var(--kcb-ease),
    transform 180ms ease;
}

.kcb-action__label,
.kcb-action__arrow {
  position: relative;
  z-index: 2;
  flex: none;
  transition:
    transform 620ms var(--kcb-ease),
    opacity 420ms var(--kcb-ease);
}

.kcb-action__label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.kcb-action__arrow {
  position: absolute;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  fill: currentColor;
}

.kcb-action__arrow--exit {
  inset-inline-end: 1rem;
}

.kcb-action__arrow--enter {
  inset-inline-start: -1.75rem;
  opacity: 0;
}

.kcb-action__fill {
  position: absolute;
  z-index: 0;
  inset: -1px;
  border-radius: inherit;
  background: var(--btn-fill);
  clip-path: circle(0% at 50% 50%);
  transition: clip-path 620ms var(--kcb-ease);
}

.kcb-action:is(:hover, :focus-visible) {
  color: var(--btn-hover-fg);
  border-color: var(--btn-fill);
  border-radius: clamp(0.75rem, 1.4vw, 1rem);
  box-shadow: 0 14px 30px -16px rgba(14, 48, 72, 0.48);
}

.kcb-action:is(:hover, :focus-visible) .kcb-action__fill {
  clip-path: circle(150% at 50% 50%);
}

.kcb-action:is(:hover, :focus-visible) .kcb-action__arrow--exit {
  transform: translateX(3rem);
  opacity: 0;
}

.kcb-action:is(:hover, :focus-visible) .kcb-action__arrow--enter {
  transform: translateX(2.75rem);
  opacity: 1;
}

.kcb-action:is(:hover, :focus-visible) .kcb-action__label {
  transform: translateX(0.65rem);
}

.kcb-action:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--kcb-focus) 55%, transparent);
  outline-offset: 3px;
}

.kcb-action:active:not(:disabled) {
  transform: scale(0.97);
}

.kcb-action:disabled,
.kcb-action[aria-disabled='true'] {
  cursor: not-allowed;
  opacity: 0.5;
  box-shadow: none;
}
```

La implementación puede sustituir `color-mix()` por un token compatible si el soporte objetivo lo requiere.

### 5.6. Variantes por superficie

```css
.kcb-action[data-surface='light'][data-emphasis='primary'] {
  --btn-bg: transparent;
  --btn-fg: var(--kcb-blue);
  --btn-border: var(--kcb-blue);
  --btn-fill: var(--kcb-blue);
  --btn-hover-fg: var(--kcb-white);
}

.kcb-action[data-surface='light'][data-emphasis='secondary'] {
  --btn-bg: var(--kcb-white);
  --btn-fg: var(--kcb-navy);
  --btn-border: var(--kcb-line);
  --btn-fill: var(--kcb-navy);
  --btn-hover-fg: var(--kcb-white);
}

.kcb-action[data-surface='dark'] {
  --btn-bg: transparent;
  --btn-fg: var(--kcb-white);
  --btn-border: var(--kcb-white);
  --btn-fill: var(--kcb-white);
  --btn-hover-fg: var(--kcb-navy);
}

.kcb-action[data-surface='blue'][data-emphasis='accent'] {
  --btn-bg: var(--kcb-emerald);
  --btn-fg: var(--kcb-white);
  --btn-border: var(--kcb-emerald);
  --btn-fill: var(--kcb-white);
  --btn-hover-fg: var(--kcb-navy);
}

.kcb-action[data-full-width='true'] {
  inline-size: 100%;
}
```

La variante debe seleccionarse según la superficie real, no por el nombre de la sección.

---

## 6. Download Button

### 6.1. Usos

Utilizar exclusivamente para:

- Estados financieros.
- Organigramas.
- Documentos institucionales.
- Documentos de referencia y cumplimiento.
- Archivos adjuntos a publicaciones.

No usar como CTA principal ni como único acceso a una tarjeta completa cuando el título del documento también puede funcionar como enlace.

### 6.2. Contenido dinámico

El ejemplo recibido contiene `100MB` de forma fija. En producción, el tooltip debe construirse con metadatos reales:

- Acción: “Descargar”.
- Tipo: “PDF”, “XLSX”, etc.
- Tamaño: valor real cuando esté disponible.

Ejemplo: **“Descargar PDF · 2,4 MB”**.

Si el tamaño no existe, no se debe inventar.

### 6.3. API conceptual

```tsx
type DownloadButtonProps = {
  href: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  surface?: 'light' | 'dark' | 'blue';
  openInNewTab?: boolean;
};
```

### 6.4. Estructura de referencia

```tsx
<a
  className="kcb-download"
  href={href}
  download={fileName}
  aria-label="Descargar Estado financiero de abril 2026, PDF, 2,4 MB"
  data-surface="dark"
>
  <span className="kcb-download__icon" aria-hidden="true">
    <svg className="kcb-download__arrow" />
    <span className="kcb-download__tray" />
  </span>
  <span className="kcb-download__tooltip" role="tooltip" aria-hidden="true">
    Descargar PDF · 2,4 MB
  </span>
</a>
```

### 6.5. CSS base adaptable

```css
.kcb-download {
  --download-bg: var(--kcb-navy);
  --download-icon: var(--kcb-white);
  --download-hover-bg: var(--kcb-blue);
  --download-hover-icon: var(--kcb-white);
  --download-tooltip-bg: var(--kcb-ink);
  --download-tooltip-fg: var(--kcb-white);

  position: relative;
  display: inline-flex;
  flex: none;
  inline-size: clamp(2.75rem, 2.55rem + 0.5vw, 3.125rem);
  block-size: clamp(2.75rem, 2.55rem + 0.5vw, 3.125rem);
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 999px;
  background: var(--download-bg);
  color: var(--download-icon);
  cursor: pointer;
  box-shadow: 0 8px 22px -14px rgba(14, 48, 72, 0.55);
  transition:
    color 260ms ease,
    background-color 260ms ease,
    border-color 260ms ease,
    transform 180ms ease,
    box-shadow 260ms ease;
}

.kcb-download__icon {
  position: relative;
  display: grid;
  place-items: center;
  inline-size: 1.25rem;
  block-size: 1.35rem;
}

.kcb-download__arrow {
  inline-size: 1rem;
  block-size: 1rem;
  fill: currentColor;
}

.kcb-download__tray {
  inline-size: 1.125rem;
  block-size: 0.35rem;
  border-inline: 2px solid currentColor;
  border-block-end: 2px solid currentColor;
}

.kcb-download__tooltip {
  position: absolute;
  z-index: 10;
  inset-block-start: 50%;
  inset-inline-start: calc(100% + 0.75rem);
  max-inline-size: min(15rem, 70vw);
  transform: translate(0.35rem, -50%);
  padding: 0.45rem 0.65rem;
  border-radius: 0.5rem;
  background: var(--download-tooltip-bg);
  color: var(--download-tooltip-fg);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 180ms ease,
    transform 220ms var(--kcb-ease),
    visibility 180ms ease;
}

.kcb-download__tooltip::before {
  content: '';
  position: absolute;
  inset-inline-start: -0.3rem;
  inset-block-start: 50%;
  inline-size: 0.6rem;
  block-size: 0.6rem;
  background: inherit;
  transform: translateY(-50%) rotate(45deg);
}

.kcb-download:is(:hover, :focus-visible) {
  background: var(--download-hover-bg);
  color: var(--download-hover-icon);
  transform: translateY(-2px);
  box-shadow: 0 12px 26px -14px rgba(14, 48, 72, 0.6);
}

.kcb-download:is(:hover, :focus-visible) .kcb-download__arrow {
  animation: kcb-download-enter 520ms var(--kcb-ease) both;
}

.kcb-download:is(:hover, :focus-visible) .kcb-download__tooltip {
  opacity: 1;
  visibility: visible;
  transform: translate(0, -50%);
}

.kcb-download:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--kcb-focus) 55%, transparent);
  outline-offset: 3px;
}

.kcb-download:active {
  transform: scale(0.96);
}

@keyframes kcb-download-enter {
  from {
    opacity: 0;
    transform: translateY(-0.55rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 6.6. Variantes por superficie

```css
.kcb-download[data-surface='light'] {
  --download-bg: var(--kcb-navy);
  --download-icon: var(--kcb-white);
  --download-hover-bg: var(--kcb-blue);
  --download-hover-icon: var(--kcb-white);
}

.kcb-download[data-surface='dark'],
.kcb-download[data-surface='blue'] {
  --download-bg: rgba(255, 255, 255, 0.12);
  --download-icon: var(--kcb-white);
  --download-hover-bg: var(--kcb-white);
  --download-hover-icon: var(--kcb-navy);
  border-color: rgba(255, 255, 255, 0.18);
}
```

En tarjetas oscuras, el tooltip puede colocarse hacia la izquierda cuando no exista espacio a la derecha. La posición debe calcularse por composición o mediante una prop, no permitirse que produzca overflow horizontal.

---

## 7. Responsive y touch

- El CTA principal debe crecer por contenido y puede ocupar `100%` en grupos verticales móviles.
- No reducir el área táctil por debajo de `44 × 44 px`.
- En textos largos, permitir una composición estable sin superponer la flecha.
- Evitar saltos de línea dentro de CTA cortos; permitirlos solo cuando el ancho disponible lo exija.
- El estado inicial debe explicar por sí mismo la acción en dispositivos sin hover.
- El tooltip de descarga no debe contener información imprescindible que no aparezca también en la tarjeta o en el nombre accesible.
- En móvil se puede ocultar visualmente el tooltip si provoca recortes, manteniendo `aria-label` completo.

---

## 8. Movimiento reducido

```css
@media (prefers-reduced-motion: reduce) {
  .kcb-action,
  .kcb-action *,
  .kcb-download,
  .kcb-download * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .kcb-action:is(:hover, :focus-visible) .kcb-action__fill {
    clip-path: circle(150% at 50% 50%);
  }

  .kcb-action:is(:hover, :focus-visible) .kcb-action__label,
  .kcb-action:is(:hover, :focus-visible) .kcb-action__arrow {
    transform: none;
  }
}
```

Con movimiento reducido, el cambio de color y el foco deben mantenerse comprensibles aunque las flechas no se desplacen.

---

## 9. Estados obligatorios

### Action Button

- Default.
- Hover.
- Focus-visible.
- Active.
- Disabled.
- Loading cuando la acción sea asíncrona.

Durante loading:

- Mantener el ancho para evitar layout shift.
- Deshabilitar interacciones repetidas.
- Mostrar un estado accesible con `aria-busy`.
- No reemplazar la etiqueta por un spinner sin nombre.

### Download Button

- Default.
- Hover.
- Focus-visible.
- Active.
- Archivo no disponible.

Si un archivo no está disponible, no mostrar un enlace falso. Usar un estado disabled o retirar la acción manteniendo la información del documento.

---

## 10. Reglas para iconos

- Preferir un componente de icono compartido o la familia ya adoptada por el proyecto.
- Mantener tamaño y stroke consistentes.
- Los SVG decorativos deben usar `aria-hidden="true"` y `focusable="false"`.
- No duplicar símbolos SVG completos en cada botón si ya existe un componente reutilizable.
- No utilizar emojis como flechas o iconos de descarga.

---

## 11. Checklist de implementación

- [ ] Existe un único componente reutilizable para Action Button.
- [ ] Existe un único componente reutilizable para Download Button.
- [ ] El CTA acepta textos de distintas longitudes.
- [ ] Las variantes se seleccionan según el fondo.
- [ ] Los colores provienen de `BRAND.md`.
- [ ] No se instaló `styled-components` solo para los botones.
- [ ] Se renderiza `Link`, `<a>` o `<button>` según la acción.
- [ ] Todos los botones tienen nombre accesible único.
- [ ] Hover y focus-visible producen una experiencia equivalente.
- [ ] Los tooltips no son la única fuente de información.
- [ ] No existe overflow en móvil.
- [ ] Se respeta movimiento reducido.
- [ ] Estados disabled y loading conservan semántica.
- [ ] Los tamaños de archivo son reales y dinámicos.
- [ ] TypeScript, lint y build terminan sin errores introducidos por los componentes.

