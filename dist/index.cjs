Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/index.ts
/** `keyof T` is always a string, number, or symbol — never a function — so this discriminates cleanly. */
function select(item, key) {
	return typeof key === "function" ? key(item) : item[key];
}
/** Dates compare as epoch ms and booleans as 0/1, so both sort as the primitives they stand for. */
function normalize(value) {
	if (value instanceof Date) return value.getTime();
	if (typeof value === "boolean") return value ? 1 : 0;
	return value;
}
/**
* Nullish values and NaN have no meaningful position in an ordering. NaN is folded in here so that
* an Invalid Date — whose getTime() is NaN — can never return NaN from the comparator, which would
* sort arbitrarily.
*/
function isNil(value) {
	return value === null || value === void 0 || typeof value === "number" && Number.isNaN(value);
}
/**
* Nils sort last ascending, and `desc` simply negates that, so they lead a descending sort. That is
* plain negation, and it matches Postgres's default NULLS LAST / NULLS FIRST behavior.
*/
function compare(a, b) {
	const x = normalize(a);
	const y = normalize(b);
	const xNil = isNil(x);
	const yNil = isNil(y);
	if (xNil || yNil) return xNil && yNil ? 0 : xNil ? 1 : -1;
	if (typeof x === "number" && typeof y === "number") return x - y;
	if (typeof x === "string" && typeof y === "string") return x.localeCompare(y);
	return String(x).localeCompare(String(y));
}
/**
* Return the unique values in an array, optionally deduplicated by a key or a derived value.
* The first occurrence of each distinct value wins.
*/
function uniqBy(arr, key) {
	if (key === void 0 || key === null) return [...new Set(arr)];
	const seen = /* @__PURE__ */ new Map();
	for (const item of arr) {
		const val = select(item, key);
		if (!seen.has(val)) seen.set(val, item);
	}
	return [...seen.values()];
}
/**
* Sort an array by multiple keys and directions, returning a new array without mutating the
* original. Each key is a property name or a function deriving the value to sort on, and directions
* default to `"asc"`. Numbers, strings, booleans, and Dates each compare as themselves; nullish
* values sort last ascending.
*/
function orderBy(arr, keys, directions = []) {
	return arr.toSorted((a, b) => {
		for (let i = 0; i < keys.length; i++) {
			const result = compare(select(a, keys[i]), select(b, keys[i]));
			if (result !== 0) return directions[i] === "desc" ? -result : result;
		}
		return 0;
	});
}
//#endregion
exports.orderBy = orderBy;
exports.uniqBy = uniqBy;

//# sourceMappingURL=index.cjs.map