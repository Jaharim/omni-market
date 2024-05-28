import styled from 'styled-components';
import minusIcon from '../assets/icon-minus-line.svg';
import plusIcon from '../assets/icon-plus-line.svg';
import { useEffect, useState } from 'react';

type SetQuantity = (quantity: number) => void;

interface ProductQuantityInputProps {
  stock: number;
  count: number;
  onSetQuantity: SetQuantity;
}

export default function ProductQuantityInput({
  stock,
  count,
  onSetQuantity,
}: ProductQuantityInputProps) {
  const [inputState, setInputState] = useState(count);

  const handleInputScroll = (e: React.WheelEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    target.blur();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    max: number
  ) => {
    const target = e.target as HTMLInputElement;
    const value = parseInt(target.value);
    if (value > 0 && max >= value) {
      console.log(value);
      setInputState(value);
    } else {
      console.log(1);
      setInputState(1);
    }
  };

  const handleInputButton = (type: string) => {
    if (type === 'minus') {
      setInputState((prev) => prev - 1);
    } else if (type === 'plus') {
      setInputState((prev) => (prev = prev + 1));
    }
  };

  useEffect(() => {
    onSetQuantity(inputState);
  }, [inputState, onSetQuantity]);

  return (
    <ProductQuantityContainer>
      <button
        type='button'
        disabled={inputState <= 1}
        onClick={() => handleInputButton('minus')}
      >
        <img src={minusIcon} alt='상품수량 마이너스 아이콘' />
      </button>
      <input
        type='number'
        value={inputState}
        onChange={(e) => handleInputChange(e, stock)}
        onWheel={handleInputScroll}
      />
      <button
        type='button'
        disabled={inputState >= stock}
        onClick={() => handleInputButton('plus')}
      >
        <img src={plusIcon} alt='상품수량 플러스 아이콘' />
      </button>
    </ProductQuantityContainer>
  );
}

const ProductQuantityContainer = styled.div`
  display: flex;
  width: 150px;
  margin: 30px 0;
  transform: translateX(-50px);

  button {
    width: 50px;
    height: 50px;
    border: 1px solid #c4c4c4;
    background-color: unset;

    &:nth-child(1) {
      border-radius: 5px 0 0 5px;
    }

    &:nth-child(3) {
      border-radius: 0 5px 5px 0;
    }
  }

  input {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    outline: none;
    box-sizing: border-box;
    border: 1px solid #c4c4c4;
    border-left: none;
    border-right: none;
    width: 50px;
    height: 50px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
