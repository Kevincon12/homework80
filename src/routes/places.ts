import {Router} from "express";
import {readData, writeData} from "../db";
import {Place} from "../types";
import {randomUUID} from "crypto";


const router = Router();
const fileName = 'places.json';

router.get('/', (req, res) => {
    const places = readData<Place>(fileName);

    const shortList = places.map(p => ({
        id: p.id,
        name: p.name
    }));

    res.json(shortList);
});

router.get('/:id', (req, res) => {
    const places = readData<Place>(fileName);
    const place = places.find(p => p.id === req.params.id);

    if (!place) {
        return res.status(404).send({error: 'Place Not Found'});
    }

    res.json(place);
});

router.post('/', (req, res) => {
    const {name, description} = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({error: 'Name is required'});
    }

    const places = readData<Place>(fileName);

    const newPlace: Place = {
        id: randomUUID(),
        name,
        description
    };

    places.push(newPlace);
    writeData(fileName, places);

    res.status(201).json(newPlace);
});

router.delete('/:id', (req, res) => {
    const places = readData<Place>(fileName);
    const index = places.findIndex(p => p.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({error: 'Place Not Found'});
    }

    places.splice(index, 1);
    writeData(fileName, places);

    res.json({message: 'Deleted Place'});
});

export default router;