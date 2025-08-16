// SourceCode web stub for React Native Web compatibility

const SourceCode = {
  getConstants: () => ({
    scriptURL: typeof window !== 'undefined' ? window.location.href : '',
    bundleURL: typeof window !== 'undefined' ? window.location.href : ''
  })
};

module.exports = SourceCode;