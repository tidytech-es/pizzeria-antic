# Pizzeria Antic

Web de Pizzeria Antic, pizzeria amb forn de llenya a la Plaça Mercè Rodoreda de Sant Celoni.
En català, amb selector a castellà.

Fet amb React, Vite, TypeScript, Tailwind CSS v4, Lucide i GSAP.

## Arrencar-la

```bash
npm install
npm run dev
```

Per generar la versió de producció (carpeta `dist/`):

```bash
npm run build
```

## On es canvia el contingut

| Què | Fitxer |
| --- | --- |
| Carta, preus, al·lèrgens, disponibilitat i massa sense gluten | `src/data/menu.ts` |
| Plats del carrusel «Plats estrella» | `src/data/featured.ts` |
| Adreça, telèfon, horari, xarxes | `src/data/business.ts` |
| Ressenyes | `src/data/reviews.ts` |
| Tots els textos (català i castellà) | `src/i18n/dictionary.ts` |

Per marcar un plat com a esgotat: `available: false`. Per indicar que avui no queda massa
sense gluten: `specialOptions.glutenFreeDough.available = false`.

## Pendent

- Les fotos de les pizzes del carrusel són d'estoc (Unsplash): substituir-les per fotos reals.
- Revisar els al·lèrgens amb la cuina.
