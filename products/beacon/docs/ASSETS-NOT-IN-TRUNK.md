# Five large assets are not in this copy

Beacon's history carries about 190 MiB of media — 236× the size of the entire
rest of the trunk. Bringing it in whole would have made every clone and every CI
checkout pay that cost forever, and taking it back out later means rewriting
trunk history, which this project classes as an irreversible move requiring a
founder's decision. So the trunk copy was filtered: every blob over 1 MiB was
stripped from the history, which took the product from **191.56 MiB to 5.82 MiB**
with all 75 commits and both authors intact.

**The canonical copy of every file below is in the standalone repository**,
<https://github.com/aigovops-foundation/aigovops-beacon>, which is unchanged and
remains canonical for the product.

| path | size | state here |
|---|---|---|
| `docs/downloads/aigovops-beacon-starter.zip` | 48,814,491 B | **removed** — see the warning below |
| `docs/assets/beacon-elevator-pitch.mp4` | 45,433,624 B | removed |
| `docs/assets/beacon-teaser-30s.mp4` | 15,410,966 B | removed |
| `docs/video/aigovops-event-spot.mp4` | 2,899,365 B | removed |
| `docs/downloads/beacon-walkthrough.mp4` | 1,605,745 B | removed |

Poster images and QR codes for the videos are all under 1 MiB and are still here.

## The one that needed a second look

`git filter-repo`'s stream is incremental: stripping a blob omits the *change* to
that path, so the path silently keeps whatever the previous commit had. Four of
the five files above had no smaller earlier revision, so they simply vanished.
The starter zip did — it has seven revisions, and the earliest survivors are
small.

Left alone, the filtered tree would have carried a **334,294-byte zip from an
early commit sitting at the path of the current 48,814,491-byte build**: a stale
artifact wearing a current filename, which is worse than a missing file, because
a missing file announces itself and a wrong one does not. It was removed
explicitly in the commit that added this note.

If you strip blobs from any other product, check for this. Comparing the tip
trees before and after by blob hash is what surfaced it:

```sh
git ls-tree -r HEAD | awk '{print $4, $3}' | sort > after.txt
# ...same for the source repo, then:
join -o 0,1.2,2.2 before.txt after.txt | awk '$2!=$3 {print $1}'
```

## What this breaks

Nine references in `docs/index.html`, six in `docs/video/index.html`, and a
handful across `README.md`, `JOIN.md`, `LAB.md`, `ARCHITECTURE-BETA.md` and
`tools/README.md` point at these files. **They are not repointed.** They resolve
correctly on the standalone repo's Pages site, which is what serves Beacon today,
and they are dead in this copy.

That is a known, accepted state, not an oversight. Repointing them — or attaching
the media to a GitHub Release and pointing at that, which is where binaries this
size belong — is follow-up work, and it should happen before the trunk ever
serves Beacon's `docs/`.
