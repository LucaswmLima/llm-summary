import { Router, Request, Response } from "express";
import { TasksRepository } from "../repositories/tasksRepository";
import axios from "axios"; // Usado para enviar requisição ao serviço Python

const router = Router();
const tasksRepository = new TasksRepository();

// POST: Cria uma tarefa e solicita resumo ao serviço Python
router.post("/", async (req: Request, res: Response) => {
  try {
    const { text, lang } = req.body;

    // Validação dos parâmetros
    if (!text || !lang) {
      return res.status(400).json({ error: 'Campos "text" e "lang" são obrigatórios.' });
    }
    // Adicionado a validacao de linguagem
    const supportedLanguages = ["pt", "en", "es"];
    if (!supportedLanguages.includes(lang)) {
      return res.status(400).json({ error: "Language not supported" });
    }

    // Cria a "tarefa"
    const task = tasksRepository.createTask(text, lang);

    // Envia o texto ao serviço Python para gerar o resumo
    const response = await axios.post("http://127.0.0.1:8000/summarize", { text, lang });

    // Atualiza a tarefa com o resumo retornado do serviço Python
    const summary = response.data.summary;
    tasksRepository.updateTask(task.id, summary);

    return res.status(201).json({
      message: "Tarefa criada com sucesso!",
      task: tasksRepository.getTaskById(task.id),
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return res.status(500).json({ error: "Ocorreu um erro ao criar a tarefa." });
  }
});

// GET: Recupera uma tarefa específica
router.get("/:id", (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  if (isNaN(taskId)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  const task = tasksRepository.getTaskById(taskId);

  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  return res.json(task);
});

// GET: Recupera uma tarefa específica
router.get("/", (req, res) => {

  const tasks = tasksRepository.getAllTasks();

  if (!tasks) {
    return res.status(404).json({ error: "Nenhuma Tarefa encontrada." });
  }

  return res.json(tasks);
});


// DELETE: Remove uma tarefa
router.delete("/:id", (req, res) => {
  const taskId = parseInt(req.params.id, 10); // Converte o id da URL para número
  const task = tasksRepository.getTaskById(taskId);

  if (task) {
    tasksRepository.deleteTask(taskId); // Remove a tarefa do repositório
    return res.status(200).json({ message: "Tarefa deletada com sucesso!" });
  } else {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }
});

export default router;
