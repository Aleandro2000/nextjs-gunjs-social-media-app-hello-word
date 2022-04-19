const SessionSotrage = {
    getItem: item => {
        if (typeof window !== "undefined")
            return sessionStorage.getItem(item);
    },
    setItem: (item, value) => {
        if (typeof window !== "undefined")
            sessionStorage.setItem(item, value);
    },
    removeItem: item => {
        if (typeof window !== "undefined")
            sessionStorage.removeItem(item);
    }
};

export default {
    SessionSotrage
};