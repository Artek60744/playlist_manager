"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callback = exports.login = void 0;
const spotifyService_1 = require("../services/spotifyService");
const login = (req, res) => {
    const scopes = ['user-read-private', 'user-read-email'];
    const authorizeURL = (0, spotifyService_1.generateAuthorizeURL)(scopes);
    res.redirect(authorizeURL);
};
exports.login = login;
const callback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    try {
        const accessToken = yield (0, spotifyService_1.getAccessToken)(code);
        res.json({ accessToken });
    }
    catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});
exports.callback = callback;
