import styled from 'styled-components';

export const WrapperLeft = styled.div`
  width: 70%;
`;

export const WrapperRight = styled.div`
  width: 30%;
  padding: 0 20px;
`;

export const WrapperStyleHeader = styled.div`
  background: rgb(255,255,255);
  padding: 9px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  span {
      color: rgb(36,36,36);
      font-weight: 400;
      font-size: 13px;
  }
`;

export const WrapperStyleHeaderDelivery = styled.div`
background: rgb(255,255,255);
  padding: 9px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  span {
      color: rgb(36,36,36);
      font-weight: 400;
      font-size: 13px;
  };
  margin-bottom: 4px;
`

export const WrapperListOrder = styled.div`
  margin-top: 10px;
`;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
`;

export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const WrapperInputNumber = styled.input`
  width: 40px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px;
`;

export const WrapperPriceDiscount = styled.div`
  text-decoration: line-through;
  font-size: 11px;
  color: #999;
  margin-left: 5px;
`;

export const WrapperInfo = styled.div`
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
`;

export const WrapperTotal = styled.div`
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
