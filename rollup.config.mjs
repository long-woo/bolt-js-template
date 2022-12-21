import { readFileSync } from 'node:fs'

import terser from '@rollup/plugin-terser'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'

/**
 * 文件头说明
 * @param {*} name - 包名
 * @param {*} fileName - 文件名
 * @param {*} version - 版本号
 */
const generateBanner = (name, fileName, version) => {
	return `/*! **************************************************
** ${name}(${fileName}) version ${version}
** (c) loong.woo
*************************************************** */\n`
}

/**
 * 编译格式
 * @param {*} fileName - 文件名
 * @param {*} formats - 格式
 * @returns { outFile: '*.min.js', format: 'es', mode: 'production' }
 */
const buildFormat = (fileName, formats) => {
	return formats.reduce((prev, current) => {
		const format = [
			{
				outFile: `${fileName}.${current}.js`,
				format: current,
				mode: 'development'
			},
			{
				outFile: `${fileName}.${current}.min.js`,
				format: current,
				mode: 'production'
			}
		]

		prev.push(...format)
		return prev
	}, [])
}

/**
 * 编译配置
 * @param {*} pkg - 包信息
 * @param {*} external - 外部包
 * @param {*} config - 编译配置
 * @param {*} buildFormat - 编译格式
 * @returns
 */
const getBuildConfig = (pkg, external, config, { outFile, format, mode }) => {
	const isProd = mode === 'production'
	const output = {
		file: `${process.env.BUILD_PACKAGE}/dist/${outFile}`,
		banner: config.banner ?? generateBanner(pkg.name, outFile, pkg.version),
		format,
		exports: 'auto'
	}

	// umd/iife 包，添加 globals、name
	if (['iife', 'umd'].includes(format)) {
		output.globals = config.globals
		output.name = config.var
	}

	return {
		input: `${process.env.BUILD_PACKAGE}/src/index.ts`,
		output,
		external,
		plugins: [
			typescript({
				rootDir: `${process.env.BUILD_PACKAGE}/src`
			}),
			json(),
			isProd &&
				terser({
					format: {
						comments: /loong.woo/
					}
				})
		]
	}
}

// 编译
const build = () => {
	const pkg = JSON.parse(readFileSync(`./${process.env.BUILD_PACKAGE}/package.json`))
	const config = JSON.parse(readFileSync(`./${process.env.BUILD_PACKAGE}/build.json`))

	const formats = buildFormat(pkg.displayName, config.formats)
	const external = [...(config.externals || []), ...Object.keys({ ...(pkg.dependencies || {}) })]

	return formats.map(format => getBuildConfig(pkg, external, config, format))
}

const buildConfig = build()

export default buildConfig
