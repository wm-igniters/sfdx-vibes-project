/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseClient } from './ResponseClient';
import { ResponsePreparedBy } from './ResponsePreparedBy';
import { ResponseProduct } from './ResponseProduct';

export interface ResponseRootResponseROOTEntryItem {
  currentStep: string;
  createdAt: string;
  txLife: string;
  product: ResponseProduct;
  preparedBy: ResponsePreparedBy;
  taxYear: string;
  illustrationRef: string;
  client: ResponseClient;
  illustratedAt: string;
  /** @format int32 */
  illustrationId: number;
  status: string;
  updatedAt: string;
}
