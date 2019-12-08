const getBundlephobiaLink = package => `https://bundlephobia.com/result?p=${package}`

const sizeTransformer = ({ gzip, size }) => {
  const parse = input => parseFloat(input).toFixed(1)
  const format = input => input > 1048576
    ? `${parse(input / 1048576)} MB` : input > 1024
    ? `${parse(input / 1024)} KB` : `${input} B`

  return {
    gzip: format(gzip),
    size: format(size),
  }
}
