import styled from 'styled-components';
import marketLogo from '../assets/omni-header-h1.svg';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  selected: string;
}

export default function Login() {
  const [loginType, setLoginType] = useState<string>('buyer');

  return (
    <LoginPageContainer>
      <h1 className='a11y-hidden'>로그인페이지</h1>
      <Link to='/'>
        <img src={marketLogo} alt='옴니마켓로고' />
      </Link>
      <div>
        <LoginTypeButton
          type='button'
          className={loginType === 'buyer' ? 'selected' : ''}
          onClick={() => setLoginType('buyer')}
          selected={loginType}
        >
          구매회원 로그인
        </LoginTypeButton>
        <LoginTypeButton
          type='button'
          className={loginType === 'seller' ? 'selected' : ''}
          onClick={() => setLoginType('seller')}
          selected={loginType}
        >
          판매회원 로그인
        </LoginTypeButton>
      </div>
      <div className='space'></div>
      <UserInfoInputForm>
        <div>
          <label htmlFor='userId'>아이디</label>
          <input type='text' id='userId' />
        </div>
        <div>
          <label htmlFor='userPassword'>비밀번호</label>
          <input type='password' id='userPassword' />
        </div>
        <button type='button'>로그인</button>
      </UserInfoInputForm>
      <span>회원가입</span>
    </LoginPageContainer>
  );
}
const LoginTypeButton = styled.button<ButtonProps>`
  width: 50%;
  height: 60px;
  border: 1px solid #c4c4c4;
  border-radius: 5px 5px 0 0;
  border-bottom: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &.selected {
    background-color: white;
    border-right: ${(props) => {
      if (props.selected === 'buyer') {
        return 'none';
      }
    }};
    border-left: ${(props) => {
      if (props.selected === 'seller') {
        return 'none';
      }
    }};
  }
`;

const LoginPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  max-width: 1280px;
  margin: 60px auto;
  padding: 22px;

  .a11y-hidden {
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
  }

  img {
    width: 450px;
    margin-bottom: 20px;
  }

  & > div {
    width: 550px;
  }

  & > div.space {
    height: 20px;
    box-sizing: border-box;
    border-left: 1px solid #c4c4c4;
    border-right: 1px solid #c4c4c4;
  }

  & > span {
    font-size: 14px;
    color: #333;
  }
`;

const UserInfoInputForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 550px;
  box-sizing: border-box;
  margin-bottom: 30px;
  border: 1px solid #c4c4c4;
  border-radius: 0 0 5px 5px;
  border-top: none;

  & > div:nth-child(1) {
    & > input {
      //margin-top: 20px;
    }
  }

  & > div:nth-child(2) {
    margin-bottom: 26px;
  }

  & > div {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 480px;
    gap: 6px;

    label {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: #767676;
    }

    input {
      height: 60px;
      padding: 10px;
      box-sizing: border-box;
      padding-left: 80px;
      border: none;
      border-bottom: 1px solid #c4c4c4;
      font-size: 18px;
    }

    input:focus {
      outline: none;
      border-bottom: 3px solid #21bf48;
    }
  }

  button {
    width: 480px;
    height: 60px;
    margin-bottom: 36px;
    border-radius: 5px;
    border: none;
    background-color: #21bf48;
    font-size: 18px;
    font-weight: bold;
    color: white;
    cursor: pointer;
  }
`;
