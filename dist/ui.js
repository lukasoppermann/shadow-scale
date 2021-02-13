/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ui/ui.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ui/ui.ts":
/*!**********************!*\
  !*** ./src/ui/ui.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

// selections
const elevationLayerTemplate = document.getElementById('elevationLayerTemplate');
const sectionElevationSettings = document.querySelector('[data-section="elevationSettings"]');
const sectionEmptyState = document.querySelector('[data-section="emptyState"]');
const list = document.getElementById('elevationLayers');
const count = document.querySelector('[data-property="count"]');
const createStyles = document.querySelector('[data-property="createStyles"]');
// events
onmessage = ({ data = undefined }) => {
    if (data !== undefined && data.pluginMessage !== undefined) {
        const eventData = JSON.parse(data.pluginMessage);
        if (eventData.type === 'updateProperties') {
            updatePanel(eventData.properties);
        }
        // toggle state
        toggleEmptyState(eventData.type === 'emptyState');
    }
};
const updatePanel = data => {
    count.value = data.count;
    createStyles.checked = (data.createStyles === true);
    data.elevationLayer.forEach(layer => {
        list.appendChild(createShadowLayer(layer));
    });
};
const toggleEmptyState = active => {
    if (active === true) {
        sectionEmptyState.classList.remove('hidden');
        sectionElevationSettings.classList.add('hidden');
        // hide emptyState
    }
    else {
        sectionEmptyState.classList.add('hidden');
        sectionElevationSettings.classList.remove('hidden');
    }
};
const getShadowLayerValues = shadowDetails => {
    const properties = [
        'type',
        'x',
        'y',
        'radius',
        'spread',
        'color',
        'opacity'
    ];
    const propertyValues = {};
    properties.forEach(property => {
        propertyValues[property] = shadowDetails.querySelector(`[data-property="${property}"]`).value;
    });
    // return values
    return propertyValues;
};
const saveShadows = (list) => {
    // get data for each shadow layer
    const elevationLayers = Array.from(list.querySelectorAll('details')).map(shadowDetails => getShadowLayerValues(shadowDetails));
    // send data
    parent.postMessage({
        pluginMessage: {
            type: 'saveShadows',
            count: count.value,
            createStyles: createStyles.checked,
            elevationLayers
        }
    }, '*');
};
// create scale
document.getElementById('createScale').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'createScale' } }, '*');
};
const createShadowLayer = values => {
    // get clone
    const clone = elevationLayerTemplate.content.cloneNode(true);
    // replace values
    for (const key in values) {
        clone.querySelector(`[data-property="${key}"]`).value = values[key];
    }
    // return layer
    return clone;
};
document.getElementById('add').onclick = () => {
    list.appendChild(createShadowLayer());
};
list.onclick = (e) => {
    if (e.target.dataset.action === 'deleteItem') {
        e.target.parentNode.parentNode.remove();
    }
};
// append new shadowLayer to list
// list.appendChild(createShadowLayer())


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VpL3VpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxtQkFBbUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRkFBa0YsU0FBUztBQUMzRixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsaUJBQWlCLHNCQUFzQixFQUFFO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxJQUFJO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidWkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy91aS91aS50c1wiKTtcbiIsIi8vIHNlbGVjdGlvbnNcbmNvbnN0IGVsZXZhdGlvbkxheWVyVGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWxldmF0aW9uTGF5ZXJUZW1wbGF0ZScpO1xuY29uc3Qgc2VjdGlvbkVsZXZhdGlvblNldHRpbmdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2VjdGlvbj1cImVsZXZhdGlvblNldHRpbmdzXCJdJyk7XG5jb25zdCBzZWN0aW9uRW1wdHlTdGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXNlY3Rpb249XCJlbXB0eVN0YXRlXCJdJyk7XG5jb25zdCBsaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VsZXZhdGlvbkxheWVycycpO1xuY29uc3QgY291bnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wcm9wZXJ0eT1cImNvdW50XCJdJyk7XG5jb25zdCBjcmVhdGVTdHlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wcm9wZXJ0eT1cImNyZWF0ZVN0eWxlc1wiXScpO1xuLy8gZXZlbnRzXG5vbm1lc3NhZ2UgPSAoeyBkYXRhID0gdW5kZWZpbmVkIH0pID0+IHtcbiAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkICYmIGRhdGEucGx1Z2luTWVzc2FnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGV2ZW50RGF0YSA9IEpTT04ucGFyc2UoZGF0YS5wbHVnaW5NZXNzYWdlKTtcbiAgICAgICAgaWYgKGV2ZW50RGF0YS50eXBlID09PSAndXBkYXRlUHJvcGVydGllcycpIHtcbiAgICAgICAgICAgIHVwZGF0ZVBhbmVsKGV2ZW50RGF0YS5wcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0b2dnbGUgc3RhdGVcbiAgICAgICAgdG9nZ2xlRW1wdHlTdGF0ZShldmVudERhdGEudHlwZSA9PT0gJ2VtcHR5U3RhdGUnKTtcbiAgICB9XG59O1xuY29uc3QgdXBkYXRlUGFuZWwgPSBkYXRhID0+IHtcbiAgICBjb3VudC52YWx1ZSA9IGRhdGEuY291bnQ7XG4gICAgY3JlYXRlU3R5bGVzLmNoZWNrZWQgPSAoZGF0YS5jcmVhdGVTdHlsZXMgPT09IHRydWUpO1xuICAgIGRhdGEuZWxldmF0aW9uTGF5ZXIuZm9yRWFjaChsYXllciA9PiB7XG4gICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoY3JlYXRlU2hhZG93TGF5ZXIobGF5ZXIpKTtcbiAgICB9KTtcbn07XG5jb25zdCB0b2dnbGVFbXB0eVN0YXRlID0gYWN0aXZlID0+IHtcbiAgICBpZiAoYWN0aXZlID09PSB0cnVlKSB7XG4gICAgICAgIHNlY3Rpb25FbXB0eVN0YXRlLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgICBzZWN0aW9uRWxldmF0aW9uU2V0dGluZ3MuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgIC8vIGhpZGUgZW1wdHlTdGF0ZVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc2VjdGlvbkVtcHR5U3RhdGUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgIHNlY3Rpb25FbGV2YXRpb25TZXR0aW5ncy5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICB9XG59O1xuY29uc3QgZ2V0U2hhZG93TGF5ZXJWYWx1ZXMgPSBzaGFkb3dEZXRhaWxzID0+IHtcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gW1xuICAgICAgICAndHlwZScsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knLFxuICAgICAgICAncmFkaXVzJyxcbiAgICAgICAgJ3NwcmVhZCcsXG4gICAgICAgICdjb2xvcicsXG4gICAgICAgICdvcGFjaXR5J1xuICAgIF07XG4gICAgY29uc3QgcHJvcGVydHlWYWx1ZXMgPSB7fTtcbiAgICBwcm9wZXJ0aWVzLmZvckVhY2gocHJvcGVydHkgPT4ge1xuICAgICAgICBwcm9wZXJ0eVZhbHVlc1twcm9wZXJ0eV0gPSBzaGFkb3dEZXRhaWxzLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXByb3BlcnR5PVwiJHtwcm9wZXJ0eX1cIl1gKS52YWx1ZTtcbiAgICB9KTtcbiAgICAvLyByZXR1cm4gdmFsdWVzXG4gICAgcmV0dXJuIHByb3BlcnR5VmFsdWVzO1xufTtcbmNvbnN0IHNhdmVTaGFkb3dzID0gKGxpc3QpID0+IHtcbiAgICAvLyBnZXQgZGF0YSBmb3IgZWFjaCBzaGFkb3cgbGF5ZXJcbiAgICBjb25zdCBlbGV2YXRpb25MYXllcnMgPSBBcnJheS5mcm9tKGxpc3QucXVlcnlTZWxlY3RvckFsbCgnZGV0YWlscycpKS5tYXAoc2hhZG93RGV0YWlscyA9PiBnZXRTaGFkb3dMYXllclZhbHVlcyhzaGFkb3dEZXRhaWxzKSk7XG4gICAgLy8gc2VuZCBkYXRhXG4gICAgcGFyZW50LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgcGx1Z2luTWVzc2FnZToge1xuICAgICAgICAgICAgdHlwZTogJ3NhdmVTaGFkb3dzJyxcbiAgICAgICAgICAgIGNvdW50OiBjb3VudC52YWx1ZSxcbiAgICAgICAgICAgIGNyZWF0ZVN0eWxlczogY3JlYXRlU3R5bGVzLmNoZWNrZWQsXG4gICAgICAgICAgICBlbGV2YXRpb25MYXllcnNcbiAgICAgICAgfVxuICAgIH0sICcqJyk7XG59O1xuLy8gY3JlYXRlIHNjYWxlXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3JlYXRlU2NhbGUnKS5vbmNsaWNrID0gKCkgPT4ge1xuICAgIHBhcmVudC5wb3N0TWVzc2FnZSh7IHBsdWdpbk1lc3NhZ2U6IHsgdHlwZTogJ2NyZWF0ZVNjYWxlJyB9IH0sICcqJyk7XG59O1xuY29uc3QgY3JlYXRlU2hhZG93TGF5ZXIgPSB2YWx1ZXMgPT4ge1xuICAgIC8vIGdldCBjbG9uZVxuICAgIGNvbnN0IGNsb25lID0gZWxldmF0aW9uTGF5ZXJUZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAvLyByZXBsYWNlIHZhbHVlc1xuICAgIGZvciAoY29uc3Qga2V5IGluIHZhbHVlcykge1xuICAgICAgICBjbG9uZS5xdWVyeVNlbGVjdG9yKGBbZGF0YS1wcm9wZXJ0eT1cIiR7a2V5fVwiXWApLnZhbHVlID0gdmFsdWVzW2tleV07XG4gICAgfVxuICAgIC8vIHJldHVybiBsYXllclxuICAgIHJldHVybiBjbG9uZTtcbn07XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkJykub25jbGljayA9ICgpID0+IHtcbiAgICBsaXN0LmFwcGVuZENoaWxkKGNyZWF0ZVNoYWRvd0xheWVyKCkpO1xufTtcbmxpc3Qub25jbGljayA9IChlKSA9PiB7XG4gICAgaWYgKGUudGFyZ2V0LmRhdGFzZXQuYWN0aW9uID09PSAnZGVsZXRlSXRlbScpIHtcbiAgICAgICAgZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnJlbW92ZSgpO1xuICAgIH1cbn07XG4vLyBhcHBlbmQgbmV3IHNoYWRvd0xheWVyIHRvIGxpc3Rcbi8vIGxpc3QuYXBwZW5kQ2hpbGQoY3JlYXRlU2hhZG93TGF5ZXIoKSlcbiJdLCJzb3VyY2VSb290IjoiIn0=