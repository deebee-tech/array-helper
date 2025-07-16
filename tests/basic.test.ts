import { describe, expect, it } from "vitest";
import ArrayHelper from "../src";

describe("ArrayHelper", () => {
   it("should order by keys and directions", () => {
      const arr = [
         { name: "John", age: 25 },
         { name: "Jane", age: 30 },
         { name: "John", age: 30 },
         { name: "Jane", age: 25 },
      ];

      const keys = ["name", "age"];
      const directions: ("asc" | "desc")[] = ["asc", "desc"];

      const result = ArrayHelper.orderBy(arr, keys, directions);

      expect(result).toEqual([
         { name: "Jane", age: 30 },
         { name: "Jane", age: 25 },
         { name: "John", age: 30 },
         { name: "John", age: 25 },
      ]);
   });

   it("should return unique values based on a key", () => {
      const arr = [
         { name: "John", age: 25 },
         { name: "Jane", age: 30 },
         { name: "John", age: 30 },
         { name: "Jane", age: 25 },
      ];

      const result = ArrayHelper.uniqBy(arr, "name");

      expect(result).toEqual([
         { name: "John", age: 25 },
         { name: "Jane", age: 30 },
      ]);
   });

   it("should return unique values based on no key", () => {
      const arr = [
         { name: "John", age: 25 },
         { name: "Jane", age: 30 },
         { name: "John", age: 30 },
         { name: "Jane", age: 25 },
      ];

      const result = ArrayHelper.uniqBy(arr);

      expect(result).toEqual([
         { name: "John", age: 25 },
         { name: "Jane", age: 30 },
         { name: "John", age: 30 },
         { name: "Jane", age: 25 },
      ]);
   });
});
