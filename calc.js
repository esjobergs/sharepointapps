(function () {
  const input = document.getElementById('n');
  const out = document.getElementById('result');
  const multiplier = 1.25 * 1.34; // 1.675

  // Undantag: specifika inköpspriser -> fast kundpris (visas exakt)
  const overrides = new Map([
    [451, 899],
    [534, 899],
    [1300, 2099],
    [1500, 2099],
  ]);

  function parseNumber(raw) {
    if (!raw) return NaN;
    const normalized = String(raw)
      .trim()
      .replace(/\s/g, '')
      .replace(',', '.')
      .replace(/[^\d.\-]/g, '');
    return Number(normalized);
  }

  const intFormat = new Intl.NumberFormat('sv-SE', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  });
  const toKr = (num) => `${intFormat.format(num)} kr`;

  // Runda UPPÅT till närmaste 10-tal (endast för beräknade priser)
  const ceilTo10 = (num) => Math.ceil(num / 10) * 10;

  function calc() {
    const n = parseNumber(input.value);

    if (!Number.isFinite(n)) {
      out.textContent = '–';
      return;
    }

    const isOverride = overrides.has(n);
    const value = isOverride
      ? overrides.get(n)                 // fast pris (exakt)
      : ceilTo10(n * multiplier);       // beräknat pris (uppåt till tiotal)

    const label = isOverride ? '(Fixed Price)' : '(Calculated Price)';
    out.textContent = `${toKr(value)} ${label}`;
  }

  input.addEventListener('input', calc);
  calc();
})();
