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
        res.status(500).json({ error: "An unknown error occurred." });  // Respond with a generic error message
    }
};
exports.handleError = handleError; // Export the handleError function so it can be used in other files