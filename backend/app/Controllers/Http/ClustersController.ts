import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClusterService from '../../Services/ClusterService'
import UpdatePolicyValidator from '../../Validators/UpdatePolicyValidator'
import { handleError } from '../../Utils/ErrorHandler'

export default class ClustersController {
  public async getMetrics({ params, response }: HttpContextContract) {
    try {
      const data = await ClusterService.getMetrics(params.id)
      return response.ok(data)
    } catch (error) {
      return handleError(error, response)
    }
  }

  public async getClusters({ params, response }: HttpContextContract) {
    try {
      const data = await ClusterService.getClusters()
      return response.ok(data)
    } catch (error) {
      return handleError(error, response)
    }
  }

  public async getPolicy({ params, response }: HttpContextContract) {
    try {
      const policy = await ClusterService.getPolicy(params.id)
      return response.ok(policy)
    } catch (error) {
      return handleError(error, response)
    }
  }

  public async updatePolicy({ params, request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(UpdatePolicyValidator)
      const resp = await ClusterService.updatePolicy(params.id, payload)
      return response.ok({ message: 'Policy updated successfully', data: resp })
    } catch (error) {
      return handleError(error, response)
    }
  }
}