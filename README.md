# 자기소개 포트폴리오 웹사이트

순수 HTML/CSS/JavaScript로 제작한 반응형 자기소개 포트폴리오 페이지입니다.
GitHub API를 연동해 실제 저장소 목록을 동적으로 불러오며, 다크모드·햄버거 메뉴·스크롤 인터랙션·폼 유효성 검사 등을 직접 구현했습니다.

## 배포 URL

- https://nahyun2.github.io/codb1-1/

## 기술 스택

- HTML5 (시맨틱 마크업)
- CSS3 (변수, Flexbox, Grid, 반응형 미디어 쿼리)
- JavaScript (ES6+, DOM 조작, `fetch`/`async-await`)
- GitHub REST API (`/users/{username}/repos`)
- 외부 라이브러리 없이 순수 구현

## 폴더 구조

```
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── images/
│   ├── profile.jpg
│   └── travel/
│       └── travel-1.jpg ~ travel-6.jpg
└── README.md
```

## 주요 기능

- **반응형 레이아웃**: 모바일 퍼스트로 작성, 768px(태블릿)/1024px(데스크톱) 브레이크포인트 적용
- **다크모드 토글**: `data-theme` 속성 전환 + `localStorage` 저장으로 새로고침 후에도 유지
- **햄버거 메뉴**: 모바일에서 `classList.toggle('active')`로 메뉴 열고 닫기
- **부드러운 스크롤**: 네비게이션 클릭 시 `scrollIntoView({ behavior: 'smooth' })`로 해당 섹션 이동
- **스크롤 인터랙션**
  - 스크롤 60px 이상 → 헤더 배경 변경
  - 스크롤 300px 이상 → Top 버튼 노출, 클릭 시 최상단으로 이동
- **Intersection Observer 스크롤 애니메이션**: threshold 0.2 기준으로 섹션이 화면에 들어오면 페이드인
- **GitHub API 연동 (Projects)**: `fetch` + `async/await`로 저장소 목록을 가져와 최신 업데이트순으로 정렬 후 6개만 렌더링(포크 제외). 로딩/성공/에러(403 레이트리밋 포함)/빈 상태를 UI로 표현
- **Contact 폼 유효성 검사**: 필수값 검증, 이메일 형식 검증, 실시간 에러 메시지, 제출 시 `preventDefault()` + 성공 메시지 표시

## 인터랙션 기준값

| 기준값 | 값 |
|---|---|
| 네비게이션 배경 변경 스크롤 위치 | 60px |
| Top 버튼 노출 스크롤 위치 | 300px |
| Intersection Observer threshold | 0.2 |

## 실행 방법

1. 저장소를 클론합니다.
2. VS Code에서 열고 Live Server 확장으로 `index.html`을 실행합니다.
3. 로컬 서버 주소(예: `http://127.0.0.1:5370`)로 접속합니다.

## 스크린샷

데스크톱 hero
<img width="1599" height="861" alt="스크린샷 2026-09-24 오전 6 10 37" src="https://github.com/user-attachments/assets/7155a4b9-589b-473e-8262-e01c41b4e7ca" />
다크모드 skills/projects
<img width="1600" height="856" alt="스크린샷 2026-09-24 오전 6 11 17" src="https://github.com/user-attachments/assets/8a47a106-85a6-4591-af8a-241044337cc9" />
모바일 contact
<img width="487" height="704" alt="스크린샷 2026-09-24 오전 6 12 00" src="https://github.com/user-attachments/assets/bfca33ac-804a-4007-b646-af1d0336776d" />
