param location string
param storageAccountName string

var queues = ['emt-queue-input', 'emt-queue-output']

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  tags: {
    environment: 'dev'
    buisness_unit: 'it'
  }
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

resource storageAccountQueueService 'Microsoft.Storage/storageAccounts/queueServices@2023-05-01' = {
  parent: storageAccount
  name: 'default'
}

resource storageAccountQueues 'Microsoft.Storage/storageAccounts/queueServices/queues@2023-05-01' = [for queueName in queues: {
  parent: storageAccountQueueService
  name: queueName
}]

