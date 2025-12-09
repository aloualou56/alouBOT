const mineflayer = require("./plugins/mineflayer");
const fs = require('fs');
const vec3 = require('./plugins/vec3');
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const { GoalNear, GoalBlock, GoalXZ, GoalY, GoalInvert, GoalFollow } = goals;
const toolPlugin = require("./plugins/mineflayer-tool").plugin;
const pvp = require("./plugins/mineflayer-pvp").plugin;
const autoeat = require("./plugins/mineflayer-auto-eat");
const scanffold = require("./plugins/mineflayer-scaffold");
const armorManager = require("./plugins/mineflayer-armor-manager");
const Inventory = require("./inventory");

// Load configuration
let config;
try {
    const rawdata = fs.readFileSync('config.json');
    config = JSON.parse(rawdata);
} catch (error) {
    console.error('Error loading config.json:', error.message);
    process.exit(1);
}

const owner = process.argv[3] || config['OWNER'];
const host = config['IP'];
const port = config['PORT'];
const quiet = config['QuietMODE'];

// Validate configuration
function validateConfig() {
    const validQuietModes = ['Y', 'Yes', 'yes', 'true', 'N', 'No', 'no', 'Nope', 'false'];
    
    if (!validQuietModes.includes(quiet)) {
        console.error('Invalid QuietMODE value. Use: Y/Yes/yes/true or N/No/no/Nope/false');
        process.exit(1);
    }
    
    if (!host) {
        console.error('Please enter a server IP in config.json');
        process.exit(1);
    }
    
    if (!port) {
        console.error('Please enter a valid port in config.json (default: 25565)');
        process.exit(1);
    }
    
    if (!owner) {
        console.error('Please enter the owner\'s name in config.json');
        process.exit(1);
    }
    
    console.log('✓ Configuration validated successfully');
}

validateConfig();

// Create bot instance
const bot = mineflayer.createBot({
    username: "alouBOT",
    host: host,
    port: port
});

const inventory = new Inventory({ bot });

// Bot state
let isAttackingMobs = false;
let guardPos = null;
let isTunneling = false;
let mcData;
let defaultMove;

// Initialize bot on spawn
bot.once('spawn', () => {
    bot.loadPlugin(pathfinder);
    bot.loadPlugin(pvp);
    bot.loadPlugin(scanffold);
    bot.loadPlugin(autoeat);
    bot.loadPlugin(toolPlugin);
    bot.loadPlugin(armorManager);
    
    mcData = require('minecraft-data')(bot.version);
    defaultMove = new Movements(bot, mcData);
    defaultMove.canDig = false;
    defaultMove.allow1by1towers = false;
    bot.pathfinder.setMovements(defaultMove);
    
    // Configure auto-eat
    bot.autoEat.options = {
        priority: 'foodPoints',
        startAt: 14,
        bannedFood: ['rotten_flesh', 'spider_eye', 'poisonous_potato']
    };
    
    console.log('✓ Bot connected and plugins loaded');
    bot.settings.viewDistance = 'normal';
});

// Auto-login (if configured)
bot.once('spawn', () => {
    if (config.PASSWORD) {
        bot.chat(`/login ${config.PASSWORD}`);
    }
});

// Event handlers
bot.on("kicked", (reason) => {
    console.error("Bot was kicked:", reason);
});

bot.on("error", (err) => {
    console.error("Bot error:", err);
});

bot.on("death", () => {
    console.log("Bot died!");
    isAttackingMobs = false;
    guardPos = null;
    isTunneling = false;
});

// Auto-equip weapons and shields
bot.on('playerCollect', (collector, itemDrop) => {
    if (collector !== bot.entity) return;
    
    setTimeout(() => {
        const sword = bot.inventory.items().find(item => item.name.includes('sword'));
        if (sword) bot.equip(sword, 'hand').catch(console.error);
    }, 150);
    
    setTimeout(() => {
        const shield = bot.inventory.items().find(item => item.name.includes('shield'));
        if (shield) bot.equip(shield, 'off-hand').catch(console.error);
    }, 250);
});

// Combat system with mob avoidance
setInterval(() => {
    if (!isAttackingMobs || isTunneling) return;
    
    const hostileMob = bot.nearestEntity(entity => {
        return entity.type === 'mob' && 
               entity.kind === 'Hostile mobs' &&
               entity.position.distanceTo(bot.entity.position) < 16;
    });
    
    if (hostileMob) {
        bot.pvp.attack(hostileMob);
    }
}, 500);

// Auto-eat monitoring
setInterval(() => {
    if (bot.food < 14 && !bot.autoEat.isEating) {
        bot.autoEat.eat().catch(err => {
            console.error('Auto-eat error:', err.message);
        });
    }
}, 1000);

// Guard area functionality
function guardArea(pos) {
    guardPos = pos.clone();
    isAttackingMobs = true;
    
    if (!bot.pvp.target) {
        moveToGuardPos();
    }
}

function stopGuarding() {
    guardPos = null;
    isAttackingMobs = false;
    bot.pvp.stop();
    bot.pathfinder.setGoal(null);
}

function moveToGuardPos() {
    if (!guardPos) return;
    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(new GoalBlock(guardPos.x, guardPos.y, guardPos.z));
}

bot.on('stoppedAttacking', () => {
    if (guardPos) {
        moveToGuardPos();
    }
});

// 4x4 Tunnel digging
async function dig4x4Tunnel(direction, length) {
    isTunneling = true;
    const startPos = bot.entity.position.clone();
    
    // Direction vectors
    const directions = {
        north: { x: 0, z: -1 },
        south: { x: 0, z: 1 },
        east: { x: 1, z: 0 },
        west: { x: -1, z: 0 }
    };
    
    const dir = directions[direction.toLowerCase()];
    if (!dir) {
        sendMessage("Invalid direction! Use: north, south, east, west");
        isTunneling = false;
        return;
    }
    
    sendMessage(`Starting 4x4 tunnel ${direction} for ${length} blocks...`);
    
    try {
        for (let l = 0; l < length; l++) {
            // Dig 4x4 section
            for (let y = 0; y < 4; y++) {
                for (let x = -1; x <= 2; x++) {
                    const blockPos = startPos.offset(
                        dir.x * l + (dir.z * x),
                        y,
                        dir.z * l + (dir.x * x)
                    );
                    
                    const block = bot.blockAt(blockPos);
                    if (block && block.name !== 'air' && bot.canDigBlock(block)) {
                        await bot.dig(block);
                    }
                }
            }
            
            // Move forward
            const nextPos = startPos.offset(dir.x * (l + 1), 0, dir.z * (l + 1));
            await bot.pathfinder.goto(new GoalBlock(nextPos.x, nextPos.y, nextPos.z));
            
            // Check food level
            if (bot.food < 6) {
                await bot.autoEat.eat();
            }
        }
        
        sendMessage(`4x4 tunnel complete! Dug ${length} blocks ${direction}.`);
    } catch (error) {
        sendMessage(`Tunnel error: ${error.message}`);
    } finally {
        isTunneling = false;
    }
}

// Utility functions
function sayItems(items = bot.inventory.items()) {
    const output = items.map(item => `${item.name} x ${item.count}`).join(', ');
    sendMessage(output || 'Inventory is empty');
}

function sendMessage(msg) {
    const isQuiet = ['true', 'Y', 'Yes', 'yes'].includes(quiet);
    if (isQuiet) {
        console.log(msg);
    } else {
        bot.chat(msg);
    }
}

// Command handler
bot.on("chat", async (username, message) => {
    if (username === bot.username) return;
    if (username !== owner) {
        console.log(`Unauthorized command from ${username}: ${message}`);
        return;
    }
    
    const args = message.split(' ');
    const command = args[0].toLowerCase();
    const target = bot.players[username]?.entity;
    
    try {
        switch (command) {
            case '_come':
                if (!target) {
                    sendMessage("I don't see you!");
                    return;
                }
                bot.pathfinder.setMovements(defaultMove);
                bot.pathfinder.setGoal(new GoalNear(target.position.x, target.position.y, target.position.z, 1));
                break;
                
            case '_goto':
                if (args.length === 4) {
                    const [_, x, y, z] = args.map(Number);
                    bot.pathfinder.setGoal(new GoalBlock(x, y, z));
                } else if (args.length === 3) {
                    const [_, x, z] = args.map(Number);
                    bot.pathfinder.setGoal(new GoalXZ(x, z));
                } else if (args.length === 2) {
                    bot.pathfinder.setGoal(new GoalY(Number(args[1])));
                }
                break;
                
            case '_follow':
                if (!target) {
                    sendMessage("I can't see you!");
                    return;
                }
                isAttackingMobs = false;
                bot.pathfinder.setGoal(new GoalFollow(target, 3), true);
                sendMessage("Following you!");
                break;
                
            case '_stop':
                stopGuarding();
                isTunneling = false;
                bot.pathfinder.setGoal(null);
                sendMessage("Stopped all activities");
                break;
                
            case '_guard':
                if (!target) {
                    sendMessage("I can't see you!");
                    return;
                }
                guardArea(target.position);
                sendMessage("Guarding this area!");
                break;
                
            case '_attack':
                if (args[1] === 'hostiles') {
                    isAttackingMobs = true;
                    sendMessage("Attacking hostile mobs!");
                } else if (args[1]) {
                    const targetPlayer = bot.players[args[1]]?.entity;
                    if (targetPlayer) {
                        bot.pvp.attack(targetPlayer);
                    }
                }
                break;
                
            case '_tunnel':
                if (args.length === 3) {
                    const direction = args[1];
                    const length = parseInt(args[2]);
                    if (length > 0 && length <= 100) {
                        await dig4x4Tunnel(direction, length);
                    } else {
                        sendMessage("Length must be between 1-100");
                    }
                } else {
                    sendMessage("Usage: _tunnel <north|south|east|west> <length>");
                }
                break;
                
            case '_list':
                sayItems();
                break;
                
            case '_tp':
                bot.chat(`/teleport ${bot.username} ${username}`);
                sendMessage(`Teleported to ${username}`);
                break;
                
            case '_health':
                sendMessage(`Health: ${bot.health}/20 | Food: ${bot.food}/20`);
                break;
                
            case '_help':
                sendMessage("Commands: _come, _goto, _follow, _stop, _guard, _attack, _tunnel, _list, _tp, _health");
                break;
        }
    } catch (error) {
        console.error(`Command error: ${error.message}`);
        sendMessage(`Error: ${error.message}`);
    }
});

// Pathfinder events
bot.on("path_update", (results) => {
    const nodesPerTick = ((results.visitedNodes * 50) / results.time).toFixed(2);
    console.log(`Path: ${results.path.length} moves | ${results.time.toFixed(2)}ms | ${nodesPerTick} nodes/tick`);
});

bot.on("goal_reached", () => {
    console.log("✓ Destination reached!");
});

console.log('alouBOT starting...');