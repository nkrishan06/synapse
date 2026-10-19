# Synapse par ELO — site vitrine

Site vitrine en français présentant Synapse par ELO, ses fonctionnalités et ses films de démonstration. Identité visuelle : fond clair blanc cassé et bleu ELO. Auteur : Krishan Navas.

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
- `dist/media/` : médias autonomes et polices locales.

## Médias

La vitrine présente uniquement les trois films de Synapse v2 : configuration IA en ouverture, puis ROI et MCP. Ils sont conservés intégralement en anglais, en H.264 1920 × 1080 avec leur bande-son AAC originale, sans réencodage ni coupe. Les métadonnées sont placées en tête pour le démarrage web. `scripts/media-manifest.json` identifie précisément les sources et leur version produit :

| Film | Source dans le workspace | Durée vérifiée |
| --- | --- | --- |
| Configuration IA / RFP | `synapse-video/RFP-v2/Hyperframes-v5/Synapse-RFP-2.mp4` | 40 s |
| ROI | `synapse-video/RFP-v2/Hyperframes-ROI/Synapse-RFP-English-ROI-Final-v2.mp4` | 52 s |
| MCP | `synapse-video/RFP-v2/Hyperframes-MCP/Synapse-MCP-English-final.mp4` | 34 s |

Les affiches proviennent des mêmes films. Les données sont celles de l’environnement de démonstration. Les montants du film ROI sont des estimations liées au scénario illustré. L’IA prépare des brouillons ; l’équipe conserve la validation et la mise en service. Les films de présentation de 44 s et d’eBonding de 50 s correspondaient à Synapse v1 et ont été retirés de la publication ; le suffixe « English-v2 » de l’ancien fichier eBonding désignait une révision du film, pas la version produit.

La présentation dispose d’un résumé français dépliable ; chaque film a une description française adjacente. Une transcription mot à mot et des sous-titres synchronisés des films restent à produire si une conformité complète des médias est requise.

Pour régénérer les médias depuis le workspace d’origine, avec FFmpeg installé :

```sh
node scripts/prepare-media.mjs "CHEMIN_DU_WORKSPACE" "CHEMIN_DE_FFMPEG"
```

## Publication

GitHub Pages, source **GitHub Actions**. Le workflow vérifie le contenu puis publie exclusivement `dist/` à chaque push sur `main`. Les chemins relatifs permettent une publication sous `/synapse/`. Aucun secret, identifiant d’instance, fichier ScriptSync ou code serveur ServiceNow n’est requis par le site.
