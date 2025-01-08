import express, { Application } from 'express';
import tasksRoutes from './routes/tasksRoutes';

const app: Application = express();
app.use(express.json());

// Adicionado Rota inicial
app.get('/', (req, res) => {
    res.json({ message: "API is running" });
  });

// Rotas
app.use('/tasks', tasksRoutes);

export default app;