// API Base URL
const API_BASE = 'api/';

// App State
const state = {
    languages: [],
    sets: [],
    communitySets: [],
    currentSet: null,
    currentSetId: null,
    currentVocabularies: [],
    mainLanguage: 'Deutsch',
    currentUser: null,
    speedTimerId: null,
    speedRemaining: 0,
    speedLocked: false,
    currentListeningVocab: null,
    learningSession: {
        mode: null,
        vocabularies: [],
        currentIndex: 0,
        results: []
    }
};

// =========================
// Utility Functions
// =========================

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const variant = type === 'success' ? 'alert-success' : type === 'error' ? 'alert-error' : 'alert-info';
    toast.className = `alert ${variant} shadow-lg`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
}

async function fetchAPI(endpoint, options = {}) {
    try {
        const { silent, skipAuth, ...fetchOptions } = options;
        const response = await fetch(API_BASE + endpoint, {
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...fetchOptions
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 401 && !skipAuth) {
                setAuthState(null);
            }
            throw new Error(data.error || 'API-Fehler');
        }
        
        return data;
    } catch (error) {
        if (!options.silent) {
            showToast(error.message, 'error');
        }
        throw error;
    }
}

function showModal(title, message) {
    const modal = document.getElementById('message-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    if (!modal || !modalTitle || !modalMessage) {
        showToast(message, 'info');
        return;
    }
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.showModal();
}

async function handleLogout() {
    try {
        await fetchAPI('auth.php', { method: 'DELETE', silent: true });
        setAuthState(null);
        showModal('Abgemeldet', 'Du wurdest erfolgreich abgemeldet.');
    } catch (error) {
        showModal('Abmelden fehlgeschlagen', error.message || 'Bitte versuche es erneut.');
    }
}

function setAuthState(user) {
    state.currentUser = user;
    const authView = document.getElementById('auth-view');
    const appShell = document.getElementById('app-shell');

    if (user) {
        authView.style.display = 'none';
        appShell.style.display = 'block';
        document.getElementById('user-name').textContent = user.name;
        const mobileName = document.getElementById('user-name-mobile');
        if (mobileName) {
            mobileName.textContent = user.name;
        }
    } else {
        authView.style.display = 'block';
        appShell.style.display = 'none';
        
        // Check if running as PWA
        const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                      window.navigator.standalone === true;
        
        const landingPage = document.getElementById('landing-page');
        const pwaAuth = document.getElementById('pwa-auth');
        
        if (isPWA) {
            // PWA: Show only login box
            landingPage.classList.add('hidden');
            pwaAuth.classList.remove('hidden');
        } else {
            // Browser: Show full landing page
            landingPage.classList.remove('hidden');
            pwaAuth.classList.add('hidden');
            loadCommunityPreview();
        }
    }
}

async function loadCommunityPreview() {
    try {
        const data = await fetchAPI('share.php?list=1', { skipAuth: true });
        const previewContainer = document.getElementById('community-preview');
        
        if (!data.sets || data.sets.length === 0) {
            previewContainer.innerHTML = '<p class="col-span-full text-center text-base-content/60">Keine Community Sets verfügbar</p>';
            return;
        }
        
        // Show first 6 sets
        const sets = data.sets.slice(0, 6);
        previewContainer.innerHTML = sets.map(set => `
            <div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
                <div class="card-body">
                    <h3 class="card-title text-lg">
                        <i class="fa-solid fa-book-open text-primary"></i>
                        ${escapeHtml(set.name)}
                    </h3>
                    <div class="flex items-center gap-2 text-sm text-base-content/60">
                        <i class="fa-solid fa-language"></i>
                        <span>${escapeHtml(set.language_name)}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-base-content/60">
                        <i class="fa-solid fa-list"></i>
                        <span>${set.vocab_count} Vokabeln</span>
                    </div>
                    <div class="card-actions justify-end mt-2">
                        <a href="?share=${set.share_token}" class="btn btn-sm btn-primary">
                            <i class="fa-solid fa-eye mr-1"></i>
                            Anschauen
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load community preview:', error);
        document.getElementById('community-preview').innerHTML = 
            '<p class="col-span-full text-center text-base-content/60">Fehler beim Laden der Community Sets</p>';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function loadCurrentUser() {
    const data = await fetchAPI('auth.php');
    setAuthState(data.user);
    return data.user;
}

// =========================
// Data Loading Functions
// =========================

async function loadLanguages() {
    const data = await fetchAPI('languages.php');
    state.languages = data.languages;
    updateLanguageSelects();
}

function updateLanguageSelects() {
    const mainLangSelect = document.getElementById('main-language');
    const setLangSelect = document.getElementById('set-language');
    
    [mainLangSelect, setLangSelect].forEach(select => {
        select.innerHTML = state.languages
            .map(lang => `<option value="${lang.id}">${lang.name}</option>`)
            .join('');
    });
    
    // Set current main language
    const currentLang = state.languages.find(l => l.name === state.mainLanguage);
    if (currentLang) {
        mainLangSelect.value = currentLang.id;
    }
}

function getLanguageCodeById(id) {
    const language = state.languages.find(l => l.id == id);
    if (!language) return null;
    
    // Map to full locale codes for better TTS
    const localeMap = {
        'en': 'en-US',
        'de': 'de-DE',
        'fr': 'fr-FR',
        'es': 'es-ES',
        'it': 'it-IT',
        'pt': 'pt-PT',
        'nl': 'nl-NL',
        'pl': 'pl-PL',
        'ru': 'ru-RU',
        'ja': 'ja-JP',
        'zh': 'zh-CN',
        'ar': 'ar-SA',
        'tr': 'tr-TR',
        'ko': 'ko-KR'
    };
    
    return localeMap[language.code] || language.code;
}

function speakText(text, langCode = null) {
    if (!('speechSynthesis' in window)) {
        showToast('Audio wird von deinem Browser nicht unterstützt', 'error');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (langCode) {
        utterance.lang = langCode;
        
        // Try to find a voice that matches the language
        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(voice => 
            voice.lang.startsWith(langCode.substring(0, 2))
        );
        
        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }
    }
    
    // Better speech parameters
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

async function loadSettings() {
    const data = await fetchAPI('settings.php');
    state.mainLanguage = data.settings.main_language;
}

async function loadSets() {
    const data = await fetchAPI('sets.php');
    state.sets = data.sets;
    renderSets();
}

async function loadCommunitySets() {
    const data = await fetchAPI('share.php?list=1');
    state.communitySets = data.sets || [];
    renderCommunitySets();
}

let currentShareSetId = null;

async function shareSet(setId) {
    try {
        currentShareSetId = setId;
        const data = await fetchAPI('share.php', {
            method: 'POST',
            body: JSON.stringify({ action: 'create', set_id: setId }),
            silent: true
        });

        const modal = document.getElementById('share-modal');
        const input = document.getElementById('share-link');
        const checkbox = document.getElementById('share-community');
        
        if (input) {
            input.value = data.share_url;
        }
        if (checkbox) {
            checkbox.checked = data.is_community || false;
        }
        if (modal) {
            modal.showModal();
        } else {
            showModal('Freigabe-Link', data.share_url);
        }
    } catch (error) {
        showModal('Teilen fehlgeschlagen', error.message || 'Bitte versuche es erneut.');
    }
}

async function cloneSharedSet(token) {
    try {
        await fetchAPI('share.php', {
            method: 'POST',
            body: JSON.stringify({ action: 'import', token }),
            silent: true
        });
        await loadSets();
        showModal('Klon erstellt', 'Das Set wurde zu deinen Sets hinzugefügt.');
    } catch (error) {
        showModal('Klonen fehlgeschlagen', error.message || 'Bitte versuche es erneut.');
    }
}

window.cloneSharedSet = cloneSharedSet;

const copyShareBtn = document.getElementById('copy-share-link');
if (copyShareBtn) {
    copyShareBtn.addEventListener('click', async () => {
        const input = document.getElementById('share-link');
        if (input) {
            await navigator.clipboard.writeText(input.value);
            showToast('Link kopiert', 'success');
        }
    });
}

const toggleCommunityBtn = document.getElementById('toggle-community');
if (toggleCommunityBtn) {
    toggleCommunityBtn.addEventListener('click', async () => {
        const checkbox = document.getElementById('share-community');
        const modal = document.getElementById('share-modal');
        if (!currentShareSetId || !checkbox) return;
        
        try {
            await fetchAPI('share.php', {
                method: 'POST',
                body: JSON.stringify({ 
                    action: 'toggle_community', 
                    set_id: currentShareSetId,
                    is_community: checkbox.checked 
                }),
                silent: true
            });
            showToast(checkbox.checked ? 'In Community veröffentlicht' : 'Aus Community entfernt', 'success');
            await loadSets();
            if (modal) {
                modal.close();
            }
        } catch (error) {
            showModal('Fehler', error.message || 'Bitte versuche es erneut.');
        }
    });
}

async function loadVocabularies(setId) {
    const data = await fetchAPI(`vocabularies.php?set_id=${setId}`);
    return data.vocabularies;
}

function renderSets() {
    const container = document.getElementById('sets-list');
    
    if (state.sets.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon"><i class="fa-solid fa-book"></i></div>
                <h3>Keine Sets vorhanden</h3>
                <p>Erstelle dein erstes Voci-Set!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = state.sets.map(set => `
        <div class="set-item" data-id="${set.id}">
            <div class="set-item-header">
                <div>
                    <div class="set-name">${set.name}</div>
                    <div class="set-language">${set.language_name}</div>
                </div>
                <button class="set-favorite ${set.is_favorite ? 'active' : ''}" 
                        data-id="${set.id}" 
                        onclick="toggleFavorite(${set.id}, ${!set.is_favorite}); event.stopPropagation();">
                    <i class="fa-solid fa-star"></i>
                </button>
            </div>
            <div class="set-stats">
                <span><i class="fa-solid fa-pen"></i> ${set.word_count} Vokabeln</span>
                <span><i class="fa-solid fa-clock"></i> ${new Date(set.updated_at).toLocaleDateString('de-DE')}</span>
            </div>
            <div class="set-actions">
                <button class="btn btn-primary" onclick="startLearning(${set.id}); event.stopPropagation();">
                    Lernen
                </button>
                ${set.is_owner ? `
                <button class="btn btn-secondary" onclick="editSet(${set.id}); event.stopPropagation();">
                    Bearbeiten
                </button>
                <button class="btn btn-outline btn-secondary" onclick="shareSet(${set.id}); event.stopPropagation();">
                    <i class="fa-solid fa-share-nodes"></i> Teilen
                </button>
                ` : `
                <button class="btn btn-secondary" disabled>Nur Lesen</button>
                `}
            </div>
        </div>
    `).join('');
}

function renderCommunitySets() {
    const container = document.getElementById('community-list');
    if (!container) {
        return;
    }

    if (state.communitySets.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon"><i class="fa-solid fa-users"></i></div>
                <h3>Keine Community Sets</h3>
                <p>Teile ein Set oder komme später wieder vorbei.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = state.communitySets.map(set => `
        <div class="set-item" data-id="${set.id}">
            <div class="set-item-header">
                <div>
                    <div class="set-name">${set.name}</div>
                    <div class="set-language">${set.language_name}</div>
                    <div class="text-sm text-base-content/60">von ${set.owner_name}</div>
                </div>
            </div>
            <div class="set-stats">
                <span><i class="fa-solid fa-pen"></i> ${set.word_count} Vokabeln</span>
                <span><i class="fa-solid fa-clock"></i> ${new Date(set.updated_at).toLocaleDateString('de-DE')}</span>
            </div>
            <div class="set-actions">
                <button class="btn btn-primary" onclick="cloneSharedSet('${set.share_token}')">Klonen & üben</button>
            </div>
        </div>
    `).join('');
}

// =========================
// Navigation
// =========================

document.addEventListener('click', (event) => {
    const tab = event.target.closest('.auth-tab');
    if (!tab) {
        return;
    }

    document.querySelectorAll('.auth-tab').forEach(t => {
        t.classList.remove('active');
        t.classList.remove('tab-active');
    });
    tab.classList.add('active');
    tab.classList.add('tab-active');

    const target = tab.dataset.authTab;
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginFormPwa = document.getElementById('login-form-pwa');
    const registerFormPwa = document.getElementById('register-form-pwa');
    
    if (loginForm && registerForm) {
        loginForm.style.display = target === 'login' ? 'block' : 'none';
        registerForm.style.display = target === 'register' ? 'block' : 'none';
    }
    if (loginFormPwa && registerFormPwa) {
        loginFormPwa.style.display = target === 'login' ? 'block' : 'none';
        registerFormPwa.style.display = target === 'register' ? 'block' : 'none';
    }
});

document.addEventListener('submit', async (event) => {
    const form = event.target;

    if (form.id === 'login-form' || form.id === 'login-form-pwa') {
        event.preventDefault();

        const emailField = form.querySelector('input[type="email"]');
        const passwordField = form.querySelector('input[type="password"]');
        const email = emailField.value.trim();
        const password = passwordField.value;

        try {
            const data = await fetchAPI('auth.php', {
                method: 'POST',
                body: JSON.stringify({ mode: 'login', email, password }),
                silent: true
            });

            setAuthState(data.user);
            await loadAppData();
            showModal('Willkommen zurück!', 'Du bist jetzt angemeldet. Viel Erfolg beim Lernen!');
        } catch (error) {
            showModal('Anmeldung fehlgeschlagen', error.message || 'Bitte überprüfe deine Daten.');
        }
    }

    if (form.id === 'register-form' || form.id === 'register-form-pwa') {
        event.preventDefault();

        const nameField = form.querySelector('input[id*="register-name"]');
        const emailField = form.querySelector('input[type="email"]');
        const passwordField = form.querySelector('input[type="password"]');
        const name = nameField.value.trim();
        const email = emailField.value.trim();
        const password = passwordField.value;

        try {
            await fetchAPI('auth.php', {
                method: 'POST',
                body: JSON.stringify({ mode: 'register', name, email, password }),
                silent: true
            });

            form.reset();
            const loginTab = document.querySelector('[data-auth-tab="login"]');
            if (loginTab) {
                loginTab.click();
            }
            showModal('Registrierung erfolgreich', 'Bitte bestätige die E-Mail, die wir dir geschickt haben.');
        } catch (error) {
            showModal('Registrierung fehlgeschlagen', error.message || 'Bitte versuche es erneut.');
        }
    }
});

document.addEventListener('click', async (event) => {
    const logoutBtn = event.target.closest('[data-action="logout"]');
    if (logoutBtn) {
        event.preventDefault();
        await handleLogout();
        return;
    }

    const navBtn = event.target.closest('.nav-btn');
    if (navBtn) {
        document.querySelectorAll('.nav-btn').forEach(b => {
            b.classList.remove('active');
            b.classList.remove('tab-active');
        });
        navBtn.classList.add('active');
        navBtn.classList.add('tab-active');

        const view = navBtn.dataset.view;
        if (view === 'home') {
            showView('home-view');
            loadSets();
        } else if (view === 'community') {
            showView('community-view');
            loadCommunitySets();
        } else if (view === 'settings') {
            showView('settings-view');
        }
    }
});

const refreshCommunityBtn = document.getElementById('refresh-community-btn');
if (refreshCommunityBtn) {
    refreshCommunityBtn.addEventListener('click', () => loadCommunitySets());
}

document.addEventListener('pointerup', async (event) => {
    const logoutBtn = event.target.closest('[data-action="logout"]');
    if (!logoutBtn) {
        return;
    }
    event.preventDefault();
    await handleLogout();
});

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (event) => {
        event.preventDefault();
        handleLogout();
    });
}

const logoutBtnMobile = document.getElementById('logout-btn-mobile');
if (logoutBtnMobile) {
    logoutBtnMobile.addEventListener('click', (event) => {
        event.preventDefault();
        handleLogout();
    });
}

// Back buttons
document.getElementById('back-to-home').addEventListener('click', () => {
    showView('home-view');
    loadSets();
});

document.getElementById('back-from-mode').addEventListener('click', () => {
    showView('home-view');
    loadSets();
});

document.getElementById('back-to-home-from-results').addEventListener('click', () => {
    showView('home-view');
    loadSets();
});

// =========================
// Settings
// =========================

document.getElementById('save-settings-btn').addEventListener('click', async () => {
    const mainLanguageId = document.getElementById('main-language').value;
    const language = state.languages.find(l => l.id == mainLanguageId);
    
    await fetchAPI('settings.php', {
        method: 'PUT',
        body: JSON.stringify({ main_language: language.name })
    });
    
    state.mainLanguage = language.name;
    showToast(t('setUpdated'), 'success');
});

// App Language Selector
document.getElementById('app-language').addEventListener('change', (e) => {
    setLanguage(e.target.value);
    showToast(t('appReady'), 'success');
});

// Initialize app language selector
function initLanguageSelector() {
    const appLangSelect = document.getElementById('app-language');
    if (appLangSelect) {
        appLangSelect.value = getCurrentLanguage();
    }
}

// =========================
// Set Management
// =========================

async function toggleFavorite(setId, isFavorite) {
    await fetchAPI('sets.php', {
        method: 'PUT',
        body: JSON.stringify({ id: setId, is_favorite: isFavorite })
    });
    
    await loadSets();
}

document.getElementById('create-set-btn').addEventListener('click', () => {
    state.currentSetId = null;
    state.currentSet = null;
    state.currentVocabularies = [];
    
    document.getElementById('edit-set-title').textContent = 'Neues Set erstellen';
    document.getElementById('set-name').value = '';
    document.getElementById('delete-set-btn').style.display = 'none';
    document.getElementById('vocabularies-container').innerHTML = '';
    
    // Add initial vocabulary row
    addVocabularyRow();
    
    showView('edit-set-view');
});

async function editSet(setId) {
    state.currentSetId = setId;
    state.currentSet = state.sets.find(s => s.id === setId);
    state.currentVocabularies = await loadVocabularies(setId);
    
    document.getElementById('edit-set-title').textContent = 'Set bearbeiten';
    document.getElementById('set-name').value = state.currentSet.name;
    document.getElementById('set-language').value = state.currentSet.language_id;
    document.getElementById('delete-set-btn').style.display = 'inline-flex';
    
    const container = document.getElementById('vocabularies-container');
    container.innerHTML = '';
    
    if (state.currentVocabularies.length === 0) {
        addVocabularyRow();
    } else {
        state.currentVocabularies.forEach(vocab => {
            addVocabularyRow(vocab);
        });
    }
    
    showView('edit-set-view');
}

function addVocabularyRow(vocab = null) {
    const container = document.getElementById('vocabularies-container');
    const index = container.children.length;
    
    const row = document.createElement('div');
    row.className = 'vocabulary-item';
    row.dataset.id = vocab ? vocab.id : 'new';
    row.innerHTML = `
        <input type="text" class="input input-bordered w-full vocab-main" 
               placeholder="${state.mainLanguage}" 
               value="${vocab ? vocab.word_main : ''}">
        <input type="text" class="input input-bordered w-full vocab-target" 
               placeholder="Übersetzung" 
               value="${vocab ? vocab.word_target : ''}">
        <button type="button" class="btn btn-error" onclick="removeVocabularyRow(this)">
            🗑️
        </button>
    `;
    
    container.appendChild(row);
}

function removeVocabularyRow(btn) {
    btn.closest('.vocabulary-item').remove();
}

document.getElementById('add-vocabulary-btn').addEventListener('click', () => {
    addVocabularyRow();
});

document.getElementById('save-set-btn').addEventListener('click', async () => {
    const setName = document.getElementById('set-name').value.trim();
    const languageId = document.getElementById('set-language').value;
    
    if (!setName) {
        showToast('Bitte gib einen Set-Namen ein', 'error');
        return;
    }
    
    // Collect vocabularies
    const vocabRows = document.querySelectorAll('.vocabulary-item');
    const vocabularies = [];
    
    vocabRows.forEach(row => {
        const main = row.querySelector('.vocab-main').value.trim();
        const target = row.querySelector('.vocab-target').value.trim();
        
        if (main && target) {
            vocabularies.push({
                id: row.dataset.id !== 'new' ? row.dataset.id : null,
                word_main: main,
                word_target: target
            });
        }
    });
    
    if (vocabularies.length === 0) {
        showToast('Bitte füge mindestens eine Vokabel hinzu', 'error');
        return;
    }
    
    try {
        let setId = state.currentSetId;
        
        // Create or update set
        if (!setId) {
            const result = await fetchAPI('sets.php', {
                method: 'POST',
                body: JSON.stringify({ name: setName, language_id: languageId })
            });
            setId = result.id;
        } else {
            await fetchAPI('sets.php', {
                method: 'PUT',
                body: JSON.stringify({ id: setId, name: setName, language_id: languageId })
            });
            
            // Delete removed vocabularies
            const existingIds = state.currentVocabularies.map(v => v.id.toString());
            const currentIds = vocabularies.filter(v => v.id).map(v => v.id.toString());
            const deletedIds = existingIds.filter(id => !currentIds.includes(id));
            
            for (const id of deletedIds) {
                await fetchAPI('vocabularies.php', {
                    method: 'DELETE',
                    body: JSON.stringify({ id })
                });
            }
        }
        
        // Add/update vocabularies
        for (const vocab of vocabularies) {
            if (vocab.id) {
                // Update existing
                await fetchAPI('vocabularies.php', {
                    method: 'PUT',
                    body: JSON.stringify({
                        id: vocab.id,
                        word_main: vocab.word_main,
                        word_target: vocab.word_target
                    })
                });
            } else {
                // Add new
                await fetchAPI('vocabularies.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        set_id: setId,
                        word_main: vocab.word_main,
                        word_target: vocab.word_target
                    })
                });
            }
        }
        
        showToast('Set erfolgreich gespeichert!', 'success');
        showView('home-view');
        await loadSets();
        
    } catch (error) {
        console.error('Error saving set:', error);
    }
});

document.getElementById('delete-set-btn').addEventListener('click', async () => {
    if (!confirm('Möchtest du dieses Set wirklich löschen?')) {
        return;
    }
    
    await fetchAPI('sets.php', {
        method: 'DELETE',
        body: JSON.stringify({ id: state.currentSetId })
    });
    
    showToast('Set gelöscht', 'success');
    showView('home-view');
    await loadSets();
});

// =========================
// Learning: Mode Selection
// =========================

function startLearning(setId) {
    state.currentSetId = setId;
    state.currentSet = state.sets.find(s => s.id === setId);
    
    document.getElementById('learn-mode-title').textContent = `${state.currentSet.name} - Modus wählen`;
    showView('learn-mode-view');
}

document.querySelectorAll('.start-learning').forEach(btn => {
    btn.addEventListener('click', async () => {
        const mode = btn.dataset.mode;
        state.learningSession.mode = mode;
        state.learningSession.vocabularies = await loadVocabularies(state.currentSetId);
        state.learningSession.currentIndex = 0;
        state.learningSession.results = [];
        
        // Shuffle vocabularies
        state.learningSession.vocabularies.sort(() => Math.random() - 0.5);
        
        if (mode === 'typing') {
            startTypingMode();
        } else if (mode === 'flashcard') {
            startFlashcardMode();
        } else if (mode === 'quiz') {
            startQuizMode();
        } else if (mode === 'speed') {
            startSpeedMode();
        } else if (mode === 'listening') {
            startListeningMode();
        }
    });
});

// =========================
// Typing Mode
// =========================

function startTypingMode() {
    showView('typing-view');
    updateTypingProgress();
    showNextTypingWord();
}

function updateTypingProgress() {
    const progress = document.getElementById('typing-progress');
    const total = state.learningSession.vocabularies.length;
    const current = state.learningSession.currentIndex + 1;
    progress.textContent = `${current} / ${total}`;
}

function showNextTypingWord() {
    const vocab = state.learningSession.vocabularies[state.learningSession.currentIndex];
    
    if (!vocab) {
        showResults();
        return;
    }
    
    document.getElementById('typing-main-lang').textContent = state.mainLanguage;
    document.getElementById('typing-target-lang').textContent = state.currentSet.language_name;
    document.getElementById('typing-word').textContent = vocab.word_main;
    document.getElementById('typing-input').value = '';
    document.getElementById('typing-feedback').style.display = 'none';
    document.getElementById('typing-input').focus();
}

document.getElementById('typing-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('check-typing-btn').click();
    }
});

document.getElementById('check-typing-btn').addEventListener('click', async () => {
    const input = document.getElementById('typing-input').value.trim().toLowerCase();
    const vocab = state.learningSession.vocabularies[state.learningSession.currentIndex];
    const correct = vocab.word_target.toLowerCase();
    
    const isCorrect = input === correct;
    
    // Save progress
    await fetchAPI('progress.php', {
        method: 'POST',
        body: JSON.stringify({
            vocabulary_id: vocab.id,
            mode: 'typing',
            is_correct: isCorrect
        })
    });
    
    // Store result
    state.learningSession.results.push({
        vocabulary: vocab,
        userAnswer: input,
        isCorrect: isCorrect
    });
    
    // Show feedback
    const feedback = document.getElementById('typing-feedback');
    feedback.style.display = 'block';
    
    if (isCorrect) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Richtig!';
    } else {
        feedback.className = 'feedback wrong';
        feedback.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Falsch! Richtig wäre: <strong>${vocab.word_target}</strong>`;
    }
    
    // Move to next after delay
    setTimeout(() => {
        state.learningSession.currentIndex++;
        updateTypingProgress();
        showNextTypingWord();
    }, 2000);
});

document.getElementById('exit-typing').addEventListener('click', () => {
    if (state.learningSession.results.length > 0) {
        if (confirm('Möchtest du das Lernen wirklich beenden?')) {
            showResults();
        }
    } else {
        showView('home-view');
        loadSets();
    }
});

// =========================
// Speed Mode
// =========================

const SPEED_TIME_LIMIT = 7;

function startSpeedMode() {
    showView('speed-view');
    updateSpeedProgress();
    showNextSpeedWord();
}

function updateSpeedProgress() {
    const progress = document.getElementById('speed-progress');
    const total = state.learningSession.vocabularies.length;
    const current = state.learningSession.currentIndex + 1;
    progress.textContent = `${current} / ${total}`;
}

function clearSpeedTimer() {
    if (state.speedTimerId) {
        clearInterval(state.speedTimerId);
        state.speedTimerId = null;
    }
}

function startSpeedTimer() {
    clearSpeedTimer();
    state.speedRemaining = SPEED_TIME_LIMIT;
    document.getElementById('speed-timer').textContent = state.speedRemaining;

    state.speedTimerId = setInterval(() => {
        state.speedRemaining -= 1;
        document.getElementById('speed-timer').textContent = state.speedRemaining;
        if (state.speedRemaining <= 0) {
            clearSpeedTimer();
            handleSpeedAnswer('');
        }
    }, 1000);
}

function showNextSpeedWord() {
    const vocab = state.learningSession.vocabularies[state.learningSession.currentIndex];

    if (!vocab) {
        clearSpeedTimer();
        showResults();
        return;
    }

    state.speedLocked = false;
    document.getElementById('speed-main-lang').textContent = state.mainLanguage;
    document.getElementById('speed-target-lang').textContent = state.currentSet.language_name;
    document.getElementById('speed-word').textContent = vocab.word_main;
    document.getElementById('speed-input').value = '';
    document.getElementById('speed-feedback').style.display = 'none';
    document.getElementById('speed-input').focus();
    startSpeedTimer();
}

document.getElementById('speed-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('check-speed-btn').click();
    }
});

document.getElementById('check-speed-btn').addEventListener('click', () => {
    const input = document.getElementById('speed-input').value.trim().toLowerCase();
    handleSpeedAnswer(input);
});

async function handleSpeedAnswer(input) {
    if (state.speedLocked) {
        return;
    }

    state.speedLocked = true;
    clearSpeedTimer();

    const vocab = state.learningSession.vocabularies[state.learningSession.currentIndex];
    const correct = vocab.word_target.toLowerCase();
    const isCorrect = input === correct;

    await fetchAPI('progress.php', {
        method: 'POST',
        body: JSON.stringify({
            vocabulary_id: vocab.id,
            mode: 'speed',
            is_correct: isCorrect
        })
    });

    state.learningSession.results.push({
        vocabulary: vocab,
        userAnswer: input,
        isCorrect: isCorrect
    });

    const feedback = document.getElementById('speed-feedback');
    feedback.style.display = 'block';

    if (isCorrect) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Richtig!';
    } else {
        feedback.className = 'feedback wrong';
        feedback.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Falsch! Richtig wäre: <strong>${vocab.word_target}</strong>`;
    }

    setTimeout(() => {
        state.learningSession.currentIndex++;
        updateSpeedProgress();
        showNextSpeedWord();
    }, 1500);
}

document.getElementById('exit-speed').addEventListener('click', () => {
    clearSpeedTimer();
    if (state.learningSession.results.length > 0) {
        if (confirm('Möchtest du das Lernen wirklich beenden?')) {
            showResults();
        }
    } else {
        showView('home-view');
        loadSets();
    }
});

// =========================
// Flashcard Mode
// =========================

function startFlashcardMode() {
    showView('flashcard-view');
    updateFlashcardProgress();
    showNextFlashcard();
}

function updateFlashcardProgress() {
    const progress = document.getElementById('flashcard-progress');
    const total = state.learningSession.vocabularies.length;
    const current = state.learningSession.currentIndex + 1;
    progress.textContent = `${current} / ${total}`;
}

function showNextFlashcard() {
    const vocab = state.learningSession.vocabularies[state.learningSession.currentIndex];
    
    if (!vocab) {
        showResults();
        return;
    }
    
    // Reset card
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.remove('flipped');
    document.getElementById('flashcard-actions').style.display = 'none';
    document.getElementById('flip-card-btn').style.display = 'inline-flex';
    
    // Set content
    document.getElementById('flashcard-main-lang').textContent = state.mainLanguage;
    document.getElementById('flashcard-target-lang').textContent = state.currentSet.language_name;
    document.getElementById('flashcard-word-main').textContent = vocab.word_main;
    document.getElementById('flashcard-word-target').textContent = vocab.word_target;
}

document.getElementById('flip-card-btn').addEventListener('click', () => {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.add('flipped');
    document.getElementById('flip-card-btn').style.display = 'none';
    document.getElementById('flashcard-actions').style.display = 'flex';
});

async function answerFlashcard(isCorrect) {
    const vocab = state.learningSession.vocabularies[state.learningSession.currentIndex];
    
    // Save progress
    await fetchAPI('progress.php', {
        method: 'POST',
        body: JSON.stringify({
            vocabulary_id: vocab.id,
            mode: 'flashcard',
            is_correct: isCorrect
        })
    });
    
    // Store result
    state.learningSession.results.push({
        vocabulary: vocab,
        userAnswer: isCorrect ? vocab.word_target : '-',
        isCorrect: isCorrect
    });
    
    // Move to next
    state.learningSession.currentIndex++;
    updateFlashcardProgress();
    showNextFlashcard();
}

document.getElementById('correct-btn').addEventListener('click', () => answerFlashcard(true));
document.getElementById('wrong-btn').addEventListener('click', () => answerFlashcard(false));

document.getElementById('exit-flashcard').addEventListener('click', () => {
    if (state.learningSession.results.length > 0) {
        if (confirm('Möchtest du das Lernen wirklich beenden?')) {
            showResults();
        }
    } else {
        showView('home-view');
        loadSets();
    }
});

// =========================
// Quiz Mode
// =========================

function startQuizMode() {
    showView('quiz-view');
    updateQuizProgress();
    showNextQuizQuestion();
}

function updateQuizProgress() {
    const progress = document.getElementById('quiz-progress');
    const total = state.learningSession.vocabularies.length;
    const current = state.learningSession.currentIndex + 1;
    progress.textContent = `${current} / ${total}`;
}

function getQuizOptions(correctVocab) {
    const options = new Set([correctVocab.word_target]);
    const pool = state.learningSession.vocabularies
        .filter(v => v.id !== correctVocab.id)
        .map(v => v.word_target);

    while (options.size < Math.min(4, state.learningSession.vocabularies.length)) {
        const candidate = pool[Math.floor(Math.random() * pool.length)];
        if (candidate) {
            options.add(candidate);
        } else {
            break;
        }
    }

    return Array.from(options).sort(() => Math.random() - 0.5);
}

function showNextQuizQuestion() {
    const vocab = state.learningSession.vocabularies[state.learningSession.currentIndex];

    if (!vocab) {
        showResults();
        return;
    }

    document.getElementById('quiz-main-lang').textContent = state.mainLanguage;
    document.getElementById('quiz-word').textContent = vocab.word_main;

    const options = getQuizOptions(vocab);
    const optionsContainer = document.getElementById('quiz-options');
    const feedback = document.getElementById('quiz-feedback');

    feedback.style.display = 'none';
    optionsContainer.innerHTML = '';

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.type = 'button';
        btn.textContent = option;
        btn.addEventListener('click', () => handleQuizAnswer(option, vocab));
        optionsContainer.appendChild(btn);
    });
}

async function handleQuizAnswer(selected, vocab) {
    const isCorrect = selected === vocab.word_target;

    await fetchAPI('progress.php', {
        method: 'POST',
        body: JSON.stringify({
            vocabulary_id: vocab.id,
            mode: 'quiz',
            is_correct: isCorrect
        })
    });

    state.learningSession.results.push({
        vocabulary: vocab,
        userAnswer: selected,
        isCorrect: isCorrect
    });

    const feedback = document.getElementById('quiz-feedback');
    feedback.style.display = 'block';

    if (isCorrect) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Richtig!';
    } else {
        feedback.className = 'feedback wrong';
        feedback.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Falsch! Richtig wäre: <strong>${vocab.word_target}</strong>`;
    }

    setTimeout(() => {
        state.learningSession.currentIndex++;
        updateQuizProgress();
        showNextQuizQuestion();
    }, 1500);
}

document.getElementById('exit-quiz').addEventListener('click', () => {
    if (state.learningSession.results.length > 0) {
        if (confirm('Möchtest du das Lernen wirklich beenden?')) {
            showResults();
        }
    } else {
        showView('home-view');
        loadSets();
    }
});

// =========================
// Listening Mode
// =========================

function startListeningMode() {
    showView('listening-view');
    updateListeningProgress();
    showNextListeningQuestion();
}

function updateListeningProgress() {
    const progress = document.getElementById('listening-progress');
    const total = state.learningSession.vocabularies.length;
    const current = state.learningSession.currentIndex + 1;
    progress.textContent = `${current} / ${total}`;
}

function getListeningOptions(correctVocab) {
    const options = new Set([correctVocab.word_main]);
    const pool = state.learningSession.vocabularies
        .filter(v => v.id !== correctVocab.id)
        .map(v => v.word_main);

    while (options.size < Math.min(4, state.learningSession.vocabularies.length)) {
        const candidate = pool[Math.floor(Math.random() * pool.length)];
        if (candidate) {
            options.add(candidate);
        } else {
            break;
        }
    }

    return Array.from(options).sort(() => Math.random() - 0.5);
}

function showNextListeningQuestion() {
    const vocab = state.learningSession.vocabularies[state.learningSession.currentIndex];

    if (!vocab) {
        showResults();
        return;
    }

    state.currentListeningVocab = vocab;
    document.getElementById('listening-target-lang').textContent = state.currentSet.language_name;

    const options = getListeningOptions(vocab);
    const optionsContainer = document.getElementById('listening-options');
    const feedback = document.getElementById('listening-feedback');

    feedback.style.display = 'none';
    optionsContainer.innerHTML = '';

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.type = 'button';
        btn.textContent = option;
        btn.addEventListener('click', () => handleListeningAnswer(option, vocab));
        optionsContainer.appendChild(btn);
    });

    const langCode = getLanguageCodeById(state.currentSet.language_id);
    speakText(vocab.word_target, langCode);
}

async function handleListeningAnswer(selected, vocab) {
    const isCorrect = selected === vocab.word_main;

    await fetchAPI('progress.php', {
        method: 'POST',
        body: JSON.stringify({
            vocabulary_id: vocab.id,
            mode: 'listening',
            is_correct: isCorrect
        })
    });

    state.learningSession.results.push({
        vocabulary: vocab,
        userAnswer: selected,
        isCorrect: isCorrect
    });

    const feedback = document.getElementById('listening-feedback');
    feedback.style.display = 'block';

    if (isCorrect) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Richtig!';
    } else {
        feedback.className = 'feedback wrong';
        feedback.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Falsch! Richtig wäre: <strong>${vocab.word_main}</strong>`;
    }

    setTimeout(() => {
        state.learningSession.currentIndex++;
        updateListeningProgress();
        showNextListeningQuestion();
    }, 1500);
}

document.getElementById('play-listening-btn').addEventListener('click', () => {
    if (!state.currentListeningVocab) {
        return;
    }
    const langCode = getLanguageCodeById(state.currentSet.language_id);
    speakText(state.currentListeningVocab.word_target, langCode);
});

document.getElementById('exit-listening').addEventListener('click', () => {
    if (state.learningSession.results.length > 0) {
        if (confirm('Möchtest du das Lernen wirklich beenden?')) {
            showResults();
        }
    } else {
        showView('home-view');
        loadSets();
    }
});

// =========================
// Results
// =========================

function showResults() {
    const results = state.learningSession.results;
    const correct = results.filter(r => r.isCorrect).length;
    const wrong = results.filter(r => !r.isCorrect).length;
    const total = results.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    document.getElementById('correct-count').textContent = correct;
    document.getElementById('wrong-count').textContent = wrong;
    document.getElementById('score-percentage').textContent = percentage + '%';
    
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = results.map(result => `
        <div class="result-item ${result.isCorrect ? 'correct' : 'wrong'}">
            <div class="result-words">
                <strong>${result.vocabulary.word_main}</strong>
                <span>→</span>
                <span>${result.vocabulary.word_target}</span>
                ${!result.isCorrect && state.learningSession.mode === 'typing' 
                    ? `<span style="color: var(--danger-color);">(Du: ${result.userAnswer})</span>` 
                    : ''}
            </div>
            <div class="result-icon">${result.isCorrect ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-xmark"></i>'}</div>
        </div>
    `).join('');
    
    showView('results-view');
}

document.getElementById('repeat-learning-btn').addEventListener('click', () => {
    // Restart with wrong answers or all
    const wrongVocabs = state.learningSession.results
        .filter(r => !r.isCorrect)
        .map(r => r.vocabulary);
    
    if (wrongVocabs.length > 0 && confirm('Nur falsche Antworten wiederholen?')) {
        state.learningSession.vocabularies = wrongVocabs;
    }
    
    state.learningSession.currentIndex = 0;
    state.learningSession.results = [];
    state.learningSession.vocabularies.sort(() => Math.random() - 0.5);
    
    if (state.learningSession.mode === 'typing') {
        startTypingMode();
    } else if (state.learningSession.mode === 'flashcard') {
        startFlashcardMode();
    } else if (state.learningSession.mode === 'quiz') {
        startQuizMode();
    } else if (state.learningSession.mode === 'speed') {
        startSpeedMode();
    } else if (state.learningSession.mode === 'listening') {
        startListeningMode();
    }
});

// =========================
// Initialize App
// =========================

async function loadAppData() {
    await loadSettings();
    await loadLanguages();
    await loadSets();
    initLanguageSelector();
    updateUITexts();
    showView('home-view');
}

async function init() {
    try {
        // Initialize UI language
        updateUITexts();
        
        // Check if this is a share link first
        const params = new URLSearchParams(window.location.search);
        const shareToken = params.get('share');
        
        if (shareToken) {
            // For share links, show app shell without auth
            document.getElementById('auth-view').style.display = 'none';
            document.getElementById('app-shell').style.display = 'block';
            // Hide header nav buttons for non-logged in users
            const headerNav = document.querySelector('.navbar-center');
            if (headerNav) headerNav.style.display = 'none';
            await handleShareImport();
            return;
        }
        
        // Normal auth flow
        const user = await loadCurrentUser();
        if (user) {
            await loadAppData();
        }
    } catch (error) {
        console.error('Initialization error:', error);
        // Don't show error toast if it's just a missing auth
        if (error.message !== 'API-Fehler') {
            showToast(t('errorLoading'), 'error');
        }
    }
}

async function handleShareImport() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('share');
    if (!token) {
        return;
    }

    try {
        const data = await fetchAPI(`share.php?token=${encodeURIComponent(token)}`, { silent: true, skipAuth: true });
        const sharedSet = data.set;
        
        // Load vocabularies for the shared set without auth
        const vocabData = await fetchAPI(`vocabularies.php?set_id=${sharedSet.id}&share_token=${encodeURIComponent(token)}`, { silent: true, skipAuth: true });
        
        // Store as temporary set in state
        state.currentSet = {
            id: sharedSet.id,
            name: sharedSet.name,
            language_id: sharedSet.language_id,
            language_name: sharedSet.language_name,
            is_shared: true,
            share_token: token
        };
        
        state.learningSession.vocabularies = vocabData.vocabularies;
        
        // Show choice: import or just learn
        const modal = document.getElementById('message-modal');
        const modalTitle = modal.querySelector('h3');
        const modalText = modal.querySelector('p');
        
        modalTitle.textContent = 'Geteiltes Set';
        modalText.innerHTML = `<strong>${sharedSet.name}</strong> (${sharedSet.language_name})<br>${sharedSet.word_count} Vokabeln<br><br>Du kannst dieses Set direkt lernen oder in deine Sets importieren.`;
        
        const actionContainer = modal.querySelector('.modal-action');
        actionContainer.innerHTML = '';
        
        // Learn button
        const learnBtn = document.createElement('button');
        learnBtn.className = 'btn btn-primary';
        learnBtn.innerHTML = '<i class="fas fa-play"></i> Jetzt lernen';
        learnBtn.addEventListener('click', () => {
            modal.close();
            showView('learn-mode-view');
        });
        
        // Import button
        const importBtn = document.createElement('button');
        importBtn.className = 'btn btn-secondary';
        importBtn.innerHTML = '<i class="fas fa-download"></i> Importieren';
        importBtn.addEventListener('click', async () => {
            try {
                await fetchAPI('share.php', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'import', token }),
                    silent: true
                });
                modal.close();
                showToast('Set importiert', 'success');
                await loadSets();
                showView('home-view');
            } catch (error) {
                showModal('Import fehlgeschlagen', error.message || 'Bitte versuche es erneut.');
            }
        });
        
        // Close button
        const closeForm = document.createElement('form');
        closeForm.method = 'dialog';
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn';
        closeBtn.textContent = 'Abbrechen';
        closeForm.appendChild(closeBtn);
        
        actionContainer.appendChild(learnBtn);
        actionContainer.appendChild(importBtn);
        actionContainer.appendChild(closeForm);
        
        modal.showModal();
        
    } catch (error) {
        showModal('Freigabe ungültig', error.message || 'Der Link ist ungültig oder abgelaufen.');
    }
}

// =========================
// PWA Install
// =========================

let deferredInstallPrompt = null;
const installBtn = document.getElementById('install-btn');
const installBtnMobile = document.getElementById('install-btn-mobile');
const installBtnMobileWrapper = document.getElementById('install-btn-mobile-wrapper');
const installBtnHero = document.getElementById('install-btn-hero');
const installBtnFloating = document.getElementById('install-btn-floating');

// Detect iOS
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    
    // Show install buttons in header/menu when prompt is available
    if (installBtn) {
        installBtn.style.display = 'inline-flex';
    }
    if (installBtnMobileWrapper) {
        installBtnMobileWrapper.style.display = 'block';
    }
    if (installBtnHero) {
        installBtnHero.style.display = 'inline-flex';
    }
});

async function handleInstallClick() {
    // If we have the prompt, use it
    if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const result = await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        
        if (result.outcome === 'accepted') {
            // Hide all buttons after successful install
            hideAllInstallButtons();
            showToast(t('appReady'), 'success');
        }
        return;
    }
    
    // No prompt available - show help modal
    const helpModal = document.getElementById('install-help-modal');
    const iosInstructions = document.getElementById('install-ios-instructions');
    const androidInstructions = document.getElementById('install-android-instructions');
    
    if (isIOS()) {
        iosInstructions.style.display = 'block';
        androidInstructions.style.display = 'none';
    } else {
        iosInstructions.style.display = 'none';
        androidInstructions.style.display = 'block';
    }
    
    helpModal.showModal();
}

function hideAllInstallButtons() {
    if (installBtn) installBtn.style.display = 'none';
    if (installBtnMobileWrapper) installBtnMobileWrapper.style.display = 'none';
    if (installBtnHero) installBtnHero.style.display = 'none';
    if (installBtnFloating) installBtnFloating.style.display = 'none';
}

if (installBtn) {
    installBtn.addEventListener('click', handleInstallClick);
}

if (installBtnMobile) {
    installBtnMobile.addEventListener('click', handleInstallClick);
}

if (installBtnHero) {
    installBtnHero.addEventListener('click', handleInstallClick);
}

if (installBtnFloating) {
    installBtnFloating.addEventListener('click', handleInstallClick);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
    });
}

// Debug viewport on mobile PWA
function debugViewport() {
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('PWA Mode - Viewport:', {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio,
            orientation: window.screen.orientation?.type || 'unknown'
        });
    }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        debugViewport();
        init();
    });
} else {
    debugViewport();
    init();
}
