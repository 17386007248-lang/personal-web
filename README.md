# 雷子恒的个人网站

中文个人作品集，保留CampusMind校园智能知识库介绍，新增两个可操作的前端项目。

## 项目

| 项目 | 功能 | 入口 |
| --- | --- | --- |
| CampusMind | 校园文档知识库，独立仓库中的已有项目 | [源码](https://github.com/17386007248-lang/CampusMind) |
| Matrix Lab | 2×2/3×3运算、求逆过程、二维变换图 | [演示](projects/matrix-lab/index.html) · [说明](projects/matrix-lab/README.md) |
| Sort Lab | 冒泡/插入/选择排序、单步、暂停、调速、计数 | [演示](projects/sorting-lab/index.html) · [说明](projects/sorting-lab/README.md) |

## 运行

HTML、CSS、原生JavaScript，无框架、无第三方运行依赖。在根目录运行：

```bash
python3 -m http.server 8000
```

访问 http://localhost:8000。新增实验室使用ES模块，请通过HTTP打开，直接双击HTML可能被浏览器的模块安全策略阻止。

## 测试

需要Node.js 20或以上，无需npm install。

```bash
npm test
```

测试计算核心与算法轨迹，包括矩阵求逆与已知解、奇异和非法输入、排序结果/计数/数据独立性。界面点击与手机布局另需浏览器检查。

## 文件结构

```text
index.html                   个人介绍与三个项目入口
style.css                    首页样式
projects/labs.css            实验室共用样式
projects/matrix-lab/          矩阵页面、计算核心及说明
projects/sorting-lab/         排序页面、算法核心及说明
tests/labs.test.js            核心功能测试
docs/ASSESSMENT.md            演示顺序、实现讲解与功能边界
```

## 展示准备

参见[演示与讲解准备](docs/ASSESSMENT.md)。新项目为浏览器本地演示，不需要账号、不上传输入、不依赖后端API。CampusMind仍由其独立仓库提供实现。

## 部署

可部署到GitHub Pages等静态托管服务。将代码提交到GitHub不代表已启用Pages；本仓库不假定存在公开演示地址。仓库如启用Pages，选择main分支根目录即可。
