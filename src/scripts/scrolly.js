import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function getScrollRoot(el) {
  let node = el.parentElement;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    const oy = style.overflowY;
    if (oy === "auto" || oy === "scroll" || oy === "overlay") {
      return node;
    }
    node = node.parentElement;
  }
  return window;
}

export default function scrolly() {
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(".v-n-scrolly").forEach((container) => {
    if (container.__scrollyCleanup) container.__scrollyCleanup();

    const steps = [...container.querySelectorAll('.step:not([data-disabled="true"])')];
    const backgrounds = [...container.querySelectorAll(".bg-item")];
    const scrollRoot = getScrollRoot(container);
    const config = {
      fadeIn: parseFloat(container.dataset.fadeIn) || 0.8,
      fadeOut: parseFloat(container.dataset.fadeOut) || 0.4,
    };

    let currentStepIndex = -1;
    let currentBgIndex = -1;
    let ticking = false;
    let morphKey = null;
    let morphProgress = -1;

    backgrounds.forEach((bg, i) => {
      bg.dataset.bg = String(i);
    });

    function getTrigger(step) {
      return step.querySelector(".step__content") || step;
    }

    function getStepBgIndex(step, fallback = 0) {
      const raw = parseInt(step?.dataset.bg ?? "", 10);
      if (Number.isFinite(raw) && raw >= 0 && raw < backgrounds.length) return raw;
      return Math.min(fallback, Math.max(0, backgrounds.length - 1));
    }

    function setBgItemState(activeIndex, morphPair = null) {
      backgrounds.forEach((bg, i) => {
        bg.dataset.bg = String(i);
        if (morphPair) {
          // Origen del morph = is-active; destino = is-morphing
          bg.classList.toggle("is-active", i === morphPair.from);
          bg.classList.toggle("is-morphing", i === morphPair.to);
        } else {
          bg.classList.toggle("is-active", i === activeIndex);
          bg.classList.toggle("is-morphing", false);
        }
      });
    }

    function dispatchStepEvent(step, index, immediate = false) {
      container.dispatchEvent(
        new CustomEvent("scrolly:step", {
          bubbles: true,
          detail: {
            step,
            index,
            bg: getStepBgIndex(step, index),
            bgMorph: step?.dataset.bgMorph ?? null,
            immediate,
          },
        })
      );
    }

    function setBackground(index, immediate = false) {
      if (index < 0) return;
      setBgItemState(index, null);
      if (index === currentBgIndex) return;

      const target = backgrounds[index];
      const others = backgrounds.filter((_, i) => i !== index);
      gsap.killTweensOf(backgrounds);
      gsap.to(others, {
        opacity: 0,
        duration: immediate ? 0 : config.fadeOut,
        overwrite: true,
        ease: "power1.out",
      });
      if (target) {
        gsap.to(target, {
          opacity: 1,
          duration: immediate ? 0 : config.fadeIn,
          overwrite: true,
          ease: "power2.out",
        });
      }
      currentBgIndex = index;
    }

    function resolveMorph(stepIndex) {
      for (let i = stepIndex; i >= 0; i -= 1) {
        const start = steps[i];
        const endIndex = parseInt(start?.dataset.bgMorph || "", 10);
        if (!Number.isFinite(endIndex) || endIndex <= i || !steps[endIndex]) continue;
        if (stepIndex >= i && stepIndex <= endIndex) {
          return {
            fromBg: getStepBgIndex(start, i),
            toBg: getStepBgIndex(steps[endIndex], endIndex),
            startIdx: i,
            endIdx: endIndex,
          };
        }
      }
      return null;
    }

    function getViewportCenterY() {
      if (scrollRoot === window) return window.innerHeight * 0.45;
      const rootRect = scrollRoot.getBoundingClientRect();
      return rootRect.top + scrollRoot.clientHeight * 0.45;
    }

    function getMorphProgress(morph) {
      const span = morph.endIdx - morph.startIdx;
      if (span <= 0) return 1;

      // Anclas en coordenadas de viewport (no document/scrollY):
      // resiste contenido arriba/abajo y el transform del pin de ScrollTrigger.
      // progress 0 cuando el content de origen está ~al centro;
      // progress 1 cuando el content destino aparece en la zona inferior (~85%),
      // no cuando llega al centro de lectura (evita lag tras activar el último step).
      const centerY = getViewportCenterY();
      const portTop =
        scrollRoot === window ? 0 : scrollRoot.getBoundingClientRect().top;
      const portH =
        scrollRoot === window ? window.innerHeight : scrollRoot.clientHeight;
      const endAppearY = portTop + portH * 0.85;
      const endShift = endAppearY - centerY;
      const anchors = [];
      for (let i = morph.startIdx; i <= morph.endIdx; i += 1) {
        const el = getTrigger(steps[i]);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height * 0.5;
        const isEnd = i === morph.endIdx;
        anchors.push({
          y: isEnd ? mid - endShift : mid,
          progress: (i - morph.startIdx) / span,
        });
      }
      if (anchors.length < 2) return 0;

      // Document order → y crece con el índice. Al scrollear, los y bajan.
      if (centerY <= anchors[0].y) return 0;
      if (centerY >= anchors[anchors.length - 1].y) return 1;

      for (let i = 0; i < anchors.length - 1; i += 1) {
        const a = anchors[i];
        const b = anchors[i + 1];
        if (centerY >= a.y && centerY <= b.y) {
          const t = (centerY - a.y) / Math.max(1, b.y - a.y);
          return a.progress + (b.progress - a.progress) * t;
        }
      }
      return 1;
    }

    function applyMorph(morph) {
      const fromBg = backgrounds[morph.fromBg];
      const toBg = backgrounds[morph.toBg];
      if (!fromBg || !toBg) return;

      const nextProgress = getMorphProgress(morph);
      const key = `${morph.fromBg}:${morph.toBg}`;
      // Evitar micro-updates ruidosos, pero sin snap brusco en extremos
      if (key === morphKey && Math.abs(nextProgress - morphProgress) < 0.001) return;

      morphKey = key;
      morphProgress = nextProgress;
      gsap.killTweensOf(backgrounds);
      backgrounds.forEach((bg, i) => {
        if (i !== morph.fromBg && i !== morph.toBg) {
          bg.style.opacity = "0";
        }
      });
      fromBg.style.opacity = String(1 - nextProgress);
      toBg.style.opacity = String(nextProgress);
      currentBgIndex = nextProgress >= 1 ? morph.toBg : morph.fromBg;

      if (nextProgress >= 1) {
        setBgItemState(morph.toBg, null);
      } else if (nextProgress <= 0) {
        setBgItemState(morph.fromBg, null);
      } else {
        setBgItemState(currentBgIndex, { from: morph.fromBg, to: morph.toBg });
      }
    }

    function updateBackgrounds(stepIndex, immediate = false) {
      const morph = resolveMorph(stepIndex);
      if (morph && stepIndex >= morph.startIdx && stepIndex <= morph.endIdx) {
        applyMorph(morph);
        return;
      }
      morphKey = null;
      morphProgress = -1;
      setBackground(getStepBgIndex(steps[stepIndex], stepIndex), immediate);
    }

    function getActiveStepIndex() {
      const port =
        scrollRoot === window
          ? { top: 0, bottom: window.innerHeight }
          : scrollRoot.getBoundingClientRect();

      let best = 0;
      let bestVisible = -1;
      steps.forEach((step, index) => {
        const el = step.querySelector(".step__content") || step;
        const rect = el.getBoundingClientRect();
        const visible = Math.max(
          0,
          Math.min(rect.bottom, port.bottom) - Math.max(rect.top, port.top)
        );
        if (visible > bestVisible) {
          bestVisible = visible;
          best = index;
        }
      });
      return best;
    }

    function syncActiveStep(immediate = false) {
      if (!steps.length) return;
      const nextIndex = getActiveStepIndex();
      if (nextIndex === currentStepIndex && !immediate) {
        updateBackgrounds(nextIndex, false);
        return;
      }

      currentStepIndex = nextIndex;
      steps.forEach((step, index) => {
        step.classList.toggle("is-active", index === nextIndex);
      });
      updateBackgrounds(nextIndex, immediate);
      dispatchStepEvent(steps[nextIndex], nextIndex, immediate);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        syncActiveStep();
      });
    }

    backgrounds.forEach((bg) => {
      bg.style.opacity = "0";
      bg.classList.remove("is-active", "is-morphing");
    });
    if (backgrounds[0]) {
      backgrounds[0].style.opacity = "1";
      backgrounds[0].classList.add("is-active");
    }
    syncActiveStep(true);

    const scrollTarget = scrollRoot === window ? window : scrollRoot;
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    const onRefresh = () => syncActiveStep(true);
    ScrollTrigger.addEventListener("refresh", onRefresh);

    container.__scrollyCleanup = () => {
      scrollTarget.removeEventListener("scroll", onScroll);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
    };
  });
}
