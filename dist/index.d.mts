//#region src/index.d.ts
/** A property name, or a function deriving the value to key/sort on. */
type Key<T> = keyof T | ((item: T) => unknown);
/**
 * Return the unique values in an array, optionally deduplicated by a key or a derived value.
 * The first occurrence of each distinct value wins.
 */
declare function uniqBy<T>(arr: T[], key?: Key<T>): T[];
/**
 * Sort an array by multiple keys and directions, returning a new array without mutating the
 * original. Each key is a property name or a function deriving the value to sort on, and directions
 * default to `"asc"`. Numbers, strings, booleans, and Dates each compare as themselves; nullish
 * values sort last ascending.
 */
declare function orderBy<T>(arr: T[], keys: Key<T>[], directions?: ("asc" | "desc")[]): T[];
//#endregion
export { Key, orderBy, uniqBy };
//# sourceMappingURL=index.d.mts.map