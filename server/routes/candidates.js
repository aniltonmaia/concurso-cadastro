const express = require('express');
const { body, validationResult } = require('express-validator');
const { Pool } = require('pg');
const router = express.Router();

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'concurso_cadastro',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'senha123'
});

// Get all candidates
router.get('/', async (req, res) => {
  try {
    const { status, position } = req.query;
    let query = 'SELECT * FROM candidates';
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('status = $' + (params.length + 1));
      params.push(status);
    }

    if (position) {
      conditions.push('position ILIKE $' + (params.length + 1));
      params.push('%' + position + '%');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({ candidates: result.rows });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get candidate by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM candidates WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new candidate
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('experience').notEmpty().withMessage('Experience is required'),
  body('education').notEmpty().withMessage('Education is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, position, experience, education } = req.body;

    // Check if candidate already exists
    const existingCandidate = await pool.query('SELECT * FROM candidates WHERE email = $1', [email]);
    if (existingCandidate.rows.length > 0) {
      return res.status(400).json({ error: 'Candidate with this email already exists' });
    }

    const result = await pool.query(
      'INSERT INTO candidates (name, email, phone, position, experience, education, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, email, phone, position, experience, education, 'pending']
    );

    res.status(201).json({
      message: 'Candidate created successfully',
      candidate: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: 'Server error creating candidate' });
  }
});

// Update candidate
router.put('/:id', [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
  body('position').optional().notEmpty().withMessage('Position cannot be empty'),
  body('experience').optional().notEmpty().withMessage('Experience cannot be empty'),
  body('education').optional().notEmpty().withMessage('Education cannot be empty'),
  body('status').optional().isIn(['pending', 'reviewing', 'approved', 'rejected']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, position, experience, education, status } = req.body;
    const id = req.params.id;

    // Check if candidate exists
    const existingCandidate = await pool.query('SELECT * FROM candidates WHERE id = $1', [id]);
    if (existingCandidate.rows.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Check if email is being changed and already exists
    if (email && email !== existingCandidate.rows[0].email) {
      const emailCheck = await pool.query('SELECT * FROM candidates WHERE email = $1 AND id != $2', [email, id]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Candidate with this email already exists' });
      }
    }

    const result = await pool.query(
      'UPDATE candidates SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone), position = COALESCE($4, position), experience = COALESCE($5, experience), education = COALESCE($6, education), status = COALESCE($7, status) WHERE id = $8 RETURNING *',
      [name, email, phone, position, experience, education, status, id]
    );

    res.json({
      message: 'Candidate updated successfully',
      candidate: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ error: 'Server error updating candidate' });
  }
});

// Update candidate status
router.patch('/:id/status', [
  body('status').isIn(['pending', 'reviewing', 'approved', 'rejected']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const id = req.params.id;

    const result = await pool.query(
      'UPDATE candidates SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json({
      message: 'Candidate status updated successfully',
      candidate: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating candidate status:', error);
    res.status(500).json({ error: 'Server error updating candidate status' });
  }
});

// Delete candidate
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM candidates WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json({
      message: 'Candidate deleted successfully',
      candidate: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: 'Server error deleting candidate' });
  }
});

module.exports = router;
