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
exports.getPlayerStatus = exports.callback = exports.login = void 0;
const spotifyService_1 = require("../services/spotifyService");
const login = (req, res) => {
    const scopes = ['user-read-private',
        'user-read-email',
        'user-read-playback-state',
        'user-read-currently-playing'];
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
const getPlayerStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Récupère le token depuis le header Authorization
    if (!accessToken) {
        return res.status(401).json({ error: 'Access token is required' });
    }
    try {
        const devices = yield (0, spotifyService_1.getPlayerDevices)(accessToken);
        res.json({ devices });
    }
    catch (error) {
        console.error('Error fetching player status:', error);
        res.status(500).json({ error: 'Failed to fetch player status' });
    }
});
exports.getPlayerStatus = getPlayerStatus;
