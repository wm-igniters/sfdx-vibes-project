/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseOptionsEntryItem } from './ResponseOptionsEntryItem';

export interface ResponseFieldsEntryItem {
  subsection: string;
  visible: boolean;
  lookupCategory: string;
  options: Array<ResponseOptionsEntryItem>;
  ebsFieldId: string;
  requiredMode: string;
  readOnly: boolean;
  type: string;
  key: string;
  /** @format int32 */
  maxLength: number;
  required: boolean;
}
