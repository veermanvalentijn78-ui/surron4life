import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

interface OrderItemInput {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface StoredOrder {
  orderId: string;
  customerName: string;
  customerEmail: string;
  deliveryCity: string;
  notes: string;
  items: OrderItemInput[];
  total: number;
  status: string;
  createdAt: string;
}

interface StoredInquiry {
  ticketId: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const orders: StoredOrder[] = [];
const inquiries: StoredInquiry[] = [];
let orderCounter = 1042;
let ticketCounter = 201;

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'surron4you' });
  });

  app.post('/api/orders', (req, res) => {
    const body = req.body ?? {};
    const customerName = String(body.customerName ?? '').trim();
    const customerEmail = String(body.customerEmail ?? '').trim();
    const deliveryCity = String(body.deliveryCity ?? '').trim();
    const notes = String(body.notes ?? '').trim();
    const rawItems = Array.isArray(body.items) ? body.items : [];

    if (!customerName || !customerEmail || !deliveryCity) {
      res.status(400).json({ error: 'Please provide your name, email, and delivery city.' });
      return;
    }

    if (rawItems.length === 0) {
      res.status(400).json({ error: 'Your cart is empty.' });
      return;
    }

    const items: OrderItemInput[] = rawItems.map((item: Record<string, unknown>) => ({
      id: String(item.id ?? ''),
      name: String(item.name ?? 'Electric Dirt Bike'),
      price: Number(item.price) || 0,
      qty: Math.max(1, Math.floor(Number(item.qty) || 1)),
    }));

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const orderId = `S4Y-${orderCounter++}`;
    const record: StoredOrder = {
      orderId,
      customerName,
      customerEmail,
      deliveryCity,
      notes,
      items,
      total,
      status: 'Confirmed — Preparing Shipment',
      createdAt: new Date().toISOString(),
    };

    orders.push(record);
    res.status(201).json(record);
  });

  app.post('/api/contact', (req, res) => {
    const body = req.body ?? {};
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim();
    const message = String(body.message ?? '').trim();

    if (!name || !email || !message) {
      res.status(400).json({ error: 'Please complete all required fields.' });
      return;
    }

    const ticketId = `MSG-${ticketCounter++}`;
    const record: StoredInquiry = {
      ticketId,
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };

    inquiries.push(record);
    res.status(201).json({
      ticketId: record.ticketId,
      receivedAt: record.createdAt,
      confirmation: 'Message received. Our team will respond shortly.',
    });
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Surron4You server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
