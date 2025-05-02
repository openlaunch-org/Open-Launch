# Configuration de la mise à jour automatique des lancements

Ce document explique comment configurer la tâche planifiée pour mettre à jour automatiquement les statuts de lancement des chaînes à 8h00 UTC chaque jour.

## Fonctionnement

Le système de lancement fonctionne comme suit :

- Les chaînes sont initialement en statut `SCHEDULED` avec une date de lancement programmée
- À 8h00 UTC le jour du lancement, le statut passe à `ONGOING`
- À 8h00 UTC le lendemain, le statut passe à `LAUNCHED`

## Configuration sur Coolify

### 1. Ajouter les variables d'environnement

Ajoutez les variables d'environnement suivantes à votre application sur Coolify :

```
CRON_API_KEY=votre_clé_secrète_ici
APP_URL=https://votre-domaine.com
```

- `CRON_API_KEY` : Une clé secrète pour sécuriser l'API (générez une chaîne aléatoire complexe)
- `APP_URL` : L'URL de base de votre application

### 2. Configurer la tâche planifiée

Dans Coolify, créez une nouvelle tâche planifiée avec les paramètres suivants :

- **Nom** : `update-launches`
- **Commande** : `/app/scripts/update-launches.sh`
- **Fréquence** : `0 8 * * *` (tous les jours à 8h00 UTC)
- **Nom du conteneur** : Le nom de votre conteneur d'application

### 3. Rendre le script exécutable

Assurez-vous que le script est exécutable en exécutant cette commande dans le conteneur :

```bash
chmod +x /app/scripts/update-launches.sh
```

## Test manuel

Pour tester manuellement la mise à jour des lancements, vous pouvez exécuter :

```bash
curl -X GET \
  -H "Authorization: Bearer votre_clé_secrète_ici" \
  -H "Content-Type: application/json" \
  "https://votre-domaine.com/api/cron/update-launches"
```

## Journalisation

Les logs de la tâche planifiée sont disponibles dans Coolify sous l'onglet "Logs" de la tâche planifiée.

## Dépannage

Si la tâche planifiée échoue, vérifiez les points suivants :

1. Les variables d'environnement `CRON_API_KEY` et `APP_URL` sont correctement définies
2. Le script `/app/scripts/update-launches.sh` est exécutable
3. L'API `/api/cron/update-launches` est accessible
4. Les logs de l'application pour voir les erreurs potentielles
