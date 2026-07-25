module.exports = [
    {
        files: ["src/**/*.js"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                console: "readonly",
                process: "readonly",
                Buffer: "readonly",
                __dirname: "readonly",
                module: "readonly",
                require: "readonly",
            },
        },

        rules: {
            "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "no-undef": "error",
            "no-unreachable": "error",
            "no-constant-condition": "error",
            "prefer-const": "warn",
            eqeqeq: ["error", "always"],
        },
    },
];