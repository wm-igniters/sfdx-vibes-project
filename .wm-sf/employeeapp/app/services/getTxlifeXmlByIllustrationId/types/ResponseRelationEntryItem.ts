/* eslint-disable */
// Auto-generated model. Do not edit manually — regenerated on every build.

import { ResponseOriginatingObjectType } from './ResponseOriginatingObjectType';
import { ResponseRelatedObjectType } from './ResponseRelatedObjectType';
import { ResponseRelationRoleCode } from './ResponseRelationRoleCode';

export interface ResponseRelationEntryItem {
  RelatedObjectID: string;
  RelationRoleCode: ResponseRelationRoleCode;
  OriginatingObjectType: ResponseOriginatingObjectType;
  RelatedObjectType: ResponseRelatedObjectType;
  OriginatingObjectID: string;
  id: string;
}
