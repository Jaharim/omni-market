import styled from 'styled-components';
import Header from '../../components/Header';
import ScrollToTopButton from '../../components/ScrollToTopButton';
import minusIcon from '../../assets/icon-minus-line.svg';
import plusIcon from '../../assets/icon-plus-line.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addProductToCart, getProductDetail } from '../../apis/api';
import { useEffect, useState, SyntheticEvent } from 'react';
import { AxiosError } from 'axios';

type LoginInfo = { id: string; token: string; loginType: string } | undefined;

interface addProductToCartErrorData {
  FAIL_message: string;
}

export default function ProductDetail() {
  const { productId } = useParams();
  const queryClient = useQueryClient();
  const navigation = useNavigate();
  const [loginType, setLoginType] = useState<string>();

  const [token, setToken] = useState('');

  const [
    addProductToCartSuccessModalOpen,
    setAddProductToCartSuccessModalOpen,
  ] = useState(false);
  const [addProductToCartFailModalOpen, setAddProductToCartFailModalOpen] =
    useState(false);
  const [
    addProductToCartFailModalMessage,
    setAddProductToCartFailModalMessage,
  ] = useState('');

  const { data } = useQuery({
    queryKey: ['productDetail', productId],
    queryFn: () => getProductDetail(productId),
  });

  const [inputState, setInputState] = useState(1);
  const handleInputScroll = (e: React.WheelEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    target.blur();
  };

  useEffect(() => {
    let loginInfo: LoginInfo = queryClient.getQueryData(['loginInfo']);
    const authInfoString = localStorage.getItem('authInfo');
    if (!loginInfo && authInfoString) {
      const { id, token, loginType } = JSON.parse(authInfoString!);
      queryClient.setQueryData(['loginInfo'], {
        id,
        token,
        loginType,
      });
    }
    if (loginInfo) {
      loginInfo = queryClient.getQueryData(['loginInfo']);
      const token = loginInfo!.token;
      queryClient.invalidateQueries({
        queryKey: ['cartData'],
      });
      setToken(token);
      setLoginType(loginInfo!.loginType);
    }
  }, [queryClient]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    max: number
  ) => {
    const target = e.target as HTMLInputElement;
    const value = parseInt(target.value);
    if (value > 0 && max >= value) {
      setInputState(value);
    } else {
      setInputState(1);
    }
  };

  const handleInputButton = (type: string) => {
    if (type === 'minus') {
      setInputState((prev) => prev - 1);
    } else if (type === 'plus') {
      setInputState((prev) => prev + 1);
    }
  };

  const handleAddProductToCartSuccessModalClose = (e: SyntheticEvent) => {
    if (e.target !== e.currentTarget) return;
    else {
      setAddProductToCartSuccessModalOpen(false);
    }
  };

  const handleAddProductToCartFailModalClose = (e: SyntheticEvent) => {
    if (e.target !== e.currentTarget) return;
    else {
      setAddProductToCartFailModalOpen(false);
    }
  };

  const addProductToCartMutation = useMutation({
    mutationFn: () =>
      addProductToCart(token, data.product_id, inputState, true),
    onSuccess: () => {
      setAddProductToCartSuccessModalOpen(true);
    },
    onError: (err: AxiosError<addProductToCartErrorData>) => {
      setAddProductToCartFailModalOpen(true);
      setAddProductToCartFailModalMessage(err.response!.data.FAIL_message);
      ////console.log(err);
      ////console.log(err.response!.data.FAIL_message);
    },
  });

  ////console.log(data, token);

  const handleAddProductToCart = () => {
    addProductToCartMutation.mutate();
  };
  const handleDirectOrderProduct = () => {
    navigation('/omni-market/order', {
      state: [
        'direct_order',
        [
          [
            data.product_id,
            inputState * parseInt(data.price),
            parseInt(data.shipping_fee),
          ],
        ],
        inputState,
      ],
    });
  };
  //const handleFailModalClose = () => {};

  return (
    <>
      <HeaderContainer>
        <Header />
      </HeaderContainer>
      <ScrollToTopButton />
      {data && (
        <ProductDetailContainer>
          <ProductDetailWrapper>
            <img
              src={data.image}
              style={{ width: '500px', height: '500px' }}
              alt='상품이미지'
            />
            <ProductCoreInfo>
              <div className='basicInfo'>
                <span>{data.store_name}</span>
                <span>{data.product_name}</span>
                <span>
                  {data.price.toLocaleString()}
                  <span>원</span>
                </span>
              </div>
              <div className='shippingInfo'>
                <span>
                  택배배송 /{' '}
                  {data.shipping_fee === 0
                    ? '무료배송'
                    : data.shipping_fee.toLocaleString()}
                  {data.shipping_fee ? <span>원</span> : ''}
                </span>
                <span className='horizonLine'></span>
                <ProductQuantityContainer
                  $styleProps={loginType === 'SELLER' || !token}
                >
                  <button
                    type='button'
                    disabled={
                      inputState <= 1 || loginType === 'SELLER' || !token
                    }
                    onClick={() => handleInputButton('minus')}
                  >
                    <img src={minusIcon} alt='상품수량 마이너스 아이콘' />
                  </button>
                  <input
                    type='number'
                    value={inputState}
                    onChange={(e) => handleInputChange(e, data.stock)}
                    onWheel={handleInputScroll}
                    disabled={loginType === 'SELLER' || !token}
                  />
                  <button
                    type='button'
                    disabled={
                      inputState >= data.stock ||
                      loginType === 'SELLER' ||
                      !token
                    }
                    onClick={() => handleInputButton('plus')}
                  >
                    <img src={plusIcon} alt='상품수량 플러스 아이콘' />
                  </button>
                </ProductQuantityContainer>
                <span className='horizonLine'></span>
                <ProductFeeInfoContainer>
                  <span>총 상품 금액</span>
                  <div>
                    <span>
                      총 수량 <span>{inputState}</span>개
                    </span>
                    <span></span>
                    <span>
                      {data.shipping_fee
                        ? (
                            data.price * inputState +
                            data.shipping_fee
                          ).toLocaleString()
                        : (data.price * inputState).toLocaleString()}
                      <span>원</span>
                    </span>
                  </div>
                </ProductFeeInfoContainer>
                <OrderButtonsContainer
                  $styleProps={loginType === 'SELLER' || !token}
                >
                  <button
                    type='button'
                    disabled={loginType === 'SELLER' || !token}
                    onClick={handleDirectOrderProduct}
                  >
                    바로 구매
                  </button>
                  <button
                    type='button'
                    disabled={loginType === 'SELLER' || !token}
                    onClick={handleAddProductToCart}
                  >
                    장바구니
                  </button>
                </OrderButtonsContainer>
              </div>
            </ProductCoreInfo>
            {addProductToCartSuccessModalOpen && (
              <SuccessModalBackDrop
                onClick={handleAddProductToCartSuccessModalClose}
              >
                <div>
                  <span>장바구니에 상품을 담았습니다.</span>
                  <div>
                    <button
                      type='button'
                      onClick={handleAddProductToCartSuccessModalClose}
                    >
                      확인
                    </button>
                    <button
                      type='button'
                      onClick={() => navigation('/omni-market/cart')}
                    >
                      장바구니로 이동
                    </button>
                  </div>
                </div>
              </SuccessModalBackDrop>
            )}
            {addProductToCartFailModalOpen && (
              <FailModalBackDrop onClick={handleAddProductToCartFailModalClose}>
                <div>
                  <span>{addProductToCartFailModalMessage}</span>
                  <button
                    type='button'
                    onClick={handleAddProductToCartFailModalClose}
                  >
                    확인
                  </button>
                </div>
              </FailModalBackDrop>
            )}
          </ProductDetailWrapper>
        </ProductDetailContainer>
      )}
    </>
  );
}

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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 550px;
    height: 250px;
    border-radius: 10px;
    background-color: white;
    z-index: 2000;
    gap: 40px;

    & > span {
      font-size: 20px;
      font-weight: bold;
      //margin-bottom: 35px;
    }

    & > button {
      width: 120px;
      height: 60px;
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

const HeaderContainer = styled.div`
  box-shadow: 0px 0px 15px rgba(0 0 0 / 20%);
`;

const ProductDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  padding: 80px 0;
  box-sizing: border-box;
  max-width: 1280px;
  margin: 0 auto;
`;

const ProductDetailWrapper = styled.div`
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  max-width: 1280px;
  margin: 0 auto;
  padding: 22px;
`;

const ProductCoreInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 500px;
  margin-left: 50px;

  .basicInfo {
    display: flex;
    flex-direction: column;

    & > span:nth-child(1) {
      font-size: 18px;
      color: #767676;
      margin-bottom: 16px;
    }

    & > span:nth-child(2) {
      font-size: 36px;
      color: #000;
      margin-bottom: 20px;
    }

    & > span:nth-child(3) {
      font-size: 36px;
      font-weight: bold;
      color: #000;

      & > span {
        font-size: 18px;
        font-weight: normal;
        color: #000;
      }
    }
  }

  .shippingInfo {
    display: flex;
    flex-direction: column;
    gap: 0px;

    & > span:nth-child(1) {
      font-size: 16px;
      color: #767676;
      margin-bottom: 20px;
    }

    .horizonLine {
      display: inline-block;
      width: 100%;
      height: 2px;
      background-color: #c4c4c4;

      &:nth-child(4) {
        margin-bottom: 30px;
      }
    }
  }
`;

const ProductQuantityContainer = styled.div<{ $styleProps: boolean }>`
  display: flex;
  width: 150px;
  margin: 30px 0;

  button {
    width: 50px;
    height: 50px;
    border: 1px solid #c4c4c4;
    background-color: unset;
    cursor: ${(props) => (props.$styleProps ? 'normal' : 'pointer')};

    &:nth-child(1) {
      border-radius: 5px 0 0 5px;
    }

    &:nth-child(3) {
      border-radius: 0 5px 5px 0;
    }
  }

  input {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    outline: none;
    box-sizing: border-box;
    border: 1px solid #c4c4c4;
    border-left: none;
    border-right: none;
    width: 50px;
    height: 50px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ProductFeeInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;

  & > span:nth-child(1) {
    font-size: 18px;
    font-weight: bold;
    color: #000;
  }

  & > div {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 12px;

    & > span:nth-child(1) {
      font-size: 18px;
      color: #767676;
      span {
        font-weight: bold;
        color: #21bf48;
      }
    }

    & > span:nth-child(2) {
      display: inline-block;
      width: 1px;
      height: 18px;
      background-color: #c4c4c4;
    }

    & > span:nth-child(3) {
      font-size: 36px;
      color: #21bf48;
      font-weight: bold;
      span {
        font-size: 18px;
        font-weight: normal;
      }
    }
  }
`;

const OrderButtonsContainer = styled.div<{ $styleProps: boolean }>`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 14px;

  button {
    height: 60px;
    font-size: 18px;
    font-weight: bold;
    color: white;
    border-radius: 5px;
    border: none;
    cursor: ${(props) => (props.$styleProps ? 'normal' : 'pointer')};

    &:nth-child(1) {
      background-color: ${(props) =>
        props.$styleProps ? '#C4C4C4' : '#21bf48'};
    }

    &:nth-child(2) {
      background-color: ${(props) =>
        props.$styleProps ? '#C4C4C4' : '#767676'};
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
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 250px;
    border-radius: 10px;
    background-color: white;
    z-index: 2000;
    gap: 40px;

    & > span {
      font-size: 20px;
      font-weight: bold;
    }

    & > div {
      display: flex;
      justify-content: center;
      width: 100%;
      gap: 10px;
    }

    & > div > button:nth-child(1) {
      width: 80px;
      height: 60px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      color: white;
      background-color: #767676;
      cursor: pointer;
    }

    & > div > button:nth-child(2) {
      width: 150px;
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
