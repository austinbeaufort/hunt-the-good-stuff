const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://austin:turtle1992@cluster0-dzqj8.mongodb.net/test?retryWrites=true"

MongoClient.connect(uri, function(err, client) {
    if(err) {
        console.log('error occured while connecting to MongoDB Atlas...\n', err);
    }
    console.log('Connected...');
    const collection = client.db('test').collection('devices');
    client.close();
});

const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/hunt');
const stories = db.get('stories');
const filter = new Filter();



app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Hunt the Good Stuff! 🏹'
    });
});

app.get('/stories', (req, res) => {
    stories
        .find()
        .then(stories => {
            res.json(stories);
        });
})

function isValidMew(story) {
    return story.name && story.name.toString().trim() !== '' && 
    story.content && story.content.toString().trim() !== '';
}

app.use(rateLimit({
    windowMs: 30 * 1000, 
    max: 1
}));

app.post('/stories', (req, res) => {
    if(isValidMew(req.body)) {
        // insert into db...
        const story = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };
        stories
            .insert(story)
            .then(createdStory => {
                res.json(createdStory);
            });
    }
    else {
        res.status(422);
        res.json({
            message: 'Hey! Please enter a name and some content!'
        });
    }
});

app.listen(5000, () => {
    console.log('listening on http://localhost:5000');
});