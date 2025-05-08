import { Radio } from 'antd';
import styled from 'styled-components';

export const WrapperContainer = styled.div`
  width: 100%;
`;

export const WrapperValue = styled.div`
  background: rgb(240,248,255);
  border: 1px solid rgb(184,255,255);
  padding: 10px;
  width: fit-content;
  border-radius: 6px;
  margin- top: 4px;
`

export const WrapperRight = styled.div`
  width: 30%;
  padding: 0 20px;
`;

export const WrapperStyleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

export const WrapperListOrder = styled.div`
  margin-top: 10px;
`;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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

export const WrapperItemOrderInfo = styled.div`
  padding: 17px 20px;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  width: 100%;
  display: flex;
  justify-content: center
`;

export const WrapperTotal = styled.div`
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const WrapperRadio = styled(Radio.Group)`
  margin-top: 6px;
  background: rgb(240,248,255);
  border: 1px solid rgb(194,255,255);
  width: 500px;
  border-radius: 4px;
  height: 100px;
  padding: 16px;
  font-weight: normal;
  display: flex;
  flex-direction: column;
  gap : 10px;
  justify-content: center;
`;

export const Lable = styled.span`
  font-size: 12px;
  color: #000;
  font-weight: bold
`
