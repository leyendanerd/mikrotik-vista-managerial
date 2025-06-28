import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { RouterOSClient } from 'routeros-client';

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

// Keep RouterOS connections alive
const connections = new Map();

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
  const { name, ip, port, username, password, useHttps, status, lastSeen, version, board, uptime } = req.body;
  if (!name || !ip || !username || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const [result] = await pool.execute(
      `INSERT INTO mikrotik_devices (name, ip_address, port, username, password_encrypted, use_https, status, last_seen, version, board, uptime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, ip, port || 8728, username, password, !!useHttps, status || 'offline', lastSeen || null, version || null, board || null, uptime || null]
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
  const { name, ip, port, username, password, useHttps, status, lastSeen, version, board, uptime } = req.body;
  try {
    await pool.execute(
      `UPDATE mikrotik_devices SET name=?, ip_address=?, port=?, username=?, password_encrypted=?, use_https=?, status=?, last_seen=?, version=?, board=?, uptime=? WHERE id=?`,
      [name, ip, port, username, password, !!useHttps, status, lastSeen, version, board, uptime, id]
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

app.post('/devices/:id/connect', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM mikrotik_devices WHERE id=?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const device = rows[0];
    let client = connections.get(id);
    if (!client) {
      client = new RouterOSClient({
        host: device.ip_address,
        user: device.username,
        password: device.password_encrypted,
        port: device.port,
        tls: !!device.use_https,
        keepalive: true,
      });
      await client.connect();
      connections.set(id, client);
    } else if (!client.isConnected) {
      await client.connect();
    }
    const data = await client.menu('/system/resource').getOnly();
    const version = data[0]['version'];
    const board = data[0]['board-name'];
    const lastSeen = new Date();
    await pool.execute(
      'UPDATE mikrotik_devices SET status=?, last_seen=?, version=?, board=? WHERE id=?',
      ['online', lastSeen, version, board, id]
    );
    res.json({ status: 'online', version, board, lastSeen });
  } catch (err) {
    console.error(err);
    connections.delete(id);
    await pool.execute(
      'UPDATE mikrotik_devices SET status=? WHERE id=?',
      ['offline', id]
    );
    res.status(500).json({ error: 'Connection failed' });
  }
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
