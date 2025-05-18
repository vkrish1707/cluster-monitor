import test from 'japa'
import supertest from 'supertest'
import assert from 'assert'

const BASE_URL = `http://127.0.0.1:3333`

const testClusterId = '123e4567-e89b-12d3-a456-426614174000'

test.group('Cluster API', () => {
  test('GET /clusters/:id/metrics returns metrics', async () => {
    const res = await supertest(BASE_URL)
      .get(`/clusters/${testClusterId}/metrics`)
      .expect(200)

    assert(Array.isArray(res.body.iops))
    assert(Array.isArray(res.body.throughput))
  })

  test('GET /clusters/:id/policy returns snapshot policy', async () => {
    const res = await supertest(BASE_URL)
      .get(`/clusters/${testClusterId}/policy`)
      .expect(200)

    assert.equal(res.body.frequency, 'weekly')
  })

  test('PUT /clusters/:id/policy updates snapshot policy', async () => {
    const update = {
      frequency: 'weekly',
      time: '02:00',
      locking: false,
    }

    await supertest(BASE_URL)
      .put(`/clusters/${testClusterId}/policy`)
      .send(update)
      .expect(200)
  })
})