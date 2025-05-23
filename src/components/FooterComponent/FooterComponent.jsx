import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { WrapperFooter, FooterColumn, FooterTitle, FooterLink, FooterIcon, QRImage, StoreButtons } from './style';

const FooterComponent = () => {
    return (
        <WrapperFooter>
            <FooterColumn>
                <FooterTitle>DỊCH VỤ KHÁCH HÀNG</FooterTitle>
                <FooterLink>Trung Tâm Trợ Giúp ShopMall</FooterLink>
                <FooterLink>ShopMall Blog</FooterLink>
                <FooterLink>ShopMall Mall</FooterLink>
                <FooterLink>Hướng Dẫn Mua Hàng/Đặt Hàng</FooterLink>
                <FooterLink>Hướng Dẫn Bán Hàng</FooterLink>
                <FooterLink>Ví ShopMallPay</FooterLink>
                <FooterLink>ShopMall Xu</FooterLink>
                <FooterLink>Đơn Hàng</FooterLink>
                <FooterLink>Trả Hàng/Hoàn Tiền</FooterLink>
                <FooterLink>Liên Hệ ShopMall</FooterLink>
                <FooterLink>Chính Sách Bảo Hành</FooterLink>
            </FooterColumn>

            <FooterColumn>
                <FooterTitle>SHOPMALL VIỆT NAM</FooterTitle>
                <FooterLink>Về ShopMall</FooterLink>
                <FooterLink>Tuyển Dụng</FooterLink>
                <FooterLink>Điều Khoản ShopMall</FooterLink>
                <FooterLink>Chính Sách Bảo Mật</FooterLink>
                <FooterLink>ShopMall Mall</FooterLink>
                <FooterLink>Kênh Người Bán</FooterLink>
                <FooterLink>Flash Sale</FooterLink>
                <FooterLink>Tiếp Thị Liên Kết</FooterLink>
                <FooterLink>Liên Hệ Truyền Thông</FooterLink>
            </FooterColumn>

            <FooterColumn>
                <FooterTitle>THEO DÕI SHOPMALL</FooterTitle>
                <FooterIcon><FaFacebook /> Facebook</FooterIcon>
                <FooterIcon><FaInstagram /> Instagram</FooterIcon>
                <FooterIcon><FaLinkedin /> LinkedIn</FooterIcon>
            </FooterColumn>

            <FooterColumn>
                <FooterTitle>LIÊN HỆ</FooterTitle>
                <FooterLink>📞 Số điện thoại: 0436742452</FooterLink>
                <FooterLink>📧 Email: shopmall@email.com</FooterLink>
                <FooterLink>📍 Địa chỉ: Hưng lập - Hợp thành - Yên Thành - Nghệ An</FooterLink>
            </FooterColumn>
        </WrapperFooter>
    );
};

export default FooterComponent;
