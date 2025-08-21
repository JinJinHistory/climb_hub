#!/bin/bash

# MCP 서버들을 중지하는 스크립트

echo "🛑 MCP 서버들을 중지합니다..."

# 현재 디렉토리를 프로젝트 루트로 변경
cd "$(dirname "$0")/.."

# PID 파일이 존재하는지 확인
if [ -f ".mcp-servers.pid" ]; then
    echo "📋 PID 파일을 읽고 있습니다..."
    
    # 각 PID를 읽어서 프로세스 종료
    while IFS= read -r pid; do
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            echo "🔄 PID $pid 프로세스를 종료합니다..."
            kill "$pid"
            
            # 프로세스가 완전히 종료될 때까지 대기
            for i in {1..10}; do
                if ! kill -0 "$pid" 2>/dev/null; then
                    echo "✅ PID $pid 프로세스가 종료되었습니다."
                    break
                fi
                sleep 1
            done
            
            # 강제 종료가 필요한 경우
            if kill -0 "$pid" 2>/dev/null; then
                echo "⚠️ PID $pid 프로세스를 강제 종료합니다..."
                kill -9 "$pid"
                echo "✅ PID $pid 프로세스가 강제 종료되었습니다."
            fi
        else
            echo "ℹ️ PID $pid 프로세스가 이미 종료되었거나 존재하지 않습니다."
        fi
    done < ".mcp-servers.pid"
    
    # PID 파일 삭제
    rm -f ".mcp-servers.pid"
    echo "🗑️ PID 파일을 삭제했습니다."
    
else
    echo "ℹ️ PID 파일을 찾을 수 없습니다. 실행 중인 Node.js 프로세스를 확인합니다..."
    
    # 실행 중인 MCP 서버 프로세스들을 찾아서 종료
    pids=$(pgrep -f "mcp-servers.*\.js" 2>/dev/null)
    
    if [ -n "$pids" ]; then
        echo "🔍 실행 중인 MCP 서버 프로세스들을 찾았습니다: $pids"
        
        for pid in $pids; do
            echo "🔄 PID $pid 프로세스를 종료합니다..."
            kill "$pid"
            
            # 프로세스가 완전히 종료될 때까지 대기
            for i in {1..10}; do
                if ! kill -0 "$pid" 2>/dev/null; then
                    echo "✅ PID $pid 프로세스가 종료되었습니다."
                    break
                fi
                sleep 1
            done
            
            # 강제 종료가 필요한 경우
            if kill -0 "$pid" 2>/dev/null; then
                echo "⚠️ PID $pid 프로세스를 강제 종료합니다..."
                kill -9 "$pid"
                echo "✅ PID $pid 프로세스가 강제 종료되었습니다."
            fi
        done
    else
        echo "ℹ️ 실행 중인 MCP 서버 프로세스를 찾을 수 없습니다."
    fi
fi

# 포트 사용 상태 확인
echo ""
echo "🔍 포트 사용 상태를 확인합니다..."

ports=(3001 3002 3003 3004)
for port in "${ports[@]}"; do
    if lsof -i :$port >/dev/null 2>&1; then
        echo "⚠️ 포트 $port가 여전히 사용 중입니다."
        lsof -i :$port
    else
        echo "✅ 포트 $port가 사용되지 않습니다."
    fi
done

echo ""
echo "🎉 MCP 서버 중지가 완료되었습니다!"
echo "🚀 서버를 다시 시작하려면: ./start-mcp-servers.sh"
