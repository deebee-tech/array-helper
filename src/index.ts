/** A property name, or a function deriving the value to key/sort on. */
export type Key<T> = keyof T | ((item: T) => unknown);

/** Options refining how {@link orderBy} compares values. Both are additive; the defaults are the
 * behavior orderBy has always had.
 */
export interface OrderByOptions {
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

/** `keyof T` is always a string, number, or symbol — never a function — so this discriminates cleanly. */
function select<T>(item: T, key: Key<T>): unknown {
  return typeof key === 'function' ? key(item) : item[key];
}

/** Dates compare as epoch ms and booleans as 0/1, so both sort as the primitives they stand for. */
function normalize(value: unknown): unknown {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'boolean') return value ? 1 : 0;

  return value;
}

/**
 * Nullish values and NaN have no meaningful position in an ordering. NaN is folded in here so that
 * an Invalid Date — whose getTime() is NaN — ranks with the nils instead of comparing equal to
 * every value, which is what a NaN out of the comparator would mean.
 */
function isNil(value: unknown): boolean {
  return (
    value === null || value === undefined || (typeof value === 'number' && Number.isNaN(value))
  );
}

/** Codepoint order is a total order fixed by the string itself, which is what `locale: false` buys:
 * a result that cannot vary with the machine's ICU data.
 */
function compareStrings(x: string, y: string, locale: boolean): number {
  if (locale) return x.localeCompare(y);

  return x < y ? -1 : x > y ? 1 : 0;
}

/**
 * A nil is ranked either above every value or below every value, and `desc` negates that along with
 * everything else — so the placement is stated for an ascending sort and descending falls out of
 * plain negation, which is how the SQL dialects arrive at their own defaults.
 */
function compare(a: unknown, b: unknown, options: Required<OrderByOptions>): number {
  const x = normalize(a);
  const y = normalize(b);

  const xNil = isNil(x);
  const yNil = isNil(y);

  if (xNil || yNil) {
    const nil = options.nulls === 'first' ? -1 : 1;

    return xNil && yNil ? 0 : xNil ? nil : -nil;
  }

  // Not `x - y`: Infinity - Infinity is NaN, and a NaN here reads as `result !== 0` in orderBy's
  // key loop, which would return early and drop every remaining tiebreak key.
  if (typeof x === 'number' && typeof y === 'number') return x < y ? -1 : x > y ? 1 : 0;
  if (typeof x === 'string' && typeof y === 'string') return compareStrings(x, y, options.locale);

  // Mixed or exotic types: stringify. Deliberately last, so it cannot swallow the cases above.
  return compareStrings(String(x), String(y), options.locale);
}

/**
 * Return the array without its nullish entries, narrowing `(T | null | undefined)[]` to `T[]` —
 * the narrowing `filter(Boolean)` still does not give you.
 *
 * Only `null` and `undefined` are dropped. `0`, `''`, `false`, and `NaN` are **kept**: dropping
 * every falsy value is a different operation with a different set of callers, and folding the two
 * together would silently discard the zeroes and empty strings someone meant to keep.
 */
export function compact<T>(arr: readonly (T | null | undefined)[]): T[] {
  // Not `isNil`, which folds NaN in for the sake of the comparator. NaN is a value; it stays.
  return arr.filter((item): item is T => item !== null && item !== undefined);
}

/**
 * Return the unique values in an array, optionally deduplicated by a key or a derived value.
 * The first occurrence of each distinct value wins.
 */
export function uniqBy<T>(arr: T[], key?: Key<T>): T[] {
  if (key === undefined || key === null) {
    return [...new Set(arr)];
  }

  const seen = new Map<unknown, T>();

  for (const item of arr) {
    const val = select(item, key);

    if (!seen.has(val)) {
      seen.set(val, item);
    }
  }

  return [...seen.values()];
}

/**
 * Sort an array by multiple keys and directions, returning a new array without mutating the
 * original. Each key is a property name or a function deriving the value to sort on, and directions
 * default to `"asc"`. Numbers, strings, booleans, and Dates each compare as themselves; nullish
 * values sort last ascending.
 *
 * `options` refines the two comparisons that have no single right answer — see
 * {@link OrderByOptions} — leaving both alone to keep the sort as it was.
 */
export function orderBy<T>(
  arr: T[],
  keys: Key<T>[],
  directions: ('asc' | 'desc')[] = [],
  options: OrderByOptions = {},
): T[] {
  const resolved: Required<OrderByOptions> = {
    nulls: options.nulls ?? 'last',
    locale: options.locale ?? true,
  };

  return arr.toSorted((a: T, b: T) => {
    for (let i = 0; i < keys.length; i++) {
      const result = compare(select(a, keys[i]), select(b, keys[i]), resolved);

      if (result !== 0) {
        return directions[i] === 'desc' ? -result : result;
      }
    }

    return 0;
  });
}
