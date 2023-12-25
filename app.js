const express = require('express')  ;
const path = require('path') ;
const cors = require('cors');

const app = express();
const port = 3000;

// API ENDPOINTS
const post = require('./API/POST/post-request')
const get = require('./API/GET/get-request')

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '')));


app.get('/', (req, res) =>{
    res.send('Hello World!')
})
app.get('/api/test', (req, res) => {
    res.json({ message: 'Ini adalah data rahasia yang hanya dapat diakses dengan token.' });
});



app.use('/api/get', get) ;
app.use('/api/post', post) ;

app.listen(process.env.PORT || port, () => {
    console.log(`Server berjalan di port ${port} on http://localhost:${port}`);
});

