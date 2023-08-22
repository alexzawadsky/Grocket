/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                primary: ['grocket', 'cursive'],
                bold: ['grocketbold', 'cursive'],
                bolditalic: ['grocketbolditalic', 'cursive'],
            },
            colors: {
                primary: {
                    900: '#000000',
                    700: '#131313',
                    500: '#262626',
                    300: '#4B4B4B',
                    100: '#C4C4C4',
                },
                accent: {
                    red: '#FF1500',
                    orange: 'var(--primary)', // FF9001
                    "orange-dimmed": '#ffe3bf',
                    "orange-dimmed-dark": "#784c00"
                },
            },
            keyframes: {
                spin: {
                    '0%': { transform: 'rotate(0)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
            },
            animation: {
                spinmail: 'spin 2.5s linear infinite',
            },
        },
    },
    plugins: [],
}
