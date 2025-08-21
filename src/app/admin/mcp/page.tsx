"use client";

import { useState, useEffect } from "react";
import { mcpClientManager } from "@/lib/mcp-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MCPIntegration from "@/components/features/MCPIntegration";

export default function MCPAdminPage() {
  const [serverStatus, setServerStatus] = useState<any[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    updateServerStatus();
  }, []);

  const updateServerStatus = () => {
    const status = mcpClientManager.getServerStatus();
    setServerStatus(status);
  };

  const handleConnectAll = async () => {
    setIsConnecting(true);
    try {
      await mcpClientManager.connectToAllServers();
      updateServerStatus();
    } catch (error) {
      console.error("MCP 서버 연결 오류:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectAll = async () => {
    setIsDisconnecting(true);
    try {
      await mcpClientManager.disconnectFromAllServers();
      updateServerStatus();
    } catch (error) {
      console.error("MCP 서버 연결 해제 오류:", error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleConnectServer = async (serverName: string) => {
    const config = mcpClientManager["configs"].find(
      (c) => c.name === serverName
    );
    if (config) {
      await mcpClientManager.connectToServer(config);
      updateServerStatus();
    }
  };

  const handleDisconnectServer = async (serverName: string) => {
    await mcpClientManager.disconnectFromServer(serverName);
    updateServerStatus();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">MCP 서버 관리</h1>
        <p className="text-gray-600">
          Make.com, Apify, ChatGPT API, Supabase MCP 서버들과의 연결을
          관리합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Button
          onClick={handleConnectAll}
          disabled={isConnecting}
          className="w-full"
          size="lg"
        >
          {isConnecting ? "연결 중..." : "모든 서버 연결"}
        </Button>

        <Button
          onClick={handleDisconnectAll}
          disabled={isDisconnecting}
          variant="outline"
          className="w-full"
          size="lg"
        >
          {isDisconnecting ? "연결 해제 중..." : "모든 서버 연결 해제"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {serverStatus.map((server) => (
          <Card
            key={server.name}
            className={
              server.connected ? "border-green-500" : "border-gray-300"
            }
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="capitalize">{server.name}</span>
                <div
                  className={`w-3 h-3 rounded-full ${
                    server.connected ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </CardTitle>
              <CardDescription>{server.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">상태: </span>
                  <span
                    className={
                      server.connected ? "text-green-600" : "text-gray-600"
                    }
                  >
                    {server.connected ? "연결됨" : "연결 안됨"}
                  </span>
                </div>

                <div className="flex space-x-2">
                  {!server.connected ? (
                    <Button
                      size="sm"
                      onClick={() => handleConnectServer(server.name)}
                      className="flex-1"
                    >
                      연결
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDisconnectServer(server.name)}
                      className="flex-1"
                    >
                      연결 해제
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">환경 변수 설정 가이드</h3>
        <div className="space-y-2 text-sm">
          <p>
            <code className="bg-gray-200 px-2 py-1 rounded">MAKE_MCP_URL</code>{" "}
            - Make.com MCP 서버 URL
          </p>
          <p>
            <code className="bg-gray-200 px-2 py-1 rounded">APIFY_MCP_URL</code>{" "}
            - Apify MCP 서버 URL
          </p>
          <p>
            <code className="bg-gray-200 px-2 py-1 rounded">
              CHATGPT_MCP_URL
            </code>{" "}
            - ChatGPT API MCP 서버 URL
          </p>
          <p>
            <code className="bg-gray-200 px-2 py-1 rounded">
              SUPABASE_MCP_URL
            </code>{" "}
            - Supabase MCP 서버 URL
          </p>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          .env.local 파일에 위 환경 변수들을 설정하고 MCP 서버들을 실행한 후
          연결 버튼을 클릭하세요.
        </p>
      </div>

      {/* MCP 통합 컴포넌트 */}
      <div className="mt-8">
        <MCPIntegration />
      </div>
    </div>
  );
}
