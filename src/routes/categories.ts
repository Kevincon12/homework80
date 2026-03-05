import { Router } from 'express';
import { randomUUID } from 'crypto';
import { readData, writeData } from '../db';
import {Category, Item} from '../types';

const router = Router();
const fileName = 'categories.json';

router.get('/', (req, res) => {
    const categories = readData<Category>(fileName);
    const shortList = categories.map(c => ({
        id: c.id,
        name: c.name
    }));
    res.json(shortList);
});

router.get('/:id', (req, res) => {
    const categories = readData<Category>(fileName);
    const category = categories.find(c => c.id === req.params.id);

    if (!category) {
        return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
});

router.post('/', (req, res) => {
    const { name, description } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Name is required' });
    }

    const categories = readData<Category>(fileName);

    const newCategory: Category = {
        id: randomUUID(),
        name,
        description
    };

    categories.push(newCategory);
    writeData(fileName, categories);

    res.status(201).json(newCategory);
});

router.delete('/:id', (req, res) => {
    const categories = readData<Category>(fileName);
    const items = readData<Item>('items.json');
    const index = categories.findIndex(c => c.id === req.params.id);

    if (index === -1)
        return res.status(404).json({ error: 'Category not found' });

    const used = items.some(item => item.categoryId === req.params.id);

    if (used)
        return res.status(400).json({ error: 'Cannot delete category: it is used in items' });

    categories.splice(index, 1);
    writeData(fileName, categories);

    res.json({ message: 'Category deleted' });
});


export default router;