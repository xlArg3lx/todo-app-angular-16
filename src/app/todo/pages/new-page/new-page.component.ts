import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Task } from '../../interfaces/todo.interface';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [],
})
export class NewPageComponent {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private todoService: TodoService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      people: this.fb.array([], this.uniqueFullNameValidator),
      deadline: ['', [Validators.required, this.dateNotInPastValidator]],
    });
  }

  // Getters para acceder a los controles más fácilmente
  get people(): FormArray {
    return this.taskForm.get('people') as FormArray;
  }

  // Método para abrir el modal del formulario
  openTaskModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  // Método para añadir una persona
  addPerson(): void {
    const personForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(18)]],
      skills: this.fb.array(
        [this.fb.control('', Validators.required)],
        Validators.required
      ),
    });

    this.people.push(personForm);
  }

  // Validador personalizado para asegurar que la fecha no esté en el pasado
  dateNotInPastValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (control.value) {
      const today = new Date();
      const selectedDate = new Date(control.value);
      if (selectedDate < today) {
        return { dateInPast: true };
      }
    }
    return null;
  }

  // Método para eliminar una persona del FormArray
  removePerson(index: number) {
    this.people.removeAt(index);
  }

  // Método para añadir una habilidad a una persona específica
  addSkillToPerson(personIndex: number): void {
    const skillsArray = this.people.at(personIndex).get('skills') as FormArray;
    skillsArray.push(this.fb.control('', Validators.required));
  }

  // Método para eliminar una habilidad de una persona específica
  removeSkillFromPerson(personIndex: number, skillIndex: number): void {
    const skillsArray = this.people.at(personIndex).get('skills') as FormArray;
    skillsArray.removeAt(skillIndex);
  }

  // Validación personalizada para asegurar que los nombres completos sean únicos
  uniqueFullNameValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const people = control as FormArray;
    const names = people.controls.map(
      (person) => person.get('fullName')?.value
    );
    const nameSet = new Set(names);
    if (nameSet.size !== names.length) {
      return { notUnique: true };
    }
    return null;
  }

  // Método para obtener el FormArray de habilidades de una persona
  getSkills(personIndex: number): FormArray {
    return this.people.at(personIndex).get('skills') as FormArray;
  }

  // Método para manejar la sumisión del formulario
  onSubmit(): void {
    if (this.taskForm.valid) {
      const newTask: Task = {
        ...this.taskForm.value,
        status: 'pending', // Siempre asignar el estado 'pending'
      };

      this.todoService.addTask(newTask).subscribe(() => {
        this.modalService.dismissAll();
        this.taskForm.reset(); // Resetea el formulario después de enviarlo
      });
    } else {
      console.log('El formulario no es válido.');
      this.taskForm.markAllAsTouched();
    }
  }
}
