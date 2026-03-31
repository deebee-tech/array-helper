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

#### orderBy

Sort an array by multiple keys and directions, returning a new array without
mutating the original. Compares numbers numerically and everything else via
`localeCompare`.

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

#### uniqBy

Return the unique values in an array, optionally deduplicated by a specific key.
When called without a key, uses `Set` semantics (identity/value equality).

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
