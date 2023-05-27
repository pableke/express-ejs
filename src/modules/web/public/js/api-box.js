
const api = {};

api.fetch = opts => {
	opts.headers = opts.headers || {};
	opts.headers["x-requested-with"] = "XMLHttpRequest";
	if (opts.token)
		opts.headers.authorization = "Bearer " + opts.token;
	return globalThis.fetch(opts.action, opts).then(res => {
		const type = res.headers.get("content-type") || "";
		const promise = type.includes("application/json") ? res.json() : res.text();
		return res.ok ? promise : promise.then(data => Promise.reject(data));
	});
}

function fnFetchJSON(action, token, method, data) {
	const opts = { action, token, method, body: JSON.stringify(data) };
	opts.headers = { "Content-Type":"application/json; charset=utf-8" };
	return api.fetch(opts);
}

api.post = (action, data, token) => fnFetchJSON(action, token, "POST", data);
api.put = (action, data, token) => fnFetchJSON(action, token, "PUT", data);
api.patch = (action, data, token) => fnFetchJSON(action, token, "PATCH", data);
api.delete = (action, token) => api.fetch({ action, token, method: "DELETE" });

api.get = (action, data, token) => {
	const opts = { action, token };
	if (data) {
		const qs = new URLSearchParams(data);
		opts.action += "?" + qs.toString();
	}
	return api.fetch(opts);
}
api.send = function(action, fd) {
	const opts = { action };
	opts.method = "post";
	opts.body = fd; //enctype = multipart/form-data
	return api.fetch(opts);
}

export default api;
