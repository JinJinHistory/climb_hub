#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHttpServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

class ChatGPTMCPServer {
  constructor() {
    this.server = new Server({
      name: "chatgpt-mcp-server",
      version: "1.0.0",
    });

    this.setupTools();
  }

  setupTools() {
    // AI 분석 및 생성 도구들
    this.server.setRequestHandler("tools/call", async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "chatgpt.analyze_data":
            return await this.analyzeData(args.data, args.prompt);

          case "chatgpt.generate_description":
            return await this.generateDescription(args.routeInfo, args.prompt);

          case "chatgpt.summarize_gym_info":
            return await this.summarizeGymInfo(args.gymData);

          case "chatgpt.generate_route_recommendations":
            return await this.generateRouteRecommendations(
              args.userProfile,
              args.gymData
            );

          case "chatgpt.analyze_climbing_trends":
            return await this.analyzeClimbingTrends(args.data);

          case "chatgpt.generate_content":
            return await this.generateContent(
              args.topic,
              args.style,
              args.length
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

  async analyzeData(data, prompt) {
    console.log("🔍 Analyzing data with ChatGPT API");

    // 실제 구현에서는 OpenAI API를 사용
    const mockAnalysis = {
      summary:
        "이 클라이밍 암장은 다양한 난이도의 루트를 제공하며, 특히 초보자부터 고급자까지 모두가 즐길 수 있는 환경을 갖추고 있습니다.",
      keyFeatures: [
        "다양한 난이도 분포 (3A-8A+)",
        "정기적인 루트 업데이트",
        "전문적인 지도진",
        "편리한 위치와 접근성",
      ],
      recommendations: [
        "초보자는 3A-5A 등급의 루트부터 시작",
        "중급자는 5A-7A 등급의 루트에 도전",
        "고급자는 7A+ 등급의 루트로 실력 향상",
      ],
      insights:
        "이 암장은 클라이밍 커뮤니티가 활발하며, 정기적인 이벤트와 클래스를 통해 지속적인 성장을 지원합니다.",
    };

    return {
      content: [
        {
          type: "text",
          text: `데이터 분석 완료:\n\n📋 요약\n${
            mockAnalysis.summary
          }\n\n✨ 주요 특징\n${mockAnalysis.keyFeatures
            .map((feature) => `• ${feature}`)
            .join("\n")}\n\n💡 추천사항\n${mockAnalysis.recommendations
            .map((rec) => `• ${rec}`)
            .join("\n")}\n\n🔍 인사이트\n${mockAnalysis.insights}`,
        },
      ],
    };
  }

  async generateDescription(routeInfo, prompt) {
    console.log("✍️ Generating route description with ChatGPT API");

    const mockDescription = {
      title: `${routeInfo.name} - ${routeInfo.grade} 등급의 도전적인 볼더링`,
      description: `이 루트는 ${routeInfo.grade} 등급으로, ${
        routeInfo.difficulty || "중간"
      } 난이도의 볼더링 루트입니다. ${
        routeInfo.description ||
        "균형감 있는 홀드 배치와 창의적인 동작으로 구성되어 있어 클라이밍의 재미를 한층 더해줍니다."
      }`,
      tips: [
        "시작점에서 안정적인 자세를 잡으세요",
        "중간 지점의 크림프 홀드를 활용하세요",
        "마무리 동작에서 발의 위치를 신중하게 고려하세요",
      ],
      suitableFor: [
        "중급 클라이머",
        "볼더링 애호가",
        "기술 향상을 원하는 클라이머",
      ],
    };

    return {
      content: [
        {
          type: "text",
          text: `루트 설명 생성 완료:\n\n🏷️ 제목\n${
            mockDescription.title
          }\n\n📝 상세 설명\n${
            mockDescription.description
          }\n\n💡 클라이밍 팁\n${mockDescription.tips
            .map((tip) => `• ${tip}`)
            .join("\n")}\n\n👥 적합한 클라이머\n${mockDescription.suitableFor
            .map((user) => `• ${user}`)
            .join("\n")}`,
        },
      ],
    };
  }

  async summarizeGymInfo(gymData) {
    console.log("📊 Summarizing gym information with ChatGPT API");

    const mockSummary = {
      overview: `${gymData.name}은(는) ${
        gymData.location || "서울"
      }에 위치한 프리미엄 클라이밍 암장입니다.`,
      highlights: [
        `${gymData.totalRoutes || 100}개 이상의 다양한 루트`,
        `${gymData.operatingHours || "24시간"} 운영으로 언제든 이용 가능`,
        "전문 지도진의 체계적인 교육 프로그램",
        "최신 장비와 안전 시설 구비",
      ],
      targetAudience: "초보자부터 고급자까지 모든 레벨의 클라이머",
      uniqueFeatures: "독창적인 루트 디자인과 정기적인 대회 개최",
    };

    return {
      content: [
        {
          type: "text",
          text: `암장 정보 요약 완료:\n\n🏠 개요\n${
            mockSummary.overview
          }\n\n⭐ 하이라이트\n${mockSummary.highlights
            .map((highlight) => `• ${highlight}`)
            .join("\n")}\n\n🎯 타겟\n${
            mockSummary.targetAudience
          }\n\n🌟 특별한 점\n${mockSummary.uniqueFeatures}`,
        },
      ],
    };
  }

  async generateRouteRecommendations(userProfile, gymData) {
    console.log(
      "🎯 Generating personalized route recommendations with ChatGPT API"
    );

    const mockRecommendations = {
      beginner: [
        {
          name: "그린 라인",
          grade: "3A",
          reason: "안정적인 홀드와 직선적인 동작으로 초보자에게 적합",
        },
        {
          name: "블루 라인",
          grade: "4A",
          reason: "기본적인 클라이밍 기술을 연습할 수 있는 루트",
        },
      ],
      intermediate: [
        {
          name: "옐로우 라인",
          grade: "6A",
          reason: "다양한 동작과 홀드 타입을 경험할 수 있음",
        },
        {
          name: "오렌지 라인",
          grade: "6B",
          reason: "기술적 도전과 물리적 도전의 균형",
        },
      ],
      advanced: [
        {
          name: "레드 라인",
          grade: "7B",
          reason: "고급 기술과 강인한 체력이 필요한 루트",
        },
        {
          name: "퍼플 라인",
          grade: "8A",
          reason: "극한의 난이도로 최고 수준의 클라이머를 위한 도전",
        },
      ],
    };

    return {
      content: [
        {
          type: "text",
          text: `개인화된 루트 추천 완료:\n\n🌱 초보자 추천\n${mockRecommendations.beginner
            .map((route) => `• ${route.name} (${route.grade}): ${route.reason}`)
            .join("\n")}\n\n🌿 중급자 추천\n${mockRecommendations.intermediate
            .map((route) => `• ${route.name} (${route.grade}): ${route.reason}`)
            .join("\n")}\n\n🔥 고급자 추천\n${mockRecommendations.advanced
            .map((route) => `• ${route.name} (${route.grade}): ${route.reason}`)
            .join("\n")}`,
        },
      ],
    };
  }

  async analyzeClimbingTrends(data) {
    console.log("📈 Analyzing climbing trends with ChatGPT API");

    const mockTrends = {
      popularGrades: ["6A", "6B", "7A"],
      trendingStyles: ["볼더링", "스포츠 클라이밍", "트라드"],
      seasonalPatterns: {
        spring: "신규 루트 설치 증가",
        summer: "야외 클라이밍 인기",
        autumn: "실내 클라이밍 선호도 증가",
        winter: "볼더링 중심 활동",
      },
      emergingTechniques: [
        "다이나믹 모브먼트",
        "크림프 홀드 활용",
        "발 기술의 중요성",
      ],
    };

    return {
      content: [
        {
          type: "text",
          text: `클라이밍 트렌드 분석 완료:\n\n🔥 인기 등급\n${mockTrends.popularGrades.join(
            ", "
          )}\n\n🎭 트렌딩 스타일\n${mockTrends.trendingStyles.join(
            ", "
          )}\n\n🌱 계절별 패턴\n${Object.entries(mockTrends.seasonalPatterns)
            .map(([season, pattern]) => `• ${season}: ${pattern}`)
            .join("\n")}\n\n💪 신기술\n${mockTrends.emergingTechniques
            .map((tech) => `• ${tech}`)
            .join("\n")}`,
        },
      ],
    };
  }

  async generateContent(topic, style, length) {
    console.log("✍️ Generating content with ChatGPT API");

    const mockContent = {
      title: `${topic}에 대한 ${style} 스타일의 ${length} 글`,
      content: `클라이밍은 단순한 운동이 아닌 삶의 철학입니다. ${topic}을(를) 통해 우리는 자신의 한계를 극복하고, 새로운 가능성을 발견하게 됩니다. ${style}한 접근 방식으로 ${topic}을(를) 바라보면, 예상치 못한 깨달음과 성장의 기회를 얻을 수 있습니다.`,
      keyPoints: [
        `${topic}의 기본 원리 이해`,
        `${style}한 접근 방법`,
        "실제 적용 사례",
        "지속적인 개선 방안",
      ],
    };

    return {
      content: [
        {
          type: "text",
          text: `콘텐츠 생성 완료:\n\n📝 제목\n${
            mockContent.title
          }\n\n📄 내용\n${
            mockContent.content
          }\n\n🔑 핵심 포인트\n${mockContent.keyPoints
            .map((point) => `• ${point}`)
            .join("\n")}`,
        },
      ],
    };
  }

  async start(transportType = "websocket", port = 3003) {
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
        `✅ ChatGPT API MCP 서버가 시작되었습니다. (${transportType}:${port})`
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
const server = new ChatGPTMCPServer();

// 명령행 인수 처리
const args = process.argv.slice(2);
const transportType = args.includes("--stdio") ? "stdio" : "websocket";
const port =
  parseInt(args.find((arg) => arg.startsWith("--port="))?.split("=")[1]) ||
  3003;

server.start(transportType, port);
