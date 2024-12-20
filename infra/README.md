# Azure Employee Management Tool - Infrastructure

This document provides the necessary information to configure the `main.parameters.json` file for deploying the Azure Employee Management Tool infrastructure.

## Parameters

The `main.parameters.json` file should contain the following parameters:

```json
{
  "resourceGroupName": {
    "value": "<resource-group-name>"
  },
  "storageAccountName": {
    "value": "<storage-account-name>"
  },
  "functionAppName": {
    "value": "<function-app-name>"
  },
  "appServicePlanName": {
    "value": "<app-service-plan-name>"
  },
  "applicationInsightsName": {
    "value": "<application-insights-name>"
  },
  "cosmosDbAccountName": {
    "value": "<cosmos-db-account-name>"
  },
  "cosmosDbDatabaseName": {
    "value": "<cosmos-db-database-name>"
  },
  "cosmosDbContainerName": {
    "value": "<cosmos-db-container-name>"
  },
  "cosmosDbDatabaseName": {
    "value": "<cosmos-db-partition-key-name>"
  },
  "mailUsername": {
    "value": "<mail-username>"
  },
  "mailPassword": {
    "value": "<mail-password>"
  },
  "spotifyClientId": {
    "value": "<spotify-client-id>"
  },
  "spotifyClientSecret": {
    "value": "<spotify-client-secret>"
  },
  "spotifyRedirectUri": {
    "value": "<spotify-redirect-uri>"
  }
}
```

Replace the placeholder values (e.g., `<azure-region>`) with the actual values for your deployment.

## Example

Here is an example of a `main.parameters.json` file with placeholder values:

```json
{
  "resourceGroupName": {
    "value": "myResourceGroup"
  },
  "storageAccountName": {
    "value": "mystorageaccount"
  },
  "functionAppName": {
    "value": "myfunctionapp"
  },
  "appServicePlanName": {
    "value": "myappserviceplan"
  },
  "applicationInsightsName": {
    "value": "myappinsights"
  },
  "cosmosDbAccountName": {
    "value": "mycosmosdbaccount"
  },
  "cosmosDbDatabaseName": {
    "value": "mycosmosdbdatabase"
  }
}
```

Ensure that all values are correctly replaced before deploying the infrastructure.