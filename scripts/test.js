/* eslint-disable @typescript-eslint/no-var-requires */
const glob = require('glob')
const { runCMD } = require('./common')

/**
 * 运行 Jest
 * @param {*} name - 包名
 */
const runJest = name => {
	runCMD('jest', '', {
		env: {
			TEST_PACKAGE: name
		}
	})
}

/**
 * 处理测试包
 * @param {*} pkgs - 测试的包
 */
const handleTestPackages = pkgs => {
	pkgs.forEach(pkg => {
		const isPackage = pkg.indexOf('packages') > -1

		pkg = isPackage ? pkg : `packages/${pkg}`
		runJest(pkg)
	})
}

/**
 * 测试入口
 */
const main = () => {
	const argv = process.argv
	const testPackages = argv.slice(2)

	if (testPackages.length) {
		handleTestPackages(testPackages)
		return
	}

	// 没有指定包名，测试所有包
	glob('packages/*', (error, matches) => {
		handleTestPackages(matches)
	})
}

main()
