export const setStorage = (key, data) => {
  if (!key || !data) return
  localStorage.setItem(key, JSON.stringify(data))
}
export const getStorage = key => {
  if (!key) return
  let data = localStorage.getItem(key)
  return data ? JSON.parse(data) : data
}
