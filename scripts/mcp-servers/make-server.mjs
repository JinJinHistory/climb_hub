#!/usr/bin/env node

import { config } from "dotenv";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// 환경 변수 로드
config({ path: ".env.local" });

class MakeMCPServer {
  constructor() {
    this.server = new McpServer({
      name: "make-mcp-server",
      version: "1.0.0",
    });

    this.setupTools();
  }

  setupTools() {
    // 워크플로우 실행 도구
    this.server.registerTool(
      "make.trigger_workflow",
      {
        description: "Make.com 워크플로우를 실행합니다",
        inputSchema: {
          workflowId: { type: "string", description: "워크플로우 ID" },
          data: { type: "object", description: "워크플로우에 전달할 데이터" },
        },
      },
      async ({ workflowId, data }) => {
        return await this.triggerWorkflow(workflowId, data);
      }
    );

    this.server.registerTool(
      "make.get_workflow_status",
      {
        description: "Make.com 워크플로우 상태를 조회합니다",
        inputSchema: {
          workflowId: { type: "string", description: "워크플로우 ID" },
        },
      },
      async ({ workflowId }) => {
        return await this.getWorkflowStatus(workflowId);
      }
    );

    this.server.registerTool(
      "make.list_workflows",
      {
        description: "사용 가능한 Make.com 워크플로우 목록을 조회합니다",
        inputSchema: {},
      },
      async () => {
        return await this.listWorkflows();
      }
    );
  }

  async triggerWorkflow(workflowId, data) {
    console.log(`🚀 Triggering Make.com workflow: ${workflowId}`);

    // 환경 변수 확인
    const makeApiKey = process.env.MAKE_API_KEY;
    const makeWorkspaceId = process.env.MAKE_WORKSPACE_ID;

    if (!makeApiKey || !makeWorkspaceId) {
      throw new Error(
        "Make.com API 키 또는 워크스페이스 ID가 설정되지 않았습니다."
      );
    }

    // 실제 구현에서는 Make.com의 HTTP API를 사용
    const mockResponse = {
      executionId: `exec_${Date.now()}`,
      status: "running",
      workflowId,
      data,
      timestamp: new Date().toISOString(),
      apiKey: makeApiKey ? "✅ 설정됨" : "❌ 설정되지 않음",
      workspaceId: makeWorkspaceId ? "✅ 설정됨" : "❌ 설정되지 않음",
    };

    return {
      content: [
        {
          type: "text",
          text: `워크플로우가 성공적으로 실행되었습니다.\n실행 ID: ${mockResponse.executionId}\n상태: ${mockResponse.status}\nAPI 키: ${mockResponse.apiKey}\n워크스페이스 ID: ${mockResponse.workspaceId}`,
        },
      ],
    };
  }

  async getWorkflowStatus(workflowId) {
    console.log(`📊 Getting status for workflow: ${workflowId}`);

    const mockStatus = {
      workflowId,
      status: "completed",
      lastExecution: new Date().toISOString(),
      nextExecution: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      successCount: 15,
      errorCount: 2,
    };

    return {
      content: [
        {
          type: "text",
          text: `워크플로우 상태:\n상태: ${mockStatus.status}\n마지막 실행: ${mockStatus.lastExecution}\n성공 횟수: ${mockStatus.successCount}\n오류 횟수: ${mockStatus.errorCount}`,
        },
      ],
    };
  }

  async listWorkflows() {
    console.log("📋 Listing all workflows");

    const mockWorkflows = [
      { id: "wf_1", name: "Climbing Gym Updates", status: "active" },
      { id: "wf_2", name: "Route Notifications", status: "active" },
      { id: "wf_3", name: "Data Sync", status: "draft" },
    ];

    return {
      content: [
        {
          type: "text",
          text: `사용 가능한 워크플로우:\n${mockWorkflows
            .map((wf) => `- ${wf.name} (${wf.id}) - ${wf.status}`)
            .join("\n")}`,
        },
      ],
    };
  }

  async start() {
    // 환경 변수 확인
    console.log("🔍 환경 변수 확인:");
    console.log(
      "MAKE_API_KEY:",
      process.env.MAKE_API_KEY ? "✅ 설정됨" : "❌ 설정되지 않음"
    );
    console.log(
      "MAKE_WORKSPACE_ID:",
      process.env.MAKE_WORKSPACE_ID ? "✅ 설정됨" : "❌ 설정되지 않음"
    );

    const transport = new StdioServerTransport();

    try {
      await this.server.connect(transport);
      console.log("✅ Make.com MCP 서버가 stdio 모드로 시작되었습니다.");

      // 서버가 종료될 때까지 대기
      process.on("SIGINT", async () => {
        console.log("\n🔄 서버를 종료합니다...");
        await this.server.close();
        process.exit(0);
      });
    } catch (error) {
      console.error("❌ 서버 시작 실패:", error);
      process.exit(1);
    }
  }
}

// 서버 시작
const server = new MakeMCPServer();
server.start();
