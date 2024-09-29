import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Eror404PageComponent } from './shared/pages/eror404-page/eror404-page.component';

const routes: Routes = [
  {
    path: 'todo',
    loadChildren: () => import('./todo/todo.module').then((m) => m.TodoModule),
  },
  {
    path: '404',
    component: Eror404PageComponent,
  },
  {
    path: '',
    redirectTo: 'todo',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
