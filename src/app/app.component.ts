import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const FRAME_COUNT = 121;
const FRAME_SPEED = 2.0;
const IMAGE_SCALE = 0.86;

interface Slide {
  id: string;
  src: string;
  alt: string;
  index: string;
  title: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  readonly slides: Slide[] = [
    {
      id: 'vitrine',
      src: 'salon/salon-01-vitrine.jpg',
      alt: 'All of Cutz — Vitrine sur la rue',
      index: '001',
      title: 'La Vitrine'
    },
    {
      id: 'bac',
      src: 'salon/salon-02-bac.jpg',
      alt: 'All of Cutz — Espace bac & repos',
      index: '002',
      title: 'Le Rituel'
    },
    {
      id: 'reception',
      src: 'salon/salon-03-reception.jpg',
      alt: 'All of Cutz — Réception et comptoir',
      index: '003',
      title: 'La Maison'
    },
    {
      id: 'stations',
      src: 'salon/salon-04-stations.jpg',
      alt: 'All of Cutz — Stations de coupe',
      index: '004',
      title: 'Les Stations'
    },
    {
      id: 'interieur',
      src: 'salon/salon-05-interieur.jpg',
      alt: "All of Cutz — Vue d'ensemble",
      index: '005',
      title: "L'Atelier"
    }
  ];

  activeIndex = 2; // start on "La Maison"

  get activeSlide(): Slide {
    return this.slides[this.activeIndex];
  }

  slideClass(i: number): string {
    const total = this.slides.length;
    let offset = (i - this.activeIndex + total) % total;
    if (offset > Math.floor(total / 2)) offset -= total;
    // offset ∈ {-2, -1, 0, 1, 2}
    const key = offset === 0 ? '0' : offset > 0 ? `p${offset}` : `n${-offset}`;
    return `carousel-slide pos-${key}`;
  }

  nextSlide(): void {
    this.activeIndex = (this.activeIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.activeIndex = (this.activeIndex - 1 + this.slides.length) % this.slides.length;
  }

  activateSlide(i: number): void {
    if (i === this.activeIndex) return;
    this.activeIndex = i;
  }

  goToSlide(i: number): void {
    this.activeIndex = i;
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (e.key === 'ArrowRight') this.nextSlide();
    else if (e.key === 'ArrowLeft') this.prevSlide();
  }

  @ViewChild('loader') loader!: ElementRef<HTMLDivElement>;
  @ViewChild('loaderBar') loaderBar!: ElementRef<HTMLDivElement>;
  @ViewChild('loaderPercent') loaderPercent!: ElementRef<HTMLSpanElement>;
  @ViewChild('hero') hero!: ElementRef<HTMLElement>;
  @ViewChild('canvasWrap') canvasWrap!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('darkOverlay') darkOverlay!: ElementRef<HTMLDivElement>;
  @ViewChild('marqueeWrap') marqueeWrap!: ElementRef<HTMLDivElement>;
  @ViewChild('marqueeText') marqueeText!: ElementRef<HTMLDivElement>;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  private cleanupFns: Array<() => void> = [];
  private resizeHandler?: () => void;
  private frames: HTMLImageElement[] = [];
  private currentFrame = -1;
  private bgColor = '#F5F6F7';
  private ctx: CanvasRenderingContext2D | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Dynamic import so SSR/prerender step never touches DOM-dependent libs.
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
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
  }

  // ==================== Boot ====================

  private boot(Lenis: any, gsap: any, ScrollTrigger: any): void {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time: number) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    this.cleanupFns.push(() => lenis.destroy());

    this.setupCanvas();

    // Reveal hero IMMEDIATELY — don't wait for 121 video frames.
    this.hideLoader(gsap);
    this.initNavReveal(gsap);
    this.initHeroIntro(gsap);
    this.initHeroTransition(gsap, ScrollTrigger);
    this.initSections(gsap, ScrollTrigger);
    this.initCounters(gsap, ScrollTrigger);
    this.initMarquee(gsap, ScrollTrigger);
    this.initDarkOverlay(ScrollTrigger);
    ScrollTrigger.refresh();

    // Preload scroll-scrub frames in the background; wire scrub once ready.
    this.preloadFrames()
      .then(() => {
        this.initFrameScrub(ScrollTrigger);
        ScrollTrigger.refresh();
      })
      .catch((err) => console.error('[experience] preload failed', err));
  }

  // ==================== Canvas ====================

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      if (this.currentFrame >= 0) this.drawFrame(this.currentFrame);
    };
    sizeCanvas();
    this.resizeHandler = sizeCanvas;
    window.addEventListener('resize', this.resizeHandler);
  }

  private framePath(i: number): string {
    return `frames/frame_${String(i + 1).padStart(4, '0')}.jpg`;
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('failed: ' + src));
      img.src = src;
    });
  }

  private preloadFrames(): Promise<void> {
    const bar = this.loaderBar?.nativeElement;
    const pct = this.loaderPercent?.nativeElement;
    const update = (done: number) => {
      const p = Math.round((done / FRAME_COUNT) * 100);
      if (bar) bar.style.width = p + '%';
      if (pct) pct.textContent = p + '%';
    };

    // Phase 1: load first 10 frames sequentially for fast first paint.
    const phase1 = async () => {
      const first = Math.min(10, FRAME_COUNT);
      for (let i = 0; i < first; i++) {
        try {
          this.frames[i] = await this.loadImage(this.framePath(i));
        } catch {
          /* skip missing frame, keep going */
        }
        update(i + 1);
      }
      if (this.frames[0]) {
        this.sampleBgColor(this.frames[0]);
        this.currentFrame = 0;
        this.drawFrame(0);
      }
    };

    // Phase 2: load the rest in parallel — use allSettled so one failure
    // doesn't reject the whole batch.
    const phase2 = async () => {
      let done = Math.min(10, FRAME_COUNT);
      const tasks: Promise<unknown>[] = [];
      for (let i = 10; i < FRAME_COUNT; i++) {
        const idx = i;
        tasks.push(
          this.loadImage(this.framePath(idx))
            .then((img) => {
              this.frames[idx] = img;
            })
            .catch(() => {
              /* skip missing frame */
            })
            .finally(() => {
              done++;
              update(done);
            })
        );
      }
      await Promise.allSettled(tasks);
    };

    return phase1().then(phase2);
  }

  private sampleBgColor(img: HTMLImageElement): void {
    try {
      const c = document.createElement('canvas');
      c.width = 8;
      c.height = 8;
      const cx = c.getContext('2d');
      if (!cx) return;
      cx.drawImage(img, 0, 0, 8, 8);
      const data = cx.getImageData(0, 0, 8, 8).data;
      let r = 0,
        g = 0,
        b = 0,
        n = 0;
      // Sample corners only.
      const corners = [0, 7, 56, 63];
      corners.forEach((i) => {
        const o = i * 4;
        r += data[o];
        g += data[o + 1];
        b += data[o + 2];
        n++;
      });
      r = Math.round(r / n);
      g = Math.round(g / n);
      b = Math.round(b / n);
      this.bgColor = `rgb(${r}, ${g}, ${b})`;
    } catch {}
  }

  private drawFrame(index: number): void {
    const img = this.frames[index];
    const ctx = this.ctx;
    const canvas = this.canvasRef?.nativeElement;
    if (!img || !ctx || !canvas) return;

    if (index % 20 === 0) this.sampleBgColor(img);

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih) * IMAGE_SCALE;
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // ==================== Loader ====================

  private hideLoader(gsap: any): void {
    const el = this.loader?.nativeElement;
    if (!el) return;
    gsap.to(el, {
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.15,
      onComplete: () => {
        el.style.display = 'none';
      }
    });
  }

  // ==================== Nav / Hero intro ====================

  private initNavReveal(gsap: any): void {
    const pill = document.querySelector('.nav-pill');
    if (!pill) return;
    gsap.from(pill, {
      y: -32,
      opacity: 0,
      scale: 0.92,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.95
    });
  }

  private initHeroIntro(gsap: any): void {
    const centerFrame = document.querySelector('.carousel-slide.pos-0 .slide-frame');
    const allSlides = document.querySelectorAll('.carousel-slide');
    const navButtons = document.querySelectorAll('.carousel-nav');
    const caption = document.querySelectorAll('.carousel-caption > *');
    const dots = document.querySelectorAll('.carousel-dot');
    const rails = [
      document.querySelector('.rail-l'),
      document.querySelector('.rail-c'),
      document.querySelector('.rail-r')
    ].filter(Boolean) as Element[];

    // Do NOT touch transforms on .carousel-slide — CSS owns them via pos-* classes.
    // Use clearProps so inline styles are removed after the tween (otherwise the
    // fixed opacity prevents the CSS class rules from taking effect on navigation).
    const tl = gsap.timeline({ delay: 0.3 });

    if (allSlides.length)
      tl.from(
        allSlides,
        {
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'opacity'
        },
        0
      );

    if (centerFrame)
      tl.from(
        centerFrame,
        {
          clipPath: 'inset(100% 0 0 0)',
          webkitClipPath: 'inset(100% 0 0 0)',
          duration: 1.4,
          ease: 'power4.out',
          clearProps: 'clipPath,webkitClipPath'
        },
        0.25
      );

    if (navButtons.length)
      tl.from(
        navButtons,
        {
          opacity: 0,
          scale: 0.85,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'opacity,transform'
        },
        0.75
      );

    if (caption.length)
      tl.from(
        caption,
        {
          y: 14,
          opacity: 0,
          stagger: 0.06,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'all'
        },
        0.85
      );

    if (dots.length)
      tl.from(
        dots,
        {
          y: 8,
          opacity: 0,
          stagger: 0.04,
          duration: 0.6,
          ease: 'power3.out',
          clearProps: 'all'
        },
        0.95
      );

    if (rails.length)
      tl.from(
        rails,
        {
          y: 18,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'all'
        },
        1.0
      );
  }

  // ==================== Hero circle-wipe transition ====================

  private initHeroTransition(gsap: any, ScrollTrigger: any): void {
    const heroEl = this.hero.nativeElement;
    const wrap = this.canvasWrap.nativeElement;
    wrap.style.clipPath = 'circle(0% at 50% 50%)';
    (wrap.style as any).webkitClipPath = 'circle(0% at 50% 50%)';

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: '+=100%',
      scrub: true,
      onUpdate: (self: any) => {
        const p = self.progress;
        heroEl.style.opacity = String(Math.max(0, 1 - p * 2.2));
        heroEl.style.transform = `translateY(${-p * 40}px)`;
        const wipe = Math.min(1, Math.max(0, (p - 0.04) / 0.35));
        const radius = wipe * 80;
        const clip = `circle(${radius}% at 50% 50%)`;
        wrap.style.clipPath = clip;
        (wrap.style as any).webkitClipPath = clip;
      }
    });
    this.cleanupFns.push(() => st.kill());
  }

  // ==================== Frame scrub ====================

  private initFrameScrub(ScrollTrigger: any): void {
    const container = this.scrollContainer.nativeElement;
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self: any) => {
        const accelerated = Math.min(self.progress * FRAME_SPEED, 1);
        const idx = Math.min(Math.floor(accelerated * FRAME_COUNT), FRAME_COUNT - 1);
        if (idx !== this.currentFrame) {
          this.currentFrame = idx;
          requestAnimationFrame(() => this.drawFrame(idx));
        }
      }
    });
    this.cleanupFns.push(() => st.kill());
  }

  // ==================== Sections ====================

  private initSections(gsap: any, ScrollTrigger: any): void {
    const container = this.scrollContainer.nativeElement;
    const sections = container.querySelectorAll<HTMLElement>('.scroll-section');

    sections.forEach((section) => {
      const type = section.dataset['animation'] || 'fade-up';
      const persist = section.dataset['persist'] === 'true';
      const enter = parseFloat(section.dataset['enter'] || '0') / 100;
      const leave = parseFloat(section.dataset['leave'] || '100') / 100;

      // Absolute positioning within the scroll container.
      const mid = (enter + leave) / 2;
      section.style.position = 'absolute';
      section.style.top = `${mid * 100}%`;
      section.style.left = '0';
      section.style.right = '0';
      section.style.transform = 'translateY(-50%)';
      section.style.opacity = '0';
      section.style.pointerEvents = 'none';

      const children = section.querySelectorAll<HTMLElement>(
        '.section-label, .section-heading, .section-body, .section-note, .cta-button, .stat'
      );

      const tl = gsap.timeline({ paused: true });
      switch (type) {
        case 'slide-left':
          tl.from(children, {
            x: -80,
            opacity: 0,
            stagger: 0.14,
            duration: 0.9,
            ease: 'power3.out'
          });
          break;
        case 'slide-right':
          tl.from(children, {
            x: 80,
            opacity: 0,
            stagger: 0.14,
            duration: 0.9,
            ease: 'power3.out'
          });
          break;
        case 'scale-up':
          tl.from(children, {
            scale: 0.88,
            opacity: 0,
            stagger: 0.12,
            duration: 1.0,
            ease: 'power2.out'
          });
          break;
        case 'rotate-in':
          tl.from(children, {
            y: 40,
            rotation: 3,
            opacity: 0,
            stagger: 0.1,
            duration: 0.9,
            ease: 'power3.out'
          });
          break;
        case 'stagger-up':
          tl.from(children, {
            y: 60,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out'
          });
          break;
        case 'clip-reveal':
          tl.from(children, {
            clipPath: 'inset(100% 0 0 0)',
            webkitClipPath: 'inset(100% 0 0 0)',
            opacity: 0,
            stagger: 0.15,
            duration: 1.1,
            ease: 'power4.inOut'
          });
          break;
        default:
          tl.from(children, {
            y: 50,
            opacity: 0,
            stagger: 0.12,
            duration: 0.9,
            ease: 'power3.out'
          });
      }

      const fade = 0.035;
      let hasPlayed = false;
      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self: any) => {
          const p = self.progress;
          let opacity = 0;
          if (p < enter - fade) {
            opacity = 0;
          } else if (p < enter) {
            opacity = (p - (enter - fade)) / fade;
          } else if (p < leave) {
            opacity = 1;
          } else if (p < leave + fade) {
            opacity = persist ? 1 : 1 - (p - leave) / fade;
          } else {
            opacity = persist ? 1 : 0;
          }

          section.style.opacity = String(opacity);
          section.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';

          if (p >= enter - fade && !hasPlayed) {
            hasPlayed = true;
            tl.play();
          }
          if (!persist && p < enter - fade && hasPlayed) {
            hasPlayed = false;
            tl.progress(0).pause();
          }
        }
      });
      this.cleanupFns.push(() => st.kill());
    });
  }

  // ==================== Counters ====================

  private initCounters(gsap: any, ScrollTrigger: any): void {
    const nums = document.querySelectorAll<HTMLElement>('.stat-number');
    nums.forEach((el) => {
      const target = parseFloat(el.dataset['value'] || '0');
      const decimals = parseInt(el.dataset['decimals'] || '0', 10);
      const obj = { v: 0 };
      const format = (v: number) => {
        if (decimals > 0) return v.toFixed(decimals);
        const rounded = Math.round(v);
        return rounded >= 1000 ? rounded.toLocaleString('en-US') : String(rounded);
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

      const statsSection = el.closest('.section-stats') as HTMLElement | null;
      if (!statsSection) return;
      const enter = parseFloat(statsSection.dataset['enter'] || '0') / 100;
      let played = false;
      const st = ScrollTrigger.create({
        trigger: this.scrollContainer.nativeElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self: any) => {
          if (!played && self.progress >= enter - 0.02) {
            played = true;
            tween.play(0);
          }
          if (played && self.progress < enter - 0.06) {
            played = false;
            tween.pause(0);
            obj.v = 0;
            el.textContent = format(0);
          }
        }
      });
      this.cleanupFns.push(() => {
        st.kill();
        tween.kill();
      });
    });
  }

  // ==================== Marquee ====================

  private initMarquee(gsap: any, ScrollTrigger: any): void {
    const wrap = this.marqueeWrap.nativeElement;
    const text = this.marqueeText.nativeElement;
    const speed = parseFloat(wrap.dataset['scrollSpeed'] || '-25');

    const tween = gsap.to(text, {
      xPercent: speed,
      ease: 'none',
      scrollTrigger: {
        trigger: this.scrollContainer.nativeElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });

    wrap.style.opacity = '0';
    const fadeRange = 0.04;
    const showFrom = 0.18;
    const showTo = 0.95;
    const st = ScrollTrigger.create({
      trigger: this.scrollContainer.nativeElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self: any) => {
        const p = self.progress;
        let opacity = 0;
        if (p >= showFrom - fadeRange && p < showFrom) {
          opacity = (p - (showFrom - fadeRange)) / fadeRange;
        } else if (p >= showFrom && p < showTo) {
          opacity = 1;
        } else if (p >= showTo && p < showTo + fadeRange) {
          opacity = 1 - (p - showTo) / fadeRange;
        }
        wrap.style.opacity = String(opacity);
      }
    });
    this.cleanupFns.push(() => {
      st.kill();
      tween.scrollTrigger?.kill();
      tween.kill();
    });
  }

  // ==================== Dark overlay ====================

  private initDarkOverlay(ScrollTrigger: any): void {
    const overlay = this.darkOverlay.nativeElement;
    const enter = 0.58;
    const leave = 0.76;
    const fade = 0.04;
    const st = ScrollTrigger.create({
      trigger: this.scrollContainer.nativeElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self: any) => {
        const p = self.progress;
        let o = 0;
        if (p >= enter - fade && p < enter) {
          o = ((p - (enter - fade)) / fade) * 0.9;
        } else if (p >= enter && p < leave) {
          o = 0.9;
        } else if (p >= leave && p < leave + fade) {
          o = 0.9 * (1 - (p - leave) / fade);
        }
        overlay.style.opacity = String(o);
      }
    });
    this.cleanupFns.push(() => st.kill());
  }
}
