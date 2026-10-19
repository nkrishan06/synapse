# Synapse par ELO — site vitrine

Site vitrine en français présentant Synapse par ELO, ses fonctionnalités et ses films de démonstration. Identité visuelle : fond du portail Synapse bleu, cyan et turquoise, textes blancs sur le fond, contenu sur blanc cassé. Auteur : Krishan Navas.

Site : https://nkrishan06.github.io/synapse/

## Consulter et modifier

Prérequis : Node.js 22 ou supérieur. Aucune dépendance à installer.

```sh
npm run dev
npm run check
```

Sous PowerShell avec les scripts désactivés, utiliser `npm.cmd run dev` et `npm.cmd run check`.

Ouvrir l’adresse affichée, normalement http://127.0.0.1:8792/. Le fichier `dist/index.html` s’ouvre aussi directement pour une consultation simple.

- `dist/index.html` : contenu, vidéos, liens de démonstration vers https://www.elo.blue/.
- `dist/styles.css` : identité, arrière-plan, composition et adaptations aux petits écrans.
- `dist/app.js` : une seule vidéo joue à la fois ; repli en cas d’erreur de chargement.
- `dist/water.js` et `dist/background.js` : rendu du fond repris du module du portail Synapse (`mountWater`), avec sa palette d’origine `#0F8A7A / #1D3F73 / #2F6F8F`. Image calculée au repos, sans animation continue ; repli CSS de même palette si WebGL est indisponible, voile de contraste et fondu vers la partie claire. Le module graphique d’origine est conservé, avec seulement l’export ES retiré pour son chargement en script classique.
- `dist/media/` : médias autonomes et polices locales.

## Médias

La vitrine présente trois films Synapse : configuration IA en ouverture, puis ROI et MCP. Ils sont conservés intégralement en anglais, en H.264 1920 × 1080 avec leur bande-son AAC originale, sans réencodage ni coupe. Les métadonnées sont placées en tête pour le démarrage web. `scripts/media-manifest.json` conserve la traçabilité des sources validées.

| Film | Fichier publié | Durée vérifiée |
| --- | --- | --- |
| Configuration IA / RFP | `dist/media/synapse-rfp-en.mp4` | 40 s |
| ROI | `dist/media/synapse-roi-en.mp4` | 52 s |
| MCP | `dist/media/synapse-mcp-en.mp4` | 34 s |

Les affiches proviennent des mêmes films. Les données sont celles de l’environnement de démonstration. Les montants du film ROI sont des estimations liées au scénario illustré. L’IA prépare des brouillons ; l’équipe conserve la validation et la mise en service.

La présentation dispose d’un résumé français dépliable ; chaque film a une description française adjacente. Une transcription mot à mot et des sous-titres synchronisés des films restent à produire si une conformité complète des médias est requise.

Pour régénérer les médias depuis le workspace d’origine, avec FFmpeg installé :

```sh
node scripts/prepare-media.mjs "CHEMIN_DU_WORKSPACE" "CHEMIN_DE_FFMPEG"
```

## Publication

GitHub Pages, source **GitHub Actions**. Le workflow vérifie le contenu puis publie exclusivement `dist/` à chaque push sur `main`. Les chemins relatifs permettent une publication sous `/synapse/`. Aucun secret, identifiant d’instance, fichier ScriptSync ou code serveur ServiceNow n’est requis par le site.
