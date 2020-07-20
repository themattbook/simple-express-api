const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');
const redis = require('redis');

// Invoke Express
const app = express();

// Invoke Redis
const port_redis = process.env.REDIS_PORT || 6379;
const redis_client = redis.createClient(port_redis);

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// Check Redis Store for Existing Entry
checkCache = (req, res, next) => {
    const { id } = req.params;
    redis_client.get(id, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      // If no match found
      if (data != null) {
        res.send(data);
      } else {
        // Proceed to next middleware function
        next();
      }
    });
};

app.get('/', (req, res) => {
    res.json({
        message: 'API Version 1.0',
        date: Date()
    })
});

// GET Request to Test Redis Cache
app.get('/starships/:id', checkCache, async (req, res) => {
    try {
        const { id } = req.params;
        const starShipInfo = await axios.get(`https://swapi.dev/api/starships/${id}`);
        const starShipInfoData = starShipInfo.data;
        redis_client.setex(id, 3600, JSON.stringify(starShipInfoData));
        console.log(starShipInfoData);
        return res.json(starShipInfoData);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
});