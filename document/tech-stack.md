# Tech Stack

| 분야                 | 기술                          | 선정 이유                                       |
| ------------------ | --------------------------- | ------------------------------------------- |
| Frontend           | Next.js                     | SSR 지원, App Router 제공, 프론트엔드와 백엔드 통합 가능     |
| Backend            | Next.js Route Handler       | 별도 서버 없이 REST API 구현 가능, 개발 및 배포 복잡도 감소     |
| Database           | PostgreSQL                  | 관계형 데이터 관리에 적합, Full Text Search 지원, 높은 안정성 |
| ORM                | Prisma                      | Type-safe ORM, 마이그레이션 지원, 자동 타입 생성          |
| Authentication     | Auth.js                     | Next.js 생태계와 높은 호환성, 세션 및 OAuth 인증 지원       |
| Markdown           | react-markdown              | React 환경에서 마크다운 렌더링 지원                      |
| Markdown Parser    | remark                      | 마크다운 파싱 및 AST 생성                            |
| Markdown Extension | remark 플러그인                 | 멘션(`@(type:id)`) 등 서비스 전용 문법 확장 지원          |
| HTML Processing    | rehype                      | HTML 변환 및 후처리 지원                            |
| Search             | PostgreSQL Full Text Search | 별도 검색 엔진 없이 전문 검색 기능 제공                     |
| Hosting            | Vercel                      | Next.js 공식 배포 플랫폼, GitHub 연동 자동 배포          |
| Database Hosting   | Neon                        | Serverless PostgreSQL, Vercel과 높은 호환성       |
| Version Control    | GitHub                      | 소스 코드 관리 및 CI/CD 연동                         |

## Architecture

```text
Client
    ↓
Next.js
 ├─ UI
 ├─ Route Handler
 ├─ Auth.js
 ├─ Markdown Renderer
 └─ Mention Extension
    ↓
Prisma
    ↓
PostgreSQL (Neon)
```