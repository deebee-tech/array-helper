/** Return the unique values in an array, optionally deduplicated by a specific key. */
export function uniqBy<T>(arr: T[], key?: keyof T): T[] {
   if (key === undefined || key === null) {
      return [...new Set(arr)];
   }

   const seen = new Map<T[keyof T], T>();

   for (const item of arr) {
      const val = item[key];

      if (!seen.has(val)) {
         seen.set(val, item);
      }
   }

   return [...seen.values()];
}

/** Sort an array by multiple keys and directions, returning a new array without mutating the original. */
export function orderBy<T>(arr: T[], keys: (keyof T)[], directions: ("asc" | "desc")[]): T[] {
   return arr.toSorted((a: T, b: T) => {
      for (let i = 0; i < keys.length; i++) {
         const key = keys[i];
         const direction = directions[i] ?? "asc";
         const aVal = a[key];
         const bVal = b[key];

         let result: number;

         if (typeof aVal === "number" && typeof bVal === "number") {
            result = aVal - bVal;
         } else {
            result = String(aVal).localeCompare(String(bVal));
         }

         if (direction === "desc") result = -result;
         if (result !== 0) return result;
      }

      return 0;
   });
}
