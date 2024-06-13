import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { getProductDetail } from '../../apis/api';
import OrderItem from '../../components/OrderItem';
import { useState } from 'react';
import { randomUUID } from 'crypto';

interface OrdertInfo {
  address: string;
  address_message: string;
  created_at: string;
  delivery_status: string;
  order_items: number[];
  order_quantity: number[];
  payment_method: string;
  receiver: string;
  receiver_phone_number: string;
  total_price: number;
}

interface OrderCardProps {
  orderInfo: OrdertInfo;
}

export default function MyOrderCard({ orderInfo }: OrderCardProps) {
  const dateStr = orderInfo.created_at;
  const dateObj = new Date(dateStr);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();

  const [orderDetailState, setOrderDetailState] = useState(false);

  const { data } = useQuery({
    enabled: !!orderInfo.order_items[0],
    queryKey: ['productDetail', orderInfo.order_items[0]],
    queryFn: () => getProductDetail(orderInfo.order_items[0]),
  });

  return (
    <>
      <OrderCard onClick={() => setOrderDetailState(true)}>
        <div>
          <div>
            <img
              src={data?.image}
              alt='판매중인 상품 이미지'
              //onClick={linkToProductDetailPage}
            />
            <span>{data?.product_name}</span>
            {orderInfo.order_quantity.length >= 2 && (
              <span>{`외 ${orderInfo.order_quantity.length - 1}건`}</span>
            )}
          </div>
          <div /* onClick={linkToProductDetailPage} */>
            <div>
              <span>수령인</span>
              <span>{orderInfo.receiver}</span>
            </div>
            <div>
              <span>연락처</span>
              <span>{orderInfo.receiver_phone_number}</span>
            </div>
            <div>
              <span>주소</span>
              <span>{orderInfo.address}</span>
            </div>
            <div>
              <span>배송 메시지</span>
              <span>{orderInfo.address_message}</span>
            </div>
          </div>
        </div>
        <div>
          <span>{orderInfo.delivery_status ? '결제완료' : '결제대기'}</span>
          <span>( {orderInfo.payment_method} )</span>
        </div>
        <div>
          <span>
            <strong>{orderInfo.total_price.toLocaleString()}</strong>원
          </span>
        </div>
        <div>
          <span>
            {year}/{month}/{day}/{hour.toString().padStart(2, '0')}:
            {minute.toString().padStart(2, '0')}
          </span>
        </div>
      </OrderCard>
      {orderDetailState && (
        <DetailModalBackDrop onClick={() => setOrderDetailState(false)}>
          <DetailModalContainer>
            <div>
              <span>주문정보</span>
              <span>배송상태</span>
              <span>결제금액</span>
              <span>주문일자</span>
              {/* <img src={closeIcon} alt='모달닫기 아이콘' /> */}
            </div>
            <div>
              <div /* onClick={linkToProductDetailPage} */>
                <div>
                  <span>수령인</span>
                  <span>{orderInfo.receiver}</span>
                </div>
                <div>
                  <span>연락처</span>
                  <span>{orderInfo.receiver_phone_number}</span>
                </div>
                <div>
                  <span>주소</span>
                  <span>{orderInfo.address}</span>
                </div>
                <div>
                  <span>배송 메시지</span>
                  <span>{orderInfo.address_message}</span>
                </div>
              </div>
              <div>
                <span>
                  {orderInfo.delivery_status ? '결제완료' : '결제대기'}
                </span>
                <span>( {orderInfo.payment_method} )</span>
              </div>
              <div>
                <span>
                  <strong>{orderInfo.total_price.toLocaleString()}</strong>원
                </span>
              </div>
              <div>
                <span>
                  {year}/{month}/{day}/{hour.toString().padStart(2, '0')}:
                  {minute.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <div>
              <span>상품정보</span>
              <span>할인</span>
              <span>배송비</span>
              <span>주문금액</span>
            </div>
            <div>
              {orderInfo.order_items.map((_, index) => {
                return (
                  <OrderItem
                    key={crypto.randomUUID()}
                    productId={orderInfo.order_items[index]}
                    quantity={orderInfo.order_quantity[index]}
                  />
                );
              })}
            </div>
            <div>
              <button onClick={() => setOrderDetailState(false)}>닫기</button>
            </div>
          </DetailModalContainer>
        </DetailModalBackDrop>
      )}
    </>
  );
}
const DetailModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: white;
  z-index: 2000;
  padding: 0 16px;

  & > div:nth-child(1) {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    padding: 30px 0;
    background-color: white;
    margin-top: 16px;

    span {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }

    span:nth-child(1) {
      display: inline-block;
      width: 50%;
    }
    span:nth-child(2),
    span:nth-child(3),
    span:nth-child(4) {
      display: inline-block;
      width: calc(50% / 3);
    }
  }

  & > div:nth-child(2) {
    display: flex;
    width: 100%;
    padding: 30px 0;
    margin: 15px 0;
    align-items: center;
    background-color: white;

    & > div:nth-child(1) {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      width: 50%;
      padding-left: 30px;
      gap: 15px;

      & > div {
        display: flex;
        flex-direction: row;
        align-items: center;

        span:nth-child(1) {
          display: inline-block;
          width: 120px;
          text-align: center;
          font-size: 16px;
        }
      }

      & > div:nth-child(1) {
        span:nth-child(2) {
          font-size: 18px;
          font-weight: bold;
        }
      }

      & > div:nth-child(2),
      & > div:nth-child(4) {
        span:nth-child(2) {
          color: #767676;
        }
      }

      & > div:nth-child(3) {
        span:nth-child(2) {
          font-size: 18px;
        }
      }
    }

    & > div:nth-child(2) {
      display: flex;
      flex-direction: column;
      width: calc(50% / 3);
      text-align: center;
      gap: 10px;

      & > span:nth-child(2) {
        font-size: 14px;
        color: #767676;
      }
    }

    & > div:nth-child(3) {
      display: flex;
      justify-content: center;
      width: calc(50% / 3);

      span {
        strong {
          font-size: 20px;
          font-weight: bold;
        }
      }
    }

    & > div:nth-child(4) {
      display: flex;
      justify-content: center;
      width: calc(50% / 3);
    }
  }

  & > div:nth-child(3) {
    box-sizing: border-box;
    width: 100%;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    padding: 30px;
    margin-bottom: 16px;
    background-color: white;

    span {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }

    span:nth-child(1) {
      display: inline-block;
      width: 50%;
    }
    span:nth-child(2),
    span:nth-child(3),
    span:nth-child(4) {
      display: inline-block;
      width: calc(50% / 3);
    }
  }

  & > div:nth-child(4) {
    height: 350px;
    overflow: auto;
  }

  & > div:nth-last-child(1) {
    button {
      box-sizing: border-box;
      width: 80px;
      height: 40px;
      border-radius: 10px;
      margin-bottom: 16px;
      background-color: white;
      border: 1px solid#767676;
      font-size: 14px;
    }
  }
`;
const DetailModalBackDrop = styled.div`
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
`;
const OrderCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  height: 200px;
  background-color: white;
  border-bottom: 1px solid #c4c4c4;

  & > div:nth-child(1) {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 50%;
    padding-left: 30px;
    gap: 30px;

    & > div:nth-child(1) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;

      & > img {
        width: 70px;
        aspect-ratio: 1/1;
        border-radius: 50%;
        cursor: pointer;
      }

      & > span:nth-child(2) {
        display: inline-block; /* or block */
        width: 120px; /* 6글자 정도에 맞는 적절한 너비를 설정하세요 */
        white-space: nowrap;
        overflow: hidden;
        text-align: center;
        text-overflow: ellipsis;
        color: black;
      }

      & > span:nth-child(3) {
        font-size: 14px;
        color: #767676;
        font-weight: bold;
      }
    }

    & > div:nth-child(2) {
      display: flex;
      flex-direction: column;
      gap: 10px;

      & > div {
        display: flex;
        align-items: center;

        span:nth-child(1) {
          display: inline-block;
          width: 120px;
          text-align: center;
          font-size: 16px;
        }

        span:nth-child(2) {
          display: inline-block;
          width: 250px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      & > div:nth-child(1) {
        span:nth-child(2) {
          font-size: 18px;
          font-weight: bold;
        }
      }

      & > div:nth-child(2),
      & > div:nth-child(4) {
        span:nth-child(2) {
          color: #767676;
        }
      }
      & > div:nth-child(3) {
        span:nth-child(2) {
          font-size: 18px;
        }
      }
    }
  }

  & > div:nth-child(2) {
    display: flex;
    flex-direction: column;
    width: calc(50% / 3);
    text-align: center;
    gap: 10px;

    & > span:nth-child(2) {
      font-size: 14px;
      color: #767676;
    }
  }

  & > div:nth-child(3) {
    display: flex;
    justify-content: center;
    width: calc(50% / 3);
    span {
      strong {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }

  & > div:nth-child(4) {
    display: flex;
    justify-content: center;
    width: calc(50% / 3);
  }
`;
