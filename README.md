# 📚 Voci Trainer

Eine moderne Webapp zum Lernen von Vokabeln mit verschiedenen Lernmodi.

## ✨ Features

- ✅ Voci-Sets mit verschiedenen Sprachen erstellen und verwalten
- ✅ Hauptsprache individuell wählen
- ✅ Zwei Lernmodi:
  - **Typing-Modus**: Übersetzungen selbst eintippen
  - **Lernkartei-Modus**: Karteikarten umdrehen und bewerten
- ✅ Favoriten-System für wichtige Sets
- ✅ Detaillierte Statistiken nach jedem Lerndurchgang
- ✅ Responsives Design für Desktop und Mobile
- ✅ Lernfortschritt wird automatisch gespeichert

## 🚀 Installation

### 1. Dateien hochladen

Lade alle Dateien auf deinen Webserver hoch:

```
voci-trainer/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── api/
│   ├── config.php
│   ├── db.php
│   ├── languages.php
│   ├── sets.php
│   ├── vocabularies.php
│   ├── settings.php
│   └── progress.php
└── database/
    └── schema.sql
```

### 2. Datenbank einrichten

1. Öffne phpMyAdmin oder dein MySQL-Verwaltungstool
2. Wähle die Datenbank `vocitrainer` aus
3. Gehe zum Tab "SQL" oder "Import"
4. Führe die SQL-Befehle aus `database/schema.sql` aus

**Oder per Kommandozeile:**

```bash
mysql -u vocitrainer -p vocitrainer < database/schema.sql
```

Passwort: `Pixelgun3d!!`

### 3. Konfiguration überprüfen

Die Datenbankverbindung ist bereits in `api/config.php` konfiguriert:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'vocitrainer');
define('DB_USER', 'vocitrainer');
define('DB_PASS', 'Pixelgun3d!!');
```

Falls nötig, passe diese Werte an.

### 4. App starten

Öffne einfach die `index.html` in deinem Browser oder rufe die URL deines Webservers auf:

```
http://deine-domain.ch/
```

## 📖 Verwendung

### Hauptsprache festlegen

1. Klicke auf "Einstellungen" in der Navigation
2. Wähle deine Hauptsprache aus
3. Klicke auf "Speichern"

### Voci-Set erstellen

1. Klicke auf "Neues Set erstellen"
2. Gib einen Namen für das Set ein
3. Wähle die Zielsprache
4. Füge Vokabeln hinzu (Hauptsprache → Zielsprache)
5. Klicke auf "Set speichern"

### Lernen starten

1. Klicke auf "Lernen" bei einem Set
2. Wähle den Lernmodus:
   - **Typing-Modus**: Schreibe die Übersetzung
   - **Lernkartei-Modus**: Bewerte, ob du die Antwort wusstest
3. Nach dem Durchgang siehst du deine Statistiken

### Set als Favorit markieren

- Klicke auf das ⭐-Symbol beim Set
- Favoriten werden oben in der Liste angezeigt

## 🛠 Technologien

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: PHP 7.4+
- **Datenbank**: MariaDB / MySQL
- **API**: RESTful JSON API

## 📱 Browser-Kompatibilität

- Chrome/Edge (empfohlen)
- Firefox
- Safari
- Mobile Browser (iOS Safari, Chrome Mobile)

## 🔧 Entwicklung lokal

Für lokale Entwicklung benötigst du:

1. **PHP** (Version 7.4 oder höher)
2. **MySQL/MariaDB**
3. Einen lokalen Webserver (z.B. XAMPP, MAMP, oder PHP Built-in Server)

### Mit PHP Built-in Server:

```bash
cd /Users/andynope/Documents/voci-trainer
php -S localhost:8000
```

Dann öffne: `http://localhost:8000`

### Mit XAMPP/MAMP:

1. Kopiere den Ordner nach `htdocs` (XAMPP) oder `Applications/MAMP/htdocs` (MAMP)
2. Starte Apache und MySQL
3. Importiere `database/schema.sql`
4. Öffne: `http://localhost/voci-trainer`

## 📊 Datenbankstruktur

Die App verwendet folgende Tabellen:

- `languages` - Verfügbare Sprachen
- `user_settings` - Benutzereinstellungen (Hauptsprache)
- `voci_sets` - Vokabel-Sets
- `vocabularies` - Einzelne Vokabeln
- `learning_progress` - Lernfortschritt
- `learning_sessions` - Lernsitzungen

## 🐛 Fehlerbehebung

### Verbindungsfehler zur Datenbank

- Überprüfe die Zugangsdaten in `api/config.php`
- Stelle sicher, dass MySQL läuft
- Prüfe, ob der Benutzer `vocitrainer` existiert und Rechte hat

### API-Fehler

- Öffne die Browser-Konsole (F12) für Details
- Prüfe die PHP-Fehler in den Logs
- Stelle sicher, dass PHP >= 7.4 installiert ist

### Leere Seite

- Prüfe, ob `index.html` korrekt geladen wird
- Öffne die Browser-Konsole für JavaScript-Fehler
- Stelle sicher, dass alle Dateien hochgeladen wurden

## 📝 Lizenz

Dieses Projekt ist frei verwendbar für persönliche und kommerzielle Zwecke.

## 🎉 Viel Erfolg beim Vokabeln lernen!
