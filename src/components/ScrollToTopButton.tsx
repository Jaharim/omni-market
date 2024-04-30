import { useState, useEffect } from 'react';
import styled from 'styled-components';
import upArrowIcon from '../assets/icon-up-arrow.svg';

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollPercentage = (scrollTop / (scrollHeight - windowHeight)) * 100;

    setIsVisible(scrollPercentage > 50);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      {isVisible && (
        <ButtonStyle onClick={scrollToTop}>
          <img src={upArrowIcon} alt='탑버튼아이콘' />
        </ButtonStyle>
      )}
    </div>
  );
}

const ButtonStyle = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
  border-radius: 22px;
  background-color: #81dfa0;
  color: #fff;
  border: none;
  cursor: pointer;
`;

export default ScrollToTopButton;
