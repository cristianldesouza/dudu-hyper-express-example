const verySafeHash = (length) => {
	let chars = 'abcdefghijklmnopqrswxyzABCDEFGHIJKLMNOPQRSTUWZYZ';
	let text = '';
	for (let i = 0; i < length; i++) {
		text += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return text;
};

const connections = {};

class Socket {
	connect(socket) {
		const hash = verySafeHash(35);

		connections[hash] = socket;

		socket.on('close', () => {
			console.log(`Connection closed ${hash}`);
			delete connections[hash];
		});

		console.log(`Connection connected ${hash}`);
		socket.send(JSON.stringify({ message: 'Connected', skt: hash }));
	}

	message(skt, msg) {
		connections[skt]?.send(JSON.stringify({ message: msg }));
	}
}

module.exports = new Socket();
