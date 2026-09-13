# 프로젝트 컨텍스트 
영화 감상평을 작성하고 조회할 수 있는 서비스 


## 기술스택
- Next.js, TypeScript
- Tailwind CSS 
- Supabase (Auth / Database / Storage)
- 테스트 : Jest + Testing Library 
- FE 단일 프로젝트

## 주요 기능
- 로그인 / 회원가입
- 감상평 작성
- 감상평 조회
- 감상평 수정

## 작업 수행 룰 
1. 각 기능의 디자인은 아래 작성한 와이어프레임을 참고해서 진행해줘. 
메인화면구성 : @wireframe/화면 구성_감상평 조회.png
감성평 작성 : @wireframe/화면 구성_감상평_작성.png
감상평 조회 :  @wireframe/화면 구성_감상평 조회.png, @화면 구성_감상평_표시.png
감상평 수정 : @wireframe/화면 구성_감상평_표시.png, @화면 구성_감상평_작성.png

2. @PRD.md를 참고해서 프로젝트에 대한 기본 정보를 인식해. 
3. 각 기능은 아래 작성한 기능 명세를 참고해서 진행해줘. 
SDD 폴더 하위에 있어.
로그인/회원가입 : @SDD/로그인기능명세.md
감상평 작성 : @SDD/감상평작성기능명세.md
감상평 조회 : @SDD/감상평조회기능명세.md
감상평 수정 : @SDD/감상평수정기능명세.md
4. 워크플로우는 @SDD/워크플로우.md를 참고해줘.
5. 네트워크(외부 API 연동, 인증서, 프록시 등) 관련 설정을 변경하거나 새로 추가할 때는
반드시 @networkSetting/네트워크연결설정.md를 먼저 참고하고, 변경 내용이 있으면 그 문서도 함께 갱신해줘.

## 코딩 컨벤션
- 함수는 Arrow Function 대신 Name Function을 사용. 
- 에러는 반드시 컨스텀 에러 클래스로 처리
- 함수명/변수명은 코드 표준 준수


## 커밋규칙 
- Conventioanl Commits 형식 필수(feat/fix/docs/refactor/test)
- PR 제목도 동일한 형식 적용 

## 금지사항
.env는 절대 커밋 금지

## 언어 및 커뮤니케이션 규칙 
- 기본 응답 언어 : 한국어 
- 코드 주석 : 한국어
- 커밋 메시지 : 한국어 
- 문서화 : 한국어 

## TMDB API 
- API Read Access Token / API Key는 `.env.local`에 보관 (TMDB_API_ACCESS_TOKEN, TMDB_API_KEY)

## Supabase
- Auth: 이메일/비밀번호 로그인만 지원. 감상평은 로그인한 사용자 본인 것만 조회/작성/수정/삭제 가능(RLS)
- DB: reviews 테이블(복합 PK user_id+id), RLS로 사용자별 데이터 격리
- Storage: review-images 버킷(비공개)에 이미지 저장, DB에는 경로만 저장, 조회 시 서버가 signed URL 발급
- 환경변수: SUPABASE_URL / SUPABASE_API_KEY / SUPABASE_SECRET_KEY(`.env.local`, 서버 전용) + NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY(브라우저 노출용). SUPABASE_SECRET_KEY는 절대 NEXT_PUBLIC_ 접두사를 붙이지 않는다.