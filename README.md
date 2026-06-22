# HISTORINE

HISTORINE은 대한민국 근대 국가 수립기, 특히 1800년대 후반부터 1900년대 극초반까지의 역사 흐름을 다루는 웹 서비스이다.

연표, 인물, 사건 데이터를 웹 사이트로 제공하여 사용자가 시기별 흐름에 따라 근대사의 주요 변화를 이해할 수 있도록 돕는다.

## 주요 기능

### 연표

대한민국 근대 국가 수립 과정의 주요 사건을 시간 순서대로 제공한다.

사용자는 연표를 스크롤하며 각 시기의 역사적 흐름을 이어서 확인할 수 있다.

### 인물 백과

근대 국가 수립 과정과 관련된 역사적 인물을 제공한다.

각 인물 페이지에서는 인물의 생애, 역할, 역사적 의미를 읽을 수 있다.

### 사건 백과

근대사의 주요 사건을 개별 문서로 제공한다.

각 사건 페이지에서는 사건의 배경, 전개, 결과, 역사적 의미를 확인할 수 있다.

### 관리자 기능

관리자는 연표, 인물, 사건 데이터를 등록, 수정, 삭제할 수 있다.

관리자 로그인은 일반 사용자 UI로 제공하지 않고, 관리자 전용 API를 통해 처리한다.

## 문서

| 문서 | 설명 |
| --- | --- |
| [기술 스택](./document/tech-stack.md) | 프로젝트에서 사용하는 기술 스택 |
| [데이터 모델링](./document/modeling.md) | 연표, 인물, 사건 데이터 모델 |
| [기능 명세](./document/feat-spec) | 기능별 상세 명세 |
| [요구사항](./document/requirement) | 기능별 요구사항 |

## 기능 명세

| 기능 | 문서 |
| --- | --- |
| 관리자 로그인 | [FS-01-admin-login.md](./document/feat-spec/FS-01-admin-login.md) |
| Timeline 렌더링 | [FS-02-timeline-rendering.md](./document/feat-spec/FS-02-timeline-rendering.md) |
| Person 렌더링 | [FS-03-person-rendering.md](./document/feat-spec/FS-03-person-rendering.md) |
| Event 렌더링 | [FS-04-event-rendering.md](./document/feat-spec/FS-04-event-rendering.md) |

## 요구사항

| 요구사항 | 문서 |
| --- | --- |
| 마크다운 지원 | [RQ-01-markdown.md](./document/requirement/RQ-01-markdown.md) |
| 마크다운 멘션 | [RQ-02-reference-page.md](./document/requirement/RQ-02-reference-page.md) |
| Auth | [RQ-03-auth.md](./document/requirement/RQ-03-auth.md) |
| Timeline 렌더링 | [RQ-04-timeline-rendering.md](./document/requirement/RQ-04-timeline-rendering.md) |
| Person 렌더링 | [RQ-05-person-rendering.md](./document/requirement/RQ-05-person-rendering.md) |
| Event 렌더링 | [RQ-06-event-rendering.md](./document/requirement/RQ-06-event-rendering.md) |
