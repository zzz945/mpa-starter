export function lazyloadInit () {
  if (!window.addEventListener || !window.requestAnimationFrame) return
  window.addEventListener('scroll', calcAndLoad, false);
  window.addEventListener('resize', calcAndLoad, false);
  const items = Array.from(document.querySelectorAll('img[data-src]'));
  calcAndLoad();

  function calcAndLoad() {
    if (!items.length) return
    setTimeout(function () {
      requestAnimationFrame(function () { // throttled
        const wt = window.pageYOffset;
        const wb = wt + window.innerHeight;
        items.filter(item => {
          const rect = item.getBoundingClientRect();
          const t = wt + rect.top;
          const b = wt + rect.height;
          if (b > wt && t < wb) {
            item.src = item.dataset.src;
            item.dataset.loaded = true;
            return true
          } else {
            return false
          }
        })
      });
    }, 300);
  }
}
