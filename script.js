// Stopwatch logic using high-resolution time (performance.now)
const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('lapsList');

let startTime = 0;
let elapsedBefore = 0; // milliseconds already elapsed before current run
let rafId = null;
let running = false;

function formatTime(ms) {
  const milliseconds = Math.floor(ms % 1000);
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  return (
    String(hours).padStart(2, '0') + ':' +
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0') + '.' +
    String(milliseconds).padStart(3, '0')
  );
}

function update() {
  const now = performance.now();
  const elapsed = elapsedBefore + (now - startTime);
  display.textContent = formatTime(elapsed);
  rafId = requestAnimationFrame(update);
}

startBtn.addEventListener('click', () => {
  if (!running) {
    // start or resume
    startTime = performance.now();
    rafId = requestAnimationFrame(update);
    running = true;
    startBtn.textContent = 'Running...';
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    lapBtn.disabled = false;
    resetBtn.disabled = false;
  }
});

pauseBtn.addEventListener('click', () => {
  if (running) {
    cancelAnimationFrame(rafId);
    const now = performance.now();
    elapsedBefore += now - startTime;
    running = false;
    startBtn.textContent = 'Start';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
  }
});

resetBtn.addEventListener('click', () => {
  cancelAnimationFrame(rafId);
  startTime = 0;
  elapsedBefore = 0;
  running = false;
  display.textContent = '00:00:00.000';
  lapsList.innerHTML = '';
  startBtn.textContent = 'Start';
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  lapBtn.disabled = true;
  resetBtn.disabled = true;
});

lapBtn.addEventListener('click', () => {
  const now = performance.now();
  const elapsed = elapsedBefore + (running ? (now - startTime) : 0);
  const li = document.createElement('li');
  const count = lapsList.children.length + 1;
  li.textContent = `Lap ${count} — ${formatTime(elapsed)}`;
  lapsList.prepend(li);
});

// Keyboard shortcuts: Space to start/pause, L for lap, R for reset
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (running) pauseBtn.click();
    else startBtn.click();
  } else if (e.key.toLowerCase() === 'l') {
    if (!lapBtn.disabled) lapBtn.click();
  } else if (e.key.toLowerCase() === 'r') {
    if (!resetBtn.disabled) resetBtn.click();
  }
});
