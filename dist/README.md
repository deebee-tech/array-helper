# Array Helper

Lightweight standalone array utility functions — the parts of LoDash and
Underscore you actually need, without the weight.

## Install

```bash
npm install @deebeetech/array-helper
```

## Functions

- [compact](#compact)
- [orderBy](#orderby)
- [uniqBy](#uniqby)

`orderBy` and `uniqBy` take a **key**, which is either a property name or a
function deriving the value to work on:

```typescript
type Key<T> = keyof T | ((item: T) => unknown);
```

#### compact

Return the array without its nullish entries, narrowing
`(T | null | undefined)[]` to `T[]` — the narrowing `filter(Boolean)` still
doesn't give you.

```typescript
import { compact } from '@deebeetech/array-helper';

const names: (string | null | undefined)[] = ['Jane', null, 'John', undefined];

compact(names);
// ["Jane", "John"] — typed string[], not (string | null | undefined)[]
```

Only `null` and `undefined` are dropped. `0`, `''`, `false`, and `NaN` are
**kept**:

```typescript
compact([0, null, 1, '', undefined, false]);
// [0, 1, "", false]
```

That boundary is deliberate. Dropping every falsy value is a different
operation with different callers — `[first, last].filter(Boolean).join(' ')`
wants the empty strings gone — and folding the two together would silently
discard zeroes and empty strings someone meant to keep. `compact` is the
nullish one; keep using `filter(Boolean)` for the other.

#### orderBy

Sort an array by multiple keys and directions, returning a new array without
mutating the original. Directions default to `"asc"`.

```typescript
import { orderBy } from '@deebeetech/array-helper';

const users = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 },
  { name: 'John', age: 30 },
];

orderBy(users, ['name', 'age'], ['asc', 'desc']);
// [{ name: "Jane", age: 30 }, { name: "John", age: 30 }, { name: "John", age: 25 }]
```

A key can derive the value to sort on, which is how you sort by something that
isn't a property — a rank lookup, a parsed date, a computed label:

```typescript
const rank = { high: 0, medium: 1, low: 2 };

orderBy(tickets, [(t) => rank[t.status], 'createdAt'], ['asc', 'desc']);
```

Values compare as themselves rather than as strings:

| Type               | Order                                                  |
| ------------------ | ------------------------------------------------------ |
| number             | numerically                                            |
| string             | `localeCompare`                                        |
| boolean            | `false` before `true`                                  |
| Date               | chronologically                                        |
| `null`/`undefined` | last ascending, first descending (Postgres NULLS LAST) |
| mixed              | falls back to string comparison                        |

`NaN` and an Invalid Date sort with the nullish values, so they can never return
`NaN` from the comparator and scramble the result.

##### Options

A trailing options object refines the two comparisons that have no single right
answer. Both default to the behavior above, so an existing
`orderBy(arr, keys, directions)` call is unaffected.

```typescript
interface OrderByOptions {
  nulls?: 'first' | 'last'; // default "last"
  locale?: boolean; // default true
}
```

**`nulls`** — where nullish values land in an **ascending** sort. `"desc"`
negates it, exactly as it negates every other comparison, so the two settings
line up with the two families of SQL dialect:

| `nulls`   | ascending | descending | matches          |
| --------- | --------- | ---------- | ---------------- |
| `"last"`  | last      | first      | Postgres, Oracle |
| `"first"` | first     | last       | MSSQL, SQLite    |

```typescript
orderBy(rows, ['name'], ['asc'], { nulls: 'first' });
// nulls lead, then the values
```

**`locale`** — whether strings compare with `localeCompare`. Set `false` to
compare by codepoint instead:

```typescript
orderBy(rows, ['name'], ['asc'], { locale: false });
```

`localeCompare` is ICU- and locale-dependent, so the same two strings can order
differently on two machines — `["b", "A", "a", "B"]` sorts to `a, A, b, B` under
a locale and `A, B, a, b` by codepoint. That's fine for display and wrong for a
**canonicalizing** sort, one whose output feeds a hash, a deep-equality check,
or URL state, where a locale-driven reshuffle reads as a change that never
happened. Use `locale: false` for those; leave it alone for anything a person
reads. It applies to the mixed-type stringifying fallback too, which is a
canonicalization hazard in the same way.

#### uniqBy

Return the unique values in an array, optionally deduplicated by a key. The
first occurrence of each distinct value wins. Called without a key, it uses
`Set` semantics (identity/value equality).

```typescript
import { uniqBy } from '@deebeetech/array-helper';

const users = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 },
  { name: 'John', age: 30 },
];

uniqBy(users, 'name');
// [{ name: "John", age: 25 }, { name: "Jane", age: 30 }]

uniqBy([1, 2, 3, 2, 1]);
// [1, 2, 3]
```

A derived key dedupes on a composite or computed value:

```typescript
uniqBy(subscriptions, (s) => `${s.datasetId}:${s.op}`);
```
