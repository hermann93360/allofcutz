import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { mountPlanity } from '../planity';

interface ServiceItem {
  name: string;
  description?: string;
  duration: string;
  price: string;
  bookable?: boolean;
  note?: string;
}

interface ServiceGroup {
  index: string;
  title: string;
  items: ServiceItem[];
}

interface TeamMember {
  index: string;
  name: string;
  role: string;
}

interface Stat {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
}

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  index: string;
  span: string;
}

interface OpeningDay {
  day: string;
  hours: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements AfterViewInit, OnDestroy {
  readonly serviceGroups: ServiceGroup[] = [
    {
      index: '01',
      title: 'Coupe + barbe',
      items: [
        { name: 'Coupe + barbe', duration: '45 min', price: '35 €' },
        { name: 'Coupe transformation + barbe', duration: '1 h', price: '45 €' },
        {
          name: 'Coupe + barbe + soin complet',
          description: 'Visage, cheveux, barbe.',
          duration: '1 h 30',
          price: '75 €'
        },
        {
          name: 'Coupe + barbe + soin de barbe',
          description:
            'Soin du cuir chevelu et soin de la barbe avec vapeur et huiles essentielles.',
          duration: '1 h 30',
          price: '45 €'
        },
        { name: 'Rasage uniforme + barbe', duration: '45 min', price: '25 €' }
      ]
    },
    {
      index: '02',
      title: 'Cheveux',
      items: [
        {
          name: 'Coupe transformation homme',
          description:
            'À partir de plus de 2 mois, pour un grand changement.',
          duration: '1 h',
          price: '35 €'
        },
        {
          name: 'Coupe transformation étudiant',
          description:
            'À partir de plus de 2 mois, pour un grand changement.',
          duration: '1 h',
          price: '30 €'
        },
        { name: 'Coupe homme + coiffage', duration: '30 min', price: '25 €' },
        { name: 'Coupe étudiante', duration: '30 min', price: '20 €' },
        { name: 'Contour', duration: '15 min', price: '10 €' }
      ]
    },
    {
      index: '03',
      title: 'Barbe',
      items: [
        { name: 'Rasage uniforme', duration: '30 min', price: '20 €' },
        { name: 'Rasage intégral', duration: '30 min', price: '15 €' },
        { name: 'Taille de barbe + contour', duration: '30 min', price: '15 €' },
        {
          name: 'Taille barbe + serviette + vapeur',
          duration: '30 min',
          price: '25 €'
        },
        { name: 'Taille moustache + bouc', duration: '30 min', price: '10 €' }
      ]
    },
    {
      index: '04',
      title: 'Soins',
      items: [
        { name: 'Soin barbe', duration: '30 min', price: '15 €' },
        { name: 'Soin cheveux', duration: '30 min', price: '15 €' },
        { name: 'Soin visage', duration: '45 min', price: '49 €' }
      ]
    },
    {
      index: '05',
      title: 'Coloration & décoloration',
      items: [
        { name: 'Coloration cheveux courts', duration: '1 h 30', price: '30 €' },
        { name: 'Coloration cheveux mi-longs', duration: '1 h 30', price: '50 €' },
        { name: 'Coloration cheveux longs', duration: '1 h 30', price: '70 €' }
      ]
    },
    {
      index: '06',
      title: 'Curly · waves · défrisage',
      items: [
        { name: 'Curly', duration: '30 min', price: '25 €' },
        { name: 'Waves', duration: '30 min', price: '25 €' },
        { name: 'Défrisage cheveux courts', duration: '1 h 30', price: '30 €' },
        { name: 'Défrisage cheveux mi-longs', duration: '1 h 30', price: '50 €' },
        { name: 'Défrisage cheveux longs', duration: '1 h 30', price: '70 €' }
      ]
    },
    {
      index: '07',
      title: 'Coiffures protectrices',
      items: [
        {
          name: 'Tresses · nattes',
          description: 'Réservation par téléphone uniquement.',
          duration: '—',
          price: 'À partir de 40 €',
          bookable: false,
          note: '06 95 69 21 18'
        },
        {
          name: 'Locks · twists',
          description: 'Sur devis. Réservation par téléphone uniquement.',
          duration: '—',
          price: 'Sur devis',
          bookable: false,
          note: '06 95 69 21 18'
        }
      ]
    }
  ];

  readonly team: TeamMember[] = [
    { index: '001', name: 'Jenny', role: 'Barbier' },
    { index: '002', name: 'Jimmony', role: 'Barbier' },
    { index: '003', name: 'Emir', role: 'Barbier' }
  ];

  readonly stats: Stat[] = [
    { value: 4.9, decimals: 1, suffix: '★', label: 'Note moyenne' },
    { value: 1000, decimals: 0, suffix: '+', label: 'Avis Google & Planity' },
    { value: 3, decimals: 0, suffix: 'barbiers', label: 'Toutes textures' },
    { value: 6, decimals: 0, suffix: '/ 7', label: 'Jours ouverts' }
  ];

  readonly hours: OpeningDay[] = [
    { day: 'Lundi', hours: '11h — 20h' },
    { day: 'Mardi', hours: 'Fermé' },
    { day: 'Mercredi', hours: '11h — 20h' },
    { day: 'Jeudi', hours: '11h — 20h' },
    { day: 'Vendredi', hours: '10h — 21h' },
    { day: 'Samedi', hours: '10h — 21h' },
    { day: 'Dimanche', hours: '11h — 18h' }
  ];

  readonly phone = '06 95 69 21 18';
  readonly phoneTel = 'tel:+33695692118';

  readonly gallery: GalleryImage[] = [
    {
      src: 'salon/salon-03-reception.jpg',
      alt: 'All of Cutz — Réception et comptoir',
      caption: 'La Maison',
      index: '001',
      span: 'g-hero'
    },
    {
      src: 'salon/salon-01-vitrine.jpg',
      alt: 'All of Cutz — Vitrine',
      caption: 'La Vitrine',
      index: '002',
      span: 'g-tall'
    },
    {
      src: 'salon/salon-04-stations.jpg',
      alt: 'All of Cutz — Stations de coupe',
      caption: 'Les Stations',
      index: '003',
      span: 'g-square'
    },
    {
      src: 'salon/salon-02-bac.jpg',
      alt: 'All of Cutz — Espace bac',
      caption: 'Le Rituel',
      index: '004',
      span: 'g-square'
    },
    {
      src: 'salon/salon-05-interieur.jpg',
      alt: 'All of Cutz — Vue d\'ensemble',
      caption: 'L\'Atelier',
      index: '005',
      span: 'g-wide'
    }
  ];

  @ViewChild('loader') loader!: ElementRef<HTMLDivElement>;
  @ViewChild('loaderBar') loaderBar!: ElementRef<HTMLDivElement>;
  @ViewChild('loaderPercent') loaderPercent!: ElementRef<HTMLSpanElement>;
  @ViewChild('planityContainer') planityContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('bookingSection') bookingSection!: ElementRef<HTMLElement>;

  private cleanupFns: Array<() => void> = [];
  private lenis: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    Promise.all([
      import('lenis'),
      import('gsap'),
      import('gsap/ScrollTrigger')
    ])
      .then(([lenisMod, gsapMod, stMod]) => {
        const Lenis: any = (lenisMod as any).default ?? (lenisMod as any);
        const gsap: any = (gsapMod as any).gsap ?? (gsapMod as any).default ?? gsapMod;
        const ScrollTrigger: any =
          (stMod as any).ScrollTrigger ?? (stMod as any).default ?? stMod;
        gsap.registerPlugin(ScrollTrigger);
        this.boot(Lenis, gsap, ScrollTrigger);
      })
      .catch((err) => console.error('[experience] boot failed', err));
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach((fn) => {
      try {
        fn();
      } catch {}
    });
  }

  private boot(Lenis: any, gsap: any, ScrollTrigger: any): void {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
    this.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time: number) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    this.cleanupFns.push(() => lenis.destroy());

    this.hideLoader(gsap);
    this.initNavReveal(gsap);
    this.initHeroIntro(gsap);
    this.initSectionReveals(gsap, ScrollTrigger);
    this.initCounters(gsap, ScrollTrigger);
    this.initAnchorScroll(lenis);
    this.initPlanityLazyMount();
    ScrollTrigger.refresh();
  }

  private hideLoader(gsap: any): void {
    const el = this.loader?.nativeElement;
    if (!el) return;
    const bar = this.loaderBar?.nativeElement;
    const pct = this.loaderPercent?.nativeElement;
    if (bar && pct) {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: 100,
        duration: 1.0,
        ease: 'power2.out',
        onUpdate: () => {
          bar.style.width = obj.v + '%';
          pct.textContent = Math.round(obj.v) + '%';
        }
      });
    }
    gsap.to(el, {
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      delay: 1.25,
      onComplete: () => {
        el.style.display = 'none';
      }
    });
  }

  private initNavReveal(gsap: any): void {
    const pill = document.querySelector('.nav-pill');
    if (!pill) return;
    gsap.from(pill, {
      y: -28,
      opacity: 0,
      scale: 0.94,
      duration: 1.0,
      ease: 'power3.out',
      delay: 0.85
    });
  }

  private initHeroIntro(gsap: any): void {
    const eyebrow = document.querySelector('.hero-eyebrow');
    const title = document.querySelectorAll('.hero-title .title-line');
    const sub = document.querySelector('.hero-sub');
    const actions = document.querySelector('.hero-actions');
    const meta = document.querySelectorAll('.hero-meta li');
    const visual = document.querySelector('.hero-visual');
    const scrollCue = document.querySelector('.hero-scroll');

    const tl = gsap.timeline({ delay: 0.5 });

    if (eyebrow)
      tl.from(eyebrow, { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0);

    if (title.length)
      tl.from(
        title,
        {
          yPercent: 110,
          opacity: 0,
          stagger: 0.12,
          duration: 1.1,
          ease: 'power4.out',
          clearProps: 'opacity,transform'
        },
        0.05
      );

    if (sub)
      tl.from(sub, { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.6);

    if (actions)
      tl.from(actions, { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.75);

    if (meta.length)
      tl.from(
        meta,
        { y: 14, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out' },
        0.95
      );

    if (visual)
      tl.from(
        visual,
        {
          clipPath: 'inset(100% 0 0 0)',
          webkitClipPath: 'inset(100% 0 0 0)',
          duration: 1.4,
          ease: 'power4.out',
          clearProps: 'clipPath,webkitClipPath'
        },
        0.2
      );

    if (scrollCue)
      tl.from(scrollCue, { opacity: 0, duration: 0.8, ease: 'power2.out' }, 1.4);
  }

  private initSectionReveals(gsap: any, ScrollTrigger: any): void {
    const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]');
    reveals.forEach((el) => {
      const childSel = el.dataset['revealChildren'];
      const targets = childSel
        ? el.querySelectorAll<HTMLElement>(childSel)
        : null;

      if (targets && targets.length) {
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 78%',
          onEnter: () => {
            gsap.from(targets, {
              y: 36,
              opacity: 0,
              stagger: 0.09,
              duration: 0.95,
              ease: 'power3.out',
              clearProps: 'all'
            });
          },
          once: true
        });
        this.cleanupFns.push(() => st.kill());
      } else {
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 82%',
          onEnter: () => {
            gsap.from(el, {
              y: 40,
              opacity: 0,
              duration: 1.05,
              ease: 'power3.out',
              clearProps: 'all'
            });
          },
          once: true
        });
        this.cleanupFns.push(() => st.kill());
      }
    });
  }

  private initCounters(gsap: any, ScrollTrigger: any): void {
    const nums = document.querySelectorAll<HTMLElement>('.stat-number');
    nums.forEach((el) => {
      const target = parseFloat(el.dataset['value'] || '0');
      const decimals = parseInt(el.dataset['decimals'] || '0', 10);
      const obj = { v: 0 };
      const format = (v: number) => {
        if (decimals > 0) return v.toFixed(decimals);
        const rounded = Math.round(v);
        return rounded >= 1000 ? rounded.toLocaleString('fr-FR') : String(rounded);
      };

      const tween = gsap.to(obj, {
        v: target,
        duration: 2.0,
        ease: 'power2.out',
        paused: true,
        onUpdate: () => {
          el.textContent = format(obj.v);
        }
      });

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 82%',
        onEnter: () => tween.play(0),
        once: true
      });

      this.cleanupFns.push(() => {
        st.kill();
        tween.kill();
      });
    });
  }

  private initAnchorScroll(lenis: any): void {
    const anchors = document.querySelectorAll<HTMLAnchorElement>(
      'a[href^="#"]:not([href="#"])'
    );
    const handler = (e: MouseEvent) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const href = a.getAttribute('href') || '';
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { duration: 1.3, offset: 0 });
    };
    anchors.forEach((a) => a.addEventListener('click', handler));
    this.cleanupFns.push(() => {
      anchors.forEach((a) => a.removeEventListener('click', handler));
    });
  }

  private initPlanityLazyMount(): void {
    const section = this.bookingSection?.nativeElement;
    if (!section) return;
    if (typeof IntersectionObserver === 'undefined') {
      this.mountWidget();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.mountWidget();
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: '600px 0px 600px 0px' }
    );
    observer.observe(section);
    this.cleanupFns.push(() => observer.disconnect());
  }

  private mountWidget(): void {
    const container = this.planityContainer?.nativeElement;
    if (!container) return;
    mountPlanity(container, {
      servicesNotCollapsed: true,
      headerWidth: '88px',
      onServiceAdd: () => {
        if (this.lenis && this.bookingSection) {
          this.lenis.scrollTo(this.bookingSection.nativeElement, {
            offset: -40,
            duration: 1.0
          });
        }
      }
    });
  }
}
