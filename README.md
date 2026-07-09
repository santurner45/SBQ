# Sugar Bunny Quinn — Personal Content Site

A one-page site combining a bio/landing page, an about section, a photo gallery,
a link-in-bio hub, and a contact form. Bubblegum pink, eggshell white, and
powder blue color palette.

## Structure

```
index.html      All page content/sections
css/style.css   Styling and color palette (see :root variables at the top)
js/script.js    Mobile nav toggle + contact form handling
```

## Customize it

1. **Name & branding** — replace every `Her Name` in `index.html` and the
   `<title>` tag.
2. **Photo** — swap the `.hero-photo-placeholder` div for an `<img>` tag
   pointing at a real photo.
3. **Bio** — edit the paragraph inside `<section class="about">`.
4. **Stats** — update the numbers in the `.stat-card` blocks (or delete the
   `.stats` block if you'd rather not show numbers).
5. **Gallery** — replace each `.gallery-item` `<div>` with an `<img>`, or keep
   them as placeholders until you have final images.
6. **Links** — update each `href="#"` in the `Links` section with your real
   profile/shop/subscription URLs.
7. **Contact form** — the form currently just shows a "thanks" message
   client-side. To actually receive messages, either:
   - Point the `<form>` at a service like [Formspree](https://formspree.io) or
     [Getform](https://getform.io) (add `action="https://formspree.io/f/yourid"
     method="POST"` to the `<form>` tag), or
   - Wire it to your own backend/API.
8. **Colors** — all colors are CSS variables at the top of `css/style.css`
   under `:root`. Adjust `--pink-bubblegum`, `--pink-strong`, `--pink-deep`,
   `--blue-powder`, `--blue-powder-deep`, and `--eggshell` to taste.

## Preview locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy

The site is static (no build step), so it works out of the box with:

- **GitHub Pages** — Settings → Pages → deploy from this branch/root.
- **Netlify / Vercel** — drag-and-drop the folder or connect the repo.
