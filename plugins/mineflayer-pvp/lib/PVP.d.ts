import { Bot } from "mineflayer";
import { Movements } from "mineflayer-pathfinder";
import { Entity } from "prismarine-entity";
import { TimingSolver } from "./TimingSolver";
/**
 * The main pvp manager plugin class.
 */
export declare class PVP {
    private readonly bot;
    private timeToNextAttack;
    private wasInRange;
    /**
     * The current target. This value should never be assigned to from outside the plugin.
     */
    target?: Entity;
    /**
     * The movements object to pass to pathfinder when creating the follow entity goal. Assign
     * to null in order to avoid passing any movement config to pathfinder. (If you plan on using
     * your own)
     */
    movements?: Movements;
    /**
     * How close the bot will attempt to get to the target when when pursuing it.
     */
    followRange: number;
    /**
     * How far away the target entity must be to lose the target. Target entities further than this
     * distance from the bot will be considered defeated.
     */
    viewDistance: number;
    /**
     * How close must the bot be to the target in order to try attacking it.
     */
    attackRange: number;
    /**
     * The timing solver to use when deciding how long to wait before preforming another attack
     * after finishing an attack.
     *
     * // TODO Check for 'hasAtttackCooldown' feature. If feature not present, default to RandomTicks solver.
     */
    meleeAttackRate: TimingSolver;
    /**
     * Creates a new instance of the PVP plugin.
     *
     * @param bot - The bot this plugin is being attached to.
     */
    constructor(bot: Bot);
    /**
     * Causes the bot to begin attacking an entity until it is killed or told to stop.
     *
     * @param target - The target to attack.
     */
    attack(target: Entity): void;
    /**
     * Stops attacking the current entity.
     */
    stop(): void;
    /**
     * Called each tick to update attack timers.
     */
    private update;
    /**
     * Updates whether the bot is in attack range of the target or not.
     */
    private checkRange;
    /**
     * Attempts to preform an attack on the target.
     */
    private attemptAttack;
    /**
     * Check if the bot currently has a shield equipped.
     */
    private hasShield;
}
