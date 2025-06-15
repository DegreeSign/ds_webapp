"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obfuscationSettings = void 0;
const webpack_obfuscator_1 = __importDefault(require("webpack-obfuscator"));
exports.obfuscationSettings = new webpack_obfuscator_1.default({
    compact: true, // Minify the output
    controlFlowFlattening: false, // Disable control flow flattening to avoid errors
    deadCodeInjection: false, // Disable dead code injection
    debugProtection: false, // Disable debug protection
    debugProtectionInterval: 0,
    disableConsoleOutput: false, // Allow console output
    identifierNamesGenerator: 'hexadecimal', // Use hexadecimal names for identifiers
    log: false,
    numbersToExpressions: false, // Disable numbers to expressions to reduce bloat
    renameGlobals: false, // Avoid renaming global variables
    selfDefending: false, // Disable self-defending code
    simplify: true, // Simplify code structure
    splitStrings: true, // Split strings into chunks
    splitStringsChunkLength: 8, // chunk length
    stringArray: true, // Enable string array transformation
    stringArrayCallsTransform: false,
    stringArrayEncoding: [], // No encoding for string array
    stringArrayIndexShift: false, // Disable index shifting
    stringArrayRotate: false, // Disable rotation to avoid potential issues
    stringArrayShuffle: false, // Disable shuffling for stability
    stringArrayWrappersCount: 1, // Match wrapper count
    stringArrayWrappersChainedCalls: false, // Disable chained calls
    stringArrayWrappersParametersMaxCount: 2, // Match max parameters
    stringArrayWrappersType: `variable`, // Use variable wrappers
    stringArrayThreshold: 1, // Obfuscate all strings
    unicodeEscapeSequence: false // Disable unicode escape sequences
});
