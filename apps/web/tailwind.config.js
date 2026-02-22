/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "../../packages/ui-components/src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    DEFAULT: '#0A192F',
                    light: '#112240',
                    dark: '#020c1b'
                },
                electric: '#64FFDA',
                cloud: '#F8F9FA'
            },
            fontFamily: {
                sans: ['"Source Sans Pro"', 'sans-serif'],
                heading: ['Inter', 'sans-serif']
            }
        },
    },
    plugins: [],
}
