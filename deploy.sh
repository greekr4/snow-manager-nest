#!/usr/bin/env bash
set -euo pipefail

# 설정값
APP_DIR="/home/snow-manager-nest"   # 프로젝트 경로에 맞게 수정
BRANCH="master"                          # 배포 브랜치
PM2_NAME="snow-manager"                # PM2 프로세스 이름

cd "$APP_DIR"

echo "[1/5] Git 업데이트 (로컬 변경 무시)"
git fetch --all
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
git clean -fd

echo "[2/5] 의존성 설치"
npm ci

echo "[3/5] Prisma 생성 (옵션)"
npx prisma generate || true
# 마이그레이션 적용이 필요하면 아래 주석을 해제
# npx prisma migrate deploy || true

echo "[4/5] 빌드"
npm run build

echo "[5/5] PM2로 실행"
export PORT=3333
export NODE_ENV=production

if ! command -v pm2 >/dev/null 2>&1; then
  npm i -g pm2
fi

if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  pm2 reload "$PM2_NAME" --update-env --time
else
  pm2 start dist/main.js --name "$PM2_NAME" --time
fi

pm2 save

echo "완료: http://<서버IP>:3333"