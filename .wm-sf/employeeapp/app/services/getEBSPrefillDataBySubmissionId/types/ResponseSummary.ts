/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseAccountOwner } from './ResponseAccountOwner';
import { ResponseAdditionalInfo } from './ResponseAdditionalInfo';
import { ResponseAmlConnectedParties } from './ResponseAmlConnectedParties';
import { ResponseBenefits } from './ResponseBenefits';
import { ResponseInvestment } from './ResponseInvestment';

export interface ResponseSummary {
  benefits: ResponseBenefits;
  "aml-connected-parties": ResponseAmlConnectedParties;
  "additional-info": ResponseAdditionalInfo;
  "account-owner": ResponseAccountOwner;
  investment: ResponseInvestment;
}
