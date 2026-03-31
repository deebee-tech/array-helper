import { describe, expect, it } from "vitest";
import { orderBy, uniqBy } from "../src";

describe("uniqBy", () => {
   it("should return unique values based on a key", () => {
      const arr = [
         { name: "John", age: 25 },
         { name: "Jane", age: 30 },
         { name: "John", age: 30 },
         { name: "Jane", age: 25 },
      ];

      const result = uniqBy(arr, "name");

      expect(result).toEqual([
         { name: "John", age: 25 },
         { name: "Jane", age: 30 },
      ]);
   });

   it("should return unique values with no key (primitives)", () => {
      const arr = [1, 2, 3, 2, 1, 4];
      expect(uniqBy(arr)).toEqual([1, 2, 3, 4]);
   });

   it("should return all objects when no key is provided (unique references)", () => {
      const arr = [
         { name: "John", age: 25 },
         { name: "Jane", age: 30 },
         { name: "John", age: 30 },
         { name: "Jane", age: 25 },
      ];

      const result = uniqBy(arr);

      expect(result).toEqual([
         { name: "John", age: 25 },
         { name: "Jane", age: 30 },
         { name: "John", age: 30 },
         { name: "Jane", age: 25 },
      ]);
   });
});

describe("orderBy", () => {
   it("should order by keys and directions", () => {
      const arr = [
         { name: "John", age: 25 },
         { name: "Jane", age: 30 },
         { name: "John", age: 30 },
         { name: "Jane", age: 25 },
      ];

      const result = orderBy(arr, ["name", "age"], ["asc", "desc"]);

      expect(result).toEqual([
         { name: "Jane", age: 30 },
         { name: "Jane", age: 25 },
         { name: "John", age: 30 },
         { name: "John", age: 25 },
      ]);
   });

   it("should not mutate the original array", () => {
      const arr = [{ name: "B" }, { name: "A" }];
      const original = [...arr];
      orderBy(arr, ["name"], ["asc"]);
      expect(arr).toEqual(original);
   });

   it("should sort numbers numerically, not lexicographically", () => {
      const arr = [{ val: 9 }, { val: 10 }, { val: 2 }, { val: 100 }];

      const result = orderBy(arr, ["val"], ["asc"]);

      expect(result).toEqual([{ val: 2 }, { val: 9 }, { val: 10 }, { val: 100 }]);
   });

   it("should default to 'asc' when a direction is not provided for a key", () => {
      const arr = [
         { name: "Jane", age: 30 },
         { name: "John", age: 25 },
         { name: "Jane", age: 25 },
      ];

      const result = orderBy(arr, ["name", "age"], ["asc"]);

      expect(result).toEqual([
         { name: "Jane", age: 25 },
         { name: "Jane", age: 30 },
         { name: "John", age: 25 },
      ]);
   });

   it("should return 0 when all sort keys are equal", () => {
      const arr = [
         { name: "John", age: 25 },
         { name: "John", age: 25 },
      ];

      const result = orderBy(arr, ["name", "age"], ["asc", "asc"]);

      expect(result).toEqual([
         { name: "John", age: 25 },
         { name: "John", age: 25 },
      ]);
   });
});
