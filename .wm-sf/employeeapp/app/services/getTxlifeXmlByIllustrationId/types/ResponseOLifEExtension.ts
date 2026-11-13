/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseWMSJPCharge } from './ResponseWMSJPCharge';
import { ResponseWMSJPContribution } from './ResponseWMSJPContribution';
import { ResponseWMSJPFundAllocation } from './ResponseWMSJPFundAllocation';
import { ResponseWMSJPHolding } from './ResponseWMSJPHolding';
import { ResponseWMSJPIllustration } from './ResponseWMSJPIllustration';
import { ResponseWMSJPParty } from './ResponseWMSJPParty';

export interface ResponseOLifEExtension {
  WMSJP_Party: ResponseWMSJPParty;
  WMSJP_Holding: ResponseWMSJPHolding;
  VendorCode: string;
  WMSJP_Charge: ResponseWMSJPCharge;
  WMSJP_Illustration: ResponseWMSJPIllustration;
  WMSJP_FundAllocation: ResponseWMSJPFundAllocation;
  WMSJP_Contribution: ResponseWMSJPContribution;
}
