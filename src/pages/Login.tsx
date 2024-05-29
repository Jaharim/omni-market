import styled from 'styled-components';
import marketLogo from '../assets/omni-header-h1.svg';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '../apis/api';
import { useQueryClient, useMutation } from '@tanstack/react-query';

interface ButtonProps {
  selected: string;
}

type FormData = {
  id: string;
  password: string;
};

type LoginType = 'BUYER' | 'SELLER';

const loginFormSchema = z
  .object({
    id: z
      .string({ message: '아이디를 입력해주세요' })
      .refine((value) => /^\S+$/.test(value), {
        message: '아이디를 입력해주세요',
      }),
    password: z
      .string({ message: '비밀번호를 입력해주세요' })
      .refine((value) => /^\S+$/.test(value), {
        message: '비밀번호를 입력해주세요',
      }),
  })
  .required();

export default function Login() {
  const [loginType, setLoginType] = useState<LoginType>('BUYER');
  const [inputInfo, setInputInfo] = useState({
    id: '',
    password: '',
    loginType: '',
  });
  const navigation = useNavigate();
  const [error, setError] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(loginFormSchema) });

  const handleInputErrors = () => {
    if (
      (errors.id?.message && errors.password?.message) ||
      errors.id?.message
    ) {
      return <span>{errors.id?.message}</span>;
    } else if (!errors.id?.message && errors.password?.message) {
      return <span>{errors.password?.message}</span>;
    }
  };

  /* const { isSuccess, error } = useQuery({
    enabled: !!inputInfo.id && !!inputInfo.password,
    queryKey: ['userLogin', inputInfo],
    queryFn: () => login(inputInfo),
    retry: 0,
  }); */

  /* const { mutate, isSuccess, error } = useMutation(
    //mutationKey: ['userLogin', inputInfo],
    { mutationFn: () => login(inputInfo) }
    //retry: 0,
  ); */

  const loginMutation = useMutation({
    mutationFn: () => login(inputInfo),
    onSuccess: (data) => {
      const { id, token } = data;
      queryClient.setQueryData(['loginInfo'], {
        id,
        token,
        loginType,
      });
      navigation('/omni-market/');
    },
    onError: () => setError(true),
  });

  /*   useEffect(() => {
    if (isSuccess) {
      navigation('/');
    }
  }, [isSuccess, navigation]); */

  const onSubmit = handleSubmit(async (inputData) => {
    setInputInfo({
      id: inputData.id,
      password: inputData.password,
      loginType: loginType,
    });
    loginMutation.mutate();

    /* const loginResult = await login(data.id, data.password, loginType);
    if (loginResult.data) {
      setLoginError('');
      ////console.log(loginResult.data.id, loginResult.data.token, loginType);
      //login 정보 Recoil 및 localStorage에 저장 후 홈페이지로 이동하게 설정
      setLoginInfo({
        id: loginResult.data.id,
        token: loginResult.data.token,
        loginType: loginType,
      });
    } else {
      setLoginError('아이디 또는 비밀번호가 일치하지 않습니다.');
    } */
  });

  return (
    <LoginPageContainer>
      <h1 className='a11y-hidden'>로그인페이지</h1>
      <Link to='/omni-market/'>
        <img src={marketLogo} alt='옴니마켓로고' />
      </Link>
      <div>
        <LoginTypeButton
          type='button'
          className={loginType === 'BUYER' ? 'selected' : ''}
          onClick={() => setLoginType('BUYER')}
          selected={loginType}
        >
          구매회원 로그인
        </LoginTypeButton>
        <LoginTypeButton
          type='button'
          className={loginType === 'SELLER' ? 'selected' : ''}
          onClick={() => setLoginType('SELLER')}
          selected={loginType}
        >
          판매회원 로그인
        </LoginTypeButton>
      </div>
      <div className='space'></div>
      <UserInfoInputForm onSubmit={onSubmit}>
        <div>
          <label htmlFor='userId'>아이디</label>
          <input type='text' id='userId' {...register('id')} />
        </div>
        <div>
          <label htmlFor='userPassword'>비밀번호</label>
          <input type='password' id='userPassword' {...register('password')} />
        </div>
        {error ? (
          <span>아이디 또는 비밀번호가 일치하지 않습니다.</span>
        ) : (
          handleInputErrors()
        )}
        <button type='submit'>로그인</button>
      </UserInfoInputForm>
      <span onClick={() => navigation('/omni-market/signup')}>회원가입</span>
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
    cursor: pointer;
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

  span {
    display: inline-block;
    width: 480px;
    //align-self: flex-start;
    color: red;
    margin-bottom: 26px;
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
