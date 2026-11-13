/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseWMSJPAllocationPct } from './ResponseWMSJPAllocationPct';
import { ResponseWMSJPContributionType } from './ResponseWMSJPContributionType';
import { ResponseWMSJPFundCode } from './ResponseWMSJPFundCode';
import { ResponseWMSJPFundGroup } from './ResponseWMSJPFundGroup';
import { ResponseWMSJPOngoingFundChargePct } from './ResponseWMSJPOngoingFundChargePct';
import { ResponseWMSJPShareClass } from './ResponseWMSJPShareClass';

export interface ResponseWMSJPFundAllocation {
  WMSJP_OngoingFundChargePct: ResponseWMSJPOngoingFundChargePct;
  WMSJP_AllocationPct: ResponseWMSJPAllocationPct;
  __prefix: string;
  WMSJP_FundCode: ResponseWMSJPFundCode;
  WMSJP_ShareClass: ResponseWMSJPShareClass;
  WMSJP_ContributionType: ResponseWMSJPContributionType;
  WMSJP_FundGroup: ResponseWMSJPFundGroup;
}
