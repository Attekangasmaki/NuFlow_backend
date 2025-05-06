import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Palvele Vite-buildin dist-sisältöä public-kansion kautta
app.use(express.static(path.join(__dirname, 'public')));

// Fallback: palvele index.html kaikille muille pyynnöille (SPA-tuki)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Määritä portti ja host
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
