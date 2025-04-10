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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayerDevices = exports.refreshAccessToken = exports.getAccessToken = exports.generateAuthorizeURL = void 0;
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
const spotifyApi = new spotify_web_api_node_1.default({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});
const generateAuthorizeURL = (scopes) => {
    return spotifyApi.createAuthorizeURL(scopes);
};
exports.generateAuthorizeURL = generateAuthorizeURL;
const getAccessToken = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield spotifyApi.authorizationCodeGrant(code);
    spotifyApi.setAccessToken(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);
    return data.body.access_token;
});
exports.getAccessToken = getAccessToken;
const refreshAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body.access_token);
    return data.body.access_token;
});
exports.refreshAccessToken = refreshAccessToken;
const getPlayerDevices = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        spotifyApi.setAccessToken(accessToken);
        const response = yield spotifyApi.getMyDevices();
        return response.body.devices;
    }
    catch (error) {
        console.error('Error fetching player devices:', error);
        throw new Error('Failed to fetch player devices');
    }
});
exports.getPlayerDevices = getPlayerDevices;
