(function () {
  const input = document.getElementById('n');
  const out = document.getElementById('result');
  const multiplier = 1.25 * 1.34; // 1.675

  // Undantag: specifika inköpspriser -> fast kundpris
  const overrides = new Map([
    [451, 899],
    [534, 899],
    [1300, 2099],
    [1500, 2099],
  ]);

  function parseNumber(raw) {
    if (!raw) return NaN;
    // Tillåt mellanslag/komma och ta bort ev. valutatecken
    const normalized = String(raw)
      .trim()
      .replace(/\s/g, '')
      .replace(',', '.')
      .replace(/[^\d.\-]/g, '');
    return Number(normalized);
  }

  // Formatering: heltal + " kr" (alltid uppåt)
  const intFormat = new Intl.NumberFormat('sv-SE', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  });
  const toKrCeil = (num) => `${intFormat.format(Math.ceil(num))} kr`;

  function calc() {
    const n = parseNumber(input.value);

    if (!Number.isFinite(n)) {
      out.textContent = '–';
      return;
    }

    // Etikett styrs av om inmatningen är ett override
    const isOverride = overrides.has(n);

    // Värde: override om träff, annars beräkning
    const value = isOverride ? overrides.get(n) : (n * multiplier);

    const label = isOverride ? '(fast pris)' : '(beräknat)';
    out.textContent = `${toKrCeil(value)} ${label}`;
  }

  input.addEventListener('input', calc);
  calc();
})();
