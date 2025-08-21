#!/bin/bash

# MCP 서버들을 시작하는 스크립트
# 사용법: ./start-mcp-servers.sh [--stdio]

echo "🚀 MCP 서버들을 시작합니다..."

# 현재 디렉토리를 프로젝트 루트로 변경
cd "$(dirname "$0")/.."

# MCP 서버 디렉토리 생성
mkdir -p scripts/mcp-servers

# 서버 실행 옵션 설정
if [ "$1" = "--stdio" ]; then
    TRANSPORT="--stdio"
    echo "📡 stdio 전송 모드로 서버를 시작합니다."
else
    TRANSPORT=""
    echo "🌐 WebSocket 모드로 서버를 시작합니다."
fi

# Make.com MCP 서버 시작
echo "🔧 Make.com MCP 서버를 시작합니다..."
node scripts/mcp-servers/make-server.mjs $TRANSPORT --port=3001 &
MAKE_PID=$!
echo "✅ Make.com 서버 PID: $MAKE_PID"

# Apify MCP 서버 시작
echo "🤖 Apify MCP 서버를 시작합니다..."
node scripts/mcp-servers/apify-server.mjs $TRANSPORT --port=3002 &
APIFY_PID=$!
echo "✅ Apify 서버 PID: $APIFY_PID"

# ChatGPT API MCP 서버 시작
echo "🧠 ChatGPT API MCP 서버를 시작합니다..."
node scripts/mcp-servers/chatgpt-server.mjs $TRANSPORT --port=3003 &
CHATGPT_PID=$!
echo "✅ ChatGPT API 서버 PID: $CHATGPT_PID"

# Supabase MCP 서버 시작
echo "🗄️ Supabase MCP 서버를 시작합니다..."
node scripts/mcp-servers/supabase-server.mjs $TRANSPORT --port=3004 &
SUPABASE_PID=$!
echo "✅ Supabase 서버 PID: $SUPABASE_PID"

# PID들을 파일에 저장
echo "$MAKE_PID" > .mcp-servers.pid
echo "$APIFY_PID" >> .mcp-servers.pid
echo "$CHATGPT_PID" >> .mcp-servers.pid
echo "$SUPABASE_PID" >> .mcp-servers.pid

echo ""
echo "🎉 모든 MCP 서버가 시작되었습니다!"
echo ""
echo "📊 서버 상태:"
echo "• Make.com: http://localhost:3001"
echo "• Apify: http://localhost:3002"
echo "• ChatGPT API: http://localhost:3003"
echo "• Supabase: http://localhost:3004"
echo ""
echo "🛑 서버를 중지하려면: ./stop-mcp-servers.sh"
echo "📱 관리자 페이지: http://localhost:3000/admin/mcp"
echo ""

# 서버 상태 모니터링
echo "📡 서버 상태를 모니터링합니다... (Ctrl+C로 중지)"
trap 'echo ""; echo "🔄 스크립트를 종료합니다..."; exit 0' INT

while true; do
    sleep 5
    echo "⏰ $(date '+%H:%M:%S') - 모든 서버가 실행 중입니다."
done
