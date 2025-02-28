const fs = require('fs');
let templatesFolder = fs.readdirSync('templates');

let cache = {};

const fileReader = (path) => {
	if (fs.lstatSync(path).isFile()) {
		cache[path.split('templates/').join('')] = fs.readFileSync(path, 'utf-8');
	} else {
		let files = fs.readdirSync(path);

		for (let file of files) {
			fileReader(`${path}/${file}`);
		}
	}
};

for (let item of templatesFolder) {
	fileReader(`templates/${item}`);
}

cache = Object.freeze(cache);

class Template {
	get(file, replaces = []) {
		let k = cache[file];

		for (let each of replaces) {
			k = k.split(each.search).join(each.replace);
		}

		return k;
	}
}

module.exports = new Template();
