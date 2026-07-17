import { describe, expect, it } from 'vitest';
import { compact, orderBy, uniqBy } from '../src';

describe('compact', () => {
  it('should drop null and undefined', () => {
    const arr = [1, null, 2, undefined, 3];

    expect(compact(arr)).toEqual([1, 2, 3]);
  });

  it('should keep 0, empty string, and false, which are falsy but not nullish', () => {
    // filter(Boolean) would throw all of these away; compact is scoped to nullish only.
    expect(compact([0, null, 1])).toEqual([0, 1]);
    expect(compact(['', undefined, 'a'])).toEqual(['', 'a']);
    expect(compact([false, null, true])).toEqual([false, true]);
  });

  it('should keep NaN, which is a value even though the comparator treats it as nil', () => {
    const result = compact([NaN, null, 1]);

    expect(result).toHaveLength(2);
    expect(Number.isNaN(result[0])).toBe(true);
    expect(result[1]).toBe(1);
  });

  it('should narrow the element type, which filter(Boolean) does not', () => {
    const names: (string | null | undefined)[] = ['Jane', null, 'John', undefined];

    // Only compiles if compact returned string[] rather than (string | null | undefined)[].
    const lengths: number[] = compact(names).map((n) => n.length);

    expect(lengths).toEqual([4, 4]);
  });

  it('should accept a readonly array', () => {
    const arr: readonly (number | null)[] = [1, null, 2] as const;

    expect(compact(arr)).toEqual([1, 2]);
  });

  it('should return an empty array when every entry is nullish', () => {
    expect(compact([null, undefined])).toEqual([]);
    expect(compact([])).toEqual([]);
  });

  it('should not mutate the original array', () => {
    const arr = [1, null, 2];
    const original = [...arr];

    compact(arr);

    expect(arr).toEqual(original);
  });
});

describe('uniqBy', () => {
  it('should return unique values based on a key', () => {
    const arr = [
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ];

    const result = uniqBy(arr, 'name');

    expect(result).toEqual([
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
    ]);
  });

  it('should return unique values with no key (primitives)', () => {
    const arr = [1, 2, 3, 2, 1, 4];
    expect(uniqBy(arr)).toEqual([1, 2, 3, 4]);
  });

  it('should accept a readonly array', () => {
    const arr: readonly { n: number }[] = [{ n: 1 }, { n: 1 }, { n: 2 }];

    expect(uniqBy(arr, 'n')).toEqual([{ n: 1 }, { n: 2 }]);
  });

  it('should return all objects when no key is provided (unique references)', () => {
    const arr = [
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ];

    const result = uniqBy(arr);

    expect(result).toEqual([
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ]);
  });
});

describe('orderBy', () => {
  it('should order by keys and directions', () => {
    const arr = [
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ];

    const result = orderBy(arr, ['name', 'age'], ['asc', 'desc']);

    expect(result).toEqual([
      { name: 'Jane', age: 30 },
      { name: 'Jane', age: 25 },
      { name: 'John', age: 30 },
      { name: 'John', age: 25 },
    ]);
  });

  it('should not mutate the original array', () => {
    const arr = [{ name: 'B' }, { name: 'A' }];
    const original = [...arr];
    orderBy(arr, ['name'], ['asc']);
    expect(arr).toEqual(original);
  });

  it('should sort numbers numerically, not lexicographically', () => {
    const arr = [{ val: 9 }, { val: 10 }, { val: 2 }, { val: 100 }];

    const result = orderBy(arr, ['val'], ['asc']);

    expect(result).toEqual([{ val: 2 }, { val: 9 }, { val: 10 }, { val: 100 }]);
  });

  it("should default to 'asc' when a direction is not provided for a key", () => {
    const arr = [
      { name: 'Jane', age: 30 },
      { name: 'John', age: 25 },
      { name: 'Jane', age: 25 },
    ];

    const result = orderBy(arr, ['name', 'age'], ['asc']);

    expect(result).toEqual([
      { name: 'Jane', age: 25 },
      { name: 'Jane', age: 30 },
      { name: 'John', age: 25 },
    ]);
  });

  it('should return 0 when all sort keys are equal', () => {
    const arr = [
      { name: 'John', age: 25 },
      { name: 'John', age: 25 },
    ];

    const result = orderBy(arr, ['name', 'age'], ['asc', 'asc']);

    expect(result).toEqual([
      { name: 'John', age: 25 },
      { name: 'John', age: 25 },
    ]);
  });

  it("should default every direction to 'asc' when directions are omitted entirely", () => {
    const arr = [{ n: 3 }, { n: 1 }, { n: 2 }];

    expect(orderBy(arr, ['n'])).toEqual([{ n: 1 }, { n: 2 }, { n: 3 }]);
  });

  it('should accept a readonly array, readonly keys, and readonly directions', () => {
    // None of the three is mutated, so none of them should demand write access. `as const` and
    // frozen state containers hand you exactly these types.
    const arr: readonly { name: string; age: number }[] = [
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
    ];
    const keys = ['name', 'age'] as const;
    const directions = ['asc', 'desc'] as const;

    expect(orderBy(arr, keys, directions).map((r) => r.name)).toEqual(['Jane', 'John']);
  });
});

describe('iteratees', () => {
  it('should dedupe on a derived composite key', () => {
    const subs = [
      { datasetId: 'd1', op: 'insert' },
      { datasetId: 'd1', op: 'update' },
      { datasetId: 'd1', op: 'insert' },
    ];

    const result = uniqBy(subs, (s) => `${s.datasetId}:${s.op}`);

    expect(result).toEqual([
      { datasetId: 'd1', op: 'insert' },
      { datasetId: 'd1', op: 'update' },
    ]);
  });

  it('should sort on a derived value, not a property', () => {
    const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
    const arr = [{ status: 'low' }, { status: 'high' }, { status: 'medium' }];

    const result = orderBy(arr, [(t) => order[t.status]]);

    expect(result).toEqual([{ status: 'high' }, { status: 'medium' }, { status: 'low' }]);
  });
});

describe('comparison semantics', () => {
  it('should sort Dates chronologically, not by their string form', () => {
    // Lexicographically "Fri Feb..." < "Mon Jan...", so stringifying would put February first.
    const arr = [
      { at: new Date('2026-02-20') },
      { at: new Date('2026-01-05') },
      { at: new Date('2026-03-10') },
    ];

    const result = orderBy(arr, ['at']);

    expect(result.map((r) => r.at.toISOString().slice(0, 10))).toEqual([
      '2026-01-05',
      '2026-02-20',
      '2026-03-10',
    ]);
  });

  it('should sort nullish values last ascending and first descending', () => {
    const arr = [{ v: 'zebra' }, { v: null }, { v: 'apple' }, { v: undefined }];

    // Stringifying would sort "null"/"undefined" between "apple" and "zebra".
    expect(orderBy(arr, ['v']).map((r) => r.v)).toEqual(['apple', 'zebra', null, undefined]);
    expect(orderBy(arr, ['v'], ['desc']).map((r) => r.v)).toEqual([
      null,
      undefined,
      'zebra',
      'apple',
    ]);
  });

  it('should treat NaN and an Invalid Date as nil rather than returning NaN from the comparator', () => {
    const arr = [{ v: 3 }, { v: NaN }, { v: 1 }];
    expect(orderBy(arr, ['v']).map((r) => r.v)).toEqual([1, 3, NaN]);

    const dates = [{ at: new Date('2026-01-05') }, { at: new Date('nonsense') }];
    const sorted = orderBy(dates, ['at']);
    expect(sorted[0].at.toISOString().slice(0, 10)).toBe('2026-01-05');
    expect(Number.isNaN(sorted[1].at.getTime())).toBe(true);
  });

  it('should sort booleans false before true', () => {
    const arr = [{ done: true }, { done: false }, { done: true }];

    expect(orderBy(arr, ['done']).map((r) => r.done)).toEqual([false, true, true]);
  });

  it('should rank booleans as 0/1 against numbers, not as their string form', () => {
    // The false-before-true test above passes even with normalize()'s boolean branch deleted:
    // String(false) < String(true) under both collations, so it cannot fail. Mixing booleans with
    // numbers is where 0/1 and "false"/"true" actually diverge, so this is what pins the contract.
    expect(orderBy([{ v: 2 }, { v: true }, { v: 0 }], ['v']).map((r) => r.v)).toEqual([0, true, 2]);
    expect(orderBy([{ v: false }, { v: 0.5 }, { v: true }], ['v']).map((r) => r.v)).toEqual([
      false,
      0.5,
      true,
    ]);
  });

  it('should sort bigints numerically, not lexicographically', () => {
    // `typeof 10n` is 'bigint', not 'number', so these used to miss the numeric branch entirely
    // and stringify: "10" < "9". int8 columns and snowflake IDs deserialize to exactly this.
    const arr = [{ cents: 10n }, { cents: 9n }, { cents: 2n }];

    expect(orderBy(arr, ['cents']).map((r) => r.cents)).toEqual([2n, 9n, 10n]);
    expect(orderBy(arr, ['cents'], ['desc']).map((r) => r.cents)).toEqual([10n, 9n, 2n]);

    // Already in order: sorting is a no-op rather than a reshuffle.
    const sorted = [{ cents: 2n }, { cents: 9n }, { cents: 10n }];

    expect(orderBy(sorted, ['cents']).map((r) => r.cents)).toEqual([2n, 9n, 10n]);
  });

  it('should keep bigint precision above Number.MAX_SAFE_INTEGER', () => {
    // The tempting workaround -- Number(x) -- collapses these two to the same value.
    const arr = [{ id: 9007199254740993n }, { id: 9007199254740992n }];

    expect(orderBy(arr, ['id']).map((r) => r.id)).toEqual([9007199254740992n, 9007199254740993n]);
  });

  it('should report equal bigints as tied, so a later key still breaks the tie', () => {
    const arr = [
      { cents: 5n, id: 2 },
      { cents: 5n, id: 1 },
    ];

    expect(orderBy(arr, ['cents', 'id']).map((r) => r.id)).toEqual([1, 2]);
  });

  it('should treat a bigint mixed with a number as mixed, per the documented fallback', () => {
    // Not two bigints, so this is the `mixed` row of the README table: stringify. Deliberate --
    // handling cross-type numeric comparison is a separate decision from ordering bigints.
    const arr = [{ v: 10n }, { v: 9 }];

    expect(orderBy(arr, ['v']).map((r) => r.v)).toEqual([10n, 9]);
  });

  it('should still tie-break when an earlier numeric key ties on Infinity', () => {
    // `x - y` would make this NaN, and `NaN !== 0` reads as "decided" in the key loop, returning
    // early and dropping `id` entirely. Single-key sorts survive that (the spec coerces NaN to +0),
    // so only a tie-break pins it. Infinity is the ordinary sentinel for "unranked"/"no limit".
    const arr = [
      { n: Infinity, id: 3 },
      { n: Infinity, id: 1 },
      { n: Infinity, id: 2 },
    ];

    expect(orderBy(arr, ['n', 'id']).map((r) => r.id)).toEqual([1, 2, 3]);
  });

  it('should tie-break on -Infinity too, and only after the finite values', () => {
    const arr = [
      { n: -Infinity, id: 3 },
      { n: -Infinity, id: 1 },
    ];

    expect(orderBy(arr, ['n', 'id']).map((r) => r.id)).toEqual([1, 3]);

    const mixed = [
      { n: 1, id: 9 },
      { n: Infinity, id: 5 },
      { n: Infinity, id: 2 },
    ];

    expect(orderBy(mixed, ['n', 'id']).map((r) => r.id)).toEqual([9, 2, 5]);
  });

  it('should order infinities against finite values and each other', () => {
    const arr = [{ n: Infinity }, { n: 0 }, { n: -Infinity }];

    expect(orderBy(arr, ['n']).map((r) => r.n)).toEqual([-Infinity, 0, Infinity]);
    expect(orderBy(arr, ['n'], ['desc']).map((r) => r.n)).toEqual([Infinity, 0, -Infinity]);
  });

  it('should fall back to string comparison for mixed types', () => {
    const arr = [{ v: '10' }, { v: 9 }];

    expect(orderBy(arr, ['v']).map((r) => r.v)).toEqual(['10', 9]);
  });

  it('should tie-break on a later key when an earlier one is equal', () => {
    const arr = [
      { group: 'b', at: new Date('2026-01-01') },
      { group: 'a', at: new Date('2026-05-01') },
      { group: 'a', at: new Date('2026-02-01') },
    ];

    const result = orderBy(arr, ['group', 'at'], ['asc', 'desc']);

    expect(result.map((r) => `${r.group}:${r.at.toISOString().slice(0, 7)}`)).toEqual([
      'a:2026-05',
      'a:2026-02',
      'b:2026-01',
    ]);
  });
});

describe('orderBy nulls option', () => {
  const arr = [{ v: 'zebra' }, { v: null }, { v: 'apple' }, { v: undefined }];

  it("should default to 'last', the behavior orderBy has always had", () => {
    expect(orderBy(arr, ['v'], ['asc'], { nulls: 'last' }).map((r) => r.v)).toEqual(
      orderBy(arr, ['v'], ['asc']).map((r) => r.v),
    );
    expect(orderBy(arr, ['v'], ['desc'], { nulls: 'last' }).map((r) => r.v)).toEqual(
      orderBy(arr, ['v'], ['desc']).map((r) => r.v),
    );
  });

  it("should sort nils last ascending and first descending with nulls: 'last' (Postgres)", () => {
    expect(orderBy(arr, ['v'], ['asc'], { nulls: 'last' }).map((r) => r.v)).toEqual([
      'apple',
      'zebra',
      null,
      undefined,
    ]);

    expect(orderBy(arr, ['v'], ['desc'], { nulls: 'last' }).map((r) => r.v)).toEqual([
      null,
      undefined,
      'zebra',
      'apple',
    ]);
  });

  it("should sort nils first ascending and last descending with nulls: 'first' (MSSQL/SQLite)", () => {
    expect(orderBy(arr, ['v'], ['asc'], { nulls: 'first' }).map((r) => r.v)).toEqual([
      null,
      undefined,
      'apple',
      'zebra',
    ]);

    expect(orderBy(arr, ['v'], ['desc'], { nulls: 'first' }).map((r) => r.v)).toEqual([
      'zebra',
      'apple',
      null,
      undefined,
    ]);
  });

  it('should place NaN and an Invalid Date with the nils, wherever those go', () => {
    const nums = [{ v: 3 }, { v: NaN }, { v: 1 }];

    expect(orderBy(nums, ['v'], ['asc'], { nulls: 'first' }).map((r) => r.v)).toEqual([NaN, 1, 3]);

    const dates = [{ at: new Date('2026-01-05') }, { at: new Date('nonsense') }];
    const sorted = orderBy(dates, ['at'], ['asc'], { nulls: 'first' });

    expect(Number.isNaN(sorted[0].at.getTime())).toBe(true);
    expect(sorted[1].at.toISOString().slice(0, 10)).toBe('2026-01-05');
  });

  it('should leave non-nil ordering untouched', () => {
    const nums = [{ n: 3 }, { n: 1 }, { n: 2 }];

    expect(orderBy(nums, ['n'], ['asc'], { nulls: 'first' })).toEqual([
      { n: 1 },
      { n: 2 },
      { n: 3 },
    ]);
  });
});

describe('orderBy locale option', () => {
  it('should order by codepoint with locale: false, where localeCompare disagrees on case', () => {
    // localeCompare is case-insensitive-ish: it interleaves to a/A/b/B. Codepoints put every
    // uppercase letter (65-90) below every lowercase one (97-122), so the two genuinely differ.
    const arr = [{ v: 'b' }, { v: 'A' }, { v: 'a' }, { v: 'B' }];

    expect(orderBy(arr, ['v']).map((r) => r.v)).toEqual(['a', 'A', 'b', 'B']);
    expect(orderBy(arr, ['v'], ['asc'], { locale: false }).map((r) => r.v)).toEqual([
      'A',
      'B',
      'a',
      'b',
    ]);
  });

  it('should order by codepoint with locale: false, where localeCompare disagrees on accents', () => {
    // localeCompare files é next to e, so "émile" lands before "zebra". Its codepoint (U+00E9) is
    // above every ASCII letter, so it sorts after.
    const arr = [{ v: 'zebra' }, { v: 'émile' }, { v: 'apple' }];

    expect(orderBy(arr, ['v']).map((r) => r.v)).toEqual(['apple', 'émile', 'zebra']);
    expect(orderBy(arr, ['v'], ['asc'], { locale: false }).map((r) => r.v)).toEqual([
      'apple',
      'zebra',
      'émile',
    ]);
  });

  it('should default to localeCompare, the behavior orderBy has always had', () => {
    const arr = [{ v: 'b' }, { v: 'A' }, { v: 'a' }, { v: 'B' }];

    expect(orderBy(arr, ['v'], ['asc'], { locale: true }).map((r) => r.v)).toEqual(
      orderBy(arr, ['v'], ['asc']).map((r) => r.v),
    );
  });

  it('should apply codepoint order to the mixed-type fallback too', () => {
    // The stringifying fallback is a canonicalization hazard in exactly the same way.
    const arr = [{ v: 'a' }, { v: 'B' }, { v: 10 }];

    expect(orderBy(arr, ['v'], ['asc'], { locale: false }).map((r) => r.v)).toEqual([10, 'B', 'a']);
  });

  it('should still negate under desc', () => {
    const arr = [{ v: 'b' }, { v: 'A' }, { v: 'a' }, { v: 'B' }];

    expect(orderBy(arr, ['v'], ['desc'], { locale: false }).map((r) => r.v)).toEqual([
      'b',
      'a',
      'B',
      'A',
    ]);
  });

  it('should combine with nulls in one options object', () => {
    const arr = [{ v: 'a' }, { v: null }, { v: 'B' }];

    expect(orderBy(arr, ['v'], ['asc'], { nulls: 'first', locale: false }).map((r) => r.v)).toEqual(
      [null, 'B', 'a'],
    );
  });

  it('should report equal strings as tied, so a later key still breaks the tie', () => {
    const arr = [
      { group: 'a', n: 2 },
      { group: 'a', n: 1 },
    ];

    expect(orderBy(arr, ['group', 'n'], ['asc', 'asc'], { locale: false })).toEqual([
      { group: 'a', n: 1 },
      { group: 'a', n: 2 },
    ]);
  });
});

describe('backward compatibility', () => {
  it('should behave identically with the options object omitted, empty, or defaulted', () => {
    const arr = [
      { name: 'John', age: 25 },
      { name: 'Jane', age: null },
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ];

    // The 3-arg call is the whole public surface as of 2.1.0; it has to keep meaning what it meant.
    const legacy = orderBy(arr, ['name', 'age'], ['asc', 'desc']);

    expect(orderBy(arr, ['name', 'age'], ['asc', 'desc'], {})).toEqual(legacy);
    expect(orderBy(arr, ['name', 'age'], ['asc', 'desc'], { nulls: 'last', locale: true })).toEqual(
      legacy,
    );

    expect(legacy).toEqual([
      { name: 'Jane', age: null },
      { name: 'Jane', age: 25 },
      { name: 'John', age: 30 },
      { name: 'John', age: 25 },
    ]);
  });

  it('should still accept the 1- and 2-arg calls', () => {
    const arr = [{ n: 3 }, { n: 1 }, { n: 2 }];

    expect(orderBy(arr, ['n'])).toEqual([{ n: 1 }, { n: 2 }, { n: 3 }]);
    expect(orderBy(arr, ['n'], [])).toEqual([{ n: 1 }, { n: 2 }, { n: 3 }]);
  });

  it('should not mutate the original array when options are passed', () => {
    const arr = [{ v: 'b' }, { v: null }, { v: 'a' }];
    const original = [...arr];

    orderBy(arr, ['v'], ['asc'], { nulls: 'first', locale: false });

    expect(arr).toEqual(original);
  });
});
