# Valentine's Day App 💕

A personalized Valentine's Day web app with a love letter, photo album, and sweet messages for your partner.

## Customize for Your Love

Edit **`src/config.js`** to add your own photos, messages, and personal touches. No coding experience needed.

### What You Can Customize

| Setting | Description |
|---------|-------------|
| **recipientName** | Name shown on the landing page (e.g. "Hey Sairam.") |
| **landingSubtitle** | Subtitle under the name |
| **letterIntro** | Intro for the letter (e.g. "From your partner.") |
| **letterLines** | Each line of your love letter (appears one by one) |
| **reasons** | "Little things that make me love you more" — one per slide |
| **photos** | Photo filenames (place images in `public/photos/`) |
| **photoCaptions** | Caption for each photo (same order as photos) |
| **successMainMessage** | Message after they say Yes |
| **valentineMessage** | Your Valentine's Day message |
| **songPath** | Path to your love song (place in `public/songs/`) |

### Adding Photos

1. Add your image files to the `public/photos/` folder (e.g. `1.jpeg`, `2.jpeg`, or any filename)
2. Add the filenames to `config.photos` in `src/config.js`
3. Add a matching caption for each photo in `config.photoCaptions`

### Adding Your Song

Place your audio file (e.g. `love-song.mp3`) in `public/songs/` and set `songPath` in config.

---

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
