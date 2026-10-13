# 🤖 alouBOT

A lightweight, configurable Minecraft bot built on Mineflayer. alouBOT supports pathfinding, simple combat, auto-eating, inventory helpers, and an automated 4x4 tunnel command. This README includes an English section followed by a Greek translation.

![Minecraft Version](https://img.shields.io/badge/Minecraft-1.12--1.20-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-14%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## English

### Features

- Pathfinding: navigate to coordinates, follow players, or come on command
- Combat helpers: attack hostiles, auto-equip weapons/shields
- Guard mode: defend a position against mobs
- Auto-eat: automatically consume food when hungry
- 4x4 Tunnel: dig a 4-wide × 4-high tunnel in a cardinal direction
- Inventory utilities: list items, auto-equip
- Owner-only commands for secure control

### Prerequisites

- Node.js 14 or later
- A Minecraft Java server (compatible versions noted in the project)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/alouBOT.git
cd alouBOT
```

2. Install dependencies

```bash
npm install
```

3. Configure the bot

Edit `config.json` (example):

```json
{
  "IP": "your.server.ip",
  "PORT": "25565",
  "OWNER": "YourMinecraftUsername",
  "PASSWORD": "optional_password",
  "QuietMODE": "false"
}
```

4. Run the bot

```bash
node alouBOT.js
```

### Windows helper scripts (.bat)

This repository includes two convenience batch scripts for Windows users in the project root:

- `installing npm depentances.bat` — runs `npm install` for you. Use this if you prefer a double-click installer or if you want to run the same across machines without typing the command manually.
- `start_alouBOT.bat` — starts the bot with `node alouBOT.js`. You can double-click this file or run it from PowerShell / Command Prompt.

How to use these safely:

1. Open a PowerShell window in the project folder (or right-click the folder and choose *Open in Terminal*).

```powershell
.
"installing npm depentances.bat"
-- or --
./"start_alouBOT.bat"
```

2. If PowerShell refuses to run the scripts due to execution policy, you can run the commands directly:

```powershell
npm install
node alouBOT.js
```

Notes

- The batch files are convenience helpers. Inspect them before running if you're not sure what they do.
- If you prefer, run the commands directly in PowerShell or use the provided `.bat` files for quick start.

### Commands (owner only)

- `_come` — come to the owner
- `_goto <x> <y> <z>` — move to coordinates
- `_follow` — follow the owner
- `_stop` — stop current actions
- `_guard` — guard current area
- `_attack hostiles` — attack nearby hostile mobs
- `_attack <player>` — attack a specific player
- `_tunnel <dir> <length>` — dig a 4x4 tunnel (dir: north|south|east|west)
- `_list` — list inventory items
- `_tp` — teleport bot to owner (server must support)
- `_health` — show health and food
- `_help` — show commands

Example: `_tunnel north 50`

### Configuration notes

- `QuietMODE`: when `true`, bot output is logged to console only; when `false`, bot will chat in-game.
- Auto-eat threshold and banned foods are configurable in the bot code.

### Advanced: 4x4 Tunnel

- Creates a 4-block wide and 4-block tall tunnel in a cardinal direction.
- The tunnel command will attempt to eat when low on food and avoid dangerous blocks where possible.
- Usage: `_tunnel north 100` (maximum practical lengths depend on server and environment).

### Troubleshooting

- If the bot cannot connect, verify `IP`/`PORT` and server settings.
- Make sure the `OWNER` name matches your in-game username.
- If commands don't work, check chat permissions and `QuietMODE`.

---

## Ελληνικά (Greek)

### Χαρακτηριστικά

- Πλοήγηση: μετακίνηση σε συντεταγμένες, ακολουθία παικτών, κλήση με εντολή
- Βοηθήματα μάχης: επίθεση σε εχθρικά όντα, αυτόματος εξοπλισμός όπλων/ασπίδας
- Λειτουργία φρουράς: υπεράσπιση περιοχής από εχθρικά όντα
- Αυτόματο φαγητό: καταναλώνει φαγητό όταν λιγοστεύει η πείνα
- Σήραγγα 4x4: σκάψιμο σήραγγας 4πλάτος × 4ύψος σε καρδινάλια κατεύθυνση
- Διαχείριση αποσκευών: λίστα αντικειμένων, αυτόματος εξοπλισμός
- Εντολές μόνο για τον κάτοχο (owner)

### Προαπαιτούμενα

- Node.js 14 ή νεότερο
- Διακομιστής Minecraft Java (η έκδοση πρέπει να είναι συμβατή)

### Εγκατάσταση

1. Κλωνοποίηση αποθετηρίου

```bash
git clone https://github.com/yourusername/alouBOT.git
cd alouBOT
```

2. Εγκατάσταση εξαρτήσεων

```bash
npm install
```

3. Ρύθμιση `config.json` (παράδειγμα):

```json
{
  "IP": "your.server.ip",
  "PORT": "25565",
  "OWNER": "YourMinecraftUsername",
  "PASSWORD": "optional_password",
  "QuietMODE": "false"
}
```

4. Εκτέλεση bot

```bash
node alouBOT.js
```

### Εντολές (μόνο για τον κάτοχο)

- `_come` — έλα κοντά στον κάτοχο
- `_goto <x> <y> <z>` — πήγαινε σε συντεταγμένες
- `_follow` — ακολούθησε τον κάτοχο
- `_stop` — σταμάτα τις ενέργειες
- `_guard` — φύλαξε την τρέχουσα περιοχή
- `_attack hostiles` — επίθεση σε κοντινά εχθρικά όντα
- `_attack <player>` — επίθεση σε συγκεκριμένο παίκτη
- `_tunnel <dir> <length>` — σκάψε σήραγγα 4x4 (dir: north|south|east|west)
- `_list` — λίστα αντικειμένων
- `_tp` — τηλεμεταφορά bot στον κάτοχο (αν υποστηρίζεται)
- `_health` — εμφάνιση υγείας και πείνας
- `_help` — εμφάνιση εντολών

### Σημειώσεις ρυθμίσεων

- `QuietMODE`: `true` → μόνο κονσόλα, `false` → συνομιλία στο παιχνίδι.
- Η στάθμη αυτόματου φαγητού και τα αποκλεισμένα φαγητά ρυθμίζονται μέσα στον κώδικα του bot.

### Σφάλματα & Επίλυση

- Εάν το bot δεν συνδέεται, ελέγξτε `IP`/`PORT` και τις ρυθμίσεις του server.
- Βεβαιωθείτε ότι το `OWNER` είναι το όνομα χρήστη σας στο παιχνίδι.
- Αν οι εντολές δεν δουλεύουν, ελέγξτε τα δικαιώματα συνομιλίας και το `QuietMODE`.







