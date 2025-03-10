import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Määritä __dirname ES-moduulissa
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Palvele docs-kansio staattisena tiedostona
app.use('/docs', express.static(path.join(__dirname, 'docs')));

// Määritä portti, jolla palvelin kuuntelee
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
