/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseWMSJPChargesNonStandard } from './ResponseWMSJPChargesNonStandard';
import { ResponseWMSJPContributionType } from './ResponseWMSJPContributionType';
import { ResponseWMSJPContributor } from './ResponseWMSJPContributor';
import { ResponseWMSJPInternalReplacement } from './ResponseWMSJPInternalReplacement';
import { ResponseWMSJPMaximiseContribution } from './ResponseWMSJPMaximiseContribution';
import { ResponseWMSJPUseAft } from './ResponseWMSJPUseAft';

export interface ResponseWMSJPContribution {
  WMSJP_MaximiseContribution: ResponseWMSJPMaximiseContribution;
  WMSJP_Contributor: ResponseWMSJPContributor;
  __prefix: string;
  WMSJP_ContributionType: ResponseWMSJPContributionType;
  WMSJP_ChargesNonStandard: ResponseWMSJPChargesNonStandard;
  WMSJP_UseAft: ResponseWMSJPUseAft;
  WMSJP_InternalReplacement: ResponseWMSJPInternalReplacement;
}
