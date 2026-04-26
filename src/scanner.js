/**
 * ReGenX BioWaste — AI Waste Scanner Module
 * Adapted from biowaste_scanner.js
 */

const BioScanner = (() => {

  // ── Internal state ──
  let _stream    = null;
  let _imageB64  = null;
  let _opts      = {};

  // ── Storage helpers (Patched to use ReGenX DB) ──
  const _storage = {
    async get(key) { return DB.get(key); },
    async set(key, value) { DB.set(key, value); return true; },
    async list(prefix) { return DB.list(prefix); }
  };

  function _uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function _ts()  { return Date.now(); }

  function _toast(msg) {
    if (typeof showToast === 'function') showToast(msg);
    else console.warn('[BioScanner]', msg);
  }

  function _stopCamera() {
    if (_stream) { _stream.getTracks().forEach(t => t.stop()); _stream = null; }
  }

  function _render() {
    const container = document.getElementById(_opts.containerId || 'scanner-view');
    if (!container) { console.error('[BioScanner] Container not found:', _opts.containerId); return; }

    container.innerHTML = `
    <div class="scanner-shell glass-card" style="padding:24px; border-radius:24px;">

      <div class="scanner-header">
        <button class="scanner-back btn btn-ghost" onclick="BioScanner._back()">← Back</button>
        <div style="font-family:'Space Grotesk';font-size:20px;font-weight:800;">📷 AI Visual Assessor</div>
        <div style="font-size:11px;color:var(--text-muted);font-family:monospace;">v1.0.2 · IoT Enabled</div>
      </div>

      <div class="glass-card" style="background:var(--green-light); border:1px solid rgba(29,158,117,0.2); padding:13px 16px; margin-bottom:16px; font-size:13px; color:var(--green-dark); line-height:1.5;">
        <strong>AI Scanner:</strong> Point your camera at the waste. The IoT model will identify items, contaminants, and estimate biogas potential.
      </div>

      <div class="cam-mode-row">
        <button class="cam-mode-btn on" id="bws-mode-cam"    onclick="BioScanner._setMode('camera')">📷 Live Camera</button>
        <button class="cam-mode-btn"    id="bws-mode-upload" onclick="BioScanner._setMode('upload')">🖼 Upload Photo</button>
      </div>

      <div class="cam-zone" id="bws-cam-zone">
        <video id="bws-video" autoplay muted playsinline></video>
        <canvas id="bws-canvas" style="display:none;"></canvas>
        <img id="bws-preview" alt="Captured waste" style="display:none;">

        <div class="cam-overlay">
          <div class="cam-frame">
            <div class="cam-corner cam-corner-tl"></div>
            <div class="cam-corner cam-corner-tr"></div>
            <div class="cam-corner cam-corner-bl"></div>
            <div class="cam-corner cam-corner-br"></div>
            <div class="cam-scan-line" id="bws-scan-line" style="display:none;"></div>
          </div>
        </div>

        <div class="cam-placeholder" id="bws-placeholder">
          <div class="cam-placeholder-icon">📷</div>
          <div class="cam-placeholder-text">Press <strong>Start Camera</strong> to begin<br>or upload a waste sample image.</div>
        </div>
      </div>

      <div class="cam-controls" id="bws-controls">
        <button class="btn btn-outline" onclick="BioScanner._clickUpload()">🖼 Upload</button>
        <button class="btn btn-primary" id="btn-start-scan" onclick="BioScanner._startCamera()">📷 Start Camera</button>
      </div>

      <div id="bws-result"></div>

    </div>`;
  }

  function _setMode(mode) {
    document.getElementById('bws-mode-cam')?.classList.toggle('on', mode === 'camera');
    document.getElementById('bws-mode-upload')?.classList.toggle('on', mode === 'upload');
    if (mode === 'upload') { _stopCamera(); _clickUpload(); }
    else _startCamera();
  }

  function _clickUpload() {
    const fi = document.getElementById('file-input');
    if (fi) fi.click();
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    _stopCamera();
    const reader = new FileReader();
    reader.onload = e => {
      const dataURL = e.target.result;
      _imageB64 = dataURL.split(',')[1];
      _showPreview(dataURL);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  async function _startCamera() {
    if (_stream) { _captureFrame(); return; }

    const placeholder = document.getElementById('bws-placeholder');
    const video       = document.getElementById('bws-video');
    const preview     = document.getElementById('bws-preview');
    const scanLine    = document.getElementById('bws-scan-line');
    const startBtn    = document.getElementById('btn-start-scan');

    if (preview) preview.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      _stream = stream;
      if (video) { video.srcObject = stream; video.style.display = 'block'; }
      if (placeholder) placeholder.style.display = 'none';
      if (scanLine) scanLine.style.display = 'block';
      if (startBtn) {
        startBtn.textContent = '📸 Capture Analysis';
        startBtn.onclick = () => _captureFrame();
      }
    } catch (err) {
      _toast('⚠ Camera blocked — use Upload instead');
    }
  }

  function _captureFrame() {
    const video   = document.getElementById('bws-video');
    const canvas  = document.getElementById('bws-canvas');
    const scanLine= document.getElementById('bws-scan-line');
    if (!video || !canvas) return;

    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d').drawImage(video, 0, 0);

    const dataURL = canvas.toDataURL('image/jpeg', 0.8);
    _imageB64 = dataURL.split(',')[1];
    _stopCamera();
    if (scanLine) scanLine.style.display = 'none';
    _showPreview(dataURL);
  }

  function _showPreview(dataURL) {
    const preview     = document.getElementById('bws-preview');
    const video       = document.getElementById('bws-video');
    const placeholder = document.getElementById('bws-placeholder');
    const controls    = document.getElementById('bws-controls');

    if (preview)     { preview.src = dataURL; preview.style.display = 'block'; }
    if (video)       video.style.display = 'none';
    if (placeholder) placeholder.style.display = 'none';

    if (controls && !document.getElementById('bws-analyse-btn')) {
      const btn = document.createElement('button');
      btn.id        = 'bws-analyse-btn';
      btn.className = 'btn btn-primary';
      btn.style.width = '100%';
      btn.style.marginTop = '12px';
      btn.textContent = '🔍 Run AI Analysis';
      btn.onclick   = () => _analyse();
      controls.appendChild(btn);
    }
  }

  function _back() {
    _stopCamera();
    if (typeof _opts.onBack === 'function') _opts.onBack();
  }

  async function _analyse() {
    const resultArea = document.getElementById('bws-result');
    const analyBtn   = document.getElementById('bws-analyse-btn');
    if (analyBtn) analyBtn.disabled = true;

    resultArea.innerHTML = `
      <div class="glass-card" style="padding:32px; text-align:center; margin-top:24px;">
        <div class="bw-spinner" style="margin:0 auto 20px;"></div>
        <div style="font-weight:700; font-size:18px;">Analyzing Biowaste...</div>
        <div id="bws-step" style="font-size:12px; color:var(--text-muted); margin-top:8px;">Running IoT sensory model</div>
      </div>`;

    // Simulated API delay (matches the prompt but runs as simulation for demo)
    const steps = ['Processing pixels...', 'Detecting contaminants...', 'Calculating biogas yield...', 'Finalizing IoT data...'];
    let i = 0;
    const int = setInterval(() => {
      const el = document.getElementById('bws-step');
      if (el && i < steps.length) el.textContent = steps[i++];
    }, 1000);

    setTimeout(() => {
      clearInterval(int);
      const isOrganic = Math.random() > 0.3;
      const score = isOrganic ? Math.floor(Math.random() * 20 + 80) : Math.floor(Math.random() * 30 + 20);
      const res = {
        segregationScore: score,
        overallGrade: score > 80 ? 'Excellent' : (score > 60 ? 'Good' : (score > 40 ? 'Fair' : 'Poor')),
        gradeSummary: isOrganic ? "High-quality organic load detected. Minimal plastic impurities." : "Mixed load detected. High contamination risk for digester.",
        detectedItems: [
          { name: 'Vegetable Scraps', category: 'Organic', isContaminant: false, emoji: '🥬' },
          { name: 'Plastic Film', category: 'Plastic', isContaminant: true, emoji: '🛍️' }
        ],
        biogazSuitability: score > 75 ? 'Ideal' : 'Marginal',
        estimatedOrganicPercent: isOrganic ? 92 : 45,
        actionRequired: score < 70
      };
      _displayResult(res);
      _saveToHistory(res);
    }, 5000);
  }

  async function _saveToHistory(result) {
    const record = {
      id: _uid(),
      ts: _ts(),
      score: result.segregationScore,
      grade: result.overallGrade,
      org: _opts.userOrg,
      userName: _opts.userName
    };
    await _storage.set(`scan:${record.id}`, record);
    if (typeof _opts.onScanSaved === 'function') _opts.onScanSaved(record);
  }

  function _displayResult(r) {
    const resultArea = document.getElementById('bws-result');
    const score = r.segregationScore;
    const color = score > 80 ? 'var(--green)' : (score > 50 ? 'var(--amber)' : 'var(--red)');

    resultArea.innerHTML = `
    <div class="glass-card" style="margin-top:24px; border-color:${color}; overflow:hidden;">
      <div style="background:${color}; padding:16px; color:white; text-align:center;">
        <div style="font-size:32px; font-weight:800;">${score}%</div>
        <div style="font-size:12px; text-transform:uppercase; font-weight:700; letter-spacing:1px;">Segregation Score</div>
      </div>
      <div style="padding:20px;">
        <div class="between" style="margin-bottom:12px;">
          <span style="font-weight:700; font-size:18px;">${r.overallGrade} Grade</span>
          <span class="badge" style="background:${color}; color:white;">${r.biogazSuitability} for Biogas</span>
        </div>
        <p style="font-size:13px; color:var(--text-muted); line-height:1.5; margin-bottom:16px;">"${r.gradeSummary}"</p>
        
        <div style="font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:10px;">Detected Impurities</div>
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px;">
          ${r.detectedItems.map(item => `
            <div class="glass-card" style="padding:6px 12px; font-size:12px; display:flex; align-items:center; gap:6px; border-color:${item.isContaminant ? 'var(--red)' : 'var(--border)'}">
              <span>${item.emoji}</span> ${item.name}
            </div>
          `).join('')}
        </div>

        <button class="btn btn-primary btn-full" onclick="BioScanner._applyData(${score}, ${r.estimatedOrganicPercent})">✓ Use Data & Close</button>
      </div>
    </div>`;
  }

  function _applyData(score, org) {
    if (typeof _opts.onApply === 'function') _opts.onApply(score, org);
    _back();
  }

  return {
    open: (opts) => { _opts = opts; _render(); },
    _back, _setMode, _clickUpload, _startCamera, _analyse, _applyData, handleFileUpload
  };

})();
