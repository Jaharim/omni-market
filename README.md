<div align='center'>
    <h1><b>옴니마켓</b></h1>
		<img src="https://github.com/Jaharim/omni-market/assets/83650872/255740af-4f1a-4b1e-8554-eb0ef4ac9592" />
    <br/>
		<br/>
		<h3><b>세상의 모든 물건이 한 곳에</b></h3>
  <p>"옴니마켓"은 구매자와 판매자가 물건을 자유롭게 사고 팔 수 있는 커머스 사이트입니다.</p>
  		<br/>

</div>

<br />

> 🗝️ **옴니마켓 배포 링크 및 테스트 계정**

👉 [옴니마켓](https://jaharim.github.io/omni-market/)

```md
구매자
ID: buyersonny
PW: 1q2w3e4r!

판매자
ID: sellersonny
PW: 1q2w3e4r!

* 회원 가입도 가능합니다.
```

<br />

## 📢 **1. 서비스 소개**

**"옴니마켓"** 은 구매자와 판매자가 물건을 자유롭게 사고 팔 수 있는 커머스 사이트입니다.

이 프로젝트는 구매자가 상품을 검색하고, 장바구니에 저장하거나 구매할 수 있는 기능을 제공합니다. 또한 주문 내역을 확인할 수 있습니다.

판매자는 상품을 등록하고, 수정, 삭제 등의 상품 관리를 할 수 있습니다.

<br />
<br />

## ⚙️ **2. 기술 스택**
  - FrontEnd
    
  |기술 스택|선택한 이유|
  |------|------|
  | React.js |모듈화된 UI 컴포넌트를 만들고, 데이터와 상태를 효율적으로 관리하여 코드의 재사용성과 유지보수성을 향상시키기 위해 선택했습니다.|
  | React-Query v5 |데이터 요청 및 캐싱, 상태 관리를 효율적으로 처리하고, 비동기 데이터 로딩 및 오류 처리를 간소화하여 사용자 경험을 향상시킬 수 있는 장점이 있어 선택했습니다.|
  | TypeScript |타입 에러를 사전에 방지하여 코드의 안정성을 높이기 위해 선택했습니다.|
  |React-Hook-Form, Zod|간편한 폼 관리와 타입 안전성과 강력한 스키마 기반 유효성 검사 구현을 위해 선택했습니다.|

<br />

  - BackEnd 및 DataBase
    
    - weniv 제공

<br />
<br />

## ✴️ **3. 주요 기능 소개**
### 1) 메인 페이지
![메인페이지](https://github.com/Jaharim/omni-market/assets/83650872/688fe9ef-b0b9-46ef-aa1f-cbbb96dd8d1b)  

<br />

  - 메인 페이지 페이지네이션
    
    |초기 페이지네이션|5페이지 이상 페이지가 있을 때|
    |-|-|
    |![초기 페이지네이션](https://github.com/Jaharim/omni-market/assets/83650872/8088f9f7-bd14-4b83-9311-4c92c7ac5d3a)|![6페이지 이상 페이지가 있을 때](https://github.com/Jaharim/omni-market/assets/83650872/2a945f77-b93f-4179-95df-d99a39888f76)|

<br />

  - 상품 검색 기능
    
    - 검색한 상품이 없을 때
      
      |상품 검색|검색 결과|
      |-|-|
      |![상품 검색](https://github.com/Jaharim/omni-market/assets/83650872/de6db406-7a14-4334-9d75-cae6a85d8767)|![검색 결과](https://github.com/Jaharim/omni-market/assets/83650872/723e7e6d-027c-4a3f-aa87-98ef0683ef66)|
    
    <br />

    - 검색한 상품이 있 때
    
      |상품 검색|검색 결과|
      |-|-|
      |![상품 검색](https://github.com/Jaharim/omni-market/assets/83650872/a1445da6-3c81-4ba8-866d-ed0ba88783d2)|![검색 결과](https://github.com/Jaharim/omni-market/assets/83650872/76f9ff12-b39f-40c4-9c58-fc9033d0a3ff)|


<br />
<br />

### 2) 로그인 및 회원가입

- 로그인 페이지

  |구매자 로그인|판매자 로그인|
  |--|--|
  |![구매자로그인페이지](https://github.com/Jaharim/omni-market/assets/83650872/05b1cd9b-3535-425e-94a8-99ad0c99383e)|![판매로그인페이지](https://github.com/Jaharim/omni-market/assets/83650872/baeca3db-17b1-4411-9900-86d79b3c62d4)|  

  - 유효성 검사  

    - 아이디 또는 비밀번호가 일치하지 않을 때  

    ![로그인페이지_입력값 오류](https://github.com/Jaharim/omni-market/assets/83650872/9cf514c6-a53f-40d5-a202-27e244a63187)
   
        
      <br />
      <br />

- 회원가입 페이지

  |구매자 회원가입|판매자 회원가입|
  |--|--|
  |![구매자회원가입페이지](https://github.com/Jaharim/omni-market/assets/83650872/6654bd07-6288-471e-a28e-c17e88fbaeed)|![판매자회원가입페이지](https://github.com/Jaharim/omni-market/assets/83650872/5d27db66-fa60-4f4f-8a47-461ad976086a)|  

  - 회원가입 완료 시
 
    ![회원가입 완료 시](https://github.com/Jaharim/omni-market/assets/83650872/a9b6dca4-ecca-4455-99e8-9eca598cfe55)

  <br />

  - 유효성 검사  

    - 아이디 중복검사

      |사용 가능한 아이디일 때|이미 가입된 아이디일 때|
      |-|-|
      |![사용 가능한 아이디](https://github.com/Jaharim/omni-market/assets/83650872/b2483658-a226-4235-b9a0-7452459a8a8b)|![이미 가입된 아이디일 때](https://github.com/Jaharim/omni-market/assets/83650872/0e0ba80f-b481-405f-8898-9eaef8c5fad8)|

    <br />
    
    - 비밀번호 입력 확인
   
      |비밀번호 확인이 일치할 때|비밀번호 확인이 일치하지 않을 때|
      |---|---|
      |![비밀번호 확인이 일치할 때](https://github.com/Jaharim/omni-market/assets/83650872/fff7e7a8-63f6-4f08-8356-81e9d5d51fe5)|![비밀번호 확인이 일치하지 않을 때](https://github.com/Jaharim/omni-market/assets/83650872/4510b102-5b47-4f87-b998-47470417f34b)|

    <br />
    
    - 판매자 회원가입일 경우 사업자등록번호 인증
   
      |사용 가능한 사업자등록번호일 때|사용 불가능한 사업자등록번호일 때|
      |---|---|
      |![사용 가능한 사업자등록번호일 때](https://github.com/Jaharim/omni-market/assets/83650872/ba9981f4-37f7-4a7b-b0f0-1f22360d7c6b)|![사용 불가능한 사업자등록번호일 때](https://github.com/Jaharim/omni-market/assets/83650872/487f9789-4808-4455-8525-7f0129aff3cc)|

    <br />
    
    - 구매자 회원가입 전체 입력값 유효성 검사
   
      |모든 입력이 유효할 떄|유효하지 않은 입력이 있을 때|
      |---|---|
      |![모든 입력이 유효할 떄](https://github.com/Jaharim/omni-market/assets/83650872/b2f82e95-b10b-4c71-bbab-658a7ccb3593)|![유효하지 않은 입력이 있을 때](https://github.com/Jaharim/omni-market/assets/83650872/3318ae07-831f-430e-a05f-7f5cca6d776c)|

    <br />
    
    - 판매 회원가입 전체 입력값 유효성 검사
   
      |모든 입력이 유효할 떄|유효하지 않은 입력이 있을 때|
      |---|---|
      |![모든 입력이 유효할 떄](https://github.com/Jaharim/omni-market/assets/83650872/5fada755-225e-4520-90c3-61cd21d9c82c)|![유효하지 않은 입력이 있을 때](https://github.com/Jaharim/omni-market/assets/83650872/a17e8335-b642-4c63-b678-1ee5b9c41f08)|

<br />

<!-- Top Button -->
<p style='background: black; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-left: auto;'><a href="#top" style='color: white; '>▲</a></p>

<br />
  
### 3) 구매자

- 메인 페이지

  - 로그인 타입에 따른 네비게이션 바 변화 

    |구매자 메인 페이지|구매자 로그인 시 네비게이션 바 변경|
    |-|-|
    |![구매자 메인](https://github.com/Jaharim/omni-market/assets/83650872/5e67de84-17c4-4820-b05f-2ea994b2644d)|![구매자 로그인_네비게이션바](https://github.com/Jaharim/omni-market/assets/83650872/e2669388-afe8-44ee-8c85-b89d60d2bea7)|
  
<br />

- 상품 상세 페이지

  |상품 상세 페이지 초기 화면|상품의 개수를 변경했을 때|바로구매 버튼을 눌렀을 때|장바구니 버튼을 눌렀을 때|
  |-|-|-|-|
  |![상품 상세 페이지 초기 화면](https://github.com/Jaharim/omni-market/assets/83650872/18930637-2a39-437f-8c0c-0bb8d8aaaea9)|![상품의 개수를 변경했을 때](https://github.com/Jaharim/omni-market/assets/83650872/35eaf32c-8dd5-4614-8357-cc5935292e5f)|![바로구매 버튼을 눌렀을 때](https://github.com/Jaharim/omni-market/assets/83650872/a88873d4-460c-497c-b1cd-d1f5f578c903)|![장바구니 버튼을 눌렀을 때](https://github.com/Jaharim/omni-market/assets/83650872/6459a187-62cf-4650-a90e-eff400e4a5bc)|

<br />

- 장바구니 페이지  

    |장바구니에 담은 상품이 없을 때|장바구니에 상품이 있을 때|
    |--|--|
    |![장바구니에 담은 상품이 없을 때](https://github.com/Jaharim/omni-market/assets/83650872/5b034a73-efa2-4c93-b94b-17b70b7b51db)|![장바구니에 상품이 있을 때](https://github.com/Jaharim/omni-market/assets/83650872/ec7e6245-d4bb-402c-adcf-4fa7e998d3b8)|

    <br />
    
    |장바구니 전체 주문하기를 눌렀을 때|장바구니 개별 상품의 주문하기를 눌렀을 때|
    |-|-|
    |![장바구니 전체 주문하기를 눌렀을 때](https://github.com/Jaharim/omni-market/assets/83650872/e005d3ce-473d-42b9-8206-ea17e010ca96)|![바로구매 버튼을 눌렀을 때](https://github.com/Jaharim/omni-market/assets/83650872/a88873d4-460c-497c-b1cd-d1f5f578c903)|

    <br />

    #### 장바구니 삼품을 삭제, 수량 변경 및 선택 시 결제 금액 상세 변화
    https://github.com/Jaharim/omni-market/assets/83650872/2fc6059e-aec6-4195-a5f7-7a3b6b3998b9
    
<br />

- 주문/결제 페이지

    |정보 입력 전|정보 입력|주문 완료|
    |--|--|--|
    |![스크린샷 2024-05-29 204126](https://github.com/Jaharim/omni-market/assets/83650872/4beea7e2-ac91-4eef-8a5a-8a6de94c4054)|![스크린샷 2024-05-29 204222](https://github.com/Jaharim/omni-market/assets/83650872/36142f22-f535-4be5-af4c-bb10db5b1df0)|![주문 완료](https://github.com/Jaharim/omni-market/assets/83650872/0a140e9d-8174-4da4-9016-c999209be9b7)|

  <br />
  
  - 유효성 검사
    
    ![image](https://github.com/Jaharim/omni-market/assets/83650872/1f9a7771-30fe-4c92-831a-5f4367fe23c8)

<br />

- 마이 페이지

    - 주문목록
      
      |주문 수가 15개 이하일 때|주문 수가 16개 이상일 때|
      |-|-|
      |![마이페이지 주문 수가 15개 이하일 때](https://github.com/Jaharim/omni-market/assets/83650872/2fbe6285-6a26-42af-8787-2a72e79a5aa9)|![주문 수가 16개 이상일 때](https://github.com/Jaharim/omni-market/assets/83650872/6edd9697-a5e2-4cd3-bb9b-f18ce5f9f8a1)|

    <br />
    
    - 주문목록 상세
      
      |주문한 상품이 2개 이하일 때|주문한 상품이 3개 이상일 때|
      |-|-|
      |![주문한 상품이 2개 이하일 때](https://github.com/Jaharim/omni-market/assets/83650872/b022732c-c4c9-435a-b520-45da38e80a49)|![주문한 상품이 3개 이일 때](https://github.com/Jaharim/omni-market/assets/83650872/41662371-72d0-4bd8-a585-1546237204cc)|
  
  <br />

  <!-- Top Button -->
<p style='background: black; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-left: auto;'><a href="#top" style='color: white; '>▲</a></p>

<br />

### 4) 판매자

- 메인 페이지

  - 로그인 타입에 따른 네비게이션 바 변화 

    |판매자 메인 페이지|판매자 로그인 시 네비게이션 바 변경|
    |-|-|
    |![판매자 메인 페이지](https://github.com/Jaharim/omni-market/assets/83650872/6bb3914c-5cab-4e82-87a2-11f85188a2dc)|![판매자 로그인 시 네비게이션 바](https://github.com/Jaharim/omni-market/assets/83650872/febf45ea-6905-4670-afce-71fff0b0d68c)|

  <br />

- 상품 상세 페이지
  
  - 바로구매, 장바구니 버튼 클릭 시 구매회원 로그인 페이지로 이동
 
    ![판매자 상품 상세 페이지](https://github.com/Jaharim/omni-market/assets/83650872/910f58f3-f869-4211-8233-7c8c224d44df)

  <br />

- 판매자 센터
  
  - 판매중인 상품

    |판매중인 상품이 없을 때|판매중인 상품이 있을 때|
    |-|-|
    |![판매중인 상품이 없을 때](https://github.com/Jaharim/omni-market/assets/83650872/a03c3f70-84f7-41d8-9a95-1f4583ecd777)|![판매중인 상품이 있을 때](https://github.com/Jaharim/omni-market/assets/83650872/0770ef00-65ab-44e6-93ac-25b65dbcd0e4)|

  <br />
  
  - 상품 등록
    
    |초기 화면|상품 정보 입력|
    |-|-|
    |![상품 등록 초기 화면](https://github.com/Jaharim/omni-market/assets/83650872/ba6411ee-24de-498f-9cac-4b8d2bb48b52)|![상품 정보 입력](https://github.com/Jaharim/omni-market/assets/83650872/33833d7d-8a83-4f67-b5c9-26e9d4798612)|

    #### 상품 등록 영상
    https://github.com/Jaharim/omni-market/assets/83650872/f43f5286-a89c-485f-915a-dd07697e11d8
    

  <br />
  
  - 상품 수정
    
    |수정 전|초기 화면|상품 정보 수정     |수정 후|
    |-|-|-|-|
    |![수정 전](https://github.com/Jaharim/omni-market/assets/83650872/f020e285-707e-4cec-a7b0-80b7a4bb17c5)|![초기 화면](https://github.com/Jaharim/omni-market/assets/83650872/97832234-09e8-4901-abd3-a258db525c82)|![상품 정보 수정](https://github.com/Jaharim/omni-market/assets/83650872/8e2c4698-5d0e-47fa-9210-a37ef2379e97)|![수정 후](https://github.com/Jaharim/omni-market/assets/83650872/7177b757-2add-4687-85f3-4d13559f06a4)|

    #### 상품 수정 영상
    https://github.com/Jaharim/omni-market/assets/83650872/ca287cc7-5086-44bd-a514-a26d487e0838
    
  <br />

  - 상품 삭제

    |삭제 전|삭제 확인|삭제 완료|삭제 후|
    |-|-|-|-|
    |![삭제 전](https://github.com/Jaharim/omni-market/assets/83650872/e2a4914c-b5d7-43c0-bc0a-941046a46d80)|![삭제 확인](https://github.com/Jaharim/omni-market/assets/83650872/95a5b1c7-5310-41e3-a970-c827286ed0f2)|![삭제 완료](https://github.com/Jaharim/omni-market/assets/83650872/0d95479e-8b37-412e-a96b-a8a9c73797ad)|![삭제 후](https://github.com/Jaharim/omni-market/assets/83650872/6fefe229-5bf9-4f3a-810a-bc7c45b91697)|
    
    #### 상품 삭제 영상
    https://github.com/Jaharim/omni-market/assets/83650872/56ccf90d-9aae-4646-84e6-4ad33adca9db
    

<br />

<!-- Top Button -->
<p style='background: black; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-left: auto;'><a href="#top" style='color: white; '>▲</a></p>

<br />
 
### 5) 비로그인 상태에서 회원전용 메뉴 접근 또는 유효하지 않은 주소 입력 시

- 상품 상세 페이지에서 바로구매, 장바구니 버튼을 클릭 시 로그인 페이지로 이동

![비로그인 상태에서 바로구매, 장바구니 버튼을 클릭 시](https://github.com/Jaharim/omni-market/assets/83650872/910f58f3-f869-4211-8233-7c8c224d44df)
  
- 유효하지 않은 주소 입력 시 에러 페이지로 이동
  
![비로그인 및 유효하지 않은 주소 입력 시](https://github.com/Jaharim/omni-market/assets/83650872/c3cf29f3-6577-47d2-8605-9e6349f1514b)
  

<!-- Top Button -->
<p style='background: black; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-left: auto;'><a href="#top" style='color: white; '>▲</a></p>

<br />
