# Synapse par ELO — site vitrine

Page française inspirée de la structure de [FlowBoard](https://maofryy.github.io/flowboard-vitrine/), adaptée aux usages et à l’identité Synapse. Nouveau fond clair blanc cassé et bleu ELO, sans l’ancien décor gris-vert. Auteur : Krishan Navas.

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

Les cinq films finalisés remplacent les anciens extraits. Ils sont conservés intégralement en anglais, en H.264 1920 × 1080 avec leur bande-son AAC originale, sans réencodage ni coupe. Les métadonnées sont placées en tête pour le démarrage web. `scripts/media-manifest.json` identifie précisément les sources :

| Film | Source dans le workspace | Durée vérifiée |
| --- | --- | --- |
| Présentation | `synapse-video/Synapse-first-English.mp4` | 44 s |
| Configuration IA / RFP | `synapse-video/RFP-v2/Hyperframes-v5/Synapse-RFP-2.mp4` | 40 s |
| ROI | `synapse-video/RFP-v2/Hyperframes-ROI/Synapse-RFP-English-ROI-Final-v2.mp4` | 52 s |
| MCP | `synapse-video/RFP-v2/Hyperframes-MCP/Synapse-MCP-English-final.mp4` | 34 s |
| eBonding | `synapse-video/deuxieme video/Synapse-eBonding-English-v2.mp4` | 50 s |

Les affiches proviennent des mêmes films. Les données sont celles de l’environnement de démonstration. Les montants du film ROI sont des estimations liées au scénario illustré ; la comparaison de délais eBonding est rattachée au cas présenté, à son périmètre et à ses prérequis. L’IA prépare des brouillons ; l’équipe conserve la validation et la mise en service.

La présentation dispose d’un résumé français dépliable ; chaque film a une description française adjacente. Une transcription mot à mot et des sous-titres synchronisés des films restent à produire si une conformité complète des médias est requise.

Pour régénérer les médias depuis le workspace d’origine, avec FFmpeg installé :

```sh
node scripts/prepare-media.mjs "CHEMIN_DU_WORKSPACE" "CHEMIN_DE_FFMPEG"
```

## Publication

GitHub Pages, source **GitHub Actions**. Le workflow vérifie le contenu puis publie exclusivement `dist/` à chaque push sur `main`. Les chemins relatifs permettent une publication sous `/synapse/`. Aucun secret, identifiant d’instance, fichier ScriptSync ou code serveur ServiceNow n’est requis par le site.
