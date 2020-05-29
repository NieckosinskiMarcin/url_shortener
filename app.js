const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const validUrl = require('valid-url');
const models = require('./models');
const router = express.Router();
const app = express();
const port = 8081;
const path = __dirname + '/views/';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

router.get('/', (req, res) => {
    res.sendFile(path + 'index.html');
});

router.get('/contact', (req, res) => {
    res.sendFIle(path + 'contact.html');
});

router.get('/:url', async(req, res) => {
    try {
	let url = await models.findURL(req.params.url);
	if (url !== null) {
	     res.redirect(url);
	} else {
	    res.send('invalid/expired URL');
	}
    }
    catch(e) {
	console.log(e);
	res.send('invalid/expired URL');
    }
});

router.post('/api/short', async (req, res) => {
    if(validUrl.isUri(req.body.url)) {
	try {
	    let hash = await models.storeURL(req.body.url);
	    res.send('localhost:8080/' + hash);
	}
	catch(e) {
	    console.log(e);
	    res.send('error occurred while storing URL.');
	}
    } else {
	res.send('invalid URL');
    }
});

app.use(express.static(path));
app.use('/', router);

app.listen(port || 3000, function() {
  console.log(`App listening at localhost:8080`);
});
