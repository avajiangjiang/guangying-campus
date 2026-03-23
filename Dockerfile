# 使用 Node.js 20 作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package.json pnpm-lock.yaml* ./

# 安装 pnpm 并安装依赖
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# 复制项目文件
COPY . .

# 构建项目
RUN pnpm run build:vercel

# 暴露端口
EXPOSE 5000

# 设置环境变量
ENV PORT=5000
ENV NODE_ENV=production

# 启动服务
CMD ["npx", "next", "start", "-p", "5000"]
