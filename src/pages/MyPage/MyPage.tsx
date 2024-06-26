import styled from 'styled-components';
import MyPageHeader from './MyPageHeader';
import MyPageDashboard from './MyPageDashboard';
import ScrollToTopButton from '../../components/ScrollToTopButton';

export default function MyPage() {
  return (
    <>
      <HeaderContainer>
        <MyPageHeader />
      </HeaderContainer>
      <ScrollToTopButton />
      <MyPageDashboard />
    </>
  );
}

const HeaderContainer = styled.div`
  box-shadow: 0px 0px 15px rgba(0 0 0 / 20%);
`;
