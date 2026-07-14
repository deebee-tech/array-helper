import { describe, expect, it } from 'vitest';
import { orderBy, uniqBy } from '../src';

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
