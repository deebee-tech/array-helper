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
* an Invalid Date — whose getTime() is NaN — ranks with the nils instead of comparing equal to
* every value, which is what a NaN out of the comparator would mean.
*/
function isNil(value) {
	return value === null || value === void 0 || typeof value === "number" && Number.isNaN(value);
}
/** Codepoint order is a total order fixed by the string itself, which is what `locale: false` buys:
* a result that cannot vary with the machine's ICU data.
*/
function compareStrings(x, y, locale) {
	if (locale) return x.localeCompare(y);
	return x < y ? -1 : x > y ? 1 : 0;
}
/**
* A nil is ranked either above every value or below every value, and `desc` negates that along with
* everything else — so the placement is stated for an ascending sort and descending falls out of
* plain negation, which is how the SQL dialects arrive at their own defaults.
*/
function compare(a, b, options) {
	const x = normalize(a);
	const y = normalize(b);
	const xNil = isNil(x);
	const yNil = isNil(y);
	if (xNil || yNil) {
		const nil = options.nulls === "first" ? -1 : 1;
		return xNil && yNil ? 0 : xNil ? nil : -nil;
	}
	if (typeof x === "number" && typeof y === "number") return x < y ? -1 : x > y ? 1 : 0;
	if (typeof x === "string" && typeof y === "string") return compareStrings(x, y, options.locale);
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
function compact(arr) {
	return arr.filter((item) => item !== null && item !== void 0);
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
*
* `options` refines the two comparisons that have no single right answer — see
* {@link OrderByOptions} — leaving both alone to keep the sort as it was.
*/
function orderBy(arr, keys, directions = [], options = {}) {
	const resolved = {
		nulls: options.nulls ?? "last",
		locale: options.locale ?? true
	};
	return arr.toSorted((a, b) => {
		for (let i = 0; i < keys.length; i++) {
			const result = compare(select(a, keys[i]), select(b, keys[i]), resolved);
			if (result !== 0) return directions[i] === "desc" ? -result : result;
		}
		return 0;
	});
}
//#endregion
export { compact, orderBy, uniqBy };

//# sourceMappingURL=index.mjs.map