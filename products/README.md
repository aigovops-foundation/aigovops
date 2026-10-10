# Products

Products live only in their canonical standalone repositories. This directory
contains pointers; it does not contain product source trees.

| | `packages/` | `products/` |
|---|---|---|
| what it is | publishable `@aigovops/*` libraries on npm | pointers to independent products and their sites |
| language | JavaScript | varies by product |
| who installs it | other code, as a dependency | users access the deployed product |
| tested by | the trunk's gate (`npm test`) | each product's own repository CI |

`packages/beacon` and `products/beacon` share a name but have different roles:
the package is an npm library, while the product is maintained in its canonical
repository.

`npm test` runs `scripts/run-tests.mjs` over the npm workspaces declared in the
root `package.json`. It does not run tests from the standalone product
repositories; each repository owns its source, dependencies, tests, and CI.
