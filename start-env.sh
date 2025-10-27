#!/bin/bash

# 家里环境
if [ "$1" = "home" ]; then
  cp .env.local .env
  npm run dev
# 单位环境
elif [ "$1" = "office" ]; then
  cp .env.office .env
  npm run dev
else
  echo "Please specify environment: home or office"
  exit 1
fi 