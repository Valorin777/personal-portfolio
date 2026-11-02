# V5 project media sources

Updated 2026-11-02 after the integrated V5 runtime was checked. The final site uses public project artwork, actual public-page captures, and licensed filmed footage. No private client media, invented product photos, or fabricated screenshots were introduced. Original project colors are preserved.

## Final runtime assets

Every file below is referenced by the current `dist/**/*.html`, `dist/**/*.css`, or `dist/**/*.js` output. All eight are in `dist/assets/v5/`.

| Filename | Dimensions / duration | Bytes | Public source | Treatment / meaning |
|---|---|---:|---|---|
| `faith-site.jpg` | 1250 × 500 | 41,063 | [Source](https://faithoverfear-one.vercel.app/) | Real public homepage screenshot captured through CUA by the parent task, with the popup closed; cropped to the hero. No invented shop content. |
| `last-wind-site.jpg` | 1265 × 791 | 123,695 | [Source](https://valorin777.github.io/field-form/) | Real public scene screenshot captured through CUA by the parent task, showing the published scroll film. |
| `rusjet-taxi.mp4` | 1280 × 720; 13 s; 25 fps | 1,661,649 | [Source](https://raw.githubusercontent.com/Valorin777/rusjet-cinema-concept/main/dist/assets/footage/taxi.mp4) | Real filmed project footage, resized/re-encoded locally; silent H.264, faststart. |
| `rusjet-taxi-poster.jpg` | 1600 × 900 | 62,448 | [Source](https://raw.githubusercontent.com/Valorin777/rusjet-cinema-concept/main/dist/assets/footage/taxi-poster.jpg) | Unmodified corresponding poster from the project. |
| `rusjet-dusk-poster.jpg` | 1600 × 904 | 65,092 | [Source](https://raw.githubusercontent.com/Valorin777/rusjet-cinema-concept/main/dist/assets/footage/dusk-poster.jpg) | Unmodified project poster used by the homepage visual-project category card. |
| `last-wind-field.webp` | 1672 × 941 | 272,842 | [Source](https://raw.githubusercontent.com/Valorin777/field-form/main/public/art/field.webp) | Original generated landscape artwork from LAST WIND; unmodified. |
| `last-wind-ronin.webp` | 1024 × 1536 | 417,034 | [Source](https://raw.githubusercontent.com/Valorin777/field-form/main/public/art/ronin.webp) | Original generated transparent character artwork from LAST WIND; unmodified. |
| `okoshko-og.png` | 1200 × 630 | 32,635 | [Source](https://getokoshko.ru/og/okoshko.png) | Official sharing artwork referenced by the live homepage Open Graph metadata; brand graphic, not an application screenshot. |

Final V5 asset size: **2,676,458 bytes** (2.68 MB), across **8 files**.

## Screenshot provenance

- `faith-site.jpg`: parent captured the publicly available Vercel homepage using CUA, closed the visible popup, and cropped the genuine hero region. Pixel dimensions were independently read locally as 1250 × 500. The capture documents the user-confirmed commissioned project; it does not establish completed sales, stock availability or payment processing.
- `last-wind-site.jpg`: parent captured the actual published LAST WIND page through CUA. Pixel dimensions were independently read locally as 1265 × 791. This file replaces the unused multi-panel QA contact sheet as the project screenshot.
- Screenshot source URLs identify the captured public pages. The SHA-256 hashes below identify the exact retained files; capture context comes from the parent task’s verified CUA work.

## RusJet footage provenance and credit

The footage and posters were already part of the public independent RusJet concept. Its [THIRD_PARTY.md](https://github.com/Valorin777/rusjet-cinema-concept/blob/main/THIRD_PARTY.md) identifies the original creators and preparation. The [Pexels License](https://www.pexels.com/license/) was checked directly during this task and permits website use and editing, with no implied endorsement.

- Taxi footage and poster: **Jake Heinemann**, [Airplane Preparing For Take Off](https://www.pexels.com/video/airplane-preparing-for-take-off-1650628/). Real business-jet taxi footage. The project source already trimmed it to 13 seconds and removed audio. This is taxiing, not a shown liftoff.
- Dusk poster: **Joerg Mangelsen**, [Luxury Private Jet on Tarmac at Dusk](https://www.pexels.com/video/luxury-private-jet-on-tarmac-at-dusk-34746862/). Extracted from real filmed camera movement around a parked aircraft. The prepared dusk video itself is not shipped in the final runtime.
- Neither source establishes RusJet fleet ownership. Retain the independent-concept framing and source credits without implying airline or creator endorsement.

The retained taxi MP4 was prepared with the parent-supplied FFmpeg 7.1 binary: H.264/libx264, CRF 26, yuv420p, original 25 fps, proportional 1280 × 720 scale, no audio, and faststart. It decoded fully with exit code 0 and contains only a video stream. No scene replacement or generated aircraft was introduced.

## Artwork and other existing media

- LAST WIND [README](https://github.com/Valorin777/field-form/blob/main/README.md) identifies the environment and character as original generated artwork for that project. The retained field and ronin files support an artwork composition; the separate `last-wind-site.jpg` is the real screenshot.
- Окошко retains its official public OG graphic. No store screenshots or embedded customer examples were downloaded.
- Хроносфера still references the original `dist/assets/sochi.jpg` outside the V5 folder. Its redundant V5 copy was removed. Preserve the existing [project sources and authorship](https://valorin777.github.io/sochi/istochniki/) and the still-referenced original asset unless the parent changes that reference.

## Prepared assets excluded from final runtime

The initial media pass downloaded **10,334,565 bytes**, below the requested 30 MB bound. Temporary full-size source videos were removed after the smaller derivatives passed checks. The initial ten-file prepared set totaled 4,182,496 bytes; it was a selection pool, not the final shipped inventory. Two genuine screenshots were subsequently supplied by the parent.

After scanning the integrated HTML, CSS and JavaScript, the following four unreferenced V5 files were removed. Their public origins and hashes are retained here for reproducibility. No referenced V5 file or asset outside this folder was removed by this task.

| Removed prepared filename | Bytes | Public origin | Reason |
|---|---:|---|---|
| `rusjet-dusk.mp4` | 1,117,447 | [Source](https://raw.githubusercontent.com/Valorin777/rusjet-cinema-concept/main/dist/assets/footage/dusk.mp4) | Prepared 10-second muted 1280 × 720 derivative; final site uses its poster only. |
| `faith-icon.png` | 64,233 | [Source](https://raw.githubusercontent.com/Valorin777/faithoverfear/main/public/icons/icon-512.png) | Genuine 512 × 512 brand icon; real homepage screenshot selected instead. |
| `last-wind-preview.jpg` | 441,442 | [Source](https://raw.githubusercontent.com/Valorin777/field-form/main/docs/preview.jpg) | Authentic 1440 × 1984 multi-panel QA sheet; real scene screenshot selected instead. |
| `sochi.jpg` | 47,674 | [Source](https://raw.githubusercontent.com/Valorin777/sochi/main/assets/film/og.jpg) | Redundant 1200 × 630 copy; current HTML uses ../assets/sochi.jpg. |

Pruning removed **1,670,796 bytes** (1.67 MB) from the V5 folder.

The excluded dusk derivative can be recreated using FFmpeg libx264 CRF 26, yuv420p, 25 fps, no audio, faststart, and `scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2`. The other excluded files were unchanged copies of their public originals.

## Reference verification

All retained V5 filenames have current HTML/CSS/JS references, and all discovered V5 references resolve to existing files. Image dimensions were read locally. The parent visually verified the two CUA screenshots; the original preparation task visually inspected the LAST WIND field/contact sheet, Окошко OG and Faith icon. The asset cleanup made no browser actions, network requests, template/data changes, other-repository changes or deployment changes.

## Final file integrity

```text
e82073ab621f7bc9278f508a36a5d5dad9a21c7dab034d91e4fe5e9bfd17d104  faith-site.jpg
dff6ef4667a7d8714a87c5848afe2aaf03e2cf73c0dd351eb6dcd177632cf80f  last-wind-site.jpg
c2cf8c11a7381a51a3349b12f0a67eba7e6a1d35a31c238f7fec1c449d340707  rusjet-taxi.mp4
21809b0e68c88a1367d556ce3a0e778c6cdaee0519d73e060e31f6b5f7b9ab0e  rusjet-taxi-poster.jpg
96fb6a72cdb3eb27d79f90447d01f333d44389929c2621f1e4009194e804deef  rusjet-dusk-poster.jpg
0268bf5b634caccfeed940c6e801bf37c4c1e0a6ee742ff764ebe94fa3313edc  last-wind-field.webp
ce52f3c0ba55edad0a26d9e967d31fce17c4043e0ba7580a47d40ba4428e080f  last-wind-ronin.webp
9088ff659887e84829ac6c1e272b257aacbf68b2a5e48c8a8ace49d19820965d  okoshko-og.png
```

## Removed prepared-file integrity

```text
4861099ba9f1273e2fcdc3ff03de7bcb0318aad49dc27935a8da0f4cec15d399  rusjet-dusk.mp4
99c0037385fb8e1a2c220b2992235bb70a5f5db5cf2f6e586fa1cf22fd1ec284  faith-icon.png
d648034c4a0da774f98ad32c2d0458cdf9eb329c0f9aa0b29252fe5dcebbacc2  last-wind-preview.jpg
36ab90e0d73f6e748ca01e01ff3c116f20568ab80baf9c9abd4680591ffc4e76  sochi.jpg
```
