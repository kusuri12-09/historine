# 데이터 모델링

## 1. TIMELINE

| 컬럼명 | 타입 | 제약조건 | 설명 |
| --- | --- |  --- | --- |
| id | BIGINT | PK |  |
| year | INT | NN | 년도 |
| type | VARCHAR(10) | NN | 한국사, 세계사 구분 (KOREA, WORLD) |
| content | TEXT | NN | 설명 |
| created_at | TIMESTAMP | NN | 생성일시 |
| updated_at | TIMESTAMP | NN | 수정일시 |

## 2. PERSON

| 컬럼명 | 타입 | 제약조건 | 설명 |
| --- | --- |  --- | --- |
| id | BIGINT | PK |  |
| title | VARCHAR(100) | NN | 제목 |
| period | VARCHAR(50) | NN | 활동 시기 또는 생몰 기간 |
| category | VARCHAR(100) | NN | 인물 분류 |
| tags | TEXT[] | NN | 태그 목록 |
| content | TEXT | NN | 설명 |
| summary | TEXT | NN | 한줄 소개 |
| created_at | TIMESTAMP | NN | 생성일시 |
| updated_at | TIMESTAMP | NN | 수정일시 |

## 3. EVENT

| 컬럼명 | 타입 | 제약조건 | 설명 |
| --- | --- |  --- | --- |
| id | BIGINT | PK |  |
| title | VARCHAR(100) | NN | 제목 |
| period | VARCHAR(50) | NN | 사건 발생 시기 |
| category | VARCHAR(100) | NN | 사건 분류 |
| tags | TEXT[] | NN | 태그 목록 |
| content | TEXT | NN | 설명 |
| summary | TEXT | NN | 한줄 소개 |
| created_at | TIMESTAMP | NN | 생성일시 |
| updated_at | TIMESTAMP | NN | 수정일시 |

