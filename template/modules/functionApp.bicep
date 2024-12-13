param location string
param functionAppName string
param storageAccountConnectionString string
param appInsightsInstrumentationKey string
param nodeVersion string = '~18'

resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: '${functionAppName}-plan'
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  kind: 'linux'
}

resource functionApp 'Microsoft.Web/sites@2024-04-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  properties: {
    httpsOnly: true
    serverFarmId: appServicePlan.id
    siteConfig: {
    appSettings: [
      {
      name: 'AzureWebJobsStorage'
      value: storageAccountConnectionString
      }
      {
      name: 'FUNCTIONS_WORKER_RUNTIME'
      value: 'node'
      }
      {
      name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
      value: appInsightsInstrumentationKey
      }
      {
      name: 'WEBSITE_NODE_DEFAULT_VERSION'
      value: nodeVersion
      }
      {
      name: 'QUEUE_STORAGE_CONNECTION'
      value: storageAccountConnectionString
      }
    ]
    }
  }
}
