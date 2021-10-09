import domLoaded from 'dom-loaded'
import {
  AUTO_ASK_KEY,
  GITHUB_API,
  GITHUB_API_V3,
  REPO_REFRESH_STATS_QUERY,
  REPO_SIZE_ID,
  SIZE_KILO,
  TOKEN_KEY,
  UNITS,
} from './constants'
import {
  askForToken,
  createMissingTokenElement,
  createSizeElements,
  createSizeWrapperElement,
} from './dom'
import {
  HumanSize,
  PartialGitHubRepo,
  PartialGitHubRepoRestV3,
  RepoInfo,
} from './types'
import { getStoredSetting } from './userSettings'

const handleErr = (err: unknown) => {
  console.error(err)
}

const checkIsPrivate = () => {
  if (document.getElementsByClassName('private').length > 0) {
    return true
  }

  return false
}

const getRepoInfo = (url: string): RepoInfo | null => {
  const paths = url.split('/')

  if (paths.length < 2) {
    return null
  }

  return { owner: paths[0], name: paths[1] }
}

const getRepoDataAnon = (repoInfo: RepoInfo) => {
  const url = `${GITHUB_API_V3}${repoInfo.owner}/${repoInfo.name}`
  const request = new window.Request(url)

  return window
    .fetch(request)
    .then<PartialGitHubRepoRestV3>(checkResponse)
    .then((repoData) => repoData.size)
    .catch(handleErr)
}

const getRepoData = (repoInfo: RepoInfo, token: string) => {
  const headers = new window.Headers()
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const request = new window.Request(GITHUB_API, {
    headers: headers,
    method: 'POST',
    body: JSON.stringify({
      query: `query { repository(owner: "${repoInfo.owner}", name: "${repoInfo.name}") { diskUsage } }`,
    }),
  })

  return window
    .fetch(request)
    .then<PartialGitHubRepo>(checkResponse)
    .then(getRepoSize)
    .catch(handleErr)
}

const checkResponse = <T>(resp: Response): Promise<T> => {
  if (resp.status >= 200 && resp.status < 300) {
    return resp.json() as Promise<T>
  }

  throw Error(`Invalid response from github ${resp.status} - ${resp.body}`)
}

const getRepoSize = (data: PartialGitHubRepo) => {
  return data.data.repository.diskUsage
}

const getHumanFileSize = (size: number): HumanSize => {
  if (size === 0) {
    return {
      size: '0',
      unit: UNITS[0],
    }
  }

  const order = Math.floor(Math.log(size) / Math.log(SIZE_KILO))
  return {
    size: (size / Math.pow(SIZE_KILO, order)).toFixed(2),
    unit: UNITS[order],
  }
}

const injectRepoSize = async () => {
  const repoInfo = getRepoInfo(window.location.pathname.substring(1))

  if (repoInfo != null) {
    let statsElt
    const statsRow = document.querySelector(REPO_REFRESH_STATS_QUERY)
    if (statsRow == null) {
      // can't find any element to add our stats element, we stop here
      return
    }
    statsElt = statsRow

    const repoSizeElt = document.getElementById(REPO_SIZE_ID)

    // nothing to do if we already have the size displayed
    if (repoSizeElt != null) {
      return
    }

    const token = await getStoredSetting(TOKEN_KEY)
    if (token == null && checkIsPrivate()) {
      const autoAsk = await getStoredSetting(AUTO_ASK_KEY)
      if (autoAsk == null || autoAsk === true) {
        askForToken()
      }

      createSizeWrapperElement(statsElt, createMissingTokenElement())
      return
    }

    let repoSize
    if (token == null) {
      repoSize = await getRepoDataAnon(repoInfo)
    } else {
      repoSize = await getRepoData(repoInfo, token)
    }

    if (repoSize == null) {
      return
    }

    const humanSize = getHumanFileSize(repoSize * 1024)
    const sizeElt = createSizeElements(humanSize)
    createSizeWrapperElement(statsElt, sizeElt)
  }
}

// Update to each ajax event
document.addEventListener('pjax:end', injectRepoSize, false)

// Update displayed size when a new token is saved
browser.storage.onChanged.addListener((changes) => {
  if (changes[TOKEN_KEY]) {
    injectRepoSize()
  }
})

domLoaded.then(injectRepoSize)
