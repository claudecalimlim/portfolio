# claudecalimlim.vercel.app

Plain HTML, CSS and JavaScript. No build step.

## Files
- `index.html`: the page
- `styles.css`: all styling. Colours, type and spacing are CSS variables at the top, in three layers (primitive, semantic, component). The palette combines your two references: navy #0a1f3a, royal #143769, ice #c3dde4, mist #cdd7df, crimson #760f1e and rose #ca374d, with ocean, steel and sky from the first palette kept as primitives.
- `script.js`: light/dark toggle (top right, remembered per browser), infinite updates and projects carousels, phone menu, header name that appears after you scroll past the big name, copy-email button, Philippine local time in Contact
- `assets/fonts/`: Newsreader and Public Sans, self-hosted (SIL Open Font License)
- `assets/waveform.png`: GTKWave screenshot from the 8bit-mac-verilog repo
- `assets/og.png`: preview image used when the link is shared
- `cv/Claude-Calimlim-CV.pdf`: the CV behind every "Download CV" link

## To do
1. Add a photo as `assets/photo.jpg` (portrait, about 4:5). The About section shows it automatically; until then the slot stays hidden.
2. Replace `cv/Claude-Calimlim-CV.pdf` with your rewritten CV. Keep the same file name.
3. To add an update or a project, copy one `<li>` inside `#updates-track` or `#projects-track` in index.html.

4. Project thumbnails: save them in `assets/projects/` with the names listed in `assets/projects/README.txt`. Each card switches to its image automatically.

## Deploy on Vercel
Replace the old files in your portfolio repo with these, commit and push. Vercel redeploys on its own.

Map boundaries: NAMRIA and PSA via OCHA COD-AB (CC BY-IGO), from github.com/faeldon/philippines-json-maps.
