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
                proof: {
                    bg: '#E4E5E7',
                    card: '#F6F6F6',
                    text: '#1C1C1E',
                    accent: '#FF6B52',
                    accentGradientStart: '#FF9B8A',
                    border: '#EAEAEA'
                },
                navy: {
                    DEFAULT: '#0A192F',
                    light: '#112240',
                    dark: '#020c1b'
                },
                electric: '#64FFDA',
                cloud: '#F8F9FA'
            },
            fontFamily: {
                sans: ['"Outfit"', 'sans-serif'],
                heading: ['"Outfit"', 'sans-serif']
            },
            boxShadow: {
                'soft': '0 20px 40px -15px rgba(0,0,0,0.05)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
                'inner-soft': 'inset 0 2px 4px 0 rgba(0,0,0,0.02)',
            }
        },
    },
    plugins: [],
}
