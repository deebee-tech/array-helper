/** Encapsulating class for all array-helpers.  All methods
 * below this are static so there does not need to be any
 * references to constructors.  This class is meant to be
 * used as a utility class for all helper methods dealing with
 * arrays and are mostly ports from LoDash and Underscore.
 * This class is not meant to be instantiated.
 */
export default class ArrayHelper {
   /*** Return the unique values in an array based off of a key. */
   public static uniqBy<T>(arr: T[], key?: string): T[] {
      if (key === undefined || key === null || key === "") {
         return arr.filter((value, index, arr) => arr.findIndex((x) => value === x) === index);
      }

      return arr.filter(
         (value, index, arr) => arr.findIndex((x) => value[key as keyof T] === x[key as keyof T]) === index,
      );
   }

   /*** Take in an array of keys and orders and re-order the entire array based on that input. */
   public static orderBy<T>(arr: T[], keys: string[], directions: ("asc" | "desc")[]): T[] {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return arr.sort((a: any, b: any) => {
         let i = 0;
         let result = 0;
         const length = keys.length;

         while (result === 0 && i < length) {
            const key = keys[i];
            const direction = directions[i];

            result =
               direction === "desc"
                  ? b[key as keyof T].toString().localeCompare(a[key as keyof T].toString())
                  : a[key as keyof T].toString().localeCompare(b[key as keyof T].toString());
            i++;
         }

         return result;
      });
   }
}
