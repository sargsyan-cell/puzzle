/**
 * Full-screen Piggy Bank UI: syncs DOM from save state and manages the info overlay.
 * Assumes purchase / later / close handlers are bound on the game app (game.js).
 */
(function (global) {
  const MODAL_ID = "piggy-bank-modal";

  function defaultCap(save) {
    const c = save && save.piggyCap;
    return typeof c === "number" && c > 0 ? c : 500;
  }

  function syncUI(app) {
    const save = app._save;
    const cap = defaultCap(save);
    const stored = Math.min(cap, save.piggyGemsStored || 0);
    const isFull = stored >= cap;
    const state = stored <= 0 ? "empty" : (isFull ? "full" : "progress");
    const pct = cap > 0 ? Math.min(100, (stored / cap) * 100) : 0;

    const modal = document.getElementById(MODAL_ID);
    if (modal) {
      modal.classList.remove("piggy-bank-screen--empty", "piggy-bank-screen--progress", "piggy-bank-screen--full");
      modal.classList.add("piggy-bank-screen--" + state);
      modal.style.setProperty("--piggy-progress-percent", pct + "%");
    }

    const fillEl = document.getElementById("piggy-progress-fill");
    if (fillEl) fillEl.style.width = pct + "%";
    const currentEl = document.getElementById("piggy-progress-current");
    if (currentEl) currentEl.textContent = String(stored);
    const capEl = document.getElementById("piggy-progress-cap");
    if (capEl) capEl.textContent = String(cap);

    const descEl = document.getElementById("piggy-modal-desc");
    if (descEl) {
      descEl.textContent = "Play levels to fill Piggy Bank. When it's full, break it to claim your goodies!";
    }

    const purchaseBtn = document.getElementById("piggy-btn-purchase");
    if (purchaseBtn) {
      purchaseBtn.disabled = !isFull;
      purchaseBtn.style.display = isFull ? "" : "none";
      purchaseBtn.innerHTML = '<span class="piggy-price-old" aria-hidden="true">€3.00</span><span class="piggy-price-new">$0.99</span>';
    }

    const laterBtn = document.getElementById("piggy-btn-later");
    if (laterBtn) laterBtn.style.display = "none";
  }

  function wireInfoOverlay() {
    const infoOverlay = document.getElementById("piggy-info-overlay");
    const btnPiggyInfo = document.getElementById("btn-piggy-info");
    const closePiggyInfo = () => {
      if (infoOverlay) infoOverlay.classList.add("hidden");
    };
    if (btnPiggyInfo) {
      btnPiggyInfo.onclick = () => {
        if (infoOverlay) infoOverlay.classList.remove("hidden");
      };
    }
    if (infoOverlay) {
      infoOverlay.onclick = closePiggyInfo;
      const infoContinue = document.getElementById("piggy-info-continue");
      if (infoContinue) {
        infoContinue.onclick = (e) => {
          e.stopPropagation();
          closePiggyInfo();
        };
      }
    }
  }

  function unwireInfoOverlay() {
    const infoOverlay = document.getElementById("piggy-info-overlay");
    if (infoOverlay) {
      infoOverlay.classList.add("hidden");
      infoOverlay.onclick = null;
    }
    const btnPiggyInfo = document.getElementById("btn-piggy-info");
    if (btnPiggyInfo) btnPiggyInfo.onclick = null;
    const infoContinue = document.getElementById("piggy-info-continue");
    if (infoContinue) infoContinue.onclick = null;
  }

  function setScreenScrollLock(on) {
    const cls = "piggy-bank-screen-active";
    if (on) {
      document.documentElement.classList.add(cls);
      document.body.classList.add(cls);
    } else {
      document.documentElement.classList.remove(cls);
      document.body.classList.remove(cls);
    }
  }

  let escapeHandler = null;

  function wireEscape(closeFn) {
    if (escapeHandler) {
      document.removeEventListener("keydown", escapeHandler);
      escapeHandler = null;
    }
    escapeHandler = (e) => {
      if (e.key !== "Escape") return;
      const info = document.getElementById("piggy-info-overlay");
      if (info && !info.classList.contains("hidden")) {
        info.classList.add("hidden");
        e.preventDefault();
        return;
      }
      e.preventDefault();
      closeFn();
    };
    document.addEventListener("keydown", escapeHandler);
  }

  function unwireEscape() {
    if (escapeHandler) {
      document.removeEventListener("keydown", escapeHandler);
      escapeHandler = null;
    }
  }

  const PiggyBankScreen = {
    open(app) {
      if (!app || !app._save || app._save.piggyBroken) return;
      const modal = document.getElementById(MODAL_ID);
      if (!modal) return;
      syncUI(app);
      wireInfoOverlay();
      modal.classList.remove("hidden");
      setScreenScrollLock(true);
      if (app.closePiggyModal && typeof app.closePiggyModal === "function") {
        wireEscape(() => app.closePiggyModal());
      }
    },

    close() {
      const modal = document.getElementById(MODAL_ID);
      if (modal) modal.classList.add("hidden");
      unwireInfoOverlay();
      unwireEscape();
      setScreenScrollLock(false);
    },

    /** Exposed for tests or callers that mutate save without reopening. */
    syncFromSave(app) {
      if (!app || !app._save) return;
      syncUI(app);
    }
  };

  global.PiggyBankScreen = PiggyBankScreen;
})(typeof window !== "undefined" ? window : globalThis);
