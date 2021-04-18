const getPackageNameFromNpm = (url) => {
  if (!url) return;

  const match = url.match(/(https:\/\/www.npmjs.com\/package\/)(.+)/i);
  return match && match[2];
};

const getNpmPlaceholder = () => {
  const sidebarDivs = document.querySelectorAll('div.pr2');
  const nearestElement = sidebarDivs[sidebarDivs.length - 5];
  if (nearestElement) {
    return {
      container: nearestElement.parentNode,
      nearestElement,
    };
  }
};

const npmTransformer = (npmPackage, { container, nearestElement }) => ({ gzip, size }) => {
  const npmDivClassList = 'dib w-50 bb b--black-10 pr2';
  const npmInnerHTMLGenerator = (header, package, value) =>
    `<h3 class="f5 mt2 pt2 mb0 black-50">${header}</h3><p class="fw6 mb3 mt2 truncate black-80 f4"><a class="fw6 mb3 mt2 truncate black-80 f4 link" href="${getBundlephobiaLink(
      package
    )}">${value}</a></p>`;

  const sizeDiv = document.createElement('div');
  container.insertBefore(sizeDiv, nearestElement);
  sizeDiv.classList = npmDivClassList;
  sizeDiv.innerHTML = npmInnerHTMLGenerator('Minified', npmPackage, size);

  const gzipDiv = document.createElement('div');
  container.insertBefore(gzipDiv, nearestElement);
  gzipDiv.classList = npmDivClassList;
  gzipDiv.innerHTML = npmInnerHTMLGenerator('Minified + Gzipped', npmPackage, gzip);
};

const main = () => {
  const package = getPackageNameFromNpm(window.location.href);
  const placeholder = getNpmPlaceholder();

  if (package && placeholder) {
    const transformer = npmTransformer(package, placeholder);

    fetch(getBundlephobiaAPI(package))
      .then((response) => response.json())
      .then(sizeTransformer)
      .then(transformer)
      .catch(errorHandler);
  }
};

main();
