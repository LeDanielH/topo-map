class LocalStorage {

	constructor(typePrefix) {
		this.typePrefix = typePrefix;
		this.storageSupported = 'localStorage' in window;
	}

	setItem(key, val) {
		if (!this.storageSupported) return;
		localStorage.setItem(`${this.typePrefix}-${key}`, val);
	}

	getItem(key) {
		if (!this.storageSupported) return;
		localStorage.getItem(`${this.typePrefix}-${key}`)
	}

	removeItems(key) {
		if (!this.storageSupported) return;
		localStorage.removeItem(`${this.typePrefix}-${key}`);
	}

	getConvertedItem(key, defaultValue, converter) {
		let error, val;
		try {
			val = this.getItem(key);
			if (!val || !val.length) return defaultValue;
			if (converter) return converter(val);
			return val;
		} catch (error1) {
			error = error1;
			console.error(error);
			return defaultValue;
		}
	}
}

export default LocalStorage;
