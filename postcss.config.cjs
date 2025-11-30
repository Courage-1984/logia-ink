// CSS PurgeCSS is disabled - no CSS purging
// const purgecss =
//   require('@fullhuman/postcss-purgecss').default || require('@fullhuman/postcss-purgecss');
// const enablePurge = process.env.ENABLE_PURGECSS === 'false';

module.exports = {
  plugins: [
    // PurgeCSS is disabled - no CSS purging
    // All PurgeCSS configuration commented out below
    // ...(enablePurge && process.env.NODE_ENV === 'production'
    //   ? [
    //       purgecss({
    //         content: [
    //           './**/*.html',
    //           './js/**/*.js',
    //           './dist/**/*.html',
    //         ],
    //         defaultExtractor: content => {
    //           const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
    //           const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
    //           const elementMatches = content.match(/<([a-z][a-z0-9]*)/gi) || [];
    //           const elements = elementMatches.map(m => m.replace(/</gi, '').toLowerCase());
    //           const classMatches = content.match(/class=["']([^"']+)["']/gi) || [];
    //           const classes = classMatches.flatMap(
    //             m => m.match(/class=["']([^"']+)["']/i)?.[1]?.split(/\s+/) || []
    //           );
    //           const idMatches = content.match(/id=["']([^"']+)["']/gi) || [];
    //           const ids = idMatches.map(m => m.match(/id=["']([^"']+)["']/i)?.[1] || '');
    //           return [...broadMatches, ...innerMatches, ...elements, ...classes, ...ids];
    //         },
    //         safelist: {
    //           standard: [/* ... */],
    //           deep: [/* ... */],
    //           greedy: [/* ... */],
    //         },
    //         variables: true,
    //         keyframes: true,
    //         fontFace: true,
    //       }),
    //     ]
    //   : []),
  ],
};
