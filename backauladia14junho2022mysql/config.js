'use strict';
const dotenv = require('dotenv');

dotenv.config();

const {
    PORT,
    myHOST,
    myUSER,
    myPASSWORD,
    myDATABASE,
    myPORT
} = process.env;

module.exports = {

    port: PORT,
    port_mysql: myHOST,
    host: myHOST,
    database: myDATABASE,
    user: myUSER,
    password: myPASSWORD
}
