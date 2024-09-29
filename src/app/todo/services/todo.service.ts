import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environments } from 'src/environments/enviroments';
import { Task } from '../interfaces/todo.interface';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private baseUrl: string = environments.baseUrl;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.loadTasks();
  }

  // Método para cargar las tareas iniciales desde el servidor
  loadTasks(): void {
    this.getTask().subscribe((tasks) => {
      this.tasksSubject.next(tasks);
    });
  }

  // Método para obtener tareas desde el servidor
  getTask(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.baseUrl}/tasks`);
  }

  // Método para agregar una nueva tarea y actualizar el BehaviorSubject
  addTask(newTask: Task): Observable<Task> {
    return this.httpClient.post<Task>(`${this.baseUrl}/tasks`, newTask).pipe(
      tap((createdTask) => {
        // Actualizar el array de tareas y notificar los cambios después de una respuesta exitosa
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next([...currentTasks, createdTask]);
      })
    );
  }
}
