// Tiny className combiner — no external deps.
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
