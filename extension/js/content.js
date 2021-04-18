const getBundlephobiaLink = (package) => `https://bundlephobia.com/result?p=${package}`;
const getBundlephobiaAPI = (package) => `https://bundlephobia.com/api/size?package=${package}`;
const errorHandler = (err) => console.warn('Retrieving JS bundle size failed', { err });

const sizeTransformer = ({ gzip, size }) => {
  const parse = (input) => parseFloat(input).toFixed(1);
  const format = (input) => (input > 1048576 ? `${parse(input / 1048576)} MB` : input > 1024 ? `${parse(input / 1024)} KB` : `${input} B`);

  return {
    gzip: format(gzip),
    size: format(size),
  };
};
