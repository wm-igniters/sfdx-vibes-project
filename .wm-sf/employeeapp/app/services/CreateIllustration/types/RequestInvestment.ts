/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { RequestSingleContribution } from './RequestSingleContribution';

export interface RequestInvestment {
  commencementDate: string;
  additionalToExistingIsa: boolean;
  singleContribution: RequestSingleContribution;
  otherNewInvestmentsInRound: boolean;
  /** @format int32 */
  termYears: number;
}
