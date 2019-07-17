export default {
	fetch(key) {
		return JSON.parse(window.sessionStorage.getItem(key)
		 || '[]')
	},
	save(key, items) {
		window.sessionStorage.setItem(key, JSON.stringify(items))
	},
	clear() {
		window.sessionStorage.clear();
	}
}