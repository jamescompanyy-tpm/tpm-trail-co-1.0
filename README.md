# TPM Trail Co. — tpmtrailco.com

Static site, no build step. Netlify deploys this repo (`main`) straight to
production. Pushing to `main` redeploys automatically.

```
index.html              home (sections are JS-swapped with the Journal)
trips.html              /trips — 2027 season trips + request form
css/styles.css          all styles, design tokens at the top
js/main.js              cursor, nav, scroll reveal, toast, forms, page switch
js/blog.js              Journal rendering + CMS fetch
js/trips.js             trips rendering + request form
data/trips-2027.json    trip data — edited through /admin
_posts/*.md             journal posts — edited through /admin
admin/                  Decap CMS
netlify/functions/      get-posts.js reads _posts from GitHub
```

---

## Editing the site in your browser

Go to **https://tpmtrailco.com/admin** and click **Login with GitHub**.

You'll see two collections in the sidebar: **Trail Journal** and **2027 Trips**.

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
| Type | `day hike` or `overnight` — drives the filter buttons |
| State | CT, MA, NH or VT |
| Dates | One entry per date or range. Press Enter after each |
| Difficulty / Distance / Elevation gain | Free text, write it however you like |
| Max group size | Free text |
| Price per person | Free text, e.g. `$145` |
| Status | `open`, `waitlist` or `full` |

**Status controls the button on each card:**

- `open` → "Request this trip"
- `waitlist` → "Join waitlist", and the request is labelled as a waitlist request
- `full` → no button, and the trip can't be selected in the form

### Edit, reorder or delete a trip

Same screen. Drag the handle on the left of a trip to reorder, click the trash
icon to delete, or click into any field to edit. Hit **Publish** when done.

### While the trip list is empty

The page shows "2027 trips coming soon" and the form becomes a general interest
sign-up, so you still collect leads. It switches over automatically as soon as
one trip exists — nothing to toggle.

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

Then open `http://localhost:3333/trips.html`.

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
