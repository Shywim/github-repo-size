export const getStoredSetting = async (key: string) => {
  const storage = await browser.storage.local.get()
  return storage[key]
}

export const setSetting = async (key: string, value: unknown) => {
  await browser.storage.local.set({
    [key]: value
  })
}