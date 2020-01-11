const form = document.getElementById('ghs-options-form')
const existingTokenElmt = document.getElementBuId('existing-token')

async function initForm() {
  const token = await getStoredSetting(TOKEN_KEY)
  if (token) {
    existingTokenElmt.style.display = 'block'
  }
}
initForm()

form.addEventListener('submit', e => {
  const token = e.target.elements['ghs-token'].value
  setSetting(TOKEN_KEY, token)
})
