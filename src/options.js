const form = document.getElementById('ghs-options-form')
const existingTokenElmt = document.getElementById('existing-token')

async function initForm() {
  const token = await getStoredSetting(TOKEN_KEY)
  if (token) {
    form.elements['ghs-token'].placeholder = '****************************************'
    existingTokenElmt.style.display = 'block'
  }
}
initForm()

form.addEventListener('submit', e => {
  e.preventDefault()
  const token = e.target.elements['ghs-token'].value
  setSetting(TOKEN_KEY, token)
})
