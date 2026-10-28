// File: js/app.js

let currentTrackIdx = 0;
let isPlaying = false;
let audioCtx = null;
let audioInterval = null;
let audioProgress = 0;

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  renderMembers();
  renderAlbums(albumsData);
  renderPlaylist();
  renderGallery('all');
  renderPoll();
  renderMemories();
  renderArticles();

  if (localStorage.theme === 'dark') {
    document.documentElement.classList.add('dark');
    const darkIcon = document.getElementById('theme-icon-dark');
    const lightIcon = document.getElementById('theme-icon-light');
    if (darkIcon) darkIcon.classList.remove('hidden');
    if (lightIcon) lightIcon.classList.add('hidden');
  }

  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.theme = isDark ? 'dark' : 'light';
      const darkIcon = document.getElementById('theme-icon-dark');
      const lightIcon = document.getElementById('theme-icon-light');
      if (darkIcon) darkIcon.classList.toggle('hidden', !isDark);
      if (lightIcon) lightIcon.classList.toggle('hidden', isDark);
    });
  }

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (typeof toggleMobileMenu === 'function') {
        toggleMobileMenu();
      }
    });
  }

  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.classList.add('opacity-0');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 700);
    }
  }, 500);
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderMembers() {
  const activeGrid = document.getElementById('active-members-grid');
  const formerGrid = document.getElementById('former-members-grid');

  if (activeGrid) {
    activeGrid.innerHTML = membersData
      .filter((m) => m.status === 'active')
      .map(
        (m) => `
        <div onclick="openMemberModal('${m.id}')" role="button" tabindex="0" aria-label="Lihat profil ${m.name}" class="group cursor-pointer p-5 rounded-2xl bg-vintage-paper dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-vintage-accent transition-all shadow-sm hover:shadow-xl">
          <div class="aspect-square rounded-xl overflow-hidden mb-4 relative">
            <img loading="lazy" decoding="async" src="${m.image}" alt="${m.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span class="text-xs text-white font-medium flex items-center gap-1">Klik untuk detail bio <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
            </div>
          </div>
          <span class="text-xs font-mono font-bold text-vintage-accent uppercase">${m.role}</span>
          <h4 class="font-serif text-xl font-bold mt-1 text-vintage-charcoal dark:text-white">${m.name}</h4>
          <p class="text-xs text-stone-500 dark:text-stone-400 mt-2 line-clamp-2">${m.bio}</p>
        </div>
      `
      )
      .join('');
  }

  if (formerGrid) {
    formerGrid.innerHTML = membersData
      .filter((m) => m.status === 'former')
      .map(
        (m) => `
        <div onclick="openMemberModal('${m.id}')" role="button" tabindex="0" aria-label="Lihat profil ${m.name}" class="group cursor-pointer p-5 rounded-2xl bg-vintage-paper dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-vintage-accent transition-all shadow-sm">
          <div class="flex gap-4 items-center">
            <img loading="lazy" decoding="async" src="${m.image}" alt="${m.name}" class="w-20 h-20 rounded-xl object-cover">
            <div>
              <span class="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">${m.role}</span>
              <h4 class="font-serif text-lg font-bold text-vintage-charcoal dark:text-white">${m.name}</h4>
              <p class="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">${m.bio}</p>
            </div>
          </div>
        </div>
      `
      )
      .join('');
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function openMemberModal(id) {
  const m = membersData.find((item) => item.id === id);
  if (!m) return;

  const content = document.getElementById('member-modal-content');
  if (content) {
    content.innerHTML = `
      <div class="text-center">
        <img loading="lazy" decoding="async" src="${m.image}" class="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-vintage-accent">
        <span class="text-xs font-mono uppercase text-vintage-accent font-bold">${m.role}</span>
        <h3 class="font-serif text-2xl font-bold mt-1">${m.name}</h3>
      </div>
      <div class="mt-6 space-y-4 text-sm text-stone-600 dark:text-stone-300">
        <div>
          <strong class="block text-xs uppercase font-mono text-stone-400">Biografi & Perjalanan:</strong>
          <p class="mt-1">${m.bio}</p>
        </div>
        <div>
          <strong class="block text-xs uppercase font-mono text-stone-400">Kontribusi Penting:</strong>
          <p class="mt-1">${m.contributions}</p>
        </div>
      </div>
    `;
  }

  const modal = document.getElementById('member-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeMemberModal() {
  const modal = document.getElementById('member-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function playAlbumTrack(albumId) {
  const album = albumsData.find((a) => a.id === albumId);
  if (!album) return;

  let trackIdx = tracksData.findIndex(
    (t) =>
      album.tracks.some((tr) => tr.toLowerCase() === t.title.toLowerCase()) ||
      t.album.toLowerCase().includes(album.title.toLowerCase())
  );

  if (trackIdx === -1) {
    trackIdx = 0;
  }

  playTrackByIdx(trackIdx);
  const playerSection = document.getElementById('player-section');
  if (playerSection) {
    playerSection.scrollIntoView({ behavior: 'smooth' });
  }
  if (typeof toast === 'function') {
    toast(`Memutar "${tracksData[trackIdx].title}" dari album ${album.title}`);
  }
}

function playTrackByName(trackTitle, albumId) {
  const cleanTitle = String(trackTitle).trim().toLowerCase();
  const trackIdx = tracksData.findIndex((t) => t.title.toLowerCase() === cleanTitle);

  if (trackIdx !== -1) {
    playTrackByIdx(trackIdx);
    closeAlbumModal();
    const playerSection = document.getElementById('player-section');
    if (playerSection) {
      playerSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (typeof toast === 'function') {
      toast(`Memutar "${tracksData[trackIdx].title}"`);
    }
    return;
  }

  playAlbumTrack(albumId);
  closeAlbumModal();
}

function renderAlbums(data) {
  const grid = document.getElementById('album-grid');
  if (!grid) return;

  grid.innerHTML = data
    .map((album) => {
      const albumTrack = tracksData.find(
        (t) =>
          album.tracks.some((tr) => tr.toLowerCase() === t.title.toLowerCase()) ||
          t.album.toLowerCase().includes(album.title.toLowerCase())
      );

      return `
      <div class="group p-5 rounded-2xl bg-vintage-cream dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-vintage-accent transition-all shadow-sm flex flex-col justify-between">
        <div>
          <div onclick="playAlbumTrack('${album.id}')" role="button" tabindex="0" aria-label="Putar lagu dari album ${album.title}" class="aspect-square rounded-xl overflow-hidden mb-4 shadow-md relative cursor-pointer group/cover">
            <img loading="lazy" decoding="async" src="${album.cover}" alt="${album.title}" class="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity">
              <span class="w-12 h-12 rounded-full bg-vintage-action text-white flex items-center justify-center shadow-lg transform scale-90 group-hover/cover:scale-100 transition-transform">
                <i data-lucide="play" class="w-5 h-5 fill-current ml-0.5"></i>
              </span>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold text-vintage-accent">${album.year}</span>
            ${albumTrack ? `<span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vintage-accent/10 text-vintage-accent font-semibold">${albumTrack.title}</span>` : ''}
          </div>
          <h4 class="font-serif text-xl font-bold mt-1">${album.title}</h4>
          <p class="text-xs text-stone-500 dark:text-stone-400 mt-2 line-clamp-2">${album.description}</p>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-2">
          <button onclick="playAlbumTrack('${album.id}')" class="py-2.5 rounded-xl bg-vintage-action text-white hover:opacity-90 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm">
            <i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i> Putar Lagu
          </button>
          <button onclick="openAlbumModal('${album.id}')" class="py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 text-xs font-semibold transition-all">
            Daftar Lagu
          </button>
        </div>
      </div>
    `;
    })
    .join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function filterAlbums(decade) {
  document.querySelectorAll('.album-filter-btn').forEach((btn) => {
    if (btn.dataset.filter === decade) {
      btn.classList.add('bg-vintage-action', 'text-white');
      btn.classList.remove('bg-stone-200', 'dark:bg-stone-800');
    } else {
      btn.classList.remove('bg-vintage-action', 'text-white');
      btn.classList.add('bg-stone-200', 'dark:bg-stone-800');
    }
  });

  if (decade === 'all') {
    renderAlbums(albumsData);
  } else {
    renderAlbums(albumsData.filter((a) => a.decade === decade));
  }
}

function openAlbumModal(id) {
  const album = albumsData.find((a) => a.id === id);
  if (!album) return;

  const content = document.getElementById('album-modal-content');
  if (content) {
    content.innerHTML = `
      <div class="flex gap-4 items-center mb-6">
        <div onclick="playAlbumTrack('${album.id}')" role="button" tabindex="0" aria-label="Putar lagu dari album ini" class="relative w-20 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0 cursor-pointer group">
          <img loading="lazy" decoding="async" src="${album.cover}" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <i data-lucide="play" class="w-6 h-6 text-white fill-current"></i>
          </div>
        </div>
        <div class="min-w-0">
          <span class="text-xs font-mono text-vintage-accent font-bold">${album.year}</span>
          <h3 class="font-serif text-2xl font-bold truncate">${album.title}</h3>
          <p class="text-xs text-stone-500 line-clamp-2 mt-1">${album.description}</p>
        </div>
      </div>
      <div class="text-xs font-bold uppercase text-stone-400 mb-2">Daftar Track (Klik untuk memutar):</div>
      <div class="space-y-1.5 max-h-56 overflow-y-auto pr-1">
        ${album.tracks
          .map((t, idx) => {
            const isAvailable = tracksData.some((tr) => tr.title.toLowerCase() === t.toLowerCase());
            return `
            <button type="button" onclick="playTrackByName('${t.replace(/'/g, "\\'")}', '${album.id}')" 
              class="w-full text-left p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-vintage-accent hover:bg-vintage-accent/5 dark:hover:bg-vintage-accent/10 flex items-center justify-between gap-3 text-xs transition-all group">
              <span class="flex items-center gap-2.5 min-w-0">
                <span class="w-5 text-center font-mono text-stone-400 group-hover:text-vintage-accent">${idx + 1}</span>
                <span class="font-medium truncate group-hover:text-vintage-accent transition-colors">${t}</span>
              </span>
              <span class="flex items-center gap-1.5 shrink-0">
                ${isAvailable ? '<span class="px-2 py-0.5 rounded-full bg-vintage-accent/10 text-vintage-accent font-mono text-[10px] font-bold">Di Pemutar</span>' : ''}
                <i data-lucide="play" class="w-4 h-4 text-stone-400 group-hover:text-vintage-accent fill-current transition-colors"></i>
              </span>
            </button>`;
          })
          .join('')}
      </div>
      <div class="mt-6 flex gap-3">
        <button onclick="playAlbumTrack('${album.id}')" class="flex-1 py-2.5 rounded-xl bg-vintage-action text-white text-xs font-bold text-center hover:opacity-90 flex items-center justify-center gap-1.5 shadow-sm transition-all">
          <i data-lucide="play" class="w-4 h-4 fill-current"></i> Putar Lagu Album
        </button>
        <a href="https://open.spotify.com" target="_blank" rel="noopener" class="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-xs font-bold text-center hover:bg-green-700 flex items-center justify-center gap-1.5 transition-all">
          <i data-lucide="external-link" class="w-4 h-4"></i> Dengarkan di Spotify
        </a>
      </div>
    `;
  }

  const modal = document.getElementById('album-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function closeAlbumModal() {
  const modal = document.getElementById('album-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function updatePlayerUI() {
  const track = tracksData[currentTrackIdx];
  if (!track) return;

  const playerTitle = document.getElementById('player-title');
  const playerAlbum = document.getElementById('player-album-tag');
  const playerCover = document.getElementById('player-cover');
  const playerArtist = document.getElementById('player-artist');
  const miniTitle = document.getElementById('mini-title');
  const miniCover = document.getElementById('mini-cover');

  if (playerTitle) playerTitle.innerText = track.title;
  if (playerAlbum) playerAlbum.innerText = track.album;
  if (playerCover) playerCover.src = track.cover;
  if (playerArtist) playerArtist.innerText = 'Sheila On 7 • Audio Resmi';
  if (miniTitle) miniTitle.innerText = track.title;
  if (miniCover) miniCover.src = track.cover;

  renderPlaylist();
  renderProgress();
}

function initAudioEngine() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function toggleAudioPlay() {
  initAudioEngine();
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

function playTrackByIdx(idx) {
  audioProgress = 0;
  currentTrackIdx = idx;
  const track = tracksData[currentTrackIdx];
  if (track && track.src && typeof audioPlayer !== 'undefined' && audioPlayer) {
    audioPlayer.src = track.src;
    audioPlayer.currentTime = 0;
  }
  updatePlayerUI();
  playAudio();
}

function nextTrack() {
  currentTrackIdx = (currentTrackIdx + 1) % tracksData.length;
  playTrackByIdx(currentTrackIdx);
}

function prevTrack() {
  currentTrackIdx = (currentTrackIdx - 1 + tracksData.length) % tracksData.length;
  playTrackByIdx(currentTrackIdx);
}

function playRandomSong() {
  const randIdx = Math.floor(Math.random() * tracksData.length);
  playTrackByIdx(randIdx);
  const playerSection = document.getElementById('player-section');
  if (playerSection) {
    playerSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function filterGallery(cat) {
  document.querySelectorAll('.gallery-filter-btn').forEach((btn) => {
    if (btn.dataset.cat === cat) {
      btn.classList.add('bg-vintage-action', 'text-white');
      btn.classList.remove('bg-stone-200', 'dark:bg-stone-800');
    } else {
      btn.classList.remove('bg-vintage-action', 'text-white');
      btn.classList.add('bg-stone-200', 'dark:bg-stone-800');
    }
  });
  renderGallery(cat);
}

function openLightbox(img, caption) {
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxModal = document.getElementById('lightbox-modal');

  if (lightboxImg) lightboxImg.src = img;
  if (lightboxCaption) lightboxCaption.innerText = caption;
  if (lightboxModal) lightboxModal.classList.remove('hidden');
}

function closeLightbox() {
  const lightboxModal = document.getElementById('lightbox-modal');
  if (lightboxModal) {
    lightboxModal.classList.add('hidden');
  }
}

function renderArticles() {
  const grid = document.getElementById('article-grid');
  if (!grid) return;

  grid.innerHTML = articlesData
    .map(
      (a) => `
      <div class="p-6 rounded-2xl bg-vintage-paper dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col justify-between">
        <div>
          <span class="text-xs font-mono text-vintage-accent">${a.date}</span>
          <h4 class="font-serif text-xl font-bold mt-1 line-clamp-2">${a.title}</h4>
          <p class="text-xs text-stone-500 dark:text-stone-400 mt-3 line-clamp-3">${a.summary}</p>
        </div>
        <button onclick="openArticleModal('${a.id}')" class="mt-6 text-xs font-bold text-vintage-accent hover:underline flex items-center gap-1">
          Baca Selengkapnya <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `
    )
    .join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function openArticleModal(id) {
  const art = articlesData.find((a) => a.id === id);
  if (!art) return;

  const content = document.getElementById('article-modal-content');
  if (content) {
    content.innerHTML = `
      <span class="text-xs font-mono text-vintage-accent font-bold">${art.date}</span>
      <h3 class="font-serif text-2xl font-bold mt-1 mb-4">${art.title}</h3>
      <p class="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">${art.content}</p>
    `;
  }

  const modal = document.getElementById('article-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeArticleModal() {
  const modal = document.getElementById('article-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function toggleSearchModal(show) {
  const modal = document.getElementById('search-modal');
  if (!modal) return;

  if (show) {
    modal.classList.remove('hidden');
    const input = document.getElementById('search-input');
    if (input) input.focus();
  } else {
    modal.classList.add('hidden');
  }
}

