# CSV 비교 앱 - 개발자 가이드

**문서 버전**: 1.0  
**최종 업데이트**: 2024년 12월 19일  
**작성자**: 개발팀

---

## 🏗️ 프로젝트 구조

```
csv-comparison-app/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── App.tsx          # 메인 컴포넌트
│   ├── App.css          # 스타일시트
│   ├── index.tsx        # 앱 진입점
│   ├── index.css        # 글로벌 스타일
│   └── react-app-env.d.ts
├── package.json         # 의존성 관리
├── tsconfig.json        # TypeScript 설정
└── README.md           # 프로젝트 설명
```

---

## 🛠️ 기술 스택

### 핵심 기술
- **React 18.2.0**: UI 프레임워크
- **TypeScript 4.9.5**: 타입 안전성
- **PapaParse 5.4.1**: CSV 파싱 라이브러리

### 개발 도구
- **Create React App**: 프로젝트 초기 설정
- **GitHub Pages**: 정적 호스팅
- **npm**: 패키지 관리

---

## 📋 데이터 모델

### 인터페이스 정의

```typescript
interface UserData {
  user_id: string;
  update_count: number;
  e164?: string;
  deleted?: boolean;
}

interface ComparisonResult {
  user_id: string;
  yesterday_count: number;
  today_count: number;
  difference: number;
  e164?: string;
  country?: string;
  deleted?: boolean;
}

interface Statistics {
  yesterday_stats: { [key: number]: number };
  today_stats: { [key: number]: number };
  filtered_users: ComparisonResult[];
  all_users: ComparisonResult[];
}
```

---

## 🔧 핵심 로직

### 1. CSV 파싱 (`parseCSV`)

```typescript
const parseCSV = (file: File): Promise<UserData[]>
```

**기능**:
- PapaParse를 사용한 CSV 파일 파싱
- 동적 컬럼명 인식
- 데이터 타입 변환 및 검증

**동적 컬럼 인식 패턴**:
- **user_id**: `user`, `id` 포함
- **update_count**: `사용횟수`, `count`, `usage`, `횟수` 포함
- **e164**: `e164`, `phone`, `전화` 포함
- **deleted**: `삭제`, `deleted`, `delete`, `remove` 포함

### 2. 데이터 비교 (`compareData`)

```typescript
const compareData = (yesterdayData: UserData[], todayData: UserData[]): Statistics
```

**필터링 조건**:
```typescript
(yesterdayCount <= 2 || isNewUser) && user.update_count >= 3 && !user.deleted
```

**통계 계산**:
- 어제/오늘 업데이트 횟수별 유저 수 집계
- 전체 유저 데이터 보존 (`all_users`)

### 3. 국가 판별 (`getCountryFromE164`)

```typescript
const getCountryFromE164 = (e164: string): string
```

**국가 코드 매핑**:
- `+1` → "미국"
- `+82` → "한국"
- 기타 → "기타"

---

## 🎨 UI 컴포넌트

### 메인 컴포넌트 구조

```typescript
function App() {
  // 상태 관리
  const [yesterdayFile, setYesterdayFile] = useState<File | null>(null);
  const [todayFile, setTodayFile] = useState<File | null>(null);
  const [result, setResult] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);

  // 핵심 함수들
  const parseCSV = (file: File): Promise<UserData[]>
  const compareData = (yesterdayData: UserData[], todayData: UserData[]): Statistics
  const downloadResult = (): void
  const downloadStatistics = (): void
}
```

### 스타일링 가이드

#### 색상 팔레트
```css
/* 헤더 배경 */
.App-header {
  background: #87CEEB; /* 파스텔 블루 */
}

/* 버튼 */
.download-button {
  background: #4CAF50; /* 그린 */
  color: white;
}

/* 유저 아이템 */
.user-item {
  border: 1px solid #ddd;
  background: #f9f9f9;
}
```

#### 반응형 디자인
- **모바일**: 768px 이하에서 스택 레이아웃
- **태블릿**: 768px ~ 1024px
- **데스크톱**: 1024px 이상

---

## 📊 CSV 출력 형식

### 1. 필터링된 유저 CSV

```csv
user_id,yesterday_count,today_count,difference,e164,country,deleted
user123,1,5,4,+821012345678,한국,false
user456,0,3,3,+12125551234,미국,false
```

### 2. 통계 CSV

```csv
=== 전체 통계 ===
count,yesterday_users,today_users
0,100,50
1,80,60
2,60,40
3,40,80
...

=== 한국 통계 ===
count,yesterday_users,today_users
0,50,25
1,40,30
...

=== 미국 통계 ===
count,yesterday_users,today_users
0,30,15
1,25,20
...

=== 기타 통계 ===
count,yesterday_users,today_users
0,20,10
1,15,10
...
```

---

## 🚀 배포 프로세스

### 1. 로컬 개발
```bash
npm install
npm start
```

### 2. 빌드
```bash
npm run build
```

### 3. GitHub Pages 배포
```bash
npm run deploy
```

### 4. 배포 확인
- URL: https://noahrecyclefarm.github.io/csv-comparison-app
- 브라우저 캐시 클리어 후 확인

---

## 🐛 디버깅 가이드

### 콘솔 로그 활용

```typescript
// CSV 파싱 디버깅
console.log('CSV 파싱 결과:', results);
console.log('사용할 컬럼명:', { userIdColumn, updateCountColumn, e164Column, deletedColumn });

// 데이터 비교 디버깅
console.log('필터링된 유저들:', result.filtered_users);
console.log('전체 유저들:', result.all_users);

// 통계 계산 디버깅
console.log('한국 통계:', koreaStats);
console.log('미국 통계:', usaStats);
```

### 일반적인 문제 해결

#### 1. 컬럼 인식 실패
- **증상**: 데이터가 파싱되지 않음
- **해결**: 콘솔에서 `사용할 컬럼명` 로그 확인
- **조치**: `parseCSV` 함수의 컬럼 인식 패턴 추가

#### 2. 필터링 결과 없음
- **증상**: 조건에 맞는 유저가 없음
- **해결**: 콘솔에서 `필터링된 유저들` 로그 확인
- **조치**: 필터링 조건 및 데이터 형식 검증

#### 3. 통계 불일치
- **증상**: 국가별 통계 합계가 전체 통계와 다름
- **해결**: `all_users` vs `filtered_users` 사용 확인
- **조치**: 통계 계산 로직에서 `result.all_users` 사용

---

## 🔄 코드 수정 가이드

### 컬럼명 추가
```typescript
// parseCSV 함수에서 새로운 컬럼명 패턴 추가
const userIdColumn = headers.find(h => 
  h.toLowerCase().includes('user') && h.toLowerCase().includes('id')
) || headers.find(h => h.toLowerCase().includes('user')) 
|| headers.find(h => h.toLowerCase().includes('id'))
|| headers.find(h => h.toLowerCase().includes('member')) // 새 패턴 추가
|| 'user_id';
```

### 필터링 조건 수정
```typescript
// compareData 함수에서 조건 수정
const filteredUsers = allUsers.filter(user => {
  const yesterdayCount = user.yesterday_count;
  const isNewUser = yesterdayCount === 0;
  
  // 조건 수정 예시: 4회 이상으로 변경
  return (yesterdayCount <= 2 || isNewUser) && user.update_count >= 4 && !user.deleted;
});
```

### 새로운 국가 코드 추가
```typescript
// getCountryFromE164 함수에서 새 국가 추가
const getCountryFromE164 = (e164: string): string => {
  if (!e164) return '';
  const cleanNumber = e164.replace(/[^\d+]/g, '');
  if (cleanNumber.startsWith('+1')) return '미국';
  if (cleanNumber.startsWith('+82')) return '한국';
  if (cleanNumber.startsWith('+86')) return '중국'; // 새 국가 추가
  return '기타';
};
```

---

## 📚 참고 자료

### 외부 라이브러리 문서
- [PapaParse 공식 문서](https://www.papaparse.com/)
- [React 공식 문서](https://react.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)

### GitHub Pages 배포
- [GitHub Pages 가이드](https://pages.github.com/)
- [gh-pages 패키지](https://www.npmjs.com/package/gh-pages)

---

## 📞 개발팀 연락처

- **기술 문의**: 개발팀
- **이슈 리포트**: GitHub Issues
- **코드 리뷰**: Pull Request

---

**문서 승인**:  
- 시니어 개발자: [승인 대기]  
- 기술 리드: [승인 대기]  
- 최종 승인일: [승인 대기]
