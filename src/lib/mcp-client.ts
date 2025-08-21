import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { WebSocketClientTransport } from '@modelcontextprotocol/sdk/client/websocket.js';

export interface MCPServerConfig {
  name: string;
  transport: 'stdio' | 'websocket';
  command?: string;
  url?: string;
  description?: string;
}

export class MCPClientManager {
  private clients: Map<string, Client> = new Map();
  private configs: MCPServerConfig[] = [];

  constructor() {
    this.initializeServers();
  }

  private initializeServers() {
    // Make.com MCP 서버 설정
    this.configs.push({
      name: 'make',
      transport: 'websocket',
      url: process.env.MAKE_MCP_URL || 'ws://localhost:3001',
      description: 'Make.com 워크플로우 자동화 서버'
    });

    // Apify MCP 서버 설정
    this.configs.push({
      name: 'apify',
      transport: 'websocket',
      url: process.env.APIFY_MCP_URL || 'ws://localhost:3002',
      description: 'Apify 웹 스크래핑 서버'
    });

    // ChatGPT API MCP 서버 설정
    this.configs.push({
      name: 'chatgpt',
      transport: 'websocket',
      url: process.env.CHATGPT_MCP_URL || 'ws://localhost:3003',
      description: 'ChatGPT API 통합 서버'
    });

    // Supabase MCP 서버 설정
    this.configs.push({
      name: 'supabase',
      transport: 'websocket',
      url: process.env.SUPABASE_MCP_URL || 'ws://localhost:3004',
      description: 'Supabase 데이터베이스 연동 서버'
    });
  }

  async connectToServer(config: MCPServerConfig): Promise<Client | null> {
    try {
      let transport;
      
      if (config.transport === 'stdio' && config.command) {
        transport = new StdioClientTransport({
          command: config.command,
          args: []
        });
      } else if (config.transport === 'websocket' && config.url) {
        transport = new WebSocketClientTransport({
          url: config.url
        });
      } else {
        console.error(`Invalid transport configuration for ${config.name}`);
        return null;
      }

      const client = new Client({
        name: `climb-hub-${config.name}`,
        version: '1.0.0'
      }, {
        capabilities: {
          tools: {}
        }
      });

      await client.connect(transport);
      this.clients.set(config.name, client);
      
      console.log(`✅ Connected to ${config.name} MCP server`);
      return client;
    } catch (error) {
      console.error(`❌ Failed to connect to ${config.name} MCP server:`, error);
      return null;
    }
  }

  async connectToAllServers(): Promise<void> {
    console.log('🚀 Connecting to MCP servers...');
    
    for (const config of this.configs) {
      await this.connectToServer(config);
    }
  }

  getClient(name: string): Client | undefined {
    return this.clients.get(name);
  }

  async disconnectFromServer(name: string): Promise<void> {
    const client = this.clients.get(name);
    if (client) {
      try {
        await client.close();
        this.clients.delete(name);
        console.log(`✅ Disconnected from ${name} MCP server`);
      } catch (error) {
        console.error(`❌ Error disconnecting from ${name}:`, error);
      }
    }
  }

  async disconnectFromAllServers(): Promise<void> {
    console.log('🔄 Disconnecting from all MCP servers...');
    
    for (const [name] of this.clients) {
      await this.disconnectFromServer(name);
    }
  }

  getConnectedServers(): string[] {
    return Array.from(this.clients.keys());
  }

  getServerStatus(): { name: string; connected: boolean; description?: string }[] {
    return this.configs.map(config => ({
      name: config.name,
      connected: this.clients.has(config.name),
      description: config.description
    }));
  }
}

// 싱글톤 인스턴스 생성
export const mcpClientManager = new MCPClientManager();

// 서버별 특화 기능들
export class MakeMCPService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async triggerWorkflow(workflowId: string, data: any): Promise<any> {
    try {
      const result = await this.client.callTool('make.trigger_workflow', {
        workflowId,
        data
      });
      return result;
    } catch (error) {
      console.error('Make.com 워크플로우 실행 오류:', error);
      throw error;
    }
  }

  async getWorkflowStatus(workflowId: string): Promise<any> {
    try {
      const result = await this.client.callTool('make.get_workflow_status', {
        workflowId
      });
      return result;
    } catch (error) {
      console.error('Make.com 워크플로우 상태 조회 오류:', error);
      throw error;
    }
  }
}

export class ApifyMCPService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async scrapeGymInfo(gymName: string): Promise<any> {
    try {
      const result = await this.client.callTool('apify.scrape_gym_info', {
        gymName,
        selectors: {
          title: 'h1, .title',
          description: '.description, .content',
          schedule: '.schedule, .hours',
          contact: '.contact, .phone'
        }
      });
      return result;
    } catch (error) {
      console.error('Apify 스크래핑 오류:', error);
      throw error;
    }
  }

  async scrapeNewRoutes(gymUrl: string): Promise<any> {
    try {
      const result = await this.client.callTool('apify.scrape_new_routes', {
        url: gymUrl,
        selectors: {
          routeName: '.route-name',
          grade: '.grade',
          setDate: '.set-date',
          removalDate: '.removal-date'
        }
      });
      return result;
    } catch (error) {
      console.error('Apify 루트 스크래핑 오류:', error);
      throw error;
    }
  }
}

export class ChatGPTMCPService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async analyzeGymData(gymData: any): Promise<any> {
    try {
      const result = await this.client.callTool('chatgpt.analyze_data', {
        data: gymData,
        prompt: '이 클라이밍 암장 데이터를 분석하여 주요 특징과 추천 포인트를 요약해주세요.'
      });
      return result;
    } catch (error) {
      console.error('ChatGPT 분석 오류:', error);
      throw error;
    }
  }

  async generateRouteDescription(routeInfo: any): Promise<any> {
    try {
      const result = await this.client.callTool('chatgpt.generate_description', {
        routeInfo,
        prompt: '이 루트에 대한 매력적인 설명을 생성해주세요.'
      });
      return result;
    } catch (error) {
      console.error('ChatGPT 설명 생성 오류:', error);
      throw error;
    }
  }
}

export class SupabaseMCPService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async syncData(table: string, data: any): Promise<any> {
    try {
      const result = await this.client.callTool('supabase.sync_data', {
        table,
        data,
        operation: 'upsert'
      });
      return result;
    } catch (error) {
      console.error('Supabase 동기화 오류:', error);
      throw error;
    }
  }

  async getRealTimeUpdates(table: string): Promise<any> {
    try {
      const result = await this.client.callTool('supabase.get_realtime_updates', {
        table,
        event: 'INSERT'
      });
      return result;
    } catch (error) {
      console.error('Supabase 실시간 업데이트 오류:', error);
      throw error;
    }
  }
}
