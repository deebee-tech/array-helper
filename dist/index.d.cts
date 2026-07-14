//#region src/index.d.ts
/** A property name, or a function deriving the value to key/sort on. */
type Key<T> = keyof T | ((item: T) => unknown);
/** Options refining how {@link orderBy} compares values. Both are additive; the defaults are the
 * behavior orderBy has always had.
 */
interface OrderByOptions {
  /**
   * Where nullish values land in an *ascending* sort. `"desc"` negates it, exactly as it negates
   * every other comparison, so `"last"` reproduces Postgres (NULLS LAST ascending, first
   * descending) and `"first"` reproduces MSSQL and SQLite, which rank a null below every value.
   * A dialect-agnostic sort has to be able to say which. Defaults to `"last"`.
   */
  nulls?: 'first' | 'last';
  /**
   * Whether strings compare with `localeCompare`. Set `false` to compare by codepoint instead.
   * `localeCompare` is ICU- and locale-dependent, so the same two strings can order differently on
   * two machines — fine for display, wrong for a canonicalizing sort whose output feeds a hash, a
   * deep-equality check, or URL state, where a reshuffle reads as a change that never happened.
   * Defaults to `true`.
   */
  locale?: boolean;
}
/**
 * Return the array without its nullish entries, narrowing `(T | null | undefined)[]` to `T[]` —
 * the narrowing `filter(Boolean)` still does not give you.
 *
 * Only `null` and `undefined` are dropped. `0`, `''`, `false`, and `NaN` are **kept**: dropping
 * every falsy value is a different operation with a different set of callers, and folding the two
 * together would silently discard the zeroes and empty strings someone meant to keep.
 */
declare function compact<T>(arr: readonly (T | null | undefined)[]): T[];
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
 *
 * `options` refines the two comparisons that have no single right answer — see
 * {@link OrderByOptions} — leaving both alone to keep the sort as it was.
 */
declare function orderBy<T>(arr: T[], keys: Key<T>[], directions?: ('asc' | 'desc')[], options?: OrderByOptions): T[];
//#endregion
export { Key, OrderByOptions, compact, orderBy, uniqBy };
//# sourceMappingURL=index.d.cts.map