/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseWMSJPBasisAmount } from './ResponseWMSJPBasisAmount';
import { ResponseWMSJPChargeAmount } from './ResponseWMSJPChargeAmount';
import { ResponseWMSJPComponent } from './ResponseWMSJPComponent';
import { ResponseWMSJPPeriodYear } from './ResponseWMSJPPeriodYear';
import { ResponseWMSJPRatePct } from './ResponseWMSJPRatePct';

export interface ResponseWMSJPChargeSummaryEntryItem {
  WMSJP_PeriodYear: ResponseWMSJPPeriodYear;
  WMSJP_Component: ResponseWMSJPComponent;
  __prefix: string;
  WMSJP_RatePct: ResponseWMSJPRatePct;
  WMSJP_ChargeAmount: ResponseWMSJPChargeAmount;
  WMSJP_BasisAmount: ResponseWMSJPBasisAmount;
}
