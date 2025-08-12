// Simple MVP for Wager/Dare tracker with JSON storage + Express API to connect frontend

const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const DATA_FILE = 'wagers.json';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { wagers: [] };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/wagers', (req, res) => {
  const data = loadData();
  res.json(data.wagers);
});

app.post('/wagers', (req, res) => {
  const { title, description, stake, participants, deadline } = req.body;
  const data = loadData();
  const wager = {
    id: Date.now(),
    title,
    description,
    stake,
    participants,
    deadline,
    status: 'pending',
    proof: [],
    votes: []
  };
  data.wagers.push(wager);
  saveData(data);
  res.json({ success: true, wager });
});

app.post('/wagers/:id/proof', (req, res) => {
  const { user, link } = req.body;
  const data = loadData();
  const wager = data.wagers.find(w => w.id == req.params.id);
  if (!wager) return res.status(404).json({ error: 'Wager not found' });
  wager.proof.push({ user, link });
  saveData(data);
  res.json({ success: true });
});

app.post('/wagers/:id/vote', (req, res) => {
  const { voter, isValid } = req.body;
  const data = loadData();
  const wager = data.wagers.find(w => w.id == req.params.id);
  if (!wager) return res.status(404).json({ error: 'Wager not found' });
  wager.votes.push({ voter, isValid });
  saveData(data);
  res.json({ success: true });
});

const PORT = 3030;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
