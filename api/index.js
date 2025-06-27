import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mariadb',
  user: process.env.DB_USER || 'mikrotik_user',
  password: process.env.DB_PASSWORD || 'mikrotik_pass123',
  database: process.env.DB_NAME || 'mikrotik_dashboard',
  waitForConnections: true,
  connectionLimit: 10,
});

app.get('/devices', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM mikrotik_devices');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.post('/devices', async (req, res) => {
  const { name, ip, port, username, password, useHttps } = req.body;
  if (!name || !ip || !username || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const [result] = await pool.execute(
      `INSERT INTO mikrotik_devices (name, ip_address, port, username, password_encrypted, use_https)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, ip, port || 8728, username, password, !!useHttps]
    );
    const [rows] = await pool.query('SELECT * FROM mikrotik_devices WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.put('/devices/:id', async (req, res) => {
  const id = req.params.id;
  const { name, ip, port, username, password, useHttps } = req.body;
  try {
    await pool.execute(
      `UPDATE mikrotik_devices SET name=?, ip_address=?, port=?, username=?, password_encrypted=?, use_https=? WHERE id=?`,
      [name, ip, port, username, password, !!useHttps, id]
    );
    const [rows] = await pool.query('SELECT * FROM mikrotik_devices WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.delete('/devices/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.execute('DELETE FROM mikrotik_devices WHERE id=?', [id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
