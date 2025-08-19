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
    // Tillåt mellanslag, komma, och ta bort ev. valutatecken
    const normalized = String(raw)
      .trim()
      .replace(/\s/g, '')
      .replace(',', '.')
      .replace(/[^\d.\-]/g, '');
    return Number(normalized);
  }

  const format = new Intl.NumberFormat('sv-SE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  function calc() {
    const n = parseNumber(input.value);

    if (!Number.isFinite(n)) {
      out.textContent = '–';
      return;
    }

    // Om inmatningen exakt matchar ett undantag -> visa fast pris
    if (overrides.has(n)) {
      const fixed = overrides.get(n);
      out.textContent = `${format.format(fixed)} (Within home delivery zone, fixed price)`;
      return;
    }

    // Annars: beräkna enligt formeln
    const result = n * multiplier;
    out.textContent = `${format.format(result)} (Outside of home delivery zone, calculated price)`;
  }

  input.addEventListener('input', calc);
  calc();
})();
