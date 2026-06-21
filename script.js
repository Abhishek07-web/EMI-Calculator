
  function fmt(n) {
    return '₹' + parseFloat(n).toLocaleString('en-IN', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
  }

  function sync(targetId, value, isCurrency) {
    const target = document.getElementById(targetId);
    if (target) target.value = value;

    if (targetId === 'amount' || targetId === 'range-amount') {
      const v = parseFloat(value);
      document.getElementById('lbl-amount').textContent =
        '₹' + (isNaN(v) ? '0' : v.toLocaleString('en-IN'));
    }
    if (targetId === 'rate' || targetId === 'range-rate') {
      document.getElementById('lbl-rate').textContent = parseFloat(value).toFixed(1) + '%';
    }
    if (targetId === 'tenure' || targetId === 'range-tenure') {
      document.getElementById('lbl-tenure').textContent = value + ' months';
    }
  }

  function calculate() {
    const P = parseFloat(document.getElementById('amount').value);
    const annualRate = parseFloat(document.getElementById('rate').value);
    const N = parseInt(document.getElementById('tenure').value);
    const errEl = document.getElementById('error-msg');

    if (!P || !annualRate || !N || P <= 0 || annualRate <= 0 || N <= 0) {
      errEl.style.display = 'block';
      return;
    }
    errEl.style.display = 'none';

    const r = annualRate / 12 / 100;
    const emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    document.getElementById('r-emi').textContent = fmt(emi);
    document.getElementById('r-principal').textContent = fmt(P);
    document.getElementById('r-interest').textContent = fmt(totalInterest);
    document.getElementById('r-total').textContent = fmt(totalPayment);

    // Build schedule table
    const tbody = document.getElementById('schedule-body');
    tbody.innerHTML = '';
    let balance = P;

    for (let i = 1; i <= N; i++) {
      const interestPart = balance * r;
      const principalPart = emi - interestPart;
      balance -= principalPart;

      const row = `<tr>
        <td>${i}</td>
        <td>${fmt(emi)}</td>
        <td>${fmt(principalPart)}</td>
        <td>${fmt(interestPart)}</td>
        <td>${fmt(Math.max(0, balance))}</td>
      </tr>`;
      tbody.innerHTML += row;
    }

    document.getElementById('results').style.display = 'block';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
  }

  function reset() {
    document.getElementById('amount').value = 500000;
    document.getElementById('rate').value = 8.5;
    document.getElementById('tenure').value = 60;
    document.getElementById('range-amount').value = 500000;
    document.getElementById('range-rate').value = 8.5;
    document.getElementById('range-tenure').value = 60;
    document.getElementById('lbl-amount').textContent = '₹5,00,000';
    document.getElementById('lbl-rate').textContent = '8.5%';
    document.getElementById('lbl-tenure').textContent = '60 months';
    document.getElementById('results').style.display = 'none';
    document.getElementById('error-msg').style.display = 'none';
  }
