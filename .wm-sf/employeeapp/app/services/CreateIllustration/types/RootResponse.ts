/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseBenefits } from './ResponseBenefits';
import { ResponseContributionsEntryItem } from './ResponseContributionsEntryItem';
import { ResponseInvestment } from './ResponseInvestment';
import { ResponsePartiesEntryItem } from './ResponsePartiesEntryItem';
import { ResponsePreparedBy } from './ResponsePreparedBy';
import { ResponseProduct } from './ResponseProduct';
import { ResponseTxLife } from './ResponseTxLife';

export interface RootResponse {
  benefits: ResponseBenefits;
  product: ResponseProduct;
  /** @format int32 */
  clientId: number;
  illustrationRef: string;
  investment: ResponseInvestment;
  illustratedAt: string;
  /** @format int32 */
  illustrationId: number;
  currentStep: string;
  includeGraph: boolean;
  createdAt: string;
  txLife: ResponseTxLife;
  preparedBy: ResponsePreparedBy;
  contributions: Array<ResponseContributionsEntryItem>;
  taxYear: string;
  parties: Array<ResponsePartiesEntryItem>;
  status: string;
  updatedAt: string;
}
