import Gun from "gun/gun";
import "gun/sea";
import "gun/axe";

import { displayToast } from "./alerts";

const gun = Gun({
    peers: process.env.API_URL
});
const user = gun.user().recall({ sessionStorage: true });

const register = (username, password, consoleLog) => {
    if (username && email && password) {
        user.create(username, password, ack => {
            consoleLog ? console.log(ack) : null;
            return ack;
        });
        return true;
    }
    else
        return false;
};

const login = (username, password, consoleLog) => {
    if (username && password) {
        user.auth(username, password, ack => {
            consoleLog ? console.log(ack) : null;
            return gun.get(`pub/${ack.pub}`).get();
        });
        displayToast("Logged in successfully!", true);
        return true;
    }
    else {
        displayToast("Failed to log in!");
        return false;
    }
};

const logout = () => {
    user.leave();
};

const removeAccount = (username, consoleLog) => {
    if (username) {
        user.delete(username, ack => {
            consoleLog ? console.log(ack) : null;
        });
        return true;
    }
    else
        return false;
};

module.exports = {
    register,
    login,
    logout,
    removeAccount
};