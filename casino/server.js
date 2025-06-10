const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'casino_secret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

function ensureLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/login.html');
  }
}

app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    req.session.user = { name: username, tokens: 100 };
    res.redirect('/game.html');
  } else {
    res.redirect('/login.html');
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

app.post('/spin', ensureLoggedIn, (req, res) => {
  const slot1 = Math.floor(Math.random() * 5);
  const slot2 = Math.floor(Math.random() * 5);
  const slot3 = Math.floor(Math.random() * 5);
  let reward = 0;
  if (slot1 === slot2 && slot2 === slot3) {
    reward = 50;
    req.session.user.tokens += reward;
  } else {
    req.session.user.tokens -= 10;
  }
  res.json({ slots: [slot1, slot2, slot3], tokens: req.session.user.tokens, reward });
});

app.get('/status', ensureLoggedIn, (req, res) => {
  res.json({ user: req.session.user });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
