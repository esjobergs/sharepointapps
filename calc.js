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

  // Text som visas när priset INTE är undantag
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

  const intFormat = new Intl.NumberFormat('sv-SE', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  });
  const toKr = (num) => `${intFormat.format(num)} kr`;
  const ceilTo10 = (num) => Math.ceil(num / 10) * 10;

  // Hämta/skap en note-div om den saknas i HTML
  function getNoteEl() {
    let el = document.getElementById('note');
    if (!el) {
      el = document.createElement('div');
      el.id = 'note';
      el.style.display = 'none';
      el.style.marginTop = '6px';
      el.style.fontSize = '12px';
      el.style.color = '#64748b'; // "muted"
      out.insertAdjacentElement('afterend', el);
    }
    return el;
  }
  function showNote(show) {
    const el = getNoteEl();
    if (show) {
      el.textContent = NOTE_MSG;
      el.style.display = 'block';
    } else {
      el.textContent = '';
      el.style.display = 'none';
    }
  }

  function calc() {
    const n = parseNumber(input.value);

    if (!Number.isFinite(n)) {
      out.textContent = '–';
      showNote(false);
      return;
    }

    const isOverride = overrides.has(n);
    const value = isOverride ? overrides.get(n) : ceilTo10(n * multiplier);
    const label = isOverride ? '(Fixed Price)' : '(Calculated Price)';

    out.textContent = `${toKr(value)} ${label}`;
    showNote(!isOverride); // Visa infotext bara när det inte är undantag
  }

  input.addEventListener('input', calc);
  calc();
})();
