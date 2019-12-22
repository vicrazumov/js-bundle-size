const getPackageNameFromNpm = url => {
  if (!url) return

  const match = url.match(/(https:\/\/www.npmjs.com\/package\/)(.+)/i)
  return match && match[2]
}

const npmTransformer = npmPackage => ({ gzip, size }) => {
  const npmDivClassList = 'dib w-50 bb b--black-10 pr2'
  const npmInnerHTMLGenerator = (header, package, value) => `<h3 class="f5 mt2 pt2 mb0 black-50">${header}</h3><p class="fw6 mb3 mt2 truncate black-80 f4"><a class="fw6 mb3 mt2 truncate black-80 f4 link" href="${getBundlephobiaLink(package)}">${value}</a></p>`

  const sidebarDivs = document.querySelectorAll('div.pr2')
  if (!sidebarDivs.length) return

  const lastElement = sidebarDivs[sidebarDivs.length - 1]
  const container = lastElement.parentNode
  const sizeDiv = document.createElement('div')
  container.insertBefore(sizeDiv, lastElement)
  sizeDiv.classList = npmDivClassList
  sizeDiv.innerHTML = npmInnerHTMLGenerator('minified', npmPackage, size)

  const gzipDiv = document.createElement('div')
  container.insertBefore(gzipDiv, lastElement)
  gzipDiv.classList = npmDivClassList
  gzipDiv.innerHTML = npmInnerHTMLGenerator('minified + gzipped', npmPackage, gzip)
}

const main = () => {
  const package = getPackageNameFromNpm(window.location.href)
  if (!package) return

  const transformer = npmTransformer(package)

  fetch(`https://bundlephobia.com/api/size?package=${package}`)
    .then(response => response.json())
    .then(sizeTransformer)
    .then(transformer)
    .catch(err => console.warn('Retrieving JS bundle size failed', { err }))
}

main()
