module.exports = (api) => {
  api.cache(true);

  const plugins = ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-proposal-class-properties'];

  if (process.env["NODE_ENV"] === "production") {
    plugins.push(['remove-object-properties', { regexp: 'data-test*' }])
  }
  console.log("🚀 ~ file: babel.config.js:7 ~ process.env", process.env["ENV"])
  console.log("🚀 ~ file: babel.config.js:8 ~ plugins:", plugins)

  return {
    plugins,
    presets: [
      [
        '@babel/preset-env',
        {
          corejs: 3,
          useBuiltIns: 'usage',
        },
      ],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
      [
        '@babel/preset-typescript',
        {
          allowNamespaces: true,
        },
      ],
    ],
  };
};
