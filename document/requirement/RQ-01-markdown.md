# 마크다운 지원 기능 설계

## 요구사항

사용자는 문서 본문을 마크다운(Markdown) 형식으로 작성할 수 있어야 한다.

작성된 마크다운은 원본 그대로 저장되며, 조회 시 HTML로 렌더링되어 표시된다.

---

## 저장 방식

사용자가 입력한 원본 마크다운을 그대로 저장한다.

예시:

```md
# 슬라임

슬라임은 초보자가 처음 만나게 되는 몬스터이다.
```

DB 저장:

```sql
content TEXT
```

---

## 렌더링 과정

### 1. 원본 마크다운 조회

```md
# 슬라임

슬라임은 초보자가 처음 만나게 되는 몬스터이다.
```

### 2. Markdown Parser 실행

예시 라이브러리:

* Flexmark
* CommonMark

### 3. 커스텀 확장 처리

서비스 전용 문법은 Markdown Parser의 Custom Extension을 통해 처리한다.

예시:

```md
@(monster:1)
@(person:2)
@(page:3)
```

파싱 결과:

```text
type = monster
id = 1
```

커스텀 노드 생성:

```java
MentionNode(
    type = "monster",
    id = 1
)
```

### 4. HTML 생성

커스텀 노드를 HTML로 변환한다.

예시:

```html
<a href="/monsters/1">@슬라임</a>
```

### 5. 사용자에게 출력

최종 생성된 HTML을 브라우저에 렌더링한다.

---

## 보안 요구사항

마크다운 렌더링 시 XSS(Cross Site Scripting) 공격을 방지해야 한다.

허용되지 않은 HTML 태그 및 스크립트는 제거하거나 이스케이프 처리한다.

입력:

```html
<script>alert('hack')</script>
```

출력:

```html
&lt;script&gt;alert('hack')&lt;/script&gt;
```

또는 제거

```html
```

---

## 커스텀 확장

서비스는 표준 마크다운 외에 서비스 전용 문법을 지원한다.

예시:

```md
@(monster:1)
@(person:2)
@(page:3)
```

처리 흐름:

```text
원본 Markdown
        ↓
Markdown Parser
        ↓
Custom Extension 실행
        ↓
커스텀 노드 생성
        ↓
HTML Renderer
        ↓
최종 HTML 생성
```

향후 새로운 문법 추가 시 Extension만 추가하여 확장할 수 있다.

예시:

```text
MentionExtension
WikiLinkExtension
VariableExtension
```

Flexmark 예시:

```java
Parser parser = Parser.builder()
    .extensions(List.of(
        MentionExtension.create()
    ))
    .build();

HtmlRenderer renderer = HtmlRenderer.builder()
    .extensions(List.of(
        MentionExtension.create()
    ))
    .build();
```
