/* ==========================================================================
   FOVEA - DESKTOP DASHBOARD & BLE TRACING CONTROLLER
   Manages state for the Main Dashboard and the "Specs Found" BLE Tracer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Views
  const viewDashboard = document.getElementById('view-dashboard');
  const viewBleTrace = document.getElementById('view-ble-trace');
  const viewGpsTrigger = document.getElementById('view-gps-trigger');
  const viewProfile = document.getElementById('view-profile');
  const viewSettings = document.getElementById('view-settings');

  // Main Dashboard Buttons
  const btnGps = document.getElementById('btn-action-gps');
  const btnBle = document.getElementById('btn-action-ble');
  const btnBuzzer = document.getElementById('btn-action-buzzer');
  const btnLight = document.getElementById('btn-action-light');

  // Spectacles Visual Elements
  const templeLed = document.getElementById('temple-led-emitter');
  const soundWaveRing = document.getElementById('acoustic-wave-ring');
  const modelPill = document.getElementById('model-pill-main');
  const activityList = document.getElementById('activity-feed-list');

  // BLE Tracing View Elements
  const btnBack = document.getElementById('btn-back-to-dashboard');
  const btnPlaySoundSpecs = document.getElementById('btn-play-sound-specs');
  const bleBeaconCircle = document.getElementById('center-bluetooth-beacon');
  const traceDistanceText = document.getElementById('trace-distance-heading');
  const traceSignalText = document.getElementById('trace-signal-meta');

  // GPS Trigger View Elements
  const btnViewFullMap = document.getElementById('btn-view-full-map');
  const gpsCampusMapImg = document.getElementById('gps-campus-map-img');
  const btnGpsZoomIn = document.getElementById('btn-gps-zoom-in');
  const btnGpsZoomOut = document.getElementById('btn-gps-zoom-out');
  const btnGpsRecenter = document.getElementById('btn-gps-recenter');
  const gpsPinBeacon = document.getElementById('gps-pin-beacon');

  // Profile View Elements
  const btnChangePhoto = document.getElementById('btn-change-photo');
  const btnHeroChangePhoto = document.getElementById('btn-hero-change-photo');
  const profilePhotoInput = document.getElementById('profile-photo-input');
  const heroAvatarImg = document.getElementById('hero-avatar-img');
  const cardAvatarImg = document.getElementById('card-avatar-img');
  const sidebarAvatarImg = document.querySelector('.user-avatar-badge img');
  const btnEditPersonalInfo = document.getElementById('btn-edit-personal-info');
  const btnActionUpdateProfile = document.getElementById('btn-action-update-profile');
  const btnActionChangePassword = document.getElementById('btn-action-change-password');
  const btnActionLogout = document.getElementById('btn-action-logout');

  // Sidebar links & Profile/Settings Triggers
  const navHome = document.getElementById('nav-item-home');
  const navProfile = document.getElementById('nav-item-profile');
  const navSettings = document.getElementById('nav-item-settings');
  const sidebarUserProfileBtn = document.getElementById('sidebar-user-profile-btn');
  const headerUserProfileBtn = document.getElementById('header-user-profile-btn');

  let isLightOn = true;
  let currentModelIndex = 1;
  let traceInterval = null;
  let currentMapZoom = 1.0;

  const MODELS = [
    { id: 1, name: 'Model 1', style: 'Classic Wayfarer Black' },
    { id: 2, name: 'Model 2', style: 'Titanium Hex Minimal' },
    { id: 3, name: 'Model 3', style: 'Aviator Tech Dual-Rim' }
  ];

  // Helper to switch views ('dashboard' | 'ble' | 'gps' | 'profile' | 'settings')
  function switchToView(viewName) {
    stopLiveBleTrace();

    // Hide all view sections
    [viewDashboard, viewBleTrace, viewGpsTrigger, viewProfile, viewSettings].forEach(view => {
      if (view) view.classList.remove('view-active');
    });

    // Reset sidebar nav item active states
    [navHome, navProfile, navSettings].forEach(nav => {
      if (nav) nav.classList.remove('active');
    });

    if (viewName === 'ble') {
      if (viewBleTrace) viewBleTrace.classList.add('view-active');
      if (navHome) navHome.classList.add('active');
      startLiveBleTrace();
    } else if (viewName === 'gps') {
      if (viewGpsTrigger) viewGpsTrigger.classList.add('view-active');
      if (navHome) navHome.classList.add('active');
      startGpsTriggerView();
    } else if (viewName === 'profile') {
      if (viewProfile) viewProfile.classList.add('view-active');
      if (navProfile) navProfile.classList.add('active');
      window.foveaAudio.playClick();
      logActivity('User Profile Loaded: Keerthana (FOV-UWB-2026)', 'tag-blue', 'PROFILE');
    } else if (viewName === 'settings') {
      if (viewSettings) viewSettings.classList.add('view-active');
      if (navSettings) navSettings.classList.add('active');
      window.foveaAudio.playClick();
      logActivity('Settings Panel Opened: Account & Preferences', 'tag-blue', 'SETTINGS');
    } else {
      if (viewDashboard) viewDashboard.classList.add('view-active');
      if (navHome) navHome.classList.add('active');
    }
  }

  // Helper to add activity log entry
  function logActivity(text, badgeClass = 'tag-blue', badgeLabel = 'SYS') {
    if (!activityList) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const li = document.createElement('li');
    li.className = 'activity-feed-item';
    li.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="panel-pill-tag ${badgeClass}">${badgeLabel}</span>
        <span>${text}</span>
      </div>
      <span style="font-family:var(--font-mono); font-size:0.72rem; color:#94a3b8;">${timeStr}</span>
    `;

    activityList.prepend(li);
    if (activityList.children.length > 15) {
      activityList.removeChild(activityList.lastChild);
    }
  }

  // Live BLE Tracing Simulation
  function startLiveBleTrace() {
    window.foveaAudio.playPing(980);
    if (bleBeaconCircle) bleBeaconCircle.classList.add('tracing');

    logActivity('BLE Real-Time Beacon Tracing Activated', 'tag-blue', 'BLE TRACE');

    // Simulate distance tracking narrowing in: 12m -> 8m -> 4m -> 1.5m -> 0.4m
    const distanceSteps = [12, 11, 9, 7.5, 5.2, 3.8, 2.1, 1.2, 0.4];
    let stepIndex = 0;

    if (traceInterval) clearInterval(traceInterval);

    traceInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % distanceSteps.length;
      const currentDist = distanceSteps[stepIndex];
      
      if (traceDistanceText) {
        traceDistanceText.textContent = `Found - ${currentDist} m away`;
      }

      if (traceSignalText) {
        const quality = currentDist <= 2 ? 'Signal ultra strong (Immediate)' : (currentDist <= 6 ? 'Signal strong' : 'Signal moderate');
        traceSignalText.textContent = `Updated just now · ${quality}`;
      }

      // Proximity ping sound as it gets closer
      if (currentDist <= 2) {
        window.foveaAudio.playPing(1200 + (3 - currentDist) * 80);
      }
    }, 1800);
  }

  function stopLiveBleTrace() {
    if (traceInterval) {
      clearInterval(traceInterval);
      traceInterval = null;
    }
    if (bleBeaconCircle) bleBeaconCircle.classList.remove('tracing');
  }

  // GPS Trigger View Activation
  function startGpsTriggerView() {
    window.foveaAudio.playPing(1174.66);
    currentMapZoom = 1.0;
    if (gpsCampusMapImg) gpsCampusMapImg.style.transform = 'scale(1.0)';
    logActivity('GPS Satellite Location Detected: IIITDM Jabalpur Campus (23.1765° N, 80.0185° E)', 'tag-red', 'GPS SYNC');
  }

  // ==========================================================================
  // EVENT LISTENERS
  // ==========================================================================

  // 1. CLICKING BLE ON MAIN DASHBOARD -> OPENS SPECS FOUND TRACING VIEW!
  if (btnBle) {
    btnBle.addEventListener('click', () => {
      switchToView('ble');
    });
  }

  // 2. CLICKING GPS ON MAIN DASHBOARD -> OPENS GPS TRIGGERED VIEW!
  if (btnGps) {
    btnGps.addEventListener('click', () => {
      btnGps.style.transform = 'scale(0.96)';
      setTimeout(() => btnGps.style.transform = '', 150);
      switchToView('gps');
    });
  }

  // Back button on BLE Tracing View -> Returns to Dashboard
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      window.foveaAudio.playClick();
      switchToView('dashboard');
    });
  }

  // Home link in Sidebar -> Returns to Dashboard
  if (navHome) {
    navHome.addEventListener('click', (e) => {
      e.preventDefault();
      switchToView('dashboard');
    });
  }

  // Play Sound on Specs Button (Inside BLE Tracing View)
  if (btnPlaySoundSpecs) {
    btnPlaySoundSpecs.addEventListener('click', () => {
      window.foveaAudio.playBuzzer();
      btnPlaySoundSpecs.style.transform = 'scale(0.97)';
      setTimeout(() => btnPlaySoundSpecs.style.transform = '', 180);
      logActivity('Chime Sent to Eyewear: 85 dB Piezoelectric Resonator', 'tag-red', 'SPECS CHIME');
    });
  }

  // Map Interactive Controls (Zoom & Recenter)
  if (btnGpsZoomIn) {
    btnGpsZoomIn.addEventListener('click', () => {
      window.foveaAudio.playClick();
      currentMapZoom = Math.min(1.4, +(currentMapZoom + 0.15).toFixed(2));
      if (gpsCampusMapImg) gpsCampusMapImg.style.transform = `scale(${currentMapZoom})`;
    });
  }

  if (btnGpsZoomOut) {
    btnGpsZoomOut.addEventListener('click', () => {
      window.foveaAudio.playClick();
      currentMapZoom = Math.max(0.9, +(currentMapZoom - 0.15).toFixed(2));
      if (gpsCampusMapImg) gpsCampusMapImg.style.transform = `scale(${currentMapZoom})`;
    });
  }

  if (btnGpsRecenter) {
    btnGpsRecenter.addEventListener('click', () => {
      window.foveaAudio.playPing(1046.5);
      currentMapZoom = 1.0;
      if (gpsCampusMapImg) gpsCampusMapImg.style.transform = 'scale(1.0)';
      if (gpsPinBeacon) {
        gpsPinBeacon.style.display = 'none';
        void gpsPinBeacon.offsetWidth; // trigger reflow
        gpsPinBeacon.style.display = 'block';
      }
      logActivity('Map Recentered to Eyewear: IIITDM Jabalpur', 'tag-blue', 'GPS MAP');
    });
  }

  // View on Full Map Button
  if (btnViewFullMap) {
    btnViewFullMap.addEventListener('click', () => {
      window.foveaAudio.playChime();
      btnViewFullMap.style.transform = 'scale(0.98)';
      setTimeout(() => btnViewFullMap.style.transform = '', 150);
      logActivity('Opening High-Precision Satellite Navigation: IIITDM Jabalpur', 'tag-red', 'MAP NAV');
      window.open('https://www.google.com/maps?q=23.1765,80.0185', '_blank');
    });
  }

  // 5. Ring Buzzer Button on Main Dashboard
  if (btnBuzzer) {
    btnBuzzer.addEventListener('click', () => {
      window.foveaAudio.playBuzzer();

      if (soundWaveRing) {
        soundWaveRing.classList.add('ringing');
        setTimeout(() => soundWaveRing.classList.remove('ringing'), 1200);
      }

      logActivity('Acoustic Resonance Buzzer Triggered: 85 dB Piezo Pulse', 'tag-red', 'BUZZER');
      btnBuzzer.style.transform = 'scale(0.96)';
      setTimeout(() => btnBuzzer.style.transform = '', 150);
    });
  }

  // 6. Turn on Light Button on Main Dashboard
  if (btnLight) {
    btnLight.addEventListener('click', () => {
      isLightOn = !isLightOn;
      window.foveaAudio.playClick();

      if (templeLed) {
        templeLed.className = isLightOn ? 'led-temple-light active' : 'led-temple-light inactive';
      }

      logActivity(`Temple Strobe LED Beacon ${isLightOn ? 'ACTIVATED' : 'DEACTIVATED'}`, 'tag-blue', 'LIGHT');
      btnLight.style.transform = 'scale(0.96)';
      setTimeout(() => btnLight.style.transform = '', 150);
    });
  }

  // 7. Model Pill Cycle
  if (modelPill) {
    modelPill.addEventListener('click', () => {
      window.foveaAudio.playClick();
      currentModelIndex = (currentModelIndex % MODELS.length) + 1;
      const model = MODELS.find(m => m.id === currentModelIndex);
      
      modelPill.innerHTML = `
        <span>${model.name}</span>
        <span class="model-pill-sub">${model.style}</span>
      `;

      logActivity(`Active frame profile changed to ${model.name}`, 'tag-blue', 'MODEL');
    });
  }

  // ==========================================================================
  // PROFILE VIEW EVENT LISTENERS
  // ==========================================================================

  // 1. Sidebar and Top-Bar Navigation to Profile
  if (navProfile) {
    navProfile.addEventListener('click', (e) => {
      e.preventDefault();
      switchToView('profile');
    });
  }

  if (sidebarUserProfileBtn) {
    sidebarUserProfileBtn.addEventListener('click', () => {
      switchToView('profile');
    });
  }

  if (headerUserProfileBtn) {
    headerUserProfileBtn.addEventListener('click', () => {
      switchToView('profile');
    });
  }

  // 2. Photo Upload Handlers
  function triggerPhotoUpload() {
    if (profilePhotoInput) profilePhotoInput.click();
  }

  if (btnChangePhoto) btnChangePhoto.addEventListener('click', triggerPhotoUpload);
  if (btnHeroChangePhoto) btnHeroChangePhoto.addEventListener('click', triggerPhotoUpload);

  if (profilePhotoInput) {
    profilePhotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newSrc = event.target.result;
          if (heroAvatarImg) heroAvatarImg.src = newSrc;
          if (cardAvatarImg) cardAvatarImg.src = newSrc;
          if (sidebarAvatarImg) sidebarAvatarImg.src = newSrc;
          window.foveaAudio.playChime();
          logActivity('Profile Photo Successfully Updated', 'tag-blue', 'AVATAR');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 3. Edit Personal Information / Update Profile
  function handleEditProfile() {
    window.foveaAudio.playClick();
    const valElem = document.getElementById('val-full-name');
    const currentName = valElem ? valElem.textContent : 'Keerthana';
    const newName = prompt('Update Full Name:', currentName);
    if (newName && newName.trim() !== '') {
      const trimmed = newName.trim();
      if (valElem) valElem.textContent = trimmed;
      const heroName = document.getElementById('profile-display-name');
      if (heroName) heroName.textContent = trimmed;
      const sidebarName = document.querySelector('.user-name-strong');
      if (sidebarName) sidebarName.textContent = trimmed;
      window.foveaAudio.playChime();
      logActivity(`Profile Full Name Updated to: ${trimmed}`, 'tag-blue', 'PROFILE');
    }
  }

  if (btnEditPersonalInfo) btnEditPersonalInfo.addEventListener('click', handleEditProfile);
  if (btnActionUpdateProfile) btnActionUpdateProfile.addEventListener('click', handleEditProfile);

  // 4. Change Password Action
  if (btnActionChangePassword) {
    btnActionChangePassword.addEventListener('click', () => {
      window.foveaAudio.playClick();
      alert('Security Verification: A secure OTP password reset link has been dispatched to keeerthana@example.com.');
      logActivity('Security Password Reset OTP Dispatched', 'tag-red', 'AUTH');
    });
  }

  // 5. Logout Action
  if (btnActionLogout) {
    btnActionLogout.addEventListener('click', () => {
      window.foveaAudio.playClick();
      if (confirm('Are you sure you want to log out of FOVEA?')) {
        logActivity('User Session Ended: Signed out safely', 'tag-red', 'LOGOUT');
        switchToView('dashboard');
      }
    });
  }

  // ==========================================================================
  // SETTINGS VIEW EVENT LISTENERS
  // ==========================================================================

  // 1. Sidebar Navigation to Settings
  if (navSettings) {
    navSettings.addEventListener('click', (e) => {
      e.preventDefault();
      switchToView('settings');
    });
  }

  // 2. Settings Inner Tabs Switching
  const settingsTabBtns = document.querySelectorAll('.settings-tab-btn');
  const settingsSubpanes = document.querySelectorAll('.settings-subpane');

  settingsTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.foveaAudio.playClick();
      settingsTabBtns.forEach(b => b.classList.remove('active'));
      settingsSubpanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(`pane-${targetTab}`);
      if (targetPane) targetPane.classList.add('active');
      logActivity(`Settings: Switched to ${btn.querySelector('span').textContent} tab`, 'tag-blue', 'SETTINGS');
    });
  });

  // 3. Settings Quick Edit Button
  const btnSettingsEditProfile = document.getElementById('btn-settings-edit-profile');
  if (btnSettingsEditProfile) {
    btnSettingsEditProfile.addEventListener('click', handleEditProfile);
  }

  // 4. Change Password Row
  const rowSettingsChangePassword = document.getElementById('row-settings-change-password');
  if (rowSettingsChangePassword) {
    rowSettingsChangePassword.addEventListener('click', () => {
      window.foveaAudio.playClick();
      alert('Password Security: An OTP reset verification link has been sent to keerthana123@gmail.com.');
      logActivity('Password Security Reset Requested', 'tag-red', 'AUTH');
    });
  }

  // 5. Two-Factor Authentication Toggle
  const toggleSettings2fa = document.getElementById('toggle-settings-2fa');
  if (toggleSettings2fa) {
    toggleSettings2fa.addEventListener('change', () => {
      window.foveaAudio.playClick();
      const state = toggleSettings2fa.checked ? 'ENABLED' : 'DISABLED';
      logActivity(`Two-Factor Authentication: ${state}`, 'tag-blue', 'SECURITY');
    });
  }

  // 6. Login Activity Row
  const rowSettingsLoginActivity = document.getElementById('row-settings-login-activity');
  if (rowSettingsLoginActivity) {
    rowSettingsLoginActivity.addEventListener('click', () => {
      window.foveaAudio.playClick();
      alert('Recent Login Activity:\n• Current Device: Windows 11 Desktop (Jabalpur, MP) - Active Now\n• Hardware Node: FOVEA Smart Frames (BLE 5.3 Connected)\n• Geofence: IIITDM Campus Safe Zone');
      logActivity('Audited Account Login Sessions', 'tag-blue', 'SECURITY');
    });
  }

  // 7. Settings Log Out Banner
  const btnSettingsLogoutBanner = document.getElementById('btn-settings-logout-banner');
  if (btnSettingsLogoutBanner) {
    btnSettingsLogoutBanner.addEventListener('click', () => {
      window.foveaAudio.playClick();
      if (confirm('Are you sure you want to log out of FOVEA?')) {
        logActivity('User Session Ended: Signed out safely', 'tag-red', 'LOGOUT');
        switchToView('dashboard');
      }
    });
  }

  // Initial ready activity
  logActivity('FOVEA Eyewear Connected • Battery 78% • All Channels Ready', 'tag-blue', 'ONLINE');
});
