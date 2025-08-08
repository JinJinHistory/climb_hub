# Climb Hub

클라이밍 암장의 뉴셋/탈거 정보를 공유하는 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: GraphQL (Apollo Server), PostgreSQL
- **State Management**: Apollo Client, Zustand
- **UI Components**: Lucide React Icons
- **Database**: PostgreSQL with pg library
- **Migration**: Custom migration system

## 주요 기능

- **브랜드 관리**: 클라이밍 브랜드 정보 관리
- **암장 관리**: 각 브랜드의 암장 정보 관리
- **업데이트 관리**: 뉴셋, 탈거, 부분탈거, 공지사항 관리
- **크롤링 로그**: Instagram 크롤링 결과 로그
- **관리자 대시보드**: 브랜드, 암장, 업데이트 관리 인터페이스

## 프로젝트 구조

```
climb_hub/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # 관리자 페이지
│   │   ├── graphql/           # GraphQL Playground
│   │   └── layout.tsx         # 루트 레이아웃
│   ├── components/            # React 컴포넌트
│   ├── graphql/               # GraphQL 관련 파일
│   │   ├── schema.ts          # GraphQL 스키마 정의
│   │   ├── resolvers.ts       # GraphQL 리졸버
│   │   ├── queries.ts         # GraphQL 쿼리
│   │   └── mutations.ts       # GraphQL 뮤테이션
│   ├── lib/                   # 유틸리티 라이브러리
│   │   ├── database.ts        # PostgreSQL 연결
│   │   └── apollo-client.ts   # Apollo Client 설정
│   ├── pages/                 # API 라우트
│   │   └── api/
│   │       └── graphql.ts     # GraphQL API 엔드포인트
│   └── types/                 # TypeScript 타입 정의
├── migrations/                # 데이터베이스 마이그레이션
│   ├── 001_initial_schema.sql
│   ├── 002_add_sample_data.sql
│   └── 003_add_phone_column_to_gyms.sql
├── database_schema.sql        # 전체 스키마 (단일 파일)
└── package.json
```

## 개발 환경 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. PostgreSQL 설정

#### 로컬 PostgreSQL 설치 (Windows)
1. [PostgreSQL 공식 사이트](https://www.postgresql.org/download/windows/)에서 다운로드
2. 설치 시 비밀번호 설정 (예: `postgres123`)
3. 서비스 자동 시작 설정

#### 데이터베이스 생성
```bash
# PostgreSQL 접속
psql -U postgres -h localhost

# 데이터베이스 생성
CREATE DATABASE climb_hub;

# 데이터베이스 연결
\c climb_hub
```

### 3. 환경 변수 설정
`.env.local` 파일 생성:
```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/climb_hub
```

### 4. 데이터베이스 스키마 설정

#### 방법 1: 마이그레이션 시스템 사용 (권장)
```bash
# 마이그레이션 실행
npm run db:migrate

# 데이터베이스 초기화
npm run db:reset

# 샘플 데이터 삽입
npm run db:seed
```

#### 방법 2: 단일 스키마 파일 사용
```bash
# PostgreSQL에서 스키마 실행
psql -U postgres -d climb_hub -f database_schema.sql
```

### 5. 개발 서버 실행
```bash
npm run dev
```

### 6. GraphQL 코드 생성 (선택사항)
```bash
npm run codegen
```

## GraphQL API

### 스키마 구조
- `Brand`: 브랜드 정보 (id, name, logoUrl, websiteUrl)
- `Gym`: 암장 정보 (brandId, name, branchName, instagramHandle, address, phone)
- `RouteUpdate`: 암장 업데이트 정보 (gymId, type, updateDate, title, description)
- `CrawlLog`: 크롤링 로그 (gymId, status, postsFound, postsNew)

### 주요 쿼리
- `brands`: 모든 브랜드 조회
- `gyms(activeOnly)`: 활성 암장 조회
- `routeUpdates(gymId, type, limit, offset)`: 업데이트 목록 조회
- `crawlLogs(gymId)`: 크롤링 로그 조회

### 주요 뮤테이션
- `createBrand`, `updateBrand`, `deleteBrand`
- `createGym`, `updateGym`, `deleteGym`
- `createRouteUpdate`, `updateRouteUpdate`, `deleteRouteUpdate`
- `createCrawlLog`, `updateCrawlLog`

### API 엔드포인트
- **GraphQL API**: `/api/graphql`
- **GraphQL Playground**: `/graphql` (Apollo Studio로 리다이렉트)

## 데이터베이스 마이그레이션

### 마이그레이션 시스템
프로젝트는 커스텀 마이그레이션 시스템을 사용합니다:

```
migrations/
├── 001_initial_schema.sql     # 초기 테이블 생성
├── 002_add_sample_data.sql    # 샘플 데이터 삽입
└── 003_add_phone_column_to_gyms.sql  # 스키마 변경
```

### 마이그레이션 명령어
```bash
npm run db:migrate    # 마이그레이션 실행
npm run db:reset      # 데이터베이스 초기화
npm run db:seed       # 샘플 데이터 삽입
```

### 마이그레이션 작성 가이드
1. 파일명: `{순번}_{설명}.sql`
2. 헤더에 마이그레이션 정보 포함
3. 롤백 가능한 구조로 작성
4. `IF NOT EXISTS` 사용으로 안전성 확보

## 관리자 기능

### 관리자 페이지 접근
- `/admin`: 관리자 대시보드
- `/admin/gyms`: 암장 관리
- `/admin/updates`: 업데이트 관리
- `/admin/updates/list`: 업데이트 목록
- `/admin/updates/edit/[id]`: 업데이트 편집

### 주요 기능
- 브랜드 CRUD 작업
- 암장 정보 관리
- 뉴셋/탈거 업데이트 등록
- 크롤링 로그 확인

## 배포

### 프로덕션 환경 변수
```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

### 빌드 및 실행
```bash
npm run build
npm start
```

## 개발 가이드

### 새로운 기능 추가
1. GraphQL 스키마에 타입 추가 (`src/graphql/schema.ts`)
2. 리졸버 구현 (`src/graphql/resolvers.ts`)
3. 쿼리/뮤테이션 정의 (`src/graphql/queries.ts`, `src/graphql/mutations.ts`)
4. 필요한 경우 마이그레이션 생성
5. 프론트엔드 컴포넌트 구현

### 데이터베이스 스키마 변경
1. 새로운 마이그레이션 파일 생성
2. 스키마 변경 SQL 작성
3. 마이그레이션 실행
4. GraphQL 스키마 업데이트
5. 리졸버 수정

## 문제 해결

### 일반적인 문제
1. **데이터베이스 연결 오류**: `DATABASE_URL` 확인
2. **테이블이 존재하지 않음**: 마이그레이션 실행
3. **GraphQL 오류**: 스키마와 리졸버 일치성 확인
4. **타입 오류**: `npm run codegen` 실행

### 로그 확인
- GraphQL 오류: 브라우저 개발자 도구 콘솔
- 데이터베이스 오류: 서버 로그
- 마이그레이션 오류: 터미널 출력

## 기여 가이드

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
