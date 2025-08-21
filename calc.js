(function () {
  const input   = document.getElementById('n');
  const outIncl = document.getElementById('result');        // incl. VAT
  const outEx   = document.getElementById('resultExVat');   // excl. VAT

  const multiplier = 1.25 * 1.34; // 1.675

  // Undantag: specifika inköpspriser -> fast kundpris (visas exakt)
  const overrides = new Map([
    [451,  899],
    [534,  899],
    [1300, 2099],
    [1500, 2099],
  ]);

  const NOTE_MSG = 'De-select "⚡ Den här bilen är en elbil" in Gire portal upon booking';

  function parseNumber(raw) {
    if (!raw) return NaN;
    const normalized = String(raw)
      .trim()
      .replace(/\s/g, '')
      .replace(',', '.')
      .replace(/[^\d.\-]/g, '');
    return Number(normalized);
  }

  // Formatering av heltal i sv-SE
  const intFormat = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0, minimumFractionDigits: 0 });
  const toKr      = (num) => `${intFormat.format(num)} kr`;

  // Runda UPPÅT till närmaste 10-tal (endast för beräknade priser inkl. moms)
  const ceilTo10  = (num) => Math.ceil(num / 10) * 10;

  // Exakt 80% av heltalspriset (inkl. moms) utan avrundning.
  // Eftersom 0,8 = 4/5 får vi högst en decimal (.,2 . ,4 , .6 , .8).
  function toKrEightyPercentNoRound(inclVatInt) {
    const numerator = inclVatInt * 4;       // 4 * pris
    const whole     = Math.floor(numerator / 5); // heltalsdel
    const rem       = numerator % 5;        // 0..4  ->  .0 .2 .4 .6 .8
    const wholeStr  = intFormat.format(whole);
    if (rem === 0) return `${wholeStr} kr`;
    const decimalDigit = rem * 2;           // 2,4,6,8
    return `${wholeStr},${decimalDigit} kr`; // sv-SE-komma, ingen avrundning
  }

  function showNote(show) {
    const noteEl = document.getElementById('note');
    if (!noteEl) return;
    noteEl.textContent = show ? NOTE_MSG : '';
    noteEl.style.display = show ? 'block' : 'none';
  }

  function calc() {
    const n = parseNumber(input.value);

    if (!Number.isFinite(n)) {
      outIncl.textContent = '–';
      outEx.textContent   = '–';
      showNote(false);
      return;
    }

    // Customer Fee (incl. VAT)
    const isOverride = overrides.has(n);
    const feeValue   = isOverride ? overrides.get(n) : ceilTo10(n * multiplier); // heltal kr
    const feeLabel   = isOverride ? '(Fixed Price)' : '(Calculated Price)';
    outIncl.textContent = `${toKr(feeValue)} ${feeLabel}`;

    // Customer Fee (excl. VAT) = 80% av inkl. VAT, exakt utan avrundning
    outEx.textContent = `${toKrEightyPercentNoRound(feeValue)}`;

    // Visa infotext bara när det INTE är undantag
    showNote(!isOverride);
  }

  input.addEventListener('input', calc);
  calc();
})();

