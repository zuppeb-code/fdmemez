const VOTE_ENDPOINT = "https://script.google.com/macros/s/AKfycbyVe7H3EnrxDYqZysIQmscdpl3g_YJJwkrE2_Ag4_76-4gH6UtRWNC4TLSGtKAIope-/exec"; // es. https://script.google.com/macros/s/XXXX/exec

async function loadMatch() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('match') || '1';
  const res = await fetch('matches.json');
  const matches = await res.json();
  const match = matches[id];
  if (!match) {
    document.getElementById('message').innerText = 'Match non trovato';
    return;
  }
  document.getElementById('videoA').src = match.a;
  document.getElementById('videoB').src = match.b;
  window.currentMatch = { id, ...match };
}
loadMatch();

document.getElementById('btnA').addEventListener('click', () => sendVote('A'));
document.getElementById('btnB').addEventListener('click', () => sendVote('B'));

async function sendVote(choice) {
  const m = window.currentMatch;
  if (!m) return;
  document.getElementById('message').innerText = 'Invio voto...';
  try {
    const res = await fetch(VOTE_ENDPOINT, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId: m.id, videoA: m.a, videoB: m.b, choice, voter: '' })
    });
    const txt = await res.text();
    console.log('response from webapp:', txt);
    document.getElementById('message').innerText = 'Grazie! Voto registrato ✅';
  } catch (err) {
    console.error('errore fetch:', err);
    document.getElementById('message').innerText = 'Errore invio voto ❌';
  }
}
