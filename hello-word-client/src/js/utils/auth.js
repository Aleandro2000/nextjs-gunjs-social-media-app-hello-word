import Gun from "gun/gun";
import "gun/sea";
import "gun/axe";

const gun = Gun();
const user = gun.user().recall({sessionStorage: true});

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

const login = (username, password, consoleLog) =>{
    if (username && password) {
        user.auth(username, password, ack => {
            consoleLog ? console.log(ack) : null;
            return gun.get(`pub/${ack.pub}`).get();
        });
        return true;
    }
    else
        return false;
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

export default {
    register,
    login,
    logout,
    removeAccount
};