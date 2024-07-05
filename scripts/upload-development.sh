#!/bin/bash
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

yarn miniprogram-ci \
  upload \
  --pp . \
  --pkp ./local_secret/private.${WEAPP_APPID}.key \
  --appid $WEAPP_APPID \
  --ud "【测试服】构建回数: $GITHUB_RUN_NUMBER" \
  --uv $PACKAGE_VERSION \
  -r 1 \
  --enable-es6 false \
