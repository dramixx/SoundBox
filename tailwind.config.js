/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				surface: {
					DEFAULT: '#1a1a1a',
					hover: '#2a2a2a',
					active: '#222233'
				},
				bg: '#0f0f0f'
			},
			animation: {
				'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite'
			},
			keyframes: {
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 8px 2px rgba(99, 102, 241, 0.4)'
					},
					'50%': {
						boxShadow: '0 0 20px 6px rgba(99, 102, 241, 0.7)'
					}
				}
			}
		}
	},
	plugins: []
};
