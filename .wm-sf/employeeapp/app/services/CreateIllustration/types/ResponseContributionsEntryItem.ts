/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseAllocationsEntryItem } from './ResponseAllocationsEntryItem';
import { ResponseChargesEntryItem } from './ResponseChargesEntryItem';
import { ResponseContributorsEntryItem } from './ResponseContributorsEntryItem';

export interface ResponseContributionsEntryItem {
  /** @format int32 */
  contributionId: number;
  useAft: boolean;
  transferInSpecie: string;
  transferValue: string;
  /** @format int32 */
  grossAmount: number;
  chargesNonStandard: boolean;
  maximise: boolean;
  frequency: string;
  escalationPct: string;
  transferFromProvider: string;
  contributionType: string;
  charges: Array<ResponseChargesEntryItem>;
  allocations: Array<ResponseAllocationsEntryItem>;
  /** @format int32 */
  allocationTotalPct: number;
  contributors: Array<ResponseContributorsEntryItem>;
  internalReplacement: boolean;
  concessionNumber: string;
  startDate: string;
}
