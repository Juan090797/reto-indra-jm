"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvConfig = void 0;
class EnvConfig {
    constructor() {
        this.envConfig = process.env;
    }
    get(key) {
        return this.envConfig[key];
    }
}
exports.EnvConfig = EnvConfig;
