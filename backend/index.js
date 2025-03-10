const express = require('express');
const mongoose = require('mongoose');
const userRoute = require("./routes/userRoute");

const app = express();
const port = 8080;

mongoose.connect('mongodb://localhost:27017/whispr', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

app.use(express.json());

app.use('/user', userRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});