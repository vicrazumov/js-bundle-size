const getPackageNameFromGithubBody = bodyText => {
  if (!bodyText) return

  const npmOrYarnMatch = bodyText.match(/((npm i\w*)( )(-[a-zA-Z-]+\s)*([a-z0-9-\.\_\@\/]+))|(yarn add ([a-z0-9-\.\_\@\/]+))/i)
  return npmOrYarnMatch && npmOrYarnMatch[7] || npmOrYarnMatch[5]
}

const getPackageNameFromNpm = url => {
  if (!url) return

  const match = url.match(/(https:\/\/www.npmjs.com\/package\/)(.+)/i)
  return match && match[2]
}

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

const githubTransformer = npmPackage => ({ gzip, size }) => {
  const badgeGenerator = (href, name, value) => `<a href="${href}"><div class="jsbs-badge-container"><div class="jsbs-badge-label">${name}</div><div class="jsbs-badge-value">${value}</div></div></a>`

  const article = document.querySelector('article.markdown-body')
  if (!article) return

  const link = getBundlephobiaLink(npmPackage)
  const div = document.createElement('div')
  div.className = 'jsbs-github-container'
  div.innerHTML = badgeGenerator(link, 'minified', size)
    + badgeGenerator(link, 'minified + gzipped', gzip)

  article.insertBefore(div, article.firstChild)
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
  sizeDiv.innerHTML = npmInnerHTMLGenerator('size', npmPackage, size)

  const gzipDiv = document.createElement('div')
  container.insertBefore(gzipDiv, lastElement)
  gzipDiv.classList = npmDivClassList
  gzipDiv.innerHTML = npmInnerHTMLGenerator('minified + gzipped', npmPackage, gzip)
}

const main = () => {
  const npmPackage = getPackageNameFromNpm(window.location.href)
  const githubPackage = !npmPackage && getPackageNameFromGithubBody(document.querySelector('body').innerHTML)
  const package = npmPackage || githubPackage
  if (!package) return

  const transformer = npmPackage ? npmTransformer(package) : githubTransformer(package)

  fetch(`https://bundlephobia.com/api/size?package=${package}`)
    .then(response => response.json())
    .then(sizeTransformer)
    .then(transformer)
    .catch(() => {})
}

main()
