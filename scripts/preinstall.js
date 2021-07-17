const { runCMD } = require('./common')

// 检查 Yarn 是否安装。若没有安装，则安装
const checkYarn = () => {
	console.log('检查 Yarn...')

	const res = runCMD('yarn', '--version')
	if (res.status === 0) return

	// 安装 Yarn
	console.log('正在安装全局包 Yarn...')
	runCMD('npm', 'install -g yarn')
	console.log('全局包 Yarn 安装完成')
}

// 检查 Bolt 是否安装。若没有安装，则安装
const checkBolt = () => {
	console.log('检查 Bolt...')

	const res = runCMD('bolt', '--version')
	if (res.status === 0) return

	// 安装 Bolt
	console.log('正在安装全局包 Bolt...')
	runCMD('npm', 'install -g bolt')
	console.log('全局包 Bolt 安装完成')
}

checkYarn()
checkBolt()

console.log('\n')
