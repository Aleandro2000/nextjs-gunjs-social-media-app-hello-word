const app = require("express")();
const Gun = require("gun");
require("dotenv").config();

app.use(Gun.serve);

const server = app.listen(process.env.PORT ?? 8081);

Gun({ web: server });