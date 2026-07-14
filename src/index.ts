/** A property name, or a function deriving the value to key/sort on. */
export type Key<T> = keyof T | ((item: T) => unknown);

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
 * an Invalid Date — whose getTime() is NaN — can never return NaN from the comparator, which would
 * sort arbitrarily.
 */
function isNil(value: unknown): boolean {
  return (
    value === null || value === undefined || (typeof value === 'number' && Number.isNaN(value))
  );
}

/**
 * Nils sort last ascending, and `desc` simply negates that, so they lead a descending sort. That is
 * plain negation, and it matches Postgres's default NULLS LAST / NULLS FIRST behavior.
 */
function compare(a: unknown, b: unknown): number {
  const x = normalize(a);
  const y = normalize(b);

  const xNil = isNil(x);
  const yNil = isNil(y);

  if (xNil || yNil) return xNil && yNil ? 0 : xNil ? 1 : -1;

  if (typeof x === 'number' && typeof y === 'number') return x - y;
  if (typeof x === 'string' && typeof y === 'string') return x.localeCompare(y);

  // Mixed or exotic types: stringify. Deliberately last, so it cannot swallow the cases above.
  return String(x).localeCompare(String(y));
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
 */
export function orderBy<T>(arr: T[], keys: Key<T>[], directions: ('asc' | 'desc')[] = []): T[] {
  return arr.toSorted((a: T, b: T) => {
    for (let i = 0; i < keys.length; i++) {
      const result = compare(select(a, keys[i]), select(b, keys[i]));

      if (result !== 0) {
        return directions[i] === 'desc' ? -result : result;
      }
    }

    return 0;
  });
}
