/* eslint-disable */
// Auto-generated service client. Do not edit manually — regenerated on every build.
import { BaseService, ServiceFnCtx, ServiceResponse, toFormUrlEncoded } from '../base.service';
import { ResponseRootResponseROOTEntryItem } from './types';

export class GetIllustrationsService extends BaseService {
  constructor() {
    super("/services", "/getIllustrations/v1");
  }

  invoke(ctx?: ServiceFnCtx): Promise<ServiceResponse<Array<ResponseRootResponseROOTEntryItem>>> {
    const url = this.buildTargetUrl(`/illustrations`, {}, ctx);
    return this.request<Array<ResponseRootResponseROOTEntryItem>>(url, "get", ctx);
  }

}

export const getIllustrationsService = new GetIllustrationsService();
