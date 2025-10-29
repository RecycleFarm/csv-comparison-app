# CSV 비교 앱 📊

**어제와 오늘의 CSV 파일을 비교하여 업데이트 횟수가 3회 이상 증가한 유저를 식별하는 웹 애플리케이션**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://recyclefarm.github.io/csv-comparison-app)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🚀 라이브 데모

**👉 [https://recyclefarm.github.io/csv-comparison-app](https://recyclefarm.github.io/csv-comparison-app)**

---

## 📋 주요 기능

### ✨ 핵심 기능
- **📁 CSV 파일 비교**: 어제와 오늘의 CSV 파일을 업로드하여 비교
- **🎯 스마트 필터링**: 업데이트 횟수 3회 이상 증가한 유저 자동 식별
- **🌍 국가 자동 판별**: E164 전화번호 기반 국가 식별 (한국/미국/기타)
- **📊 통계 생성**: 업데이트 횟수별 유저 수 통계 (전체 + 국가별)
- **💾 CSV 다운로드**: 결과 데이터를 CSV 파일로 다운로드

### 🔍 필터링 조건
- **기존 유저**: 어제 0, 1, 2회 → 오늘 3회 이상
- **신규 유저**: 어제 없음 → 오늘 3회 이상
- **삭제 제외**: 삭제되지 않은 유저만 포함

### 🎨 사용자 경험
- **📱 반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **🎨 직관적 UI**: 드래그 앤 드롭 파일 업로드
- **⚡ 실시간 처리**: 브라우저에서 즉시 결과 확인
- **🔧 디버깅 지원**: 파싱 상태 및 컬럼 인식 결과 표시

---

## 🛠️ 기술 스택

### 프론트엔드
- **React 18.2.0** - UI 프레임워크
- **TypeScript 4.9.5** - 타입 안전성
- **PapaParse 5.4.1** - CSV 파싱 라이브러리
- **CSS3** - 스타일링 및 반응형 디자인

### 배포 및 호스팅
- **GitHub Pages** - 정적 웹 호스팅
- **GitHub Actions** - 자동 배포 (선택사항)

---

## 📊 데이터 형식

### 입력 CSV 파일

#### 필수 컬럼
| 컬럼명 | 설명 | 예시 |
|--------|------|------|
| `user_id` | 유저 고유 식별자 | `user123` |
| `사용횟수` | 업데이트 횟수 | `5` |

#### 선택적 컬럼
| 컬럼명 | 설명 | 예시 |
|--------|------|------|
| `e164` | 국제 전화번호 | `+821012345678` |
| `삭제` | 삭제 여부 | `false` |

### 출력 CSV 파일

#### 필터링된 유저 데이터
```csv
user_id,yesterday_count,today_count,difference,e164,country,deleted
user123,1,5,4,+821012345678,한국,false
user456,0,3,3,+12125551234,미국,false
```

#### 통계 데이터
```csv
=== 전체 통계 ===
count,yesterday_users,today_users
0,100,50
1,80,60
...

=== 한국 통계 ===
count,yesterday_users,today_users
0,50,25
1,40,30
...
```

---

## 🚀 빠른 시작

### 1. 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/RecycleFarm/csv-comparison-app.git
cd csv-comparison-app

# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

### 2. 빌드 및 배포

#### 방법 1: GitHub Actions 자동 배포 (권장)

1. **GitHub Pages 설정**
   - GitHub 저장소 → Settings → Pages
   - Source: "GitHub Actions" 선택

2. **자동 배포**
   - `main` 브랜치에 push하면 자동으로 배포됩니다
   - `.github/workflows/deploy.yml` 파일이 배포를 처리합니다

3. **수동 배포 트리거**
   - GitHub 저장소 → Actions → "Deploy to GitHub Pages" → "Run workflow"

#### 방법 2: 로컬에서 수동 배포

```bash
# 프로덕션 빌드
npm run build

# GitHub Pages 배포
npm run deploy
```

---

## 📖 사용법

### 1. 파일 업로드
- **어제 파일**: 기준이 되는 이전 날짜의 CSV 파일 업로드
- **오늘 파일**: 비교 대상인 현재 날짜의 CSV 파일 업로드

### 2. 데이터 비교
- **비교 버튼** 클릭하여 두 파일 비교 실행
- 결과는 화면에 즉시 표시됩니다

### 3. 결과 확인
- **필터링된 유저 목록**: 조건에 맞는 유저들 미리보기
- **통계 정보**: 업데이트 횟수별 유저 수 통계
- **디버깅 정보**: 파싱 상태 및 컬럼 인식 결과

### 4. 데이터 다운로드
- **필터링된 유저 CSV**: 조건에 맞는 유저들의 상세 정보
- **통계 CSV**: 전체 및 국가별 통계 데이터

---

## 🔧 동적 컬럼 인식

앱은 다양한 컬럼명을 자동으로 인식합니다:

### user_id 컬럼
- `user_id`, `userId`, `user`, `id` 등

### update_count 컬럼
- `사용횟수`, `update_count`, `count`, `usage`, `횟수` 등

### e164 컬럼
- `e164`, `phone`, `전화` 등

### deleted 컬럼
- `삭제`, `deleted`, `delete`, `remove` 등

---

## 🌍 국가 판별

E164 전화번호를 기반으로 자동 국가 판별:

- **`+1`** → 미국 🇺🇸
- **`+82`** → 한국 🇰🇷
- **기타** → 기타 국가 🌍

---

## 🐛 문제 해결

### 일반적인 문제

#### 1. 데이터가 파싱되지 않음
- **해결**: 브라우저 콘솔에서 `사용할 컬럼명` 로그 확인
- **조치**: CSV 파일의 컬럼명이 인식 패턴에 맞는지 확인

#### 2. 필터링 결과가 없음
- **해결**: 콘솔에서 `필터링된 유저들` 로그 확인
- **조치**: 데이터 형식 및 필터링 조건 검증

#### 3. 통계가 정확하지 않음
- **해결**: `all_users` vs `filtered_users` 사용 확인
- **조치**: 통계 계산 로직 검증

### 디버깅 팁
- **F12** → **Console 탭**에서 상세 로그 확인
- **Network 탭**에서 파일 업로드 상태 확인
- **브라우저 캐시 클리어** 후 재시도

---

## 📚 문서

- **[배포 가이드](DEPLOYMENT.md)** - GitHub Actions를 통한 자동 배포 설정
- **[PRD (제품 요구사항 문서)](PRD.md)** - 제품 기능 및 요구사항
- **[개발자 가이드](DEVELOPER_GUIDE.md)** - 개발 환경 설정 및 코드 가이드
- **[API 문서](API_DOCUMENTATION.md)** - 데이터 구조 및 함수 설명
- **[변경 로그](CHANGELOG.md)** - 버전별 변경사항

---

## 🤝 기여하기

### 버그 리포트
- [GitHub Issues](https://github.com/RecycleFarm/csv-comparison-app/issues)에서 버그 리포트
- 재현 단계와 예상 결과를 포함해주세요

### 기능 요청
- 새로운 기능 아이디어를 Issues에 제안해주세요
- 사용 사례와 우선순위를 명시해주세요

### 코드 기여
- Fork → Feature Branch → Pull Request
- TypeScript + React 베스트 프랙티스 준수

---

## 📄 라이선스

이 프로젝트는 **MIT License** 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 📞 지원

- **기술 지원**: [GitHub Issues](https://github.com/RecycleFarm/csv-comparison-app/issues)
- **일반 문의**: 개발팀
- **라이브 데모**: [https://recyclefarm.github.io/csv-comparison-app](https://recyclefarm.github.io/csv-comparison-app)

---

## 🏆 주요 특징

- ✅ **무료 사용**: GitHub Pages로 무료 호스팅
- ✅ **오프라인 작동**: 서버 없이 브라우저에서 모든 처리
- ✅ **데이터 보안**: 파일이 서버로 전송되지 않음
- ✅ **빠른 처리**: 클라이언트 사이드에서 즉시 결과 확인
- ✅ **유연한 형식**: 다양한 CSV 컬럼명 자동 인식

---

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!**

---

*최종 업데이트: 2024년 12월 19일*