/* global browser */
// - WebExtension -

const getStoredSetting = async (key) => {
  const storage = await browser.storage.local.get()
  return storage[key]
}

const setSetting = async (key, value) => {
  await browser.storage.local.set({
    [key]: value
  })
}