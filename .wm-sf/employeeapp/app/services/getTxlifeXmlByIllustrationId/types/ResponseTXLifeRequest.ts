/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseOLifE } from './ResponseOLifE';
import { ResponseOLifEExtension } from './ResponseOLifEExtension';
import { ResponseTransType } from './ResponseTransType';

export interface ResponseTXLifeRequest {
  TransEffDate: string;
  OLifE: ResponseOLifE;
  TransExeTime: string;
  OLifEExtension: ResponseOLifEExtension;
  TransType: ResponseTransType;
  TransRefGUID: string;
  TransExeDate: string;
}
