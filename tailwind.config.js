/** Cores via tokens CSS (src/index.css) para funcionar em tema claro e escuro */
const t = (v) => `rgb(var(--${v}) / <alpha-value>)`
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: t('bg'), surface: t('surface'), sunken: t('sunken'), ink: t('ink'), muted: t('muted'),
        line: t('line'), primary: t('primary'), 'primary-ink': t('primary-ink'), 'primary-soft': t('primary-soft'),
        good: t('good'), 'good-soft': t('good-soft'), warn: t('warn'), 'warn-soft': t('warn-soft'),
        crit: t('crit'), 'crit-soft': t('crit-soft'), info: t('info'), 'info-soft': t('info-soft'),
      },
      fontFamily: {
        sans: ['"Public Sans"', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Barlow Semi Condensed"', '"Public Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
}
