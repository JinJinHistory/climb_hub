import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { prisma } from '@/lib/database';
import 'dotenv/config';

// 런타임 환경 변수 확인용 로그
// Next.js dev 서버에서 환경 변수 재로딩 이슈를 진단하기 위함
console.log('Runtime DATABASE_URL:', process.env.DATABASE_URL);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // 데이터베이스 연결 상태 확인
    try {
      await prisma.$connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
    
    // 여기에 인증 로직을 추가할 수 있습니다
    return { req };
  },
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    
    // 데이터베이스 연결 오류인 경우 더 명확한 메시지 제공
    if (error.extensions?.exception?.name === 'PrismaClientInitializationError') {
      return {
        ...error,
        message: '데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
      };
    }
    
    return error;
  },
});

const startServer = apolloServer.start();

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 