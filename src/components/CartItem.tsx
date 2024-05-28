import styled from 'styled-components';
import deleteIcon from '../assets/icon-delete.svg';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  changeCartItemQuantity,
  deleteCartItem,
  getProductDetail,
} from '../apis/api';
import ProductQuantityInput from './ProductQuantityInput';
import { useCallback, useEffect, useState, SyntheticEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type LoginInfo = { id: string; token: string; loginType: string } | undefined;

type Selected = (selectedCartItem: {
  isSelected: boolean;
  productId: number;
  cost: number;
  shippingFee: number;
}) => void;

interface CartItemProps {
  key: number;
  productId: number;
  count: number;
  cartItemId: number;
  isActive: boolean;
  onSelected: Selected;
  onDelete: Selected;
  allInserted: string;
}

export default function CartItem({
  productId,
  count,
  cartItemId,
  isActive,
  onSelected,
  onDelete,
  allInserted,
}: CartItemProps) {
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(count);
  const [isSelected, setIsSelected] = useState(isActive);
  const _cartItemId = cartItemId;
  const navigation = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [determinedInitialSelected, setDeterminedInitialSelected] =
    useState(false);

  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [deleteCompleteModalOpen, setDeleteCompleteModalOpen] = useState(false);

  const { data } = useQuery({
    enabled: !!productId && !!token,
    queryKey: ['cartItem', productId],
    queryFn: () => getProductDetail(productId),
    //refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const changeCartItemQuantityMutation = useMutation({
    mutationFn: () =>
      changeCartItemQuantity(
        cartItemId,
        token,
        productId,
        quantity,
        isSelected
      ),
    onSuccess: () => {
      ////console.log(data);
    },
    onError: () => {
      ////console.log(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCartItem(token, _cartItemId),
    onSuccess: () => {
      setConfirmDeleteModalOpen(false);
      setDeleteCompleteModalOpen(true);
    },
  });

  const handleCartItemOrder = () => {
    //개별 상품의 주문하기 버튼을 눌렀을 때
    /* value.productId,
          value.cost,
          value.shippingFee, */
    setIsSelected(true);
    navigation('/omni-market/order', {
      state: [
        'cart_one_order',
        [
          [
            data.product_id,
            quantity * parseInt(data.price),
            parseInt(data.shipping_fee),
          ],
        ],
        quantity,
      ],
    });
  };

  const handleInsertOrderList = () => {
    setIsSelected((prev) => !prev);
  };

  const linkToProductDetailPage = (productId: number) => {
    navigation(`/omni-market/products/${productId}`);
  };

  const handleDeleteCartItem = () => {
    deleteMutation.mutate();
  };

  const handleConfirmDeleteModalClose = (e: SyntheticEvent) => {
    if (e.target !== e.currentTarget) return;
    else {
      setConfirmDeleteModalOpen(false);
    }
  };

  const handlDeleteCompleteModalClose = (e: SyntheticEvent) => {
    if (e.target !== e.currentTarget) return;
    else {
      if (data && token) {
        const cost = quantity * data.price;
        const shippingFee = data.shipping_fee;
        onDelete({ isSelected, productId, cost, shippingFee });
      }
      setDeleteCompleteModalOpen(false);
    }
  };

  const handleChangeCartItemQuantity = useCallback(async (quantity: number) => {
    setQuantity(quantity);
  }, []);

  useEffect(() => {
    changeCartItemQuantityMutation.mutate();
  }, [quantity, isSelected]);

  useEffect(() => {
    if (data && token) {
      const cost = quantity * data.price;
      const shippingFee = data.shipping_fee;
      onSelected({ isSelected, productId, cost, shippingFee });
      ////console.log({ isSelected, productId, cost, shippingFee });
      ////console.log(data.product_id, 'onSelected');
    }
  }, [isSelected, quantity, data, allInserted, location, token]);

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
      ////console.log(loginInfo);
      setToken(token);
    }
  }, [queryClient]);

  /* 1. 처음에는 inActive에 따른다. allInserted -> false
     2. 마운트 된 이후에는 inActive는 고려하지 않는다.
     3. 그 이후에는 handleInsertOrderList 나 allInserted에 의해서만 isSelected가 변경됨
      */
  /* useEffect(() => {
    if (!determinedInitialSelected) {
      setIsSelected(isActive); // 초기값 설정
      setDeterminedInitialSelected(true);
    } else if (allInserted !== '') {
      const newAllInserted = allInserted === 'true';
      setIsSelected(newAllInserted);
    }
  }, [allInserted, isActive, determinedInitialSelected]); */

  useEffect(() => {
    if (!determinedInitialSelected) {
      setDeterminedInitialSelected(true);
    } else {
      const newAllInserted = allInserted === 'true' ? true : false;
      setIsSelected(newAllInserted);
      ////console.log('allInserted: ', newAllInserted);
    }
  }, [allInserted]);

  /*   //console.log('isSelected: ' + isSelected);
  //console.log('isActice: ' + isActive);
  //console.log(data); */

  return (
    <>
      <CartItemContainer>
        <Button
          type='button'
          onClick={handleInsertOrderList}
          $select={isSelected.toString()}
        ></Button>
        {data && (
          <div>
            <CartItemInfo>
              <img
                src={data.image}
                alt='장바구니상품이미지'
                onClick={() => linkToProductDetailPage(data.product_id)}
              />
              <div className='basicInfo'>
                <div onClick={() => linkToProductDetailPage(data.product_id)}>
                  <span>{data.store_name}</span>
                  <span>{data.product_name}</span>
                  <span>{data.price.toLocaleString()}원</span>
                </div>
                <span>
                  택배배송 /{' '}
                  {data.shipping_fee === 0
                    ? '무료배송'
                    : data.shipping_fee.toLocaleString()}
                  {data.shipping_fee ? <span>원</span> : ''}
                </span>
              </div>
            </CartItemInfo>
            <ProductQuantityInput
              stock={data.stock}
              count={quantity}
              onSetQuantity={handleChangeCartItemQuantity}
            />
            <div>
              <span>
                {(quantity * data.price + data.shipping_fee).toLocaleString()}원
              </span>
              <button type='button' onClick={handleCartItemOrder}>
                주문하기
              </button>
            </div>
          </div>
        )}
        <button onClick={() => setConfirmDeleteModalOpen(true)}>
          <img src={deleteIcon} alt='삭제아이콘' />
        </button>
      </CartItemContainer>
      {confirmDeleteModalOpen && (
        <ConfirmDeleteModalBackDrop onClick={handleConfirmDeleteModalClose}>
          <div>
            <span>정말 삭제하시겠습니까?</span>
            <div>
              <button type='button' onClick={handleConfirmDeleteModalClose}>
                취소
              </button>
              <button type='button' onClick={handleDeleteCartItem}>
                삭제하기
              </button>
            </div>
          </div>
        </ConfirmDeleteModalBackDrop>
      )}
      {deleteCompleteModalOpen && (
        <DeleteCompleteModalBackDrop onClick={handlDeleteCompleteModalClose}>
          <div>
            <span>삭제되었습니다.</span>
            <button type='button' onClick={handlDeleteCompleteModalClose}>
              확인
            </button>
          </div>
        </DeleteCompleteModalBackDrop>
      )}
    </>
  );
}

const Button = styled.button<{ $select: string }>`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    background-color: ${(props) =>
      props.$select === 'true' ? '#21bf48' : 'white'};
  }
`;

const CartItemContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  box-sizing: border-box;
  width: 1280px;
  height: 200px;
  padding-left: 30px;
  margin-bottom: 10px;
  background-color: unset;
  border: 1px solid #e0e0e0;
  border-radius: 10px;

  & > button:nth-child(1) {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    padding: 0;
    align-items: center;
    background-color: unset;
    border-radius: 10px;
    border: 1px solid #21bf48;
    cursor: pointer;

    & > span {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #21bf48;
      border: none;
    }
  }

  & > div:nth-child(2) {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    padding-right: 40px;
    gap: 26px;

    & > div:nth-last-child(1) {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 26px;

      & > span {
        font-size: 18px;
        font-weight: bold;
        color: #eb5757;
      }

      & > button {
        width: 130px;
        height: 40px;
        background-color: #21bf48;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        font-weight: bold;
        color: white;
        cursor: pointer;
      }
    }
  }

  & > button:nth-last-child(1) {
    position: absolute;
    top: 18px;
    right: 18px;
    background-color: unset;
    border: none;
    cursor: pointer;
  }
`;

const CartItemInfo = styled.div`
  display: flex;
  flex-direction: row;
  width: 500px;
  height: 100%;
  gap: 36px;

  img {
    align-self: center;
    width: 160px;
    height: 160px;
    border-radius: 10px;
    cursor: pointer;
  }

  .basicInfo {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    padding: 26px 0 36px;

    & > div:nth-child(1) {
      display: flex;
      flex-direction: column;
      gap: 10px;
      cursor: pointer;

      span:nth-child(1) {
        font-size: 14px;
        color: #767676;
      }

      span:nth-child(2) {
        font-size: 18px;
      }

      span:nth-child(3) {
        font-size: 16px;
        font-weight: bold;
      }
    }

    & > span {
      font-size: 14px;
      color: #767676;
    }
  }
`;

const ConfirmDeleteModalBackDrop = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 250px;
    border-radius: 10px;
    background-color: white;
    z-index: 2000;
    gap: 40px;

    & > span {
      font-size: 20px;
      font-weight: bold;
    }

    & > div {
      display: flex;
      justify-content: center;
      width: 100%;
      gap: 10px;
    }

    & > div > button:nth-child(1) {
      width: 80px;
      height: 60px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      color: white;
      background-color: #767676;
      cursor: pointer;
    }

    & > div > button:nth-child(2) {
      width: 150px;
      height: 60px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      color: white;
      background-color: #21bf48;
      cursor: pointer;
    }
  }
`;

const DeleteCompleteModalBackDrop = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 250px;
    border-radius: 10px;
    background-color: white;
    z-index: 2000;
    gap: 40px;

    & > span {
      font-size: 20px;
      font-weight: bold;
      //margin-bottom: 35px;
    }

    & > button {
      width: 120px;
      height: 60px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      color: white;
      background-color: #767676;
      cursor: pointer;
    }
  }
`;
