import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postOrder } from '../../apis/api';
import successIcon from '../../assets/icon-check-on.svg';
import { useNavigate } from 'react-router-dom';

type LoginInfo = { id: string; token: string; loginType: string } | undefined;

interface CostProps {
  orderKind: 'direct_order' | 'cart_order' | 'cart_one_order';
  productId: number;
  sumPrice: number;
  sumShippingFee: number;
  quantity: number | undefined;
  //
}

type Category = 'address' | 'senderPhone' | 'receiverPhone';

interface CartOrderInfo {
  totalPrice: number; // cart에 담긴 총 금액(수량*가격+배송비)을 보내줘야 합니다.
  orderKind: string; // 카트에서 주문할 경우에는 cart_order를 보내줘야 합니다.
  receiver: string;
  receiverPhoneNumber: string; // 01012341234 와 같은 형태로 보내야 합니다.
  address: string;
  message: string;
  paymentMethod: 'CARD' | 'DEPOSIT' | 'PHONE_PAYMENT' | 'NAVERPAY' | 'KAKAOPAY'; //CARD, DEPOSIT, PHONE_PAYMENT, NAVERPAY, KAKAOPAY 중 하나 선택
}

interface SingleOrderInfo extends CartOrderInfo {
  productId: number;
  quantity: number;
}

const orderFormSchema = z.object({
  name: z.string().nonempty({ message: '필수 입력 항목입니다.' }),
  phoneNumber: z
    .string()
    .nonempty({ message: '필수 입력 항목입니다.' })
    .refine((val) => /^010\d{8}$/.test(val), {
      message: '휴대폰번호는 010으로 시작하는 11자리 숫자여야 합니다.',
    }),
  email: z
    .string()
    .nonempty({ message: '필수 입력 항목입니다.' })
    .refine((val) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/.test(val), {
      message: '유효한 이메일 주소를 입력해주세요.',
    }),
  receiver: z.string().nonempty({ message: '필수 입력 항목입니다.' }),
  receiverPhoneNumber: z
    .string()
    .nonempty({ message: '필수 입력 항목입니다.' })
    .refine((val) => /^010\d{8}$/.test(val), {
      message: '휴대폰번호는 010으로 시작하는 11자리 숫자여야 합니다.',
    }),
  address: z.string().nonempty({ message: '필수 입력 항목입니다.' }),
  message: z.string().nonempty({ message: '필수 입력 항목입니다.' }),
  paymentMethod: z
    .string({ message: '필수 선택 사항입니다.' })
    .nonempty({ message: '필수 선택 사항입니다.' }),
  agreement: z.boolean().refine((val) => val === true, {
    message: '이용 약관에 동의해야 합니다.',
  }),
});

export default function InvoiceAndPayment({
  orderKind,
  productId,
  sumPrice,
  sumShippingFee,
  quantity,
}: CostProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(orderFormSchema),
  });

  const navigation = useNavigate();
  const [token, setToken] = useState('');
  const [firstSubmitChecker, setFirstSubmitChecker] = useState(false);
  const [orderInfo, setOrderInfo] = useState(
    {} as CartOrderInfo | SingleOrderInfo
  );

  const [orderCompleteModalState, setOrderCompleteModalState] = useState(false);

  const [dividedInputData, setDividedInputData] = useState({
    address: { part1: '', part2: '', part3: '' },
    senderPhone: { part1: '010', part2: '', part3: '' },
    receiverPhone: { part1: '010', part2: '', part3: '' },
  });

  useEffect(() => {
    let loginInfo: LoginInfo = queryClient.getQueryData(['loginInfo']);
    const authInfoString = localStorage.getItem('authInfo');
    if (!loginInfo) {
      const { id, token, loginType } = JSON.parse(authInfoString!);
      queryClient.setQueryData(['loginInfo'], {
        id,
        token,
        loginType,
      });
    }
    loginInfo = queryClient.getQueryData(['loginInfo']);
    const token = loginInfo!.token;
    if (loginInfo) {
      ////console.log(loginInfo);
      setToken(token);
    }
  }, [queryClient]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    category: Category
  ) => {
    const { name, value } = e.target;
    setDividedInputData((prev) => ({
      ...prev,
      [category]: { ...prev[category], [name]: value },
    }));
  };

  useEffect(() => {
    const combinedAddress =
      `${dividedInputData.address.part1} ${dividedInputData.address.part2} ${dividedInputData.address.part3}`.trim();
    setValue('address', combinedAddress);
    if (firstSubmitChecker) {
      trigger('address');
    }
  }, [dividedInputData.address, setValue]);

  useEffect(() => {
    const combinedSenderPhone =
      `${dividedInputData.senderPhone.part1}${dividedInputData.senderPhone.part2}${dividedInputData.senderPhone.part3}`.trim();
    setValue('phoneNumber', combinedSenderPhone);
    if (firstSubmitChecker) {
      trigger('phoneNumber');
    }
  }, [dividedInputData.senderPhone, setValue]);

  useEffect(() => {
    const combinedReceiverPhone =
      `${dividedInputData.receiverPhone.part1}${dividedInputData.receiverPhone.part2}${dividedInputData.receiverPhone.part3}`.trim();
    setValue('receiverPhoneNumber', combinedReceiverPhone);
    if (firstSubmitChecker) {
      trigger('receiverPhoneNumber');
    }
  }, [dividedInputData.receiverPhone, setValue]);

  const orderPostMutation = useMutation({
    mutationFn: () => postOrder(token, orderInfo),
    onSuccess: (data) => {
      ////console.log(data);
      setOrderCompleteModalState(true);
    },
    onError: (err) => {
      ////console.log(err);
    },
  });

  const handleSuccessModalClose = () => {
    setOrderCompleteModalState(false);
    navigation('/omni-market/myPage');
  };

  const onSubmit = handleSubmit(async (data) => {
    if (orderKind === 'cart_order') {
      const invoiceInfo = Object.assign(data);
      invoiceInfo.orderKind = orderKind;
      invoiceInfo.totalPrice = sumPrice + sumShippingFee;
      setOrderInfo(invoiceInfo);
      orderPostMutation.mutate();
    } else {
      const invoiceInfo = Object.assign(data);
      invoiceInfo.orderKind = orderKind;
      invoiceInfo.totalPrice = sumPrice + sumShippingFee;
      invoiceInfo.productId = productId;
      invoiceInfo.quantity = quantity;
      setOrderInfo(invoiceInfo);
      orderPostMutation.mutate();
    }
  });

  return (
    <>
      <InvoiceAndPaymentContainer>
        <InvoiceAndPaymentWrapper onSubmit={onSubmit}>
          <InvoiceContainer>
            <span>배송정보</span>
            <div>
              <span>주문자 정보</span>
              <div>
                <span>이름</span>
                <input type='text' {...register('name')} />
                {errors.name?.message && (
                  <ErrorSpan>{errors.name.message as string}</ErrorSpan>
                )}
              </div>
              <div>
                <span>휴대폰</span>
                <div>
                  <input type='text' name='part1' value={'010'} disabled />
                  <span></span>
                  <input
                    type='text'
                    name='part2'
                    value={dividedInputData.senderPhone.part2}
                    maxLength={4}
                    onChange={(e) => handleInputChange(e, 'senderPhone')}
                  />
                  <span></span>
                  <input
                    type='text'
                    name='part3'
                    value={dividedInputData.senderPhone.part3}
                    maxLength={4}
                    onChange={(e) => handleInputChange(e, 'senderPhone')}
                  />
                  <input type='hidden' {...register('phoneNumber')} />
                </div>
                {errors.phoneNumber?.message && (
                  <ErrorSpan>{errors.phoneNumber.message as string}</ErrorSpan>
                )}
              </div>
              <div>
                <span>이메일</span>
                <input
                  type='text'
                  placeholder='example@example.com 양식을 지켜주세요.'
                  {...register('email')}
                />
                {errors.email?.message && (
                  <ErrorSpan>{errors.email.message as string}</ErrorSpan>
                )}
              </div>
            </div>
            <div>
              <span>배송지 정보</span>
              <div>
                <span>수령인</span>
                <input type='text' {...register('receiver')} />
                {errors.receiver?.message && (
                  <ErrorSpan>{errors.receiver.message as string}</ErrorSpan>
                )}
              </div>
              <div>
                <span>휴대폰</span>
                <div>
                  <input type='text' name='part1' value={'010'} disabled />
                  <span></span>
                  <input
                    type='text'
                    name='part2'
                    value={dividedInputData.receiverPhone.part2}
                    maxLength={4}
                    onChange={(e) => handleInputChange(e, 'receiverPhone')}
                  />
                  <span></span>
                  <input
                    type='text'
                    name='part3'
                    value={dividedInputData.receiverPhone.part3}
                    maxLength={4}
                    onChange={(e) => handleInputChange(e, 'receiverPhone')}
                  />
                  <input type='hidden' {...register('receiverPhoneNumber')} />
                </div>
                {errors.receiverPhoneNumber?.message && (
                  <ErrorSpan>
                    {errors.receiverPhoneNumber.message as string}
                  </ErrorSpan>
                )}
              </div>
              <div>
                <span>배송주소</span>
                <div>
                  <div>
                    <input
                      type='text'
                      name='part1'
                      value={dividedInputData.address.part1}
                      onChange={(e) => handleInputChange(e, 'address')}
                    />
                    <button type='button'>우편번호 조회</button>
                    {errors.address?.message && (
                      <ErrorSpan>{errors.address.message as string}</ErrorSpan>
                    )}
                  </div>
                  <input
                    type='text'
                    name='part2'
                    value={dividedInputData.address.part2}
                    onChange={(e) => handleInputChange(e, 'address')}
                  />
                  <input
                    type='text'
                    name='part3'
                    value={dividedInputData.address.part3}
                    onChange={(e) => handleInputChange(e, 'address')}
                  />
                  <input type='hidden' {...register('address')} />
                </div>
              </div>
              <div>
                <span>배송 메시지</span>
                <input
                  type='text'
                  {...register('message')}
                  placeholder='없을 경우 "없음"을 입력해주세요'
                />
                {errors.message?.message && (
                  <ErrorSpan>{errors.message.message as string}</ErrorSpan>
                )}
              </div>
            </div>
          </InvoiceContainer>
          <PaymentContainer>
            <div>
              <span>결제 수단</span>
              <div>
                <input
                  type='radio'
                  id='card'
                  value='CARD'
                  {...register('paymentMethod')}
                />
                <label htmlFor='card'>신용/체크카드</label>
                <input
                  type='radio'
                  id='deposit'
                  value='DEPOSIT'
                  {...register('paymentMethod')}
                />
                <label htmlFor='deposit'>무통장 입금</label>
                <input
                  type='radio'
                  id='phonePayment'
                  value='PHONE_PAYMENT'
                  {...register('paymentMethod')}
                />
                <label htmlFor='phonePayment'>휴대폰 결제</label>
                <input
                  type='radio'
                  id='naverpay'
                  value='NAVERPAY'
                  {...register('paymentMethod')}
                />
                <label htmlFor='naverpay'>네이버페이</label>
                <input
                  type='radio'
                  id='kakaopay'
                  value='KAKAOPAY'
                  {...register('paymentMethod')}
                />
                <label htmlFor='kakaopay'>카카오페이</label>
              </div>
              {errors.paymentMethod?.message && (
                <ErrorSpan>{errors.paymentMethod.message as string}</ErrorSpan>
              )}
            </div>
            <div>
              <span>최종결제 정보</span>
              <div>
                <div>
                  <div>
                    <span>- 상품금액</span>
                    <span>
                      <strong>{sumPrice.toLocaleString()}</strong>원
                    </span>
                  </div>
                  <div>
                    <span>- 할인금액</span>
                    <span>
                      <strong>0</strong>원
                    </span>
                  </div>
                  <div>
                    <span>- 배송비</span>
                    <span>
                      <strong>{sumShippingFee.toLocaleString()}</strong>원
                    </span>
                  </div>
                  <span></span>
                  <div>
                    <span>- 결제금액</span>
                    <span>{(sumPrice + sumShippingFee).toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <div>
                    <input type='checkbox' {...register('agreement')} />
                    <label htmlFor='agreement'>
                      주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.
                    </label>
                  </div>
                  <SubmitButton
                    type='submit'
                    $validProps={isValid}
                    /* disabled={!isValid} */
                    onClick={() => setFirstSubmitChecker(true)}
                  >
                    결제하기
                  </SubmitButton>
                </div>
              </div>
            </div>
          </PaymentContainer>
        </InvoiceAndPaymentWrapper>
      </InvoiceAndPaymentContainer>
      {orderCompleteModalState && (
        <SuccessModalBackDrop onClick={handleSuccessModalClose}>
          <div>
            <img src={successIcon} alt='회원가입완료' />
            <span>주문 및 결제가 완료되었습니다.</span>
            <button type='button' onClick={handleSuccessModalClose}>
              주문목록으로 이동
            </button>
          </div>
        </SuccessModalBackDrop>
      )}
    </>
  );
}
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
const SubmitButton = styled.button<{ $validProps: boolean }>`
  width: 220px;
  height: 68px;
  border: none;
  border-radius: 5px;
  background-color: ${(props) => (props.$validProps ? '#21bf48' : '#c4c4c4')};
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  // ${(props) => (props.$validProps ? 'pointer' : 'normal')};
`;

const PaymentContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;

  & > div:nth-child(1) {
    width: 60%;

    & > span:nth-child(1) {
      display: inline-block;
      width: 100%;
      padding-bottom: 18px;
      border-bottom: 2px solid #c4c4c4;
      font-size: 24px;
      font-weight: bold;
    }

    & > div:nth-child(2) {
      padding: 18px 12px;
      border-bottom: 2px solid #c4c4c4;

      label {
        margin-left: 10px;
        margin-right: 20px;
        font-size: 16px;
      }
    }

    & > span:nth-last-child(1) {
      display: inline-block;
      margin-top: 10px;
    }
  }

  & > div:nth-child(2) {
    width: 40%;

    & > span:nth-child(1) {
      display: inline-block;
      width: 100%;
      margin-bottom: 18px;
      font-size: 24px;
      font-weight: bold;
    }

    & > div:nth-child(2) {
      width: 480px;
      box-sizing: border-box;
      padding-top: 32px;
      border: 2px solid #21bf48;
      border-radius: 10px;

      & > div:nth-child(1) {
        padding: 0px 30px;
        div {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 15px;

          span:nth-child(2) {
            font-size: 14px;
            color: #767676;

            strong {
              font-size: 18px;
              font-weight: bold;
              margin-right: 4px;
              color: black;
            }
          }
        }

        & > span:nth-child(4) {
          display: block;
          width: 100%;
          height: 1px;
          margin-top: 4px;
          margin-bottom: 29px;
          background-color: #c4c4c4;
        }

        & > div:nth-last-child(1) {
          margin-bottom: 25px;

          & > span:nth-child(2) {
            font-size: 24px;
            font-weight: bold;
            color: #eb5757;
          }
        }
      }

      & > div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #f2f2f2;
        border-radius: 0px 0px 10px 10px;
        padding: 30px 0px 34px 0px;

        & > div:nth-child(1) {
          input {
            margin-right: 10px;
            margin-bottom: 30px;
          }
          label {
            font-size: 14px;
          }
        }

        & > button:nth-child(2) {
          /* width: 220px;
          height: 68px;
          border: none;
          border-radius: 5px;
          background-color: #c4c4c4;
          font-size: 24px;
          font-weight: bold;
          color: #fff; */
        }
      }
    }
  }
`;

const ErrorSpan = styled.span`
  margin-left: 10px;
  color: #eb5757;
`;

const InvoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  & > span:nth-child(1) {
    display: inline-block;
    width: 100%;
    padding-bottom: 18px;
    border-bottom: 2px solid #c4c4c4;
    font-size: 24px;
    font-weight: bold;
  }

  & > div:nth-child(2) {
    & > span:nth-child(1) {
      display: inline-block;
      width: 100%;
      padding-bottom: 8px;
      border-bottom: 2px solid #c4c4c4;
      font-size: 18px;
      font-weight: bold;
    }

    & > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      padding: 8px 0;
      border-bottom: 1px solid #c4c4c4;

      & > span:nth-child(1) {
        display: inline-block;
        width: 170px;
        font-size: 16px;
      }

      & > input {
        width: 334px;
        height: 40px;
      }
    }

    & > div:nth-child(3) {
      & > div {
        display: flex;
        align-items: center;
        gap: 10px;

        span {
          display: inline-block;
          width: 7px;
          height: 1px;
          background-color: black;
        }
        input {
          width: 80px;
          height: 40px;
          text-align: center;
          padding: 0;
        }

        input:nth-child(3),
        input:nth-child(5) {
          width: 100px;
        }
      }
    }
  }

  & > div:nth-child(3) {
    & > span:nth-child(1) {
      display: inline-block;
      width: 100%;
      padding-bottom: 8px;
      border-bottom: 2px solid #c4c4c4;
      font-size: 18px;
      font-weight: bold;
    }

    & > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      padding: 8px 0;
      border-bottom: 1px solid #c4c4c4;

      & > span:nth-child(1) {
        display: inline-block;
        width: 170px;
        font-size: 16px;
      }

      & > input {
        width: 334px;
        height: 40px;
      }
    }

    & > div:nth-child(3) {
      & > div {
        display: flex;
        align-items: center;
        gap: 10px;

        span {
          display: inline-block;
          width: 7px;
          height: 1px;
          background-color: black;
        }
        input {
          width: 80px;
          height: 40px;
          text-align: center;
          padding: 0;
        }

        input:nth-child(3),
        input:nth-child(5) {
          width: 100px;
        }
      }
    }

    & > div:nth-child(4) {
      & > div:nth-child(2) {
        display: flex;
        flex-direction: column;
        gap: 8px;

        & > div:nth-child(1) {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;

          input {
            width: 170px;
            height: 40px;
          }

          button {
            width: 154px;
            height: 40px;
            background-color: #21bf48;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            color: #fff;
          }

          span {
            margin-left: 0px;
          }
        }

        & > input {
          width: 800px;
          height: 40px;
        }
      }
    }

    & > div:nth-child(5) {
      input {
        width: 800px;
      }
    }
  }
`;

const InvoiceAndPaymentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  padding: 36px 0;
  box-sizing: border-box;
  max-width: 1280px;
  margin: 0 auto;

  input {
    display: inline-block;
    box-sizing: border-box;
    padding: 0 0 0 20px;
    border: 1px solid #c4c4c4;
    outline: none;
  }

  input:focus {
    border: 2px solid #21bf48;
  }

  input:checked {
    accent-color: #21bf48;
  }
`;

const InvoiceAndPaymentWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  gap: 70px;
  //max-width: 1280px;
  //margin: 0 auto;
  //padding: 22px;
`;
