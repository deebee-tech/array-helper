//#region src/index.d.ts
/** Return the unique values in an array, optionally deduplicated by a specific key. */
declare function uniqBy<T>(arr: T[], key?: keyof T): T[];
/** Sort an array by multiple keys and directions, returning a new array without mutating the original. */
declare function orderBy<T>(arr: T[], keys: (keyof T)[], directions: ("asc" | "desc")[]): T[];
//#endregion
export { orderBy, uniqBy };
//# sourceMappingURL=index.d.mts.map