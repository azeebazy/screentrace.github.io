(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isTouch) document.body.classList.add("is-touch");

  gsap.registerPlugin(ScrollTrigger);

  const loader = document.getElementById("loader");
  const loaderScan = document.querySelector(".loader__scan");
  const loaderWord = document.querySelector("[data-loader-text]");

  const boot = () => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        loader.style.display = "none";
        initPage();
        requestAnimationFrame(() => ScrollTrigger.refresh());
      },
    });

    if (reduceMotion) {
      tl.to(loader, { opacity: 0, duration: 0.2 });
      return;
    }

    gsap.set(loaderScan, { y: -20 });
    tl.from(".loader__mark img", { scale: 0.6, opacity: 0, duration: 0.6 })
      .to(loaderScan, { y: 110, duration: 0.9, ease: "power2.inOut" }, 0.15)
      .from(loaderWord, { y: 16, opacity: 0, duration: 0.45 }, 0.35)
      .to(loader, { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, 1.15);
  };

  const initPage = () => {
    const lenis = reduceMotion
      ? null
      : new Lenis({
          lerp: 0.08,
          smoothWheel: true,
        });

    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    initCursor();
    initCanvas();
    initNav(lenis);
    initMagnetic();
    initHero();
    initScrollCopy();
    initProducts();
    initRail();
  };

  const initCursor = () => {
    if (isTouch || reduceMotion) return;
    const ring = document.querySelector(".cursor__ring");
    const dot = document.querySelector(".cursor__dot");
    const ringX = gsap.quickTo(ring, "left", { duration: 0.35, ease: "power3" });
    const ringY = gsap.quickTo(ring, "top", { duration: 0.35, ease: "power3" });
    const dotX = gsap.quickTo(dot, "left", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot, "top", { duration: 0.12, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    });

    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => gsap.to(ring, { scale: 1.8, duration: 0.25 }));
      el.addEventListener("mouseleave", () => gsap.to(ring, { scale: 1, duration: 0.25 }));
    });
  };

  const initCanvas = () => {
    const canvas = document.getElementById("trace-canvas");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    const hero = document.querySelector(".hero");
    const mouse = { x: 0.7, y: 0.4 };
    const points = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      o: 0.15 + Math.random() * 0.4,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = hero.clientWidth * dpr;
      canvas.height = hero.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = (e.clientY - r.top) / r.height;
    });

    const draw = () => {
      const w = hero.clientWidth;
      const h = hero.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;

      points.forEach((p) => {
        const px = p.x * w;
        const py = p.y * h;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const glow = Math.max(0, 1 - dist * 2.4);

        ctx.fillStyle = `rgba(196, 181, 253, ${p.o + glow * 0.6})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.2 + glow * 2, 0, Math.PI * 2);
        ctx.fill();

        if (glow > 0.12) {
          ctx.strokeStyle = `rgba(143, 120, 248, ${glow * 0.55})`;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(mouse.x * w, mouse.y * h);
          ctx.stroke();
        }
      });

      requestAnimationFrame(draw);
    };

    draw();
  };

  const initNav = (lenis) => {
    const nav = document.getElementById("nav");
    const menu = document.getElementById("menu");
    const menuBtn = document.getElementById("menu-btn");

    ScrollTrigger.create({
      start: 24,
      onUpdate: (self) => nav.classList.toggle("is-solid", self.scroll() > 24),
    });

    const closeMenu = () => {
      menu.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    };

    menuBtn.addEventListener("click", () => {
      const open = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    });

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        closeMenu();
        if (lenis) lenis.scrollTo(target, { offset: -20, duration: 1.15 });
        else target.scrollIntoView({ behavior: "smooth" });
      });
    });
  };

  const initMagnetic = () => {
    if (isTouch || reduceMotion) return;
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x * 0.28, y: y * 0.28, duration: 0.35, ease: "power3.out" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.45)" });
      });
    });
  };

  const initHero = () => {
    if (reduceMotion) return;

    document.querySelectorAll(".hero__line:not(.hero__line--accent)").forEach((line) => {
      const split = new SplitType(line, { types: "chars" });
      gsap.from(split.chars, {
        yPercent: 110,
        rotateZ: 6,
        opacity: 0,
        stagger: 0.028,
        duration: 1.05,
        ease: "power4.out",
        delay: 0.05,
      });
    });

    gsap.from(".hero__line--accent", {
      yPercent: 80,
      opacity: 0,
      duration: 1.1,
      ease: "power4.out",
      delay: 0.28,
    });

    gsap.from(".hero .reveal", {
      y: 28,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      delay: 0.35,
      ease: "power3.out",
    });

    gsap.from(".orbit", { scale: 0.86, opacity: 0, duration: 1.2, delay: 0.2, ease: "power3.out" });
    gsap.to(".hero__glow", { x: 40, y: -20, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });
  };

  const initScrollCopy = () => {
    if (reduceMotion) return;

    document.querySelectorAll(".reveal-line").forEach((line) => {
      const split = new SplitType(line, { types: "lines" });
      gsap.from(split.lines, {
        yPercent: 100,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: line, start: "top 82%" },
      });
    });

    gsap.utils.toArray(".reveal").forEach((el) => {
      if (el.closest(".hero")) return;
      gsap.from(el, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%" },
      });
    });
  };

  const initProducts = () => {
    const theater = document.getElementById("product-stage");
    if (!theater) return;

    const order = ["lcd", "peau", "tp"];
    const dials = [...theater.querySelectorAll(".dial")];
    const panels = order.map((id) => document.getElementById(`product-${id}`));
    const scan = theater.querySelector(".theater__scan");
    let current = "lcd";
    let busy = false;

    const show = (id) => {
      if (!order.includes(id) || id === current || busy) return;
      const prev = document.getElementById(`product-${current}`);
      const next = document.getElementById(`product-${id}`);
      if (!prev || !next) return;

      busy = true;
      theater.dataset.active = id;
      dials.forEach((dial) => {
        const on = dial.dataset.product === id;
        dial.classList.toggle("is-active", on);
        dial.setAttribute("aria-selected", String(on));
      });

      const finish = () => {
        prev.classList.remove("is-active");
        next.classList.add("is-active");
        gsap.set([prev, next], { clearProps: "opacity,y,visibility,pointerEvents" });
        current = id;
        busy = false;
      };

      if (reduceMotion) {
        finish();
        return;
      }

      const width = theater.querySelector(".theater__viewport").clientWidth;
      gsap.set(next, { visibility: "visible", pointerEvents: "none", opacity: 0, y: 32 });

      gsap.timeline({ onComplete: finish })
        .set(scan, { x: 0, opacity: 1 })
        .to(scan, { x: width, duration: 0.55, ease: "power2.inOut" }, 0)
        .to(prev, { opacity: 0, y: -20, duration: 0.32, ease: "power2.in" }, 0)
        .to(next, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.16)
        .to(scan, { opacity: 0, duration: 0.2 }, 0.45);
    };

    dials.forEach((dial) => {
      dial.addEventListener("click", () => show(dial.dataset.product));
    });

    theater.querySelectorAll("[data-dir]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = order.indexOf(current);
        const next = order[(i + Number(btn.dataset.dir) + order.length) % order.length];
        show(next);
      });
    });

    document.querySelectorAll("[data-product]").forEach((el) => {
      if (el.classList.contains("dial")) return;
      el.addEventListener("click", () => show(el.dataset.product));
    });

    window.addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      const rect = theater.getBoundingClientRect();
      if (rect.bottom < 80 || rect.top > window.innerHeight - 80) return;
      e.preventDefault();
      const i = order.indexOf(current);
      show(order[(i + (e.key === "ArrowRight" ? 1 : -1) + order.length) % order.length]);
    });

    gsap.set(panels.filter(Boolean), { clearProps: "x" });
  };

  const initRail = () => {
    const progress = document.querySelector(".rail__progress");
    const nodes = document.querySelectorAll("[data-rail]");
    if (!progress) return;

    gsap.to(progress, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: { start: "top top", end: "max", scrub: 0.3 },
    });

    const map = [
      { id: "hero", key: "hero" },
      { id: "products", key: "products" },
      { id: "studio", key: "studio" },
      { id: "contact", key: "contact" },
    ];

    map.forEach(({ id, key }) => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (!self.isActive) return;
          nodes.forEach((n) => n.classList.toggle("is-active", n.dataset.rail === key));
        },
      });
    });
  };

  boot();
})();
