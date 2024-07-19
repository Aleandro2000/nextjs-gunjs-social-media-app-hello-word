import { ethers } from "ethers";

const logger = (err) => {
  if (process.env.NEXT_PUBLIC_ENV !== "production") {
    console.log(err);
  }
};

const SessionStorage = {
  getItem: (item) => {
    if (typeof window !== "undefined") return sessionStorage.getItem(item);
    return null;
  },
  setItem: (item, value) => {
    if (typeof window !== "undefined") sessionStorage.setItem(item, value);
  },
  removeItem: (item) => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(item);
      return true;
    }
    return false;
  },
};

const getWalletDetails = async () => {
  try {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const result = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return {
        result,
        provider: new ethers.providers.Web3Provider(window.ethereum),
      };
    }
    return null;
  } catch (err) {
    logger(err);
    return null;
  }
};

module.exports = {
  getWalletDetails,
  SessionStorage,
  logger,
};
