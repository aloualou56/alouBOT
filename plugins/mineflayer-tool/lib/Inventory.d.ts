import { Bot } from 'mineflayer';
import { Vec3 } from 'vec3';
import { Callback } from './Tool';
import { Item } from 'prismarine-item';
/**
 * A standard tool filter that returns true for all tools and false
 * for everything else.
 *
 * @param item - The item to test against.
 */
export declare function standardToolFilter(item: Item): boolean;
/**
 * Options for configuring how to select what chests to go to to retrieve items.
 */
export interface ToolRetrievalOptions {
    /**
     * An array of all chest locations to check for in order to retrieve tools from.
     */
    chestLocations: Vec3[];
    /**
     * Gets the tool filter to use for determining what tools are allowed to be pulled
     * from the chest.
     */
    toolFilter: ToolFilter;
    /**
     * Gets the cost of a tool that is allowed through the filter. The tools with the
     * lowest cost are prioritized over tools with a higher cost.
     */
    toolCostFilter: ToolCostFilter;
    /**
     * Gets the maximum number of tools that can be retrieved from the chest at once.
     * If the chest contains fewer than this number (but at least 1), only those are
     * retrieved and the callback returns normally. If the chest contains more than
     * this number of tools, only this number of tools are retrieved.
     */
    maxTools?: number;
}
/**
 * A filter than can be used to filter what items are allowed to be
 * pulled out of a chest and what items can't.
 *
 * @param item - The item stack to test against.
 *
 * @returns True if the item can be pulled out of the chest. False otherwise.
 */
export declare type ToolFilter = (item: Item) => boolean;
/**
 * Gets the tool cost of an item that is allowed through the item filter.
 * This value is usually the time taken to mine a block or similar. Lower
 * values are better.
 *
 * @param item - The item stack to test against.
 *
 * @returns The cost of this item stack.
 */
export declare type ToolCostFilter = (item: Item) => number;
/**
 * Moves from chest to chest in an effort to get at least one tool that meets the given requirements.
 * Throws an error in the callback if a tool cannot be retrieved.
 *
 * @param bot - The bot.
 * @param options - The options to use when collecting tools.
 * @param cb - The callback to execute when the function has completed.
 */
export declare function retrieveTools(bot: Bot, options: ToolRetrievalOptions, cb: Callback): void;
