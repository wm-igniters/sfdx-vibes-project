/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseHolding } from './ResponseHolding';
import { ResponsePartyEntryItem } from './ResponsePartyEntryItem';
import { ResponseRelationEntryItem } from './ResponseRelationEntryItem';

export interface ResponseOLifE {
  Relation: Array<ResponseRelationEntryItem>;
  Party: Array<ResponsePartyEntryItem>;
  Holding: ResponseHolding;
}
