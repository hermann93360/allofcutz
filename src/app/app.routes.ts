import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { BookingPageComponent } from './booking-page/booking-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'All of Cutz · Barbershop & coiffure · Paris 12ᵉ'
  },
  {
    path: 'reservation',
    component: BookingPageComponent,
    title: 'Prendre rendez-vous · All of Cutz'
  },
  { path: '**', redirectTo: '' }
];
