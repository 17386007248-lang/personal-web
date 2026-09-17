# 雷子恒的个人网站

中文个人作品集网站，展示个人介绍、CampusMind 校园智能知识库项目和联系方式。

## 页面内容

- 首页介绍与关于我
- CampusMind 项目展示和源码链接
- 点击拨号、发送邮件与 GitHub 链接
- 适配电脑和手机的响应式布局
- 键盘导航、跳转正文和减少动画偏好支持

## 技术

HTML5 + CSS3，无框架、无构建步骤、无第三方运行依赖。

## 本地预览

下载仓库后可直接打开 `index.html`，也可以在仓库目录运行：

```bash
python3 -m http.server 8000
```

然后在浏览器访问 http://localhost:8000。

## 文件结构

```text
index.html   页面内容、联系方式与搜索元信息
style.css    排版、配色与手机适配
favicon.svg  网站图标
README.md    项目说明
```

## 修改内容

在 `index.html` 修改个人介绍、项目和联系方式；在 `style.css` 调整样式。页面当前内嵌 SVG 图标，修改图标时也需要同步更新 HTML 的 `rel="icon"`。

## 部署

这是纯静态网站，可托管到支持 HTML/CSS 的服务。GitHub 仓库保存源码，上传源码不会自动启用 GitHub Pages。
