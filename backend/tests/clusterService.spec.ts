import test from 'japa'
import assert from 'assert'
import ClusterService from '../app/Services/ClusterService'

test.group('ClusterService', () => {
  const testClusterId = 'test-cluster-001'

  test('should return metrics for a valid cluster', async () => {
    const metrics = await ClusterService.getMetrics(testClusterId)

    assert(Array.isArray(metrics.iops), 'IOPS should be an array')
    assert(Array.isArray(metrics.throughput), 'Throughput should be an array')
  })

  test('should return snapshot policy for a valid cluster', async () => {
    const policy = await ClusterService.getPolicy(testClusterId)

    assert(policy.frequency, 'Frequency is missing')
    assert(policy.time, 'Time is missing')
    assert(typeof policy.locking === 'boolean', 'Locking should be a boolean')
  })

  test('should throw error for invalid cluster ID', async (assert) => {
    try {
      await ClusterService.getMetrics('non-existent-id')
      assert.fail('Expected error not thrown')
    } catch (error) {
      assert.strictEqual(error.message, 'Cluster not found')
    }
  })
  
  test('should throw error for invalid cluster ID in getPolicy', async (assert) => {
    try {
      await ClusterService.getPolicy('invalid-id')
      assert.fail('Expected error not thrown')
    } catch (error) {
      assert.strictEqual(error.message, 'Cluster not found')
    }
  })

  test('should throw error when updating policy for invalid cluster ID', async (assert) => {
    try {
      const invalidPolicy = {
        frequency: 'daily',
        time: '03:00',
        locking: false,
      }

      await ClusterService.updatePolicy('invalid-id', invalidPolicy)
      assert.fail('Expected error not thrown')
    } catch (error) {
      assert.strictEqual(error.message, 'Cluster not found')
    }
  })

  test('should throw error when updating policy with incomplete payload', async (assert) => {
    try {
      const incompletePolicy = {
        frequency: 'daily'
        // time and locking are missing
      }

      // TypeScript will complain about this, but simulating a runtime bad input
      await ClusterService.updatePolicy(testClusterId, incompletePolicy as any)
      assert.fail('Expected error not thrown')
    } catch (error) {
      assert.ok(error.message)
    }
  })
})