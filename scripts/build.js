/* eslint-disable @typescript-eslint/no-var-requires */
const glob = require('glob')
const rimraf = require('rimraf')
const { runCMD } = require('./common')

/**
 * 执行 Rollup 命令
 * @param {*} name - 包名
 * @param {*} isWatch - 是否为开发模式
 */
const runRollup = (name, isWatch) => {
	// 删除 dist 目录
	rimraf.sync(`${name}/dist/*`)

	runCMD('rollup', `-c${isWatch ? '-w' : ''}`, {
		env: {
			BUILD_PACKAGE: name
		}
	})

	// runCMD('api-extractor', 'run', {
	// 	cwd: `${process.cwd()}/${name}`
	// })
}

/**
 * 处理编译
 * @param {*} pkgs - 编译的包
 */
const handleBuildPackage = pkgs => {
	pkgs.forEach(pkg => {
		const isPackage = pkg.indexOf('packages') > -1

		pkg = isPackage ? pkg : `packages/${pkg}`
		runRollup(pkg)
	})
}

// 编译
const build = () => {
	const argv = process.argv
	const isWatch = argv.includes('-w')
	const pkgIndex = isWatch ? 3 : 2
	const buildPackages = argv.slice(pkgIndex)

	if (buildPackages.length) {
		handleBuildPackage(buildPackages)
		return
	}

	// 没有指定包名，编译所有包
	glob('packages/*', (error, matches) => {
		handleBuildPackage(matches)
	})
}

build()
