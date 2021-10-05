import { TOKEN_KEY } from './constants'
import { getStoredSetting, setSetting } from './userSettings'

async function initForm() {
  const form = document.getElementById('ghs-options-form') as HTMLFormElement
  const existingTokenElmt = document.getElementById('existing-token')

  if (form == null || existingTokenElmt == null) {
    return
  }

  const token = await getStoredSetting(TOKEN_KEY)
  if (token) {
    const input = form.elements.namedItem('ghs-token')
    if (input == null) {
      return
    }
    ;(input as HTMLInputElement).placeholder =
      '****************************************'
    existingTokenElmt.style.display = 'block'
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = form.elements.namedItem('ghs-token')
    if (input == null) {
      return
    }
    const token = (input as HTMLInputElement).value
    setSetting(TOKEN_KEY, token)
  })
}

initForm()
