import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrderList } from '../apis/api';
import MyOrderCard from './MyOderCard';

type LoginInfo = { id: string; token: string; loginType: string } | undefined;

type OrderListPageNum = number;

interface OrderListProps {
  orderListPageNum: OrderListPageNum;
}

interface OrderInfo {
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

export default function MyOrderList({ orderListPageNum }: OrderListProps) {
  const [token, setToken] = useState('');

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ['orderList'] });
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
      setToken(token);
    }
  }, [queryClient]);

  const { data } = useQuery({
    enabled: !!token,
    queryKey: ['orderList', orderListPageNum],
    queryFn: () => getOrderList(token, orderListPageNum),
  });

  ////console.log(data);

  return (
    <>
      <MyOrderListContainer>
        <MyOrderListIndex>
          <span>주문정보</span>
          <span>배송상태</span>
          <span>결제금액</span>
          <span>주문일자</span>
        </MyOrderListIndex>
        <MyOrderListWrapper $productsCount={data?.count}>
          {data &&
            data.results.map((el: OrderInfo) => {
              return (
                <MyOrderCard
                  key={crypto.randomUUID()}
                  orderInfo={el}
                  //onDelete={handleSellingProductDelete}
                />
              );
            })}
        </MyOrderListWrapper>
      </MyOrderListContainer>
    </>
  );
}

const MyOrderListWrapper = styled.div<{ $productsCount: number }>`
  height: ${(props) =>
    props.$productsCount >= 16 ? 15 * 200 : (props.$productsCount + 1) * 100}px;
  background-color: #f2f2f2;
`;

const MyOrderListContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
`;

const MyOrderListIndex = styled.div`
  display: flex;
  justify-content: space-evenly;
  height: 60px;
  border-bottom: 1px solid #c4c4c4;

  span {
    display: inline-block;
    line-height: 60px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
  span:nth-child(1) {
    width: 50%;
  }
  /* span:nth-child(2) {
    width: 25%;
  } */
  span:nth-child(2),
  span:nth-child(3),
  span:nth-child(4) {
    width: calc(50% / 3);
  }
`;
