# 光影校园影像 - Vercel 部署指南

## 📋 部署前准备

### 1. 注册必要账号
- [GitHub 账号](https://github.com)（用于代码托管）
- [Vercel 账号](https://vercel.com)（建议使用 GitHub 登录）

### 2. 准备对象存储服务
您需要一个 S3 兼容的对象存储服务来存储上传的图片和视频：

| 推荐服务商 | 特点 | 价格 |
|-----------|------|------|
| 阿里云 OSS | 国内访问快，稳定 | 按量付费 |
| 腾讯云 COS | 国内访问快 | 按量付费 |
| 七牛云 | 有免费额度 | 免费 10GB |
| AWS S3 | 国际通用 | 按量付费 |

---

## 🚀 部署步骤

### 步骤一：上传代码到 GitHub

1. 创建新的 GitHub 仓库
   ```bash
   # 在 GitHub 网站上创建新仓库，例如：guangying-campus
   ```

2. 初始化本地 Git 并推送
   ```bash
   cd /workspace/projects
   
   # 初始化 Git（如果还没有）
   git init
   
   # 添加所有文件
   git add .
   
   # 提交
   git commit -m "初始化光影校园影像官网"
   
   # 添加远程仓库
   git remote add origin https://github.com/你的用户名/guangying-campus.git
   
   # 推送到 GitHub
   git push -u origin main
   ```

### 步骤二：在 Vercel 导入项目

1. 登录 [Vercel](https://vercel.com)
2. 点击 **"Add New"** → **"Project"**
3. 选择 **"Import Git Repository"**
4. 授权并选择您的 GitHub 仓库
5. 配置项目：
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `./`
   - **Build Command**: `pnpm run build:vercel`
   - **Output Directory**: `.next`

### 步骤三：配置环境变量

在 Vercel 项目设置中添加环境变量：

1. 进入项目 → **Settings** → **Environment Variables**
2. 添加以下变量：

| 变量名 | 说明 | 示例值 |
|-------|------|--------|
| `COZE_BUCKET_ENDPOINT_URL` | S3 端点地址 | `https://oss-cn-hangzhou.aliyuncs.com` |
| `COZE_BUCKET_NAME` | 存储桶名称 | `guangying-campus` |

### 步骤四：部署

1. 点击 **"Deploy"** 按钮
2. 等待构建完成（约 2-3 分钟）
3. 部署成功后获得访问域名，如：`https://guangying-campus.vercel.app`

---

## 🔧 部署后配置

### 绑定自定义域名（可选）

1. 进入项目 → **Settings** → **Domains**
2. 添加您的域名，如：`www.guangying-campus.com`
3. 按照提示在域名服务商处添加 DNS 解析

### 国内访问优化

如果主要用户在国内，建议：
1. 使用阿里云/腾讯云 OSS 作为对象存储
2. 域名备案后绑定自定义域名
3. 考虑使用 Vercel 的香港节点（已在 vercel.json 中配置）

---

## 📁 项目结构

```
/workspace/projects/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 首页
│   │   ├── admin/page.tsx     # 管理后台
│   │   └── api/               # API 路由
│   ├── components/            # 组件
│   └── data/                  # 数据文件
├── public/                    # 静态资源
├── vercel.json               # Vercel 配置
├── package.json              # 依赖配置
└── .env.example              # 环境变量示例
```

---

## ❓ 常见问题

### Q: 部署失败怎么办？
检查 Vercel 的构建日志，常见问题：
- 依赖安装失败：检查 package.json
- 环境变量缺失：确认已配置所有必需变量

### Q: 图片/视频上传失败？
检查对象存储配置：
- 确认 Bucket 已创建
- 确认 Access Key 有写入权限
- 确认跨域配置（CORS）

### Q: 如何更新网站？
```bash
# 修改代码后
git add .
git commit -m "更新内容"
git push
# Vercel 会自动重新部署
```

---

## 📞 技术支持

如有问题，请检查：
1. Vercel 控制台的部署日志
2. 浏览器控制台的错误信息
3. 对象存储服务的配置
