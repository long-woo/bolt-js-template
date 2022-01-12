module.exports = {
	preset: 'ts-jest',
	verbose: true,
	testPathIgnorePatterns: ['/node_modules/', '<rootDir>/scripts/'],
	collectCoverage: true,
	coverageDirectory: `${process.env.TEST_PACKAGE}/coverage`
}
