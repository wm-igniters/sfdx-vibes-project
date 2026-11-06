// Jest stub for <lightning-ui-embedding> (not shipped in @salesforce/sfdx-lwc-jest stubs yet).
import { LightningElement, api } from 'lwc';

export default class UiEmbedding extends LightningElement {
    @api src;
    @api title;
    @api props;
}
