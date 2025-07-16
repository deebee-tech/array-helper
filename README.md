# Array Helper

A small collection of extra methods for arrays that we mostly needed from
LoDash and Underscore that we didn't want to carry the weight of those installs.

## Methods

- [Array Helper](#array-helper)
   - [Methods](#methods)
      - [orderBy](#orderby)
      - [uniqBy](#uniqby)

#### orderBy

Take in an array of keys and orders and re-order the entire array based on that
input.

```typescript
import { orderBy } from "@deebeetech/array-helpers";
const array = [{ key1: "Hello" }, { key1: "Goodbye" }];
orderBy(array, ["key1"], ["asc"]);
// [{key1: "Goodbye"}, {key1: "Hello"}]
```

#### uniqBy

Return the unique values in an array based off of a key.

```typescript
const array = [{ key1: "Hello" }, { key1: "Goodbye" }, { key1: "Hello" }];
uniqBy(array, "key1");
// [{key1: "Hello"}, {key1: "Goodbye"}]
```

For a full list of functions, see the [jsr.io documentation](https://jsr.io/@deebeetech/array-helper/doc/~/ArrayHelper)
