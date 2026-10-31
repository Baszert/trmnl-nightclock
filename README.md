# Nightclock (Nachtklok) for TRMNL

Tonight's sky as a window on your wall. A black screen with the real stars, the Milky Way and the planets where they stand, each planet's path through the night with the hours along it, over a little line-art horizon with trees and a house with a lit window. Plus when it gets truly dark, the moon, meteor showers and the clouds hour by hour.

## What you see

- **The sky** at 23:00, or as it is right now once it is dark. Looking south (north in the southern hemisphere), with stars at their real positions, the brightest ones named, and the well-known shapes drawn in fine dotted lines: Orion, the Plough, Cassiopeia, Pegasus, the Summer Triangle, the Southern Cross.
- **The Milky Way**, computed from the plane of the galaxy and drawn as thousands of dots.
- **Moon and planets** where they stand, with their dotted path through the night and the hours along it. Saturn with its ring, "at opposition" when it is. Only what is above the horizon at that moment gets a disc and a label; a planet that rises later keeps its dotted path with a small name, and its rise time is listed in the corner ("Rising later: Mars 01:10"). The moon's phase and rise or set time are in the corner too.
- **The timeline** from an hour before sunset to an hour after sunrise: how dark it is (twilight in dither patterns), a little star for every clear hour and a cloud for a cloudy one, and a pointer at the moment shown in the sky.
- **The words**: a verdict (clear night, partly clear, cloudy, clear with a bright moon), when it is truly dark, the moon, and the meteor shower that is active.

## Screens

All four sizes and portrait. On the TRMNL X the sky gets more height, larger type and soft grays for the Milky Way and constellation lines. On color screens the moon and Saturn turn yellow and Mars red.

## Settings

- **Location:** city search or `lat,lon`
- **Place name:** optional, shown at the top
- **Sky at:** auto (now when dark, otherwise 23:00), or 21:00, 22:00, 23:00, 00:00
- **Constellation lines** and **star names:** on or off
- **Language:** auto (follows your TRMNL account), English, Nederlands, Deutsch, Français, Español, Italiano, Português, Svenska, Dansk, Norsk, Polski, Suomi
- **Clock:** auto (12-hour for US English), 24-hour, 12-hour
- **Test date:** `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM`, to see another night

## Data and accuracy

- **Clouds:** [Open-Meteo](https://open-meteo.com), free, no key (the polling URL). If it fails the sky is still drawn.
- **Sun, twilight, moon:** after SunCalc. Checked against the US Naval Observatory for Utrecht on 12 October 2026: moonset 18:55 vs 18:56, sunset within 3 minutes.
- **Planets:** JPL approximate Keplerian elements (Standish), about one arcminute, valid 1800 to 2050.
- **Stars:** 67 bright stars (J2000), no precession; more than accurate enough for a picture.
- **Meteor showers:** the eight major showers from the IMO calendar.

Refresh: every hour is plenty, and makes the sky turn with the night when "Sky at" is auto.

## Development

The script lives in `dev/nachtklok.js` (readable) and the Liquid and CSS in `dev/shared.src.liquid`. Build `src/shared.liquid` from them:

```bash
node dev/build.mjs
```

Preview 12 nights around the world (Utrecht clear, cloudy and full moon, Brooklyn in 12-hour time, Sydney looking north, polar night in Tromsø with the Geminids, the Perseids in Madrid, midsummer in Helsinki and more) on every screen type:

```bash
cd dev && npm install && cd ..
node dev/preview.mjs --refresh
```

Then serve `preview/` and open it; add `?scenario=0&device=x&view=full&bare=1` for one clean screen, `dev/shoot.sh` makes screenshots.

Publish with `LANG=en_US.UTF-8 trmnlp push`.

## Links and license

- This is a TRMNL plugin (private plugin id 503919); the code here is what runs on TRMNL.
- Code: [MIT](LICENSE). Photos, images, maps and data belong to their sources, credited above and on the screen.
