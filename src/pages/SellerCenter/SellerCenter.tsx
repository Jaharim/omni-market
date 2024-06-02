import styled from 'styled-components';
import SellerCenterHeader from '../SellerCenter/SellerCenterHeader';
import SellerCenterDashboard from '../SellerCenter/SellerCenterDashboard';

export default function SellerCenter() {
  return (
    <>
      <HeaderContainer>
        <SellerCenterHeader />
      </HeaderContainer>
      <SellerCenterDashboard />
    </>
  );
}

const HeaderContainer = styled.div`
  box-shadow: 0px 0px 15px rgba(0 0 0 / 20%);
`;
