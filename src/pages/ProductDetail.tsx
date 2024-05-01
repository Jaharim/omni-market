import styled from 'styled-components';
import Header from '../components/Header';
import ScrollToTopButton from '../components/ScrollToTopButton';
import minusIcon from '../assets/icon-minus-line.svg';
import plusIcon from '../assets/icon-plus-line.svg';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductDetail } from '../apis/api';
import { useState } from 'react';

export default function ProductDetail() {
  const { productId } = useParams();

  const { data } = useQuery({
    queryKey: ['productDetail', productId],
    queryFn: () => getProductDetail(productId),
  });

  const [inputState, setInputState] = useState(1);
  const handleInputScroll = (e: React.WheelEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    target.blur();
  };

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

  console.log(data);

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
                <ProductQuantityContainer>
                  <button
                    type='button'
                    disabled={inputState <= 1}
                    onClick={() => handleInputButton('minus')}
                  >
                    <img src={minusIcon} alt='상품수량 마이너스 아이콘' />
                  </button>
                  <input
                    type='number'
                    value={inputState}
                    onChange={(e) => handleInputChange(e, data.stock)}
                    onWheel={handleInputScroll}
                  />
                  <button
                    type='button'
                    disabled={inputState >= data.stock}
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
                <OrderButtonsContainer>
                  <button type='button'>바로 구매</button>
                  <button type='button'>장바구니</button>
                </OrderButtonsContainer>
              </div>
            </ProductCoreInfo>
          </ProductDetailWrapper>
        </ProductDetailContainer>
      )}
    </>
  );
}

const HeaderContainer = styled.div`
  box-shadow: 0px 0px 15px rgba(0 0 0 / 20%);
`;

const ProductDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  padding: 80px 0;
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

const ProductQuantityContainer = styled.div`
  display: flex;
  width: 150px;
  margin: 30px 0;

  button {
    width: 50px;
    height: 50px;
    border: 1px solid #c4c4c4;
    background-color: unset;

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

const OrderButtonsContainer = styled.div`
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

    &:nth-child(1) {
      background-color: #21bf48;
    }

    &:nth-child(2) {
      background-color: #767676;
    }
  }
`;
