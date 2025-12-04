import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
}));
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Express server is running');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
