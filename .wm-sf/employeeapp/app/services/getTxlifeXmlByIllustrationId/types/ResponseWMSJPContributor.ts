/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseWMSJPAmount } from './ResponseWMSJPAmount';
import { ResponseWMSJPContributorName } from './ResponseWMSJPContributorName';
import { ResponseWMSJPContributorType } from './ResponseWMSJPContributorType';
import { ResponseWMSJPSystemCalculated } from './ResponseWMSJPSystemCalculated';

export interface ResponseWMSJPContributor {
  WMSJP_ContributorType: ResponseWMSJPContributorType;
  WMSJP_SystemCalculated: ResponseWMSJPSystemCalculated;
  __prefix: string;
  WMSJP_Amount: ResponseWMSJPAmount;
  WMSJP_ContributorName: ResponseWMSJPContributorName;
}
