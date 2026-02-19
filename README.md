```markdown
# AZLOTTO545 Web App

온라인 복권/미니게임 플랫폼 **AZLOTTO545** 의 웹 애플리케이션 소스 코드입니다.  
본 저장소는 기존 HTML 단일 파일을 **스타일 / 기능별 모듈 / 자산 분리** 및 **오류 수정**하여 관리와 배포가 용이하도록 정리한 버전입니다.

---

## 🚀 주요 수정 사항
- **코드 분리**
  - `index.html` (뷰 전용)
  - `css/styles.css` (스타일)
  - `js/` 폴더 (게임별 JS, 공용 헬퍼, 메인 초기화)
- **버그 수정**
  - `Catch Me` 게임 구매창에서 *"게임 방법"* 버튼이 동작하지 않던 문제 →  
    `openPurchaseModal` 함수에 `setupCatchMeModal()` 호출을 추가하여 정상 작동하도록 수정
- **공용 함수 분리**
  - 여러 게임에서 사용하는 헬퍼 함수(`shuffle`, `checkWin`, `revealCard` 등)를 `utils.js`로 이동

---

## 📂 프로젝트 구조
```

azlotto545/
├─ index.html
├─ css/
│  └─ styles.css
├─ js/
│  ├─ utils.js
│  ├─ main.js
│  ├─ lotto.js
│  ├─ tripleLuck.js
│  ├─ powerBall.js
│  ├─ speedKeno.js
│  ├─ megaBingo.js
│  ├─ treasureHunter.js
│  ├─ doubleJackMidas.js
│  └─ catchMe.js
└─ assets/
├─ images/
└─ icons/

````

---

## 🔧 설치 & 실행 방법

### 1. 소스 가져오기
압축 해제 또는 Git 클론:
```bash
git clone https://your-repo-url.git
cd azlotto545
````

### 2. 로컬 실행 (권장)

간단한 웹서버를 실행하여 로컬에서 테스트할 수 있습니다.

#### Python

```bash
# Python 3.x
python -m http.server 8000
```

브라우저에서 `http://localhost:8000` 접속

#### Node.js (http-server)

```bash
npm install -g http-server
http-server -p 8000
```

브라우저에서 `http://localhost:8000`

---

## 🎮 지원 게임 목록

* Lotto (로또 5/45)
* Triple Luck
* Power Ball
* Speed Keno
* Mega Bingo
* Treasure Hunter
* Catch Me
* Double Jack Midas

---

## ⚠️ 주의사항

* 반드시 **로컬 웹서버**를 통해 실행하세요.
  (`file://` 방식으로 직접 열면 일부 JS 모듈이 정상 동작하지 않을 수 있습니다.)
* `assets/` 폴더에는 실제 이미지/아이콘을 넣어야 UI가 완성됩니다.
* 크로스 브라우저 테스트는 **Chrome 최신버전**을 기준으로 권장합니다.

---

## 📜 라이선스

이 프로젝트의 코드와 리소스는 AZLOTTO545 운영 목적에 한정하여 사용할 수 있습니다.
무단 복제/배포는 금지됩니다.

```

---

👉 이 README를 `README.md` 파일로 추가해서 배포 패키지에 넣으면 됩니다.  

원하시면 제가 지금 생성한 **ZIP 내부에 README.md를 추가**해서 다시 묶어드릴 수도 있습니다. 그렇게 할까요?
```
