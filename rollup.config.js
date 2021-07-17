import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import typescript2 from 'rollup-plugin-typescript2'

/**
 * 文件头说明
 * @param {*} name - 包名
 * @param {*} fileName - 文件名
 * @param {*} version - 版本号
 */
const generateBanner = (name, fileName, version) => {
	return `/*! **************************************************
** ${name}(${fileName}) version ${version}
** (c) 良医汇前端组
*************************************************** */\n`
}

/**
 * 编译格式
 * @param {*} fileName - 文件名
 * @returns { outFile: '*.min.js', format: 'es', mode: 'production' }
 */
const buildFormat = fileName => ({
	iife: {
		outFile: `${fileName}.js`,
		format: 'iife',
		mode: 'development'
	},
	'iife-prod': {
		outFile: `${fileName}.min.js`,
		format: 'iife',
		mode: 'production'
	},
	cjs: {
		outFile: `${fileName}.common.js`,
		format: 'cjs',
		mode: 'development'
	},
	'cjs-prod': {
		outFile: `${fileName}.common.min.js`,
		format: 'cjs',
		mode: 'production'
	},
	es: {
		outFile: `${fileName}.es.js`,
		format: 'esm',
		mode: 'development'
	},
	'es-prod': {
		outFile: `${fileName}.es.min.js`,
		format: 'esm',
		mode: 'production'
	},
	umd: {
		outFile: `${fileName}.umd.js`,
		format: 'umd',
		mode: 'development'
	},
	'umd-prod': {
		outFile: `${fileName}.umd.min.js`,
		format: 'umd',
		mode: 'production'
	}
})

/**
 * 编译配置
 * @param {*} pkg - 包信息
 * @param {*} external - 外部包
 * @param {*} globals - 全局模块
 * @param {*} buildFormat - 编译格式
 * @returns
 */
const getBuildConfig = (pkg, external, globals, { outFile, format, mode }) => {
	const isProd = mode === 'production'
	const output = {
		file: `${process.env.BUILD_PACKAGE}/dist/${outFile}`,
		banner: generateBanner(pkg.name, outFile, pkg.version),
		format,
		exports: 'auto'
	}

	// umd/iife 包，添加 globals、name
	if (['iife', 'umd'].includes(format)) {
		output.globals = globals
		output.name = pkg.windowVariable
	}

	return {
		input: `${process.env.BUILD_PACKAGE}/src/index.ts`,
		output,
		external,
		plugins: [
			typescript2({
				typescript: require('typescript'),
				useTsconfigDeclarationDir: true,
				tsconfigOverride: {
					compilerOptions: {
						declarationDir: `${process.env.BUILD_PACKAGE}/dist/types`
					}
				}
			}),
			json(),
			isProd && terser()
		]
	}
}

// 编译
const build = () => {
	const pkg = require(`./${process.env.BUILD_PACKAGE}/package.json`)

	const format = buildFormat(pkg.displayName)
	const external = Object.keys({ ...(pkg.dependencies || '') })
	const globals = external.reduce((prev, current) => {
		prev[current] = current

		return prev
	}, {})

	return Object.keys(format).map(key =>
		getBuildConfig(pkg, external, globals, format[key])
	)
}

const buildConfig = build()

export default buildConfig
