# 데이터 모델링

## 1. TIMELINE

| 컬럼명 | 타입 | 제약조건 | 설명 |
| --- | --- |  --- | --- |
| id | BIGINT | PK |  |
| year | INT | NN | 년도 |
| content | TEXT | NN | 설명 |
| created_at | TIMESTAMP | NN | 생성일시 |
| updated_at | TIMESTAMP | NN | 수정일시 |

## 2. PERSON

| 컬럼명 | 타입 | 제약조건 | 설명 |
| --- | --- |  --- | --- |
| id | BIGINT | PK |  |
| title | VARCHAR(100) | NN | 제목 |
| content | TEXT | NN | 설명 |
| created_at | TIMESTAMP | NN | 생성일시 |
| updated_at | TIMESTAMP | NN | 수정일시 |

## 3. EVENT

| 컬럼명 | 타입 | 제약조건 | 설명 |
| --- | --- |  --- | --- |
| id | BIGINT | PK |  |
| title | VARCHAR(100) | NN | 제목 |
| content | TEXT | NN | 설명 |
| created_at | TIMESTAMP | NN | 생성일시 |
| updated_at | TIMESTAMP | NN | 수정일시 |

