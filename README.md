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
