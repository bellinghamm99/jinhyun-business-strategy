# Hwang Jinhyun — Business Strategy & Planning portfolio

본 사이트는 기존 게임 포트폴리오와 **완전히 독립된 두 번째 웹사이트**입니다. 기존 저장소·파일을 변경하지 않습니다.

## 1. 먼저 공개용 문서 복사 (중요)

압축 파일에는 의도적으로 회사 원본 작업물과 이력서 PDF를 포함하지 않았습니다. 이 작업 환경에서 접근 가능한 구버전과 사용자가 이미 민감 정보를 삭제한 최신 원본이 일치하지 않기 때문입니다. 비공개 정보를 다시 공개하는 사고를 막기 위해서입니다.

1. 기존에 GitHub에 공개한 **최종 가공 완료** 포트폴리오를 PC에 준비합니다.
   - `hwang-jinhyun-portfolio/index.html` 및 `assets/work` 폴더가 있어야 합니다.
2. 이 폴더의 `01_COPY_APPROVED_FILES.bat`를 더블클릭합니다.
3. 폴더 선택 창에서 **기존에 공개한 최종 포트폴리오 폴더**를 선택합니다.
4. 사이트에 필요한 공개 승인된 실제 작업물 20개와 이력서 2개가 새 사이트에 복사됩니다. 작업물 미리보기 이미지는 기본적으로 공개용 표지 이미지를 사용합니다.
5. `assets/work`에 문서가 들어갔는지 확인한 뒤 GitHub에 올립니다.

**기존 사이트를 직접 수정하는 작업이 아닙니다.** 필요한 파일만 새 폴더로 복사합니다. 서로 독립적으로 업데이트할 수 있습니다.

## 2. 로컬 확인

`index.html`을 브라우저로 열어 MAIN·CAREER·PROJECTS·CONTACT, 문서 열기/다운로드 기능을 점검합니다.

Windows에 Python이 설치되어 있으면 `python tools/validate_public_assets.py`로 22개 필수 파일 경로를 확인할 수 있습니다. 내용의 비공개 정보 제거 여부는 스크립트로 판단할 수 없습니다.

## 3. GitHub에 별도 게시

1. GitHub에서 **새 Public 저장소** `jinhyun-business-strategy`를 생성합니다. 기존 `jinhyun-portfolio` 저장소는 건드리지 않습니다.
2. GitHub Desktop: `File → Clone repository`에서 새 저장소를 복제합니다.
3. 이 사이트 폴더 안의 파일과 폴더를 새 저장소 로컬 폴더 **최상위**에 복사합니다 (`index.html`이 최상위).
4. GitHub Desktop: `Commit to main` → `Push origin` 순서로 업로드합니다. 파일이 커서 웹 업로드가 실패할 때 Desktop 방식이 적합합니다.
5. 새 저장소 웹페이지의 `Settings → Pages → Build and deployment → Source`에서 **GitHub Actions**를 선택합니다.
6. `Actions → Publish Portfolio → Run workflow → Run workflow`를 누릅니다. Actions가 성공한 후 Pages에서 사이트 주소가 나타납니다.
7. 공개 주소 형식: `https://<github-id>.github.io/jinhyun-business-strategy/`

이 저장소의 `.github/workflows/pages.yml`은 **수동 실행**이며, 공개용 필수 파일이 누락되면 배포 실패하게 설정했습니다.

## 4. 콘텐츠 편집

- 소개·경력·프로젝트 정보: `data.js`
- 홈 화면/푸터/전략 프레임워크 문구: `index.html`
- 대표 작업물 설명/노출 여부: `work-catalog.json` (변경 후 `python tools/build_gallery.py`로 작업물 목록 갱신)
- 대표 작업물 원본: `assets/work/<project>/...`
- 프로젝트 카드 이미지: `assets/projects/`
- 색상·레이아웃: `style.css`
- 상세 팝업: `app.js`

## 5. 정확성·자료 공개 원칙

- 웹툰 업계 실무 경험이나 전략 컨설팅 회사 경력은 기재하지 않았습니다.
- 모든 프로젝트 문구는 이력서·기존 작업물에 근거한 작업 범위를 기준으로 표현했습니다.
- Business Impact는 결과가 검증되지 않은 경우 사업적 기여·의사결정 지원 수준으로 표현했습니다.
- 기존 웹사이트에 공개 승인된 자료만 새 저장소에 복사하세요. Public Git 기록에 업로드된 파일은 나중에 삭제해도 이전 커밋에 남을 수 있습니다.
