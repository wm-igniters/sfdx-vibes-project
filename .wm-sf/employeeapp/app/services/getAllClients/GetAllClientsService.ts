/* eslint-disable */
// Auto-generated service client. Do not edit manually — regenerated on every build.
import { BaseService, ServiceFnCtx, ServiceResponse, toFormUrlEncoded } from '../base.service';
import { ResponseRootResponseROOTEntryItem } from './types';

export class GetAllClientsService extends BaseService {
  constructor() {
    super("/services", "/getAllClients/v1");
  }

  invoke(adviserId?: string, ctx?: ServiceFnCtx): Promise<ServiceResponse<Array<ResponseRootResponseROOTEntryItem>>> {
    const queryParams = { "adviserId": adviserId };
    const url = this.buildTargetUrl(`/clients`, queryParams, ctx);
    return this.request<Array<ResponseRootResponseROOTEntryItem>>(url, "get", ctx);
  }

}

export const getAllClientsService = new GetAllClientsService();
