## Getting Start
## 调试项目

```bash
$ yarn dev:web    # 网页版
$ yarn dev:weapp  # 微信小程序
```

## 构建

```bash
$ yarn build:web    # 网页版
$ yarn build:weapp  # 微信小程序
```

生成出来的 dist 代码会在 `dist/[web | weapp]` 里。

## 一些注意事项
### 关于分包

支持分包，写法与原生小程序的差不多。但是要注意在分包的页面里引入的媒体资源是不会移动到分包文件夹的（依然在根目录上），这点需要注意，建议移动到 `public/[分包文件夹]` 的位置里。
