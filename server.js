import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './api-routes.js';
import { createClient } from '@supabase/supabase-js';
// SQLite removido - usando Wasabi como fonte principal

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow localhost
    if (process.env.NODE_ENV !== 'production') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    // In production, allow ALL domains - completamente aberto
    if (process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    
    // For any other case, allow the request
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Caminhos dos arquivos JSON
const DATA_DIR = path.join(__dirname, 'data');
const VIDEOS_FILE = path.join(DATA_DIR, 'videos.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const SITE_CONFIG_FILE = path.join(DATA_DIR, 'site_config.json');

// Garantir que o diretório de dados existe
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('Data directory created');
  }
}

// Função para ler arquivo JSON
async function readJsonFile(filePath, defaultValue = []) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`File ${filePath} not found, using default value`);
      return defaultValue;
    }
    console.error(`Error reading ${filePath}:`, error);
    throw error;
  }
}

// Função para escrever arquivo JSON
async function writeJsonFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`Successfully wrote to ${filePath}`);
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    throw error;
  }
}

// Inicializar arquivos de dados
async function initializeDataFiles() {
  await ensureDataDir();
  
  // Inicializar arquivos se não existirem
  const files = [
    { path: VIDEOS_FILE, default: [] },
    { path: USERS_FILE, default: [] },
    { path: SESSIONS_FILE, default: [] },
    { path: SITE_CONFIG_FILE, default: {
      siteName: 'VideosPlus',
      paypalClientId: '',
      stripePublishableKey: '',
      stripeSecretKey: '',
      telegramUsername: '',
      videoListTitle: 'Available Videos',
      crypto: [],
      emailHost: 'smtp.gmail.com',
      emailPort: '587',
      emailSecure: false,
      emailUser: '',
      emailPass: '',
      emailFrom: '',
      wasabiConfig: {
        accessKey: process.env.VITE_WASABI_ACCESS_KEY || '',
        secretKey: process.env.VITE_WASABI_SECRET_KEY || '',
        region: process.env.VITE_WASABI_REGION || '',
        bucket: process.env.VITE_WASABI_BUCKET || '',
        endpoint: process.env.VITE_WASABI_ENDPOINT || ''
      }
    }}
  ];

  for (const file of files) {
    try {
      await fs.access(file.path);
    } catch {
      await writeJsonFile(file.path, file.default);
      console.log(`Created ${file.path}`);
    }
  }
}

// API primeiro (antes de static/catch-all) para evitar /api/* devolver index.html
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});
app.use('/api', apiRoutes);

// Depois: servir estáticos e SPA fallback
app.use(express.static(path.join(__dirname, 'dist')));
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // Em desenvolvimento, redirecionar para o servidor do Vite (exceto para rotas da API)
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      res.status(404).json({ error: 'API endpoint not found' });
    } else {
      res.redirect('http://localhost:5173' + req.originalUrl);
    }
  });
}

// Inicializar e iniciar servidor
async function startServer() {
  try {
    console.log('Iniciando servidor: metadados no Supabase, armazenamento no Wasabi');
    // Removido: inicialização de arquivos JSON locais e criação de metadata no Wasabi
    
    // Iniciar servidor primeiro
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      
      console.log('Metadados: Supabase | Arquivos: Wasabi');

      // Garantir admin padrão no Supabase
      (async () => {
        try {
          const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
          const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
          if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
            console.warn('[bootstrap] Supabase env not set; skip ensure admin');
            return;
          }
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } });
          const { data: existing, error: selErr } = await supabase
            .from('users')
            .select('id')
            .eq('email', 'admin@gmail.com')
            .maybeSingle();
          if (selErr) {
            console.warn('[bootstrap] Could not query users table:', selErr.message);
            return;
          }
          if (!existing) {
            const { error: insErr } = await supabase
              .from('users')
              .insert({
                email: 'admin@gmail.com',
                name: 'Administrator',
                role: 'admin',
                password_hash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
              });
            if (insErr) {
              console.warn('[bootstrap] Failed to insert default admin:', insErr.message);
            } else {
              console.log('[bootstrap] Default admin ensured (admin@gmail.com)');
            }
          } else {
            console.log('[bootstrap] Admin already exists');
          }
        } catch (e) {
          console.warn('[bootstrap] Ensure admin error:', e?.message || e);
        }
      })();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();