# Climb Hub

전국 클라이밍 암장의 뉴셋/탈거 정보를 공유하는 웹 애플리케이션입니다.

## 🚀 주요 기능

### 📅 뉴셋/탈거 정보 관리
- 전국 클라이밍 암장의 뉴셋 일정 확인
- 탈거 예정일 알림 및 관리
- 공지사항 및 업데이트 정보 제공
- 실시간 정보 동기화

### 🔍 고급 필터링 및 검색
- **타입별 필터**: 전체, 뉴셋, 탈거, 공지
- **검색 기능**: 암장명, 지점명, 제목, 설명으로 검색
- **정렬 옵션**: 날짜순, 암장순, 타입순
- **최근 업데이트**: 최근 1주일 업데이트만 보기

### ⭐ 즐겨찾기 및 알림
- 관심 있는 업데이트를 즐겨찾기로 저장
- 즐겨찾기한 업데이트 목록 별도 표시
- 업데이트별 알림 설정 기능

### 📊 업데이트 현황 통계
- 전체 업데이트 수
- 뉴셋, 탈거, 공지별 개수
- 실시간 통계 업데이트

### 🎨 사용자 친화적 UI
- 반응형 디자인으로 모바일/데스크톱 지원
- 직관적인 필터 및 검색 인터페이스
- 확장 가능한 업데이트 카드
- 현대적이고 깔끔한 디자인

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useMemo)
- **GraphQL**: Apollo Client
- **Build Tool**: Next.js App Router

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 페이지 (뉴셋/탈거 목록)
│   ├── admin/             # 관리자 페이지
│   └── layout.tsx         # 레이아웃
├── components/            # React 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   │   ├── button.tsx    # 버튼 컴포넌트
│   │   ├── card.tsx      # 카드 컴포넌트
│   │   └── toggle.tsx    # 토글 스위치
│   └── features/         # 기능별 컴포넌트
├── graphql/              # GraphQL 관련 파일
│   ├── queries.ts        # GraphQL 쿼리
│   ├── mutations.ts      # GraphQL 뮤테이션
│   ├── resolvers.ts      # GraphQL 리졸버
│   └── schema.ts         # GraphQL 스키마
├── lib/                  # 유틸리티 함수
│   ├── apollo-client.ts  # Apollo Client 설정
│   ├── database.ts       # 데이터베이스 연결
│   └── utils.ts          # 공통 유틸리티
└── types/                # TypeScript 타입 정의
    └── index.ts          # 타입 정의
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn
- PostgreSQL 데이터베이스

### 설치 및 실행

1. 저장소 클론
```bash
git clone <repository-url>
cd climb_hub
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env.local` 파일 생성:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/climb_hub
```

4. 데이터베이스 설정
```bash
npm run db:migrate
npm run db:seed
```

5. 개발 서버 실행
```bash
npm run dev
```

6. 브라우저에서 `http://localhost:3000` 접속

## 📱 주요 화면 구성

### 1. 헤더
- Climb Hub 로고 및 네비게이션 메뉴
- 뉴셋/탈거, 암장 정보 탭

### 2. 통계 카드
- 전체 업데이트 수, 뉴셋, 탈거, 공지 개수
- 시각적 아이콘과 함께 표시

### 3. 필터 및 검색
- 업데이트 타입별 필터 버튼
- 실시간 검색 기능
- 정렬 옵션 및 최근 업데이트 토글

### 4. 즐겨찾기 목록
- 사용자가 즐겨찾기한 업데이트들
- 빠른 접근 및 관리

### 5. 업데이트 목록
- 필터링된 업데이트 목록
- 확장 가능한 카드 형태
- 즐겨찾기 및 알림 기능

## 🔧 주요 기능 상세

### 뉴셋 정보
- 새로운 루트 설치 일정
- 암장별 뉴셋 정보
- 상세 설명 및 이미지

### 탈거 정보
- 루트 탈거 예정일
- 마지막 기회 알림
- 긴급도 표시

### 공지사항
- 암장별 중요 공지
- 업데이트 및 변경사항
- 일정 및 이벤트 정보

## 📊 데이터 구조

### RouteUpdate
- `id`: 고유 식별자
- `type`: 업데이트 타입 (NEWSET, REMOVAL, ANNOUNCEMENT)
- `updateDate`: 업데이트 일자
- `title`: 제목
- `description`: 상세 설명
- `gym`: 관련 암장 정보
- `instagramPostUrl`: Instagram 포스트 링크

### Gym
- `name`: 암장명
- `branchName`: 지점명
- `brand`: 브랜드 정보
- `address`: 주소
- `instagramHandle`: Instagram 계정

## 🔧 커스터마이징

### 업데이트 타입 추가
새로운 업데이트 타입을 추가하려면 `getDateDisplayInfo` 함수와 관련 로직을 수정하면 됩니다.

### 필터 옵션 확장
필터링 옵션을 추가하려면 `filteredUpdates` 로직을 수정하면 됩니다.

### 스타일 수정
Tailwind CSS 클래스를 사용하여 각 컴포넌트의 스타일을 쉽게 수정할 수 있습니다.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.
