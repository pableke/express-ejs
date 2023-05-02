
const api = {};

function fnFetchJSON(action, token, method, data) {
	const opts = { action, token, method, body: JSON.stringify(data) };
	opts.headers = { "Content-Type":"application/json; charset=utf-8" };
	return api.fetch(opts);
}

api.fetch = opts => {
	opts.headers = opts.headers || {};
	opts.headers["x-requested-with"] = "XMLHttpRequest";
	if (opts.token)
		opts.headers.authorization = "Bearer " + opts.token;
	return window.fetch(opts.action, opts).then(res => {
		const type = res.headers.get("content-type") || "";
		const promise = type.includes("application/json") ? res.json() : res.text();
		return res.ok ? promise : promise.then(data => Promise.reject(data));
	});
}

api.get = (action, token) => api.fetch({ action, token });
api.post = (action, data, token) => fnFetchJSON(action, token, "POST", data);
api.put = (action, data, token) => fnFetchJSON(action, token, "PUT", data);
api.patch = (action, data, token) => fnFetchJSON(action, token, "PATCH", data);
api.delete = (action, token) => api.fetch({ action, token, method: "DELETE" });

export default api;
