import React from 'react'
import { Button } from 'antd'

const ButtonComponent = ({
    size,
    children,
    styleButton,
    styletextbutton,
    disabled,
    textbutton,
    ...rests
}) => {
    return (
        <Button
            style={{
                ...styleButton,
                background: disabled ? '#ccc' : styleButton?.background
            }}
            size={size}
            {...rests}
        >
            {children}
            <span style={styletextbutton}>{textbutton}</span>
        </Button>
    )
}



export default ButtonComponent