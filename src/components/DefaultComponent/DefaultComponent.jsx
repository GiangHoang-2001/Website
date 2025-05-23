import React from 'react';
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import FooterComponent from '../FooterComponent/FooterComponent'; // thêm dòng này

const DefaultComponent = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HeaderComponent />

            <div style={{ flex: 1 }}>
                {children}
            </div>

            <FooterComponent />
        </div>
    );
};

export default DefaultComponent;
