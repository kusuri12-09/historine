# Tech Stack

| 분야                 | 기술                          | 선정 이유                                       |
| ------------------ | --------------------------- | ------------------------------------------- |
| Frontend           | Next.js                     | SSR 지원, App Router 제공, 프론트엔드와 백엔드 통합 가능     |
| Styling            | Tailwind CSS                | 디자인 토큰 기반 유틸리티 클래스로 빠르고 일관된 퍼블리싱 가능 |
| UI Component       | Material UI                 | 버튼, 칩 등 검증된 접근성/상태 처리 컴포넌트 활용 |
| Headless UI        | Radix UI                    | 내비게이션 등 상호작용 UI를 스타일 제약 없이 접근성 있게 구현 |
| Backend            | Next.js Route Handler       | 별도 서버 없이 REST API 구현 가능, 개발 및 배포 복잡도 감소     |
| Database           | PostgreSQL                  | 관계형 데이터 관리에 적합, Full Text Search 지원, 높은 안정성 |
| ORM                | Prisma                      | Type-safe ORM, 마이그레이션 지원, 자동 타입 생성          |
| Authentication     | 자체 쿠키 세션                  | 관리자 전용 단순 인증, 랜덤 세션 ID 회전, CSRF 토큰 검증, 로그인 rate limit 적용 |
| Markdown           | react-markdown              | React 환경에서 마크다운 렌더링 지원, 기본 HTML 이스케이프 처리 |
| Markdown Extension | 자체 멘션 전처리                 | 멘션(`@(type:id)`)을 데이터 조회 후 내부 링크 마크다운으로 변환 |
| Search             | PostgreSQL Full Text Search | 별도 검색 엔진 없이 전문 검색 기능 제공                     |
| Hosting            | Vercel                      | Next.js 공식 배포 플랫폼, GitHub 연동 자동 배포          |
| Database Hosting   | Neon                        | Serverless PostgreSQL, Vercel과 높은 호환성       |
| Version Control    | GitHub                      | 소스 코드 관리 및 CI/CD 연동                         |

## Architecture

```text
Client
    ↓
Next.js App Router
 ├─ Pages / Layout
 ├─ Client Components
 │  ├─ Tailwind CSS
 │  ├─ Material UI
 │  └─ Radix UI
 ├─ Server Components
 │  ├─ Markdown Renderer (react-markdown)
 │  └─ Mention Preprocessor (@(type:id))
 ├─ Route Handlers
 │  ├─ Admin CRUD API
 │  └─ Auth API
 ├─ Security
 │  ├─ Cookie Session
 │  ├─ CSRF Token
 │  └─ Login Rate Limit
 └─ Repositories
    ↓
Prisma
    ↓
PostgreSQL (Neon)
```
