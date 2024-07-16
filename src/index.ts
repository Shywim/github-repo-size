import domLoaded from 'dom-loaded'
import {
  AUTO_ASK_KEY,
  ERROR_UNAUTHORIZED,
  ERROR_UNKNOWN,
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
  createErrorElement,
  createMissingTokenElement,
  createSizeElements,
  createSizeWrapperElement,
  waitForElm
} from './dom'
import {
  HumanSize,
  PartialGitHubRepo,
  PartialGitHubRepoRestV3,
  RepoInfo,
} from './types'
import { getStoredSetting } from './userSettings'

const checkIsPrivate = () => {
  return (
    document.querySelector(
      '#repository-container-header .Label.Label--secondary'
    )?.innerHTML === 'Private'
  )
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
}

const checkResponse = <T>(resp: Response): Promise<T> => {
  if (resp.status >= 200 && resp.status < 300) {
    return resp.json() as Promise<T>
  }

  if (resp.status === 401) {
    throw new Error(ERROR_UNAUTHORIZED)
  }

  throw new Error(ERROR_UNKNOWN)
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
    let statsRow = document.querySelector(REPO_REFRESH_STATS_QUERY)
    if (statsRow == null) {
      if (document.querySelector("#code-tab.selected")) {
        waitForElm(REPO_REFRESH_STATS_QUERY)
        statsRow = document.querySelector(REPO_REFRESH_STATS_QUERY)
      } else {
        // can't find any element to add our stats element, we stop here
        return
      }
    }
    statsElt = statsRow

    const repoSizeElt = document.getElementById(REPO_SIZE_ID)
    if (repoSizeElt != null) {
      repoSizeElt.remove()
    }

    const token = await getStoredSetting(TOKEN_KEY)
    if ((token == null || token === '') && checkIsPrivate()) {
      const autoAsk = await getStoredSetting(AUTO_ASK_KEY)
      if (autoAsk == null || autoAsk === true) {
        askForToken()
      }

      createSizeWrapperElement(statsElt, createMissingTokenElement())
      return
    }

    let repoSize
    try {
      if (token == null) {
        repoSize = await getRepoDataAnon(repoInfo)
      } else {
        repoSize = await getRepoData(repoInfo, token)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === ERROR_UNAUTHORIZED) {
          createSizeWrapperElement(
            statsElt,
            createErrorElement('Unauthorized Token!')
          )
        } else {
          createSizeWrapperElement(
            statsElt,
            createErrorElement('Unknown Error!')
          )
        }
      }
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
document.addEventListener('ready pjax:end', injectRepoSize, false)

// Update on every URL change
// https://stackoverflow.com/questions/75908148/mozilla-add-on-run-function-when-url-changes-not-just-on-page-load
let previousUrl:string = '';
let observer = new MutationObserver(function (mutations) {
    if (location.href !== previousUrl) {
        previousUrl = location.href;
        injectRepoSize()
    }
});

const config = {attributes: true, childList: true, subtree: true};
observer.observe(document, config);

// Update displayed size when a new token is saved
browser.storage.onChanged.addListener((changes) => {
  console.log(changes)
  if (changes[TOKEN_KEY]) {
    injectRepoSize()
  }
})

//domLoaded.then(injectRepoSize)
