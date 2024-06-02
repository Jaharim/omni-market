import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSellingProducts } from '../../apis/api';
import SellingProductCard from '../SellerCenter/SellingProductCard';

type LoginInfo = { id: string; token: string; loginType: string } | undefined;

interface ProductInfo {
  image: string;
  product_id: number;
  product_name: string;
  stock: number;
  price: number;
}

export default function SellerSellingProducts() {
  const [token, setToken] = useState('');

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ['editedProduct'] });
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
    queryKey: ['sellingProducts'],
    queryFn: () => getSellingProducts(token),
  });

  const handleSellingProductDelete = () => {
    queryClient.invalidateQueries({ queryKey: ['sellingProducts'] });
  };

  return (
    <>
      <SellingProductsContainer>
        <SellingProductsIndex>
          <span>상품정보</span>
          <span>판매가격</span>
          <span>수정</span>
          <span>삭제</span>
        </SellingProductsIndex>
        <SellingProductsWrapper $productsCount={data?.count}>
          {data &&
            data.results.map((el: ProductInfo) => {
              return (
                <SellingProductCard
                  key={crypto.randomUUID()}
                  productInfo={el}
                  onDelete={handleSellingProductDelete}
                />
              );
            })}
        </SellingProductsWrapper>
      </SellingProductsContainer>
    </>
  );
}

const SellingProductsWrapper = styled.div<{ $productsCount: number }>`
  height: ${(props) => (props.$productsCount + 1) * 100}px;
  background-color: #f2f2f2;
`;

const SellingProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
`;

const SellingProductsIndex = styled.div`
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
  span:nth-child(2) {
    width: 25%;
  }
  span:nth-child(3),
  span:nth-child(4) {
    width: 12%;
  }
`;
