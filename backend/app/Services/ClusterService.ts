import FileStorage from '../Utils/ClusterRepository'

export default class ClusterService {
  static async getMetrics(clusterId: string) {
    const data = await FileStorage.read()
    // Find the cluster by its ID
    const cluster = data.clusters.find((c) => c.id === clusterId)
    if (!cluster) throw new Error('Cluster not found')
    
    // Extract metrics data
    const matrix = cluster.metrics;
    const iops = matrix.iops || [];
    const throughput = matrix.throughput || [];
  
    // Helper function to calculate average
    const avg = (arr: any[], key: string) =>
      arr.length ? arr.reduce((sum, obj) => sum + (Number(obj[key]) || 0), 0) / arr.length : 0;
  
    const readIOP = avg(iops, 'read');
    const writeIOP = avg(iops, 'write');
    const readThroughput = avg(throughput, 'read');
    const writeThroughput = avg(throughput, 'write');
  
    // Return metrics including calculated averages
    return {
      ...matrix,
      readIOP,
      writeIOP,
      readThroughput,
      writeThroughput
    }
  }

  static async getPolicy(clusterId: string) {
    const data = await FileStorage.read()
    const cluster = data.clusters.find((c) => c.id === clusterId)
    // If cluster is not found, throw an error
    if (!cluster) throw new Error('Cluster not found')
    // Return cluster ID and snapshot policy
    return {
      id: cluster.id,
      // Return the snapshot policy
      snapshotPolicy: cluster.snapshotPolicy
    }
  }

  static async updatePolicy(clusterId: string, payload: any) {
    const data = await FileStorage.read()
    const newPolicy = payload?.snapshotPolicy
    // Find the cluster by its ID
    const cluster = data.clusters.find((c) => c.id === clusterId)
    // If cluster is not found, throw an error
    if (!cluster) throw new Error('Cluster not found')

    // Update the snapshot policy details
    cluster.snapshotPolicy = {
      policyName: newPolicy.policyName,
      applyToDirectory: newPolicy.applyToDirectory,
      frequency: newPolicy.frequency,
      time: newPolicy.time,
      timezone: newPolicy.timezone,
      deleteAfterDays: newPolicy.deleteAfterDays,
      enabled: newPolicy.enabled,
      locking: newPolicy.locking,
      days: newPolicy.days
    }
    // Write the updated data back to the file
    await FileStorage.write(data)

    return {
      id: cluster.id,
      // Return the updated snapshot policy
      snapshotPolicy: cluster.snapshotPolicy
    }
  }
  
  static async getClusters() {
    const data = await FileStorage.read();
    return data.clusters.map(({ metrics, snapshotPolicy, ...rest }) => ({
      // Return all cluster properties except metrics and snapshot policy
      ...rest
    }));
  }
}
