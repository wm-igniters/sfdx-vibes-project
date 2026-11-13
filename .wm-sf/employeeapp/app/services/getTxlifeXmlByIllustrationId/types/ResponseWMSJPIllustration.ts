/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseWMSJPIllustratedAt } from './ResponseWMSJPIllustratedAt';
import { ResponseWMSJPIllustrationRef } from './ResponseWMSJPIllustrationRef';
import { ResponseWMSJPIncludeGraph } from './ResponseWMSJPIncludeGraph';
import { ResponseWMSJPProductIllustrationSource } from './ResponseWMSJPProductIllustrationSource';
import { ResponseWMSJPRun } from './ResponseWMSJPRun';
import { ResponseWMSJPStatus } from './ResponseWMSJPStatus';
import { ResponseWMSJPTaxYear } from './ResponseWMSJPTaxYear';

export interface ResponseWMSJPIllustration {
  WMSJP_TaxYear: ResponseWMSJPTaxYear;
  WMSJP_ProductIllustrationSource: ResponseWMSJPProductIllustrationSource;
  WMSJP_Run: ResponseWMSJPRun;
  WMSJP_IncludeGraph: ResponseWMSJPIncludeGraph;
  __prefix: string;
  WMSJP_IllustrationRef: ResponseWMSJPIllustrationRef;
  WMSJP_IllustratedAt: ResponseWMSJPIllustratedAt;
  WMSJP_Status: ResponseWMSJPStatus;
}
