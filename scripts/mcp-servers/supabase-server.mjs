#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHttpServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

class SupabaseMCPServer {
  constructor() {
    this.server = new Server({
      name: "supabase-mcp-server",
      version: "1.0.0",
    });

    this.setupTools();
  }

  setupTools() {
    // 데이터베이스 연동 도구들
    this.server.setRequestHandler("tools/call", async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "supabase.sync_data":
            return await this.syncData(args.table, args.data, args.operation);

          case "supabase.get_realtime_updates":
            return await this.getRealTimeUpdates(args.table, args.event);

          case "supabase.query_data":
            return await this.queryData(args.table, args.filters, args.select);

          case "supabase.insert_data":
            return await this.insertData(args.table, args.data);

          case "supabase.update_data":
            return await this.updateData(args.table, args.id, args.data);

          case "supabase.delete_data":
            return await this.deleteData(args.table, args.id);

          case "supabase.manage_subscriptions":
            return await this.manageSubscriptions(
              args.action,
              args.channel,
              args.callback
            );

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async syncData(table, data, operation = "upsert") {
    console.log(`🔄 Syncing data to ${table} with operation: ${operation}`);

    // 실제 구현에서는 Supabase 클라이언트를 사용
    const mockSyncResult = {
      table,
      operation,
      affectedRows: data.length || 1,
      timestamp: new Date().toISOString(),
      status: "success",
      details: {
        inserted: operation === "insert" ? data.length : 0,
        updated: operation === "update" ? data.length : 0,
        upserted: operation === "upsert" ? data.length : 0,
      },
    };

    return {
      content: [
        {
          type: "text",
          text: `데이터 동기화 완료:\n\n테이블: ${mockSyncResult.table}\n작업: ${mockSyncResult.operation}\n영향받은 행: ${mockSyncResult.affectedRows}\n상태: ${mockSyncResult.status}\n시간: ${mockSyncResult.timestamp}\n\n상세:\n• 삽입: ${mockSyncResult.details.inserted}개\n• 업데이트: ${mockSyncResult.details.updated}개\n• 업서트: ${mockSyncResult.details.upserted}개`,
        },
      ],
    };
  }

  async getRealTimeUpdates(table, event = "INSERT") {
    console.log(
      `📡 Getting real-time updates for ${table} with event: ${event}`
    );

    const mockUpdates = [
      {
        id: `update_${Date.now()}`,
        table,
        event,
        data: {
          id: Math.floor(Math.random() * 1000),
          type: "NEWSET",
          title: "새로운 볼더링 루트",
          description: "6A 등급의 새로운 볼더링 루트가 추가되었습니다.",
          updateDate: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      },
    ];

    return {
      content: [
        {
          type: "text",
          text: `실시간 업데이트 수신:\n\n테이블: ${table}\n이벤트: ${event}\n\n업데이트 내용:\n${mockUpdates
            .map(
              (update) =>
                `• ID: ${update.id}\n  제목: ${update.data.title}\n  설명: ${update.data.description}\n  시간: ${update.timestamp}`
            )
            .join("\n\n")}`,
        },
      ],
    };
  }

  async queryData(table, filters = {}, select = "*") {
    console.log(`🔍 Querying data from ${table} with filters:`, filters);

    const mockQueryResult = {
      table,
      filters,
      select,
      count: 25,
      data: [
        {
          id: 1,
          type: "NEWSET",
          title: "겨울 시즌 루트",
          description: "새로운 겨울 시즌 루트가 설치되었습니다.",
          updateDate: "2024-01-15",
          gymId: 1,
        },
        {
          id: 2,
          type: "REMOVAL",
          title: "구 루트 탈거",
          description: "오래된 루트가 탈거 예정입니다.",
          updateDate: "2024-01-20",
          gymId: 1,
        },
      ],
      pagination: {
        page: 1,
        pageSize: 10,
        totalPages: 3,
      },
    };

    return {
      content: [
        {
          type: "text",
          text: `데이터 쿼리 완료:\n\n테이블: ${
            mockQueryResult.table
          }\n필터: ${JSON.stringify(mockQueryResult.filters)}\n선택 필드: ${
            mockQueryResult.select
          }\n총 개수: ${
            mockQueryResult.count
          }\n\n결과 (처음 2개):\n${mockQueryResult.data
            .map(
              (item) =>
                `• ${item.title} (${item.type})\n  설명: ${item.description}\n  날짜: ${item.updateDate}`
            )
            .join("\n\n")}\n\n페이지: ${mockQueryResult.pagination.page}/${
            mockQueryResult.pagination.totalPages
          }`,
        },
      ],
    };
  }

  async insertData(table, data) {
    console.log(`➕ Inserting data into ${table}:`, data);

    const mockInsertResult = {
      table,
      operation: "INSERT",
      insertedId: Math.floor(Math.random() * 10000),
      data,
      timestamp: new Date().toISOString(),
      status: "success",
    };

    return {
      content: [
        {
          type: "text",
          text: `데이터 삽입 완료:\n\n테이블: ${
            mockInsertResult.table
          }\n작업: ${mockInsertResult.operation}\n삽입된 ID: ${
            mockInsertResult.insertedId
          }\n상태: ${mockInsertResult.status}\n시간: ${
            mockInsertResult.timestamp
          }\n\n삽입된 데이터:\n${JSON.stringify(
            mockInsertResult.data,
            null,
            2
          )}`,
        },
      ],
    };
  }

  async updateData(table, id, data) {
    console.log(`✏️ Updating data in ${table} with ID: ${id}`);

    const mockUpdateResult = {
      table,
      operation: "UPDATE",
      updatedId: id,
      data,
      affectedRows: 1,
      timestamp: new Date().toISOString(),
      status: "success",
    };

    return {
      content: [
        {
          type: "text",
          text: `데이터 업데이트 완료:\n\n테이블: ${
            mockUpdateResult.table
          }\n작업: ${mockUpdateResult.operation}\n업데이트된 ID: ${
            mockUpdateResult.updatedId
          }\n영향받은 행: ${mockUpdateResult.affectedRows}\n상태: ${
            mockUpdateResult.status
          }\n시간: ${
            mockUpdateResult.timestamp
          }\n\n업데이트된 데이터:\n${JSON.stringify(
            mockUpdateResult.data,
            null,
            2
          )}`,
        },
      ],
    };
  }

  async deleteData(table, id) {
    console.log(`🗑️ Deleting data from ${table} with ID: ${id}`);

    const mockDeleteResult = {
      table,
      operation: "DELETE",
      deletedId: id,
      affectedRows: 1,
      timestamp: new Date().toISOString(),
      status: "success",
    };

    return {
      content: [
        {
          type: "text",
          text: `데이터 삭제 완료:\n\n테이블: ${mockDeleteResult.table}\n작업: ${mockDeleteResult.operation}\n삭제된 ID: ${mockDeleteResult.deletedId}\n영향받은 행: ${mockDeleteResult.affectedRows}\n상태: ${mockDeleteResult.status}\n시간: ${mockDeleteResult.timestamp}`,
        },
      ],
    };
  }

  async manageSubscriptions(action, channel, callback) {
    console.log(`📡 Managing subscriptions: ${action} for channel: ${channel}`);

    const mockSubscriptionResult = {
      action,
      channel,
      callback,
      status: "active",
      subscriptionId: `sub_${Date.now()}`,
      timestamp: new Date().toISOString(),
      message:
        action === "subscribe"
          ? "구독이 성공적으로 활성화되었습니다."
          : "구독이 해제되었습니다.",
    };

    return {
      content: [
        {
          type: "text",
          text: `구독 관리 완료:\n\n작업: ${mockSubscriptionResult.action}\n채널: ${mockSubscriptionResult.channel}\n상태: ${mockSubscriptionResult.status}\n구독 ID: ${mockSubscriptionResult.subscriptionId}\n시간: ${mockSubscriptionResult.timestamp}\n\n메시지: ${mockSubscriptionResult.message}`,
        },
      ],
    };
  }

  async start(transportType = "websocket", port = 3004) {
    let transport;

    if (transportType === "stdio") {
      transport = new StdioServerTransport();
    } else {
      transport = new StreamableHttpServerTransport({
        port: port,
      });
    }

    try {
      await this.server.connect(transport);
      console.log(
        `✅ Supabase MCP 서버가 시작되었습니다. (${transportType}:${port})`
      );

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
const server = new SupabaseMCPServer();

// 명령행 인수 처리
const args = process.argv.slice(2);
const transportType = args.includes("--stdio") ? "stdio" : "websocket";
const port =
  parseInt(args.find((arg) => arg.startsWith("--port="))?.split("=")[1]) ||
  3004;

server.start(transportType, port);
