/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { RequestAccountOwner } from './RequestAccountOwner';
import { RequestBenefits } from './RequestBenefits';
import { RequestChargesEntryItem } from './RequestChargesEntryItem';
import { RequestFundSelection } from './RequestFundSelection';
import { RequestInvestment } from './RequestInvestment';

export interface RootRequest {
  benefits: RequestBenefits;
  charges: Array<RequestChargesEntryItem>;
  /** @format int32 */
  clientId: number;
  productCode: string;
  fundSelection: RequestFundSelection;
  illustrate: boolean;
  /** @format int32 */
  preparedByAdviserId: number;
  investment: RequestInvestment;
  accountOwner: RequestAccountOwner;
}
