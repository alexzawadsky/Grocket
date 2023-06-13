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
                    // orange: '#FF9001',
                    orange: 'var(--primary)',
                },
            },
        },
    },
    plugins: [],
}
