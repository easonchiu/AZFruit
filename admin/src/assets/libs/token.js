export const getToken = e => sessionStorage.getItem('token')
export const setToken = e => sessionStorage.setItem('token', e)
export const clearToken = e => sessionStorage.removeItem('token')