
import redis from "redis"; // PostgreSql connector
import config from "app/dist/config.js"; // Configurations

const client = redis.createClient({ url: config.REDIS_URL });

// Add actions as promises
function fnQuery(key, fn) {
	return new Promise((resolve, reject) => {
		client.get(key, async (err, data) => {
			if (err) // Error en la consulta
				return reject(err);
			if (data) // El dato esta cacheado?
				return resolve(JSON.parse(data));
			const freshData = await fn();
			client.set(key, JSON.stringify(freshData));
			// NO manejo el error de guardado si lo hay
			resolve(freshData); // resuelvo la promesa
		});
	});
}

export default {
	query: fnQuery,

	open: function() {
		client.connect();
		console.log("> Redis DAO open.")
	},
	close: function() {
		client.disconnect();
		console.log("> Redis DAO closed.")
	}
};
