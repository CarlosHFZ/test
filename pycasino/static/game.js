document.addEventListener('DOMContentLoaded', () => {
  fetch('/status')
    .then(res => res.json())
    .then(data => {
      document.getElementById('welcome').textContent = 'Jogador: ' + data.user.name;
      document.getElementById('tokens').textContent = data.user.tokens;
    });

  document.getElementById('spin').addEventListener('click', () => {
    fetch('/spin', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        document.getElementById('slot1').textContent = data.slots[0];
        document.getElementById('slot2').textContent = data.slots[1];
        document.getElementById('slot3').textContent = data.slots[2];
        document.getElementById('tokens').textContent = data.tokens;
        if (data.reward > 0) {
          document.getElementById('result').textContent = 'Voc\u00ea ganhou ' + data.reward + ' fichas!';
        } else {
          document.getElementById('result').textContent = 'Sem sorte desta vez.';
        }
      });
  });
});
