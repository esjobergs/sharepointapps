(function () {
  const input = document.getElementById('n');
  const out = document.getElementById('result');
  const multiplier = 1.25 * 1.34; // 1.675

  function parseNumber(raw) {
    if (!raw) return NaN;
    const normalized = String(raw).replace(/\s/g,'').replace(',', '.');
    return Number(normalized);
  }
  function formatSv(num) {
    return new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 2 }).format(num);
  }
  function calc() {
    const n = parseNumber(input.value);
    out.textContent = Number.isFinite(n) ? formatSv(n * multiplier) : '–';
  }
  input.addEventListener('input', calc);
  calc();
})();
