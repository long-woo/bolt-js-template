const glob = require('glob')
const rimraf = require('rimraf')
const { runCMD } = require('./common')

/**
 * 执行 Rollup 命令
 * @param {*} name - 包名
 */
const runRollup = name => {
	// 删除 dist 目录
	rimraf.sync(`${name}/dist/*`)

	runCMD('rollup', `-c`, {
		env: {
			BUILD_PACKAGE: name
		}
	})

	// runCMD('api-extractor', 'run', {
	// 	cwd: `${process.cwd()}/${name}`
	// })
}

// 编译
const build = () => {
	const buildPackage = process.argv[2]

	if (buildPackage) {
		runRollup(`packages/${buildPackage}`)
		return
	}

	// 没有指定包名，编译所有包
	glob('packages/*', (error, matches) => {
		matches.forEach(pkg => {
			runRollup(pkg)
		})
	})
}

build()
