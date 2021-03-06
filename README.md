# bolt-js-template

⚡️使用 [Bolt](https://github.com/boltpkg/bolt) 管理 JavaScript 项目模版。

## 安装依赖

```sh
bolt
# 或
yarn
```

## 创建一个新包

在 `packages` 目录下，创建一个新包的文件夹。

进入到创建好的的目录下，初始化包：

```sh
bolt init
```

修改 `package.json` 文件：

`package.json` 文件的 `files` 配置必须提供 `dist`，同时还需要提供 `main`、`module` 和 `types` 配置：

```json
{
  "name": "@<scope>/<package>",
  "displayName": "<package>",
  ...,
  "main": "dist/xx.umd.min.js",
  "module": "dist/xx.es.min.js",
  "types": "dist/types/index.d.ts",
  "files": ["dist"]
}
```

## 测试

有以下测试方式：

- Link（软连接）
- Jest

### Link（软连接）

通过软连接（npm link）的方式，更直观的测试（检验）我们开发的包是否能正常使用，方便调试、快速定位问题。

创建软连接：

```sh
npm link
```

使用：

```sh
npm link <scope>/<package>
```

### Jest

为每个包编写测试单元代码，并生成测试覆盖率。在 `packages/<package>` 下创建一个 `__test__` 文件夹，添加一个名为 `*.test.ts` 或 `*.spec.ts` 文件。
通过 `npm run test` 自动查找 `__test__` 下的单元测试文件，将会终端（命令行）输出测试结果信息，测试覆盖率文件会生成在 `coverage` 目录下。

> ⚠️ 如果要指定包测试，可使用 `npm run test <package>`。

## 打包

`build.json` 文件是必须的，否则无法进行打包。用于配置在打包时，对 `iife` 和 `umd` 模式的支持。

⚠️ 如果存在依赖第三方包，需要在 `build.json` 文件添加 `globals` 选项。

示例：

```json
{
  "name": "testName",
  "globals": {
    "vue": "Vue"
  }
}
```

开发状态下：

```sh
npm run dev

# 或指定具体包
npm run dev <package>
```

打包：

```sh
npm run build

# 或指定具体包
npm run build <package>
```

### 发布

> ⚠️ 发布之前需要确认 npm registry 是否已经设置为 https://registry.npmjs.org/。

在终端执行：

```sh
bolt publish
```
