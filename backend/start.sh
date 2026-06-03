#!/bin/bash

echo "🔧 阀门报价系统后端 - 快速启动脚本"
echo "=================================="

cd "$(dirname "$0")"

if [ ! -f ".env" ]; then
  echo "⚠️  .env文件不存在，从.env.example复制..."
  cp .env.example .env
  echo "✅ 请编辑.env文件配置数据库信息"
  echo ""
  read -p "是否现在编辑.env文件？(y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    ${EDITOR:-nano} .env
  fi
fi

echo ""
echo "📦 检查依赖..."
if [ ! -d "node_modules" ]; then
  echo "📥 安装依赖..."
  npm install
else
  echo "✅ 依赖已安装"
fi

echo ""
echo "🗄️  数据库初始化..."
echo "请确保MySQL已启动，并手动执行以下SQL脚本："
echo "  mysql -u root -p < database/init.sql"
echo ""
read -p "数据库是否已初始化？(y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ 请先初始化数据库后再运行此脚本"
  exit 1
fi

echo ""
echo "🚀 启动开发服务器..."
npm run start:dev