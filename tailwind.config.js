/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            table: {
              borderCollapse: 'collapse',
              width: '100%',
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            'table thead': {
              borderBottom: '2px solid #d1d5db',
            },
            'table thead th': {
              padding: '0.75em',
              fontWeight: '600',
              textAlign: 'left',
            },
            'table tbody td': {
              padding: '0.75em',
              borderBottom: '1px solid #e5e7eb',
            },
            'table tbody tr:last-child td': {
              borderBottom: 'none',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
