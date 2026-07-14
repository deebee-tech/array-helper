# Array Helper

Lightweight standalone array utility functions — the parts of LoDash and
Underscore you actually need, without the weight.

## Install

```bash
npm install @deebeetech/array-helper
```

## Functions

- [orderBy](#orderby)
- [uniqBy](#uniqby)

Both functions take a **key**, which is either a property name or a function
deriving the value to work on:

```typescript
type Key<T> = keyof T | ((item: T) => unknown);
```

#### orderBy

Sort an array by multiple keys and directions, returning a new array without
mutating the original. Directions default to `"asc"`.

```typescript
import { orderBy } from "@deebeetech/array-helper";

const users = [
   { name: "John", age: 25 },
   { name: "Jane", age: 30 },
   { name: "John", age: 30 },
];

orderBy(users, ["name", "age"], ["asc", "desc"]);
// [{ name: "Jane", age: 30 }, { name: "John", age: 30 }, { name: "John", age: 25 }]
```

A key can derive the value to sort on, which is how you sort by something that
isn't a property — a rank lookup, a parsed date, a computed label:

```typescript
const rank = { high: 0, medium: 1, low: 2 };

orderBy(tickets, [(t) => rank[t.status], "createdAt"], ["asc", "desc"]);
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

#### uniqBy

Return the unique values in an array, optionally deduplicated by a key. The
first occurrence of each distinct value wins. Called without a key, it uses
`Set` semantics (identity/value equality).

```typescript
import { uniqBy } from "@deebeetech/array-helper";

const users = [
   { name: "John", age: 25 },
   { name: "Jane", age: 30 },
   { name: "John", age: 30 },
];

uniqBy(users, "name");
// [{ name: "John", age: 25 }, { name: "Jane", age: 30 }]

uniqBy([1, 2, 3, 2, 1]);
// [1, 2, 3]
```

A derived key dedupes on a composite or computed value:

```typescript
uniqBy(subscriptions, (s) => `${s.datasetId}:${s.op}`);
```
