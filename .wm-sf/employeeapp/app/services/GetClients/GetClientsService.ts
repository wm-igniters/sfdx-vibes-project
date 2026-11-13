/* eslint-disable */
// Auto-generated service client. Do not edit manually — regenerated on every build.
import { BaseService, ServiceFnCtx, ServiceResponse, toFormUrlEncoded } from '../base.service';
import { RootResponse } from './types';

export class GetClientsService extends BaseService {
  constructor() {
    super("/services", "/GetClients/v1");
  }

  invoke(ctx?: ServiceFnCtx): Promise<ServiceResponse<RootResponse>> {
    const url = this.buildTargetUrl(`/clients/1`, {}, ctx);
    return this.request<RootResponse>(url, "get", ctx);
  }

}

export const getClientsService = new GetClientsService();
