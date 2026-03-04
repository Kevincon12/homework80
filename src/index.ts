import express from 'express';
import cors from 'cors';
import categoriesRouter from './routes/categories';
import placesRouter from './routes/places';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use('/categories', categoriesRouter);
app.use('/places', placesRouter);

app.get('/', (req, res) => {
    res.json({ message: 'HOMEWORK80 is running' });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});