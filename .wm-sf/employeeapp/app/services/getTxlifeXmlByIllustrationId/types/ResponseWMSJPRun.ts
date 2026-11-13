/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseWMSJPAssumptionsAsAt } from './ResponseWMSJPAssumptionsAsAt';
import { ResponseWMSJPCalcEngineVersion } from './ResponseWMSJPCalcEngineVersion';
import { ResponseWMSJPChargeSummaryEntryItem } from './ResponseWMSJPChargeSummaryEntryItem';
import { ResponseWMSJPProjectionEntryItem } from './ResponseWMSJPProjectionEntryItem';
import { ResponseWMSJPRunAt } from './ResponseWMSJPRunAt';
import { ResponseWMSJPRunNo } from './ResponseWMSJPRunNo';

export interface ResponseWMSJPRun {
  WMSJP_RunNo: ResponseWMSJPRunNo;
  WMSJP_ChargeSummary: Array<ResponseWMSJPChargeSummaryEntryItem>;
  __prefix: string;
  WMSJP_AssumptionsAsAt: ResponseWMSJPAssumptionsAsAt;
  WMSJP_Projection: Array<ResponseWMSJPProjectionEntryItem>;
  WMSJP_RunAt: ResponseWMSJPRunAt;
  WMSJP_CalcEngineVersion: ResponseWMSJPCalcEngineVersion;
}
