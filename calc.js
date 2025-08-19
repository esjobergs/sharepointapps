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

  // Formatering: heltal + " kr"
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

    // Värde: använd override om träff, annars beräkning
    const value = overrides.has(n) ? overrides.get(n) : (n * multiplier);

    // Etikett: baserat på inmatningen (n)
    const label = n > 1500 ? '(calculated price)' : '(Fixed price)';

    out.textContent = `${toKrCeil(value)} ${label}`;
  }

  input.addEventListener('input', calc);
  calc();
})();
