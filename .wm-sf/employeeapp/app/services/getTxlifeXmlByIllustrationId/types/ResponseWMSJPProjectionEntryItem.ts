/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseWMSJPChargesToDate } from './ResponseWMSJPChargesToDate';
import { ResponseWMSJPContributionsToDate } from './ResponseWMSJPContributionsToDate';
import { ResponseWMSJPFundValue } from './ResponseWMSJPFundValue';
import { ResponseWMSJPGrowthRatePct } from './ResponseWMSJPGrowthRatePct';
import { ResponseWMSJPProjectionYear } from './ResponseWMSJPProjectionYear';
import { ResponseWMSJPScenario } from './ResponseWMSJPScenario';
import { ResponseWMSJPWithdrawalsToDate } from './ResponseWMSJPWithdrawalsToDate';

export interface ResponseWMSJPProjectionEntryItem {
  WMSJP_FundValue: ResponseWMSJPFundValue;
  __prefix: string;
  WMSJP_WithdrawalsToDate: ResponseWMSJPWithdrawalsToDate;
  WMSJP_Scenario: ResponseWMSJPScenario;
  WMSJP_ProjectionYear: ResponseWMSJPProjectionYear;
  WMSJP_GrowthRatePct: ResponseWMSJPGrowthRatePct;
  WMSJP_ChargesToDate: ResponseWMSJPChargesToDate;
  WMSJP_ContributionsToDate: ResponseWMSJPContributionsToDate;
}
