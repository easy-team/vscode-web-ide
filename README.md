# easy-web-ide

基于 Egg + React + Webpack 实现的 VSCode Web IDE 项目

![easy-web-ide](https://github.com/easy-team/easy-web-ide/blob/master/docs/images/vscode-web-ide.jpg)


## 使用

#### 安装依赖

```bash
npm install
```


#### 本地开发启动应用

```bash
npm run dev
```

应用访问: http://127.0.0.1:7001

#### 发布模式启动应用

- 首先在本地或者ci构建好jsbundle文件

```bash
npm run build 
```

- 然后,启动应用

```bash
npm start 
```


#### 项目构建

```bash
// 直接运行(编译文件全部在内存里面,本地开发使用)
npm start

// 编译文件到磁盘打包使用(发布正式环境)
npm run build 或者 easy build

```

## 文档

- https://www.yuque.com/easy-team/egg-react
- https://zhuanlan.zhihu.com/easywebpack


## 依赖

- [easywebpack-react](https://github.com/easy-team/easywebpack-react) ^4.x.x
- [egg-view-react-ssr](https://github.com/easy-team/egg-view-react-ssr) ^2.1.0
- [egg-webpack](https://github.com/easy-team/egg-webpack) ^4.x.x
- [egg-webpack-react](https://github.com/easy-team/egg-webpack-react) ^2.0.0


## License

[MIT](LICENSE)
