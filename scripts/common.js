/* eslint-disable @typescript-eslint/no-var-requires */
const { spawnSync, execSync } = require('child_process')

/**
 * 执行命令
 * @param {*} cmd - 命令
 * @param {*} args - 参数
 * @param {*} options - 选项
 * @returns
 */
const runCMDSpawn = (cmd, args, options) => {
	args = args.split(' ')
	options = {
		stdio: 'inherit',
		shell: true,
		encoding: 'utf8',
		...options
	}
	options.env = {
		...process.env,
		...options.env
	}

	const res = spawnSync(cmd, args, options)
	return res
}

/**
 * 运行命令（同步）
 * @param {*} cmd - 命令
 * @param {*} options - 选项
 */
const runCMD = (cmd, options) => {
	options = {
		encoding: 'utf8',
		stdio: 'inherit',
		...options
	}
	options.env = {
		...process.env,
		...options.env
	}

	return execSync(cmd, options)
}

module.exports = {
	runCMDSpawn,
	runCMD
}
