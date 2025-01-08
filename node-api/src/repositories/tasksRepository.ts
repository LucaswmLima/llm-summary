import fs from 'fs';
import path from 'path';

interface Task {
  id: number;
  text: string;
  summary: string | null;
  lang: string;
}

export class TasksRepository {
  private filePath: string;
  private currentId: number = 1;

  constructor() {
    this.filePath = path.join(__dirname, '..', 'data', 'tasks.json');
    this.loadTasks();
  }

  // Carrega as tarefas do arquivo JSON
  private loadTasks(): { tasks: Task[]; currentId: number } {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      if (data.trim() === '') {
        console.error('O arquivo JSON está vazio, inicializando dados padrão.');
        return { tasks: [], currentId: 1 };
      } else {
        try {
          const loadedTasks = JSON.parse(data);
          return { tasks: loadedTasks.tasks || [], currentId: loadedTasks.currentId || 1 };
        } catch (error) {
          console.error('Erro ao parsear o arquivo JSON:', error);
          return { tasks: [], currentId: 1 };
        }
      }
    } else {
      console.error('Arquivo não encontrado, criando um novo arquivo.');
      return { tasks: [], currentId: 1 };
    }
  }

  // Salva as tarefas no arquivo JSON
  private saveTasks(tasks: Task[], currentId: number): void {
    const data = JSON.stringify({ tasks, currentId }, null, 2);
    fs.writeFileSync(this.filePath, data);
  }

  // Cria uma nova tarefa
  createTask(text: string, lang: string): Task {
    const { tasks, currentId } = this.loadTasks();
    const task: Task = {
      id: currentId,
      text,
      summary: null,
      lang,
    };
    tasks.push(task);
    this.saveTasks(tasks, currentId + 1);
    return task;
  }

  // Atualiza o resumo de uma tarefa
  updateTask(id: number, summary: string): Task | null {
    const { tasks, currentId } = this.loadTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      tasks[taskIndex].summary = summary;
      this.saveTasks(tasks, currentId);
      return tasks[taskIndex];
    }
    return null;
  }

  // Obtém uma tarefa pelo ID
  getTaskById(id: number): Task | null {
    const { tasks } = this.loadTasks();
    return tasks.find(t => t.id === id) || null;
  }

  // Obtém todas as tarefas
  getAllTasks(): Task[] {
    const { tasks } = this.loadTasks();
    return tasks;
  }

  // Deleta uma tarefa
  deleteTask(id: number): boolean {
    const { tasks, currentId } = this.loadTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      console.log(`Deletando tarefa com id: ${id}`);
      tasks.splice(taskIndex, 1);
      this.saveTasks(tasks, currentId);
      return true;
    }
    console.log(`Tarefa com id: ${id} não encontrada.`);
    return false;
  }
}
