import errorIcon from '../assets/icon-404.svg';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigation = useNavigate();

  return (
    <ErrorPageContainer>
      <ErrorPageWrapper>
        <img src={errorIcon} alt='에러 아이콘' />
        <div>
          <span>페이지를 찾을 수 없습니다.</span>
          <p>
            페이지가 존재하지 않거나 사용할 수 없는 페이지입니다.
            <br />웹 주소가 올바른지 확인해 주세요.
          </p>
          <div>
            <button onClick={() => navigation('/omni-market/')}>
              메인으로
            </button>
            <button onClick={() => navigation(-1)}>이전 페이지</button>
          </div>
        </div>
      </ErrorPageWrapper>
    </ErrorPageContainer>
  );
}

const ErrorPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  max-width: 1280px;
  height: 100vh;
  margin: 0 auto;
`;

const ErrorPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  max-width: 1280px;
  margin: 0 auto;
  padding: 22px;
  gap: 50px;

  & > div:nth-child(2) {
    display: flex;
    flex-direction: column;
    gap: 40px;

    span {
      font-size: 40px;
      font-weight: bold;
    }

    p {
      font-size: 18px;
      line-height: 24px;
      color: #767676;
    }

    div {
      display: flex;
      flex-direction: row;
      align-self: center;
      width: 100%;
      gap: 14px;

      button {
        box-sizing: border-box;
        width: 50%;
        height: 60px;
        font-size: 18px;
        font-weight: bold;
        border: none;
        border-radius: 5px;
      }

      button:nth-child(1) {
        color: white;
        background-color: #21bf48;
      }

      button:nth-child(2) {
        border: 1px solid #c4c4c4;
        color: #767676;
        background-color: white;
      }
    }
  }
`;
