/* eslint-disable */
// Auto-generated service client. Do not edit manually — regenerated on every build.
import { BaseService, ServiceFnCtx, ServiceResponse, toFormUrlEncoded } from '../base.service';
import { RootResponse } from './types';

export class GetEBSPrefillDataBySubmissionIdService extends BaseService {
  constructor() {
    super("", "/getEBSPrefillDataBySubmissionId/v1");
  }

  invoke(submissionId: string, ctx?: ServiceFnCtx): Promise<ServiceResponse<RootResponse>> {
    const url = this.buildTargetUrl(`/submissions/${submissionId}/screens`, {}, ctx);
    return this.request<RootResponse>(url, "get", ctx);
  }

}

export const getEBSPrefillDataBySubmissionIdService = new GetEBSPrefillDataBySubmissionIdService();
