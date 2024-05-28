import { SyntheticEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSellingProduct } from '../apis/api';
import { useNavigate } from 'react-router-dom';

type LoginInfo = { id: string; token: string; loginType: string } | undefined;

interface ProductInfo {
  image: string;
  product_id: number;
  product_name: string;
  stock: number;
  price: number;
}
/* {
  image,
  productId,
  productName,
  stock,
  price,
} */

interface SellingProductCardProps {
  onDelete: () => void;
  productInfo: ProductInfo;
}

export default function SellingProductCard({
  onDelete,
  productInfo,
}: SellingProductCardProps) {
  const [token, setToken] = useState('');
  const navigation = useNavigate();
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [deleteCompleteModalOpen, setDeleteCompleteModalOpen] = useState(false);

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

  const handleEditSellingProduct = () => {
    navigation(`editProduct/?editedProductId=${productInfo.product_id}`);
  };

  const deleteSellingProductMutation = useMutation({
    mutationFn: () => deleteSellingProduct(token, productInfo.product_id),
    onSuccess: () => {
      setConfirmDeleteModalOpen(false);
      setDeleteCompleteModalOpen(true);
    },
    onError: (err) => {
      console.log(productInfo);
      console.log(productInfo.product_id);
      console.log(err);
    },
  });

  const handleConfirmDeleteModalClose = (e: SyntheticEvent) => {
    if (e.target !== e.currentTarget) {
      return;
    } else {
      setConfirmDeleteModalOpen(false);
    }
  };

  const handleDeleteCartItem = () => {
    deleteSellingProductMutation.mutate();
  };

  const handlDeleteCompleteModalClose = (e: SyntheticEvent) => {
    if (e.target !== e.currentTarget) {
      return;
    } else {
      setDeleteCompleteModalOpen(false);
      onDelete();
    }
  };

  const linkToProductDetailPage = () => {
    navigation(`/products/${productInfo.product_id}`);
  };

  //console.log(data);

  return (
    <>
      <SellingProduct>
        <div>
          <img
            src={productInfo.image}
            alt='판매중인 상품 이미지'
            onClick={linkToProductDetailPage}
          />
          <div>
            <span onClick={linkToProductDetailPage}>
              {productInfo.product_name}
            </span>
            <span>재고 : {productInfo.stock}개</span>
          </div>
        </div>
        <span>{productInfo.price.toLocaleString()}원</span>
        <div>
          <button type='button' onClick={handleEditSellingProduct}>
            수정
          </button>
        </div>
        <div>
          <button type='button' onClick={() => setConfirmDeleteModalOpen(true)}>
            삭제
          </button>
        </div>
      </SellingProduct>
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

const SellingProduct = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100px;
  background-color: white;
  border-bottom: 1px solid #c4c4c4;

  & > div:nth-child(1) {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 50%;
    padding-left: 30px;
    gap: 30px;

    img {
      width: 70px;
      aspect-ratio: 1/1;
      border-radius: 50%;
      cursor: pointer;
    }

    & > div {
      display: flex;
      flex-direction: column;
      gap: 10px;

      span:nth-child(1) {
        font-size: 18px;
        cursor: pointer;
      }

      span:nth-child(2) {
        font-size: 16px;
        color: #767676;
      }
    }
  }

  & > span:nth-child(2) {
    width: 25%;
    text-align: center;
    font-size: 18px;
  }

  & > div:nth-child(3),
  & > div:nth-child(4) {
    display: flex;
    justify-content: center;
    width: 12%;

    button {
      width: 80px;
      height: 40px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
    }
  }

  & > div:nth-child(3) {
    button {
      background-color: #21bf48;
      color: white;
    }
  }

  & > div:nth-child(4) {
    button {
      border: 1px solid #767676;
      background-color: white;
      color: black;
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
