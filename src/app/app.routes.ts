import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { BookingPageComponent } from './booking-page/booking-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'All of Cutz · Maison de coiffure · Paris 12ᵉ'
  },
  {
    path: 'reservation',
    component: BookingPageComponent,
    title: 'Prendre rendez-vous · Maison All of Cutz'
  },
  { path: '**', redirectTo: '' }
];
