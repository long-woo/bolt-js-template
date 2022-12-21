/* eslint-disable @typescript-eslint/no-var-requires */
const glob = require('glob')
const rimraf = require('rimraf')
const { runCMD, runCMDSpawn } = require('./common')

/**
 * 执行 Rollup 命令
 * @param {*} name - 包名
 * @param {*} isDev - 开发模式
 */
const runRollup = (name, isDev) => {
	let changelog = ''
	if (!isDev) {
		changelog = runCMD('pnpm changeset && pnpm changeset version')
	}

	if (!changelog) {
		// 删除 dist 目录
		rimraf.sync(`${name}/dist/*`)

		runCMDSpawn('rollup', `-c${isDev ? ' -w' : ''} --bundleConfigAsCjs`, {
			env: {
				BUILD_PACKAGE: name
			}
		})
	}

	// runCMD('api-extractor', 'run', {
	// 	cwd: `${process.cwd()}/${name}`
	// })
}

/**
 * 处理编译
 * @param {*} pkgs - 编译的包
 * @param {*} isDev - 开发模式
 */
const handleBuildPackage = (pkgs, isDev) => {
	pkgs.forEach(pkg => {
		const isPackage = pkg.indexOf('packages') > -1

		pkg = isPackage ? pkg : `packages/${pkg}`
		runRollup(pkg, isDev)
	})
}

/**
 * 编译入口
 */
const build = () => {
	const argv = process.argv
	const isDev = argv.indexOf('-w') > -1
	const packageIndex = isDev ? 3 : 2

	const buildPackages = argv.slice(packageIndex)

	if (buildPackages.length) {
		handleBuildPackage(buildPackages, isDev)
		return
	}

	// 没有指定包名，编译所有包
	glob('packages/*', (error, matches) => {
		matches.forEach(pkg => {
			runRollup(pkg, isDev)
		})
	})
}

build()
