const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

module.exports = {
    ...jestConfig,
    moduleNameMapper: {
        ...(jestConfig.moduleNameMapper || {}),
        '^lightning/uiEmbedding$': '<rootDir>/jest-mocks/lightning/uiEmbedding/uiEmbedding',
        '^lightning/navigation$': '<rootDir>/jest-mocks/lightning/navigation'
    },
    modulePathIgnorePatterns: ['<rootDir>/.localdevserver']
};
