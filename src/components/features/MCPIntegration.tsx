'use client';

import { useState, useEffect } from 'react';
import { 
  mcpClientManager, 
  MakeMCPService, 
  ApifyMCPService, 
  ChatGPTMCPService, 
  SupabaseMCPService 
} from '@/lib/mcp-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function MCPIntegration() {
  const [serverStatus, setServerStatus] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [inputData, setInputData] = useState<any>({});
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    updateServerStatus();
    const interval = setInterval(updateServerStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateServerStatus = () => {
    const status = mcpClientManager.getServerStatus();
    setServerStatus(status);
  };

  const handleServiceAction = async (action: string) => {
    if (!selectedService) {
      alert('서비스를 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const client = mcpClientManager.getClient(selectedService);
      if (!client) {
        throw new Error(`${selectedService} 서버에 연결되지 않았습니다.`);
      }

      let service: any;
      let result: any;

      switch (selectedService) {
        case 'make':
          service = new MakeMCPService(client);
          switch (action) {
            case 'trigger_workflow':
              result = await service.triggerWorkflow(inputData.workflowId || 'wf_1', inputData.data || {});
              break;
            case 'get_workflow_status':
              result = await service.getWorkflowStatus(inputData.workflowId || 'wf_1');
              break;
            case 'list_workflows':
              result = await service.listWorkflows();
              break;
          }
          break;

        case 'apify':
          service = new ApifyMCPService(client);
          switch (action) {
            case 'scrape_gym_info':
              result = await service.scrapeGymInfo(inputData.gymName || '클라이밍 암장', inputData.selectors || {});
              break;
            case 'scrape_new_routes':
              result = await service.scrapeNewRoutes(inputData.gymUrl || 'https://example.com', inputData.selectors || {});
              break;
          }
          break;

        case 'chatgpt':
          service = new ChatGPTMCPService(client);
          switch (action) {
            case 'analyze_data':
              result = await service.analyzeGymData(inputData.gymData || {}, inputData.prompt || '');
              break;
            case 'generate_description':
              result = await service.generateRouteDescription(inputData.routeInfo || {}, inputData.prompt || '');
              break;
          }
          break;

        case 'supabase':
          service = new SupabaseMCPService(client);
          switch (action) {
            case 'sync_data':
              result = await service.syncData(inputData.table || 'route_updates', inputData.data || {});
              break;
            case 'get_realtime_updates':
              result = await service.getRealTimeUpdates(inputData.table || 'route_updates');
              break;
          }
          break;
      }

      if (result) {
        setResults(prev => [{
          service: selectedService,
          action,
          timestamp: new Date().toISOString(),
          result: result.content?.[0]?.text || JSON.stringify(result, null, 2)
        }, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('서비스 실행 오류:', error);
      setResults(prev => [{
        service: selectedService,
        action,
        timestamp: new Date().toISOString(),
        result: `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      }, ...prev.slice(0, 9)]);
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceActions = (serviceName: string) => {
    switch (serviceName) {
      case 'make':
        return [
          { key: 'trigger_workflow', label: '워크플로우 실행', inputs: ['workflowId', 'data'] },
          { key: 'get_workflow_status', label: '워크플로우 상태', inputs: ['workflowId'] },
          { key: 'list_workflows', label: '워크플로우 목록', inputs: [] }
        ];
      case 'apify':
        return [
          { key: 'scrape_gym_info', label: '암장 정보 스크래핑', inputs: ['gymName', 'selectors'] },
          { key: 'scrape_new_routes', label: '새 루트 스크래핑', inputs: ['gymUrl', 'selectors'] }
        ];
      case 'chatgpt':
        return [
          { key: 'analyze_data', label: '데이터 분석', inputs: ['gymData', 'prompt'] },
          { key: 'generate_description', label: '설명 생성', inputs: ['routeInfo', 'prompt'] }
        ];
      case 'supabase':
        return [
          { key: 'sync_data', label: '데이터 동기화', inputs: ['table', 'data', 'operation'] },
          { key: 'get_realtime_updates', label: '실시간 업데이트', inputs: ['table', 'event'] }
        ];
      default:
        return [];
    }
  };

  const renderInputField = (inputName: string) => {
    if (inputName === 'data' || inputName === 'selectors' || inputName === 'gymData' || inputName === 'routeInfo') {
      return (
        <Textarea
          placeholder={`${inputName} (JSON 형식)`}
          value={inputData[inputName] || ''}
          onChange={(e) => setInputData(prev => ({ ...prev, [inputName]: e.target.value }))}
          className="w-full"
          rows={3}
        />
      );
    }
    
    return (
      <Input
        placeholder={inputName}
        value={inputData[inputName] || ''}
        onChange={(e) => setInputData(prev => ({ ...prev, [inputName]: e.target.value }))}
        className="w-full"
      />
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">MCP 서버 통합</h1>
        <p className="text-gray-600">
          Make.com, Apify, ChatGPT API, Supabase MCP 서버들과 직접 상호작용합니다.
        </p>
      </div>

      {/* 서버 상태 */}
      <Card>
        <CardHeader>
          <CardTitle>서버 연결 상태</CardTitle>
          <CardDescription>MCP 서버들의 현재 연결 상태를 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {serverStatus.map((server) => (
              <div
                key={server.name}
                className={`p-4 rounded-lg border-2 ${
                  server.connected ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold capitalize">{server.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${server.connected ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                <p className="text-sm text-gray-600">{server.description}</p>
                <p className={`text-sm font-medium ${server.connected ? 'text-green-600' : 'text-gray-600'}`}>
                  {server.connected ? '연결됨' : '연결 안됨'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 서비스 선택 및 실행 */}
      <Card>
        <CardHeader>
          <CardTitle>서비스 실행</CardTitle>
          <CardDescription>연결된 MCP 서버의 기능을 실행합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 서비스 선택 */}
          <div>
            <label className="block text-sm font-medium mb-2">서비스 선택</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">서비스를 선택하세요</option>
              {serverStatus.filter(s => s.connected).map((server) => (
                <option key={server.name} value={server.name}>
                  {server.name.charAt(0).toUpperCase() + server.name.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* 입력 필드들 */}
          {selectedService && (
            <div className="space-y-3">
              <label className="block text-sm font-medium">입력 데이터</label>
              {getServiceActions(selectedService).map((action) => (
                <div key={action.key} className="space-y-2">
                  <h4 className="font-medium">{action.label}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {action.inputs.map((input) => (
                      <div key={input}>
                        <label className="block text-xs text-gray-600 mb-1">{input}</label>
                        {renderInputField(input)}
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => handleServiceAction(action.key)}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? '실행 중...' : action.label}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 실행 결과 */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>실행 결과</CardTitle>
            <CardDescription>최근 실행된 서비스들의 결과입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{result.service}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(result.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">작업: {result.action}</p>
                  <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
                    {result.result}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
