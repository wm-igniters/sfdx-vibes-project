/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseWMSJPAppliedRatePct } from './ResponseWMSJPAppliedRatePct';
import { ResponseWMSJPChargeTypeCode } from './ResponseWMSJPChargeTypeCode';
import { ResponseWMSJPContributionType } from './ResponseWMSJPContributionType';
import { ResponseWMSJPKind } from './ResponseWMSJPKind';
import { ResponseWMSJPStandardRatePct } from './ResponseWMSJPStandardRatePct';
import { ResponseWMSJPTiming } from './ResponseWMSJPTiming';

export interface ResponseWMSJPCharge {
  WMSJP_ChargeTypeCode: ResponseWMSJPChargeTypeCode;
  WMSJP_Timing: ResponseWMSJPTiming;
  __prefix: string;
  WMSJP_AppliedRatePct: ResponseWMSJPAppliedRatePct;
  WMSJP_ContributionType: ResponseWMSJPContributionType;
  WMSJP_Kind: ResponseWMSJPKind;
  WMSJP_StandardRatePct: ResponseWMSJPStandardRatePct;
}
