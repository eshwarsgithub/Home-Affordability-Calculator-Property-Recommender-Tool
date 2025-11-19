# Animation & Microinteraction Specs

| Interaction | Trigger | Duration | Easing | Implementation Notes |
| --- | --- | --- | --- | --- |
| Buttons | Hover/Focus | 80–120ms | cubic-bezier(0,0,0.2,1) | `transform: translateY(-2px)` + soft shadow; focus halo retains 2px Royal |
| Cards | Hover | 150–220ms | ease-out | `transform: translate3d(0,-6px,0)` and gradient mask; Map/list sync on focus |
| Modal open | State change | 220–320ms | cubic-bezier(0,0,0.2,1) | Fade backdrop + translateY(16px) content; focus trap + ESC close |
| Gallery reveal | Control click | 400–500ms | ease | Opacity crossfade + `object-fit: cover`; maintain aspect ratio to avoid CLS |
| Toast/Status | Async success | 180ms in / 120ms out | ease-out | Slide from top-right + progress bar width animation |
| Loading skeleton | Slow network toggle | 400ms pulse | ease-in-out | Use `@keyframes pulse` on background gradient |

## CSS Reference
```css
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(10, 93, 255, 0.32);
  transition: transform 120ms ease, box-shadow 200ms ease;
}
.card:hover,
.card:focus-visible {
  transform: translate3d(0, -6px, 0);
  transition: transform 200ms cubic-bezier(0,0,0.2,1);
}
.modal-enter {
  animation: modalFade 260ms cubic-bezier(0,0,0.2,1);
}
@keyframes modalFade {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
```
