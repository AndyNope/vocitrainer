// i18n Translation System
const translations = {
    de: {
        // App Name
        appName: 'Voci Trainer',
        
        // Landing Page
        landingHero: 'Lerne Vokabeln effektiv mit 5 verschiedenen Lernmodi. Erstelle eigene Sets oder nutze Community-Inhalte.',
        startNow: 'Jetzt starten',
        learnMore: 'Mehr erfahren',
        
        // Features
        features: 'Funktionen',
        feature5Modes: '5 Lernmodi',
        feature5ModesDesc: 'Karteikarten, Multiple Choice, Schreibmodus, Zuordnen und Hörmodus für abwechslungsreiches Lernen.',
        featureCommunity: 'Community Sets',
        featureCommunityDesc: 'Greife auf geteilte Vokabelsets zu oder teile deine eigenen Sets mit der Community.',
        featureProgress: 'Fortschritt tracken',
        featureProgressDesc: 'Verfolge deinen Lernfortschritt und sieh welche Vokabeln du schon beherrschst.',
        featureLanguages: 'Alle Sprachen',
        featureLanguagesDesc: 'Lerne beliebige Sprachen - von Englisch und Französisch bis Japanisch und Arabisch.',
        featurePWA: 'PWA',
        featurePWADesc: 'Installiere die App auf deinem Gerät und lerne auch offline weiter.',
        featureAudio: 'Audio Support',
        featureAudioDesc: 'Hör dir Vokabeln mit Text-to-Speech an und verbessere deine Aussprache.',
        
        // Community Preview
        popularSets: 'Beliebte Community Sets',
        popularSetsDesc: 'Starte direkt mit professionell erstellten C1 Vokabelsets basierend auf "Compact Advanced"',
        noCommunitySets: 'Keine Community Sets verfügbar',
        errorLoadingSets: 'Fehler beim Laden der Community Sets',
        vocabularies: 'Vokabeln',
        viewSet: 'Anschauen',
        
        // Auth
        welcomeBack: 'Willkommen zurück',
        freeStart: 'Kostenlos starten',
        authDescription: 'Melde dich an oder registriere dich, um deine eigenen Voci zu speichern.',
        authDescriptionShort: 'Melde dich an oder registriere dich.',
        login: 'Anmelden',
        register: 'Registrieren',
        email: 'E-Mail',
        password: 'Passwort',
        name: 'Name',
        loginButton: 'Anmelden',
        registerButton: 'Registrieren',
        registerHint: 'Tippe oben auf Registrieren, wenn du neu bist.',
        registerSuccess: 'Nach der Registrierung erhältst du eine Bestätigungsmail.',
        
        // Footer
        footerTagline: 'Effektiv Vokabeln lernen',
        madeWith: 'Made with',
        by: 'by Andy',
        
        // Navigation
        mySets: 'Meine Sets',
        community: 'Community',
        settings: 'Einstellungen',
        logout: 'Abmelden',
        
        // Header
        installApp: 'App installieren',
        
        // Home View
        myVocabSets: 'Meine Voci-Sets',
        createNewSet: 'Neues Set erstellen',
        noSetsYet: 'Noch keine Sets vorhanden',
        createFirstSet: 'Erstelle dein erstes Vokabel-Set um loszulegen!',
        vocabularyCount: 'Vokabeln',
        learn: 'Lernen',
        edit: 'Bearbeiten',
        share: 'Teilen',
        delete: 'Löschen',
        
        // Community View
        communityVocabSets: 'Community Vokabel-Sets',
        sharedByOthers: 'Von anderen Nutzern geteilte Vokabelsets',
        import: 'Importieren',
        
        // Learning Modes
        selectMode: 'Lernmodus wählen',
        flashcardMode: 'Karteikarten',
        flashcardModeDesc: 'Klassisches Lernen mit Karteikarten',
        quizMode: 'Multiple Choice',
        quizModeDesc: 'Teste dein Wissen mit Auswahlfragen',
        typingMode: 'Schreibmodus',
        typingModeDesc: 'Schreibe die Übersetzungen',
        matchingMode: 'Zuordnen',
        matchingModeDesc: 'Ordne Wörter einander zu',
        listeningMode: 'Hörmodus',
        listeningModeDesc: 'Höre und lerne die Aussprache',
        startLearning: 'Lernen starten',
        learnNow: 'Jetzt lernen',
        
        // Learning Session
        nextCard: 'Nächste Karte',
        showAnswer: 'Antwort zeigen',
        iKnewIt: 'Gewusst',
        iDidntKnow: 'Nicht gewusst',
        checkAnswer: 'Antwort prüfen',
        next: 'Weiter',
        submit: 'Absenden',
        correct: 'Richtig!',
        incorrect: 'Falsch!',
        correctAnswer: 'Richtige Antwort',
        yourAnswer: 'Deine Antwort',
        
        // Results
        sessionComplete: 'Session beendet!',
        yourResults: 'Deine Ergebnisse',
        correctAnswers: 'Richtige Antworten',
        wrongAnswers: 'Falsche Antworten',
        accuracy: 'Genauigkeit',
        backToSet: 'Zurück zum Set',
        repeatLearning: 'Wiederholen',
        
        // Set Editor
        editSet: 'Set bearbeiten',
        setName: 'Set-Name',
        language: 'Sprache',
        addVocabulary: 'Vokabel hinzufügen',
        mainWord: 'Hauptwort',
        translation: 'Übersetzung',
        save: 'Speichern',
        cancel: 'Abbrechen',
        close: 'Schliessen',
        
        // Share Modal
        shareSet: 'Set teilen',
        shareLink: 'Teile diesen Link:',
        copy: 'Kopieren',
        publishCommunity: 'Im Community veröffentlichen',
        publishCommunityDesc: 'Andere können dein Set im Community-Bereich finden',
        linkCopied: 'Link kopiert!',
        
        // Settings
        settingsTitle: 'Einstellungen',
        mainLanguage: 'Hauptsprache',
        mainLanguageDesc: 'Die Sprache, die du lernen möchtest',
        appLanguage: 'App-Sprache',
        appLanguageDesc: 'Sprache der Benutzeroberfläche',
        deleteAccount: 'Account löschen',
        deleteAccountWarning: 'Achtung: Dies kann nicht rückgängig gemacht werden!',
        
        // Toasts & Messages
        welcomeMessage: 'Willkommen zurück!',
        loginSuccess: 'Du bist jetzt angemeldet. Viel Erfolg beim Lernen!',
        loginFailed: 'Anmeldung fehlgeschlagen',
        checkCredentials: 'Bitte überprüfe deine Daten.',
        registerSuccessTitle: 'Registrierung erfolgreich',
        registerSuccessMsg: 'Bitte bestätige die E-Mail, die wir dir geschickt haben.',
        registerFailed: 'Registrierung fehlgeschlagen',
        tryAgain: 'Bitte versuche es erneut.',
        appReady: 'App bereit!',
        errorLoading: 'Fehler beim Laden der Daten',
        setCreated: 'Set erstellt!',
        setUpdated: 'Set aktualisiert!',
        setDeleted: 'Set gelöscht!',
        vocabularyAdded: 'Vokabel hinzugefügt!',
        vocabularyDeleted: 'Vokabel gelöscht!',
        setImported: 'Set importiert!',
        confirmDelete: 'Wirklich löschen?',
        confirmDeleteSet: 'Möchtest du dieses Set wirklich löschen?',
        yes: 'Ja',
        no: 'Nein',
        
        // Audio
        audioNotSupported: 'Audio wird von deinem Browser nicht unterstützt',
    },
    en: {
        // App Name
        appName: 'Vocab Trainer',
        
        // Landing Page
        landingHero: 'Learn vocabulary effectively with 5 different learning modes. Create your own sets or use community content.',
        startNow: 'Start Now',
        learnMore: 'Learn More',
        
        // Features
        features: 'Features',
        feature5Modes: '5 Learning Modes',
        feature5ModesDesc: 'Flashcards, Multiple Choice, Typing Mode, Matching and Listening Mode for varied learning.',
        featureCommunity: 'Community Sets',
        featureCommunityDesc: 'Access shared vocabulary sets or share your own sets with the community.',
        featureProgress: 'Track Progress',
        featureProgressDesc: 'Track your learning progress and see which vocabulary you already know.',
        featureLanguages: 'All Languages',
        featureLanguagesDesc: 'Learn any language - from English and French to Japanese and Arabic.',
        featurePWA: 'PWA',
        featurePWADesc: 'Install the app on your device and continue learning offline.',
        featureAudio: 'Audio Support',
        featureAudioDesc: 'Listen to vocabulary with text-to-speech and improve your pronunciation.',
        
        // Community Preview
        popularSets: 'Popular Community Sets',
        popularSetsDesc: 'Start directly with professionally created C1 vocabulary sets based on "Compact Advanced"',
        noCommunitySets: 'No community sets available',
        errorLoadingSets: 'Error loading community sets',
        vocabularies: 'Vocabularies',
        viewSet: 'View',
        
        // Auth
        welcomeBack: 'Welcome Back',
        freeStart: 'Start for Free',
        authDescription: 'Sign in or register to save your own vocabulary.',
        authDescriptionShort: 'Sign in or register.',
        login: 'Sign In',
        register: 'Sign Up',
        email: 'Email',
        password: 'Password',
        name: 'Name',
        loginButton: 'Sign In',
        registerButton: 'Sign Up',
        registerHint: 'Tap Sign Up above if you\'re new.',
        registerSuccess: 'You will receive a confirmation email after registration.',
        
        // Footer
        footerTagline: 'Learn Vocabulary Effectively',
        madeWith: 'Made with',
        by: 'by Andy',
        
        // Navigation
        mySets: 'My Sets',
        community: 'Community',
        settings: 'Settings',
        logout: 'Sign Out',
        
        // Header
        installApp: 'Install App',
        
        // Home View
        myVocabSets: 'My Vocabulary Sets',
        createNewSet: 'Create New Set',
        noSetsYet: 'No sets yet',
        createFirstSet: 'Create your first vocabulary set to get started!',
        vocabularyCount: 'Vocabulary',
        learn: 'Learn',
        edit: 'Edit',
        share: 'Share',
        delete: 'Delete',
        
        // Community View
        communityVocabSets: 'Community Vocabulary Sets',
        sharedByOthers: 'Vocabulary sets shared by other users',
        import: 'Import',
        
        // Learning Modes
        selectMode: 'Select Learning Mode',
        flashcardMode: 'Flashcards',
        flashcardModeDesc: 'Classic learning with flashcards',
        quizMode: 'Multiple Choice',
        quizModeDesc: 'Test your knowledge with quiz questions',
        typingMode: 'Typing Mode',
        typingModeDesc: 'Write the translations',
        matchingMode: 'Matching',
        matchingModeDesc: 'Match words to each other',
        listeningMode: 'Listening Mode',
        listeningModeDesc: 'Listen and learn pronunciation',
        startLearning: 'Start Learning',
        learnNow: 'Learn Now',
        
        // Learning Session
        nextCard: 'Next Card',
        showAnswer: 'Show Answer',
        iKnewIt: 'I knew it',
        iDidntKnow: 'I didn\'t know',
        checkAnswer: 'Check Answer',
        next: 'Next',
        submit: 'Submit',
        correct: 'Correct!',
        incorrect: 'Incorrect!',
        correctAnswer: 'Correct Answer',
        yourAnswer: 'Your Answer',
        
        // Results
        sessionComplete: 'Session Complete!',
        yourResults: 'Your Results',
        correctAnswers: 'Correct Answers',
        wrongAnswers: 'Wrong Answers',
        accuracy: 'Accuracy',
        backToSet: 'Back to Set',
        repeatLearning: 'Repeat',
        
        // Set Editor
        editSet: 'Edit Set',
        setName: 'Set Name',
        language: 'Language',
        addVocabulary: 'Add Vocabulary',
        mainWord: 'Main Word',
        translation: 'Translation',
        save: 'Save',
        cancel: 'Cancel',
        close: 'Close',
        
        // Share Modal
        shareSet: 'Share Set',
        shareLink: 'Share this link:',
        copy: 'Copy',
        publishCommunity: 'Publish in Community',
        publishCommunityDesc: 'Others can find your set in the community area',
        linkCopied: 'Link copied!',
        
        // Settings
        settingsTitle: 'Settings',
        mainLanguage: 'Main Language',
        mainLanguageDesc: 'The language you want to learn',
        appLanguage: 'App Language',
        appLanguageDesc: 'User interface language',
        deleteAccount: 'Delete Account',
        deleteAccountWarning: 'Warning: This cannot be undone!',
        
        // Toasts & Messages
        welcomeMessage: 'Welcome back!',
        loginSuccess: 'You are now signed in. Good luck learning!',
        loginFailed: 'Login failed',
        checkCredentials: 'Please check your credentials.',
        registerSuccessTitle: 'Registration successful',
        registerSuccessMsg: 'Please confirm the email we sent you.',
        registerFailed: 'Registration failed',
        tryAgain: 'Please try again.',
        appReady: 'App ready!',
        errorLoading: 'Error loading data',
        setCreated: 'Set created!',
        setUpdated: 'Set updated!',
        setDeleted: 'Set deleted!',
        vocabularyAdded: 'Vocabulary added!',
        vocabularyDeleted: 'Vocabulary deleted!',
        setImported: 'Set imported!',
        confirmDelete: 'Really delete?',
        confirmDeleteSet: 'Do you really want to delete this set?',
        yes: 'Yes',
        no: 'No',
        
        // Audio
        audioNotSupported: 'Audio is not supported by your browser',
    }
};

// Current language (default: German)
let currentLang = localStorage.getItem('appLanguage') || 'de';

// Get translation
function t(key) {
    return translations[currentLang]?.[key] || translations.de[key] || key;
}

// Set language
function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('appLanguage', lang);
        updateUITexts();
    }
}

// Get current language
function getCurrentLanguage() {
    return currentLang;
}

// Update all UI texts
function updateUITexts() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = t(key);
        
        if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'email' || el.type === 'password')) {
            el.placeholder = translation;
        } else {
            el.textContent = translation;
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang === 'de' ? 'de' : 'en';
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { t, setLanguage, getCurrentLanguage, updateUITexts };
}
