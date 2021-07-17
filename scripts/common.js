const childProcess = require('child_process')

/**
 * 执行命令
 * @param {*} cmd - 命令
 * @param {*} args - 参数
 * @param {*} options - 选项
 * @returns
 */
const runCMD = (cmd, args, options) => {
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

	const res = childProcess.spawnSync(cmd, args, options)
	return res
}

module.exports = {
	runCMD
}
