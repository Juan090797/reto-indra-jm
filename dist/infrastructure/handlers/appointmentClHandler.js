"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const main = async (event) => {
    console.log("Handling event");
    console.log(event);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from appointmentClHandler!',
        }),
    };
};
exports.main = main;
