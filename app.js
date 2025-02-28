const LiveDirectory = require('live-directory');
const HyperExpress = require('hyper-express');
const Socket = require('./models/Socket');
const Middlewares = require('./middlewares');
const Example = require('./controllers/Example');

const publicAssets = new LiveDirectory(`${__dirname}/public/`, {
	cache: {
		max_file_count: 1000,
		max_file_size: 1024 * 1024 * 100,
	},
});

const app = new HyperExpress.Server();

app.get('/public/*', (request, response) => {
	// Strip away '/assets' from the request path to get asset relative path
	// Lookup LiveFile instance from our LiveDirectory instance.
	const path = request.path.replace('/public', '');
	const file = publicAssets.get(path);

	// Return a 404 if no asset/file exists on the derived path
	if (file === undefined) return response.status(404).send();

	const fileParts = file.path.split('.');
	const extension = fileParts[fileParts.length - 1];

	// Retrieve the file content and serve it depending on the type of content available for this file
	const content = file.content;
	if (content instanceof Buffer) {
		// Set appropriate mime-type and serve file content Buffer as response body (This means that the file content was cached in memory)
		return response.type(extension).send(content);
	} else {
		// Set the type and stream the content as the response body (This means that the file content was NOT cached in memory)
		return response.type(extension).stream(content);
	}
});

// Middleware to append trailing slash
app.use(Middlewares.slash);

// Setar CORS para evitar erro de cors origins caso carregue em outro dominio algo desse
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*'); // Substitua '*' pelo domínio específico em produção
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

	// Responder a requisições de pré-voo (OPTIONS)
	if (req.method === 'OPTIONS') {
		res.status(200).send();
	} else {
		next();
	}
});

app.get('/', Example.index);
app.get('/socket/', Example.socketExample);
app.post('/api/socket/execute/', Example.socketExecution);

// Handle WebSocket connections
app.ws('/connect/', (connection) => {
	// Parse the URL to get the query parameters
	connection.setMaxListeners(0);
	Socket.connect(connection);
});

app.listen(3000)
	.then(() => {
		console.log(`Webserver started on port 3000`);
	})
	.catch((code) => console.log(`Failed to start webserver on port 3000: ` + code));
