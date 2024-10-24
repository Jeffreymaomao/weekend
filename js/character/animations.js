export function setWeight(action, weight) {
	action.enabled = true;
	action.setEffectiveTimeScale(1);
	action.setEffectiveWeight(weight);
}

export function crossFadeAction(mixer, startActionState, endActionState, duration) {
	if (!startActionState) {
		setWeight(endActionState.action, 1); // start is not exist: do end
	} else if (startActionState.name === endActionState.name){
		return; // if start=end action : do nothing
	} else if (startActionState.name === 'idle') {
		executeDirectlyCrossFade(startActionState.action, endActionState.action, duration);
	} else if (endActionState.name === 'idle') {
		executeDirectlyCrossFade(startActionState.action, endActionState.action, 0.2);
	} else {
		waitFinishedDoCrossFade(mixer, startActionState.action, endActionState.action, duration);
	}
}

function executeDirectlyCrossFade(startAction, endAction, duration) {
	if (endAction) {
		setWeight(endAction, 1);
		endAction.time = 0;
		if (startAction) {
			startAction.crossFadeTo(endAction, duration, true);
		} else {
			endAction.fadeIn(duration);
		}
	} else {
		startAction.fadeOut(duration);
	}
}

function waitFinishedDoCrossFade(mixer, startAction, endAction, duration) {
	mixer.addEventListener('loop', onLoopFinished);
	function onLoopFinished(event) {
		if (event.action === startAction) {
			mixer.removeEventListener('loop', onLoopFinished);
			executeDirectlyCrossFade(startAction, endAction, duration);
		}
	}
}