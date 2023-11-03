module.exports = {
    extends: [
        'airbnb',
        'plugin:prettier/recommended',
        'prettier/react',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:css-modules/recommended'
    ],
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        jest: true,
        node: true
    },
    rules: {
        'react/prop-types': ['off'],
        'react/jsx-props-no-spreading': ['off'],
        'import/no-extraneous-dependencies': ['off'],
        'import/no-named-as-default': ['off'],
        'import/prefer-default-export': ['off'],
        'no-console': ['off'],
        'class-methods-use-this': ['off'],
        'no-await-in-loop': ['off'],
        'jsx-a11y/href-no-hash': ['off'],
        'jsx-a11y/alt-text': ['off'],
        'jsx-a11y/label-has-for': ['off'],
        'jsx-a11y/click-events-have-key-events': ['off'],
        'jsx-a11y/no-static-element-interactions': ['off'],
        'jsx-a11y/accessible-emoji': ['off'],
        'jsx-a11y/label-has-associated-control': ['off'],
        'react/jsx-filename-extension': [
            'warn',
            { extensions: ['.js', '.jsx'] }
        ],
        'max-len': [
            'warn',
            {
                code: 100,
                tabWidth: 4,
                comments: 100,
                ignoreComments: false,
                ignoreTrailingComments: true,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true
            }
        ]
    },
    plugins: ['css-modules'],
    parser: '@babel/eslint-parser',
    settings: {
        'import/resolver': {
            node: {
                paths: ['src']
            }
        }
    },
    ignorePatterns: ['node_modules/', 'build/', 'dist/', 'third-party-packages']
};
