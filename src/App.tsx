import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

function App() {
  return (
    <HeaderContainer>
      <Outlet />
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  box-shadow: 0px 0px 15px rgba(0 0 0 / 20%);
`;

export default App;
