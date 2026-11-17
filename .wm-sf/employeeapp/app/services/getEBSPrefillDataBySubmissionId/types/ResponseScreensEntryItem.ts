/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { JavaLangObject } from './JavaLangObject';
import { ResponseFieldsEntryItem } from './ResponseFieldsEntryItem';
import { ResponseSources } from './ResponseSources';
import { ResponseValues } from './ResponseValues';

export interface ResponseScreensEntryItem {
  summary: string;
  /** @format int32 */
  submissionId: number;
  /** @format int32 */
  rowVersion: number;
  sources: ResponseSources;
  values: ResponseValues;
  screen: string;
  groups: Array<JavaLangObject>;
  label: string;
  fields: Array<ResponseFieldsEntryItem>;
  errors: Array<JavaLangObject>;
  status: string;
}
