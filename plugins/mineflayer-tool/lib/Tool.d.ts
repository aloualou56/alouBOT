import { Bot } from 'mineflayer';
import { Block } from 'prismarine-block';
import { Vec3 } from 'vec3';
export declare type Callback = (err?: Error) => void;
export declare function error(name: string, message: string): Error;
/**
 * Options to pass to the equipForBlock function.
 */
export interface MiningEquipOptions {
    /**
     * If true, the bot will only attempt to use tools that are capable of
     * harvesting the target block. If the bot does not have any tools capable
     * of harvesting the block, an error will be thrown.
     *
     * Defaults to false.
     */
    requireHarvest?: boolean;
    /**
     * If set to true, the bot will attempt to retrieve a tool from the chest if
     * there is not a suitable tool currently in the bot's inventory.
     *
     * Defaults to false.
     */
    getFromChest?: boolean;
    /**
     * If using the `getFromChest` flag, what is the maximum number of tools allowed
     * to be pulled from the chest at once? Defaults to 1.
     */
    maxTools?: number;
}
/**
 * The main class object for the tool plugin.
 */
export declare class Tool {
    private readonly bot;
    /**
     * A list of chest locations that the bot is allowed to retrieve items from
     * when using the "getFromChest" option.
     */
    readonly chestLocations: Vec3[];
    /**
     * Creates a new tool plugin instance.
     *
     * @param bot - The bot the plugin is running on.
     */
    constructor(bot: Bot);
    /**
     * Gets the number of ticks required to mine the target block with the given item.
     *
     * @param block - The block to test against.
     * @param item - The item to test with.
     *
     * @returns The number of ticks it would take to mine.
     */
    private getDigTime;
    /**
     * Gets the item currently in the bot's hand.
     */
    private itemInHand;
    /**
     * Checks if the best item in the item list is faster than the item in
     * the bot's hand.
     *
     * @param block - The block to test against.
     * @param itemList - The item list to test against.
     *
     * @returns True if the items in the list are better. False if they are worse or
     *          equal to what's already in the bot's hand.
     */
    private isBetterMiningTool;
    /**
     * This function can be used to equip the best tool currently in the bot's
     * inventory for breaking the given block.
     *
     * @param block - The block the bot is attempting to break.
     * @param options - The options to use for equipping the correct tool.
     * @param cb - The callback.
     */
    equipForBlock(block: Block, options?: MiningEquipOptions, cb?: Callback): void;
}
