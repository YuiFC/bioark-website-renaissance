# Welcome to BioArkTech project

## Project info

**URL**: https://www.bioarktech.com/

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes and pull in your server will also be reflected in .

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev:all
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS



## Stripe 支付开发指南

本项目内置了一个最小后端用于创建 Stripe Checkout 会话：

1) 复制 `.env.example` 为 `.env` 并设置：

- `STRIPE_SECRET_KEY`：你的 Stripe Secret Key，只保存在服务器端
- `VITE_API_BASE`：前端调用后端地址。开发环境可指向 `http://localhost:4242`；生产建议留空使用同源相对地址，或配置为你的域名，如 `https://api.example.com`。

2) 在本地分别启动：

- 前端：`npm run dev`
- 后端：`npm run dev:server`

或在 PowerShell 下使用：`npm run dev:full` 同时启动两者。

购物车 Checkout 按钮将调用后端 `/create-checkout-session` 接口并跳转到 Stripe 托管的收银台。

## 一体化开发启动 (Unified API)

已新增脚本整合原本两个端口（4242 Stripe / 4343 内容）为单一后端进程：

- `npm run dev:server:all` 启动后端（端口 4343，`MODE=all` 同时启用内容与 Stripe API）。
- `npm run dev:frontend:all` 前端使用同一端口作为 `VITE_API_BASE` 与 `VITE_STRIPE_API_BASE`。
- `npm run dev:all` 并行启动上述二者，达到“一次命令全部就绪”。

保留旧脚本（`dev:stripe:4242` / `dev:server:4343` / `dev:frontend:4343`），如需模拟分离部署仍可使用：

```sh
npm run dev:stripe:4242   # 仅 Stripe (4242)
npm run dev:server:4343   # 仅内容 (4343)
npm run dev:frontend:4343 # 前端指向两个独立端口
```

### 验证统一模式

1. 运行 `npm run dev:all`。
2. 浏览器访问 `http://localhost:4343`（或 Vite 输出的端口，如果 Vite 端口不同，API 仍在 4343）。
3. 检查网络：`/api/public/products` 与 `/create-checkout-session` 都应指向 4343。
4. Stripe 未设置密钥时会在控制台提示，可忽略或在 `.env` 配置 `STRIPE_SECRET_KEY`。


## 实时 Products 导航说明

导航栏中的 Products 下拉已接入后端动态数据，并支持实时更新：

- 新增接口 `/api/public/products/categories`：返回分类聚合后的产品列表。
- 新增 SSE 流 `/api/public/products/stream`：当 `products.json` 被修改或后台保存 `/api/products-config` 时推送 `update` 事件。
- 前端新增 Hook `useLiveProducts`：初次加载调用分类接口，随后通过 SSE 监听变化并去抖刷新。
- 导航组件 `Navigation.tsx` 使用该 Hook，移除了原本的定时轮询和本地强制刷新按钮（保留“重试”调用 Hook 的 reload）。

### 测试步骤

1. 启动后端：`npm run dev:server`
2. 启动前端：`npm run dev`
3. 打开浏览器访问站点，展开 Products 下拉，记录某分类产品数。
4. 在 Admin 后台添加或编辑产品并保存（或直接编辑 `server/data/products.json`）。
5. 观察导航下拉 1 秒内（去抖 400ms + 传输时间）自动更新，无需刷新页面。

如果需要临时禁用 SSE，可在浏览器 DevTools Network 面板阻断 `/api/public/products/stream`，导航会保持最后一次数据，不再自动更新。

