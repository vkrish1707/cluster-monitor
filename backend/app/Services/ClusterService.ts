import FileStorage from '../Utils/ClusterRepository'

export default class ClusterService {
  static async getMetrics(clusterId: string) {
    const data = await FileStorage.read()
    const cluster = data.clusters.find((c) => c.id === clusterId)
    if (!cluster) throw new Error('Cluster not found')
    return cluster.metrics
  }

  static async getPolicy(clusterId: string) {
    const data = await FileStorage.read()
    const cluster = data.clusters.find((c) => c.id === clusterId)
    if (!cluster) throw new Error('Cluster not found')
    return cluster.snapshotPolicy
  }

  static async updatePolicy(clusterId: string, newPolicy: any) {
    const data = await FileStorage.read()
    const cluster = data.clusters.find((c) => c.id === clusterId)
    if (!cluster) throw new Error('Cluster not found')

    cluster.snapshotPolicy = {
      ...cluster.snapshotPolicy,
      frequency: newPolicy.frequency,
      time: newPolicy.time,
      timezone: newPolicy.timezone,
      deleteAfterDays: newPolicy.deleteAfterDays,
      enabled: newPolicy.enabled,
      locking: newPolicy.locking,
      days: newPolicy.days
    }

    await FileStorage.write(data)
  }
}