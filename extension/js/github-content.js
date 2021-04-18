const getPackageNameFromGithubBody = (bodyText) => {
  if (!bodyText) return;

  const npmOrYarnMatch = bodyText.match(/((npm i\w*)( )(-[a-zA-Z-]+\s)*([a-z0-9-\.\_\@\/]+))|(yarn add ([a-z0-9-\.\_\@\/]+))/i);
  return npmOrYarnMatch && (npmOrYarnMatch[7] || npmOrYarnMatch[5]);
};

const getGithubPlaceholder = () => {
  const container = document.querySelector('article.markdown-body');
  if (container) {
    return {
      container: container,
      nearestElement: container.firstChild,
    };
  }
};

const githubTransformer = (npmPackage, { container, nearestElement }) => ({ gzip, size }) => {
  const badgeGenerator = (href, name, value) =>
    `<a href="${href}"><div class="jsbs-badge-container"><div class="jsbs-badge-label">${name}</div><div class="jsbs-badge-value">${value}</div></div></a>`;

  const link = getBundlephobiaLink(npmPackage);
  const div = document.createElement('div');
  div.className = 'jsbs-github-container';
  div.innerHTML = badgeGenerator(link, 'minified', size) + badgeGenerator(link, 'minified + gzipped', gzip);

  container.insertBefore(div, nearestElement);
};

const main = () => {
  const package = getPackageNameFromGithubBody(document.querySelector('body').innerHTML);
  const placeholder = getGithubPlaceholder();

  if (package && placeholder) {
    const transformer = githubTransformer(package, placeholder);

    fetch(getBundlephobiaAPI(package))
      .then((response) => response.json())
      .then(sizeTransformer)
      .then(transformer)
      .catch(errorHandler);
  }
};

main();
