# Climb Hub

클라이밍 암장의 뉴셋/탈거 정보를 공유하는 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: GraphQL (Apollo Server), PostgreSQL
- **State Management**: Apollo Client, Zustand
- **UI Components**: Lucide React Icons

## GraphQL API

이 프로젝트는 Supabase에서 GraphQL + PostgreSQL로 완전히 마이그레이션되었습니다.

### 주요 기능

- **브랜드 관리**: 클라이밍 브랜드 정보 관리
- **암장 관리**: 각 브랜드의 암장 정보 관리
- **업데이트 관리**: 뉴셋, 탈거, 부분탈거, 공지사항 관리
- **크롤링 로그**: Instagram 크롤링 결과 로그

### GraphQL 스키마

주요 타입들:
- `Brand`: 브랜드 정보
- `Gym`: 암장 정보 (브랜드와 연결)
- `RouteUpdate`: 암장 업데이트 정보
- `CrawlLog`: 크롤링 로그

### 개발 환경 설정

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/climb_hub
```

3. 개발 서버 실행:
```bash
npm run dev
```

4. GraphQL 코드 생성 (선택사항):
```bash
npm run codegen
```

### GraphQL Playground

GraphQL API를 테스트하려면:
- `/graphql` 페이지 방문 (Apollo Studio로 리다이렉트)
- 또는 직접 [Apollo Studio](https://studio.apollographql.com/sandbox/explorer) 방문

### API 엔드포인트

- GraphQL API: `/api/graphql`
- GraphQL Playground: `/graphql`

## 마이그레이션 정보

### Supabase에서 GraphQL + PostgreSQL로 완전 마이그레이션

1. **데이터 접근 방식**:
   - 기존: Supabase 클라이언트 직접 사용
   - 현재: GraphQL 쿼리/뮤테이션 + PostgreSQL 직접 연결

2. **데이터베이스 연결**:
   - 기존: Supabase 서비스 의존
   - 현재: PostgreSQL 직접 연결 (pg 라이브러리)

3. **타입 안전성**:
   - GraphQL 스키마 기반 타입 생성
   - Apollo Client의 타입 안전성 활용

4. **성능 최적화**:
   - 필요한 데이터만 요청
   - 캐싱 및 정규화 자동 처리
   - SQL 쿼리 최적화

5. **개발자 경험**:
   - GraphQL Playground를 통한 API 테스트
   - 자동 코드 생성으로 타입 안전성 보장
   - 완전한 데이터베이스 제어

### 제거된 Supabase 의존성

- `@supabase/auth-helpers-nextjs`
- `@supabase/supabase-js`
- Supabase 클라이언트 설정
- Supabase 타입 정의
