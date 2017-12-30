export const getToken = e => localStorage.getItem('token')
export const setToken = e => localStorage.setItem('token', e)
export const clearToken = e => localStorage.removeItem('token')