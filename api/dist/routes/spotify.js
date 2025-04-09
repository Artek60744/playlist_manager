"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const spotifyController_1 = require("../controllers/spotifyController");
const router = express_1.default.Router();
router.get('/login', spotifyController_1.login);
router.get('/callback', spotifyController_1.callback);
exports.default = router;
