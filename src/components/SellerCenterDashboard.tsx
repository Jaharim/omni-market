import { useEffect, useState } from 'react';
import styled from 'styled-components';
import plusProductIcon from '../assets/icon-plus.svg';
import SellerSellingProducts from './SellerSellingProducts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSellingProducts } from '../apis/api';
import { useNavigate } from 'react-router-dom';

type LoginInfo = { id: string; token: string; loginType: string } | undefined;

export default function SellerCenterDashboard() {
  const navigation = useNavigate();
  const [token, setToken] = useState('');

  const queryClient = useQueryClient();

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
      setToken(token);
    }
  }, [queryClient]);

  const { data } = useQuery({
    enabled: !!token,
    queryKey: ['sellingProducts'],
    queryFn: () => getSellingProducts(token),
  });

  return (
    <DashboardContainer>
      <DashboardWrapper>
        <DashboardHeader>
          <div>
            <span>대시보드</span>
            <span>{data && data?.results[0]?.store_name}</span>
          </div>
          <button onClick={() => navigation('editProduct')}>
            <img src={plusProductIcon} alt='상품업로드 아이콘' />
            <span>상품 업로드</span>
          </button>
        </DashboardHeader>
        <DashboardContents>
          <ul>
            <li>판매중인 상품 ({data?.count})</li>
            <li>주문/배송</li>
            <li>문의/리뷰</li>
            <li>통계</li>
            <li>스토어 설정</li>
          </ul>
          <div>
            <SellerSellingProducts />
          </div>
        </DashboardContents>
      </DashboardWrapper>
    </DashboardContainer>
  );
}

const DashboardContents = styled.div`
  display: flex;
  gap: 30px;

  & > ul {
    display: flex;
    flex-direction: column;
    width: 250px;
    gap: 10px;

    li {
      box-sizing: border-box;
      width: 100%;
      height: 50px;
      border-radius: 5px;
      padding: 15px 20px;
      font-size: 16px;
      font-weight: bold;
      line-height: 20px;
    }

    li:hover {
      background-color: #effff3;
    }

    li:nth-child(1) {
      background-color: #21bf48;
      font-weight: normal;
      color: white;
    }
  }

  & > div:nth-child(2) {
    width: 100%;
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;

  & > div {
    span {
      font-size: 32px;
      font-weight: bold;
    }

    span:nth-child(2) {
      margin-left: 16px;
      color: #21bf48;
    }
  }

  & > button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 168px;
    height: 54px;
    border: none;
    border-radius: 10px;
    background-color: #21bf48;
    cursor: pointer;
    gap: 8px;

    span {
      font-size: 16px;
      font-weight: bold;
      color: white;
    }
  }
`;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  padding: 44px 0;
`;

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
  padding: 22px 100px;
  gap: 38px;
`;
