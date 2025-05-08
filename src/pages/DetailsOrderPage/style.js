import styled from 'styled-components';

export const WrapperHeaderUser = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
`;

export const WrapperInfoUser = styled.div`
  flex: 1;
  background-color: #fff;
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

export const WrapperLabel = styled.div`
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 8px;
  color: #333;
`;

export const WrapperContentInfo = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #444;

  .name-info {
    font-weight: bold;
    text-transform: uppercase;
  }

  .address-info, .phone-info, .delivery-info, .delivery-fee, .payment-info, .status-payment {
    margin-top: 4px;
  }

  .name-delivery {
    color: orange;
    font-weight: bold;
  }

  .status-payment {
    color: orange;
  }
`;

export const WrapperStyleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

export const WrapperItemLabel = styled.div`
  width: 200px;
  font-weight: bold;
  &:last-child {
    font-weight: bold;
    }
`;

export const WrapperProduct = styled.div`
  display:flex;
  align-items: flex-start;
  margin-top: 10px;
`;

export const WrapperNameProduct = styled.div`
  display: flex;
  align-items: flex-start;
  width: 670px;
`;

export const WrapperItem = styled.div`
  width: 200px;
  font-weight: bold;
  &:last-child {
    color: red;
    }
`;

export const WrapperAllPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end
`