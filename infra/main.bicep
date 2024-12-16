param location string = resourceGroup().location
param storageAccountName string = 'rogietmstorageaccount'
param functionAppName string = 'rogietmfunctionapp'
param appInsightsName string = 'rogietmappinsights'
param logAnalyticsName string = 'rogietmloganalytics'

param cosmosDbAccountName string = 'rogietmcosmosdb'
param cosmosDbDatabaseName string = 'EmployeeDatabase'
param cosmosDbContainerName string = 'EmployeeContainer'
param cosmosDbPartitionKey string = '/partitionKey'
module storageAccount './modules/storageAccount.bicep' = {
  name: storageAccountName
  params: {
    location: location
    storageAccountName: storageAccountName
  }
}
module cosmosDb './modules/cosmosDb.bicep' = {
  name: cosmosDbAccountName
  params: {
    location: location
    cosmosDbAccountName: cosmosDbAccountName
    cosmosDbDatabaseName: cosmosDbDatabaseName
    cosmosDbContainerName: cosmosDbContainerName
    cosmosDbPartitionKey: cosmosDbPartitionKey
  }
}
module appInsights './modules/appInsights.bicep' = {
  name: appInsightsName
  params: {
    location: location
    appInsightsName: appInsightsName
    logAnalyticsName: logAnalyticsName
  }
}
module functionApp './modules/functionApp.bicep' = {
  name: functionAppName
  params: {
    location: location
    functionAppName: functionAppName
    storageAccountName: storageAccountName
    appInsightsInstrumentationKey: appInsights.outputs.appInsightsInstrumentationKey
    cosmosDbAccountName: cosmosDbAccountName
    cosmosDbDatabaseName: cosmosDbDatabaseName
    cosmosDbContainerName: cosmosDbContainerName
  }
}




