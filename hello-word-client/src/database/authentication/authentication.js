import Gun from "gun/gun";
import "gun/sea";
import "gun/axe";
import { displayToast } from "../../utils";

const gun = Gun({
    peers: process.env.API_URL
});
const user = gun.user().recall({ sessionStorage: true });

const register = (username, password, consoleLog) => {
    if (username && password) {
        user.create(username, password, ack => {
            consoleLog ? console.log(ack) : null;
            ack.err ? displayToast(ack.err, false) : displayToast("SUCESS!");;
            return ack;
        });
    }
    else
        displayToast("ERROR!");
};

const login = (username, password, consoleLog) => {
    if (username && password)
        user.auth(username, password, ack => {
            consoleLog ? console.log(ack) : null;
            if (ack.err)
                displayToast(ack.err, false);
            else
                displayToast("SUCCESS!");
            return gun.get(`pub/${ack.pub}`).get();
        });
    else
        displayToast("ERROR!", false);
};

const logout = () => {
    user.leave();
};

const removeAccount = (username, consoleLog) => {
    if (username)
        user.delete(username, ack => {
            consoleLog ? console.log(ack) : null;
        });
    else
        displayToast("ERROR!", false);
};

module.exports = {
    register,
    login,
    logout,
    removeAccount
};