const express = require('express');
const Product = require('../../models/Product');
const { upload } = require('../../config/cloudinary');
const router = express.Router();

// UPLOAD IMAGE
router.post('/upload', (req, res, next) => {
    upload.array('images', 5)(req, res, (err) => {
        if (err) {
            console.error('Multer/Cloudinary Error:', err);
            return res.status(500).json({ status: 'fail', message: 'Upload failed: ' + err.message });
        }
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ status: 'fail', message: 'No files uploaded' });
            }
            const urls = req.files.map(file => file.path);
            res.status(200).json({
                status: 'success',
                urls: urls
            });
        } catch (err) {
            res.status(400).json({ status: 'fail', message: err.message });
        }
    });
});

// GET ALL PRODUCTS (with filtering)
router.get('/', async (req, res) => {
    try {
        const { brand, ram, storage, grade, search, sort, minPrice, maxPrice } = req.query;
        let query = {};

        if (brand) query.brand = brand;
        if (grade) query.grade = grade;
        if (ram) query.ram = { $regex: ram, $options: 'i' };
        if (storage) query.storage = { $regex: storage, $options: 'i' };

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }

        let apiQuery = Product.find(query);

        // Sorting
        if (sort) {
            const sortBy = sort.split(',').join(' ');
            apiQuery = apiQuery.sort(sortBy);
        } else {
            apiQuery = apiQuery.sort('-createdAt');
        }

        const products = await apiQuery;

        res.status(200).json({
            status: 'success',
            results: products.length,
            data: { products }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

// GET SINGLE PRODUCT
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }
        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

// CREATE PRODUCT
router.post('/', async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { product: newProduct }
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ status: 'fail', message: 'Product with this SKU already exists' });
        }
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

// UPDATE PRODUCT
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }
        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

// DELETE PRODUCT
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

module.exports = router;
