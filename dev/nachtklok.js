/* Nachtklok: tonight's sky over a line-art horizon, the planets' paths through the night, and a
   timeline of darkness and clouds. Clouds come from Open-Meteo (polling URL); sun, moon, planets,
   stars and the Milky Way are computed here. Edit this file, then run: node dev/build.mjs */
!function () {
  var PI = Math.PI, rad = PI / 180, E = rad * 23.4397, sin = Math.sin, cos = Math.cos, H = 36e5;

  /* ---------- text ---------- */
  var L = {
    en: { tonight: 'tonight', sky: 'The sky at {t}, looking {d}', dark: 'Truly dark {a} to {b}', noDark: 'No real darkness tonight', clear: 'Clear night', clearMoon: 'Clear, bright moon', partly: 'Partly clear', cloudy: 'Cloudy',
      moon: 'Moon {p}%', mUp: 'up all night', mSet: 'sets {t}', mRise: 'rises {t}', mDown: 'below the horizon', later: 'Rising later: {l}', rises: 'rises {t}', opp: 'at opposition', peak: '{n} tonight', shower: '{n} · peak {d}',
      look: ['south', 'north'], dirs: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], setup: 'Set your location in the plugin settings',
      p: { moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn' },
      sh: ['Quadrantids', 'Lyrids', 'Eta Aquariids', 'Perseids', 'Draconids', 'Orionids', 'Leonids', 'Geminids'] },
    nl: { tonight: 'vannacht', sky: 'De hemel om {t}, kijkend naar het {d}', dark: 'Echt donker {a} tot {b}', noDark: 'Het wordt niet echt donker', clear: 'Heldere nacht', clearMoon: 'Helder, felle maan', partly: 'Deels helder', cloudy: 'Bewolkt',
      moon: 'Maan {p}%', mUp: 'de hele nacht op', mSet: 'onder {t}', mRise: 'op {t}', mDown: 'onder de horizon', later: 'Later op: {l}', rises: 'op {t}', opp: 'in oppositie', peak: '{n} vannacht', shower: '{n} · piek {d}',
      look: ['zuiden', 'noorden'], dirs: ['N', 'NO', 'O', 'ZO', 'Z', 'ZW', 'W', 'NW'], setup: 'Stel je locatie in bij de plugin-instellingen',
      p: { moon: 'Maan', mercury: 'Mercurius', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturnus' },
      sh: ['Quadrantiden', 'Lyriden', 'Eta-Aquariden', 'Perseïden', 'Draconiden', 'Orioniden', 'Leoniden', 'Geminiden'] },
    de: { tonight: 'heute Nacht', sky: 'Der Himmel um {t}, Blick nach {d}', dark: 'Richtig dunkel {a} bis {b}', noDark: 'Es wird nicht richtig dunkel', clear: 'Klare Nacht', clearMoon: 'Klar, heller Mond', partly: 'Teils klar', cloudy: 'Bewölkt',
      moon: 'Mond {p}%', mUp: 'die ganze Nacht', mSet: 'unter {t}', mRise: 'auf {t}', mDown: 'unter dem Horizont', later: 'Später: {l}', rises: 'auf {t}', opp: 'in Opposition', peak: '{n} heute Nacht', shower: '{n} · Maximum {d}',
      look: ['Süden', 'Norden'], dirs: ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'], setup: 'Lege deinen Standort in den Plugin-Einstellungen fest',
      p: { moon: 'Mond', mercury: 'Merkur', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn' },
      sh: ['Quadrantiden', 'Lyriden', 'Eta-Aquariiden', 'Perseiden', 'Draconiden', 'Orioniden', 'Leoniden', 'Geminiden'] },
    fr: { tonight: 'cette nuit', sky: 'Le ciel à {t}, vers le {d}', dark: 'Vraie nuit de {a} à {b}', noDark: 'Pas de vraie nuit noire', clear: 'Nuit claire', clearMoon: 'Clair, lune brillante', partly: 'Partiellement clair', cloudy: 'Nuageux',
      moon: 'Lune {p} %', mUp: 'toute la nuit', mSet: 'se couche {t}', mRise: 'se lève {t}', mDown: 'sous l’horizon', later: 'Plus tard : {l}', rises: 'lever {t}', opp: 'en opposition', peak: '{n} cette nuit', shower: '{n} · pic {d}',
      look: ['sud', 'nord'], dirs: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'], setup: 'Indiquez votre position dans les réglages du plugin',
      p: { moon: 'Lune', mercury: 'Mercure', venus: 'Vénus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturne' },
      sh: ['Quadrantides', 'Lyrides', 'Êta Aquarides', 'Perséides', 'Draconides', 'Orionides', 'Léonides', 'Géminides'] },
    es: { tonight: 'esta noche', sky: 'El cielo a las {t}, mirando al {d}', dark: 'Noche cerrada de {a} a {b}', noDark: 'No llega a oscurecer del todo', clear: 'Noche despejada', clearMoon: 'Despejado, luna brillante', partly: 'Parcialmente despejado', cloudy: 'Nublado',
      moon: 'Luna {p} %', mUp: 'toda la noche', mSet: 'se pone {t}', mRise: 'sale {t}', mDown: 'bajo el horizonte', later: 'Más tarde: {l}', rises: 'sale {t}', opp: 'en oposición', peak: '{n} esta noche', shower: '{n} · máximo {d}',
      look: ['sur', 'norte'], dirs: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'], setup: 'Indica tu ubicación en los ajustes del plugin',
      p: { moon: 'Luna', mercury: 'Mercurio', venus: 'Venus', mars: 'Marte', jupiter: 'Júpiter', saturn: 'Saturno' },
      sh: ['Cuadrántidas', 'Líridas', 'Eta Acuáridas', 'Perseidas', 'Dracónidas', 'Oriónidas', 'Leónidas', 'Gemínidas'] },
    it: { tonight: 'stanotte', sky: 'Il cielo alle {t}, verso {d}', dark: 'Buio pieno dalle {a} alle {b}', noDark: 'Non fa buio pieno', clear: 'Notte serena', clearMoon: 'Sereno, luna brillante', partly: 'Parzialmente sereno', cloudy: 'Nuvoloso',
      moon: 'Luna {p}%', mUp: 'tutta la notte', mSet: 'tramonta {t}', mRise: 'sorge {t}', mDown: 'sotto l’orizzonte', later: 'Più tardi: {l}', rises: 'sorge {t}', opp: 'in opposizione', peak: '{n} stanotte', shower: '{n} · picco {d}',
      look: ['sud', 'nord'], dirs: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'], setup: 'Imposta la tua posizione nelle impostazioni del plugin',
      p: { moon: 'Luna', mercury: 'Mercurio', venus: 'Venere', mars: 'Marte', jupiter: 'Giove', saturn: 'Saturno' },
      sh: ['Quadrantidi', 'Liridi', 'Eta Aquaridi', 'Perseidi', 'Draconidi', 'Orionidi', 'Leonidi', 'Geminidi'] },
    pt: { tonight: 'esta noite', sky: 'O céu às {t}, a olhar para {d}', dark: 'Noite escura das {a} às {b}', noDark: 'Não escurece por completo', clear: 'Noite limpa', clearMoon: 'Limpo, lua brilhante', partly: 'Parcialmente limpo', cloudy: 'Nublado',
      moon: 'Lua {p}%', mUp: 'toda a noite', mSet: 'põe-se {t}', mRise: 'nasce {t}', mDown: 'abaixo do horizonte', later: 'Mais tarde: {l}', rises: 'nasce {t}', opp: 'em oposição', peak: '{n} esta noite', shower: '{n} · pico {d}',
      look: ['sul', 'norte'], dirs: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'], setup: 'Defina a sua localização nas definições do plugin',
      p: { moon: 'Lua', mercury: 'Mercúrio', venus: 'Vénus', mars: 'Marte', jupiter: 'Júpiter', saturn: 'Saturno' },
      sh: ['Quadrântidas', 'Líridas', 'Eta Aquáridas', 'Perseidas', 'Dracónidas', 'Oriónidas', 'Leónidas', 'Gemínidas'] },
    sv: { tonight: 'i natt', sky: 'Himlen kl. {t}, mot {d}', dark: 'Riktigt mörkt {a} till {b}', noDark: 'Det blir inte riktigt mörkt', clear: 'Klar natt', clearMoon: 'Klart, stark måne', partly: 'Delvis klart', cloudy: 'Molnigt',
      moon: 'Månen {p} %', mUp: 'uppe hela natten', mSet: 'ner {t}', mRise: 'upp {t}', mDown: 'under horisonten', later: 'Senare: {l}', rises: 'upp {t}', opp: 'i opposition', peak: '{n} i natt', shower: '{n} · topp {d}',
      look: ['söder', 'norr'], dirs: ['N', 'NO', 'O', 'SO', 'S', 'SV', 'V', 'NV'], setup: 'Ange din plats i pluginens inställningar',
      p: { moon: 'Månen', mercury: 'Merkurius', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturnus' },
      sh: ['Kvadrantiderna', 'Lyriderna', 'Eta Akvariderna', 'Perseiderna', 'Drakoniderna', 'Orioniderna', 'Leoniderna', 'Geminiderna'] },
    da: { tonight: 'i nat', sky: 'Himlen kl. {t}, mod {d}', dark: 'Helt mørkt {a} til {b}', noDark: 'Det bliver ikke helt mørkt', clear: 'Klar nat', clearMoon: 'Klart, skarp måne', partly: 'Delvis klart', cloudy: 'Overskyet',
      moon: 'Månen {p} %', mUp: 'oppe hele natten', mSet: 'ned {t}', mRise: 'op {t}', mDown: 'under horisonten', later: 'Senere: {l}', rises: 'op {t}', opp: 'i opposition', peak: '{n} i nat', shower: '{n} · top {d}',
      look: ['syd', 'nord'], dirs: ['N', 'NØ', 'Ø', 'SØ', 'S', 'SV', 'V', 'NV'], setup: 'Angiv din placering i pluginets indstillinger',
      p: { moon: 'Månen', mercury: 'Merkur', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn' },
      sh: ['Kvadrantiderne', 'Lyriderne', 'Eta Aquariderne', 'Perseiderne', 'Drakoniderne', 'Orioniderne', 'Leoniderne', 'Geminiderne'] },
    nb: { tonight: 'i natt', sky: 'Himmelen kl. {t}, mot {d}', dark: 'Helt mørkt {a} til {b}', noDark: 'Det blir ikke helt mørkt', clear: 'Klar natt', clearMoon: 'Klart, sterk måne', partly: 'Delvis klart', cloudy: 'Overskyet',
      moon: 'Månen {p} %', mUp: 'oppe hele natten', mSet: 'ned {t}', mRise: 'opp {t}', mDown: 'under horisonten', later: 'Senere: {l}', rises: 'opp {t}', opp: 'i opposisjon', peak: '{n} i natt', shower: '{n} · topp {d}',
      look: ['sør', 'nord'], dirs: ['N', 'NØ', 'Ø', 'SØ', 'S', 'SV', 'V', 'NV'], setup: 'Angi stedet ditt i innstillingene for pluginen',
      p: { moon: 'Månen', mercury: 'Merkur', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn' },
      sh: ['Kvadrantidene', 'Lyridene', 'Eta Aquaridene', 'Perseidene', 'Drakonidene', 'Orionidene', 'Leonidene', 'Geminidene'] },
    pl: { tonight: 'dziś w nocy', sky: 'Niebo o {t}, widok na {d}', dark: 'Pełna ciemność {a}–{b}', noDark: 'Nie będzie w pełni ciemno', clear: 'Pogodna noc', clearMoon: 'Pogodnie, jasny Księżyc', partly: 'Częściowo pogodnie', cloudy: 'Pochmurno',
      moon: 'Księżyc {p}%', mUp: 'całą noc', mSet: 'zachód {t}', mRise: 'wschód {t}', mDown: 'pod horyzontem', later: 'Później: {l}', rises: 'wschód {t}', opp: 'w opozycji', peak: '{n} dziś w nocy', shower: '{n} · maksimum {d}',
      look: ['południe', 'północ'], dirs: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], setup: 'Ustaw lokalizację w ustawieniach wtyczki',
      p: { moon: 'Księżyc', mercury: 'Merkury', venus: 'Wenus', mars: 'Mars', jupiter: 'Jowisz', saturn: 'Saturn' },
      sh: ['Kwadrantydy', 'Lirydy', 'Eta Akwarydy', 'Perseidy', 'Drakonidy', 'Orionidy', 'Leonidy', 'Geminidy'] },
    fi: { tonight: 'tänä yönä', sky: 'Taivas klo {t}, katse kohti {d}', dark: 'Täysin pimeää {a}–{b}', noDark: 'Ei tule täysin pimeää', clear: 'Kirkas yö', clearMoon: 'Kirkasta, kirkas kuu', partly: 'Osittain selkeää', cloudy: 'Pilvistä',
      moon: 'Kuu {p} %', mUp: 'koko yön', mSet: 'laskee {t}', mRise: 'nousee {t}', mDown: 'horisontin alla', later: 'Myöhemmin: {l}', rises: 'nousee {t}', opp: 'oppositiossa', peak: '{n} tänä yönä', shower: '{n} · huippu {d}',
      look: ['etelää', 'pohjoista'], dirs: ['P', 'KO', 'I', 'KA', 'E', 'LO', 'L', 'LU'], setup: 'Aseta sijaintisi laajennuksen asetuksissa',
      p: { moon: 'Kuu', mercury: 'Merkurius', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturnus' },
      sh: ['Kvadrantidit', 'Lyridit', 'Eta Akvaridit', 'Perseidit', 'Drakonidit', 'Orionidit', 'Leonidit', 'Geminidit'] }
  };
  var LANG_NAMES = { english: 'en', nederlands: 'nl', dutch: 'nl', deutsch: 'de', german: 'de', francais: 'fr', french: 'fr', espanol: 'es', spanish: 'es', italiano: 'it', portugues: 'pt',
    svenska: 'sv', dansk: 'da', norsk: 'nb', no: 'nb', nn: 'nb', polski: 'pl', suomi: 'fi' };
  /* meteor showers (IMO): active from, to, peak (month-day), rate at peak */
  var SHOWERS = [['12-28', '01-12', '01-04', 110], ['04-14', '04-30', '04-22', 18], ['04-19', '05-28', '05-06', 50], ['07-17', '08-24', '08-12', 100],
    ['10-06', '10-10', '10-08', 10], ['10-02', '11-07', '10-21', 20], ['11-06', '11-30', '11-17', 15], ['12-04', '12-20', '12-14', 150]];

  /* bright stars, J2000: name, RA, Dec (degrees), magnitude */
  var STARS = [
    ['Sirius', 101.29, -16.72, -1.46], ['Canopus', 95.99, -52.7, -0.74], ['Rigil Kentaurus', 219.9, -60.83, -0.27], ['Arcturus', 213.92, 19.18, -0.05], ['Vega', 279.23, 38.78, 0.03],
    ['Capella', 79.17, 46.0, 0.08], ['Rigel', 78.63, -8.2, 0.13], ['Procyon', 114.83, 5.22, 0.34], ['Achernar', 24.43, -57.24, 0.46], ['Betelgeuse', 88.79, 7.41, 0.5],
    ['Hadar', 210.96, -60.37, 0.61], ['Altair', 297.7, 8.87, 0.77], ['Acrux', 186.65, -63.1, 0.77], ['Aldebaran', 68.98, 16.51, 0.85], ['Spica', 201.3, -11.16, 0.97],
    ['Antares', 247.35, -26.43, 1.06], ['Pollux', 116.33, 28.03, 1.14], ['Fomalhaut', 344.41, -29.62, 1.16], ['Deneb', 310.36, 45.28, 1.25], ['Mimosa', 191.93, -59.69, 1.25],
    ['Regulus', 152.09, 11.97, 1.35], ['Adhara', 104.66, -28.97, 1.5], ['Castor', 113.65, 31.89, 1.58], ['Gacrux', 187.79, -57.11, 1.63], ['Shaula', 263.4, -37.1, 1.62],
    ['Bellatrix', 81.28, 6.35, 1.64], ['Elnath', 81.57, 28.61, 1.65], ['Alnilam', 84.05, -1.2, 1.69], ['Alnitak', 85.19, -1.94, 1.77], ['Alioth', 193.51, 55.96, 1.77],
    ['Dubhe', 165.93, 61.75, 1.79], ['Mirfak', 51.08, 49.86, 1.79], ['Kaus Australis', 276.04, -34.38, 1.85], ['Alkaid', 206.89, 49.31, 1.86], ['Alhena', 99.43, 16.4, 1.93],
    ['Peacock', 306.41, -56.74, 1.94], ['Polaris', 37.95, 89.26, 1.98], ['Hamal', 31.79, 23.46, 2.0], ['Diphda', 10.9, -17.99, 2.04], ['Mirach', 17.43, 35.62, 2.05],
    ['Alpheratz', 2.1, 29.09, 2.06], ['Kochab', 222.68, 74.16, 2.08], ['Rasalhague', 263.73, 12.56, 2.08], ['Saiph', 86.94, -9.67, 2.09], ['Almach', 30.97, 42.33, 2.1],
    ['Algol', 47.04, 40.96, 2.12], ['Denebola', 177.26, 14.57, 2.13], ['Navi', 14.18, 60.72, 2.15], ['Sadr', 305.56, 40.26, 2.23], ['Mintaka', 83.0, -0.3, 2.23],
    ['Schedar', 10.13, 56.54, 2.24], ['Eltanin', 269.15, 51.49, 2.24], ['Mizar', 200.98, 54.93, 2.27], ['Caph', 2.29, 59.15, 2.28], ['Merak', 165.46, 56.38, 2.37],
    ['Enif', 326.05, 9.88, 2.39], ['Scheat', 345.94, 28.08, 2.42], ['Phecda', 178.46, 53.69, 2.44], ['Markab', 346.19, 15.21, 2.49], ['Menkar', 45.57, 4.09, 2.54],
    ['Ruchbah', 21.45, 60.24, 2.68], ['Algenib', 3.31, 15.18, 2.83], ['Alcyone', 56.87, 24.11, 2.87], ['Albireo', 292.68, 27.96, 3.05], ['Megrez', 183.86, 57.03, 3.31],
    ['Segin', 28.6, 63.67, 3.35], ['Imai', 183.79, -58.75, 2.79]
  ];
  var LINES = [
    ['Betelgeuse', 'Bellatrix'], ['Bellatrix', 'Mintaka'], ['Mintaka', 'Alnilam'], ['Alnilam', 'Alnitak'], ['Alnitak', 'Saiph'], ['Saiph', 'Rigel'], ['Rigel', 'Mintaka'], ['Betelgeuse', 'Alnitak'],
    ['Dubhe', 'Merak'], ['Merak', 'Phecda'], ['Phecda', 'Megrez'], ['Megrez', 'Dubhe'], ['Megrez', 'Alioth'], ['Alioth', 'Mizar'], ['Mizar', 'Alkaid'],
    ['Caph', 'Schedar'], ['Schedar', 'Navi'], ['Navi', 'Ruchbah'], ['Ruchbah', 'Segin'],
    ['Markab', 'Scheat'], ['Scheat', 'Alpheratz'], ['Alpheratz', 'Algenib'], ['Algenib', 'Markab'], ['Alpheratz', 'Mirach'], ['Mirach', 'Almach'],
    ['Deneb', 'Sadr'], ['Sadr', 'Albireo'], ['Vega', 'Deneb'], ['Deneb', 'Altair'], ['Altair', 'Vega'],
    ['Castor', 'Pollux'], ['Aldebaran', 'Elnath'], ['Mirfak', 'Algol'], ['Acrux', 'Gacrux'], ['Mimosa', 'Imai'], ['Rigil Kentaurus', 'Hadar']
  ];

  /* ---------- astronomy: sun and moon after SunCalc (V. Agafonkin, BSD); planets from the JPL
     approximate Keplerian elements (E. M. Standish, 1800 to 2050, about one arcminute) ---------- */
  function days(ms) { return ms / 864e5 - 10957.5; }
  function ra(l, b) { return Math.atan2(sin(l) * cos(E) - Math.tan(b) * sin(E), cos(l)); }
  function de(l, b) { return Math.asin(sin(b) * cos(E) + cos(b) * sin(E) * sin(l)); }
  function altAz(ms, lat, lon, r, d) {
    var Hh = rad * (280.16 + 360.9856235 * days(ms)) + rad * lon - r, p = rad * lat;
    var alt = Math.asin(sin(p) * sin(d) + cos(p) * cos(d) * cos(Hh));
    var az = Math.atan2(sin(Hh), cos(Hh) * sin(p) - Math.tan(d) * cos(p));
    return { alt: alt / rad, az: ((az / rad + 180) % 360 + 360) % 360 };
  }
  function sunC(d) {
    var M = rad * (357.5291 + 0.98560028 * d), Lg = M + rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)) + rad * 102.9372 + PI;
    return { dec: de(Lg, 0), ra: ra(Lg, 0) };
  }
  function moonC(d) {
    var Lm = rad * (218.316 + 13.176396 * d), M = rad * (134.963 + 13.064993 * d), F = rad * (93.272 + 13.22935 * d);
    var l = Lm + rad * 6.289 * sin(M), b = rad * 5.128 * sin(F);
    return { ra: ra(l, b), dec: de(l, b), dist: 385001 - 20905 * cos(M) };
  }
  function sunPos(ms, lat, lon) { var s = sunC(days(ms)); return altAz(ms, lat, lon, s.ra, s.dec); }
  function moonPos(ms, lat, lon) { var c = moonC(days(ms)), p = altAz(ms, lat, lon, c.ra, c.dec); p.alt -= 0.95 * cos(p.alt * rad); return p; }
  function moonPhase(ms) {
    var d = days(ms), s = sunC(d), m = moonC(d), sd = 149598000;
    var phi = Math.acos(sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra));
    var inc = Math.atan2(sd * sin(phi), m.dist - sd * cos(phi));
    var ang = Math.atan2(cos(s.dec) * sin(s.ra - m.ra), sin(s.dec) * cos(m.dec) - cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra));
    return { f: (1 + cos(inc)) / 2, p: 0.5 + 0.5 * inc * (ang < 0 ? -1 : 1) / PI };
  }
  var EL = {
    mercury: [0.38709927, 0.20563593, 7.00497902, 252.2503235, 77.45779628, 48.33076593, 0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081],
    venus: [0.72333566, 0.00677672, 3.39467605, 181.9790995, 131.60246718, 76.67984255, 0.0000039, -0.00004107, -0.0007889, 58517.81538729, 0.00268329, -0.27769418],
    earth: [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0, 0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0],
    mars: [1.52371034, 0.0933941, 1.84969142, -4.55343205, -23.94362959, 49.55953891, 0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
    jupiter: [5.202887, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909, -0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106],
    saturn: [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448, -0.0012506, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794]
  };
  function helio(n, d) {
    var k = EL[n], T = d / 36525, a = k[0] + k[6] * T, e = k[1] + k[7] * T, I = rad * (k[2] + k[8] * T), Lm = k[3] + k[9] * T, wb = k[4] + k[10] * T, Om = k[5] + k[11] * T;
    var w = rad * (wb - Om), M = rad * (((Lm - wb) % 360 + 540) % 360 - 180), Ea = M + e * sin(M);
    for (var i = 0; i < 6; i++) Ea -= (Ea - e * sin(Ea) - M) / (1 - e * cos(Ea));
    var xp = a * (cos(Ea) - e), yp = a * Math.sqrt(1 - e * e) * sin(Ea), O = rad * Om;
    return { x: (cos(w) * cos(O) - sin(w) * sin(O) * cos(I)) * xp + (-sin(w) * cos(O) - cos(w) * sin(O) * cos(I)) * yp,
      y: (cos(w) * sin(O) + sin(w) * cos(O) * cos(I)) * xp + (-sin(w) * sin(O) + cos(w) * cos(O) * cos(I)) * yp, z: sin(w) * sin(I) * xp + cos(w) * sin(I) * yp };
  }
  function planetPos(n, ms, lat, lon) {
    var d = days(ms), p = helio(n, d), e = helio('earth', d), x = p.x - e.x, y = p.y - e.y, z = p.z - e.z;
    var ye = y * cos(E) - z * sin(E), ze = y * sin(E) + z * cos(E), dist = Math.sqrt(x * x + y * y + z * z);
    var pos = altAz(ms, lat, lon, Math.atan2(ye, x), Math.asin(ze / dist)), s = sunC(d);
    pos.elong = Math.acos((x * cos(s.dec) * cos(s.ra) + ye * cos(s.dec) * sin(s.ra) + ze * sin(s.dec)) / dist) / rad;
    return pos;
  }
  function starPos(ms, lat, lon, r, d) { return altAz(ms, lat, lon, r * rad, d * rad); }

  /* ---------- helpers ---------- */
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim(); }
  function fill(s, o) { return s.replace(/\{(\w)\}/g, function (m, k) { return o[k]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function f(n) { return Math.round(n * 10) / 10; }
  function rnd(seed) { seed = Math.abs(Math.round(seed)) % 2147483646 + 1; return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  function el(tag, at, parent) { var e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (var k in at) e.setAttribute(k, at[k]); if (parent) parent.appendChild(e); return e; }
  function put(root, k, v) { root.querySelectorAll('[data-nk="' + k + '"]').forEach(function (n) { n.textContent = v || ''; n.classList.toggle('hidden', !v); }); }
  function cross(fn, t0, t1, up) {
    var a = fn(t0);
    for (var t = t0 + 6e5; t <= t1; t += 6e5) {
      var b = fn(t);
      if ((a < 0) !== (b < 0) && (b > a) === up) { var lo = t - 6e5, hi = t; for (var i = 0; i < 14; i++) { var m = (lo + hi) / 2; if ((fn(m) < 0) === (a < 0)) lo = m; else hi = m; } return hi; }
      a = b;
    }
    return null;
  }

  /* ---------- tonight ---------- */
  function build(D, now, cfg) {
    var T = L[cfg.lang], lat = D.lat, lon = D.lon, off = (D.off || 0) * 1000;
    var fmtT = function (t) { var d = new Date(t + off), h = d.getUTCHours(), m = pad(d.getUTCMinutes()); return cfg.h12 ? ((h + 11) % 12 + 1) + ':' + m + (h < 12 ? ' am' : ' pm') : pad(h) + ':' + m; };
    var hourLabel = function (t) { var h = new Date(t + off).getUTCHours(); return cfg.h12 ? ((h + 11) % 12 + 1) + (h < 12 ? 'a' : 'p') : pad(h); };
    var sunAlt = function (t) { return sunPos(t, lat, lon).alt; };
    // before 09:00 the night that is still going on, later the coming night
    var lt = new Date(now + off), noon = Date.UTC(lt.getUTCFullYear(), lt.getUTCMonth(), lt.getUTCDate(), 12) - off - (lt.getUTCHours() < 9 ? 864e5 : 0);
    var set = cross(function (t) { return sunAlt(t) + 0.833; }, noon, noon + 16 * H, false);
    var rise = set && cross(function (t) { return sunAlt(t) + 0.833; }, set, set + 22 * H, true);
    if (!set || !rise) { set = noon + 6 * H; rise = noon + 18 * H; }   // polar day or night: show the evening and night hours
    // twilight edges; in polar night the sun can already be that deep at the start of the evening
    var edge = function (deg, up) {
      var a = up ? noon + 12 * H : noon, b = a + 16 * H, fn = function (t) { return sunAlt(t) + deg; };
      if (fn(up ? b : a) < 0) return up ? b - 4 * H : a + 4 * H;   // polar night: dark from the early evening
      return cross(fn, a, b, up);
    };
    var duskA = edge(18, false), dawnA = edge(18, true), duskN = edge(12, false), dawnN = edge(12, true);
    var d0 = duskA || duskN || set + H, d1 = dawnA || dawnN || rise - H;
    // the moment shown: now when it is dark, otherwise the chosen evening hour (23:00) inside the dark hours
    var want = cfg.moment === 'auto' || !cfg.moment ? 23 : +cfg.moment;
    var at = noon + (want < 12 ? want + 12 : want - 12) * H;
    if (cfg.moment === 'auto' && now > d0 && now < d1) at = now;
    at = Math.max(Math.min(d0 + 0.5 * H, d1), Math.min(d1, at));

    var hours = [];
    var hh = D.h || {}, times = hh.time || [], cc = hh.cloud_cover || [];
    times.forEach(function (t, i) { t *= 1000; if (t >= set - H && t <= rise + H && cc[i] != null) hours.push({ t: t, c: cc[i] }); });
    var darkH = hours.filter(function (x) { return x.t >= d0 && x.t <= d1; }), clear = darkH.length ? darkH.filter(function (x) { return x.c < 35; }).length / darkH.length : 1;
    var ph = moonPhase(at), pct = Math.round(ph.f * 100);

    // moon: up or down during the night
    var mt = [];
    for (var t = Math.ceil(set / 6e5) * 6e5; t <= rise; t += 6e5) mt.push({ t: t, up: moonPos(t, lat, lon).alt > 0 });
    var upN = mt.filter(function (x) { return x.up; }), moonText;
    if (!upN.length) moonText = T.mDown;
    else if (upN.length === mt.length) moonText = T.mUp;
    else if (mt[0].up) moonText = fill(T.mSet, { t: fmtT(upN[upN.length - 1].t) });
    else moonText = fill(T.mRise, { t: fmtT(upN[0].t) });
    var moonBright = ph.f > 0.6 && upN.length > mt.length / 2;

    // meteor shower
    var md = new Date(at + off), mmdd = pad(md.getUTCMonth() + 1) + '-' + pad(md.getUTCDate()), shower = '';
    SHOWERS.forEach(function (s, i) {
      var on = s[0] <= s[1] ? mmdd >= s[0] && mmdd <= s[1] : mmdd >= s[0] || mmdd <= s[1];
      if (!on) return;
      var pk = new Date(Date.UTC(md.getUTCFullYear(), +s[2].slice(0, 2) - 1, +s[2].slice(3)));
      shower = s[2] === mmdd ? fill(T.peak, { n: T.sh[i] }) : fill(T.shower, { n: T.sh[i], d: new Intl.DateTimeFormat(cfg.locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(pk) });
    });

    // planets that are still below the horizon at the moment shown but rise later in a dark sky
    var risers = [];
    ['venus', 'jupiter', 'mars', 'saturn', 'mercury'].forEach(function (k) {
      if (planetPos(k, at, lat, lon).alt > 0) return;
      var rt = cross(function (t) { return planetPos(k, t, lat, lon).alt; }, at, rise, true);
      if (!rt) return;
      var good = 0;
      for (var t = rt; t <= rise; t += 6e5) if (planetPos(k, t, lat, lon).alt > 8 && sunAlt(t) < -8) good++;
      if (good >= 3) risers.push({ t: rt, n: T.p[k] });
    });
    risers.sort(function (a, b) { return a.t - b.t; });

    var verdict = !hours.length ? '' : clear > 0.8 ? (moonBright ? T.clearMoon : T.clear) : clear > 0.3 ? T.partly : T.cloudy;
    var south = lat < 0;
    return {
      T: T, cfg: cfg, lat: lat, lon: lon, off: off, now: now, set: set, rise: rise, d0: d0, d1: d1, at: at, hours: hours, ph: ph, pct: pct, south: south,
      fmtT: fmtT, hourLabel: hourLabel, sunAlt: sunAlt,
      text: {
        kicker: (cfg.place ? cfg.place + ' · ' : '') + T.tonight + ' · ' + new Intl.DateTimeFormat(cfg.locale, { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(set + off)),
        verdict: verdict || cap(T.tonight),
        sub: fill(T.sky, { t: fmtT(at), d: T.look[south ? 1 : 0] }),
        dark: duskA ? fill(T.dark, { a: fmtT(duskA), b: fmtT(dawnA) }) : T.noDark,
        moon: fill(T.moon, { p: pct }) + ' · ' + moonText,
        later: risers.length ? fill(T.later, { l: risers.map(function (r) { return r.n + ' ' + fmtT(r.t); }).join(' · ') }) : '',
        shower: shower
      }
    };
  }

  /* ---------- palette per screen ---------- */
  function palette(root) {
    var cls = (root.closest('.screen') || {}).className || '', bits = /screen--1bit/.test(cls) ? 1 : /screen--2bit/.test(cls) ? 2 : /screen--color-/.test(cls) ? 0 : 4;
    var P = { bits: bits, ink: '#fff', line: '#fff', faint: '#fff', mw: '#fff', color: bits === 0 };
    if (bits === 4) { P.line = '#9a9a9a'; P.faint = '#6e6e6e'; P.mw = '#8a8a8a'; }
    if (bits === 2) { P.line = '#aaa'; P.faint = '#aaa'; P.mw = '#aaa'; }
    return P;
  }

  /* ---------- the sky ---------- */
  function draw(root, M, P, lg) {
    var svg = root.querySelector('.nk-svg'), W = Math.round(root.clientWidth), HH = Math.round(root.clientHeight), view = root.dataset.view;
    if (!W || !HH) return;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + HH); svg.setAttribute('width', W); svg.setAttribute('height', HH);
    svg.setAttribute('font-family', '"Inter Variable", Inter, "Helvetica Neue", Arial, sans-serif');
    svg.innerHTML = '';
    var u = lg ? 1.3 : 1, fs = function (n) { return f(n * u); };
    var lat = M.lat, lon = M.lon, at = M.at, T = M.T;
    var defs = el('defs', {}, svg);
    function pat(id, size, cells) { var p = el('pattern', { id: id, width: size, height: size, patternUnits: 'userSpaceOnUse' }, defs); el('rect', { width: size, height: size, fill: '#000' }, p); cells.forEach(function (c) { el('rect', { x: c[0], y: c[1], width: 1, height: 1, fill: '#fff' }, p); }); }
    pat('nk12', 4, [[0, 0], [2, 2]]); pat('nk25', 2, [[0, 0]]); pat('nk50', 2, [[0, 0], [1, 1]]);
    el('rect', { width: W, height: HH, fill: '#000' }, svg);

    // layout per view: where the horizon and the timeline sit
    var small = view === 'quadrant', line = view !== 'quadrant';
    var TLH = line ? Math.round((view === 'half_horizontal' ? 42 : 62) * u) : 0;
    var HOR = Math.round(HH - TLH - (small ? 26 : 40) * u);
    var top = 6, skyH = HOR - top, KY = skyH / 86;
    var center = M.south ? 0 : 180, span = Math.min(290, Math.max(110, W / (KY / 1.25)));
    var KX = W / span, AZ0 = center - span / 2;
    var azd = function (az) { var d = ((az - AZ0) % 360 + 360) % 360; return d; };
    var X = function (az) { return azd(az) * KX; }, Y = function (alt) { return HOR - Math.min(alt, 88) * KY; };
    var onSky = function (p) { return p.alt > 0 && azd(p.az) < span; };

    // keep stars and lines out of the text blocks
    var boxes = [], rb = root.getBoundingClientRect(), scale = W / (rb.width || W);
    root.querySelectorAll('.nk-head, .nk-meta').forEach(function (b) {
      if (b.classList.contains('hidden')) return;
      var r = b.getBoundingClientRect(); if (!r.width) return;
      boxes.push({ x0: (r.left - rb.left) * scale - 8, y0: (r.top - rb.top) * scale - 6, x1: (r.right - rb.left) * scale + 8, y1: (r.bottom - rb.top) * scale + 6 });
    });
    var free = function (x, y) { return !boxes.some(function (b) { return x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1; }); };

    // faint altitude lines at 30 and 60 degrees
    [30, 60].forEach(function (a) { if (Y(a) > top + 4) el('line', { x1: 0, y1: f(Y(a)), x2: W, y2: f(Y(a)), stroke: P.faint, 'stroke-width': 1, 'stroke-dasharray': '1 ' + Math.round(7 * u) }, svg); });

    // the Milky Way: dots scattered around the galactic plane, densest towards Cygnus and Sagittarius
    var mw = [], RAG = 192.85948, DEG = 27.12825 * rad, LN = 122.93192;
    for (var gl = 0; gl <= 360; gl += 2) {
      var dl = (LN - gl) * rad, dec = Math.asin(cos(DEG) * cos(dl)), r2 = RAG + Math.atan2(sin(dl), -sin(DEG) * cos(dl)) / rad;
      var p = starPos(at, lat, lon, ((r2 % 360) + 360) % 360, dec / rad);
      mw.push(p.alt > -3 && azd(p.az) < span + 6 ? { x: X(p.az), y: Y(Math.max(0, p.alt)), b: 0.45 + 0.55 * Math.max(0, cos((gl - 30) * rad)) } : null);
    }
    var MR = rnd(97 + lat * 13);
    for (var m2 = 1; m2 < mw.length; m2++) {
      var a2 = mw[m2 - 1], b2 = mw[m2]; if (!a2 || !b2 || Math.abs(a2.x - b2.x) > W / 4) continue;
      var dx = b2.x - a2.x, dy = b2.y - a2.y, len = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / len, ny = dx / len, wd = (20 + 28 * b2.b) * u;
      var n = Math.round(len * (0.8 + 1.5 * b2.b) * (small ? 0.7 : 1));
      for (var k2 = 0; k2 < n; k2++) {
        var uu = MR(), g = (MR() + MR() + MR() - 1.5) / 1.5, wob = sin((m2 + uu) * 0.9) * 6 * u;
        var px = a2.x + dx * uu + nx * (g * wd + wob), py = a2.y + dy * uu + ny * (g * wd + wob);
        if (py > HOR - 3 || py < 0 || px < 0 || px > W || !free(px, py)) continue;
        el('rect', { x: f(px), y: f(py), width: 1, height: 1, fill: P.mw }, svg);
      }
    }

    // stars, constellation lines and the brightest names
    var pos = {};
    STARS.forEach(function (s) { var p = starPos(at, lat, lon, s[1], s[2]); if (onSky(p)) pos[s[0]] = { x: X(p.az), y: Y(p.alt), m: s[3] }; });
    if (M.cfg.lines) LINES.forEach(function (l) {
      var a = pos[l[0]], b = pos[l[1]];
      if (a && b && Math.abs(a.x - b.x) < W / 3 && free(a.x, a.y) && free(b.x, b.y)) el('line', { x1: f(a.x), y1: f(a.y), x2: f(b.x), y2: f(b.y), stroke: P.line, 'stroke-width': 1, 'stroke-dasharray': '2 2.5' }, svg);
    });
    var named = 0, nameBoxes = [];
    Object.keys(pos).sort(function (a, b) { return pos[a].m - pos[b].m; }).forEach(function (k) {
      var s = pos[k]; if (!free(s.x, s.y)) return;
      var r = Math.max(1, (3.4 - s.m * 0.9) * (lg ? 1.2 : 1));
      el('circle', { cx: f(s.x), cy: f(s.y), r: f(r), fill: s.m < 2.3 || P.bits < 4 ? P.ink : P.line }, svg);
      if (s.m < 0.6) [[1, 0], [0, 1]].forEach(function (d) { el('line', { x1: f(s.x - d[0] * r * 2.6), y1: f(s.y - d[1] * r * 2.6), x2: f(s.x + d[0] * r * 2.6), y2: f(s.y + d[1] * r * 2.6), stroke: P.ink, 'stroke-width': 1 }, svg); });
      if (M.cfg.names && s.m < 1.0 && named < (small ? 2 : view === 'half_horizontal' ? 0 : 6) && free(s.x + 50 * u, s.y - 8) && s.y > 14) {
        named++;
        el('text', { x: f(s.x + r + 5), y: f(s.y - r - 3), 'font-size': fs(10), fill: P.ink, class: 'nk-t2' }, svg).textContent = k;
        nameBoxes.push({ x0: s.x, y0: s.y - r - 13 * u, x1: s.x + r + 8 + k.length * 6 * u, y1: s.y - r + 1 });
      }
    });
    // faint background stars, fixed per place
    var R = rnd(Math.abs(lat * 1000 + lon * 7) + 11);
    for (var i = 0; i < W * HOR / 2000; i++) { var x = R() * W, y = R() * (HOR - 8); if (free(x, y)) el('rect', { x: f(x), y: f(y), width: 1, height: 1, fill: P.line }, svg); }

    // horizon: line-art hills, trees and a little house with a lit window
    var hz = [], HR = rnd(Math.abs(lon * 1000) + 3), ph1 = HR() * 6, ph2 = HR() * 6, amp = small ? 0.6 : 1;
    for (var xx = 0; xx <= W + 4; xx += 4) hz.push([xx, HOR + 4 * u - amp * u * (6 * sin(xx / (97 * u) + ph1) + 4 * sin(xx / (41 * u) + ph2))]);
    var hy = function (x) { return hz[Math.min(hz.length - 1, Math.max(0, Math.round(x / 4)))][1]; };
    el('path', { d: 'M0 ' + HH + ' L' + hz.map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join(' L') + ' L' + W + ' ' + HH + 'Z', fill: '#000' }, svg);
    el('path', { d: 'M' + hz.map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join(' L'), fill: 'none', stroke: P.ink, 'stroke-width': f(2 * u), 'stroke-linejoin': 'round' }, svg);
    var sw = f(1.6 * u), TR = rnd(Math.abs(lat * 977) + 5), tx = 18 * u, house = W * (0.62 + TR() * 0.12);
    while (tx < W - 10) {
      if (Math.abs(tx - house) > 30 * u) {
        var b = hy(tx), h = (14 + TR() * 14) * u * (small ? 0.75 : 1), con = TR() < 0.35;
        el('line', { x1: f(tx), y1: f(b), x2: f(tx), y2: f(b - h * 0.35), stroke: P.ink, 'stroke-width': sw }, svg);
        if (con) el('path', { d: 'M' + f(tx - h * 0.28) + ' ' + f(b - h * 0.3) + ' L' + f(tx) + ' ' + f(b - h) + ' L' + f(tx + h * 0.28) + ' ' + f(b - h * 0.3) + 'Z', fill: '#000', stroke: P.ink, 'stroke-width': sw, 'stroke-linejoin': 'round' }, svg);
        else el('ellipse', { cx: f(tx), cy: f(b - h * 0.62), rx: f(h * 0.3), ry: f(h * 0.36), fill: '#000', stroke: P.ink, 'stroke-width': sw }, svg);
      }
      tx += TR() < 0.45 ? (14 + TR() * 8) * u : (60 + TR() * 140) * u;
    }
    var hb = hy(house), s14 = 14 * u;
    el('path', { d: 'M' + f(house - s14) + ' ' + f(hb) + ' L' + f(house - s14) + ' ' + f(hb - s14) + ' L' + f(house) + ' ' + f(hb - 26 * u) + ' L' + f(house + s14) + ' ' + f(hb - s14) + ' L' + f(house + s14) + ' ' + f(hb), fill: '#000', stroke: P.ink, 'stroke-width': sw, 'stroke-linejoin': 'round' }, svg);
    el('rect', { x: f(house - 7 * u), y: f(hb - 11 * u), width: f(6 * u), height: f(6 * u), fill: P.ink }, svg);
    el('line', { x1: f(house + 7 * u), y1: f(hb - 23 * u), x2: f(house + 7 * u), y2: f(hb - 30 * u), stroke: P.ink, 'stroke-width': f(3 * u) }, svg);
    for (var di = 0; di < 8; di++) {
      var dz = di * 45; if (azd(dz) > span) continue;
      var dxp = X(dz); if (dxp < 10 || dxp > W - 10) continue;
      el('text', { x: f(dxp), y: f(HOR + (small ? 16 : 24) * u), 'text-anchor': 'middle', 'font-size': fs(small ? 10 : 12), 'font-weight': 700, fill: P.ink, 'letter-spacing': 1, class: 'nk-t2' }, svg).textContent = T.dirs[di];
    }

    // moon and planets: dotted path through the night with hour marks; a disc only while above the horizon
    var labels = [], cand = [], pathNames = [], NAMES = T.p, SIZE = { venus: 6, jupiter: 5.2, mars: 4, saturn: 4.2, mercury: 3 };
    ['moon', 'venus', 'jupiter', 'mars', 'saturn', 'mercury'].forEach(function (k) {
      var get = function (t) { return k === 'moon' ? moonPos(t, lat, lon) : planetPos(k, t, lat, lon); };
      var path = [], seen = 0;
      for (var t = Math.ceil(M.set / 6e5) * 6e5; t <= M.rise; t += 6e5) {
        var p = get(t);
        if (onSky(p)) { path.push({ t: t, x: X(p.az), y: Y(p.alt) }); if (p.alt > 8 && M.sunAlt(t) < -8) seen++; }
      }
      var cur = get(at), up = onSky(cur);
      if (k === 'moon' && !up) return;                    // a moon below the horizon is not drawn at all
      if (k !== 'moon' && seen < 3) return;               // planets need half an hour in a dark sky
      if (!path.length) return;
      // break the path where it leaves the view (azimuth wrap)
      var d = '', prev = null;
      path.forEach(function (p) { d += (prev && Math.abs(p.x - prev.x) < W / 4 ? ' L' : ' M') + f(p.x) + ' ' + f(p.y); prev = p; });
      el('path', { d: d, fill: 'none', stroke: P.ink, 'stroke-width': f(1.4 * u), 'stroke-dasharray': '1.5 ' + f(4 * u), 'stroke-linecap': 'round' }, svg);
      if (!small) path.forEach(function (p) {
        var m = new Date(p.t + M.off); if (m.getUTCMinutes() !== 0 || m.getUTCHours() % 2) return;
        cand.push(p);
      });
      if (!up) { pathNames.push({ name: NAMES[k], path: path }); return; }   // below the horizon now: a small name along its path; rise times are in the text
      var x0 = X(cur.az), y0 = Y(cur.alt), sub = '';
      if (k === 'moon') moonDisc(svg, x0, y0, 11 * u, M.ph, M.south, P);
      else {
        var r = SIZE[k] * u;
        el('circle', { cx: f(x0), cy: f(y0), r: f(r + 4 * u), fill: '#000' }, svg);
        el('circle', { cx: f(x0), cy: f(y0), r: f(r), fill: P.ink, class: 'nk-p nk-p--' + k }, svg);
        if (k === 'saturn') el('ellipse', { cx: f(x0), cy: f(y0), rx: f(r * 2.1), ry: f(r * 0.7), fill: 'none', stroke: P.ink, 'stroke-width': f(1.3 * u), transform: 'rotate(-18 ' + f(x0) + ' ' + f(y0) + ')', class: 'nk-ring' }, svg);
      }
      if (k === 'moon') sub = M.pct + '%';
      else if (cur.elong > 165) sub = T.opp;
      labels.push({ x: x0, y: y0, name: NAMES[k], sub: sub, r: (k === 'moon' ? 13 : SIZE[k] + 5) * u });
    });
    var labBoxes = [];
    labels.sort(function (a, b) { return b.y - a.y; }).forEach(function (l, i, all) {
      l.ly = Math.min(l.y, HOR - (l.sub ? 30 : 16) * u);
      for (var q = 0; q < i; q++) if (Math.abs(all[q].x - l.x) < 120 * u && Math.abs(all[q].ly - l.ly) < 30 * u) l.ly = all[q].ly - 32 * u;
      var right = l.x < W - 120 * u, x = l.x + (right ? l.r + 6 * u : -l.r - 6 * u), anchor = right ? 'start' : 'end';
      var big = small || view === 'half_horizontal' ? 12 : 15;
      var t1 = el('text', { x: f(x), y: f(l.ly - 2 * u), 'text-anchor': anchor, 'font-size': fs(big), 'font-weight': 700, class: 'nk-t1', fill: P.ink, stroke: '#000', 'stroke-width': f(4 * u), 'paint-order': 'stroke' }, svg); t1.textContent = l.name;
      var t2 = l.sub && el('text', { x: f(x), y: f(l.ly + (big - 2) * u), 'text-anchor': anchor, 'font-size': fs(small ? 10 : 11), 'font-weight': 500, class: 'nk-t2', fill: P.ink, stroke: '#000', 'stroke-width': f(4 * u), 'paint-order': 'stroke' }, svg); if (t2) t2.textContent = l.sub;
      [t1, t2].forEach(function (te) { if (!te) return; var bb = te.getBBox(); labBoxes.push({ x0: bb.x - 4, y0: bb.y - 2, x1: bb.x + bb.width + 4, y1: bb.y + bb.height + 2 }); });
      labBoxes.push({ x0: l.x - l.r - 4, y0: l.y - l.r - 4, x1: l.x + l.r + 4, y1: l.y + l.r + 4 });
    });
    // names for paths whose planet is below the horizon now: at the first free spot from the end of the path
    var clear = function (b) { return b.x0 > 4 && b.x1 < W - 4 && b.y0 > 4 && b.y1 < HOR - 16 * u && free(b.x0, b.y0) && free(b.x1, b.y1) &&
      !labBoxes.concat(nameBoxes).some(function (o) { return b.x0 < o.x1 && b.x1 > o.x0 && b.y0 < o.y1 && b.y1 > o.y0; }); };
    pathNames.forEach(function (pn) {
      for (var i = pn.path.length - 1; i >= 0; i -= 2) {
        var p = pn.path[i];
        for (var side = 0; side < 2; side++) {
          var tEl = el('text', { x: f(p.x + (side ? -8 : 8) * u), y: f(p.y - 9 * u), 'text-anchor': side ? 'end' : 'start', 'font-size': fs(12), 'font-weight': 700, class: 'nk-t1', fill: P.ink, stroke: '#000', 'stroke-width': f(4 * u), 'paint-order': 'stroke' }, svg);
          tEl.textContent = pn.name;
          var bb = tEl.getBBox(), bx = { x0: bb.x - 3, y0: bb.y - 2, x1: bb.x + bb.width + 3, y1: bb.y + bb.height + 2 };
          if (clear(bx)) { labBoxes.push(bx); return; }
          svg.removeChild(tEl);
        }
      }
    });
    // hour marks along the paths, only where they have room
    var ticks = [], hit = function (bx, x, y) { return bx.some(function (b) { return x > b.x0 - 10 * u && x < b.x1 + 10 * u && y > b.y0 - 12 * u && y < b.y1 + 14 * u; }); };
    cand.forEach(function (p) {
      if (p.x < 26 * u || p.x > W - 26 * u || p.y > HOR - 22 * u || !free(p.x, p.y + 10 * u)) return;
      if (hit(labBoxes, p.x, p.y) || hit(nameBoxes, p.x, p.y) || ticks.some(function (q) { return Math.abs(q[0] - p.x) < 28 * u && Math.abs(q[1] - p.y) < 20 * u; })) return;
      ticks.push([p.x, p.y]);
      el('line', { x1: f(p.x), y1: f(p.y - 3 * u), x2: f(p.x), y2: f(p.y + 3 * u), stroke: P.ink, 'stroke-width': f(1.2 * u) }, svg);
      el('text', { x: f(p.x), y: f(p.y + 13 * u), 'text-anchor': 'middle', 'font-size': fs(10), 'font-weight': 600, class: 'nk-t2', fill: P.ink, stroke: '#000', 'stroke-width': f(3 * u), 'paint-order': 'stroke' }, svg).textContent = M.hourLabel(p.t);
    });

    // timeline: darkness and clouds from an hour before sunset to an hour after sunrise
    if (!line) return;
    var T0 = M.set - H, T1 = M.rise + H, TX0 = 18 * u, TX1 = W - 18 * u, TH = Math.round(10 * u), TY = Math.round(HH - TLH + (view === 'half_horizontal' ? 12 : 16) * u);
    var TX = function (t) { return TX0 + (t - T0) / (T1 - T0) * (TX1 - TX0); };
    var segs = [], cs;
    for (var t2 = T0; t2 <= T1; t2 += 12e4) {
      var s2 = M.sunAlt(t2), band = s2 > -0.833 ? 'day' : s2 > -6 ? 'civil' : s2 > -12 ? 'naut' : s2 > -18 ? 'astro' : 'night';
      if (!cs || cs.b !== band) { if (cs) cs.t1 = t2; cs = { b: band, t0: t2 }; segs.push(cs); }
    }
    cs.t1 = T1;
    var FILL = P.bits === 4 ? { day: '#fff', civil: '#bbb', naut: '#777', astro: '#3c3c3c', night: '#000' } : { day: '#fff', civil: 'url(#nk50)', naut: 'url(#nk25)', astro: 'url(#nk12)', night: '#000' };
    segs.forEach(function (sg) { el('rect', { x: f(TX(sg.t0)), y: TY, width: f(Math.max(0, TX(sg.t1) - TX(sg.t0))), height: TH, fill: FILL[sg.b] }, svg); });
    el('rect', { x: f(TX0), y: TY, width: f(TX1 - TX0), height: TH, fill: 'none', stroke: P.ink, 'stroke-width': f(1.5 * u), rx: 3 }, svg);
    M.hours.forEach(function (h) {
      if (h.t < M.set || h.t > M.rise) return;
      var x = TX(h.t), y = TY - 12 * u;
      if (h.c < 25) star4(svg, x, y, 4.5 * u, P.ink); else cloud(svg, x, y, h.c >= 70, u, P.ink);
    });
    for (var t3 = Math.ceil(T0 / H) * H; t3 <= T1; t3 += H) {
      var hr = new Date(t3 + M.off).getUTCHours(), x3 = TX(t3);
      el('line', { x1: f(x3), y1: TY + TH, x2: f(x3), y2: f(TY + TH + (hr % 3 ? 3 : 6) * u), stroke: P.ink, 'stroke-width': f(1.2 * u) }, svg);
      if (hr % 3 === 0 && view !== 'half_horizontal') el('text', { x: f(x3), y: f(TY + TH + 17 * u), 'text-anchor': 'middle', 'font-size': fs(12), 'font-weight': 600, fill: P.ink, class: 'nk-t2' }, svg).textContent = M.hourLabel(t3);
    }
    var mx = TX(at);
    el('path', { d: 'M' + f(mx) + ' ' + (TY - 1) + ' l' + f(-6 * u) + ' ' + f(-9 * u) + ' h' + f(12 * u) + ' z', fill: P.ink, stroke: '#000', 'stroke-width': 1.5 }, svg);
    el('line', { x1: f(mx), y1: TY - 2, x2: f(mx), y2: TY + TH + 2, stroke: P.ink, 'stroke-width': 2 }, svg);
  }

  function star4(svg, x, y, r, c) {
    el('path', { d: 'M' + f(x) + ' ' + f(y - r) + ' Q' + f(x) + ' ' + f(y) + ' ' + f(x + r) + ' ' + f(y) + ' Q' + f(x) + ' ' + f(y) + ' ' + f(x) + ' ' + f(y + r) + ' Q' + f(x) + ' ' + f(y) + ' ' + f(x - r) + ' ' + f(y) + ' Q' + f(x) + ' ' + f(y) + ' ' + f(x) + ' ' + f(y - r) + 'Z', fill: c }, svg);
  }
  function cloud(svg, x, y, full, u, c) {
    var g = el('g', { transform: 'translate(' + f(x) + ' ' + f(y) + ') scale(' + u + ')' }, svg);
    el('path', { d: 'M-7 3 a3 3 0 0 1 1 -5.6 a4 4 0 0 1 7.4 -1.4 a3 3 0 0 1 5.4 2.4 a2.4 2.4 0 0 1 -0.8 4.6 z', fill: full ? c : '#000', stroke: c, 'stroke-width': 1.3, 'stroke-linejoin': 'round' }, g);
  }
  function moonDisc(svg, x, y, r, ph, south, P) {
    var g = el('g', { transform: 'translate(' + f(x) + ' ' + f(y) + ')' }, svg);
    el('circle', { r: f(r + 5), fill: '#000' }, g);
    el('circle', { r: f(r + 5), fill: 'none', stroke: P.ink, 'stroke-width': 1, 'stroke-dasharray': '1 3' }, g);
    el('circle', { r: f(r), fill: '#000', stroke: P.ink, 'stroke-width': 1.4 }, g);
    var k = cos(2 * PI * ph.p), d = null;
    if (ph.f > 0.985) d = el('circle', { r: f(r) }, g);
    else if (ph.f > 0.015) d = el('path', { d: 'M0 ' + f(-r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 0 ' + f(r) + 'A' + f(Math.abs(k * r)) + ' ' + f(r) + ' 0 0 ' + (k > 0 ? 0 : 1) + ' 0 ' + f(-r) + 'Z' }, g);
    if (d) { d.setAttribute('fill', P.ink); d.setAttribute('class', 'nk-moonlit'); if ((ph.p > 0.5) !== south) d.setAttribute('transform', 'scale(-1,1)'); }
  }

  /* ---------- per-root rendering ---------- */
  function render(root) {
    var ds = root.dataset, loc = String(ds.locale || 'en'), lang = norm(ds.lang);
    if (!lang || lang === 'auto') lang = norm(loc).slice(0, 2);
    lang = L[lang] ? lang : LANG_NAMES[lang] || 'en';
    var locale = norm(loc).slice(0, 2) === lang ? loc : lang;
    var clock = norm(ds.clock), h12 = clock === '12' || (clock !== '24' && /en-us/i.test(loc));
    var cfg = { lang: lang, locale: locale, h12: h12, place: ds.place || '', moment: norm(ds.moment) || 'auto', lines: norm(ds.lines) !== 'off', names: norm(ds.names) !== 'off' };
    var D = null;
    try { D = JSON.parse(root.querySelector('.nk-data').textContent); } catch (e) { }
    if (D) { D.lat = parseFloat(D.lat); D.lon = parseFloat(D.lon); if (isNaN(D.lat) || isNaN(D.lon)) { D.lat = D.alat; D.lon = D.alon; } }
    if (!D || D.lat == null || isNaN(D.lat)) { put(root, 'verdict', L[lang].setup); return; }
    var now = parseInt(ds.ts, 10) * 1000 || Date.now();
    if (/^\d{4}-\d{2}-\d{2}/.test(ds.test || '')) now = Date.parse(ds.test.length > 10 ? ds.test + 'Z' : ds.test + 'T21:00:00Z') - (D.off || 0) * 1000;
    var M = build(D, now, cfg);
    for (var k in M.text) put(root, k, M.text[k]);
    draw(root, M, palette(root), !!root.closest('.screen--lg'));
  }
  function run() { document.querySelectorAll('.nk').forEach(function (r) { try { render(r); } catch (e) { console.error(e); } }); }
  window.NACHTKLOK = { run: run };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else setTimeout(run, 0);
  window.addEventListener('load', run);
  if (document.fonts) document.fonts.ready.then(run);
  setTimeout(run, 300); setTimeout(run, 1200);
}();
