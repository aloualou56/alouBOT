# 🤖 alouBOT - Minecraft Bot

A Minecraft bot built with Mineflayer that can follow, guard, fight, mine, and more!

![Minecraft Version](https://img.shields.io/badge/Minecraft-1.12--1.20-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-14%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🎯 **Pathfinding** - Navigate to coordinates or follow players
- ⚔️ **Combat System** - Attack hostile mobs and players
- 🛡️ **Auto-Guard** - Protect areas from hostile mobs
- 🍖 **Auto-Eat** - Automatically consume food when hungry
- ⛏️ **4x4 Tunnel Digging** - Automated mining tunnels
- 🎒 **Inventory Management** - Auto-equip weapons and armor
- 🚫 **Mob Avoidance** - Smart hostile mob detection
- 👤 **Owner-Only Commands** - Secure command system

## 📋 Prerequisites

- Node.js 14.x or higher
- A Minecraft Java Edition server (1.12-1.20)
- Basic knowledge of JSON configuration

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/alouBOT.git
cd alouBOT
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure the bot**

Edit `config.json`:
```json
{
  "IP": "your.server.ip",
  "PORT": "25565",
  "OWNER": "YourMinecraftUsername",
  "PASSWORD": "your_server_password",
  "QuietMODE": "false"
}
```

4. **Run the bot**
```bash
node alouBOT.js
```

## 🎮 Commands

All commands require you to be the configured owner.

### Movement Commands
| Command | Description | Example |
|---------|-------------|---------|
| `_come` | Bot comes to your position | `_come` |
| `_goto <x> <y> <z>` | Go to coordinates | `_goto 100 64 200` |
| `_follow` | Follow you around | `_follow` |
| `_stop` | Stop all activities | `_stop` |

### Combat Commands
| Command | Description | Example |
|---------|-------------|---------|
| `_guard` | Guard current area from mobs | `_guard` |
| `_attack hostiles` | Attack nearby hostile mobs | `_attack hostiles` |
| `_attack <player>` | Attack specific player | `_attack Steve` |

### Mining Commands
| Command | Description | Example |
|---------|-------------|---------|
| `_tunnel <dir> <length>` | Dig 4x4 tunnel | `_tunnel north 50` |

Directions: `north`, `south`, `east`, `west`

### Utility Commands
| Command | Description | Example |
|---------|-------------|---------|
| `_list` | Show inventory | `_list` |
| `_tp` | Teleport bot to you | `_tp` |
| `_health` | Show health and food | `_health` |
| `_help` | Show command list | `_help` |

## ⚙️ Configuration Options

### config.json

```json
{
  "IP": "localhost",          // Server IP address
  "PORT": "25565",            // Server port
  "OWNER": "PlayerName",      // Your Minecraft username
  "PASSWORD": "1234567890",   // Server login password (optional)
  "QuietMODE": "false"        // true: console only, false: in-game chat
}
```

### Auto-Eat Settings

The bot automatically eats when hunger drops below 14/20. Banned foods:
- Rotten Flesh
- Spider Eye
- Poisonous Potato

## 🛠️ Advanced Features

### 4x4 Tunnel System
Creates a 4-block wide, 4-block tall tunnel in any cardinal direction:
```
_tunnel north 100
```
- Automatically digs blocks
- Avoids lava and dangerous blocks
- Eats when hungry during digging
- Can dig up to 100 blocks in one command

### Mob Avoidance
- Detects hostile mobs within 16 blocks
- Attacks only when `_attack hostiles` is active
- Automatically stops attacking when guarding position

### Smart Combat
- Auto-equips best sword
- Auto-equips shield in off-hand
- Targets nearest hostile mob
- Returns to guard position after combat

## 🐛 Troubleshooting

### Bot won't connect
- Check `IP` and `PORT` in config.json
- Ensure server allows bots
- Verify Minecraft version compatibility

### Commands not working
- Confirm you're set as `OWNER` in config.json
- Check server chat permissions
- Try QuietMODE for console-only output

### Bot keeps dying
- Ensure auto-eat has food in inventory
- Check for lava/dangerous areas
- Use `_stop` before dangerous operations

## 📝 Development

### Project Structure
```
alouBOT/
├── alouBOT.js          # Main bot file
├── config.json         # Configuration
├── inventory.js        # Inventory management
├── plugins/            # Mineflayer plugins
└── README.md          # This file
```

### Adding Custom Commands

```javascript
case '_mycommand':
    // Your command logic here
    sendMessage("Command executed!");
    break;
```






