# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/661841ec-90a4-4064-bd5d-1a4a6777fc0e

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/661841ec-90a4-4064-bd5d-1a4a6777fc0e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

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
npm run dev
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

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/661841ec-90a4-4064-bd5d-1a4a6777fc0e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Stripe 支付开发指南

本项目内置了一个最小后端用于创建 Stripe Checkout 会话：

1) 复制 `.env.example` 为 `.env` 并设置：

- `STRIPE_SECRET_KEY`：你的 Stripe Secret Key，只保存在服务器端
- `VITE_API_BASE`：前端调用后端地址（默认 `http://localhost:4242`）

2) 在本地分别启动：

- 前端：`npm run dev`
- 后端：`npm run dev:server`

或在 PowerShell 下使用：`npm run dev:full` 同时启动两者。

购物车 Checkout 按钮将调用后端 `/create-checkout-session` 接口并跳转到 Stripe 托管的收银台。
