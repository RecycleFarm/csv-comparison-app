# CSV 비교 앱 - API 문서

**문서 버전**: 1.0  
**최종 업데이트**: 2024년 12월 19일  
**작성자**: 개발팀

---

## 📋 개요

현재 CSV 비교 앱은 **클라이언트 사이드 전용** 애플리케이션으로, 별도의 서버 API가 없습니다. 모든 데이터 처리는 브라우저에서 직접 수행됩니다.

---

## 🏗️ 아키텍처

### 클라이언트 사이드 처리
```
CSV 파일 → PapaParse → 메모리 처리 → 결과 출력
```

### 데이터 플로우
1. **파일 업로드**: 사용자가 CSV 파일 선택
2. **파싱**: PapaParse로 CSV 데이터 파싱
3. **비교**: JavaScript로 데이터 비교 및 필터링
4. **출력**: 결과를 화면에 표시 및 CSV 다운로드

---

## 📊 데이터 구조

### 입력 데이터 (CSV)

#### 필수 컬럼
| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| user_id | string | 유저 고유 식별자 | "user123" |
| update_count | number | 업데이트 횟수 | 5 |

#### 선택적 컬럼
| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| e164 | string | 국제 전화번호 | "+821012345678" |
| deleted | boolean | 삭제 여부 | false |

### 출력 데이터

#### 필터링된 유저 데이터
```typescript
interface ComparisonResult {
  user_id: string;           // 유저 ID
  yesterday_count: number;   // 어제 업데이트 횟수
  today_count: number;       // 오늘 업데이트 횟수
  difference: number;        // 차이 (오늘 - 어제)
  e164?: string;            // E164 전화번호
  country?: string;         // 국가 (한국/미국/기타)
  deleted?: boolean;        // 삭제 여부
}
```

#### 통계 데이터
```typescript
interface Statistics {
  yesterday_stats: { [key: number]: number };  // 어제 횟수별 유저 수
  today_stats: { [key: number]: number };      // 오늘 횟수별 유저 수
  filtered_users: ComparisonResult[];          // 필터링된 유저 목록
  all_users: ComparisonResult[];               // 전체 유저 목록
}
```

---

## 🔧 핵심 함수

### 1. CSV 파싱 함수

```typescript
parseCSV(file: File): Promise<UserData[]>
```

**매개변수**:
- `file`: 업로드된 CSV 파일

**반환값**:
- `Promise<UserData[]>`: 파싱된 유저 데이터 배열

**동작**:
1. PapaParse로 CSV 파일 파싱
2. 동적 컬럼명 인식
3. 데이터 타입 변환 및 검증
4. 유효하지 않은 행 필터링

### 2. 데이터 비교 함수

```typescript
compareData(yesterdayData: UserData[], todayData: UserData[]): Statistics
```

**매개변수**:
- `yesterdayData`: 어제 데이터 배열
- `todayData`: 오늘 데이터 배열

**반환값**:
- `Statistics`: 비교 결과 및 통계

**필터링 조건**:
```typescript
(yesterdayCount <= 2 || isNewUser) && user.update_count >= 3 && !user.deleted
```

### 3. 국가 판별 함수

```typescript
getCountryFromE164(e164: string): string
```

**매개변수**:
- `e164`: E164 형식 전화번호

**반환값**:
- `string`: 국가명 ("한국", "미국", "기타")

**국가 코드 매핑**:
- `+1` → "미국"
- `+82` → "한국"
- 기타 → "기타"

---

## 📁 파일 처리

### 지원 파일 형식
- **CSV**: Comma-Separated Values
- **인코딩**: UTF-8 권장
- **최대 크기**: 10MB (브라우저 메모리 제한)

### 컬럼명 인식 패턴

#### user_id 컬럼
```typescript
// 인식되는 패턴들
'user_id', 'userId', 'user', 'id'
```

#### update_count 컬럼
```typescript
// 인식되는 패턴들
'사용횟수', 'update_count', 'count', 'usage', '횟수'
```

#### e164 컬럼
```typescript
// 인식되는 패턴들
'e164', 'phone', '전화'
```

#### deleted 컬럼
```typescript
// 인식되는 패턴들
'삭제', 'deleted', 'delete', 'remove'
```

---

## 📊 출력 형식

### 1. 필터링된 유저 CSV

```csv
user_id,yesterday_count,today_count,difference,e164,country,deleted
user123,1,5,4,+821012345678,한국,false
user456,0,3,3,+12125551234,미국,false
user789,2,4,2,+8613800138000,기타,false
```

### 2. 통계 CSV

```csv
=== 전체 통계 ===
count,yesterday_users,today_users
0,100,50
1,80,60
2,60,40
3,40,80
4,20,100
5,10,50

=== 한국 통계 ===
count,yesterday_users,today_users
0,50,25
1,40,30
2,30,20
3,20,40
4,10,50
5,5,25

=== 미국 통계 ===
count,yesterday_users,today_users
0,30,15
1,25,20
2,20,15
3,15,25
4,8,30
5,3,15

=== 기타 통계 ===
count,yesterday_users,today_users
0,20,10
1,15,10
2,10,5
3,5,15
4,2,20
5,2,10
```

---

## ⚠️ 에러 처리

### 파싱 에러
```typescript
// PapaParse 에러 처리
error: (error) => {
  console.error('CSV 파싱 오류:', error);
  reject(error);
}
```

### 데이터 검증
```typescript
// 필수 필드 검증
.filter(row => {
  const userId = row[userIdColumn];
  const updateCount = row[updateCountColumn];
  const hasUserId = userId && userId.toString().trim() !== '';
  const hasUpdateCount = updateCount !== undefined && updateCount !== null;
  return hasUserId && hasUpdateCount;
})
```

### 메모리 제한
- **권장 파일 크기**: 10MB 이하
- **대용량 파일**: 청크 단위 처리 고려 필요

---

## 🔄 향후 API 확장 계획

### 서버 사이드 API (계획)
```typescript
// 예상 API 엔드포인트
POST /api/compare
{
  "yesterday_file": "base64_encoded_csv",
  "today_file": "base64_encoded_csv"
}

Response:
{
  "success": true,
  "data": {
    "filtered_users": [...],
    "statistics": {...}
  }
}
```

### 실시간 데이터 연동 (계획)
```typescript
// 예상 WebSocket 연결
ws://api.example.com/stream
{
  "type": "user_update",
  "data": {
    "user_id": "user123",
    "update_count": 5,
    "timestamp": "2024-12-19T10:30:00Z"
  }
}
```

---

## 📚 사용 예시

### 기본 사용법
```typescript
// 1. 파일 업로드
const handleFileUpload = (file: File) => {
  parseCSV(file).then(data => {
    console.log('파싱된 데이터:', data);
  });
};

// 2. 데이터 비교
const handleCompare = () => {
  const result = compareData(yesterdayData, todayData);
  console.log('비교 결과:', result);
};

// 3. CSV 다운로드
const handleDownload = () => {
  downloadResult(); // 필터링된 유저 CSV
  downloadStatistics(); // 통계 CSV
};
```

### 디버깅
```typescript
// 콘솔 로그 확인
console.log('CSV 파싱 결과:', results);
console.log('사용할 컬럼명:', { userIdColumn, updateCountColumn });
console.log('필터링된 유저들:', result.filtered_users);
```

---

## 📞 지원

### 기술 지원
- **GitHub Issues**: 버그 리포트 및 기능 요청
- **개발팀**: 기술 문의

### 문서 업데이트
- **버전 관리**: 시맨틱 버저닝
- **변경 로그**: 주요 변경사항 기록
- **호환성**: 브라우저 지원 범위 명시

---

**문서 승인**:  
- API 설계자: [승인 대기]  
- 기술 리드: [승인 대기]  
- 최종 승인일: [승인 대기]
