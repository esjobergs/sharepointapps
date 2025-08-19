(function () {
  const input = document.getElementById('n');
  const out = document.getElementById('result');
  const multiplier = 1.25 * 1.34; // 1.675

  // Specialfall: vissa inköpspriser ska ge fasta kundpriser
  const overrides = new Map([
    [451, 899],
    [534, 899],
    [1300, 2099],
    [1500, 2099],
  ]);

  function parseNumber(raw) {
    if (!raw) return NaN;
    // Tillåt mellanslag/kommatecken och ta bort ev. valutatecken
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

    // Kolla om input exakt matchar något specialfall (451, 534, 1300, 1500)
    if (overrides.has(n)) {
      out.textContent = format.format(overrides.get(n));
      return;
    }

    // Standard: n * 1.25 * 1.34
    const result = n * multiplier;
    out.textContent = format.format(result);
  }

  input.addEventListener('input', calc);
  calc();
})();
