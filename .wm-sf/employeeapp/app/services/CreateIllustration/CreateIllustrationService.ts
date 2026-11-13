/* eslint-disable */
// Auto-generated service client. Do not edit manually — regenerated on every build.
import { BaseService, ServiceFnCtx, ServiceResponse, toFormUrlEncoded } from '../base.service';
import { RootRequest, RootResponse } from './types';

export class CreateIllustrationService extends BaseService {
  constructor() {
    super("", "/CreateIllustration/v1");
  }

  invoke(requestBody?: RootRequest, ctx?: ServiceFnCtx): Promise<ServiceResponse<RootResponse>> {
    const url = this.buildTargetUrl(`/illustrations`, {}, ctx);
    return this.request<RootResponse>(url, "post", { ...ctx, data: requestBody });
  }

}

export const createIllustrationService = new CreateIllustrationService();
