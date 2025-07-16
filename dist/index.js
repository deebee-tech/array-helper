class ArrayHelper {
  /*** Return the unique values in an array based off of a key. */
  static uniqBy(arr, key) {
    if (key === void 0 || key === null || key === "") {
      return arr.filter((value, index, arr2) => arr2.findIndex((x) => value === x) === index);
    }
    return arr.filter(
      (value, index, arr2) => arr2.findIndex((x) => value[key] === x[key]) === index
    );
  }
  /*** Take in an array of keys and orders and re-order the entire array based on that input. */
  static orderBy(arr, keys, directions) {
    return arr.sort((a, b) => {
      let i = 0;
      let result = 0;
      const length = keys.length;
      while (result === 0 && i < length) {
        const key = keys[i];
        const direction = directions[i];
        result = direction === "desc" ? b[key].toString().localeCompare(a[key].toString()) : a[key].toString().localeCompare(b[key].toString());
        i++;
      }
      return result;
    });
  }
}

export { ArrayHelper as default };
//# sourceMappingURL=index.js.map
