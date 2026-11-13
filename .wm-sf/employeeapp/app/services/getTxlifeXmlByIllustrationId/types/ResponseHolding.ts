/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseArrangement } from './ResponseArrangement';
import { ResponseCurrencyTypeCode } from './ResponseCurrencyTypeCode';
import { ResponseFeeEntryItem } from './ResponseFeeEntryItem';
import { ResponseHoldingStatus } from './ResponseHoldingStatus';
import { ResponseHoldingTypeCode } from './ResponseHoldingTypeCode';
import { ResponseInvestment } from './ResponseInvestment';
import { ResponseOLifEExtension } from './ResponseOLifEExtension';
import { ResponsePolicy } from './ResponsePolicy';

export interface ResponseHolding {
  Policy: ResponsePolicy;
  HoldingStatus: ResponseHoldingStatus;
  CurrencyTypeCode: ResponseCurrencyTypeCode;
  Fee: Array<ResponseFeeEntryItem>;
  HoldingTypeCode: ResponseHoldingTypeCode;
  OLifEExtension: ResponseOLifEExtension;
  id: string;
  Arrangement: ResponseArrangement;
  Investment: ResponseInvestment;
}
