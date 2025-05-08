import axios from "axios";

export const getConfig = async () => {
    const res = await axios.get(`/api/payment/config`)
    return res.data;
}

