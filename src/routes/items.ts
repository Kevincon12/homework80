import {Router} from "express";
import {readData, writeData} from "../db";
import {Item} from "../types";
import multer from "multer";
import {randomUUID} from "crypto";
import path from "path";
import fs from "fs";


const router = Router();
const fileName = 'items.json';

const storage = multer.diskStorage({
    destination: 'public/images',
    filename: (req, file, cb) => {
        cb(null, randomUUID() + path.extname(file.originalname));
    }
});

const imagesDir = path.join('public', 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const upload = multer({storage});

router.get('/', (req, res) => {
    const items = readData<Item>(fileName);

    const shortList = items.map(i => ({
        id: i.id,
        name: i.name
    }));

    res.json(shortList);
});

router.get('/:id', (req, res) => {
    const items = readData<Item>(fileName);
    const item = items.find(i => i.id === req.params.id);

    if (!item) {
        return res.status(404).json({error: 'Not Found'});
    }

    res.json(item);
});

router.post('/', upload.single('image'), (req, res) => {
    const {name, description, categoryId, placeId} = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({error: 'Name is required'});
    }

    if (!categoryId) {
        return res.status(400).json({error: 'CategoryId is required'});
    }

    if (!placeId) {
        return res.status(400).json({error: 'PlaceId is required'});
    }

    const items = readData<Item>(fileName);

    const newItem: Item = {
        id: randomUUID(),
        name,
        description,
        categoryId,
        placeId,
        image: req.file ? `images/${req.file.filename}` : null,
        createdAt: new Date().toISOString()
    };

    items.push(newItem);
    writeData(fileName, items);

    res.status(201).json(newItem);
});

router.delete('/:id', (req, res) => {
    const items = readData<Item>(fileName);
    const index = items.findIndex(i => i.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Item Not Found' });
    }

    const itemToDelete = items[index];

    if (itemToDelete.image) {
        const imagePath = path.join('public', itemToDelete.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    items.splice(index, 1);
    writeData(fileName, items);

    res.json({ message: 'Deleted Item' });
});

export default router;