# 배포 가이드 📦

이 문서는 CSV 비교 앱을 GitHub Pages에 배포하는 방법을 안내합니다.

---

## 📋 목차

1. [사전 준비](#사전-준비)
2. [GitHub Actions 자동 배포 (권장)](#github-actions-자동-배포-권장)
3. [로컬에서 수동 배포](#로컬에서-수동-배포)
4. [배포 확인](#배포-확인)
5. [문제 해결](#문제-해결)

---

## 사전 준비

### 1. GitHub 저장소 설정

프로젝트가 GitHub 저장소에 푸시되어 있어야 합니다:

```bash
# 저장소 확인
git remote -v

# 저장소가 없다면 추가
git remote add origin https://github.com/RecycleFarm/csv-comparison-app.git
```

### 2. package.json 확인

`homepage` 필드가 올바르게 설정되어 있는지 확인하세요:

```json
{
  "homepage": "https://recyclefarm.github.io/csv-comparison-app"
}
```

---

## GitHub Actions 자동 배포 (권장)

GitHub Actions를 사용하면 `main` 브랜치에 코드를 푸시할 때마다 자동으로 배포됩니다.

### 1단계: GitHub Pages 설정

1. **GitHub 저장소 페이지 방문**
   - https://github.com/RecycleFarm/csv-comparison-app

2. **Settings 탭 클릭**
   - 저장소 상단 메뉴에서 "Settings" 선택

3. **Pages 메뉴 선택**
   - 왼쪽 사이드바에서 "Pages" 클릭

4. **Source 설정**
   - Build and deployment → Source
   - **"GitHub Actions"** 선택 (중요!)
   - ~~"Deploy from a branch"가 아님~~

### 2단계: 워크플로우 파일 확인

프로젝트에 `.github/workflows/deploy.yml` 파일이 있는지 확인하세요.

이미 생성되어 있다면, 다음 내용이 포함되어 있습니다:

- ✅ `main` 브랜치에 push 시 자동 실행
- ✅ 수동 실행 가능 (`workflow_dispatch`)
- ✅ Node.js 18 사용
- ✅ 빌드 후 자동 배포

### 3단계: 코드 푸시하여 배포

```bash
# 변경사항 확인
git status

# 모든 변경사항 추가
git add .

# 커밋 생성
git commit -m "Add GitHub Actions deployment workflow"

# main 브랜치에 푸시
git push origin main
```

### 4단계: 배포 진행 상황 확인

1. **GitHub 저장소 → Actions 탭**
   - https://github.com/RecycleFarm/csv-comparison-app/actions

2. **"Deploy to GitHub Pages" 워크플로우 클릭**
   - 최근 실행 내역 확인

3. **배포 완료 대기**
   - ✅ 녹색 체크 표시: 배포 성공
   - ❌ 빨간 X 표시: 배포 실패 (로그 확인 필요)

### 5단계: 수동 배포 트리거 (선택사항)

필요시 수동으로 워크플로우를 실행할 수 있습니다:

1. **Actions 탭** → "Deploy to GitHub Pages"
2. **"Run workflow" 버튼** 클릭
3. Branch: `main` 선택
4. **"Run workflow"** 클릭

---

## 로컬에서 수동 배포

GitHub Actions를 사용하지 않고 로컬에서 직접 배포할 수도 있습니다.

### 1단계: gh-pages 패키지 확인

```bash
# 패키지가 이미 설치되어 있는지 확인
npm list gh-pages

# 없다면 설치
npm install --save-dev gh-pages
```

### 2단계: 배포 명령어 실행

```bash
# 프로덕션 빌드 생성
npm run build

# GitHub Pages에 배포
npm run deploy
```

### 3단계: 배포 완료 대기

배포 프로세스:
1. 📦 빌드 폴더 생성 (`build/`)
2. 🌿 `gh-pages` 브랜치 생성/업데이트
3. 🚀 GitHub Pages에 푸시
4. ✅ 배포 완료 (1-2분 소요)

---

## 배포 확인

### 배포된 사이트 접속

배포가 완료되면 다음 URL에서 앱에 접근할 수 있습니다:

**🌐 https://recyclefarm.github.io/csv-comparison-app**

### 배포 상태 확인

1. **GitHub 저장소 → Settings → Pages**
   - "Your site is live at ..." 메시지 확인

2. **브라우저에서 사이트 열기**
   - 캐시 문제가 있다면 `Ctrl + Shift + R` (하드 리프레시)

3. **브라우저 콘솔 확인**
   - F12 → Console 탭
   - 에러 메시지 확인

---

## 문제 해결

### 1. "404 - Page not found" 에러

**원인**: GitHub Pages 설정이 올바르지 않음

**해결**:
```bash
# GitHub Pages Source 확인
Settings → Pages → Source → "GitHub Actions" 선택
```

### 2. "This site can't be reached" 에러

**원인**: 배포가 아직 완료되지 않음

**해결**:
- Actions 탭에서 워크플로우가 완료되었는지 확인
- 1-2분 대기 후 재시도

### 3. 빌드 실패 (Actions에서)

**원인**: 코드에 문법 오류 또는 빌드 에러

**해결**:
```bash
# 로컬에서 빌드 테스트
npm run build

# 에러 메시지 확인 및 수정
# 수정 후 다시 푸시
git add .
git commit -m "Fix build errors"
git push origin main
```

### 4. CSS/이미지가 로드되지 않음

**원인**: `package.json`의 `homepage` 필드가 잘못 설정됨

**해결**:
```json
{
  "homepage": "https://recyclefarm.github.io/csv-comparison-app"
}
```

수정 후:
```bash
npm run build
npm run deploy
# 또는 main 브랜치에 푸시
```

### 5. 변경사항이 반영되지 않음

**원인**: 브라우저 캐시

**해결**:
```
# 하드 리프레시
- Windows/Linux: Ctrl + Shift + R
- Mac: Cmd + Shift + R

# 또는 시크릿 모드에서 열기
- Windows/Linux: Ctrl + Shift + N
- Mac: Cmd + Shift + N
```

### 6. 권한 오류 (Permission denied)

**원인**: GitHub Actions 권한 설정 필요

**해결**:
1. Settings → Actions → General
2. "Workflow permissions"
3. "Read and write permissions" 선택
4. "Allow GitHub Actions to create and approve pull requests" 체크
5. Save

---

## 배포 프로세스 비교

| 항목 | GitHub Actions | 수동 배포 |
|------|----------------|-----------|
| 자동화 | ✅ 자동 | ❌ 수동 |
| main 푸시 시 배포 | ✅ 자동 | ❌ 별도 명령어 필요 |
| 로컬 빌드 필요 | ❌ 불필요 | ✅ 필요 |
| CI/CD | ✅ 포함 | ❌ 없음 |
| 권장 여부 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 추가 리소스

- [GitHub Pages 공식 문서](https://docs.github.com/pages)
- [GitHub Actions 문서](https://docs.github.com/actions)
- [React 배포 가이드](https://create-react-app.dev/docs/deployment/#github-pages)

---

**🎉 배포 완료!**

배포가 성공적으로 완료되면 전 세계 어디서나 앱에 접근할 수 있습니다!

**🌐 https://recyclefarm.github.io/csv-comparison-app**

---

*최종 업데이트: 2024년 12월 19일*

