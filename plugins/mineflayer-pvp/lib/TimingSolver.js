"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxDamageOffset = exports.RandomTicks = void 0;
const Cooldown_1 = require("./Cooldown");
/**
 * A timing solver that simply return a random number of ticks between
 * a min and max value.
 */
class RandomTicks {
    constructor(min = 10, max = 20) {
        this.min = min;
        this.max = max;
    }
    /** @inheritdoc */
    getTicks() {
        const ticks = Math.floor(Math.random() * (this.max - this.min) + this.min);
        return Math.max(1, ticks);
    }
}
exports.RandomTicks = RandomTicks;
/**
 * A timing solver that tries to maximize the damage with a configurable
 * random offset. This is identical to using the RandomTicks timing solver
 * but with the weapons's default cooldown added to it.
 */
class MaxDamageOffset {
    constructor(min = -2, max = 2) {
        this.min = min;
        this.max = max;
    }
    /** @inheritdoc */
    getTicks(bot) {
        const heldItem = bot.inventory.slots[bot.getEquipmentDestSlot('hand')];
        const cooldown = Cooldown_1.getCooldown(heldItem === null || heldItem === void 0 ? void 0 : heldItem.name);
        const ticks = Math.floor(Math.random() * (this.max - this.min) + this.min) + cooldown;
        return Math.max(1, ticks);
    }
}
exports.MaxDamageOffset = MaxDamageOffset;
