import { useEffect, useState } from 'react';
import styled from 'styled-components';

type HandlePageChange = (pageNumber: number) => void;

export default function Pagination({
  onHandlePageChange,
}: {
  onHandlePageChange: HandlePageChange;
}) {
  const [page, setPage] = useState(1);
  const [pageArr, setPageArr] = useState<number[][]>([]);
  const [pageArrNum, setPageArrNum] = useState(0);

  const maxPage = 9;

  useEffect(() => {
    const getPageArr = async () => {
      let tempArr = [];
      const pushedArr = [];
      for (let i = 1; i <= maxPage; i++) {
        tempArr.push(i);
        if (tempArr.length === 5 || i === maxPage) {
          pushedArr.push(tempArr);
          setPageArr(pushedArr);
          tempArr = [];
        }
      }
    };
    console.log(pageArr.length, pageArr);
    if (pageArr.length === 0) {
      getPageArr();
    }
  }, []);

  const handlePageChange = (page: number) => {
    setPage(page);
    onHandlePageChange(page);
  };

  const handlePageArrChange = (type: string) => {
    if (type === 'down') {
      setPageArrNum((prev) => (prev -= 1));
    } else if (type === 'up') {
      setPageArrNum((prev) => (prev += 1));
    }
  };

  return (
    <PaginationContainer>
      <button
        type='button'
        disabled={pageArrNum <= 0}
        onClick={() => handlePageArrChange('down')}
      >
        prev
      </button>
      <PageList>
        {pageArr.length !== 0 &&
          pageArr[pageArrNum].map((el) => {
            return (
              <li
                key={el}
                className={el === page ? 'currentPage' : ''}
                onClick={() => handlePageChange(el)}
              >
                {el}
              </li>
            );
          })}
      </PageList>
      <button
        type='button'
        disabled={pageArrNum >= pageArr.length - 1}
        onClick={() => handlePageArrChange('up')}
      >
        next
      </button>
    </PaginationContainer>
  );
}

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;

  button {
    cursor: pointer;
    border: none;
    font-size: 20px;
    background-color: unset;
  }
`;

const PageList = styled.ul`
  display: flex;
  flex-direction: row;
  gap: 10px;

  .currentPage {
    color: black;
    font-weight: bold;
  }

  li {
    cursor: pointer;
    font-size: 20px;
    color: #767676;
  }
`;
