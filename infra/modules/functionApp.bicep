param location string
param functionAppName string
param storageAccountName string
param appInsightsInstrumentationKey string
param nodeVersion string = '~18'

var queueInputName = 'emt-queue-input'
var queueOutputName = 'emt-queue-output'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' existing = {
  name: storageAccountName
}

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
        name: 'QUEUE_INPUT_NAME'
        value: queueInputName
      }
      {
        name: 'QUEUE_OUTPUT_NAME'
        value: queueOutputName
      }
      {
      name: 'QUEUE_STORAGE_CONNECTION'
      value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
      }
    ]
    }
  }
}
