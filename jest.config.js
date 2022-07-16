module.exports = {
    testEnvironment: "jsdom",
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        "^.+\\.(js|jsx)$": "babel-jest"
    },
    moduleFileExtensions: [
        'js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node', 'd.ts'
    ]
}