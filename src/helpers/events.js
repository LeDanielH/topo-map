const dblClickDelay = 250;

export function getClickHandler(onClick, onDoubleClick, delay) {
	let timeoutId = null;
	let delayAmount = delay || dblClickDelay;
	return function (event) {
		if (!timeoutId) {
			timeoutId = setTimeout((() => {
				onClick(event);
				timeoutId = null;
			}), delayAmount);
		} else {
			timeoutId = clearTimeout(timeoutId);
			onDoubleClick(event);
		}
	};
}

export function fireEvent(ElementId, EventName) {
	if (document.getElementById(ElementId) !== null) {
		if (document.getElementById(ElementId).fireEvent) {
			document.getElementById(ElementId).fireEvent(`on${EventName}`);
		} else {
			const evObj = document.createEvent('Events');
			evObj.initEvent(EventName, true, false);
			document.getElementById(ElementId).dispatchEvent(evObj);
		}
	}
}
