import auth from "./auth";
import utils from "./utils";
import alerts from "./alerts";

module.exports = {
    ...auth,
    ...utils,
    ...alerts
};