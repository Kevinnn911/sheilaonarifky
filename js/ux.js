// File: js/ux.js
// Peningkatan pengalaman pengguna: umpan balik, aksesibilitas, pemutar, pencarian, interaksi komunitas.

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Penyimpanan tidak tersedia (mode privat); fitur tetap berjalan tanpa persistensi.
    }
  }
};

const refreshIcons = () => window.lucide && window.lucide.createIcons();
const $ = (id) => document.getElementById(id);

/* ---------- Toast ---------- */
function toast(message) {
  let region = $('toast-region');
  if (!region) {
    region = document.createElement('div');
    region.id = 'toast-region';
    region.setAttribute('aria-live', 'polite');
    region.className =
      'fixed left-1/2 -translate-x-1/2 bottom-24 z-[90] flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-md';
    document.body.appendChild(region);
  }
  const el = document.createElement('div');
  el.className =
    'px-4 py-2.5 rounded-xl bg-vintage-charcoal text-white text-sm text-center shadow-xl border border-stone-700 transition-opacity duration-300';
  el.textContent = message;
  region.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 2600);
}

/* ---------- Modal: Esc, klik latar, kunci scroll, fokus ---------- */
const MODAL_IDS = ['search-modal', 'member-modal', 'album-modal', 'article-modal', 'lightbox-modal'];
let lastTrigger = null;

function setupModals() {
  MODAL_IDS.forEach((id) => {
    const modal = $(id);
    if (!modal) return;
    new MutationObserver(() => {
      const open = !modal.classList.contains('hidden');
      if (open) {
        lastTrigger = document.activeElement;
        const first = modal.querySelector('input, button, a[href]');
        if (first) first.focus();
      } else if (lastTrigger && lastTrigger.focus) {
        lastTrigger.focus();
        lastTrigger = null;
      }
      document.body.style.overflow = MODAL_IDS.some((m) => !$(m).classList.contains('hidden')) ? 'hidden' : '';
    }).observe(modal, { attributes: true, attributeFilter: ['class'] });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    MODAL_IDS.forEach((id) => $(id) && $(id).classList.add('hidden'));
    toggleMobileMenu(false);
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    toggleSearchModal(true);
  }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role="button"]')) {
    e.preventDefault();
    e.target.click();
  }
});

document.addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  if (item) openLightbox(item.dataset.img, item.dataset.cap);
});

/* ---------- Menu mobile ---------- */
function toggleMobileMenu(force) {
  const menu = $('mobile-menu');
  const btn = $('mobile-menu-btn');
  if (!menu || !btn) return;
  const open = typeof force === 'boolean' ? force : menu.classList.contains('hidden');
  menu.classList.toggle('hidden', !open);
  btn.setAttribute('aria-expanded', String(open));
  btn.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}" class="w-6 h-6"></i>`;
  refreshIcons();
}

/* ---------- Pemutar musik ---------- */
let activeMood = null;
let arpStep = 0;
const ARPEGGIO = [1, 1.25, 1.5, 2, 1.5, 1.25];

const audioPlayer = typeof Audio !== 'undefined' ? new Audio() : null;
if (audioPlayer) {
  audioPlayer.preload = 'metadata';

  audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
      const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      const bar = $('seek-bar');
      const timeEl = $('current-time');
      const durEl = $('total-duration');
      if (bar) bar.value = pct;
      if (timeEl) timeEl.innerText = formatDuration(audioPlayer.currentTime);
      if (durEl) durEl.innerText = formatDuration(audioPlayer.duration);
    }
  });

  audioPlayer.addEventListener('ended', () => {
    if (typeof nextTrack === 'function') {
      nextTrack();
    }
  });

  audioPlayer.addEventListener('play', () => {
    isPlaying = true;
    document.body.classList.add('has-player', 'is-playing');
    const eq = document.querySelector('.eq-bars');
    if (eq) eq.classList.add('on');
    setPlayIcons(true);
  });

  audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    document.body.classList.remove('is-playing');
    const eq = document.querySelector('.eq-bars');
    if (eq) eq.classList.remove('on');
    setPlayIcons(false);
  });

  audioPlayer.addEventListener('error', () => {
    console.warn('HTML5 Audio failed to load source, attempting fallback.');
    fallbackAudioPlay();
  });
}

function formatDuration(sec) {
  if (isNaN(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function playNote(freq) {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.07, t + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + 0.6);
}

function setPlayIcons(playing) {
  const buttons = [
    ['main-play-btn', `w-7 h-7 fill-current ${playing ? '' : 'ml-1'}`],
    ['mini-play-btn', 'w-4 h-4 fill-current']
  ];
  buttons.forEach(([id, cls]) => {
    const btn = $(id);
    if (!btn) return;
    btn.setAttribute('aria-label', playing ? 'Jeda' : 'Putar');
    btn.innerHTML = `<i data-lucide="${playing ? 'pause' : 'play'}" class="${cls}"></i>`;
  });
  refreshIcons();
}

function renderProgress() {
  const bar = $('seek-bar');
  const time = $('current-time');
  if (bar) bar.value = audioProgress;
  if (time) time.innerText = `0:${String(Math.floor(audioProgress * 0.3)).padStart(2, '0')}`;
}

function seekTo(value) {
  if (audioPlayer && audioPlayer.duration) {
    audioPlayer.currentTime = (Number(value) / 100) * audioPlayer.duration;
  } else {
    audioProgress = Number(value);
    renderProgress();
  }
}

function playAudio() {
  const track = tracksData[currentTrackIdx];
  if (!track) return;

  if (track.src && audioPlayer) {
    const currentSrc = audioPlayer.getAttribute('src');
    if (!currentSrc || !currentSrc.includes(track.src)) {
      audioPlayer.src = track.src;
    }
    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          document.body.classList.add('has-player', 'is-playing');
          const eq = document.querySelector('.eq-bars');
          if (eq) eq.classList.add('on');
          setPlayIcons(true);
        })
        .catch((err) => {
          console.warn('Playback restricted or error:', err);
          fallbackAudioPlay();
        });
    }
  } else {
    fallbackAudioPlay();
  }
}

function fallbackAudioPlay() {
  initAudioEngine();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  isPlaying = true;
  document.body.classList.add('has-player', 'is-playing');
  const eq = document.querySelector('.eq-bars');
  if (eq) eq.classList.add('on');
  setPlayIcons(true);

  clearInterval(audioInterval);
  audioInterval = setInterval(() => {
    audioProgress += 1;
    if (audioProgress > 100) {
      if (typeof nextTrack === 'function') nextTrack();
      return;
    }
    playNote(tracksData[currentTrackIdx].freq * ARPEGGIO[arpStep++ % ARPEGGIO.length]);
    renderProgress();
  }, 300);
}

function pauseAudio() {
  if (audioPlayer && !audioPlayer.paused) {
    audioPlayer.pause();
  }
  isPlaying = false;
  clearInterval(audioInterval);
  document.body.classList.remove('is-playing');
  const eq = document.querySelector('.eq-bars');
  if (eq) eq.classList.remove('on');
  setPlayIcons(false);
}

function renderPlaylist() {
  const container = $('playlist-container');
  if (!container) return;
  const rows = tracksData.map((t, i) => ({ t, i })).filter(({ t }) => !activeMood || t.mood === activeMood);
  container.innerHTML = rows
    .map(
      ({ t, i }) => `
      <button type="button" onclick="playTrackByIdx(${i})" ${i === currentTrackIdx ? 'aria-current="true"' : ''}
        class="w-full text-left p-2.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 flex items-center justify-between gap-3 text-xs transition-colors ${i === currentTrackIdx ? 'bg-vintage-accent/10 text-vintage-accent font-bold' : ''}">
        <span class="flex items-center gap-3 min-w-0">
          <span class="w-4 text-center font-mono">${i + 1}</span>
          <span class="min-w-0">
            <span class="block font-medium truncate">${t.title}</span>
            <span class="block text-[10px] text-stone-500 truncate">${t.album}</span>
          </span>
        </span>
        <span class="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-[10px] shrink-0">${t.mood}</span>
      </button>`
    )
    .join('');
}

function selectMood(mood) {
  activeMood = activeMood === mood ? null : mood;
  document.querySelectorAll('.mood-btn').forEach((btn) => {
    const on = btn.dataset.mood === activeMood;
    btn.classList.toggle('bg-vintage-action', on);
    btn.classList.toggle('text-white', on);
    btn.setAttribute('aria-pressed', String(on));
  });
  renderPlaylist();
  if (!activeMood) return;
  const idx = tracksData.findIndex((t) => t.mood === activeMood);
  if (idx > -1) {
    currentTrackIdx = idx;
    audioProgress = 0;
    updatePlayerUI();
    toast(`Menampilkan lagu bernuansa ${activeMood}. Tekan putar untuk mulai.`);
  }
}

/* ---------- Galeri ---------- */
function renderGallery(cat) {
  const grid = $('gallery-grid');
  if (!grid) return;
  const list = cat === 'all' ? galleryData : galleryData.filter((g) => g.category === cat);
  grid.innerHTML = list
    .map(
      (g) => `
      <button type="button" data-img="${esc(g.image)}" data-cap="${esc(g.title)}" class="gallery-item group relative rounded-2xl overflow-hidden aspect-video bg-stone-800 shadow-md text-left">
        <img loading="lazy" decoding="async" src="${g.image}" alt="${esc(g.title)}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
        <span class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 text-white font-serif text-sm font-bold">${esc(g.title)}</span>
      </button>`
    )
    .join('');
}

/* ---------- Dinding kenangan ---------- */
const getMemories = () => store.get('so7_memories', null) || defaultMemories;

function renderMemories() {
  const container = $('memory-board');
  if (!container) return;
  const list = getMemories();
  container.innerHTML = list.length
    ? list
        .map(
          (m, i) => `
      <article class="p-5 rounded-2xl bg-vintage-cream dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col justify-between">
        <p class="text-sm italic text-stone-700 dark:text-stone-300 break-words">"${esc(m.text)}"</p>
        <div class="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 flex justify-between items-center gap-2 text-xs">
          <span class="font-bold text-vintage-accent truncate">${esc(m.name)}</span>
          <span class="font-mono text-stone-500 flex items-center gap-1.5 min-w-0">
            <i data-lucide="music" class="w-3.5 h-3.5 shrink-0"></i><span class="truncate">${esc(m.song)}</span>
            ${m.mine ? `<button type="button" onclick="deleteMemory(${i})" aria-label="Hapus cerita ini" class="ml-1 p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>` : ''}
          </span>
        </div>
      </article>`
        )
        .join('')
    : '<p class="text-sm text-stone-500 sm:col-span-2">Belum ada cerita. Jadilah yang pertama berbagi.</p>';
  refreshIcons();
}

function handleMemorySubmit(e) {
  e.preventDefault();
  const val = (id) => $(id).value.trim();
  const name = val('memory-name');
  const song = val('memory-song');
  const text = val('memory-text');
  if (!name || !song || !text) {
    toast('Lengkapi semua kolom dulu ya.');
    return;
  }
  const list = getMemories().slice();
  list.unshift({ name, song, text, mine: true });
  store.set('so7_memories', list);
  e.target.reset();
  renderMemories();
  toast('Terima kasih, ceritamu sudah masuk ke dinding kenangan.');
}

function deleteMemory(i) {
  const list = getMemories().slice();
  list.splice(i, 1);
  store.set('so7_memories', list);
  renderMemories();
  toast('Cerita dihapus.');
}

/* ---------- Polling: satu suara per orang, bisa diganti ---------- */
const POLL_BASE = pollData.map((p) => p.votes);

function renderPoll() {
  const container = $('poll-options');
  if (!container) return;
  const mine = store.get('so7_vote', null);
  const counts = POLL_BASE.map((v, i) => v + (mine === i ? 1 : 0));
  const total = counts.reduce((a, b) => a + b, 0);
  container.innerHTML =
    pollData
      .map((p, i) => {
        const pct = Math.round((counts[i] / total) * 100);
        const on = mine === i;
        return `
        <button type="button" onclick="votePoll(${i})" aria-pressed="${on}" class="w-full text-left p-2.5 rounded-xl border ${on ? 'border-vintage-accent' : 'border-stone-200 dark:border-stone-700'} hover:border-vintage-accent transition-all relative overflow-hidden">
          <span class="absolute left-0 top-0 bottom-0 bg-vintage-accent/15" style="width:${pct}%"></span>
          <span class="relative flex justify-between items-center font-medium">
            <span class="flex items-center gap-2">${on ? '<i data-lucide="check-circle-2" class="w-4 h-4 text-vintage-accent"></i>' : ''}${p.song}</span>
            <span class="font-mono text-xs text-vintage-accent font-bold">${pct}% (${counts[i]})</span>
          </span>
        </button>`;
      })
      .join('') +
    `<p class="text-xs text-stone-500 pt-1">${
      mine === null
        ? 'Ketuk satu lagu untuk memilih. Kamu bisa mengganti pilihan kapan saja.'
        : 'Terima kasih sudah memilih. Ketuk lagi untuk membatalkan.'
    }</p>`;
  refreshIcons();
}

function votePoll(i) {
  const mine = store.get('so7_vote', null);
  store.set('so7_vote', mine === i ? null : i);
  renderPoll();
  toast(mine === i ? 'Suaramu dibatalkan.' : `Suaramu untuk "${pollData[i].song}" tercatat.`);
}

/* ---------- Arsip konser tersimpan ---------- */
function paintBookmark(btn, on) {
  btn.setAttribute('aria-pressed', String(on));
  btn.innerHTML = `<i data-lucide="bookmark" class="w-4 h-4 ${on ? 'fill-current' : ''}"></i> ${on ? 'Tersimpan' : 'Simpan Arsip Kenangan'}`;
  refreshIcons();
}

function saveConcertReminder(title, btn) {
  const saved = store.get('so7_saved', []);
  const idx = saved.indexOf(title);
  if (idx > -1) saved.splice(idx, 1);
  else saved.push(title);
  store.set('so7_saved', saved);
  if (btn) paintBookmark(btn, idx === -1);
  toast(idx === -1 ? `"${title}" disimpan ke arsipmu.` : `"${title}" dihapus dari arsipmu.`);
}

/* ---------- Pencarian ---------- */
const SEARCH_HINT =
  '<p class="text-sm text-center text-stone-500 py-6">Ketik untuk mencari lagu, album, personel, atau artikel. Pintasan: Ctrl+K.</p>';

function handleGlobalSearch(query) {
  const container = $('search-results');
  if (!container) return;
  const q = query.toLowerCase().trim();
  if (!q) {
    container.innerHTML = SEARCH_HINT;
    return;
  }
  const has = (s) => String(s).toLowerCase().includes(q);
  const row = (icon, label, action) =>
    `<button type="button" onclick="${action}" class="w-full text-left py-2.5 text-sm hover:text-vintage-accent flex items-center gap-2"><i data-lucide="${icon}" class="w-4 h-4 text-vintage-accent shrink-0"></i><span>${label}</span></button>`;
  const group = (title, rows) =>
    rows.length ? `<div class="py-2"><div class="text-xs font-bold uppercase text-stone-500 mb-1">${title}</div>${rows.join('')}</div>` : '';
  const close = 'toggleSearchModal(false);';

  const html =
    group(
      'Lagu',
      tracksData
        .map((t, i) => ({ t, i }))
        .filter(({ t }) => has(t.title) || has(t.album))
        .map(({ t, i }) =>
          row('music', `${esc(t.title)} (${esc(t.album)})`, `${close}playTrackByIdx(${i});document.getElementById('player-section').scrollIntoView({behavior:'smooth'})`)
        )
    ) +
    group('Album', albumsData.filter((a) => has(a.title)).map((a) => row('disc', `${esc(a.title)} (${a.year})`, `${close}openAlbumModal('${a.id}')`))) +
    group('Anggota', membersData.filter((m) => has(m.name) || has(m.role)).map((m) => row('user', `${esc(m.name)} - ${esc(m.role)}`, `${close}openMemberModal('${m.id}')`))) +
    group('Artikel', articlesData.filter((a) => has(a.title)).map((a) => row('file-text', esc(a.title), `${close}openArticleModal('${a.id}')`)));

  container.innerHTML =
    html ||
    `<p class="text-sm text-center text-stone-500 py-6">Tidak ada hasil untuk "${esc(query)}". Coba judul lagu atau nama personel.</p>`;
  refreshIcons();
}

/* ---------- Kutipan harian ---------- */
const QUOTES = [
  'Musik Sheila On 7 bukan sekadar nada, melainkan mesin waktu yang membawa kita kembali ke masa-masa paling tulus dalam hidup.',
  'Lagu yang baik tidak menggurui; ia menemani kita pulang dan membuat jalan terasa lebih pendek.',
  'Ada lagu yang kita dengar karena suka, dan ada lagu yang kita dengar karena ingat.',
  'Sederhana itu bukan kekurangan. Di tangan yang tepat, ia menjadi ciri khas.',
  'Setiap generasi punya soundtrack-nya sendiri, dan beberapa lagu cukup kuat untuk dipinjamkan ke generasi berikutnya.'
];

/* ---------- Fallback gambar ---------- */
const IMG_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#5C4033'/><stop offset='1' stop-color='#1A1A1A'/></linearGradient></defs><rect width='200' height='200' fill='url(#g)'/><text x='100' y='118' font-size='64' text-anchor='middle' fill='#D96B27' font-family='sans-serif'>SO7</text></svg>"
  );

document.addEventListener(
  'error',
  (e) => {
    const img = e.target;
    if (img && img.tagName === 'IMG' && !img.dataset.fallback) {
      img.dataset.fallback = '1';
      img.src = IMG_FALLBACK;
    }
  },
  true
);

/* ---------- Inisialisasi ---------- */
document.addEventListener('DOMContentLoaded', () => {
  setupModals();

  const quote = $('daily-quote');
  if (quote) {
    const day = Math.floor(Date.now() / 86400000);
    quote.textContent = `"${QUOTES[day % QUOTES.length]}"`;
  }

  const saved = store.get('so7_saved', []);
  document.querySelectorAll('button[onclick^="saveConcertReminder"]').forEach((btn) => {
    const match = btn.getAttribute('onclick').match(/'([^']+)'/);
    if (match && saved.includes(match[1])) paintBookmark(btn, true);
  });

  // Progres scroll dan tombol kembali ke atas
  const progress = document.createElement('div');
  progress.className = 'fixed top-0 left-0 h-0.5 bg-vintage-accent z-[60]';
  progress.style.width = '0';
  document.body.appendChild(progress);

  const toTop = document.createElement('button');
  toTop.id = 'to-top';
  toTop.type = 'button';
  toTop.setAttribute('aria-label', 'Kembali ke atas');
  toTop.className =
    'fixed right-4 bottom-5 z-30 p-3 rounded-full bg-vintage-action text-white shadow-lg transition-opacity duration-300 opacity-0 pointer-events-none';
  toTop.innerHTML = '<i data-lucide="arrow-up" class="w-5 h-5"></i>';
  toTop.addEventListener('click', scrollToTop);
  document.body.appendChild(toTop);
  refreshIcons();

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
        const show = window.scrollY > 800;
        toTop.classList.toggle('opacity-0', !show);
        toTop.classList.toggle('pointer-events-none', !show);
        ticking = false;
      });
    },
    { passive: true }
  );

  // Penanda bagian aktif pada navigasi
  const links = [...document.querySelectorAll('.nav-link')];
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          const on = a.getAttribute('href') === `#${entry.target.id}`;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  document.querySelectorAll('section[id]').forEach((s) => spy.observe(s));

});
