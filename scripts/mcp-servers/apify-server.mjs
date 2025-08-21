#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHttpServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

class ApifyMCPServer {
  constructor() {
    this.server = new Server({
      name: "apify-mcp-server",
      version: "1.0.0",
    });

    this.setupTools();
  }

  setupTools() {
    // 웹 스크래핑 도구들
    this.server.setRequestHandler("tools/call", async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "apify.scrape_gym_info":
            return await this.scrapeGymInfo(args.gymName, args.selectors);

          case "apify.scrape_new_routes":
            return await this.scrapeNewRoutes(args.url, args.selectors);

          case "apify.scrape_gym_schedule":
            return await this.scrapeGymSchedule(args.gymUrl);

          case "apify.scrape_route_grades":
            return await this.scrapeRouteGrades(args.gymUrl);

          case "apify.scrape_gym_events":
            return await this.scrapeGymEvents(args.gymUrl);

          case "apify.run_scraper":
            return await this.runScraper(args.scraperId, args.input);

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

  async scrapeGymInfo(gymName, selectors) {
    console.log(`🏠 Scraping gym info for: ${gymName}`);

    // 실제 구현에서는 Apify API를 사용하여 스크래핑 실행
    const mockGymInfo = {
      name: gymName,
      address: "서울시 강남구 테헤란로 123",
      phone: "02-1234-5678",
      website: "https://example-gym.com",
      hours: "24시간 운영",
      description: "최고의 클라이밍 경험을 제공하는 프리미엄 암장입니다.",
      facilities: ["벽면 클라이밍", "볼더링", "피트니스", "샤워시설"],
      rating: 4.8,
      scrapedAt: new Date().toISOString(),
    };

    return {
      content: [
        {
          type: "text",
          text: `암장 정보 스크래핑 완료:\n\n이름: ${mockGymInfo.name}\n주소: ${
            mockGymInfo.address
          }\n전화: ${mockGymInfo.phone}\n운영시간: ${
            mockGymInfo.hours
          }\n설명: ${
            mockGymInfo.description
          }\n시설: ${mockGymInfo.facilities.join(", ")}\n평점: ${
            mockGymInfo.rating
          }/5.0`,
        },
      ],
    };
  }

  async scrapeNewRoutes(gymUrl, selectors) {
    console.log(`🧗 Scraping new routes from: ${gymUrl}`);

    const mockRoutes = [
      {
        name: "블루 라인",
        grade: "6A",
        setDate: "2024-01-15",
        removalDate: "2024-03-15",
        description: "중간 난이도의 볼더링 루트",
        wall: "메인 볼더링 월",
      },
      {
        name: "레드 라인",
        grade: "7B",
        setDate: "2024-01-20",
        removalDate: "2024-04-20",
        description: "고난이도 트라드 루트",
        wall: "트라드 월",
      },
    ];

    return {
      content: [
        {
          type: "text",
          text: `새 루트 정보 스크래핑 완료:\n\n${mockRoutes
            .map(
              (route) =>
                `루트: ${route.name}\n등급: ${route.grade}\n설치일: ${route.setDate}\n탈거일: ${route.removalDate}\n설명: ${route.description}\n위치: ${route.wall}\n`
            )
            .join("\n")}`,
        },
      ],
    };
  }

  async scrapeGymSchedule(gymUrl) {
    console.log(`📅 Scraping gym schedule from: ${gymUrl}`);

    const mockSchedule = {
      monday: "06:00 - 24:00",
      tuesday: "06:00 - 24:00",
      wednesday: "06:00 - 24:00",
      thursday: "06:00 - 24:00",
      friday: "06:00 - 24:00",
      saturday: "08:00 - 22:00",
      sunday: "08:00 - 22:00",
      holidays: "10:00 - 20:00",
    };

    return {
      content: [
        {
          type: "text",
          text: `운영시간 스크래핑 완료:\n\n월-금: ${mockSchedule.monday}\n토: ${mockSchedule.saturday}\n일: ${mockSchedule.sunday}\n공휴일: ${mockSchedule.holidays}`,
        },
      ],
    };
  }

  async scrapeRouteGrades(gymUrl) {
    console.log(`📊 Scraping route grades from: ${gymUrl}`);

    const mockGrades = {
      "3A-4A": 15,
      "4A-5A": 25,
      "5A-6A": 30,
      "6A-7A": 20,
      "7A-8A": 10,
      "8A+": 5,
    };

    const totalRoutes = Object.values(mockGrades).reduce(
      (sum, count) => sum + count,
      0
    );

    return {
      content: [
        {
          type: "text",
          text: `루트 등급별 개수 스크래핑 완료:\n\n총 루트 수: ${totalRoutes}개\n\n${Object.entries(
            mockGrades
          )
            .map(([grade, count]) => `${grade}: ${count}개`)
            .join("\n")}`,
        },
      ],
    };
  }

  async scrapeGymEvents(gymUrl) {
    console.log(`🎉 Scraping gym events from: ${gymUrl}`);

    const mockEvents = [
      {
        name: "겨울 클라이밍 대회",
        date: "2024-02-15",
        description: "연간 클라이밍 대회",
        registrationDeadline: "2024-02-10",
        maxParticipants: 100,
      },
      {
        name: "초보자 클래스",
        date: "2024-01-25",
        description: "클라이밍 입문자를 위한 기본 클래스",
        registrationDeadline: "2024-01-23",
        maxParticipants: 20,
      },
    ];

    return {
      content: [
        {
          type: "text",
          text: `이벤트 정보 스크래핑 완료:\n\n${mockEvents
            .map(
              (event) =>
                `이벤트: ${event.name}\n날짜: ${event.date}\n설명: ${event.description}\n등록 마감: ${event.registrationDeadline}\n최대 참가자: ${event.maxParticipants}명\n`
            )
            .join("\n")}`,
        },
      ],
    };
  }

  async runScraper(scraperId, input) {
    console.log(`🤖 Running Apify scraper: ${scraperId}`);

    // 실제 구현에서는 Apify API를 사용하여 스크래퍼 실행
    const mockResult = {
      scraperId,
      executionId: `exec_${Date.now()}`,
      status: "running",
      input,
      estimatedFinishTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };

    return {
      content: [
        {
          type: "text",
          text: `스크래퍼 실행 시작:\n스크래퍼 ID: ${mockResult.scraperId}\n실행 ID: ${mockResult.executionId}\n상태: ${mockResult.status}\n예상 완료 시간: ${mockResult.estimatedFinishTime}`,
        },
      ],
    };
  }

  async start(transportType = "websocket", port = 3002) {
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
        `✅ Apify MCP 서버가 시작되었습니다. (${transportType}:${port})`
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
const server = new ApifyMCPServer();

// 명령행 인수 처리
const args = process.argv.slice(2);
const transportType = args.includes("--stdio") ? "stdio" : "websocket";
const port =
  parseInt(args.find((arg) => arg.startsWith("--port="))?.split("=")[1]) ||
  3002;

server.start(transportType, port);
