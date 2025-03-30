"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (res, error) => {
    if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
    else {
        console.error("Unknown error occurred.");
        res.status(500).json({ error: "An unknown error occurred." });
    }
};
exports.handleError = handleError;