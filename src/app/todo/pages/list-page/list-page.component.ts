import { Component, OnInit } from '@angular/core';
import { Task } from '../../interfaces/todo.interface';
import { TodoService } from '../../services/todo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [],
})
export class ListPageComponent implements OnInit {
  public tasks: Task[] = [];

  selectedTask: any = null;
  selectedPerson: any = null;
  addPersonForm: FormGroup;
  addSkillForm: FormGroup;

  estadoSeleccionado: string = ''; // Valor seleccionado en el filtro ('completed' o 'pending'

  constructor(
    private todoService: TodoService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.addSkillForm = this.fb.group({
      skillName: ['', Validators.required],
    });
    this.addPersonForm = this.fb.group({
      fullName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      skills: [''],
    });
  }

  get tareasFiltradas(): Task[] {
    if (this.estadoSeleccionado) {
      return this.tasks.filter(
        (task) => task.status === this.estadoSeleccionado
      );
    } else {
      return this.tasks;
    }
  }

  ngOnInit(): void {
    // Suscribirse a tasks$ para obtener actualizaciones en tiempo real
    this.todoService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  // Método para abrir el modal del formulario
  openTaskModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  markAsCompleted(task: any) {
    task.status = 'completed';
  }

  deleteTask(task: any) {
    this.tasks = this.tasks.filter((t) => t.id !== task.id);
  }

  open(content: any, task: any) {
    this.selectedTask = task;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  openAddPersonModal(task: any, content: any) {
    this.selectedTask = task;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  addPersonToTask() {
    if (this.addPersonForm.invalid) {
      return;
    }

    const { fullName, age, skills } = this.addPersonForm.value;
    const newPerson = {
      id: new Date().getTime(),
      fullName,
      age,
      skills: skills
        ? skills.split(',').map((skill: string) => skill.trim())
        : [],
    };

    if (this.selectedTask) {
      this.selectedTask.people.push(newPerson);
    }

    this.addPersonForm.reset();
  }

  openAddSkillModal(person: any, content: any) {
    this.selectedPerson = person;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  addSkillToPerson() {
    if (this.addSkillForm.invalid) {
      return;
    }

    const { skillName } = this.addSkillForm.value;
    if (this.selectedPerson) {
      this.selectedPerson.skills.push(skillName.trim());
    }

    this.addSkillForm.reset();
  }

  removeSkillFromPerson(person: any, skill: string) {
    person.skills = person.skills.filter((s: string) => s !== skill);
  }

  removePersonFromTask(task: any, person: any) {
    task.people = task.people.filter((p: any) => p.id !== person.id);
  }
}
