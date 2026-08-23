# `products/` — the served products

Two layers in this trunk carry overlapping names, and the difference is worth
stating once, here, rather than being rediscovered.

| | `packages/` | `products/` |
|---|---|---|
| what it is | publishable libraries — `@aigovops/*` on npm | the products people actually use, each with its own site |
| language | JavaScript | whatever the product is written in (two of the three are Python) |
| who installs it | other code, as a dependency | nobody — it is deployed, not imported |
| tested by | the trunk's gate (`npm test`) | its own CI, in its own repository — see below |

`packages/beacon` and `products/beacon` are therefore **not two versions of the
same thing**. They share a word. Nothing in the trunk imports the packages, and
the products contain little or no JavaScript, so neither is a fork of the other.
The standalone repositories are canonical for the products (Bob, 2026-08-23).

How the two are ultimately named and labelled is still an open founder decision
— it is row 14b on the consolidation ladder. Until it is answered, the path
prefix is the whole disambiguation, which is why this file exists.

## Products are not covered by the trunk's test gate

`npm test` runs `scripts/run-tests.mjs`, which is scoped to the npm workspaces
declared in the root `package.json`. It does not reach into `products/`.

That is deliberate. A product brings tests written against its own dependencies
— Python packages, its own npm tree — and the trunk neither installs them nor
knows how. Running them from the trunk's gate would turn it red for reasons that
have nothing to do with the trunk, and the usual response to that is to weaken
the gate. We would rather have a gate that is honest about its scope.

So, plainly: **a product's tests are not run by trunk CI.** Each product's own
repository CI remains its gate. Closing that gap — a per-product test lane in the
trunk that can install per-product dependencies — is real work that has not been
done. It is not a thing to assume is already handled.

## Adding a product

`git subtree add` does **not** preserve traversable history — measured on the
first consolidation, it produced 1 commit and 0 blame authors where the real
history had 13 commits and 2 authors. Use `git filter-repo` instead:

```sh
git clone <product-repo> /tmp/p && cd /tmp/p
git filter-repo --to-subdirectory-filter products/<name>
cd <trunk> && git remote add p /tmp/p && git fetch p
git merge --allow-unrelated-histories p/main
```

Then check that history actually traverses before opening the PR:

```sh
git log --oneline --follow products/<name>/<some-file>   # should be the real history
git shortlog -sn -- products/<name>                      # should be the real authors
```
