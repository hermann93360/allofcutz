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
  name: string;
  description: string;
  duration: string;
  price: string;
}

interface TeamMember {
  name: string;
  role: string;
  photo: string;
  photoAlt: string;
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
  span: 'g-tall' | 'g-square';
}

interface Skill {
  name: string;
  description: string;
  src: string;
  alt: string;
}

interface Product {
  name: string;
  category: string;
  src: string;
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
      name: 'Coupe + barbe',
      description:
        'L\'essentiel. Coupe à sec, barbe travaillée, finition propre.',
      duration: '45 min',
      price: '35 €'
    },
    {
      name: 'Coupe + barbe + soin complet',
      description:
        'Le rituel intégral. Visage, cheveux et barbe, vapeur, huiles, finition.',
      duration: '1 h 30',
      price: '75 €'
    },
    {
      name: 'Coupe homme + coiffage',
      description:
        'Coupe seule, propre et rapide. Coiffage compris.',
      duration: '30 min',
      price: '25 €'
    },
    {
      name: 'Taille barbe + serviette + vapeur',
      description:
        'Barbe seule, façon barbershop. Serviette chaude, vapeur, baume.',
      duration: '30 min',
      price: '25 €'
    },
    {
      name: 'Soin visage',
      description:
        'Quarante-cinq minutes pour la peau. Diagnostic, vapeur, soin sur mesure.',
      duration: '45 min',
      price: '49 €'
    },
    {
      name: 'Coloration cheveux mi-longs',
      description:
        'Couleur naturelle, faite main. Diagnostic, application, glaçage final.',
      duration: '1 h 30',
      price: '50 €'
    }
  ];

  readonly team: TeamMember[] = [
    {
      name: 'Emir',
      role: 'Barbier',
      photo: 'shooting/portrait-barbier-bouc-01.jpg',
      photoAlt: 'shooting/portrait-barbier-bouc-02.jpg'
    },
    {
      name: 'Mehdi',
      role: 'Barbier',
      photo: 'shooting/portrait-barbier-locks-01.jpg',
      photoAlt: 'shooting/portrait-barbier-locks-02.jpg'
    },
    {
      name: 'Ilan',
      role: 'Barbier',
      photo: 'shooting/portrait-barbier-jeune-02.jpg',
      photoAlt: 'shooting/portrait-barbier-jeune-01.jpg'
    },
    {
      name: 'Jenny',
      role: 'Barbier',
      photo: 'shooting/portrait-barbier-barbe-02.jpg',
      photoAlt: 'shooting/portrait-barbier-barbe-01.jpg'
    }
  ];

  readonly skills: Skill[] = [
    {
      name: 'Dégradés & contours',
      description: 'Fades nets, contours tracés à la tondeuse, finitions précises.',
      src: 'shooting/coupe-degrade-11.jpg',
      alt: 'Dégradé à la tondeuse'
    },
    {
      name: 'Boucles & waves',
      description: 'Des coupes qui respectent la boucle, du curly au wavy.',
      src: 'shooting/coupe-boucles-02.jpg',
      alt: 'Coupe sur cheveux bouclés'
    },
    {
      name: 'Barbe & soin',
      description: 'Taille aux ciseaux, serviette chaude, vapeur et baume.',
      src: 'shooting/coupe-ciseaux-barbe-02.jpg',
      alt: 'Taille de barbe aux ciseaux'
    },
    {
      name: 'Tresses & protectrices',
      description: 'Twists, tresses et coiffures protectrices, sur rendez-vous.',
      src: 'shooting/tresses-06.jpg',
      alt: 'Pose de tresses'
    }
  ];

  readonly stats: Stat[] = [
    { value: 4.9, decimals: 1, suffix: '★', label: 'Note moyenne' },
    { value: 1000, decimals: 0, suffix: '+', label: 'Avis Google & Planity' },
    { value: 4, decimals: 0, suffix: 'barbiers', label: 'Toutes textures' },
    { value: 6, decimals: 0, suffix: '/ 7', label: 'Jours ouverts' }
  ];

  readonly hours: OpeningDay[] = [
    { day: 'Lundi', hours: '11h à 20h' },
    { day: 'Mardi', hours: 'Fermé' },
    { day: 'Mercredi', hours: '11h à 20h' },
    { day: 'Jeudi', hours: '11h à 20h' },
    { day: 'Vendredi', hours: '10h à 21h' },
    { day: 'Samedi', hours: '10h à 21h' },
    { day: 'Dimanche', hours: '11h à 18h' }
  ];

  readonly phone = '06 95 69 21 18';
  readonly phoneTel = 'tel:+33695692118';

  readonly gallery: GalleryImage[] = [
    {
      src: 'shooting/coupe-degrade-08.jpg',
      alt: 'Dégradé à la tondeuse, gros plan',
      caption: 'Le Dégradé',
      span: 'g-tall'
    },
    {
      src: 'shooting/salon-en-action-04.jpg',
      alt: 'Barbier au travail dans le salon',
      caption: 'L\'Atelier',
      span: 'g-square'
    },
    {
      src: 'shooting/tresses-07.jpg',
      alt: 'Pose de twists rouge et noir',
      caption: 'Les Tresses',
      span: 'g-tall'
    },
    {
      src: 'shooting/interieur-salon-03.jpg',
      alt: 'Le salon, accueil et postes de coupe',
      caption: 'Le Salon',
      span: 'g-square'
    },
    {
      src: 'shooting/coupe-contours.jpg',
      alt: 'Contours à la tondeuse',
      caption: 'Les Contours',
      span: 'g-tall'
    },
    {
      src: 'shooting/soin-shampoing-bac-02.jpg',
      alt: 'Shampoing au bac',
      caption: 'Le Rituel',
      span: 'g-tall'
    },
    {
      src: 'shooting/interieur-espace-bac-03.jpg',
      alt: 'L\'espace bac',
      caption: 'L\'Espace Bac',
      span: 'g-square'
    },
    {
      src: 'shooting/coupe-boucles-01.jpg',
      alt: 'Coupe sur cheveux bouclés',
      caption: 'Les Boucles',
      span: 'g-tall'
    },
    {
      src: 'shooting/salon-en-action-05.jpg',
      alt: 'Deux barbiers au travail',
      caption: 'À Quatre Mains',
      span: 'g-square'
    },
    {
      src: 'shooting/interieur-salon-02.jpg',
      alt: 'Le salon, vue sur l\'accueil',
      caption: 'L\'Accueil',
      span: 'g-square'
    }
  ];

  readonly products: Product[] = [
    { name: 'Conditionneur Nutri', category: 'Cheveux', src: 'shooting/produit-conditionneur-nutri.jpg' },
    { name: 'Crème Bouclante', category: 'Cheveux', src: 'shooting/produit-creme-bouclante.jpg' },
    { name: 'Masque Nutri', category: 'Cheveux', src: 'shooting/produit-masque-nutri.jpg' },
    { name: 'Gum', category: 'Coiffage', src: 'shooting/produit-gum.jpg' },
    { name: 'Shampooing à barbe', category: 'Barbe', src: 'shooting/produit-shampooing-barbe.jpg' },
    { name: 'Huile à barbe', category: 'Barbe', src: 'shooting/produit-huile-barbe.jpg' },
    { name: 'Baume à barbe', category: 'Barbe', src: 'shooting/produit-baume-barbe.jpg' }
  ];

  @ViewChild('loader') loader!: ElementRef<HTMLDivElement>;
  @ViewChild('loaderBar') loaderBar!: ElementRef<HTMLDivElement>;
  @ViewChild('planityContainer') planityContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('bookingSection') bookingSection!: ElementRef<HTMLElement>;
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  private cleanupFns: Array<() => void> = [];
  private lenis: any = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private doc: Document,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    applySeo(this.metaService, this.doc, {
      title: 'All of Cutz · Barbershop & coiffure · Paris 12ᵉ',
      description:
        'All of Cutz, barbershop et salon de coiffure à Paris 12ᵉ. Coupe, barbe, soin, couleur, défrisage, tresses. 4.9★ sur plus de 1 000 avis. Réservation en ligne.',
      path: '/',
      imageUrl: 'https://allofcutz.paris/salon/salon-03-reception.jpg',
      imageAlt: 'All of Cutz · Paris 12ᵉ'
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initHeroVideo();
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

  /**
   * Background video: muted autoplay loop. Stays on the poster when the
   * visitor asks for reduced motion or data saving, and pauses off-screen.
   */
  private initHeroVideo(): void {
    const video = this.heroVideo?.nativeElement;
    if (!video) return;
    const hero = video.closest('.hero');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as any).connection?.saveData === true;
    if (reduceMotion || saveData) {
      video.pause();
      video.removeAttribute('autoplay');
      video.preload = 'none';
      return;
    }

    // iOS only autoplays when `muted` is set as a property too.
    video.muted = true;
    video.defaultMuted = true;

    const markPlaying = () => hero?.classList.add('is-playing');
    video.addEventListener('playing', markPlaying, { once: true });
    if (!video.paused && video.readyState >= 3) markPlaying();
    const play = () => video.play().catch(() => {});
    play();

    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) play();
          else video.pause();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(video);
    this.cleanupFns.push(() => {
      observer.disconnect();
      video.removeEventListener('playing', markPlaying);
    });
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
