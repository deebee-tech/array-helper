//#region src/index.ts
/** Return the unique values in an array, optionally deduplicated by a specific key. */
function uniqBy(arr, key) {
	if (key === void 0 || key === null) return [...new Set(arr)];
	const seen = /* @__PURE__ */ new Map();
	for (const item of arr) {
		const val = item[key];
		if (!seen.has(val)) seen.set(val, item);
	}
	return [...seen.values()];
}
/** Sort an array by multiple keys and directions, returning a new array without mutating the original. */
function orderBy(arr, keys, directions) {
	return arr.toSorted((a, b) => {
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const direction = directions[i] ?? "asc";
			const aVal = a[key];
			const bVal = b[key];
			let result;
			if (typeof aVal === "number" && typeof bVal === "number") result = aVal - bVal;
			else result = String(aVal).localeCompare(String(bVal));
			if (direction === "desc") result = -result;
			if (result !== 0) return result;
		}
		return 0;
	});
}
//#endregion
export { orderBy, uniqBy };

//# sourceMappingURL=index.mjs.map