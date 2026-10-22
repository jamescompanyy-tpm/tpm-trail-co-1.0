# TPM Trail Co. — tpmtrailco.com

Static site, no build step. Netlify deploys this repo (`main`) straight to
production. Pushing to `main` redeploys automatically.

```
index.html              home, and /journal (the Journal is a JS-swapped panel
                        on this page, kept at /journal via the History API)
trips.html              /trips — 2027 season trips + request form
gear.html               /gear — interactive packing list + rental request form
css/styles.css          all styles, design tokens at the top
js/main.js              cursor, nav, scroll reveal, toast, forms, page switch
js/blog.js              Journal rendering + CMS fetch
js/trips.js             trips rendering + request form
js/gear.js              gear list, saved selections, rental request form
data/trips-2027.json    trip data — edited through /admin
data/gear.json          gear items — edited through /admin
_posts/*.md             journal posts — edited through /admin
admin/                  Decap CMS
netlify/functions/      get-posts.js reads _posts from GitHub
```

---

## Editing the site in your browser

Go to **https://tpmtrailco.com/admin** and click **Login with GitHub**.

You'll see three collections in the sidebar: **Trail Journal**, **2027 Trips** and
**Gear List**.

Everything you save commits to this repo and triggers a Netlify redeploy.
Changes appear on the live site about a minute later — not instantly.

### Add a trip

1. Open **2027 Trips → 2027 Trip List**
2. Scroll to **Trips** and click **Add Trip**
3. Fill in whatever you know. **Every field is optional** — anything left
   blank shows as "TBA" on the page rather than breaking the layout
4. Click **Publish**

| Field | Notes |
|---|---|
| Trip name | Shown as the card heading |
| Experience type | Guided Hike — Half Day, Guided Hike — Full Day, Overnight Backpacking or Team Retreat. Drives the filter buttons |
| Location | Trail or area |
| State | CT, MA, NH or VT |
| Dates | One entry per date or range. Press Enter after each |
| Duration | Free text, e.g. `Half day`, `2 nights` |
| Difficulty / Distance / Elevation gain | Free text, write it however you like |
| Group size | Free text |
| Price per person | Flat price for this trip, e.g. `145`. Shown as `$145 / person` |
| Spots remaining | Optional. Blank hides the row instead of showing "TBA" |
| Trip detail or itinerary link | Optional. Adds a link on the card |
| Status | `open`, `waitlist` or `full` |

Prices live on the trip, not on the homepage — the homepage cards describe each
experience and link here.

**Status controls the button on each card:**

- `open` → "Request a spot"
- `waitlist` → "Join waitlist", and the request is labelled as a waitlist request
- `full` → no button, and the trip can't be selected in the form

### Edit, reorder or delete a trip

Same screen. Drag the handle on the left of a trip to reorder, click the trash
icon to delete, or click into any field to edit. Hit **Publish** when done.

### While the trip list is empty

The page shows "The 2027 trip lineup is being planned" and the form becomes a general interest
sign-up, so you still collect leads. It switches over automatically as soon as
one trip exists — nothing to toggle.

### Edit the gear list

**Gear List → Gear List.** One row per item on /gear.

| Field | Notes |
|---|---|
| Item name | Shown as the item, e.g. `Sleeping bag` |
| Note | Optional small print under the name |
| Category | The heading it's grouped under. Type an existing category *exactly* to add to that group — a new spelling starts a new group. Blank lands it under "Other gear" |
| Trip type | `day` shows on both Day Hike and Overnight · `overnight` shows on Overnight only |
| Available to rent from TPM | On = the "Rent from TPM" choice appears, and the item can be included in a rental request |
| Rental price | Optional. Blank shows as `TBA`. Free text, e.g. `$15 / trip` |

Two things worth knowing:

- An **overnight** item in the **Pack** category replaces the day pack, so an
  overnight trip only ever offers one pack. That is the one category where
  overnight items replace day items instead of adding to them.
- Visitors' selections are saved in their own browser, not here. Renaming an
  item loses whatever they had marked against the old name.

Rental requests arrive by email with the selected items listed — they're
requests, not bookings, and the page says a waiver is required before pickup.

### Write a journal post

**Trail Journal → New Post.** Links can be written as `[text](url)` or just
`<https://example.com>`; both render correctly. Avoid typing stray `<angle
brackets>` around anything that isn't a URL — they're treated as HTML and vanish.

---

## Where form submissions go

Both the trip request form and the booking form post to **Formspree**
(`maqvnqqd`), so everything lands in one inbox. They're distinguished by their
subject line:

- `2027 Trip Request — TPM Trail Co.`
- `New Booking Request — TPM Trail Co.`
- `New Trail List Signup — TPM Trail Co.` (newsletter, a separate form)

Submissions are **requests, not bookings** — no payment is taken anywhere on
the site.

---

## Running it locally

There's no build step, so you just need a static server on the repo root.
Serving over `file://` won't work — `trips.html` fetches `data/trips-2027.json`,
which browsers block on the file protocol.

```
powershell -NoProfile -File serve.ps1 -Port 3333
```

Then open `http://localhost:3333/`. The server mirrors Netlify's URL handling,
so `/trips` and `/journal` work locally the way they do in production.

Two things don't work locally:

- **The Journal** — `/.netlify/functions/get-posts` needs Netlify, so it 404s
  and the page falls back to an empty state. Expected.
- **Form submissions** — they post to live Formspree. Don't test by submitting
  unless you want a real email.

To test either properly, push to a branch and use the Netlify deploy preview.

---

## Netlify configuration

Environment variables (**Site configuration → Environment variables**) used by
`netlify/functions/get-posts.js`:

| Variable | Value |
|---|---|
| `GITHUB_TOKEN` | read-only personal access token |
| `GITHUB_OWNER` | `jamescompanyy-tpm` |
| `GITHUB_REPO` | `tpm-trail-co-1.0` |

`GITHUB_REPO`, the `repo:` line in `admin/config.yml`, and the repo Netlify
deploys from **must all name the same repository**, or posts save to one place
and get read from another.

CMS login uses a GitHub OAuth app, configured under **Site configuration →
Access & security → OAuth**. Its callback URL is
`https://api.netlify.com/auth/done`.
