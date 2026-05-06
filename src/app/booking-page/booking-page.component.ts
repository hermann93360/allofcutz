import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { mountPlanity } from '../planity';
import { applySeo } from '../seo';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss'
})
export class BookingPageComponent implements OnInit, AfterViewInit {
  @ViewChild('planityContainer') planityContainer!: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private doc: Document,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    applySeo(this.metaService, this.doc, {
      title: 'Prendre rendez-vous · All of Cutz · Paris 12ᵉ',
      description:
        'Réservez votre rendez-vous chez All of Cutz, barbershop & maison de coiffure à Paris 12ᵉ. Coupe, barbe, soin, couleur. Confirmation immédiate par email.',
      path: '/reservation',
      imageUrl: 'https://allofcutz.paris/salon/salon-03-reception.jpg',
      imageAlt: 'All of Cutz — Réservation en ligne'
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const container = this.planityContainer?.nativeElement;
    if (!container) return;
    mountPlanity(container, {
      servicesNotCollapsed: true,
      headerWidth: '88px'
    });
  }
}
