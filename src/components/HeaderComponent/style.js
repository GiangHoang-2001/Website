import { Row } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
    background-color: rgb(255, 18, 18);
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 1270px;
    padding: 10px 120px;
`

export const WrapperTextHeader = styled(Link)`
    font-size: 18px;
    color:#fff;
    font-weight: bold;
    text-align: left;
`

export const WrapperHeaderAccout = styled.div`
    display: flex;
    align-items: center;
    color:#fff;
    gap: 10px;
    
`

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
`

export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        color: rgb(255, 45, 26);
    }
`

