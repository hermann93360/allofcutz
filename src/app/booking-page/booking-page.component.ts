import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { mountPlanity } from '../planity';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss'
})
export class BookingPageComponent implements AfterViewInit {
  @ViewChild('planityContainer') planityContainer!: ElementRef<HTMLDivElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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
