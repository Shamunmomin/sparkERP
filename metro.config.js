const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add Hermes bytecode custom flags
config.transformer.minifierPath = "metro-minify-terser";
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});
config.serializer.experimentalSerializerHook = (bundle) => {
  bundle.hermesBytecodeOptions = {
    pageSize: 16384, // 16 KB
  };
};

module.exports = config;
