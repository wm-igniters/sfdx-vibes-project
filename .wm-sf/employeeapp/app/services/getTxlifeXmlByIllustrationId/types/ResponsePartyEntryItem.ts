/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseOLifEExtension } from './ResponseOLifEExtension';
import { ResponsePartyTypeCode } from './ResponsePartyTypeCode';
import { ResponsePerson } from './ResponsePerson';
import { ResponseProducer } from './ResponseProducer';

export interface ResponsePartyEntryItem {
  Producer: ResponseProducer;
  PartyTypeCode: ResponsePartyTypeCode;
  FullName: string;
  OLifEExtension: ResponseOLifEExtension;
  id: string;
  Person: ResponsePerson;
}
