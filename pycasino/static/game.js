document.addEventListener('DOMContentLoaded', () => {
  fetch('/status')
    .then(res => res.json())
    .then(data => {
      document.getElementById('tokens').textContent = data.user.tokens;
    });

  const spinBtn = document.getElementById('spin');
  if (spinBtn) {
    spinBtn.addEventListener('click', () => {
      fetch('/spin', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          document.getElementById('slot1').textContent = data.slots[0];
          document.getElementById('slot2').textContent = data.slots[1];
          document.getElementById('slot3').textContent = data.slots[2];
          document.getElementById('tokens').textContent = data.tokens;
          const result = document.getElementById('slot-result');
          if (data.reward > 0) {
            result.textContent = `Você ganhou ${data.reward} fichas!`;
          } else {
            result.textContent = 'Sem sorte desta vez.';
          }
        });
    });
  }

  const rouletteBtn = document.getElementById('roulette');
  if (rouletteBtn) {
    rouletteBtn.addEventListener('click', () => {
      const guess = document.getElementById('guess').value;
      fetch('/roulette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess })
      })
        .then(res => res.json())
        .then(data => {
          document.getElementById('tokens').textContent = data.tokens;
          const result = document.getElementById('roulette-result');
          result.textContent = `Resultado: ${data.result}. `;
          if (data.reward > 0) {
            result.textContent += `Você ganhou ${data.reward} fichas!`;
          } else {
            result.textContent += 'Tente novamente.';
          }
        });
    });
  }
});
