import styled from 'styled-components';
import marketLogo from '../assets/omni-header-h1.svg';
import passwordCheckIcon from '../assets/icon-check-on.svg';
import passwordCheckOffIcon from '../assets/icon-check-off.svg';
import signUpFailModalIcon from '../assets/icon-signup-fail.svg';

import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { signUp, authUserName, authSellerId } from '../apis/api';
import { AxiosError } from 'axios';

interface ButtonProps {
  selected: string;
}

interface AuthUserNameErrorData {
  FAIL_Message: string;
}

type SignUpFormData = {
  username: string;
  password: string;
  password2: string;
  phone_number: string;
  name: string;
  terms?: boolean;
  sellerId?: string;
  storeName?: string;
};

type SignUpType = 'BUYER' | 'SELLER';

const buyerSignUpFormSchema = z.object({
  name: z.string().nonempty({ message: '필수 입력 항목입니다.' }),
  phone_number: z
    .string()
    .nonempty({ message: '필수 입력 항목입니다.' })
    .refine((val) => /^010\d{8}$/.test(val), {
      message: '휴대폰번호는 010으로 시작하는 11자리 숫자여야 합니다.',
    }),
  username: z
    .string()
    .nonempty({ message: '필수 입력 항목입니다.' })
    .min(1, { message: '필수 입력 항목입니다.' })
    .max(20, {
      message: 'ID는 20자 이내의 영어 소문자, 대문자, 숫자만 가능합니다.',
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: 'ID는 20자 이내의 영어 소문자, 대문자, 숫자만 가능합니다.',
    }),
  password: z
    .string()
    .nonempty({ message: '필수 입력 항목입니다.' })
    .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
    .refine((val) => /[a-z]/.test(val) && /\d/.test(val), {
      message:
        '비밀번호는 한 개 이상의 영소문자와 숫자가 필수적으로 들어가야 합니다.',
    }),
  password2: z
    .string()
    .nonempty({ message: '필수 입력 항목입니다.' })
    .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
    .nonempty({ message: '필수 입력 항목입니다.' }),
  terms: z.literal(true, {
    message: '이용약관 및 개인정보처리방침에 동의하셔야합니다.',
  }),
});

const sellerSignUpFormSchema = buyerSignUpFormSchema.extend({
  sellerId: z.string().nonempty({ message: '필수 입력 항목입니다.' }),
  storeName: z.string().nonempty({ message: '필수 입력 항목입니다.' }),
});

export default function SignUp() {
  const [signUpType, setSignUpType] = useState<SignUpType>('SELLER');

  const [inputInfo, setInputInfo] = useState<SignUpFormData>({
    username: '',
    password: '',
    password2: '',
    phone_number: '', // 전화번호는 010으로 시작하는 10~11자리 숫자
    name: '',
    sellerId: '',
    storeName: '',
  });

  const navigation = useNavigate();

  const [userNameAuthResultMessage, setUserNameAuthResultMessage] =
    useState('');
  const [userNameAuthState, setUserNameAuthState] = useState(false);

  const [sellerIdAuthResultMessage, setSellerIdAuthResultMessage] =
    useState('');
  const [sellerIdAuthState, setSellerIdAuthState] = useState(false);

  const [passwordMatchState, setPasswordMatchState] = useState(false);

  const [joinedPhoneNumber, setJoinedPhoneNumber] = useState(['', '']);

  const [submitted, setSubmitted] = useState(false);

  const [submitButtonState, setSubmitButtonState] = useState(false);

  const [signUpSuccessModalOpen, setSignUpSuccessModalOpen] = useState(false);
  const [signUpFailModalOpen, setSignUpFailModalOpen] = useState(false);
  const [signUpFailModalMessage, setSignUpFailModalMessage] = useState('');

  const [formSchema, setFormSchema] = useState<ZodType<SignUpFormData>>(
    signUpType === 'BUYER' ? buyerSignUpFormSchema : sellerSignUpFormSchema
  );

  useEffect(() => {
    setFormSchema(
      signUpType === 'BUYER' ? buyerSignUpFormSchema : sellerSignUpFormSchema
    );
  }, [signUpType]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm</* BuyerFormData | SellerFormData */ SignUpFormData>({
    resolver: zodResolver(formSchema),
  });

  const watchedPassword = watch('password');
  const watchedPassword2 = watch('password2');

  const handleJoinPhoneNumber = (
    e: ChangeEvent<HTMLInputElement>,
    order: number
  ) => {
    const { value } = e.target;
    if (order === 1) {
      setJoinedPhoneNumber([value, joinedPhoneNumber[1]]);
    } else if (order === 2) {
      setJoinedPhoneNumber([joinedPhoneNumber[0], value]);
    }
  };

  useEffect(() => {
    setUserNameAuthState(false);
    setUserNameAuthResultMessage('');
  }, [watch('username')]);

  useEffect(() => {
    setSellerIdAuthState(false);
    setSellerIdAuthResultMessage('');
  }, [watch('sellerId')]);

  useEffect(() => {
    if (watchedPassword && watchedPassword2) {
      setPasswordMatchState(watchedPassword === watchedPassword2);
    } else {
      setPasswordMatchState(false);
    }
  }, [watchedPassword, watchedPassword2]);

  useEffect(() => {
    if (submitted) {
      joinedPhoneNumber[0].length === 4 && joinedPhoneNumber[1].length === 4
        ? (setValue(
            'phone_number',
            '010' + joinedPhoneNumber[0] + joinedPhoneNumber[1]
          ),
          trigger('phone_number'))
        : setValue(
            'phone_number',
            '010' + joinedPhoneNumber[0] + joinedPhoneNumber[1]
          );
      trigger('phone_number');
    }
    setValue(
      'phone_number',
      '010' + joinedPhoneNumber[0] + joinedPhoneNumber[1]
    );
  }, [joinedPhoneNumber, submitted]);

  useEffect(() => {
    for (const [key, value] of Object.entries(watch())) {
      if (!value) {
        if (signUpType === 'BUYER') {
          if (key === 'sellerId' || key === 'storeName') {
            continue;
          }
        }
        setSubmitButtonState(false);
        return;
      }
      if (signUpType === 'BUYER') {
        if (userNameAuthState) {
          setSubmitButtonState(true);
        }
      } else {
        if (userNameAuthState && sellerIdAuthState) {
          setSubmitButtonState(true);
        }
      }
    }
  }, [watch()]);

  const authUsernameMutation = useMutation({
    mutationFn: () => authUserName(watch('username')),
    onSuccess: (data) => {
      setUserNameAuthResultMessage('사용 가능한 아이디입니다.');
      setUserNameAuthState(true);
      //console.log(data.Success);
    },
    onError: (error: AxiosError<AuthUserNameErrorData>) => {
      setUserNameAuthResultMessage(error.response!.data.FAIL_Message);
      setUserNameAuthState(false);
      //console.log(error.response!.data.FAIL_Message);
    },
  });

  const authSellerIdMutation = useMutation({
    mutationFn: () => authSellerId(watch('sellerId')),
    onSuccess: (data) => {
      setSellerIdAuthResultMessage('사용 가능한 사업자 등록번호입니다.');
      setSellerIdAuthState(true);
      //console.log(data.Success);
    },
    onError: (error: AxiosError<AuthUserNameErrorData>) => {
      setSellerIdAuthResultMessage(error.response!.data.FAIL_Message);
      setSellerIdAuthState(false);
      //console.log(error.response!.data.FAIL_Message);
    },
  });

  const postSignUpRequest = useMutation({
    mutationFn: () => signUp(inputInfo, signUpType),
    onSuccess: (data) => {
      //console.log(data);
      //console.log(data.Success);
      setSignUpSuccessModalOpen(true);
    },
    onError: (error: AxiosError<AuthUserNameErrorData>) => {
      //console.log(error.response!.data.FAIL_Message);
      //console.log(error.response!.data);
      setSignUpFailModalMessage(Object.values(error.response!.data)[0]);
      setSignUpFailModalOpen(true);
    },
  });

  const onSubmit = handleSubmit(async (inputData) => {
    if (signUpType === 'SELLER') {
      setInputInfo({
        username: inputData.username,
        password: inputData.password,
        password2: inputData.password2,
        phone_number: inputData.phone_number,
        name: inputData.name,
        sellerId: inputData.sellerId,
        storeName: inputData.storeName,
      });
    } else {
      setInputInfo({
        username: inputData.username,
        password: inputData.password,
        password2: inputData.password2,
        phone_number: inputData.phone_number,
        name: inputData.name,
        sellerId: '',
        storeName: '',
      });
    }

    postSignUpRequest.mutate();
  });

  const handleSuccessModalClose = (e: SyntheticEvent) => {
    if (e.target !== e.currentTarget) return;
    else {
      navigation('/omni-market/login');
    }
  };

  const handleFailModalClose = (e: SyntheticEvent) => {
    if (e.target !== e.currentTarget) return;
    else {
      //console.log('signUp failed!');
      setSignUpFailModalOpen(false);
    }
  };

  return (
    <>
      <SignUpPageContainer>
        <h1 className='a11y-hidden'>회원가입페이지</h1>
        <Link to='/omni-market/'>
          <img src={marketLogo} alt='옴니마켓로고' />
        </Link>
        <div>
          <SignUpTypeButton
            type='button'
            className={signUpType === 'BUYER' ? 'selected' : ''}
            onClick={() => setSignUpType('BUYER')}
            selected={signUpType}
          >
            구매회원가입
          </SignUpTypeButton>
          <SignUpTypeButton
            type='button'
            className={signUpType === 'SELLER' ? 'selected' : ''}
            onClick={() => setSignUpType('SELLER')}
            selected={signUpType}
          >
            판매회원가입
          </SignUpTypeButton>
        </div>
        <div className='space'></div>
        <SignUpInfoInputForm onSubmit={onSubmit}>
          <div>
            <label htmlFor='username'>아이디</label>
            <div>
              <input
                type='text'
                id='username'
                className={errors.username ? 'errorBorder' : ''}
                {...register('username')}
              />
              <UserNameAuthButton
                type='button'
                onClick={() => authUsernameMutation.mutate()}
                disabled={!watch('username') || !!errors.username}
                $styleProps={!!watch('username') && !errors.username?.message}
              >
                중복확인
              </UserNameAuthButton>
            </div>
          </div>
          {
            <HasOtherConditionSpan
              className={`${
                userNameAuthResultMessage || errors.username
                  ? ''
                  : 'a11y-hidden'
              }`}
              $styleProps={userNameAuthState}
            >
              {userNameAuthResultMessage
                ? userNameAuthResultMessage
                : errors.username?.message}
            </HasOtherConditionSpan>
          }
          <div>
            <label htmlFor='userPassword'>비밀번호</label>
            <div className='passwordInputContainer'>
              <input
                type='password'
                id='userPassword'
                className={errors.password ? 'errorBorder' : ''}
                {...register('password')}
              />
              <img
                src={
                  watchedPassword?.length >= 8 && !errors.password
                    ? passwordCheckIcon
                    : passwordCheckOffIcon
                }
                alt='비밀번호체크아이콘'
              />
            </div>
          </div>
          {
            <span
              className={`${
                errors.password ? '' : 'a11y-hidden'
              } errorMessageSpan`}
            >
              {errors.password?.message}
            </span>
          }
          <div className='password2Container'>
            <label htmlFor='userPassword2'>비밀번호 재확인</label>
            <div className='passwordInputContainer'>
              <input
                type='password'
                id='userPassword2'
                className={errors.password2 ? 'errorBorder' : ''}
                {...register('password2')}
              />
              <img
                src={
                  !errors.password && !errors.password2 && passwordMatchState
                    ? passwordCheckIcon
                    : passwordCheckOffIcon
                }
                alt='비밀번호2체크아이콘'
              />
            </div>
          </div>
          {
            <HasOtherConditionSpan
              className={`${
                passwordMatchState ||
                errors.password2 ||
                (!passwordMatchState && !errors.password2)
                  ? ''
                  : 'a11y-hidden'
              }`}
              $styleProps={passwordMatchState}
            >
              {passwordMatchState
                ? '비밀번호가 일치합니다.'
                : errors.password2
                ? errors.password2?.message
                : watchedPassword && watchedPassword2
                ? '비밀번호가 일치하지 않습니다.'
                : ''}
            </HasOtherConditionSpan>
          }
          <div>
            <label htmlFor='name'>이름</label>
            <input
              type='text'
              id='name'
              className={errors.name ? 'errorBorder' : ''}
              {...register('name')}
            />
          </div>
          {
            <span
              className={`${errors.name ? '' : 'a11y-hidden'} errorMessageSpan`}
            >
              {errors.name?.message}
            </span>
          }
          <PhoneNumberInputContainer id='phoneNumber' $styleProps={signUpType}>
            <label htmlFor='phoneNumber'>휴대폰번호</label>
            <div>
              <input type='text' value={'010'} disabled={true} />
              <input
                type='text'
                className={errors.phone_number ? 'errorBorder' : ''}
                minLength={4}
                maxLength={4}
                onChange={(e) => handleJoinPhoneNumber(e, 1)}
              />
              <input
                type='text'
                className={errors.phone_number ? 'errorBorder' : ''}
                minLength={4}
                maxLength={4}
                onChange={(e) => handleJoinPhoneNumber(e, 2)}
              />
              <input
                className='a11y-hidden'
                type='text'
                {...register('phone_number')}
              />
            </div>
            {
              <span
                className={`${
                  errors.phone_number ? '' : 'a11y-hidden'
                } errorMessageSpan`}
              >
                {errors.phone_number?.message}
              </span>
            }
          </PhoneNumberInputContainer>

          {signUpType === 'BUYER' ? (
            ''
          ) : (
            <>
              <div>
                <label htmlFor='sellerId'>사업자 등록번호</label>
                <div>
                  <input
                    type='text'
                    id='sellerId'
                    className={errors.sellerId ? 'errorBorder' : ''}
                    {...register('sellerId')}
                  />
                  <SellerIdAuthButton
                    type='button'
                    onClick={() => authSellerIdMutation.mutate()}
                    disabled={!watch('sellerId')}
                    $styleProps={!!watch('sellerId')}
                  >
                    인증
                  </SellerIdAuthButton>
                </div>
              </div>
              {signUpType === 'SELLER' && (
                <HasOtherConditionSpan
                  className={`${
                    sellerIdAuthResultMessage || errors.sellerId
                      ? ''
                      : 'a11y-hidden'
                  }`}
                  $styleProps={sellerIdAuthState}
                >
                  {sellerIdAuthResultMessage
                    ? sellerIdAuthResultMessage
                    : errors.sellerId?.message}
                </HasOtherConditionSpan>
              )}
              <div>
                <label htmlFor='storeName'>스토어 이름</label>
                <input
                  type='text'
                  id='storeName'
                  className={errors.storeName ? 'errorBorder' : ''}
                  {...register('storeName')}
                />
              </div>
              {signUpType === 'SELLER' && (
                <span
                  className={`${
                    errors.storeName ? '' : 'a11y-hidden'
                  } errorMessageSpan`}
                >
                  {errors.storeName?.message}
                </span>
              )}
            </>
          )}
          <div>
            <input type='checkbox' id='checkbox' {...register('terms')} />
            <label htmlFor='checkbox'>
              옴니마켓의 <span>이용약관</span> 및 <span>개인정보처리방침</span>
              에 대한 내용을 확인하였고 동의합니다.
            </label>
          </div>
          <SubmitButton
            type='submit'
            $styleProps={submitButtonState}
            disabled={submitButtonState ? false : true}
            onClick={() => setSubmitted(true)}
          >
            가입하기
          </SubmitButton>
        </SignUpInfoInputForm>
      </SignUpPageContainer>
      {signUpSuccessModalOpen && (
        <SuccessModalBackDrop onClick={handleSuccessModalClose}>
          <div>
            <img src={passwordCheckIcon} alt='회원가입완료' />
            <span>회원가입이 완료되었습니다.</span>
            <button type='button' onClick={handleSuccessModalClose}>
              로그인하러 가기
            </button>
          </div>
        </SuccessModalBackDrop>
      )}
      {signUpFailModalOpen && (
        <FailModalBackDrop onClick={handleFailModalClose}>
          <div>
            <img src={signUpFailModalIcon} alt='회원가입실패' />
            <span>회원가입에 실패했습니다.</span>
            <span>{signUpFailModalMessage}</span>
            <button type='button' onClick={handleFailModalClose}>
              확인
            </button>
          </div>
        </FailModalBackDrop>
      )}
    </>
  );
}

const SignUpPageContainer = styled.div`
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

const SignUpInfoInputForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 550px;
  box-sizing: border-box;
  margin-bottom: 30px;
  border: 1px solid #c4c4c4;
  border-radius: 0 0 5px 5px;
  border-top: none;

  & > div.password2Container {
    margin-bottom: 40px;
  }

  & > div {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 480px;
    gap: 10px;

    label {
      font-size: 14px;
      color: #767676;
    }

    input {
      height: 54px;
      padding: 10px;
      box-sizing: border-box;
      border: 1px solid #c4c4c4;
      border-radius: 5px;
      font-size: 18px;
      margin-bottom: 12px;
    }

    input.errorBorder {
      border: 1px solid red;
    }

    input:focus {
      outline: none;
      border: 3px solid #21bf48;
    }

    & > div {
      display: flex;
      width: 100%;
      gap: 12px;

      input {
        width: calc(100% - 122px - 12px);
      }
    }

    .passwordInputContainer {
      display: flex;
      flex-direction: row;
      align-items: center;
      position: relative;

      input {
        width: 100%;
      }

      img {
        width: 28px;
        height: 28px;
        position: absolute;
        top: 12px;
        right: 16px;
        margin-bottom: unset;
      }
    }
  }

  .errorMessageSpan {
    display: inline-block;
    width: 480px;
    color: red;
    margin: -5px 0 12px;

    &:nth-last-child(1) {
      margin-top: -10px;
    }
  }

  & > div:nth-last-child(2) {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
    margin: 30px auto 12px;

    input {
      accent-color: #21bf48;
    }

    label {
      font-size: 16px;
      color: #767676;
    }
  }
`;

const FailModalBackDrop = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  & > div {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    width: 400px;
    height: 350px;
    border-radius: 10px;
    background-color: white;
    z-index: 2000;

    & > img {
      top: 0;
      width: 70px;
      height: 40%;
      pointer-events: auto;
    }

    & > span:nth-child(2) {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 38px;
    }

    & > span:nth-child(3) {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 40px;
    }

    & > button {
      width: 250px;
      height: 60px;
      position: absolute;
      bottom: 36px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      color: white;
      background-color: #767676;
      cursor: pointer;
    }
  }
`;

const SuccessModalBackDrop = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 400px;
    height: 350px;
    border-radius: 10px;
    background-color: white;
    z-index: 2000;

    & > img {
      top: 0;
      width: 70px;
      height: 50%;
      pointer-events: auto;
    }
    & > span {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 55px;
    }

    & > button {
      width: 250px;
      height: 60px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      color: white;
      background-color: #21bf48;
      cursor: pointer;
    }
  }
`;

const HasOtherConditionSpan = styled.span<{ $styleProps: boolean }>`
  display: inline-block;
  width: 480px;
  margin: -5px 0 12px;
  color: ${(props) => (props.$styleProps ? '#21bf48' : 'red')};

  &:nth-child(6) {
    margin-top: -47px;
    margin-bottom: 31px;
  }
`;

const SellerIdAuthButton = styled.button<{ $styleProps: boolean | undefined }>`
  width: 122px;
  height: 54px;
  border-radius: 5px;
  border: none;
  background-color: ${(props) => (props.$styleProps ? '#21bf48' : '#c4c4c4')};
  font-size: 16px;
  color: white;
  cursor: ${(props) => (props.$styleProps ? 'pointer' : 'unset')};
`;

const UserNameAuthButton = styled.button<{ $styleProps: boolean | undefined }>`
  width: 122px;
  height: 54px;
  border-radius: 5px;
  border: none;
  background-color: ${(props) => (props.$styleProps ? '#21bf48' : '#c4c4c4')};
  font-size: 16px;
  color: white;
  cursor: ${(props) => (props.$styleProps ? 'pointer' : 'unset')};
`;

const SignUpTypeButton = styled.button<ButtonProps>`
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

const SubmitButton = styled.button<{ $styleProps: boolean }>`
  width: 480px;
  height: 60px;
  margin-bottom: 36px;
  border-radius: 5px;
  border: none;
  background-color: ${(props) => (props.$styleProps ? '#21bf48' : '#c4c4c4')};
  font-size: 18px;
  font-weight: bold;
  color: white;
  cursor: ${(props) => (props.$styleProps ? 'pointer' : 'unset')};
`;

const PhoneNumberInputContainer = styled.div<{ $styleProps: SignUpType }>`
  margin-bottom: ${(props) => (props.$styleProps === 'BUYER' ? '' : '50px')};

  & > div {
    display: flex;
    width: 100%;
    gap: 12px;
  }

  input {
    width: 33%;
    text-align: center;
  }
`;
