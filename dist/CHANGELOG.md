# [3.0.0](https://github.com/deebee-tech/array-helper/compare/v2.2.2...v3.0.0) (2026-07-17)


### Bug Fixes

* compare numbers by sign so an Infinity tie can't drop later sort keys ([cd5832b](https://github.com/deebee-tech/array-helper/commit/cd5832b4ebea8671ffa2d6f80756b376592eb30b))
* order bigints, accept readonly arrays, and drop the ES2023 floor ([48e7dd3](https://github.com/deebee-tech/array-helper/commit/48e7dd3cae403698fd78c83d06495784c90dc078))


### chore

* parse bang commits in release notes, and correct the license holder ([a2ae41e](https://github.com/deebee-tech/array-helper/commit/a2ae41eb6e56c70ad184f8c5f95fecc2ba5e5565))


### BREAKING CHANGES

* footer, which renders through a separate path that stayed
green throughout. Added the bang-only-no-footer case for both `feat!:` and
`fix!:`. It fails without the parserOpts.

LICENSE

`Copyright (c) 2024 With One Vision Technologies` was stale, inherited from a
template. That entity appears nowhere else in the repo, and 2024 predates the
first commit (2025-07-16). Copyright cannot vest in the new entity until it
legally exists, so this names the author personally for now; it is assignable
later. The sibling DeeBee repos likely carry the same template line.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>

## [2.2.2](https://github.com/deebee-tech/array-helper/compare/v2.2.1...v2.2.2) (2026-07-16)


### Bug Fixes

* resolve CJS types per lane so node16 consumers stop hitting TS1479 ([2dca03d](https://github.com/deebee-tech/array-helper/commit/2dca03d68d9d44f68783736f1672c9fb206d47fc))

## [2.2.1](https://github.com/deebee-tech/array-helper/compare/v2.2.0...v2.2.1) (2026-07-15)


### Bug Fixes

* brand README header with DeeBee wordmark lockup and ecosystem link ([e04e9a1](https://github.com/deebee-tech/array-helper/commit/e04e9a17bf9b3b1b242c2e7fae5cf3744d3b4be2))

## [2.2.0](https://github.com/deebee-tech/array-helper/compare/v2.1.0...v2.2.0) (2026-07-14)


### Features

* add compact, and make orderBy's null placement and collation configurable ([54b798c](https://github.com/deebee-tech/array-helper/commit/54b798c2adb5b3e73828210a2cbb153a4450ee50))

## [2.1.0](https://github.com/deebee-tech/array-helper/compare/v2.0.0...v2.1.0) (2026-07-14)


### Bug Fixes

* **release:** publish JSR before the GitHub release and drop the asset upload ([1c83beb](https://github.com/deebee-tech/array-helper/commit/1c83beb0467e92e8b24ee0cf975c4c803adb9208))


### Features

* **helper:** accept iteratees and compare values as themselves ([a334452](https://github.com/deebee-tech/array-helper/commit/a334452c91d33348b63b8cf9ce6039ee4bc519d8))

  Dates began comparing chronologically rather than by `toString()`, and nullish values moved from sorting alphabetically as `"null"`/`"undefined"` to sorting last ascending. Both are fixes, but they reorder existing results under a `^2` range — this note is backfilled, since the entry shipped empty.

## [2.0.0](https://github.com/deebee-tech/array-helper/compare/v1.0.0...v2.0.0) (2026-03-31)

### ⚠ BREAKING CHANGES

* **helper:** Moved from static class to standard function exports.

### Features

* **helper:** Complete modernization ([173b6d9](https://github.com/deebee-tech/array-helper/commit/173b6d914c3a026842028774064930e9d8ac144c))

# 1.0.0 (2025-07-16)


### Bug Fixes

* **repo:** Bumping and syncing version numbers ([dd88f06](https://github.com/deebee-tech/array-helper/commit/dd88f06e0776711381b14feb2017359237ae70ec))
* **repo:** reinstalling all new packages ([08ef127](https://github.com/deebee-tech/array-helper/commit/08ef127860f0be95021142b05fb8700163faffec))
* **repo:** Updating packages for GHA ([a4bea3b](https://github.com/deebee-tech/array-helper/commit/a4bea3b06be3e3674bb25dac112a7c7d9bbdb772))
