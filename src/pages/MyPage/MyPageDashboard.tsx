import styled from 'styled-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrderList } from '../../apis/api';
import MyOrderList from './MyOrderList';
import Pagination from '../../components/Pagination';
import { useEffect, useState } from 'react';

type LoginInfo = { id: string; token: string; loginType: string } | undefined;

export default function MyPageDashboard() {
  const [token, setToken] = useState('');
  const [orderListPage, setOrderListPage] = useState(1);

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
    queryKey: ['orderList', orderListPage],
    queryFn: () => getOrderList(token, orderListPage),
  });

  const handleOrderListPage = (pageNum: number) => {
    ////console.log(pageNum);
    setOrderListPage(pageNum);
  };

  return (
    <DashboardContainer>
      <DashboardWrapper>
        {/* <DashboardHeader>
          <div>
            <span>대시보드</span>
            <span>{data?.results[0].store_name}</span>
          </div>
          <button onClick={() => navigation('editProduct')}>
            <img src={plusProductIcon} alt='상품업로드 아이콘' />
            <span>상품 업로드</span>
          </button>
        </DashboardHeader> */}
        <DashboardContents>
          <ul>
            <li>주문목록 ({data?.count})</li>
            <li>문의/리뷰</li>
          </ul>
          <div>
            <MyOrderList orderListPageNum={orderListPage} />
            <Pagination
              onHandlePageChange={handleOrderListPage}
              max={data?.count / 15}
            />
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
    display: flex;
    flex-direction: column;
    gap: 30px;

    & > div:nth-child(2) {
      align-self: center;
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
