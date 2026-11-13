/* eslint-disable */
// Auto-generated service client. Do not edit manually — regenerated on every build.
import { BaseService, ServiceFnCtx, ServiceResponse, toFormUrlEncoded } from '../base.service';
import { RootResponse } from './types';

export class GetPdfByIllustrationIdService extends BaseService {
  constructor() {
    super("/services", "/getPdfByIllustrationId/v1");
  }

  invoke(illustrationId: string, ctx?: ServiceFnCtx): Promise<ServiceResponse<RootResponse>> {
    const url = this.buildTargetUrl(`/illustrations/${illustrationId}/generate-pdf`, {}, ctx);
    return this.request<RootResponse>(url, "get", ctx);
  }

}

export const getPdfByIllustrationIdService = new GetPdfByIllustrationIdService();
