const Template = require('../models/Template');
const zlib = require('zlib');

const posts = [
	{ title: 'titulo 1', content: 'conteudo 1' },
	{ title: 'titulo 2', content: 'conteudo 2' },
	{ title: 'titulo 3', content: 'conteudo 3' },
	{ title: 'titulo 4', content: 'conteudo 4' },
	{ title: 'titulo 5', content: 'conteudo 5' },
	{ title: 'titulo 6', content: 'conteudo 6' },
	{ title: 'titulo 7', content: 'conteudo 7' },
	{ title: 'titulo 8', content: 'conteudo 8' },
	{ title: 'titulo 9', content: 'conteudo 9' },
	{ title: 'titulo 10', content: 'conteudo 10' },
];

class Example {
	async index(request, response) {
		let allPosts = [];

		for (let post of posts) {
			allPosts.push(
				Template.get('dudu/post.html', [
					{ search: '{{title}}', replace: post.title },
					{ search: '{{content}}', replace: post.content },
				])
			);
		}

		let content = Template.get('dudu/index.html', [
			{ search: '{{posts}}', replace: allPosts.join('') },
			{ search: '{{teste}}', replace: 'variavel :D' },
			{
				search: '<!-- custom data -->',
				replace: '<p style="color: red;">VERMEIOU O COMENTÁRIO :DD</p>',
			},
		]);

		response.setHeader('Content-Type', 'text/html; charset=utf-8');

		// Resposta padrão
		// return response.send(content);

		//Resposta compactando com ZLIB
		zlib.gzip(content, (err, result) => {
			if (err) {
				response.status(500).send('Server error');
			} else {
				response.set('Content-Encoding', 'gzip');
				// response.set('Content-Type', 'application/json');
				response.send(result);
			}
		});
	}
}

module.exports = new Example();
