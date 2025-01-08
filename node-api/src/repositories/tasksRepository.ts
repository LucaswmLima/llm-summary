import fs from 'fs';
import path from 'path';

interface Task {
  id: number;
  text: string;
  summary: string | null;
  lang: string; // Novo campo lang para escolha do idioma
}

export class TasksRepository {
  private tasks: Task[] = [];
  private filePath: string;
  private currentId: number = 1;

  constructor() {
    this.filePath = path.join(__dirname, '..', 'data', 'tasks.json');
    this.loadTasks();
  }

  // Carrega as tarefas do arquivo JSON
  private loadTasks() {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      if (data.trim() === '') {
        console.error('O arquivo JSON está vazio, inicializando dados padrão.');
        this.tasks = [];
        this.currentId = 1;
      } else {
        try {
          const loadedTasks = JSON.parse(data);
          this.tasks = loadedTasks.tasks || [];
          this.currentId = loadedTasks.currentId || 1;
        } catch (error) {
          console.error('Erro ao parsear o arquivo JSON:', error);
          this.tasks = [];
          this.currentId = 1;
        }
      }
    } else {
      console.error('Arquivo não encontrado, criando um novo arquivo.');
      this.tasks = [];
      this.currentId = 1;
    }
  }

  // Salva as tarefas no arquivo JSON
  private saveTasks() {
    const data = JSON.stringify(
      { tasks: this.tasks, currentId: this.currentId },
      null,
      2
    );
    fs.writeFileSync(this.filePath, data);
  }

  // Cria uma nova tarefa
  createTask(text: string, lang: string): Task {
    const task: Task = {
      id: this.currentId++,
      text,
      summary: null,
      lang,
    };
    this.tasks.push(task);
    this.saveTasks();
    return task;
  }

  // Atualiza o resumo de uma tarefa
  updateTask(id: number, summary: string): Task | null {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      this.tasks[taskIndex].summary = summary;
      this.saveTasks();
      return this.tasks[taskIndex];
    }
    return null;
  }

  // Obtém uma tarefa pelo ID
  getTaskById(id: number): Task | null {
    return this.tasks.find(t => t.id === id) || null;
  }

  // Obtém todas as tarefas
  getAllTasks(): Task[] {
    return this.tasks;
  }

  // Deleta uma tarefa
  deleteTask(id: number): boolean {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      this.tasks.splice(taskIndex, 1);
      this.saveTasks();
      return true;
    }
    return false;
  }
}
