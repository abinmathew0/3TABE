const express = require('express');
const router = express.Router();
const { connectToDb, sql } = require('./db');

// GET all todos
router.get('/todos', async (req, res) => {
    try {
        const pool = await connectToDb();
        if (!pool) return res.status(503).json({ error: 'Database not connected' });
        
        const result = await pool.request().query('SELECT * FROM dbo.ToDos ORDER BY createdAt DESC');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST new todo
router.post('/todos', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });

        const pool = await connectToDb();
        if (!pool) return res.status(503).json({ error: 'Database not connected' });

        const result = await pool.request()
            .input('title', sql.NVarChar, title)
            .query('INSERT INTO dbo.ToDos (title, completed) OUTPUT INSERTED.* VALUES (@title, 0)');
        
        res.status(201).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// PUT update todo (toggle complete)
router.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { completed, title } = req.body;

        const pool = await connectToDb();
        if (!pool) return res.status(503).json({ error: 'Database not connected' });

        // Build dynamic update query
        const request = pool.request().input('id', sql.Int, id);
        let query = 'UPDATE dbo.ToDos SET ';
        const updates = [];

        if (completed !== undefined) {
            request.input('completed', sql.Bit, completed);
            updates.push('completed = @completed');
        }
        if (title !== undefined) {
            request.input('title', sql.NVarChar, title);
            updates.push('title = @title');
        }

        if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

        query += updates.join(', ');
        query += ' OUTPUT INSERTED.* WHERE id = @id';

        const result = await request.query(query);

        if (result.recordset.length === 0) return res.status(404).json({ error: 'Todo not found' });

        res.json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE todo
router.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await connectToDb();
        if (!pool) return res.status(503).json({ error: 'Database not connected' });

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM dbo.ToDos OUTPUT DELETED.* WHERE id = @id');

        if (result.recordset.length === 0) return res.status(404).json({ error: 'Todo not found' });

        res.json({ message: 'Todo deleted successfully', id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
