class Middlewares {
	slash(request, response, next) {
		if (!request.path.startsWith('/public') && !request.path.endsWith('/')) {
			response.redirect(request.path + '/');
		} else {
			next();
		}
	}
}

module.exports = new Middlewares();
