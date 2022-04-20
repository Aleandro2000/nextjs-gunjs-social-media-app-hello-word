import Gun from "gun/gun";
import "gun/sea";
import "gun/axe";

import { displayToast } from "./alerts";
import { SessionStorage } from "./utils";

const gun = Gun({
    peers: process.env.API_URL
});
const user = gun.user().recall({ sessionStorage: true });

gun.on("auth", async event => {
    const username = await user.get("alias");
    SessionStorage.setItem("username", username);
});

const register = (username, password, consoleLog) => {
    if (username && password) {
        user.create(username, password, ack => {
            consoleLog ? console.log(ack) : null;
            ack.err ? displayToast(ack.err) : displayToast("Successfull registration!", true);;
            return ack;
        });
    }
    else
        displayToast("Please complete all credentials!");
};

const login = (username, password, consoleLog) => {
    if (username && password)
        user.auth(username, password, ack => {
            consoleLog ? console.log(ack) : null;
            if (ack.err)
                displayToast(ack.err);
            else {
                SessionStorage.setItem("username", username);
                displayToast("Successfull logged in!", true);
            }
            return gun.get(`pub/${ack.pub}`).get();
        });
    else
        displayToast("Please complete all credentials!");
};

const logout = () => {
    user.leave();
    SessionStorage.removeItem("username");
};

const removeAccount = (username, consoleLog) => {
    if (username)
        user.delete(username, ack => {
            consoleLog ? console.log(ack) : null;
        });
    else
        displayToast("Error to remove account!");
};

module.exports = {
    register,
    login,
    logout,
    removeAccount
};