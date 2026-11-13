/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseWMSJPAdditionalToExistingIsa } from './ResponseWMSJPAdditionalToExistingIsa';
import { ResponseWMSJPCommencementDate } from './ResponseWMSJPCommencementDate';
import { ResponseWMSJPOtherNewInvestmentsInRound } from './ResponseWMSJPOtherNewInvestmentsInRound';
import { ResponseWMSJPPriorSubscriptionsThisYear } from './ResponseWMSJPPriorSubscriptionsThisYear';
import { ResponseWMSJPProductCategory } from './ResponseWMSJPProductCategory';
import { ResponseWMSJPProductCode } from './ResponseWMSJPProductCode';
import { ResponseWMSJPTakesRegularWithdrawals } from './ResponseWMSJPTakesRegularWithdrawals';
import { ResponseWMSJPTermYears } from './ResponseWMSJPTermYears';

export interface ResponseWMSJPHolding {
  WMSJP_ProductCode: ResponseWMSJPProductCode;
  WMSJP_TermYears: ResponseWMSJPTermYears;
  WMSJP_TakesRegularWithdrawals: ResponseWMSJPTakesRegularWithdrawals;
  __prefix: string;
  WMSJP_CommencementDate: ResponseWMSJPCommencementDate;
  WMSJP_OtherNewInvestmentsInRound: ResponseWMSJPOtherNewInvestmentsInRound;
  WMSJP_PriorSubscriptionsThisYear: ResponseWMSJPPriorSubscriptionsThisYear;
  WMSJP_ProductCategory: ResponseWMSJPProductCategory;
  WMSJP_AdditionalToExistingIsa: ResponseWMSJPAdditionalToExistingIsa;
}
