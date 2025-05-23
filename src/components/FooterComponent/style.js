import styled from 'styled-components';

export const WrapperFooter = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #f5f5f5;
  padding: 40px 60px;
  flex-wrap: wrap;
`;

export const FooterColumn = styled.div`
  flex: 1;
  min-width: 200px;
  margin: 0 20px;
`;

export const FooterTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const FooterLink = styled.p`
  margin: 8px 0;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const FooterIcon = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  margin: 8px 0;
  gap: 10px;
  color: #333;
`;



export const StoreButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  img {
    width: 120px;
    height: auto;
  }
`;
