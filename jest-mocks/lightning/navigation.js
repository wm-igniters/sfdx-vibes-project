// Jest mock for lightning/navigation that records Navigate calls
// (the sfdx-lwc-jest default stub makes Navigate a no-op).
import { createTestWireAdapter } from '@salesforce/wire-service-jest-util';

export const CurrentPageReference = createTestWireAdapter(jest.fn());

const Navigate = Symbol('Navigate');
const GenerateUrl = Symbol('GenerateUrl');
let navigateCalls = [];

export const NavigationMixin = (Base) =>
    class extends Base {
        [Navigate](pageRef, replace) {
            navigateCalls.push({ pageRef, replace });
        }
        [GenerateUrl]() {
            return Promise.resolve('https://www.example.com');
        }
    };
NavigationMixin.Navigate = Navigate;
NavigationMixin.GenerateUrl = GenerateUrl;

export const getNavigateCalls = () => navigateCalls;
export const resetNavigateCalls = () => {
    navigateCalls = [];
};
