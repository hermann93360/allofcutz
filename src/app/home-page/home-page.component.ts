import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { mountPlanity } from '../planity';
import { applySeo } from '../seo';

interface Service {
  index: string;
  name: string;
  description: string;
  duration: string;
  price: string;
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
  video?: string;
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
export class HomePageComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly services: Service[] = [
    {
      index: '01',
      name: 'Coupe + barbe',
      description:
        'L\'essentiel. Coupe à sec, barbe travaillée, finition propre.',
      duration: '45 min',
      price: '35 €'
    },
    {
      index: '02',
      name: 'Coupe + barbe + soin complet',
      description:
        'Le rituel intégral. Visage, cheveux et barbe — vapeur, huiles, finition.',
      duration: '1 h 30',
      price: '75 €'
    },
    {
      index: '03',
      name: 'Coupe homme + coiffage',
      description:
        'Coupe seule, propre et rapide. Coiffage compris.',
      duration: '30 min',
      price: '25 €'
    },
    {
      index: '04',
      name: 'Taille barbe + serviette + vapeur',
      description:
        'Barbe seule, façon barbershop. Serviette chaude, vapeur, baume.',
      duration: '30 min',
      price: '25 €'
    },
    {
      index: '05',
      name: 'Soin visage',
      description:
        'Quarante-cinq minutes pour la peau. Diagnostic, vapeur, soin sur mesure.',
      duration: '45 min',
      price: '49 €'
    },
    {
      index: '06',
      name: 'Coloration cheveux mi-longs',
      description:
        'Couleur naturelle, faite main. Diagnostic, application, glaçage final.',
      duration: '1 h 30',
      price: '50 €'
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
      video: 'video.mp4',
      alt: 'All of Cutz — L\'atelier en mouvement',
      caption: 'L\'atelier · en mouvement',
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
  @ViewChild('planityContainer') planityContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('bookingSection') bookingSection!: ElementRef<HTMLElement>;

  private cleanupFns: Array<() => void> = [];
  private lenis: any = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private doc: Document,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    applySeo(this.metaService, this.doc, {
      title: 'All of Cutz · Maison de coiffure & barbershop · Paris 12ᵉ',
      description:
        'All of Cutz — barbershop & maison de coiffure à Paris 12ᵉ. Coupe, barbe, soin, couleur, défrisage, coiffures protectrices. 4.9★ sur 1 000+ avis. Réservation en ligne.',
      path: '/',
      imageUrl: 'https://allofcutz.paris/salon/salon-03-reception.jpg',
      imageAlt: 'All of Cutz — La Maison · Paris 12ᵉ'
    });
  }

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
    this.initGalleryVideo();
    ScrollTrigger.refresh();
  }

  private initGalleryVideo(): void {
    const video = document.querySelector<HTMLVideoElement>('.g-hero video');
    if (!video) return;
    if (typeof IntersectionObserver === 'undefined') {
      video.play().catch(() => {});
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(video);
    this.cleanupFns.push(() => observer.disconnect());
  }

  private hideLoader(gsap: any): void {
    const el = this.loader?.nativeElement;
    if (!el) return;
    const bar = this.loaderBar?.nativeElement;
    if (bar) {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: 100,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: () => {
          bar.style.width = obj.v + '%';
        }
      });
    }
    gsap.to(el, {
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      delay: 1.05,
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
