/** Encapsulating class for all array-helpers.  All methods
 * below this are static so there does not need to be any
 * references to constructors.  This class is meant to be
 * used as a utility class for all helper methods dealing with
 * arrays and are mostly ports from LoDash and Underscore.
 * This class is not meant to be instantiated.
 */
declare class ArrayHelper {
    /*** Return the unique values in an array based off of a key. */
    static uniqBy<T>(arr: T[], key?: string): T[];
    /*** Take in an array of keys and orders and re-order the entire array based on that input. */
    static orderBy<T>(arr: T[], keys: string[], directions: ("asc" | "desc")[]): T[];
}

export { ArrayHelper as default };
