/** localStorage segur: no falla en mode privat ni si l'emmagatzematge està bloquejat. */
export const storage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      /* ignorat */
    }
  },
}
