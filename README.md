# Westcoast Rippers — Official Website

**Greymouth, West Coast, New Zealand**
4WD adventures, bar crossings, mud, rivers and rugged West Coast action.

---

## Project Structure

```
westcoast-rippers/
├── index.html              Main page
├── css/
│   └── style.css           All styles (CSS variables, responsive, animations)
├── js/
│   └── script.js           Navigation, lightbox, scroll behaviour
├── assets/
│   ├── images/
│   │   ├── hero.webp       Hero image — bar crossing in rough seas
│   │   ├── photo-1.webp    About/gallery — Resolution II at dawn
│   │   └── photo-2.webp    Gallery — double crossing
│   └── icons/
│       └── favicon.svg     Site favicon
└── README.md               This file
```

---

## Links

| Destination        | URL |
|--------------------|-----|
| YouTube            | https://www.youtube.com/@westcoastrippers9862 |
| TikTok             | https://www.tiktok.com/@westcoastrippers |
| Patreon            | https://www.patreon.com/c/WestcoastRippers |
| PayPal donations   | https://www.paypal.com/ncp/payment/8URRFA4R6GNRW |
| Giveaways / Email  | https://subscribepage.io/westcoastrippers |

---

## Running Locally

Open `index.html` in a modern browser.

No build tools, no framework, no dependencies beyond Google Fonts (loaded via CDN, falls back to system fonts if unavailable).

---

## Design Notes

- **Palette:** Near-black `#0A0C0A`, storm grey `#252922`, coastal green `#1A3426`, rust `#B85A18`, dirty cream `#CFC9B8`
- **Type:** Barlow Condensed (headings) + Inter (body)
- **Images:** All three supplied photos used at full resolution via `object-fit: cover`
- **Animations:** Hero fade-up on page load only; gallery hover effects; reduced motion respected via `prefers-reduced-motion`
- **Responsive:** Mobile hamburger menu, single-column layout below 768px, touch-friendly tap targets

---

© 2026 Westcoast Rippers
