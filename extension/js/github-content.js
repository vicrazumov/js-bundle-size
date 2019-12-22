const getPackageNameFromGithubBody = bodyText => {
  if (!bodyText) return

  const npmOrYarnMatch = bodyText.match(/((npm i\w*)( )(-[a-zA-Z-]+\s)*([a-z0-9-\.\_\@\/]+))|(yarn add ([a-z0-9-\.\_\@\/]+))/i)
  return npmOrYarnMatch && (npmOrYarnMatch[7] || npmOrYarnMatch[5])
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

const main = () => {
  const package = getPackageNameFromGithubBody(document.querySelector('body').innerHTML)
  if (!package) return

  const transformer = githubTransformer(package)

  fetch(`https://bundlephobia.com/api/size?package=${package}`)
    .then(response => response.json())
    .then(sizeTransformer)
    .then(transformer)
    .catch(err => console.warn('Retrieving JS bundle size failed', { err }))
}

main()
