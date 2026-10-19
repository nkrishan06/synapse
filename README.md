# Synapse par ELO — site vitrine

Page française inspirée de la structure et de la direction visuelle de [FlowBoard](https://maofryy.github.io/flowboard-vitrine/), adaptée aux usages et à l’identité Synapse. Auteur : Krishan Navas.

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

Le film français approuvé `synapse-v4-elevenlabs-equilibre.mp4` est conservé avec sa bande-son, sans réencodage, avec les métadonnées placées en tête pour le démarrage web.

Les trois démonstrations sont des extraits des captures existantes, exportés sans audio en H.264, largeur 1280 pixels, 24 images/s : diagnostic 0–27 s ; assistant 35–62 s ; réconciliation 13–32 s. Les affiches sont extraites des mêmes vidéos. Les données et résultats affichés viennent de l’environnement de démonstration ; ils ne constituent pas des engagements de performance. Les textes ne prétendent pas que l’IA déclenche les actions ou analyse toutes les transactions.

La présentation dispose d’un résumé textuel dépliable. Les captures sans audio ont une description textuelle adjacente. Une transcription mot à mot et des sous-titres synchronisés du film parlé restent à produire si une conformité complète des médias est requise.

Pour régénérer les médias depuis le workspace d’origine, avec FFmpeg installé :

```sh
node scripts/prepare-media.mjs "CHEMIN_DU_WORKSPACE" "CHEMIN_DE_FFMPEG"
```

## Publication

GitHub Pages, source **GitHub Actions**. Le workflow vérifie le contenu puis publie exclusivement `dist/` à chaque push sur `main`. Les chemins relatifs permettent une publication sous `/synapse/`. Aucun secret, identifiant d’instance, fichier ScriptSync ou code serveur ServiceNow n’est requis par le site.
