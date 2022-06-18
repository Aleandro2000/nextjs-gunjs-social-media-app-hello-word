import { ethers } from "ethers";

const getWalletDetails = async (defaultAccount) => {
    try {
        if(window.ethereum && window.ethereum.isMetaMask) {
            const result = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            return {
                result,
                provider: new ethers.providers.Web3Provider(window.ethereum),
            };
        }
        return null;
    } catch(err) {
        return null;
    }
};

module.exports = {
    getWalletDetails,
};