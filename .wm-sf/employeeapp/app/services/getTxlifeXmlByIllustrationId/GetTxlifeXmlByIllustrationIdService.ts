/* eslint-disable */
// Auto-generated service client. Do not edit manually — regenerated on every build.
import { BaseService, ServiceFnCtx, ServiceResponse, toFormUrlEncoded } from '../base.service';
import { RootResponse } from './types';

export class GetTxlifeXmlByIllustrationIdService extends BaseService {
  constructor() {
    super("/services", "/getTxlifeXmlByIllustrationId/v1");
  }

  invoke(id: string, ctx?: ServiceFnCtx): Promise<ServiceResponse<RootResponse>> {
    const url = this.buildTargetUrl(`/illustrations/${id}/txlife/download`, {}, ctx);
    return this.request<RootResponse>(url, "get", ctx);
  }

}

export const getTxlifeXmlByIllustrationIdService = new GetTxlifeXmlByIllustrationIdService();
