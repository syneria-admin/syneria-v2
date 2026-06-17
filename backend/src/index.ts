import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "syneria_super_secret_key_2026";

app.use(cors());
app.use(express.json());

// ==========================================
// 1. MIDDLEWARES DE SÉCURITÉ
// ==========================================

// Vérifie si l'utilisateur est connecté
const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Accès refusé" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Token invalide" });
    req.user = user;
    next();
  });
};

// Vérifie si l'utilisateur est l'Administrateur
const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: "Espace strictement réservé à la direction." });
  }
  next();
};

// ==========================================
// 2. ROUTES D'AUTHENTIFICATION
// ==========================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, address, city, zipCode } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Cet email est déjà utilisé." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName, address, city, zipCode }
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Email ou mot de passe incorrect." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Email ou mot de passe incorrect." });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ==========================================
// 3. ROUTES DES COMMANDES
// ==========================================

// Sauvegarder une commande (Nécessite d'être connecté)
app.post('/api/orders/checkout', authenticateToken, async (req: any, res) => {
  try {
    const { orderDetails } = req.body;
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        fileName: orderDetails.fileName || 'model.stl',
        volumeCm3: orderDetails.volume || 0,
        weightG: orderDetails.weight || 0,
        material: orderDetails.material || 'FDM-Standard',
        finish: orderDetails.finish || 'Standard',
        color: orderDetails.color || 'Black',
        infill: orderDetails.infill || 15,
        totalPrice: orderDetails.price || 0,
      }
    });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'enregistrement de la commande" });
  }
});

// Historique des commandes du client (Espace Profil)
app.get('/api/orders/my-orders', authenticateToken, async (req: any, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Erreur de récupération" });
  }
});

// ==========================================
// 4. ROUTE ADMIN SÉCURISÉE
// ==========================================

app.get('/api/admin/orders', authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Erreur d'accès admin" });
  }
});

app.listen(PORT, () => console.log(`SYNERIA API running on port ${PORT}`));
