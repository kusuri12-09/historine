# HISTORINE

it HISTORINE은 대한민국 근대 국가 수립기, 1800년대 후반부터 1900년대 극초반까지의 역사 흐름을 다루는 웹 서비스입니다.

연표, 인물, 사건 데이터를 웹 사이트로 제공하여 사용자가 시기별 흐름에 따라 근대사의 주요 변화를 이해할 수 있도록 도와줍니다.

## 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example`을 참고해 `.env` 파일을 생성합니다.

```env
DATABASE_URL="postgresql://user:password@localhost:5432/historine"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="e2186dbdb1bb4193608605e84f33208765b5693b55edd4f730a719a100eeea6f"
ADMIN_SESSION_SECRET="replace-with-random-session-secret"
ADMIN_API_ENABLED="true"
```

`ADMIN_PASSWORD_HASH`는 관리자 비밀번호의 SHA-256 해시값,
`ADMIN_SESSION_SECRET`은 관리자 로그인 세션 쿠키 서명에 사용하는 임의 문자열입니다.
`ADMIN_API_ENABLED=false`로 설정하면 관리자 페이지와 관리자 API가 비활성화됩니다.

PowerShell에서 다음 명령으로 바로 생성할 수 있습니다.

```powershell
$password = "change-me"
$sha = [System.Security.Cryptography.SHA256]::Create()
$bytes = [System.Text.Encoding]::UTF8.GetBytes($password)
($sha.ComputeHash($bytes) | ForEach-Object { $_.ToString("x2") }) -join ""
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 다음 주소로 접속합니다.

```text
http://localhost:3000
```

### 4. 관리자 로그인

브라우저에서 다음 주소로 접속합니다.

```text
http://localhost:3000/admin
```

기본 관리자 계정은 `.env` 값으로 설정합니다.

`.env`를 만들지 않은 경우 개발 기본값은 다음과 같습니다.

```text
아이디: admin
비밀번호: change-me
```

관리자로 로그인하면 연표, 인물 백과, 사건 백과 데이터를 추가할 수 있습니다.

등록 데이터는 `DATABASE_URL`에 연결된 PostgreSQL 데이터베이스에 저장됩니다.

### 5. 데이터베이스 마이그레이션

```bash
npm run prisma:migrate
```

Prisma Client가 필요할 경우 다음 명령을 실행합니다.

```bash
npm run prisma:generate
```

### 6. 프로덕션 빌드

운영 환경에서 관리자 기능을 완전히 닫으려면 배포 환경 변수에 다음 값을 설정합니다.

```env
ADMIN_API_ENABLED="false"
```

```bash
npm run build
npm run start
```

## 주요 기능

### 연표

대한민국 근대 국가 수립 과정의 주요 사건을 시간 순서대로 제공합니다.

사용자는 연표를 스크롤하며 각 시기의 역사적 흐름을 이어서 확인할 수 있습니다.

### 인물 백과

근대 국가 수립 과정과 관련된 역사적 인물을 제공합니다.

각 인물 페이지에서는 인물의 생애, 역할, 역사적 의미를 읽을 수 있습니다.

### 사건 백과

근대사의 주요 사건을 개별 문서로 제공합니다.

각 사건 페이지에서는 사건의 배경, 전개, 결과, 역사적 의미를 확인할 수 있습니다.

### 관리자 기능

관리자는 연표, 인물, 사건 데이터를 추가할 수 있습니다.

관리자 화면은 공개 메뉴에 노출하지 않고 `/admin` 경로로 접근합니다.

## 문서

| 문서 | 설명 |
| --- | --- |
| [기술 스택](./document/tech-stack.md) | 프로젝트에서 사용하는 기술 스택 |
| [데이터 모델링](./document/modeling.md) | 연표, 인물, 사건 데이터 모델 |
| [기능 명세](./document/feat-spec) | 기능별 상세 명세 |
| [요구사항](./document/requirement) | 기능별 요구사항 |
