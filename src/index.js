const GITHUB_API = 'https://api.github.com/repos/'
const REPO_STATS_CLASS = 'numbers-summary'
const REPO_SIZE_ID = 'addon-repo-size'
const SIZE_KILO = 1024
const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

const handleErr = (err) => {
  console.error(err)
}

const getRepoSlug = (url) => {
  const pathes = url.split('/')

  if (pathes.length < 2) {
    return null
  }

  return pathes[0] + '/' + pathes[1]
}

const getRepoData = (slug) => {
  const request = new window.Request(GITHUB_API + slug)

  return window.fetch(request)
  .then(checkResponse)
  .then(getRepoSize)
  .catch(handleErr)
}

const checkResponse = (resp) => {
  if (resp.status >= 200 && resp.status < 300) {
    return resp.json()
  }

  throw Error(`Invalid response from github ${resp.status} - ${resp.body}`)
}

const getRepoSize = (repoData) => {
  return repoData.size
}

const getHumanFileSize = (size) => {
  if (size === 0) {
    return {
      size: '0',
      unit: UNITS[0]
    }
  }

  const order = Math.floor(Math.log(size) / Math.log(SIZE_KILO))
  return {
    size: parseFloat((size / Math.pow(SIZE_KILO, order))).toFixed(2),
    unit: UNITS[order]
  }
}

const injectRepoSize = () => {
  const repoSlug = getRepoSlug(window.location.pathname.substring(1))

  if (repoSlug != null) {
    const statsCol = document.getElementsByClassName(REPO_STATS_CLASS)

    if (statsCol.length !== 1) {
      return
    }

    const statsElt = statsCol[0]
    const repoSizeElt = document.getElementById(REPO_SIZE_ID)

    if (repoSizeElt == null) {
      getRepoData(repoSlug)
      .then(repoSize => {
        if (repoSize == null) {
          return
        }

        const humanSize = getHumanFileSize(repoSize * 1024)

        const sizeTag = createSizeElement(humanSize)
        statsElt.appendChild(sizeTag)
      })
    }
  }
}

const createSizeElement = (repoSizeHuman) => {
  const li = document.createElement('li')
  li.id = REPO_SIZE_ID
  li.setAttribute('title', 'As reported by the GitHub API, it mays differ from the actual repository size.')
  const elt = document.createElement('a')
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  icon.className.baseVal = 'octicon octicon-database'
  icon.setAttribute('height', 16)
  icon.setAttribute('width', 14)
  icon.setAttribute('viewBox', '0 0 14 16')
  icon.setAttribute('aria-hidden', true)
  icon.setAttribute('version', '1.1')
  const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  iconPath.setAttribute('d', 'M6,15 C2.69,15 0,14.1 0,13 L0,11 C0,10.83 0.09,10.66 0.21,10.5 C0.88,11.36 3.21,12 6,12 C8.79,12 11.12,11.36 11.79,10.5 C11.92,10.66 12,10.83 12,11 L12,13 C12,14.1 9.31,15 6,15 L6,15 Z M6,11 C2.69,11 0,10.1 0,9 L0,7 C0,6.89 0.04,6.79 0.09,6.69 L0.09,6.69 C0.12,6.63 0.16,6.56 0.21,6.5 C0.88,7.36 3.21,8 6,8 C8.79,8 11.12,7.36 11.79,6.5 C11.84,6.56 11.88,6.63 11.91,6.69 L11.91,6.69 C11.96,6.79 12,6.9 12,7 L12,9 C12,10.1 9.31,11 6,11 L6,11 Z M6,7 C2.69,7 0,6.1 0,5 L0,4 L0,3 C0,1.9 2.69,1 6,1 C9.31,1 12,1.9 12,3 L12,4 L12,5 C12,6.1 9.31,7 6,7 L6,7 Z M6,2 C3.79,2 2,2.45 2,3 C2,3.55 3.79,4 6,4 C8.21,4 10,3.55 10,3 C10,2.45 8.21,2 6,2 L6,2 Z')
  iconPath.setAttribute('fill-rule', 'evenodd')
  icon.appendChild(iconPath)
  elt.appendChild(icon)
  const size = document.createElement('span')
  size.className = 'num text-emphasized'
  const sizeText = document.createTextNode(repoSizeHuman.size)
  size.appendChild(sizeText)
  elt.appendChild(size)
  const unitText = document.createTextNode(repoSizeHuman.unit)
  elt.appendChild(unitText)
  li.appendChild(elt)
  return li
}

// Update to each ajax event
document.addEventListener('pjax:end', injectRepoSize, false)

injectRepoSize()
