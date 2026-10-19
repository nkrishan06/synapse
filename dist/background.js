// Author: Krishan Navas. Reuse the Synapse portal's water field as a still background.
(() => {
  if (typeof mountWater !== 'function') return;
  const fields = [];
  document.querySelectorAll('[data-synapse-water]').forEach((element) => {
    try {
      fields.push(mountWater(element, {
        colors: ['#0F8A7A', '#1D3F73', '#2F6F8F'],
        speed: 0.04,
        still: true,
        pixelRatioCap: 1,
      }));
    } catch {
      // CSS retains the same blue/turquoise field if graphics are unavailable.
      element.querySelector('canvas')?.remove();
    }
  });
  addEventListener('pagehide', (event) => {
    if (!event.persisted) fields.forEach((field) => field.destroy());
  });
})();
