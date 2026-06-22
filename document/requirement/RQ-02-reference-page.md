# 마크다운 내 멘션(@) 기능 설계

## 요구사항

마크다운 문서에서 `@`를 사용해 특정 데이터를 참조할 수 있어야 한다.

멘션 대상은 페이지뿐만 아니라 여러 종류가 될 수 있다.

예시:

- timeline
- person
- event

예시 입력:

\```md
이 몬스터는 @슬라임 과 비슷하다.
\```

렌더링 결과:

\```html
이 몬스터는 <a href="/monsters/1">@슬라임</a> 과 비슷하다.
\```

---

## 입력 과정

### 1. 사용자가 `@` 입력

\```md
@
\```

### 2. 자동완성 UI 표시

사용자 입력:

\```md
@슬
\```

API 호출:

\```http
GET /api/mentions/search?keyword=슬
\```

응답:

\```json
[
  {
    "type": "monster",
    "id": 1,
    "name": "슬라임"
  },
  {
    "type": "page",
    "id": 3,
    "name": "슬라임 공략"
  }
]
\```

### 3. 멘션 대상 선택

사용자가 `슬라임` 몬스터를 선택하면 실제 마크다운에는 타입과 ID를 저장한다.

\```md
이 몬스터는 @(monster:1) 과 비슷하다.
\```

---

## 저장 방식

- 멘션 대상의 타입과 ID만 저장한다.
- 이름은 저장하지 않는다.
- 이름은 언제든 변경될 수 있기 때문이다.

형식:

\```md
@(type:id)
\```

예시:

\```md
@(page:1)
@(person:2)
@(monster:3)
\```

---

## 렌더링 과정

문서 조회 시:

\```md
@(person:1)은 @(monster:3)를 발견했다.
자세한 내용은 @(page:5)을 참고한다.
\```

### 1. 멘션 파싱

정규식 등으로 멘션을 추출한다.

\```text
person:1
monster:3
page:5
\```

### 2. 타입별로 ID 분류

\```text
person  → [1]
monster → [3]
page    → [5]
\```

### 3. 타입별 데이터 조회

\```sql
SELECT id, name
FROM persons
WHERE id IN (1);

SELECT id, name
FROM monsters
WHERE id IN (3);

SELECT id, title
FROM pages
WHERE id IN (5);
\```

조회 결과 예시:

\```json
{
  "person:1": {
    "label": "홍길동",
    "url": "/persons/1"
  },
  "monster:3": {
    "label": "초록 슬라임",
    "url": "/monsters/3"
  },
  "page:5": {
    "label": "초보자 가이드",
    "url": "/pages/5"
  }
}
\```

### 4. HTML 변환

\```html
<a href="/persons/1">@홍길동</a>은
<a href="/monsters/3">@초록 슬라임</a>를 발견했다.
자세한 내용은 <a href="/pages/5">@초보자 가이드</a>을 참고한다.
\```

---

## 이름 변경 시 동작

초기 상태:

| 타입 | ID | 이름 |
|---|---:|---|
| monster | 3 | 슬라임 |

문서 내용:

\```md
@(monster:3)
\```

화면 표시:

\```text
@슬라임
\```

이후 이름 변경:

| 타입 | ID | 이름 |
|---|---:|---|
| monster | 3 | 초록 슬라임 |

문서 내용은 그대로다.

\```md
@(monster:3)
\```

하지만 렌더링 결과는 자동으로 변경된다.

\```text
@초록 슬라임
\```

---

## 타입별 링크 매핑

| 타입 | 이동 경로 |
|---|---|
| timeline | `/timelines/{id}` |
| person | `/persons/{id}` |
| event | `/events/{id}` |
