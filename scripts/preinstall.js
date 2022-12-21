/* eslint-disable @typescript-eslint/no-var-requires */
const { runCMD, runCMDSpawn } = require('./common')

// 检查 Pnpm 是否安装。若没有安装，则安装
const checkPnpm = () => {
	console.log('检查 Pnpm...')

	const res = runCMDSpawn('pnpm', '-v')
	if (res.status === 0) return

	// 安装 Pnpm
	console.log('正在安装全局包 Pnpm...')
	runCMD('npm install -g pnpm')
	console.log('全局包 Pnpm 安装完成')
}

checkPnpm()

console.log('\n')
