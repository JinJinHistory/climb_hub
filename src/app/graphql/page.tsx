'use client';

import { useEffect } from 'react';

export default function GraphQLPlayground() {
  useEffect(() => {
    // Apollo Studio로 리다이렉트
    window.location.href = 'https://studio.apollographql.com/sandbox/explorer';
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">GraphQL Playground</h1>
        <p className="text-gray-600 mb-4">Apollo Studio로 리다이렉트 중...</p>
        <p className="text-sm text-gray-500">
          또는 직접{' '}
          <a
            href="https://studio.apollographql.com/sandbox/explorer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Apollo Studio
          </a>
          에서 GraphQL을 테스트해보세요.
        </p>
      </div>
    </div>
  );
} 