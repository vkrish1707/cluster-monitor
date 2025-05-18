import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/:id/metrics', 'ClustersController.getMetrics')
  Route.get('/:id/policy', 'ClustersController.getPolicy')
  Route.put('/:id/policy', 'ClustersController.updatePolicy')
}).prefix('/clusters')