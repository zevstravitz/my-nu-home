const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8080;
const mongoose = require('./models/db.js');

// Set the template engine to ejs and the views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Define the root route behavior such that the server sends 
// the index template to the client
app.get('/', (req, res) => res.render('index'));

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	// Only start the server if we are able to connect to the database
	app.listen(PORT, () => {
		app.use(require('./routes/listing.js'));

		// Put all other routes above this one.
		app.get('*', (req, res) => {
			res.status(404);

			// respond with html page
			if (req.accepts('html')) {
				res.render('error', {
					status: 404,
					message: 'The page you were looking for could not be found. Go <a href="/">home</a>.'
				});
				return;
			}

			// respond with json
			if (req.accepts('json')) {
				res.send({ error: 'Not found' });
				return;
			}

			// default to plain-text. send()
			res.type('txt').send('Not found');

		});
		console.log(`Server listening on port ${PORT}`);
	});
});