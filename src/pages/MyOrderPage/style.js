import styled from 'styled-components';

export const WrapperContainer = styled.div`
  width: 100%;
  background: #f5f5fa
`;

export const WrapperListOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 9px 16px;
  background: #fff;
  margin-top: 12px;
  flex-direction: column;
  width: 950px;
  margin: 0 auto;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 12px 12px #ccc;
`;

export const WrapperHeaderItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

export const WrapperFooterItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: 12px;
`;

export const WrapperStatus = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(235,235,240);
  flex-direction: column; 
`;
