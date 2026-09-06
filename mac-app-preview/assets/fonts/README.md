# Inter for the console comparison

Inter is the approved website family on non-Apple platforms. These unmodified WOFF2 subsets are the same Google Fonts Inter v20 distribution, downloaded for local delivery. They contain the complete normal weight range 100–900, including the console’s 400, 500, 600, 650, 700 and 800 weights. Browser unicode ranges load only the required scripts.

`inter.css` declares the faces with `font-display: swap`; there is no external font request for Inter. The license is in `OFL.txt`; exact upstream URLs and asset hashes are in `sources.json`. Native San Francisco remains first on Apple devices. The existing marketing-only Wix Madefor / IBM Plex faces remain outside this change.

Owner authorization: the user requested that the approved independent console comparison match the website’s clean, professional typography (PR 8063). This supersedes the previous comparison workaround that put generic system-ui ahead of an incomplete Inter 800-only face. No size, weight, spacing, color, or layout token changes are made here.
