/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseSinglePaymentsEntryItem } from './ResponseSinglePaymentsEntryItem';

export interface ResponseValues {
  country: string;
  correspondenceAddressee: string;
  reinvestIncome: boolean;
  title: string;
  proposalRef: string;
  frequency: string;
  forename: string;
  payeeName: string;
  emailAddress: string;
  surname: string;
  addressLine1: string;
  addressLine2: string;
  addressLine4: string;
  accountOwnerName: string;
  postcode: string;
  dateOfBirth: string;
  /** @format int32 */
  initialCredit: number;
  taxResidentClient: string;
  singlePayments: Array<ResponseSinglePaymentsEntryItem>;
  accountOwnerWishesWithdrawals: boolean;
  phoneNumber: string;
  /** @format int32 */
  accountOwnerContribution: number;
  /** @format double */
  ongoingAdviceFee: number;
  salutation: string;
  /** @format int32 */
  initialAdviceFee: number;
  existingAccount: boolean;
}
