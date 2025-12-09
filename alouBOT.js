const mineflayer = require("./plugins/mineflayer");
const fs = require('fs');
const vec3 = require('./plugins/vec3');
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const { GoalNear, GoalBlock, GoalXZ, GoalY, GoalInvert, GoalFollow } = goals;
const toolPlugin = require("./plugins/mineflayer-tool").plugin;
const pvp = require("./plugins/mineflayer-pvp").plugin;
const autoeat = require("./plugins/mineflayer-auto-eat");
const scaffold = require("./plugins/mineflayer-scaffold");
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

const owner = process.argv[2] || process.argv[3] || config['OWNER'];
const host = config['IP'];
const port = Number(config['PORT']) || 25565;
let quiet = config['QuietMODE'];
// Optional runtime configuration with sensible defaults
config.TUNNEL = Object.assign({
    maxLength: 100,
    eatThreshold: 6,
    stopOnLiquid: true
}, config.TUNNEL || {});

config.SWIM = Object.assign({
    boost: true
}, config.SWIM || {});

// Validate configuration
function validateConfig() {
    const q = String(quiet).toLowerCase();
    const validQuietModes = ['y', 'yes', 'true', 'n', 'no', 'false'];

    if (!validQuietModes.includes(q)) {
        console.error('Invalid QuietMODE value. Use: Y/Yes/yes/true or N/No/no/false');
        process.exit(1);
    }
    // normalize quiet for later use
    quiet = q;
    
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
let hostileSet = new Set();

// Initialize bot on spawn
bot.once('spawn', () => {
    bot.loadPlugin(pathfinder);
    bot.loadPlugin(pvp);
    bot.loadPlugin(scaffold);
    bot.loadPlugin(autoeat);
    bot.loadPlugin(toolPlugin);
    bot.loadPlugin(armorManager);
    
    mcData = require('minecraft-data')(bot.version);
    // build a hostile entity name set from mcData where possible
    try {
        const entitiesByName = mcData.entitiesByName || {};
        const heuristics = /zombie|skeleton|creeper|spider|witch|blaze|ghast|slime|enderman|silverfish|guardian|shulker|vex|vindicator|evoker|pillager|hoglin|piglin|phantom|wither|ender_dragon/i;
        for (const name of Object.keys(entitiesByName)) {
            const key = String(name).toLowerCase();
            const info = entitiesByName[name] || {};
            // Heuristic checks: known hostile names or type fields if available
            if (heuristics.test(key)) {
                hostileSet.add(key);
                continue;
            }
            // Some mcData entries include 'type' or 'hostile' metadata; try those
            if (info && (info.type === 'monster' || info.hostile || info.isHostile)) {
                hostileSet.add(key);
            }
        }
        console.log(`Hostile set built from mcData: ${hostileSet.size} entries`);
    } catch (e) {
        console.error('Failed to build hostile set from mcData:', e && e.message ? e.message : e);
    }
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
    // Hostile detection using mcData-built set (fall back to entity.name)
    const hostileMob = bot.nearestEntity(entity => {
        try {
            if (!entity || !entity.type || !entity.position) return false;
            if (entity.type !== 'mob') return false;
            const name = (entity.name || '').toLowerCase();
            if (!name) return false;
            // prefer mcData-derived hostileSet, otherwise try name match
            if (hostileSet.size > 0) {
                if (!hostileSet.has(name)) return false;
            } else {
                // fallback heuristic
                if (!/zombie|skeleton|creeper|spider|witch|blaze|ghast|slime|enderman|silverfish/.test(name)) return false;
            }
            return entity.position.distanceTo(bot.entity.position) < 16;
        } catch (e) {
            return false;
        }
    });

    if (hostileMob) {
        try {
            bot.pvp.attack(hostileMob);
        } catch (e) {
            console.error('PVP attack error:', e.message);
        }
    }
}, 500);

// Auto-eat monitoring
setInterval(() => {
    try {
        const auto = bot.autoEat;
        if (!auto) return;
        if (bot.food < 14 && !auto.isEating) {
            auto.eat().catch(err => console.error('Auto-eat error:', err && err.message ? err.message : err));
        }
    } catch (err) {
        console.error('Auto-eat check failed:', err && err.message ? err.message : err);
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
    const dirName = String(direction).toLowerCase();
    // Direction forward vectors (x, z)
    const forwardMap = {
        north: { x: 0, z: -1 },
        south: { x: 0, z: 1 },
        east: { x: 1, z: 0 },
        west: { x: -1, z: 0 }
    };

    const dir = forwardMap[dirName];
    if (!dir) {
        sendMessage("Invalid direction! Use: north, south, east, west");
        isTunneling = false;
        return;
    }
    
    sendMessage(`Starting 4x4 tunnel ${direction} for ${length} blocks...`);
    
    try {
        // compute right vector (perpendicular in XZ plane)
        const right = { x: -dir.z, z: dir.x };
        const maxLen = Math.min(length, config.TUNNEL.maxLength || 100);

        for (let step = 0; step < maxLen; step++) {
            // For each column in the 4x4 (width x height)
            for (let h = 0; h < 4; h++) {
                for (let w = -1; w <= 2; w++) {
                    const bx = Math.round(startPos.x) + dir.x * step + right.x * w;
                    const by = Math.round(startPos.y) + h;
                    const bz = Math.round(startPos.z) + dir.z * step + right.z * w;
                    const blockPos = vec3(bx, by, bz);
                    const block = bot.blockAt(blockPos);
                    if (!block) continue;
                    const name = (block.name || '').toLowerCase();
                    // stop on lava/water if configured
                    if (config.TUNNEL.stopOnLiquid && (name.includes('lava') || name.includes('water'))) {
                        sendMessage(`Stopping tunnel: detected liquid (${name}) at ${bx},${by},${bz}`);
                        isTunneling = false;
                        return;
                    }
                    if (name !== 'air') {
                        // dig if possible
                        try {
                            if (typeof bot.canDigBlock === 'function') {
                                if (bot.canDigBlock(block)) await bot.dig(block);
                            } else {
                                await bot.dig(block);
                            }
                        } catch (e) {
                            console.error('Dig error:', e && e.message ? e.message : e);
                        }
                    }
                }
            }

            // Move forward one block safely
            const nextX = Math.round(startPos.x) + dir.x * (step + 1);
            const nextZ = Math.round(startPos.z) + dir.z * (step + 1);
            const nextY = Math.round(startPos.y);
            try {
                await bot.pathfinder.goto(new GoalBlock(nextX, nextY, nextZ));
            } catch (e) {
                console.error('Path to next tunnel step failed:', e && e.message ? e.message : e);
            }

            // Eat if low on food
            if (bot.food < (config.TUNNEL.eatThreshold || 6)) {
                try {
                    if (bot.autoEat && !bot.autoEat.isEating) {
                        await bot.autoEat.eat();
                    }
                } catch (e) {
                    console.error('Tunnel auto-eat failed:', e && e.message ? e.message : e);
                }
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
    const isQuiet = ['true', 'y', 'yes', '1'].includes(String(quiet));
    if (isQuiet) {
        console.log(msg);
    } else {
        if (bot && bot.chat) bot.chat(msg);
        else console.log(msg);
    }
}

// Swim boost: when in water, try to swim faster by holding forward and jump
let swimActive = false;
setInterval(() => {
    try {
        if (!config.SWIM || !config.SWIM.boost) {
            if (swimActive) {
                bot.setControlState('forward', false);
                bot.setControlState('jump', false);
                swimActive = false;
            }
            return;
        }
        const pos = bot.entity && bot.entity.position;
        if (!pos) return;
        const block = bot.blockAt(pos);
        const inWater = block && String(block.name).toLowerCase().includes('water');
        if (inWater) {
            // engage swim controls
            bot.setControlState('forward', true);
            bot.setControlState('jump', true);
            swimActive = true;
        } else if (swimActive) {
            bot.setControlState('forward', false);
            bot.setControlState('jump', false);
            swimActive = false;
        }
    } catch (e) {
        // non-fatal
    }
}, 500);

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