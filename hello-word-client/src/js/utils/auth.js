import Gun from "gun/gun";
import "gun/sea";
import "gun/axe";

import { displayToast } from "./alerts";

const gun = Gun({
    peers: process.env.API_URL
});
const user = gun.user().recall({ sessionStorage: true });

const register = (username, password, consoleLog) => {
    if (username && password) {
        user.create(username, password, ack => {
            consoleLog ? console.log(ack) : null;
            ack.err ? displayToast(ack.err) : displayToast("Successfull registration!", true);;
            return ack;
        });
        return true;
    }
    else
        return false;
};

const login = (username, password, consoleLog) => {
    if (username && password)
        user.auth(username, password, ack => {
            consoleLog ? console.log(ack) : null;
            ack.err ? displayToast(ack.err) : displayToast("Logged in successfully!", true);;
            return gun.get(`pub/${ack.pub}`).get();
        });
    else
        displayToast("Please complete all credentials!");
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