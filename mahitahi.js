if (Math.random() < 1 / 50) {
  const overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,sans-serif";

  const box = document.createElement("div");
  box.style.cssText = "background:#f5f0e8;border-radius:12px;padding:2rem;max-width:360px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.3)";

  box.innerHTML = `
    <div style="font-size:1.1rem;font-weight:700;margin-bottom:0.8rem">---</div>
    <div style="font-size:1.1rem;font-weight:700;color:#2c2c2c;margin-bottom:0.5rem">Are you sure?</div>
    <div style="font-size:0.85rem;color:#666;margin-bottom:1.2rem">Shouldn't you be tying knots instead?</div>
    <div style="display:flex;gap:0.5rem;justify-content:center">
      <button id="tak-yes" style="padding:0.5rem 1.2rem;border-radius:6px;border:1px solid #e0dace;background:#fff;color:#2c2c2c;font-size:0.85rem;cursor:pointer;font-weight:500">Yes, continue</button>
      <button id="tak-no" style="padding:0.5rem 1.2rem;border-radius:6px;border:none;background:#3d6b35;color:#fff;font-size:0.85rem;cursor:pointer;font-weight:500">Go tie knots</button>
    </div>
  `;

  overlay.appendChild(box);
  document.documentElement.appendChild(overlay);

  document.getElementById("tak-yes").addEventListener("click", () => overlay.remove());
  document.getElementById("tak-no").addEventListener("click", () => {
    window.location.href = "https://www.animatedknots.com";
  });
}
