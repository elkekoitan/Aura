// Web stub for React Native's RCTNetworking used by devtools loadBundleFromServer
// Provides a minimal event-based interface compatible with RN's wrappers.

let _nextRequestId = 1;
const _listeners = new Map(); // eventName -> Set<fn>

function _emit(eventName, payload) {
  const set = _listeners.get(eventName);
  if (!set) return;
  for (const fn of Array.from(set)) {
    try { fn(payload); } catch (e) { /* ignore */ }
  }
}

function addListener(eventName, listener) {
  let set = _listeners.get(eventName);
  if (!set) {
    set = new Set();
    _listeners.set(eventName, set);
  }
  set.add(listener);
  return { remove() { set.delete(listener); } };
}

const _controllers = new Map(); // id -> AbortController

function sendRequest(
  method,
  /* trackingName */ _trackingName,
  url,
  headers = {},
  data = '',
  responseType = 'text',
  incrementalUpdates = false,
  timeout = 0,
  onRequestId,
  withCredentials = true
) {
  const id = _nextRequestId++;
  onRequestId && onRequestId(id);

  const controller = new AbortController();
  _controllers.set(id, controller);

  const fetchInit = {
    method,
    headers,
    body: method && method.toUpperCase() !== 'GET' ? data : undefined,
    signal: controller.signal,
    credentials: withCredentials ? 'include' : 'same-origin'
  };

  const timer = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null;

  fetch(url, fetchInit)
    .then(async res => {
      const headersObj = {};
      res.headers.forEach((v, k) => { headersObj[k] = v; });
      _emit('didReceiveNetworkResponse', [id, res.status, headersObj]);

      let bodyText;
      if (responseType === 'text' || responseType === 'json') {
        bodyText = await res.text();
      } else {
        bodyText = await res.text(); // fallback
      }

      if (incrementalUpdates) {
        // We don't stream; emit as a single chunk
        _emit('didReceiveNetworkIncrementalData', [id, bodyText]);
      } else {
        _emit('didReceiveNetworkData', [id, bodyText]);
      }

      _emit('didCompleteNetworkResponse', [id, null]);
    })
    .catch(err => {
      _emit('didCompleteNetworkResponse', [id, String(err && err.message ? err.message : err)]);
    })
    .finally(() => {
      if (timer) clearTimeout(timer);
      _controllers.delete(id);
    });
}

function abortRequest(id) {
  const controller = _controllers.get(id);
  if (controller) {
    controller.abort();
    _controllers.delete(id);
  }
}

export default { addListener, sendRequest, abortRequest };