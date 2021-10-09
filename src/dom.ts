import {
  AUTO_ASK_KEY,
  MODAL_ID,
  REPO_SIZE_ID,
  TOKEN_INPUT_ID,
  TOKEN_KEY,
} from './constants'
import { HumanSize } from './types'
import { getStoredSetting, setSetting } from './userSettings'

export const askForToken = async (e?: Event) => {
  if (e != null) {
    e.preventDefault()
  }

  document
    .getElementById(`${MODAL_ID}-size-stat-wrapper`)
    ?.setAttribute('open', '')
}

const saveToken = (e: Event) => {
  e.preventDefault()
  const token = (
    (e.target as HTMLFormElement | null)?.elements.namedItem(
      TOKEN_INPUT_ID
    ) as HTMLInputElement | null
  )?.value
  setSetting(TOKEN_KEY, token)
  closeModal()
}

const closeModal = () => {
  document
    .getElementById(`${MODAL_ID}-size-stat-wrapper`)
    ?.removeAttribute('open')
  setSetting(AUTO_ASK_KEY, false)
}

export const createMissingTokenElement = () => {
  const text = document.createTextNode('Missing token!')

  return text
}

export const createSizeElements = (repoSizeHuman: HumanSize) => {
  const sizeContainer = document.createElement('span')
  sizeContainer.className = 'd-none d-sm-inline'

  const size = document.createElement('strong')
  const sizeText = document.createTextNode(repoSizeHuman.size)
  size.appendChild(sizeText)

  const whiteSpace = document.createTextNode(' ')

  const unitContainer = document.createElement('span')
  unitContainer.className = 'color-text-secondary d-none d-lg-inline'
  unitContainer.ariaLabel = `Size of repository in ${repoSizeHuman.unit}`
  const unitText = document.createTextNode(repoSizeHuman.unit)
  unitContainer.appendChild(unitText)

  sizeContainer.appendChild(size)
  sizeContainer.appendChild(whiteSpace)
  sizeContainer.appendChild(unitContainer)

  return sizeContainer
}

export const createSizeWrapperElement = async (
  parent: Element,
  children: Node
) => {
  const storedToken = await getStoredSetting(TOKEN_KEY)
  let tokenInfo = '',
    tokenPlaceholder = ''
  if (storedToken) {
    tokenPlaceholder = '****************************************'
    tokenInfo = `
      <div class="flash flash-full flash-info">
        A token is already saved, but is not displayed for obvious security reasons.
      </div>
    `
  }
  const li = document.createElement('li')
  li.id = REPO_SIZE_ID
  li.className = "ml-0 ml-md-3"

  li.innerHTML = `
  <details id="${MODAL_ID}-size-stat-wrapper" class="details-reset details-overlay details-overlay-dark">
    <summary>
      <a id="${MODAL_ID}-size-stat-content" class="pl-3 pr-3 py-3 p-md-0 mt-n3 mb-n3 mr-n3 m-md-0 Link--primary no-underline no-wrap" title="As reported by the GitHub API, it mays differ from the actual repository size.">
        <svg class="octicon octicon-database" height="16" width="14" viewBox="0 0 14 16" aria-hidden="true" version="1.1"><path d="M6,15 C2.69,15 0,14.1 0,13 L0,11 C0,10.83 0.09,10.66 0.21,10.5 C0.88,11.36 3.21,12 6,12 C8.79,12 11.12,11.36 11.79,10.5 C11.92,10.66 12,10.83 12,11 L12,13 C12,14.1 9.31,15 6,15 L6,15 Z M6,11 C2.69,11 0,10.1 0,9 L0,7 C0,6.89 0.04,6.79 0.09,6.69 L0.09,6.69 C0.12,6.63 0.16,6.56 0.21,6.5 C0.88,7.36 3.21,8 6,8 C8.79,8 11.12,7.36 11.79,6.5 C11.84,6.56 11.88,6.63 11.91,6.69 L11.91,6.69 C11.96,6.79 12,6.9 12,7 L12,9 C12,10.1 9.31,11 6,11 L6,11 Z M6,7 C2.69,7 0,6.1 0,5 L0,4 L0,3 C0,1.9 2.69,1 6,1 C9.31,1 12,1.9 12,3 L12,4 L12,5 C12,6.1 9.31,7 6,7 L6,7 Z M6,2 C3.79,2 2,2.45 2,3 C2,3.55 3.79,4 6,4 C8.21,4 10,3.55 10,3 C10,2.45 8.21,2 6,2 L6,2 Z" fill-rule="evenodd"></path></svg>
      </a>
    </summary>
    <details-dialog style="white-space: normal" class="details-dialog rounded-1 anim-fade-in fast Box Box--overlay">
      <form id="${MODAL_ID}-form" style="text-align: left" class="position-relative flex-auto js-user-status-form">
        <div class="Box-header bg-gray border-bottom p-3">
          <button id="${MODAL_ID}-modal-close" class="Box-btn-octicon js-toggle-ghs-token-edit btn-octicon float-right" type="reset" aria-label="Close dialog" data-close-dialog="">
            <svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
          </button>
          <h3 class="Box-title f5 text-bold text-gray-dark">GitHub Repository Size Settings</h3>
        </div>
        <div class="px-3 py-2 text-gray-dark">
          <p class="text-gray">You need to provide a Personal Access Token to access size of private repositories.<br>
          You can create one in your <a style="display: inline; color: #0366d6;" href="https://github.com/settings/tokens">GitHub settings</a>. <strong>(don't forget to check the "repo" permission)</strong><br>
          <span style="font-size: 10px; font-weight: 600;">(to show this dialog again, click on the size element in any public repository)</span></p>
          <div class="form-group">
            <label for="gh_token">Personal Access Token</label>
            <input id="${TOKEN_INPUT_ID}" class="form-control long" autocomplete="off" type="text" name="gh_token" placeholder="${tokenPlaceholder}">
          </div>
        </div>
        ${tokenInfo}
        <div class="flash flash-full flash-warn">
          <strong>Beware if you use a public device!</strong> The token will be saved locally, in the browser storage.
        </div>
        <div class="d-flex flex-items-center flex-justify-between p-3 border-top">
          <button type="submit" class="btn btn-primary first-in-line">
            Save
          </button>
        </div>
      </form>
    </details-dialog>
  </details>
  `

  parent.appendChild(li)

  const elt = document.getElementById(`${MODAL_ID}-size-stat-content`)
  if (elt == null) {
    return
  }
  elt.addEventListener('click', askForToken)
  elt.appendChild(document.createTextNode(' '))

  const closeModalBtn = document.getElementById(`${MODAL_ID}-modal-close`)
  if (closeModalBtn == null) {
    return
  }
  closeModalBtn.addEventListener('click', closeModal)

  const form = document.getElementById(`${MODAL_ID}-form`)
  if (form == null) {
    return
  }
  form.addEventListener('submit', saveToken)

  elt.appendChild(children)
}
