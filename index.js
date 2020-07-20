const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Invoke Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.json({
        message: 'Express API',
        date: Date()
    })
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
});