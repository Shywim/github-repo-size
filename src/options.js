const form = document.getElementById('ghs-options-form')
form.addEventListener('submit', e => {
  const token = e.target.elements['ghs-token'].value
  setSetting(TOKEN_KEY, token)
})