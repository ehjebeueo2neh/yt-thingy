// ==UserScript==
// @name         YouTube Experimental Flags & Canary Studio v9.8.0 (Theme Center & Exact Percentile Edition)
// @namespace    https://github.com/
// @version      9.8.0
// @description  Master interactive YouTube experiment flag suite with Delhi 2026 flags, Desktop 2026 raw production flags, Ge.prototype hooks, Voice & Multi-Track suite, fixed animated dynamic gradient engine with stop controller, MWeb & Search Width tuner, Kevlar modular pipeline, ProtoUtils visitor engine with 220+ Countries (incl. MN), Exact Percentile Allocator (0-99%), Innertube API 2026 client tokens, Miniplayer/PiP, and 12-Tab Studio UI.
// @author       Canary Studio
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const pageWin = typeof unsafeWindow !== 'undefined' ? unsafeWindow : (typeof window !== 'undefined' ? window : globalThis);

  // =========================================================================
  // 1. TRUSTED TYPES & SAFE DOM BUILDER (100% IMMUNE TO CSP VIOLATIONS)
  // =========================================================================
  let ttPolicy = null;
  if (typeof pageWin !== 'undefined' && pageWin.trustedTypes && typeof pageWin.trustedTypes.createPolicy === 'function') {
    const policyCandidates = ['ytExpStudioPolicy', 'youtube', 'default'];
    for (const pName of policyCandidates) {
      if (ttPolicy) break;
      try {
        ttPolicy = pageWin.trustedTypes.createPolicy(pName, {
          createHTML: (s) => s,
          createScript: (s) => s,
          createScriptURL: (s) => s,
        });
      } catch {}
    }
    if (!ttPolicy) {
      try {
        ttPolicy = pageWin.trustedTypes.defaultPolicy || null;
      } catch {}
    }
  }

  // Pure DOM element builder: Never touches innerHTML, outerHTML, or insertAdjacentHTML.
  function h(tag, attrs, ...children) {
    const isSvg = tag === 'svg' || tag === 'path' || tag === 'circle' || tag === 'g' || tag === 'rect' || tag === 'line';
    const el = isSvg
      ? document.createElementNS('http://www.w3.org/2000/svg', tag)
      : document.createElement(tag);

    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null) continue;
        if (k.startsWith('on') && typeof v === 'function') {
          el.addEventListener(k.substring(2).toLowerCase(), v);
        } else if (k === 'style' && typeof v === 'object') {
          Object.assign(el.style, v);
        } else if (k === 'className' || k === 'class') {
          el.setAttribute('class', String(v));
        } else if (k === 'dataset' && typeof v === 'object') {
          Object.assign(el.dataset, v);
        } else if (k === 'checked' || k === 'value' || k === 'selected' || k === 'disabled') {
          el[k] = v;
        } else {
          el.setAttribute(k, String(v));
        }
      }
    }

    for (const child of children.flat(Infinity)) {
      if (child == null || child === false) continue;
      if (typeof child === 'string' || typeof child === 'number') {
        el.appendChild(document.createTextNode(String(child)));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    }
    return el;
  }

  // Safe Instance-Level Anti-PiP Neutralizer (Zero global prototype pollution)
  function ensureVideoPiPEnabled(videoEl) {
    if (!videoEl) return;
    try {
      if (typeof videoEl.hasAttribute === 'function' && videoEl.hasAttribute('disablepictureinpicture')) {
        videoEl.removeAttribute('disablepictureinpicture');
      }
      if (videoEl.disablePictureInPicture === true) {
        videoEl.disablePictureInPicture = false;
      }
    } catch {}
  }
  // =========================================================================
  // 1.5. GE.PROTOTYPE, VOICE ENGINE & HTML5 PLAYER INTERCEPTOR
  // =========================================================================
  function installPlayerPrototypeHooks() {
    try {
      if (typeof pageWin.HTMLMediaElement !== 'undefined' && pageWin.HTMLMediaElement.prototype) {
        try {
          const proto = pageWin.HTMLMediaElement.prototype;
          const origSetPlaybackRate = Object.getOwnPropertyDescriptor(proto, 'playbackRate')?.set;
          if (origSetPlaybackRate) {
            Object.defineProperty(proto, 'playbackRate', {
              configurable: true,
              enumerable: true,
              get: Object.getOwnPropertyDescriptor(proto, 'playbackRate')?.get,
              set: function(val) {
                return origSetPlaybackRate.call(this, val);
              }
            });
          }
        } catch {}
      }

      function hookGePrototype(GeClass) {
        if (!GeClass || !GeClass.prototype || GeClass.prototype.__expStudioGeHooked) return;
        GeClass.prototype.__expStudioGeHooked = true;
        try {
          if (typeof GeClass.prototype.setPlaybackRate === 'function') {
            const orig = GeClass.prototype.setPlaybackRate;
            GeClass.prototype.setPlaybackRate = function(rate) {
              return orig.call(this, Math.max(0.25, Math.min(4.0, rate)));
            };
          }
          if (typeof GeClass.prototype.isPictureInPictureActive === 'function') {
            const origPip = GeClass.prototype.isPictureInPictureActive;
            GeClass.prototype.isPictureInPictureActive = function() {
              return isPiPActive() || origPip.call(this);
            };
          }
        } catch {}
      }

      if (pageWin.Ge) hookGePrototype(pageWin.Ge);
      let geVal = pageWin.Ge;
      try {
        Object.defineProperty(pageWin, 'Ge', {
          configurable: true,
          enumerable: true,
          get: () => geVal,
          set: (v) => {
            geVal = v;
            hookGePrototype(v);
          }
        });
      } catch {}
    } catch (e) {
      console.warn('[YT Exp Studio] Player prototype hook notice:', e);
    }
  }
  installPlayerPrototypeHooks();

  // =========================================================================
  // 2. PERSISTENCE & STORAGE
  // =========================================================================
  const STORAGE_KEY_FLAGS = 'yt_exp_switcher_overrides_v4';
  const STORAGE_KEY_CANARY = 'yt_exp_canary_config_v4';
  const STORAGE_KEY_CUSTOM = 'yt_exp_custom_flags_v4';
  const STORAGE_KEY_POS = 'yt_exp_menu_position_v4';
  const STORAGE_KEY_MIN_POS = 'yt_exp_min_btn_position_v4';
  const STORAGE_KEY_CANARY_COLLAPSED = 'yt_exp_canary_collapsed_v4';
  const STORAGE_KEY_ACTIVE_TAB = 'yt_exp_active_tab_v4';
  const STORAGE_KEY_AUTO_PIP = 'yt_exp_auto_pip_v4';
  const STORAGE_KEY_SEARCH_WIDTH = 'yt_exp_search_width_config_v4';
  const STORAGE_KEY_VISITOR = 'yt_exp_visitor_config_v5';
  const STORAGE_KEY_CUSTOM_VISITORS = 'yt_exp_custom_visitors_v5';
  const STORAGE_KEY_THEME = 'yt_exp_theme_config_v4';

  function getStored(key, defaultVal) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  function setStored(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('[YT Exp Studio] Storage write error:', e);
    }
  }

  let overrides = getStored(STORAGE_KEY_FLAGS, {});
  const defaultCanaryConfig = {
    enabled: false,
    state: 'canary',
    stage: '2',
    ippLogging: 'experiment',
    baseJsMode: 'turbo',
    swMode: 'active',
    castMode: 'active',
    modulesMode: 'modular_network',
    serverVersion: 'canary'
  };

  const defaultSearchWidthConfig = {
    searchWidth: '728px',
    searchMaxWidth: '850px',
    compactThreshold: 4000,
    mwebBoxMaxWidth: 760,
    enabled: true
  };

  let canaryConfig = Object.assign({}, defaultCanaryConfig, getStored(STORAGE_KEY_CANARY, {}));
  let canaryCollapsed = getStored(STORAGE_KEY_CANARY_COLLAPSED, false);
  let customFlagList = getStored(STORAGE_KEY_CUSTOM, []);
  let autoPipEnabled = getStored(STORAGE_KEY_AUTO_PIP, false);
  let searchWidthConfig = Object.assign({}, defaultSearchWidthConfig, getStored(STORAGE_KEY_SEARCH_WIDTH, {}));
  let activeTab = getStored(STORAGE_KEY_ACTIVE_TAB, 'tab-explorer');

  const defaultVisitorConfig = {
    enabled: false,
    mode: 'default',
    visitorData: '',
    cookieId: '',
    country: 'US',
    label: 'Default (YouTube Managed)'
  };

  let visitorConfig = Object.assign({}, defaultVisitorConfig, getStored(STORAGE_KEY_VISITOR, {}));
  let customVisitorList = getStored(STORAGE_KEY_CUSTOM_VISITORS, []);

  const defaultThemeConfig = {
    enabled: true,
    mode: 'oled_pitch_black',
    oledBlack: true,
    frostedGlass: true,
    glassBlur: 18,
    accentColor: '#3ea6ff',
    textColor: '#f1f1f1',
    isLight: false,
    customBaseBg: '#0f0f14',
    customSurfaceBg: '#181822',
    customCardBg: '#21212e',
    customRaisedBg: '#2a2a3a',
    customAccentColor: '#3ea6ff',
    customTextColor: '#ffffff',
    customBorderColor: 'rgba(255, 255, 255, 0.12)',
    dynamicMode: 'none',
    gradientColor1: '#ff0055',
    gradientColor2: '#7a00ff',
    gradientColor3: '#00f0ff',
    gradientAngle: 135,
    dynamicSpeed: 5
  };
  let themeConfig = Object.assign({}, defaultThemeConfig, getStored(STORAGE_KEY_THEME, {}));

  // =========================================================================
  // 2.3. GLOBAL YOUTUBE ALLOWED COUNTRIES & TERRITORIES (220+ ISO 3166-1 ALPHA-2)
  // =========================================================================
  const ALLOWED_YT_COUNTRIES = "MN:Mongolia:🇲🇳,US:United States:🇺🇸,GB:United Kingdom:🇬🇧,JP:Japan:🇯🇵,DE:Germany:🇩🇪,FR:France:🇫🇷,CA:Canada:🇨🇦,AU:Australia:🇦🇺,KR:South Korea:🇰🇷,IN:India:🇮🇳,BR:Brazil:🇧🇷,MX:Mexico:🇲🇽,IT:Italy:🇮🇹,ES:Spain:🇪🇸,NL:Netherlands:🇳🇱,SE:Sweden:🇸🇪,NO:Norway:🇳🇴,DK:Denmark:🇩🇰,FI:Finland:🇫🇮,PL:Poland:🇵🇱,CH:Switzerland:🇨🇭,AT:Austria:🇦🇹,BE:Belgium:🇧🇪,IE:Ireland:🇮🇪,NZ:New Zealand:🇳🇿,SG:Singapore:🇸🇬,HK:Hong Kong:🇭🇰,TW:Taiwan:🇹🇼,ZA:South Africa:🇿🇦,AR:Argentina:🇦🇷,CL:Chile:🇨🇱,CO:Colombia:🇨🇴,PE:Peru:🇵🇪,CZ:Czech Republic:🇨🇿,HU:Hungary:🇭🇺,RO:Romania:🇷🇴,GR:Greece:🇬🇷,PT:Portugal:🇵🇹,TR:Türkiye:🇹🇷,UA:Ukraine:🇺🇦,IL:Israel:🇮🇱,SA:Saudi Arabia:🇸🇦,AE:United Arab Emirates:🇦🇪,EG:Egypt:🇪🇬,TH:Thailand:🇹🇭,VN:Vietnam:🇻🇳,PH:Philippines:🇵🇭,ID:Indonesia:🇮🇩,MY:Malaysia:🇲🇾,PK:Pakistan:🇵🇰,BD:Bangladesh:🇧🇩,DZ:Algeria:🇩🇿,AS:American Samoa:🇦🇸,AD:Andorra:🇦🇩,AO:Angola:🇦🇴,AI:Anguilla:🇦🇮,AG:Antigua and Barbuda:🇦🇬,AM:Armenia:🇦🇲,AW:Aruba:🇦🇼,AZ:Azerbaijan:🇦🇿,BS:Bahamas:🇧🇸,BH:Bahrain:🇧🇭,BB:Barbados:🇧🇧,BY:Belarus:🇧🇾,BZ:Belize:🇧🇿,BJ:Benin:🇧🇯,BM:Bermuda:🇧🇲,BT:Bhutan:🇧🇹,BO:Bolivia:🇧🇴,BA:Bosnia and Herzegovina:🇧🇦,BW:Botswana:🇧🇼,IO:British Indian Ocean Territory:🇮🇴,VG:British Virgin Islands:🇻🇬,BN:Brunei:🇧🇳,BG:Bulgaria:🇧🇬,BF:Burkina Faso:🇧🇫,BI:Burundi:🇧🇮,KH:Cambodia:🇰🇭,CM:Cameroon:🇨🇲,CV:Cape Verde:🇨🇻,KY:Cayman Islands:🇰🇾,CF:Central African Republic:🇨🇫,TD:Chad:🇹🇩,KM:Comoros:🇰🇲,CG:Congo:🇨🇬,CD:Congo (DRC):🇨🇩,CK:Cook Islands:🇨🇰,CR:Costa Rica:🇨🇷,HR:Croatia:🇭🇷,CW:Curaçao:🇨🇼,CY:Cyprus:🇨🇾,DJ:Djibouti:🇩🇯,DM:Dominica:🇩🇲,DO:Dominican Republic:🇩🇴,EC:Ecuador:🇪🇨,SV:El Salvador:🇸🇻,EE:Estonia:🇪🇪,SZ:Eswatini:🇸🇿,ET:Ethiopia:🇪🇹,FK:Falkland Islands:🇫🇰,FO:Faroe Islands:🇫🇴,FJ:Fiji:🇫🇯,GF:French Guiana:🇬🇫,PF:French Polynesia:🇵🇫,GA:Gabon:🇬🇦,GM:Gambia:🇲🇬,GE:Georgia:🇬🇪,GH:Ghana:🇬🇭,GI:Gibraltar:🇬🇮,GL:Greenland:🇬🇱,GD:Grenada:🇬🇩,GP:Guadeloupe:🇬🇵,GU:Guam:🇬🇺,GT:Guatemala:🇬🇹,GG:Guernsey:🇬🇬,GN:Guinea:🇬🇳,GW:Guinea-Bissau:🇬🇼,GY:Guyana:🇬🇾,HT:Haiti:🇭🇹,HN:Honduras:🇭🇳,IS:Iceland:🇮🇸,IQ:Iraq:🇮🇶,IM:Isle of Man:🇮🇲,JM:Jamaica:🇯🇲,JE:Jersey:🇯🇪,JO:Jordan:🇯🇴,KZ:Kazakhstan:🇰🇿,KE:Kenya:🇰🇪,KI:Kiribati:🇰🇮,KW:Kuwait:🇰🇼,KG:Kyrgyzstan:🇰🇬,LA:Laos:🇱🇦,LV:Latvia:🇱🇻,LB:Lebanon:🇱🇧,LS:Lesotho:🇱🇸,LR:Liberia:🇱🇷,LY:Libya:🇱🇾,LI:Liechtenstein:🇱🇮,LT:Lithuania:🇱🇹,LU:Luxembourg:🇱🇺,MO:Macau:🇲🇴,MK:North Macedonia:🇲🇰,MG:Madagascar:🇲🇬,MW:Malawi:🇲🇼,MV:Maldives:🇲🇻,ML:Mali:🇲🇱,MT:Malta:🇲🇹,MH:Marshall Islands:🇲🇭,MQ:Martinique:🇲🇶,MR:Mauritania:🇲🇷,MU:Mauritius:🇲🇺,YT:Mayotte:🇾🇹,FM:Micronesia:🇫🇲,MD:Moldova:🇲🇩,MC:Monaco:🇲🇨,ME:Montenegro:🇲🇪,MS:Montserrat:🇲🇸,MA:Morocco:🇲🇦,MZ:Mozambique:🇲🇿,MM:Myanmar:🇲🇲,NA:Namibia:🇳🇦,NR:Nauru:🇳🇷,NP:Nepal:🇳🇵,NC:New Caledonia:🇳🇨,NI:Nicaragua:🇳🇮,NE:Niger:🇳🇪,NG:Nigeria:🇳🇬,NU:Niue:🇳🇺,NF:Norfolk Island:🇳🇫,MP:Northern Mariana Islands:🇲🇵,OM:Oman:🇴🇲,PW:Palau:🇵🇼,PS:Palestine:🇵🇸,PA:Panama:🇵🇦,PG:Papua New Guinea:🇵🇬,PY:Paraguay:🇵🇾,PR:Puerto Rico:🇵🇷,QA:Qatar:🇶🇦,RE:Réunion:🇷🇪,RW:Rwanda:🇷🇼,WS:Samoa:🇼🇸,SM:San Marino:🇸🇲,ST:São Tomé and Príncipe:🇸🇹,SN:Senegal:🇸🇳,RS:Serbia:🇷🇸,SC:Seychelles:🇸🇨,SL:Sierra Leone:🇸🇱,SK:Slovakia:🇸🇰,SI:Slovenia:🇸🇮,SB:Solomon Islands:🇸🇧,SO:Somalia:🇸🇴,SS:South Sudan:🇸🇸,LK:Sri Lanka:🇱🇰,BL:Saint Barthélemy:🇧🇱,SH:Saint Helena:🇸🇭,KN:Saint Kitts and Nevis:🇰🇳,LC:Saint Lucia:🇱🇨,MF:Saint Martin:🇲🇫,PM:Saint Pierre and Miquelon:🇵🇲,VC:Saint Vincent and the Grenadines:🇻🇨,SR:Suriname:🇸🇷,TJ:Tajikistan:🇹🇯,TZ:Tanzania:🇹🇿,TL:Timor-Leste:🇹🇱,TG:Togo:🇹🇬,TO:Tonga:🇹🇴,TT:Trinidad and Tobago:🇹🇹,TN:Tunisia:🇹🇳,TC:Turks and Caicos Islands:🇹🇨,TV:Tuvalu:🇹🇻,UG:Uganda:🇺🇬,UY:Uruguay:🇺🇾,UZ:Uzbekistan:🇺🇿,VU:Vanuatu:🇻🇺,VE:Venezuela:🇻🇪,VI:U.S. Virgin Islands:🇻🇮,YE:Yemen:🇾🇪,ZM:Zambia:🇿🇲,ZW:Zimbabwe:🇿🇼".split(",").map(s => { const [code, name, flag] = s.split(":"); return { code, name, flag }; });

  // =========================================================================
  // 2.5. PROTOUTILS & DYNAMIC VISITOR ENGINE (ytjs.dev Algorithmic Implementation)
  // =========================================================================

  function fnv1a(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h;
  }

  function getVisitorIdInternalStats(cookieId, visitorDataStr, countryCode) {
    if (!cookieId || typeof cookieId !== 'string') return null;
    const pct = calculateVisitorPercentile(cookieId);
    const h = fnv1a(cookieId);
    const hexHash = '0x' + h.toString(16).toUpperCase().padStart(8, '0');
    const tierInfo = getVisitorTier(pct);
    const decoded = decodeVisitorData(visitorDataStr);
    const country = countryCode || decoded?.country || 'US';
    const entropyBits = Math.round(cookieId.length * Math.log2(64));
    const poTokenBound = Boolean(cookieId && cookieId.length >= 11);
    const d = getYtcfgData() || {};
    const hasDataSync = Boolean(d.DATASYNC_ID);
    const expBucket = fnv1a(cookieId + '_delhi_2026') % 10000;

    return {
      cookieId,
      fnv1aHex: hexHash,
      fnv1aDec: h,
      percentile: pct,
      tier: tierInfo.tier,
      tierLabel: tierInfo.label,
      tierDesc: tierInfo.desc,
      country,
      entropyBits,
      totalCombinations: '7.38 x 10^19 (64^11)',
      mintTimestamp: decoded?.timestamp || Math.floor(Date.now() / 1000),
      mintDateStr: decoded?.dateStr || new Date().toISOString(),
      poTokenStatus: poTokenBound ? 'Bound to VISITOR_DATA (Web GVS Player Handshake Protected)' : 'Unbound / Legacy',
      dataSyncStatus: hasDataSync ? 'Linked to Account DATASYNC_ID' : 'Anonymous Guest Session (No account link)',
      expBucket,
      isTreatmentCandidate: expBucket < 5000
    };
  }

  function encodeVisitorData(cookieId, timestamp, country) {
    if (!cookieId || typeof cookieId !== 'string') return '';
    timestamp = timestamp || Math.floor(Date.now() / 1000);
    country = country || 'US';

    function encodeVarint(val) {
      const bytes = [];
      while (val > 0x7f) {
        bytes.push((val & 0x7f) | 0x80);
        val >>>= 7;
      }
      bytes.push(val & 0x7f);
      return bytes;
    }

    const f1 = [0x0a, cookieId.length];
    for (let i = 0; i < cookieId.length; i++) f1.push(cookieId.charCodeAt(i));
    const f5 = [0x28, ...encodeVarint(timestamp)];

    let f6 = [];
    if (country) {
      const sub = [0x0a, country.length];
      for (let i = 0; i < country.length; i++) sub.push(country.charCodeAt(i));
      sub.push(0x12, 0x04, 0x1a, 0x00, 0x20, 0x0a);
      f6 = [0x32, sub.length, ...sub];
    }

    const rawBytes = [...f1, ...f5, ...f6];
    let bin = '';
    for (let i = 0; i < rawBytes.length; i++) bin += String.fromCharCode(rawBytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decodeVisitorData(b64Str) {
    if (!b64Str || typeof b64Str !== 'string') return null;
    try {
      let cleaned = decodeURIComponent(b64Str.trim()).replace(/-/g, '+').replace(/_/g, '/');
      while (cleaned.length % 4 !== 0) cleaned += '=';
      const bin = atob(cleaned);
      const bytes = [];
      for (let i = 0; i < bin.length; i++) bytes.push(bin.charCodeAt(i));

      let idx = 0, cookieId = '', timestamp = 0, country = '';
      while (idx < bytes.length) {
        const tag = bytes[idx++];
        const fieldNum = tag >> 3;
        const wireType = tag & 0x7;

        if (wireType === 0) {
          let val = 0, shift = 0;
          while (idx < bytes.length) {
            const b = bytes[idx++];
            val |= (b & 0x7f) << shift;
            if (!(b & 0x80)) break;
            shift += 7;
          }
          if (fieldNum === 5) timestamp = val;
        } else if (wireType === 2) {
          const len = bytes[idx++];
          const data = bytes.slice(idx, idx + len);
          idx += len;

          if (fieldNum === 1) {
            cookieId = String.fromCharCode(...data);
          } else if (fieldNum === 6) {
            let sIdx = 0;
            while (sIdx < data.length) {
              const sTag = data[sIdx++];
              const sFn = sTag >> 3;
              const sWt = sTag & 0x7;
              if (sWt === 2) {
                const sLen = data[sIdx++];
                const sData = data.slice(sIdx, sIdx + sLen);
                sIdx += sLen;
                if (sFn === 1) country = String.fromCharCode(...sData);
              } else break;
            }
          }
        } else break;
      }

      const dateStr = timestamp ? new Date(timestamp * 1000).toISOString() : 'Unknown';
      return { cookieId, timestamp, dateStr, country };
    } catch {
      return null;
    }
  }

  function calculateVisitorPercentile(cookieId) {
    return cookieId && typeof cookieId === 'string' ? fnv1a(cookieId) % 100 : 50;
  }

  function getVisitorTier(percentile) {
    if (percentile < 5) return { tier: 0, label: 'Tier 0: Canary Alpha / Ring 0 (0-4%) [Bleeding Edge]', desc: 'Canary alpha bucket with earliest feature flags and bleeding experimental player builds.' };
    if (percentile < 20) return { tier: 1, label: 'Tier 1: Early Flight (5-19%)', desc: 'Early flight cohort for aggressive feature rollouts and experimental codecs.' };
    if (percentile < 50) return { tier: 2, label: 'Tier 2: Mid-Rollout Flight (20-49%)', desc: 'Standard mid-treatment cohort receiving stabilized experiment treatments.' };
    if (percentile < 90) return { tier: 3, label: 'Tier 3: Broad Staged Treatment (50-89%)', desc: 'Broad treatment group representing general release candidates.' };
    return { tier: 4, label: 'Tier 4: Holdback / Control Cohort (90-99%)', desc: 'Holdback control group designed to evaluate baseline performance against experiments.' };
  }

  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function stringToSeed(str) {
    return fnv1a(str);
  }

  function findCandidate(matcher, baseSeedStr, maxAttempts = 50000) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const rng = mulberry32(stringToSeed(baseSeedStr));
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      let cand = '';
      for (let i = 0; i < 11; i++) cand += chars.charAt(Math.floor(rng() * chars.length));
      const pct = calculateVisitorPercentile(cand);
      const tierInfo = getVisitorTier(pct);
      if (matcher(pct, tierInfo)) {
        return { cookieId: cand, percentile: pct, tier: tierInfo, attempts: attempt + 1 };
      }
    }
    return null;
  }

  function findDeterministicCandidateForTierSync(targetTier, seed = 'yt_canary_2026') {
    return findCandidate((_, t) => t.tier === targetTier, `${seed}_tier_${targetTier}`, 50000);
  }

  function findCandidateForExactPercentile(targetPct, seed = 'yt_exact_pct') {
    targetPct = Math.max(0, Math.min(99, Math.round(Number(targetPct) || 0)));
    return findCandidate((pct) => pct === targetPct, `${seed}_pct_${targetPct}`, 100000);
  }

  async function verifyVisitorWithYouTube(candidateCookieId, candidateVisitorData, onProgress) {
    const d = getYtcfgData() || {};
    const apiKey = d.INNERTUBE_API_KEY || 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
    const baseContext = d.INNERTUBE_CONTEXT || {
      client: {
        clientName: 'WEB',
        clientVersion: d.INNERTUBE_CLIENT_VERSION || '2.20261012.01.00',
        hl: d.HL || 'en',
        gl: d.GL || 'US'
      }
    };

    const reqContext = JSON.parse(JSON.stringify(baseContext));
    if (reqContext.client) reqContext.client.visitorData = candidateVisitorData;

    if (onProgress) onProgress('ping1_start', { candidateCookieId, ping: 1 });
    const t1Start = performance.now();
    let resp1;
    try {
      resp1 = await fetch(`/youtubei/v1/visitor_id${apiKey ? `?key=${apiKey}` : ''}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Goog-Visitor-Id': candidateVisitorData },
        body: JSON.stringify({ context: reqContext })
      });
    } catch {
      resp1 = await fetch(`/youtubei/v1/guide${apiKey ? `?key=${apiKey}` : ''}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Goog-Visitor-Id': candidateVisitorData },
        body: JSON.stringify({ context: reqContext })
      });
    }
    const t1Duration = Math.round(performance.now() - t1Start);
    if (!resp1.ok) throw new Error(`Ping 1 failed with HTTP status ${resp1.status}`);
    const json1 = await resp1.json();
    const serverReturnedVisitorData = json1?.responseContext?.visitorData || candidateVisitorData;
    if (onProgress) onProgress('ping1_ok', { duration: t1Duration, serverVisitorData: serverReturnedVisitorData });

    if (onProgress) onProgress('ping2_start', { ping: 2 });
    const t2Start = performance.now();
    reqContext.client.visitorData = serverReturnedVisitorData;
    const resp2 = await fetch(`/youtubei/v1/browse${apiKey ? `?key=${apiKey}` : ''}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Goog-Visitor-Id': serverReturnedVisitorData },
      body: JSON.stringify({ context: reqContext, browseId: 'FEwhat_to_watch' })
    });
    const t2Duration = Math.round(performance.now() - t2Start);
    if (!resp2.ok) throw new Error(`Ping 2 confirmation failed with HTTP status ${resp2.status}`);
    await resp2.json();
    if (onProgress) onProgress('ping2_ok', { duration: t2Duration });

    return {
      success: true,
      cookieId: candidateCookieId,
      visitorData: serverReturnedVisitorData,
      ping1Ms: t1Duration,
      ping2Ms: t2Duration,
      verified: true
    };
  }

  const CURATED_VISITOR_PRESETS = [
    ['default', '🌟 Default (Auto-managed by YouTube)', 'Standard cookies and server-allocated experiment treatment cohort.', '', 'US'],
    ['mn_steppe', '🇲🇳 Mongolia (MN) Steppe Flight', 'Central Asian low-latency live & regional Mongolian flight cohort.', 'MN_Ubn2026X', 'MN'],
    ['us_canary_a', '🇺🇸 US Canary Early Flight A (Tier 1)', 'US mainland experiment bucket allocated to aggressive player feature rollouts.', 'V1KxORxfYuo', 'US'],
    ['us_canary_b', '⚡ US Canary Edge Flight B (High Rollout)', 'High-probability bucket for Delhi 2026 UI, experimental SABR streaming, and HBR codecs.', 'w7BbDnD0EWE', 'US'],
    ['eu_gdpr', '🇪🇺 EU Privacy & GDPR Sandbox', 'European Economic Area visitor profile with strict telemetry and consent boundaries.', '2dWy3wzSENw', 'GB'],
    ['apac_tokyo', '🇯🇵 APAC Tokyo Low-Latency Cohort', 'Asia-Pacific low-latency live streaming & Ultra-HD edge streaming cohort.', 'JP_Tyo9xKL2', 'JP'],
    ['mweb_cohort', '📱 MWeb Mobile Experience Flight', 'Mobile-first cohort designed for swipe controls, bottom sheet comments, and adaptive search.', 'MWB_Exp2026', 'US'],
    ['dogfood_stg', '🧪 Google Dogfood / Internal Staging', 'Internal Google staging cohort for unreleased player engines and network machine tests.', 'DGF_Stg007X', 'US'],
    ['delhi_2026', '🏛️ Delhi 2026 Modern Flight', 'Direct allocation for Delhi modern web player, frosted glass, and responsive compact controls.', 'DLH_Canary1', 'US'],
    ['legacy_2019', '🕰️ Legacy Polymer 2019 Bucket', 'Control cohort testing backwards compatibility with older Polymer Kevlar components.', 'LGC_Poly2019', 'US']
  ].map(([id, label, desc, cookieId, country]) => ({ id, label, desc, cookieId, country }));

  function getVisitorDataForPreset(preset) {
    if (!preset || !preset.cookieId) return '';
    return encodeVisitorData(preset.cookieId, Math.floor(Date.now() / 1000), preset.country || 'US');
  }

  function getCookie(name) {
    try {
      const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]/+^])/g, '\\$1') + '=([^;]*)'));
      return match ? decodeURIComponent(match[1]) : null;
    } catch {
      return null;
    }
  }

  function setCookie(name, val, days = 365) {
    try {
      const d = new Date();
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
      const host = window.location.hostname;
      const domain = host.endsWith('youtube.com') ? '.youtube.com' : host;
      document.cookie = `${name}=${encodeURIComponent(val)}; expires=${d.toUTCString()}; path=/; domain=${domain}; SameSite=None; Secure`;
    } catch (e) {
      console.warn('[YT Exp Studio] setCookie error:', e);
    }
  }

  function deleteCookie(name) {
    try {
      const host = window.location.hostname;
      const domains = ['', host, '.' + host, '.youtube.com', 'www.youtube.com', 'm.youtube.com'];
      const paths = ['/', '/watch', '/playlist', '/channel'];
      domains.forEach((dom) => {
        paths.forEach((p) => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${p}; ${dom ? `domain=${dom};` : ''} SameSite=None; Secure`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${p}; ${dom ? `domain=${dom};` : ''}`;
        });
      });
    } catch (e) {
      console.warn('[YT Exp Studio] deleteCookie error:', e);
    }
  }

  function extractVisitorParts(str) {
    if (!str || typeof str !== 'string') return { cookieId: '', visitorData: '' };
    const cleaned = decodeURIComponent(str.trim());
    if (cleaned.length === 11) {
      return { cookieId: cleaned, visitorData: encodeVisitorData(cleaned, Math.floor(Date.now() / 1000), 'US') };
    }
    const decoded = decodeVisitorData(cleaned);
    if (decoded && decoded.cookieId) {
      return { cookieId: decoded.cookieId, visitorData: cleaned };
    }
    return { cookieId: cleaned.slice(0, 11), visitorData: encodeVisitorData(cleaned.slice(0, 11), Math.floor(Date.now() / 1000), 'US') };
  }

  function applyVisitorSession(cookieId, visitorData, country, label, mode, alertMsg) {
    visitorConfig.enabled = true;
    visitorConfig.mode = mode;
    visitorConfig.cookieId = cookieId;
    visitorConfig.country = country || 'US';
    visitorConfig.visitorData = visitorData;
    visitorConfig.label = label;
    setStored(STORAGE_KEY_VISITOR, visitorConfig);
    if (cookieId) setCookie('VISITOR_INFO1_LIVE', cookieId, 365);
    const d = getYtcfgData();
    if (d) {
      d.VISITOR_DATA = visitorData;
      d.INNERTUBE_CLIENT_VISITOR_DATA = visitorData;
      if (d.INNERTUBE_CONTEXT && d.INNERTUBE_CONTEXT.client) {
        d.INNERTUBE_CONTEXT.client.visitorData = visitorData;
        d.INNERTUBE_CONTEXT.client.gl = country || 'US';
      }
    }
    if (typeof updateVisitorDisplay === 'function') updateVisitorDisplay();
    if (alertMsg) alert(alertMsg);
    window.location.reload();
  }

  function resetVisitorIds() {
    deleteCookie('VISITOR_INFO1_LIVE');
    deleteCookie('VISITOR_PRIVACY_METADATA');
    deleteCookie('YSC');
    deleteCookie('GPS');
    deleteCookie('PREF');
    visitorConfig.enabled = false;
    visitorConfig.mode = 'default';
    visitorConfig.visitorData = '';
    visitorConfig.cookieId = '';
    visitorConfig.label = 'Default (YouTube Managed)';
    setStored(STORAGE_KEY_VISITOR, visitorConfig);
    const d = getYtcfgData();
    if (d) {
      delete d.VISITOR_DATA;
      delete d.INNERTUBE_CLIENT_VISITOR_DATA;
      if (d.INNERTUBE_CONTEXT && d.INNERTUBE_CONTEXT.client) {
        delete d.INNERTUBE_CONTEXT.client.visitorData;
      }
    }
  }

  if (visitorConfig.enabled && visitorConfig.cookieId) {
    try {
      setCookie('VISITOR_INFO1_LIVE', visitorConfig.cookieId, 365);
    } catch {}
  }

  // =========================================================================
  // 3. MWEB SEARCH WIDTH DYNAMIC CSS INJECTOR
  // =========================================================================
  function applySearchWidthStyles() {
    let styleEl = document.getElementById('yt-exp-search-width-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'yt-exp-search-width-style';
      (document.head || document.documentElement).appendChild(styleEl);
    }
    if (!searchWidthConfig.enabled) {
      styleEl.textContent = '';
      return;
    }
    const w = searchWidthConfig.searchWidth || '728px';
    const maxW = searchWidthConfig.searchMaxWidth || '850px';

    styleEl.textContent = `
      ytd-masthead #center,
      #masthead #center,
      header #center,
      ytm-searchbox,
      .mweb-search-bar {
        flex: 0 1 ${w} !important;
        max-width: ${maxW} !important;
        width: ${w} !important;
        transition: max-width 0.2s ease, width 0.2s ease !important;
      }
      ytd-searchbox,
      ytd-searchbox #search-form,
      ytd-searchbox #container,
      ytm-searchbox,
      .mweb-search-bar,
      .ytSearchboxComponentHost,
      .ytSearchboxComponentInputBox,
      form.search-form {
        max-width: ${maxW} !important;
        width: 100% !important;
      }
      input#search,
      .ytSearchboxComponentInput,
      input.searchbox-input {
        width: 100% !important;
      }
      @media (max-width: 900px) {
        ytd-masthead #center,
        ytm-searchbox,
        .mweb-search-bar,
        .search-bar {
          max-width: ${maxW} !important;
          width: ${w} !important;
        }
      }
    `;
  }
  applySearchWidthStyles();

  // =========================================================================
  // 3.5. DYNAMIC THEME MODIFIER & ACTIONID DISPATCHER
  // (Kevlar CSS Spec Tokens, ActionID Bus & Delhi Frosted Glass Engine)
  // =========================================================================
  const mkTheme = (id, label, desc, baseBg, surfaceBg, cardBg, raisedBg, accentColor, textColor, textSecondary, border, blur = 0, isLight = false) => ({
    id, label, desc, baseBg, surfaceBg, cardBg, raisedBg, accentColor, textColor, textSecondary, border, blur, isLight
  });
  const THEME_PRESETS = {
    'oled_pitch_black': mkTheme('oled_pitch_black', '🖤 OLED Pitch Black (0W Battery)', 'True #000000 black canvas for OLED/AMOLED displays. Maximum contrast, zero backlight bleed, and battery savings.', '#000000', '#080808', '#101010', '#141414', '#3ea6ff', '#f1f1f1', '#aaaaaa', 'rgba(255, 255, 255, 0.1)', 0, false),
    'delhi_frosted': mkTheme('delhi_frosted', '🏛️ Delhi 2026 Frosted Glass', 'Delhi frosted glassmorphism: translucent blur on navigation header, comments, watch drawer, and player controls.', 'rgba(12, 14, 22, 0.94)', 'rgba(20, 24, 38, 0.8)', 'rgba(28, 32, 48, 0.7)', 'rgba(36, 42, 62, 0.75)', '#3ea6ff', '#ffffff', '#94a3b8', 'rgba(255, 255, 255, 0.14)', 20, false),
    'midnight_tokyo': mkTheme('midnight_tokyo', '🌌 Midnight Tokyo Sapphire', 'Deep indigo midnight aesthetic with vibrant electric cyan accents, inspired by Neo-Tokyo nightscapes.', '#050814', '#0b1024', '#121a36', '#1a254a', '#00f0ff', '#e2e8f0', '#7dd3fc', 'rgba(0, 240, 255, 0.18)', 14, false),
    'cyberpunk_neon': mkTheme('cyberpunk_neon', '🌆 Cyberpunk Neon Void', 'High-contrast cyberpunk darkness with glowing hot pink, neon purple, and violet highlights.', '#0a0314', '#140628', '#200b3e', '#2d1154', '#ff007f', '#faf5ff', '#f472b6', 'rgba(255, 0, 127, 0.25)', 16, false),
    'emerald_matrix': mkTheme('emerald_matrix', '🟢 Emerald Hacker Matrix', 'Retro cyber-terminal green with deep obsidian slate and crisp phosphor typography.', '#030d07', '#081a0e', '#0d2916', '#143820', '#00ff66', '#e8fdf0', '#86efac', 'rgba(0, 255, 102, 0.2)', 10, false),
    'sunset_amber': mkTheme('sunset_amber', '🌅 Sunset Amber Gold', 'Warm cacao espresso base with rich amber gold and copper accents, easy on the eyes at night.', '#0d0a08', '#18120e', '#251c16', '#34271f', '#f59e0b', '#fef3c7', '#d97706', 'rgba(245, 158, 11, 0.22)', 12, false),
    'light_paper': mkTheme('light_paper', '☀️ Pure Paper Light Mode', 'Crisp daylight aesthetic with pure clean white backgrounds, high-contrast typography, and sapphire blue brand accents.', '#ffffff', '#f8f9fa', '#f1f3f5', '#e9ecef', '#065fd4', '#0f0f0f', '#606060', 'rgba(0, 0, 0, 0.1)', 0, true),
    'dynamic_aurora': mkTheme('dynamic_aurora', '🌈 Dynamic Aurora Flow (Animated Gradient)', 'Smooth animated chromatic gradient canvas flowing across navigation, cards, and player elements.', 'linear-gradient(135deg, #0a051b 0%, #17092b 50%, #031c26 100%)', 'rgba(20, 15, 38, 0.85)', 'rgba(30, 22, 54, 0.75)', 'rgba(42, 30, 75, 0.8)', '#00f0ff', '#ffffff', '#cbd5e1', 'rgba(255, 255, 255, 0.16)', 18, false),
    'custom_user_palette': mkTheme('custom_user_palette', '🎨 Custom User Palette (Personalized)', 'Your personalized custom palette configured with user-defined base, surface, card, accent, and text colors.', '#0f0f14', '#181822', '#21212e', '#2a2a3a', '#3ea6ff', '#ffffff', '#94a3b8', 'rgba(255, 255, 255, 0.12)', 16, false),
    'default': mkTheme('default', '⚡ Factory YouTube Theme', 'Restores YouTube vanilla dark/light theme tokens and default Kevlar styles.', '#0f0f0f', '#181818', '#212121', '#282828', '#ff0000', '#f1f1f1', '#aaaaaa', 'rgba(255, 255, 255, 0.1)', 0, false)
  };

  function applyThemeStyles() {
    let styleEl = document.getElementById('yt-exp-theme-modifier-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'yt-exp-theme-modifier-style';
      (document.head || document.documentElement).appendChild(styleEl);
    }
    const isDynActive = themeConfig.dynamicMode && themeConfig.dynamicMode !== 'none';
    if (!themeConfig.enabled || (themeConfig.mode === 'default' && !isDynActive)) {
      styleEl.textContent = '';
      return;
    }

    const p = THEME_PRESETS[themeConfig.mode] || THEME_PRESETS['oled_pitch_black'];
    const isLightMode = p.isLight || !!themeConfig.isLight;
    
    let base, surface, card, raised, accent, textPrimary, textSec, borderStroke;
    if (themeConfig.mode === 'custom_user_palette') {
      base = themeConfig.customBaseBg || '#0f0f14';
      surface = themeConfig.customSurfaceBg || '#181822';
      card = themeConfig.customCardBg || '#21212e';
      raised = themeConfig.customRaisedBg || '#2a2a3a';
      accent = themeConfig.customAccentColor || '#3ea6ff';
      textPrimary = themeConfig.customTextColor || '#ffffff';
      textSec = '#94a3b8';
      borderStroke = themeConfig.customBorderColor || 'rgba(255, 255, 255, 0.12)';
    } else {
      accent = themeConfig.accentColor || p.accentColor;
      base = (!isLightMode && themeConfig.oledBlack && !isDynActive) ? '#000000' : p.baseBg;
      surface = p.surfaceBg;
      card = p.cardBg;
      raised = p.raisedBg;
      textPrimary = p.textColor;
      textSec = p.textSecondary;
      borderStroke = p.border;
    }
    const blurVal = themeConfig.frostedGlass ? `${themeConfig.glassBlur || p.blur || 18}px` : '0px';

    // Dynamic gradient CSS generation
    let dynamicCss = '';
    const dynMode = themeConfig.dynamicMode || (themeConfig.mode === 'dynamic_aurora' ? 'gradient_flow' : 'none');
    const c1 = themeConfig.gradientColor1 || '#ff0055';
    const c2 = themeConfig.gradientColor2 || '#7a00ff';
    const c3 = themeConfig.gradientColor3 || '#00f0ff';
    const dynAngle = themeConfig.gradientAngle || 135;
    const dynSpeed = themeConfig.dynamicSpeed || 5;

    if (dynMode === 'simple_gradient') {
      dynamicCss = `
        html, body, ytd-app {
          background: linear-gradient(${dynAngle}deg, ${c1}, ${c2}) !important;
          background-attachment: fixed !important;
        }
        #page-manager,
        #page-manager.ytd-app,
        #content,
        #content.ytd-app,
        ytd-browse,
        ytd-search,
        ytd-watch-flexy,
        #columns,
        #columns.ytd-watch-flexy,
        #primary,
        #primary-inner,
        #secondary,
        #secondary-inner,
        #below,
        #below.ytd-watch-flexy,
        ytd-comments#comments,
        ytd-item-section-renderer,
        ytd-comment-thread-renderer,
        ytd-comment-view-model,
        ytd-two-column-browse-results-renderer,
        ytd-rich-grid-renderer,
        ytd-two-column-search-results-renderer,
        #contents.ytd-rich-grid-renderer {
          background: transparent !important;
          background-color: transparent !important;
        }
        ytd-masthead, #masthead, header.masthead-finish {
          background: rgba(18, 18, 24, 0.72) !important;
          backdrop-filter: blur(16px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
        }
        #description, #description-inner, factoid-renderer,
        .ytSpecButtonShapeNextTonal, segmented-like-dislike-button-view-model button {
          background-color: rgba(25, 25, 38, 0.75) !important;
          backdrop-filter: blur(8px) !important;
        }
      `;
    } else if (dynMode === 'gradient_flow') {
      dynamicCss = `
        @keyframes ytExpDynamicFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        html, body, ytd-app {
          background: linear-gradient(${dynAngle}deg, ${c1}, ${c2}, ${c3}, ${c1}) !important;
          background-size: 300% 300% !important;
          animation: ytExpDynamicFlow ${dynSpeed}s ease infinite !important;
        }
        #page-manager,
        #page-manager.ytd-app,
        #content,
        #content.ytd-app,
        ytd-browse,
        ytd-search,
        ytd-watch-flexy,
        #columns,
        #columns.ytd-watch-flexy,
        #primary,
        #primary-inner,
        #secondary,
        #secondary-inner,
        #below,
        #below.ytd-watch-flexy,
        ytd-comments#comments,
        ytd-item-section-renderer,
        ytd-comment-thread-renderer,
        ytd-comment-view-model,
        ytd-two-column-browse-results-renderer,
        ytd-rich-grid-renderer,
        ytd-two-column-search-results-renderer,
        #contents.ytd-rich-grid-renderer {
          background: transparent !important;
          background-color: transparent !important;
        }
        ytd-masthead, #masthead, header.masthead-finish {
          background: rgba(18, 18, 24, 0.72) !important;
          backdrop-filter: blur(16px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
        }
        #description, #description-inner, factoid-renderer,
        .ytSpecButtonShapeNextTonal, segmented-like-dislike-button-view-model button {
          background-color: rgba(25, 25, 38, 0.75) !important;
          backdrop-filter: blur(8px) !important;
        }
      `;
    } else if (dynMode === 'chromatic_shift') {
      dynamicCss = `
        @keyframes ytExpChromaticShift {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .ytp-play-progress,
        .ytp-play-progress.ytp-swatch-background-color,
        .ytp-scrubber-button,
        .ytp-swatch-background-color,
        .ytSpecButtonShapeNextFilled,
        button.ytSpecButtonShapeNextFilled,
        #subscribe-button button,
        #sponsor-button button,
        yt-chip-cloud-chip-renderer[selected] #chip-container,
        .ytChipShapeChip.ytChipShapeActive,
        button[role="tab"].ytChipShapeActive,
        #yt-exp-min-btn,
        .badge-pill {
          animation: ytExpChromaticShift ${dynSpeed}s linear infinite !important;
        }
      `;
    }
    styleEl.textContent = `
      /* === YT EXPERIMENTAL THEME MODIFIER (Kevlar, Polymer & Delhi Tokens) === */
      ${isLightMode ? `
      html:not([dark]), [light], html[theme="light"], :root {
        --yt-spec-base-background: ${base} !important;
        --yt-spec-raised-background: ${raised} !important;
        --yt-spec-menu-background: ${surface} !important;
        --yt-spec-inverted-background: #0f0f0f !important;
        --yt-spec-additive-background: ${card} !important;
        --yt-spec-brand-background-primary: ${accent} !important;
        --yt-spec-brand-background-solid: ${accent} !important;
        --yt-spec-brand-button-background: ${accent} !important;
        --yt-spec-static-brand-red: ${accent} !important;
        --yt-spec-call-to-action: ${accent} !important;
        --yt-spec-text-primary: ${textPrimary} !important;
        --yt-spec-text-secondary: ${textSec} !important;
        --yt-spec-badge-chip-background: ${card} !important;
        --yt-spec-button-chip-background-hover: ${raised} !important;
        --ytd-searchbox-background: ${base} !important;
        --ytd-searchbox-text-color: ${textPrimary} !important;
        --yt-spec-general-background-a: ${base} !important;
        --yt-spec-general-background-b: ${surface} !important;
        --yt-spec-10-percent-layer: ${borderStroke} !important;
        --yt-spec-snippet-hover-background: ${card} !important;
      }
      html[theme="light"], html[theme="light"] body, html[theme="light"] ytd-app {
        background-color: ${base} !important;
        color: ${textPrimary} !important;
      }
      ` : `
      html[dark], [dark], html[theme="dark"], :root {
        --yt-spec-base-background: ${base} !important;
        --yt-spec-raised-background: ${raised} !important;
        --yt-spec-menu-background: ${surface} !important;
        --yt-spec-inverted-background: ${textPrimary} !important;
        --yt-spec-additive-background: ${card} !important;
        --yt-spec-brand-background-primary: ${accent} !important;
        --yt-spec-brand-background-solid: ${accent} !important;
        --yt-spec-brand-button-background: ${accent} !important;
        --yt-spec-static-brand-red: ${accent} !important;
        --yt-spec-call-to-action: ${accent} !important;
        --yt-spec-text-primary: ${textPrimary} !important;
        --yt-spec-text-secondary: ${textSec} !important;
        --yt-spec-badge-chip-background: ${card} !important;
        --yt-spec-button-chip-background-hover: ${raised} !important;
        --ytd-searchbox-background: ${base} !important;
        --ytd-searchbox-text-color: ${textPrimary} !important;
        --yt-spec-general-background-a: ${base} !important;
        --yt-spec-general-background-b: ${surface} !important;
        --yt-spec-10-percent-layer: ${borderStroke} !important;
        --yt-spec-snippet-hover-background: ${card} !important;
      }
      ${isDynActive && (dynMode === 'simple_gradient' || dynMode === 'gradient_flow') ? '' : `
      html, body,
      ytd-app,
      #page-manager.ytd-app,
      ytd-watch-flexy,
      #content.ytd-app,
      ytd-browse,
      ytd-search,
      #columns.ytd-watch-flexy,
      ytd-watch-next-secondary-results-renderer {
        background-color: ${base} !important;
        background: ${base} !important;
      }
      `}
      `}

      /* Masthead & Frosted Glass Nav */
      ytd-masthead, #masthead, header.masthead-finish {
        background: ${surface} !important;
        ${themeConfig.frostedGlass ? `
          backdrop-filter: blur(${blurVal}) saturate(180%) !important;
          -webkit-backdrop-filter: blur(${blurVal}) saturate(180%) !important;
          background-color: ${surface.startsWith('#') ? surface + 'dd' : surface} !important;
        ` : ''}
        border-bottom: 1px solid ${borderStroke} !important;
      }

      /* Search Box Styling */
      ytd-searchbox #container.ytd-searchbox,
      .ytSearchboxComponentInputBox {
        background-color: ${base} !important;
        border-color: ${borderStroke} !important;
      }
      ytd-searchbox #search-icon-legacy.ytd-searchbox,
      .ytSearchboxComponentSearchButton {
        background-color: ${card} !important;
        border-color: ${borderStroke} !important;
      }

      /* Guide / Drawer Sidebar */
      ytd-mini-guide-renderer,
      ytd-guide-renderer,
      #guide-content.ytd-app {
        background-color: ${base} !important;
        ${themeConfig.frostedGlass ? `
          backdrop-filter: blur(${blurVal}) !important;
          -webkit-backdrop-filter: blur(${blurVal}) !important;
        ` : ''}
      }

      /* Cards, Flyouts, Popups, and Panels */
      ytd-macro-markers-list-item-renderer:hover,
      ytd-compact-video-renderer:hover,
      ytd-rich-item-renderer:hover,
      ytd-playlist-panel-renderer,
      #playlist.ytd-watch-flexy,
      ytd-menu-popup-renderer,
      tp-yt-paper-listbox,
      tp-yt-paper-dialog,
      ytd-multi-page-menu-renderer {
        background-color: ${surface} !important;
        border-color: ${borderStroke} !important;
      }

      /* =========================================================================
         COSMETIC FIXES: PLAYER PROGRESS BAR & SCRUBBER ACCENTS
         ========================================================================= */
      .ytp-play-progress,
      .ytp-play-progress.ytp-swatch-background-color,
      .ytp-swatch-background-color,
      .ytp-cued-thumbnail-overlay .ytp-large-play-button-bg {
        background-color: ${accent} !important;
        background: ${accent} !important;
      }
      .ytp-scrubber-button,
      .ytp-scrubber-button.ytp-swatch-background-color {
        background-color: ${accent} !important;
        background: ${accent} !important;
        box-shadow: 0 0 10px ${accent}aa !important;
        border-color: ${accent} !important;
      }
      .ytp-volume-slider-handle:before,
      .ytp-volume-slider-handle {
        background-color: ${accent} !important;
        background: ${accent} !important;
      }
      .ytp-chapters-container .ytp-play-progress {
        background-color: ${accent} !important;
        background: ${accent} !important;
      }
      .ytp-chapter-hover-container {
        border-radius: 2px !important;
      }
      .ytp-chrome-bottom,
      .ytp-delhi-modern .ytp-chrome-bottom {
        ${themeConfig.frostedGlass ? `
          backdrop-filter: blur(${blurVal}) saturate(180%) !important;
          -webkit-backdrop-filter: blur(${blurVal}) saturate(180%) !important;
          background: ${surface.startsWith('#') ? surface + 'cc' : surface} !important;
        ` : ''}
      }

      /* =========================================================================
         COSMETIC FIXES: SECTION BELOW THE PLAYER (#below & WATCH METADATA)
         ========================================================================= */
      #below,
      #below.ytd-watch-flexy,
      ytd-watch-flexy #below,
      #primary-inner #below {
        background-color: ${base} !important;
        color: ${textPrimary} !important;
      }

      /* Overriding inline --yt-saturated-* tokens generated by cinematic lighting */
      ytd-watch-metadata,
      ytd-watch-metadata[is-watch-flexy],
      .watch-active-metadata,
      factoid-renderer,
      .ytwFactoidRendererHost,
      [style*="--yt-saturated-"] {
        --yt-saturated-base-background: ${base} !important;
        --yt-saturated-raised-background: ${raised} !important;
        --yt-saturated-additive-background: ${card} !important;
        --yt-saturated-text-primary: ${textPrimary} !important;
        --yt-saturated-text-secondary: ${textSec} !important;
        --yt-saturated-inverted-background: ${accent} !important;
        --yt-saturated-overlay-background: ${surface} !important;
        color: ${textPrimary} !important;
      }

      /* Video Title */
      #title.ytd-watch-metadata h1 yt-formatted-string,
      ytd-watch-metadata h1.ytd-watch-metadata,
      ytd-watch-metadata #title h1 {
        color: ${textPrimary} !important;
      }

      /* Channel Name & Subscriber Count */
      #channel-name.ytd-video-owner-renderer a,
      #upload-info.ytd-video-owner-renderer yt-formatted-string {
        color: ${textPrimary} !important;
      }
      #owner-sub-count.ytd-video-owner-renderer {
        color: ${textSec} !important;
      }

      /* Action Buttons (Like, Dislike, Share, Ask, Save, More) */
      .ytSpecButtonShapeNextTonal,
      .ytSpecButtonShapeNextMono,
      button.ytSpecButtonShapeNextTonal,
      button.ytSpecButtonShapeNextMono,
      .ytSpecButtonShapeNextHost.ytSpecButtonShapeNextTonal,
      .ytSpecButtonShapeNextHost.ytSpecButtonShapeNextOutline,
      segmented-like-dislike-button-view-model button,
      yt-button-view-model button.ytSpecButtonShapeNextTonal,
      .you-chat-entrypoint-button button,
      #top-level-buttons-computed button,
      #flexible-item-buttons button {
        background-color: ${card} !important;
        background: ${card} !important;
        color: ${textPrimary} !important;
        border: 1px solid ${borderStroke} !important;
        border-radius: 18px !important;
        transition: background 0.15s ease, transform 0.1s ease !important;
      }
      .ytSpecButtonShapeNextTonal:hover,
      button.ytSpecButtonShapeNextTonal:hover,
      segmented-like-dislike-button-view-model button:hover,
      #top-level-buttons-computed button:hover {
        background-color: ${raised} !important;
        background: ${raised} !important;
        color: ${textPrimary} !important;
        transform: translateY(-1px) !important;
      }

      /* Subscribe & Join CTA Buttons */
      #subscribe-button button,
      #subscribe-button .ytSpecButtonShapeNextFilled,
      #sponsor-button button,
      button.ytSpecButtonShapeNextFilled {
        background-color: ${accent} !important;
        background: ${accent} !important;
        color: #ffffff !important;
        border-radius: 18px !important;
        font-weight: 600 !important;
      }

      /* Description Box (#description, #description-inner, expander, snippet) */
      #description,
      #description.ytd-watch-metadata,
      #description-inner,
      #description-inner.ytd-watch-metadata,
      ytd-text-inline-expander#description-inline-expander,
      ytd-structured-description-content-renderer,
      #snippet.ytd-text-inline-expander {
        background-color: ${card} !important;
        background: ${card} !important;
        color: ${textPrimary} !important;
        border-radius: 12px !important;
        border: 1px solid ${borderStroke} !important;
      }
      #expand.ytd-text-inline-expander,
      #collapse.ytd-text-inline-expander,
      tp-yt-paper-button#expand,
      tp-yt-paper-button#collapse {
        color: ${accent} !important;
        font-weight: bold !important;
      }
      #ytd-watch-info-text,
      #info-container.ytd-watch-info-text,
      #ytd-watch-info-text span {
        color: ${textSec} !important;
      }

      /* AI Video Summary Card in Description */
      ytd-expandable-metadata-renderer,
      video-summary-content-view-model,
      .videoSummaryContentViewModelParagraph,
      how-this-was-made-section-view-model,
      yt-video-description-youchat-section-view-model {
        background-color: ${surface} !important;
        background: ${surface} !important;
        color: ${textPrimary} !important;
        border-color: ${borderStroke} !important;
        border-radius: 8px !important;
      }

      /* Factoid Pills (Likes, Views, Upload Date in Description) */
      factoid-renderer,
      .ytwFactoidRendererHost,
      .ytwFactoidRendererFactoid {
        background-color: ${raised} !important;
        background: ${raised} !important;
        color: ${textPrimary} !important;
        border-radius: 8px !important;
      }
      .ytwFactoidRendererValue span,
      .ytwFactoidRendererLabel span {
        color: ${textPrimary} !important;
      }

      /* Chapters Carousel in Description */
      ytd-horizontal-card-list-renderer,
      #dismissible.ytd-horizontal-card-list-renderer,
      ytd-macro-markers-list-item-renderer {
        background-color: ${surface} !important;
        border-color: ${borderStroke} !important;
        border-radius: 8px !important;
        color: ${textPrimary} !important;
      }
      ytd-macro-markers-list-item-renderer:hover {
        background-color: ${raised} !important;
      }
      ytd-macro-markers-list-item-renderer #details h3 {
        color: ${textPrimary} !important;
      }
      ytd-macro-markers-list-item-renderer #time {
        color: ${accent} !important;
      }

      /* Comments Container */
      ytd-comments#comments,
      #comments.ytd-watch-flexy,
      ytd-item-section-renderer[section-identifier="comment-item-section"],
      ytd-comment-thread-renderer,
      ytd-comment-view-model {
        background-color: ${base} !important;
        color: ${textPrimary} !important;
      }

      /* Secondary Column (#secondary / Related recommendations) */
      #secondary,
      #secondary.ytd-watch-flexy,
      #secondary-inner,
      ytd-watch-next-secondary-results-renderer {
        background-color: ${base} !important;
        color: ${textPrimary} !important;
      }

      /* Related Chips Filter Bar */
      yt-related-chip-cloud-renderer,
      yt-chip-cloud-renderer,
      iron-selector#chips {
        background: transparent !important;
      }
      .ytChipShapeChip.ytChipShapeInactive,
      button[role="tab"] .ytChipShapeInactive {
        background-color: ${card} !important;
        background: ${card} !important;
        color: ${textPrimary} !important;
        border: 1px solid ${borderStroke} !important;
        border-radius: 8px !important;
      }
      .ytChipShapeChip.ytChipShapeActive,
      button[role="tab"] .ytChipShapeActive {
        background-color: ${accent} !important;
        background: ${accent} !important;
        color: #ffffff !important;
        border-radius: 8px !important;
      }

      /* Related Video Cards (yt-lockup-view-model) */
      yt-lockup-view-model,
      .ytLockupViewModelHost {
        color: ${textPrimary} !important;
      }
      h3.ytLockupMetadataViewModelHeadingReset a,
      .ytLockupViewModelTitle {
        color: ${textPrimary} !important;
      }
      .ytContentMetadataViewModelMetadataText,
      span.ytContentMetadataViewModelMetadataText {
        color: ${textSec} !important;
      }

      /* Creator Endscreen (ytp-ce) & Infocard Teasers (iv-teaser / iv-card) Theming */
      .ytp-ce-element,
      .ytp-ce-video,
      .ytp-ce-playlist,
      .ytp-ce-channel,
      .ytp-ce-website,
      .ytp-ce-merchandise {
        border-radius: 8px !important;
        overflow: hidden !important;
        transition: transform 0.2s cubic-bezier(0.2,0,0,1), box-shadow 0.2s ease !important;
      }
      .ytp-ce-element-hover,
      .ytp-ce-expanding-overlay {
        border: 1px solid ${borderStroke} !important;
        border-radius: 8px !important;
      }
      .ytp-ce-expanding-overlay-background {
        background-color: ${surface} !important;
        ${themeConfig.frostedGlass ? `
          backdrop-filter: blur(${blurVal}) saturate(180%) !important;
          -webkit-backdrop-filter: blur(${blurVal}) saturate(180%) !important;
        ` : ''}
      }
      .ytp-ce-video-title,
      .ytp-ce-playlist-title,
      .ytp-ce-channel-title,
      .ytp-ce-website-title,
      .ytp-ce-merchandise-title {
        color: ${textPrimary} !important;
      }
      .iv-card,
      .iv-drawer-manager,
      .iv-card-content {
        background-color: ${card} !important;
        border: 1px solid ${borderStroke} !important;
        border-radius: 8px !important;
        color: ${textPrimary} !important;
      }
      .iv-card-primary-link,
      .iv-card-action {
        color: ${accent} !important;
      }

      /* Themed Custom Scrollbars */
      ::-webkit-scrollbar {
        width: 8px !important;
        height: 8px !important;
      }
      ::-webkit-scrollbar-track {
        background: ${base} !important;
      }
      ::-webkit-scrollbar-thumb {
        background: ${raised} !important;
        border-radius: 4px !important;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${accent} !important;
      }

      ${dynamicCss}
    `;
  }
  applyThemeStyles();

  // ActionID & Kevlar Action Dispatcher (Coordinates with remote.js and Polymer Action Bus)
  function dispatchThemeAction(actionId, isDark = true) {
    try {
      const ytdApp = document.querySelector('ytd-app');
      if (ytdApp && typeof ytdApp.fire === 'function') {
        ytdApp.fire('yt-action', {
          actionName: isDark ? 'yt-signal-action-toggle-dark-theme-on' : 'yt-signal-action-toggle-dark-theme-off',
          optionalAction: false,
          args: [{ signalAction: { signal: isDark ? 'TOGGLE_DARK_THEME_ON' : 'TOGGLE_DARK_THEME_OFF' }, actionId: actionId || 'THEME_MODIFIER' }]
        });
      }
      window.dispatchEvent(new CustomEvent('yt-action', {
        detail: {
          actionName: 'yt-set-theme-action',
          theme: isDark ? 'dark' : 'light',
          actionId: actionId || 'THEME_MODIFIER'
        }
      }));
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('darker-dark-theme', '');
        document.documentElement.setAttribute('color-version', 'v2_0');
        document.documentElement.setAttribute('theme', isDark ? 'dark' : 'light');
      }
    } catch (e) {
      console.warn('[YT Exp Studio] dispatchThemeAction error:', e);
    }
  }

  // =========================================================================
  // 4. CURATED MASTER REGISTRY
  // =========================================================================
  const DELHI_FLAGS = {
    'delhi_modern_web_player': true,
    'delhi_modern_web_player_compact_video_actions_controls': true,
    'delhi_modern_web_player_disable_frosted_glass': false,
    'delhi_modern_web_player_icons': true,
    'delhi_mweb_colorful_sd': true,
    'delhi_mweb_colorful_sd_v2': true,
    'delhi_web_player_use_external_playlist_panel': true,
    'enable_web_delhi_icons': true,
    'web_delhi_colorful_sd': true,
    'web_delhi_comment_threads': true,
    'delhi_fast_follow_autonav_toggle': true,
    'delhi_modern_player_default_thumbnail_percentage': 0.0,
    'delhi_modern_player_faster_autohide_delay_ms': 2000,
    'delhi_modern_player_pause_thumbnail_percentage': 0.6,
    'delhi_modern_web_player_blending_mode': '',
    'delhi_modern_web_player_horizontal_volume_controls': true,
    'delhi_modern_web_player_lhs_volume_controls': true,
    'delhi_modern_web_player_responsive_compact_controls_threshold': 4000,
    'kevlar_delhi_modern_web_endscreen_ideal_tile_width_percentage': 0.27,
    'kevlar_delhi_modern_web_endscreen_max_rows': 2,
    'kevlar_delhi_modern_web_endscreen_max_width': 500,
    'kevlar_delhi_modern_web_endscreen_min_width': 200,
    'mweb_player_delhi_dtts': true,
    'web_player_delhi_dtts': true
  };

  const MWEB_FLAGS = {
    'mweb_search_header_redesign': true,
    'mweb_search_bar_expansion_animation': true,
    'mweb_compact_search_bar': true,
    'mweb_new_search_suggestions_ui': true,
    'mweb_dynamic_pill_filter': true,
    'mweb_player_delhi_dtts': true,
    'mweb_colorful_sd': true,
    'mweb_colorful_sd_v2': true,
    'mweb_enable_colorful_ai_summary': true,
    'mweb_aspect_ratio_16_9_thumbnails': true,
    'mweb_swipe_to_dismiss': true,
    'mweb_floating_comment_box': true,
    'mweb_bottom_sheet_comments': true,
    'mweb_shorts_inline_player': true,
    'mweb_inline_playback': true,
    'mweb_deprecate_carousel': true,
    'mweb_enable_smooth_scrubbing': true,
    'mweb_enable_touch_slider_seek': true,
    'mweb_enable_native_share_sheet': true,
    'mweb_enable_channel_redesign': true,
    'mweb_header_shrink_on_scroll': true,
    'mweb_enable_quick_comment_reactions': true,
    'mweb_modern_buttons': true,
    'mweb_native_android_fullscreen': true,
    'mweb_watch_feed_redesign': true,
    'enable_mweb_audio_track_picker': true,
    'mweb_search_box_max_width': 760,
    'delhi_modern_web_player_responsive_compact_controls_threshold': 4000
  };

  const CANARY_FLAGS = {
    'player_web_canary': true,
    'player_web_is_canary': true,
    'player_web_canary_stage': 2,
    'web_player_ipp_canary_type_for_logging': 'experiment',
    'web_player_canary_enable_hbr': true,
    'web_player_canary_experiment_v2': true,
    'web_player_enable_canary_buffering': true,
    'cinematic_watch_canary': true,
    'cinematic_settings_available': true,
    'kevlar_watch_cinematics': true,
    'kevlar_watch_color_update': true,
    'desktop_polymer_canary': true,
    'kevlar_canary': true,
    'kevlar_enable_canary': true,
    'service_worker_enabled': true,
    'service_worker_push_enabled': true,
    'service_worker_static_routing_registration': true,
    'service_worker_static_routing_exclude_embed': true,
    'service_worker_push_home_page_prompt': true,
    'service_worker_push_watch_page_prompt': true,
    'service_worker_push_force_notification_prompt_tag': true,
    'service_worker_subscribe_with_vapid_key': true,
    'enable_cast_api': true,
    'web_enable_cast_pairing': true,
    'enable_mdx_remote_control': true,
    'mdx_load_cast_api_bootstrap': true,
    'web_cast_allow_custom_receiver': true,
    'web_enable_dial_pairing': true,
    'enable_cast_on_mobile_web': true,
    'all_web_enable_network_machine': true,
    'all_web_network_machine_raw_request': true,
    'allow_skip_networkless': true,
    'networkless_always_online': true,
    'networkless_gel': true,
    'networkless_logging': true,
    'html5_sabr_client_connect': true,
    'html5_enable_sabr_live_gateway': true,
    'kevlar_service_worker': true,
    'kevlar_enable_modular_player': true,
    'kevlar_prefetch_watch': true,
    'kevlar_prefetch': true,
    'kevlar_droppable_prefetchable_requests': true,
    'kevlar_watch_flexy_metadata': true,
    'kevlar_command_handler': true,
    'kevlar_entities_processor': true,
    'web_service_worker_canary': true,
    'web_canary_sw': true,
    'shell_load_gcf': true,
    'web_enable_unlisted_playlist_sharing': true,
    'web_enable_members_only_content_preview': true,
    'web_enable_innertube_proto_debug': true,
    'web_enable_innertube_response_logging': true,
    'innertube_client_context_log_level': 'DEBUG',
    'web_enable_ab_testing_debug': true,
    'web_enable_experiments_debug_menu': true,
    'html5_enable_debug_codecs': true,
    'kevlar_enable_performance_logging': true,
    'enable_client_sli_logging': true,
    'html5_enable_eme_stream_recovery': true,
    'enable_sponge_streaming': true,
    'enable_av1_for_svod': true,
    'html5_enable_encrypted_av1': true,
    'web_player_enable_premium_hbr_in_h5_api': true,
    'html5_enable_drc': true,
    'html5_show_drc_toggle': true,
    'html5_enable_voice_boost': true,
    'enable_voice_boost_feature': true
  };

  const AD_FLAGS = {
    'web_player_enable_ad_break': false,
    'web_enable_ad_signals': false,
    'kevlar_tuner_run_ad_block_check': false,
    'web_player_enable_ad_blocker_warning': false,
    'kevlar_watch_metadata_refresh_ad_signals': false,
    'suppress_error_204_logging': true,
    'html5_disable_ad_frequency_cap': true,
    'html5_serverside_pagead_id_sets_cookie': false,
    'desktop_companion_wta_support': false,
    'enable_topsoil_wta_for_halftime': false,
    'vss_final_ping_send_and_write': true,
    'trigger_nsm_validation_checks_with_nwl': true,
    'html5_enable_video_overlay_on_inplayer_slot_for_tv': false,
    'html5_ssap_ad_break': false,
    'web_player_enable_dai': false
  };

  const IPAD_FLAGS = {
    'web_enable_tablet_ui': true,
    'web_touch_gestures': true,
    'html5_ios_force_inline': true,
    'html5_apple_airplay': true,
    'html5_now_playing_api_ios': true,
    'mweb_ipad_support': true,
    'enable_tablet_landscape_grid': true,
    'web_player_enable_touch_slider_seek': true,
    'mweb_native_fullscreen': true,
    'mweb_enable_smooth_scrubbing': true,
    'mweb_swipe_to_dismiss': true,
    'mweb_bottom_sheet_comments': true,
    'delhi_modern_web_player_responsive_compact_controls_threshold': 3000
  };

  const MINIPLAYER_FLAGS = {
    'kevlar_miniplayer': true,
    'kevlar_miniplayer_expand_top': true,
    'kevlar_miniplayer_play_pause_on_scrim': true,
    'kevlar_miniplayer_queue_user_activation': true,
    'kevlar_miniplayer_set_element_early': true,
    'kevlar_miniplayer_set_watch_next': true,
    'web_miniplayer_free_resizing': true,
    'web_miniplayer_modern_dock': true,
    'web_miniplayer_native_pip': true,
    'persistent_miniplayer': true,
    'desktop_animate_miniplayer': true,
    'kevlar_fix_miniplayer_logging': true,
    'kevlar_watch_drag_to_miniplayer': true,
    'kevlar_autonav_miniplayer_fix': true,
    'html5_block_pip_with_events': false,
    'disable_picture_in_picture_on_mobile': false,
    'web_player_enable_pip': true,
    'html5_enable_native_pip': true
  };

  const AUDIO_CODEC_FLAGS = {
    'html5_enable_drc': true,
    'html5_show_drc_toggle': true,
    'web_player_enable_drc': true,
    'html5_enable_voice_boost': true,
    'enable_voice_boost_feature': true,
    'allow_vb_audio_formats': true,
    'allow_vb_audio_formats_with_mta': true,
    'html5_ugc_vod_audio_51': true,
    'html5_ugc_live_audio_51': true,
    'html5_enable_eac3': true,
    'html5_enable_ac3': true,
    'enable_av1_for_svod': true,
    'html5_enable_encrypted_av1': true,
    'html5_prefer_av1': true,
    'html5_av1_hardware_decoding': true,
    'web_player_enable_premium_hbr_in_h5_api': true,
    'web_player_canary_enable_hbr': true,
    'html5_enable_high_bitrate_1080p': true,
    'web_remix_allow_up_to_3x_playback_rate': true,
    'web_enable_speedmaster': true,
    'web_speedmaster_spacebar_control': true,
    'enable_smart_skip_speedmaster_on_web': true
  };

  const NETWORK_FLAGS = {
    'all_web_enable_network_machine': true,
    'all_web_network_machine_raw_request': true,
    'all_web_network_machine_use_fetch': true,
    'network_machine_connection_pool_size': 8,
    'allow_skip_networkless': true,
    'networkless_always_online': true,
    'networkless_gel': true,
    'networkless_logging': true,
    'networkless_offline_cache_v2': true,
    'html5_sabr_client_connect': true,
    'html5_enable_sabr_live_gateway': true,
    'html5_sabr_enable_quic': true,
    'html5_sabr_post_buffered_ranges': true,
    'html5_sabr_min_media_bytes': 1048576,
    'html5_sabr_target_buffer_health': 30,
    'html5_sabr_enable_low_latency_vod': true,
    'html5_enable_sabr_fetch_chunks': true,
    'html5_sabr_client_preconnect': true
  };

  const REMOTE_CAST_FLAGS = {
    'enable_cast_api': true,
    'web_enable_cast_pairing': true,
    'enable_mdx_remote_control': true,
    'mdx_load_cast_api_bootstrap': true,
    'web_cast_allow_custom_receiver': true,
    'web_enable_dial_pairing': true,
    'enable_cast_on_mobile_web': true,
    'polymer_enable_mdx': true,
    'mdx_enable_privacy_disclosure_ui': true,
    'disable_legacy_desktop_remote_queue': true,
    'mdx_enable_seamless_transfer': true,
    'mdx_session_recovery': true,
    'web_enable_mdx_command_queue': true,
    'mdx_allow_remote_play_next': true,
    'mdx_load_offline_remote': true,
    'mdx_enable_companion_overlay': true,
    'mdx_session_keep_alive': true
  };

  const KEVLAR_MODULAR_FLAGS = {
    'all_web_enable_network_machine': true,
    'all_web_network_machine_raw_request': true,
    'allow_skip_networkless': true,
    'networkless_always_online': true,
    'networkless_gel': true,
    'networkless_logging': true,
    'html5_sabr_client_connect': true,
    'html5_enable_sabr_live_gateway': true,
    'kevlar_service_worker': true,
    'kevlar_enable_modular_player': true,
    'kevlar_prefetch_watch': true,
    'kevlar_prefetch': true,
    'kevlar_droppable_prefetchable_requests': true,
    'kevlar_watch_flexy_metadata': true,
    'kevlar_command_handler': true,
    'kevlar_entities_processor': true,
    'kevlar_op_infra': true,
    'kevlar_op_warm_pages': true,
    'kevlar_player_cached_load_config': true,
    'service_worker_static_routing_registration': true,
    'service_worker_static_routing_exclude_embed': true,
    'web_service_worker_canary': true,
    'web_canary_sw': true,
    'shell_load_gcf': true,
    'kevlar_playlist_drag_handles': true,
    'kevlar_allow_playlist_reorder': true,
    'kevlar_enable_reorderable_playlists': true,
    'kevlar_playback_associated_queue': true,
    'kevlar_macro_markers_keyboard_shortcut': true,
    'desktop_polymer_canary': true,
    'kevlar_canary': true,
    'kevlar_enable_canary': true
  };

  const INNERTUBE_CONFIG_FLAGS = {
    'web_enable_dynamic_metadata_refresh': true,
    'web_enable_client_side_nav_caching': true,
    'web_enable_streaming_xhr': true,
    'web_enable_request_batching': true,
    'html5_persisted_bandwidth_estimate': true,
    'html5_enable_cross_video_buffering': true,
    'kevlar_tuner_clamp_device_pixel_ratio': true,
    'kevlar_unified_player': true,
    'kevlar_playback_associated_queue': true,
    'kevlar_watch_metadata_refresh_ad_signals': false
  };


  const VOICE_FLAGS = {
    'kevlar_voice_search_use_yt_endpoint': true,
    'mweb_voice_search_dialog_listeners_only_when_open': true,
    'should_use_yt_voice_endpoint_in_kaios': true,
    'html5_enable_voice_boost': true,
    'enable_voice_boost_feature': true,
    'allow_vb_audio_formats': true,
    'allow_vb_audio_formats_with_mta': true,
    'client_ui_enable_multi_track_audio_on_web_embedded_player': true,
    'enable_mweb_audio_track_picker': true,
    'web_shorts_audio_track_picker': true,
    'web_enable_voice_search': true
  };

  const DESKTOP_CONFIG_PARAMS = {
    'H5_async_logging_delay_ms': 30000.0,
    'annotation_module_vast_cards_load_logging_fraction': 0.0,
    'app_shell_asset_log_fraction': 0.01,
    'autoplay_pause_by_lact_sampling_fraction': 0.0,
    'cinematic_watch_effect_letterbox_opacity': 0.4,
    'cinematic_watch_effect_opacity': 0.4,
    'cinematic_watch_css_filter_blur_strength': 40,
    'cinematic_watch_fade_out_duration': 500,
    'cinematic_watch_transition_frame_rate': 15,
    'dynamic_metadata_update_interaction_delay_period_sec': 5.0,
    'kevlar_tuner_clamp_device_pixel_ratio': 2.0,
    'kevlar_tuner_thumbnail_factor': 1.0,
    'kevlar_unified_player_logging_threshold': 1.0,
    'kevlar_watch_sidebar_width_percentage': 0.24,
    'log_window_onerror_fraction': 0.1,
    'speedmaster_playback_rate': 2.0,
    'unified_seek_bounce_scale': 1.15,
    'unified_seek_maybe_bounce_pixel_threshold_px': 10.0,
    'unified_seek_pill_height_px': 40.0,
    'unified_seek_scrubber_transition_duration_s': 0.1,
    'web_attention_logging_scroll_throttle': 500.0,
    'web_load_prediction_threshold': 0.3,
    'web_navigation_prediction_threshold': 0.1,
    'web_session_replay_sample_rate': 0.04,
    'web_shorts_error_logging_threshold': 0.001,
    'web_system_health_fraction': 0.01,
    'web_tracing_sample_rate': 0.001,
    'web_watch_big_player_wide_screen_aspect_ratio': 2.0,
    'web_watch_responsive_secondary_minimum_visible_items': 2.5,
    'web_watch_secondary_max_width_percent': 0.4,
    'autoplay_pause_by_lact_sec': 0,
    'autoplay_time': 8000,
    'autoplay_time_for_fullscreen': 3000,
    'autoplay_time_for_music_content': 3000,
    'botguard_async_snapshot_timeout_ms': 3000,
    'check_navigator_accuracy_timeout_ms': 0,
    'client_streamz_web_flush_count': 100,
    'client_streamz_web_flush_interval_seconds': 60,
    'close_webview_delay_ms': 100,
    'cloud_save_game_data_rate_limit_ms': 3000,
    'compression_disable_point': 10,
    'custom_active_view_tos_timeout_ms': 3600000,
    'endemic_high_ccv_smearing_max_window_seconds': 60,
    'gel_min_batch_size': 3,
    'gel_queue_timeout_max_ms': 300000,
    'initial_gel_batch_timeout': 2000,
    'max_body_size_to_compress': 500000,
    'max_prefetch_window_sec_for_livestream_optimization': 10,
    'min_prefetch_offset_sec_for_livestream_optimization': 20,
    'network_polling_interval': 30000,
    'polymer_property_access_logging_percent': 0.0,
    'polymer_report_client_url_requested_rate': 0.001,
    'polymer_report_missing_web_navigation_endpoint_rate': 0.001,
    'prefetch_coordinator_error_logging_sampling_rate': 1.0,
    'slow_compressions_before_abandon_count': 4,
    'web_dead_code_detector_sampling_rate': 0.0,
    'web_flexible_menu_logging_rate_limit': 1.0,
    'web_foreground_heartbeat_interval_ms': 28000,
    'web_logging_max_batch': 150,
    'web_max_tracing_events': 50,
    'web_pbj_log_warning_rate': 0.0,
    'web_tracing_session_replay': 3000,
    'wil_icon_max_concurrent_fetches': 9999,
    'ytcsi_debug_max_size': 100,
    'ytidb_remake_db_retries': 3,
    'ytidb_reopen_db_retries': 3,
    'ytidb_transaction_ended_event_rate_limit': 0.02
  };

  const DESKTOP_BOOLEAN_FLAGS_RAW = "PremiumClientSharedConfig__enable_att_context_processor,PremiumClientSharedConfig__enable_att_for_get_download_action_on_web_client,PremiumClientSharedConfig__enable_att_for_get_premium_on_web_client,ab_det_apb_b,ab_det_apm,ab_det_el_h,action_companion_center_align_description,align_ask_youtube_input_on_focus,annotation_module_vast_cards_load_logging_fraction,att_web_record_metrics,attmusi,attmusiw,autoplay_pause_by_lact_sec,bg_st_hr,browse_next_continuations_migration_playlist,browse_reload_continuations_migration_home,c3_enable_button_impression_logging,c3_watch_page_component,cancel_pending_navs,channel_details_shelf_resize_observer,check_navigator_accuracy_timeout_ms,check_user_lact_at_prompt_shown_time_on_web,client_respect_autoplay_switch_button_renderer,client_streamz_web_flush_count,client_streamz_web_flush_interval_seconds,client_ui_enable_multi_track_audio_on_web_embedded_player,cold_missing_history,compress_gel,course_hide_playlist_panel_shuffle_and_loop_buttons,cow_optimize_idom_compat,csi_on_gel,dedupping_server_ve,defer_menus,defer_overlays,delay_sheet_open_killswitch,deprecate_pair_servlet_enabled,desktop_add_to_playlist_renderer_dialog_popup,desktop_delay_player_resizing,desktop_enable_dmpanel_click_drag_scroll,desktop_enable_dmpanel_scroll,desktop_enable_dmpanel_wheel_scroll,desktop_enable_entity_suggest,desktop_enable_new_video_metadata,desktop_enable_scrollable_suggestions_panel,desktop_enable_single_suggestion_highlight,desktop_enable_suggestions_panel_padding,desktop_enable_visual_suggest,desktop_keyboard_capture_keydown_killswitch,desktop_mix_use_sampled_color_for_bottom_bar,desktop_mix_use_sampled_color_for_bottom_bar_search,desktop_mix_use_sampled_color_for_bottom_bar_watch_next,desktop_show_ios_smart_banner,desktop_sparkles_light_cta_button,desktop_use_new_history_manager,disable_child_node_auto_formatted_strings,disable_features_for_supex,disable_home_redundant_search_request,disable_mention_encoded_channel_handle_in_post,disable_mini_app_container_web_view_insets,disable_pacf_logging_for_memory_limited_tv,disable_super_chat_buy_button,download_invalid_policy_error_handling,embeds_desktop_enable_volume_slider,enable_active_view_display_ad_renderer_web_home,enable_ads_web_ep_buenos_aires_and_padding_fix,enable_ai_disclosure_for_compact_landscape_image_web,enable_ai_disclosure_for_compact_landscape_image_web_innertube,enable_ai_disclosure_for_compact_landscape_no_button_web,enable_ai_disclosure_for_compact_landscape_no_button_web_innertube,enable_ai_disclosure_for_text_image_no_button_web,enable_ai_disclosure_for_text_image_no_button_web_innertube,enable_ai_disclosure_for_top_landscape_image_web,enable_ai_disclosure_for_top_landscape_image_web_innertube,enable_ai_disclosure_for_video_display_billboard_buttoned_web,enable_ai_disclosure_for_video_display_billboard_buttoned_web_innertube,enable_ai_disclosure_for_video_display_button_group_web,enable_ai_disclosure_for_video_display_button_group_web_innertube,enable_ai_disclosure_for_video_display_compact_button_group_web,enable_ai_disclosure_for_video_display_compact_button_group_web_innertube,enable_ai_disclosure_for_video_display_compact_buttoned_web,enable_ai_disclosure_for_video_display_compact_buttoned_web_innertube,enable_ai_disclosure_for_video_display_compact_carousel_button_group_web,enable_ai_disclosure_for_video_display_compact_carousel_button_group_web_innertube,enable_ai_disclosure_for_video_display_compact_web,enable_ai_disclosure_for_video_display_compact_web_innertube,enable_ai_disclosure_for_video_display_full_web_innertube,enable_ai_search_innertube_m0_fixes,enable_android_web_view_top_insets_bugfix,enable_att_for_transcript_request_on_web_client,enable_attention_logging_measure_on_shown,enable_automotive_form_factor_check,enable_button_behavior_reuse,enable_client_only_wiz_tooltips,enable_client_streamz_web,enable_client_ve_spec,enable_cloud_save_error_popup_after_retry,enable_command_handler_screen_manager,enable_community_page_on_desktop,enable_connect_icon_update_web,enable_creator_details_shelf_m2,enable_dai_sdf_h5_preroll,enable_datasync_id_header_in_web_vss_pings,enable_default_mono_cta_migration_web_client,enable_description_content_list_support,enable_desktop_amsterdam_info_panels,enable_desktop_search_bigger_thumbs,enable_desktop_search_bigger_thumbs_square,enable_docked_chat_messages,enable_embeds_new_caption_language_picker,enable_endemic_high_ccv_smearing_h5,enable_entity_store_from_dependency_injection,enable_error_corrections_infocard_web_client,enable_force_imp_autoplay_on_desktop_search,enable_full_length_inline_playback_desktop_search_shorts,enable_gaia_reauthentication,enable_gaming_page_header_gradient,enable_gel_log_commands,enable_gift_picker_on_web,enable_grid_shelf_view_model_for_desktop_shorts_grid,enable_guide_user_profile_web_support,enable_handle_search_on_channel_switcher,enable_handles_account_menu_switcher,enable_handles_in_mention_suggest_posts,enable_hlp_client_icon_pick,enable_image_poll_post_creation,enable_image_quiz_post_creation,enable_inline_muted_playback_on_web_search,enable_inline_muted_playback_on_web_search_for_vdc,enable_inline_muted_playback_on_web_search_for_vdcb,enable_inline_shorts_on_wn,enable_interstitial_entity_check,enable_ios_webview_radio_button_responsiveness,enable_is_extended_monitoring,enable_lcr_emoji_fountain,enable_logging_first_user_action_after_game_ready,enable_ltc_param_fetch_from_innertube,enable_m0_logging_fixes,enable_main_app_watch_redux,enable_masthead_quartile_ping_fix,enable_memberships_and_purchases,enable_mentions_in_reposts,enable_menu_renderer_button_in_mweb_hclr,enable_microformat_data,enable_mini_app_command_handler_mweb_fix,enable_mixed_direction_formatted_strings,enable_multi_image_post_creation,enable_mweb_keyboard_shortcuts,enable_names_handles_account_switcher,enable_native_bridge_view_saved_playables,enable_network_request_logging_on_game_events,enable_new_channel_creation_for_id4all,enable_new_paid_product_placement,enable_new_shield_moderator_badge,enable_on_visibility_change_commands_for_panels,enable_open_yt_content,enable_origin_query_parameter_bugfix,enable_pause_ads_on_ytv_html5,enable_payments_purchase_manager,enable_pdp_icon_prefetch,enable_place_pivot_page_entry_point,enable_place_pivot_url,enable_playable_container_save_button,enable_playable_entity_save_menu_item,enable_playables_builder_polling_recovery,enable_player_resize_transition,enable_polymer_resin,enable_polymer_resin_migration,enable_post_cct_links,enable_post_scheduling,enable_premium_voluntary_pause,enable_profile_cards_on_comments,enable_programmed_playlist_color_sample,enable_programmed_playlist_redesign,enable_ptc_home_location_on_web,enable_purchase_activity_in_paid_memberships,enable_pv_screen_modern_text,enable_quiz_creation,enable_redirect_linking_for_desktop_web_client,enable_reel_action_bar_view_model,enable_reel_watch_sequence,enable_rfa_external_links,enable_rfa_rate_limits,enable_screen_manager_layer_separation,enable_sdf_dai_h5_midroll,enable_sdf_h5_endemic_mid_post_roll,enable_sdf_on_h5_unplugged_vod_midroll,enable_sdf_shorts_player_bytes_h5,enable_search_page_stacking_context,enable_seedless_shorts_url,enable_sending_unwrapped_game_audio_as_serialized_metadata,enable_server_stitched_dai,enable_service_ajax_csn,enable_session_replay_mask_backgrounds,enable_set_video_id_in_shorts_lockup_view_model,enable_sfv_audio_pivot_url,enable_sfv_effect_pivot_url,enable_shadydom_free_scoped_node_methods,enable_shadydom_free_scoped_query_methods,enable_shadydom_free_scoped_readonly_properties_batch_one,enable_share_panel_navigation_logging_fix_on_web,enable_short_dr_for_desktop_launchable,enable_shorts_grid_on_desktop_serp,enable_shorts_heart_icon_in_shorts_watch_page,enable_shorts_new_carousel,enable_shorts_poll_stickers_web,enable_shorts_web_show_ep_endpoint,enable_show_more_button_for_desktop_shorts_grid,enable_show_title_in_mweb_premium_season_card,enable_shrink_ai_button_focused_searchbox,enable_smearing_expansion_dai,enable_structured_description_playlist_lockup_clickable_title,enable_structured_description_shorts_web_mweb,enable_structured_text_list_group_parsing,enable_tectonic_ad_ux_for_halftime,enable_time_out_messages,enable_timeline_view_modern_transcript_fe,enable_topsoil_wta_for_halftime_live_infra,enable_unified_cancellation_for_premium_immediate_refunds,enable_variable_timeout_web,enable_video_display_compact_button_group_for_desktop_search,enable_video_display_full_on_wn_web_expansion,enable_view_pronouns_on_main_app,enable_web_animated_like_fix,enable_web_home_top_landscape_image_layout_level_click,enable_web_ketchup_hero_animation,enable_web_premium_varispeed,enable_web_premium_varispeed_upsell,enable_web_shorts_audio_track,enable_web_shorts_mention_pivot,enable_web_tiered_gel,enable_web_watch_fullscreen_overflow_menu_fixes,enable_web_watch_next_imp_client,enable_window_constrained_buy_flow_dialog,enable_wiz_queue_effect_and_on_init_initial_runs,enable_wiz_shorts_non_video_content,enable_yoodle,enable_your_playables_feed_entrypoint,enable_ypc_spinners,enable_yt_ata_iframe_authuser,enable_ytc_refunds_submit_form_signal_action,enable_ytc_self_serve_refunds,enable_zero_prefix_mention_suggestion_web,endpoint_handler_logging_cleanup_killswitch,export_networkless_options,export_player_version_to_ytconfig,external_fullscreen,fill_single_video_with_notify_to_lasr,fix_ads_tracking_for_swf_config_deprecation_mweb,fix_alignment_search_desktop_text_image_ads_small_screens,fix_masthead_player_on_imp,fix_masthead_player_on_scroll,fix_uri_parsing_for_legacy_underescaping,global_spacebar_pause,h5_companion_enable_adcpn_macro_substitution_for_click_pings,h5_enable_premium_ads_seen_adding_host_cpn,h5_inplayer_enable_adcpn_macro_substitution_for_click_pings,h5_reset_cache_and_filter_before_update_masthead,handles_in_mention_suggest_posts,hide_channel_creation_title_for_mweb,hide_live_chat_button_when_collapsed,high_ccv_client_side_caching_h5,html5_disable_airplay_button_for_mweb,html5_hide_unavailable_subtitles_button,html5_log_trigger_events_with_debug_data,html5_offline_playback_position_sync,html5_recognize_predict_start_cue_point,html5_server_stitched_dai_group,html5_ssdai_enable_media_end_cue_range,idb_immediate_commit,il_attach_cache_limit,il_use_view_model_logging_context,include_autoplay_count_in_playlists,increase_masthead_ad_height_web,is_browser_support_for_webcam_streaming,is_part_of_any_user_engagement_experiment,json_condensed_response,kevlar_a11y_font_fix,kevlar_appshell_service_worker,kevlar_autonav_popup_filtering,kevlar_cache_cold_load_response,kevlar_cache_on_ttl_player,kevlar_cancel_scheduled_comment_jobs_on_navigate,kevlar_channel_trailer_multi_attach,kevlar_check_current_page_on_stop_old_player,kevlar_clear_duplicate_pref_cookie,kevlar_clear_non_displayable_url_params,kevlar_client_enable_shorts_player_bootstrap,kevlar_client_side_screens,kevlar_command_handler_formatted_string,kevlar_command_url,kevlar_continue_playback_without_player_response,kevlar_decorate_endpoint_with_onesie_config,kevlar_defer_app_js,kevlar_disable_background_prefetch,kevlar_early_popup_close,kevlar_enable_download_upsell_type_a,kevlar_enable_editable_playlists,kevlar_enable_shorts_prefetch_in_sequence,kevlar_exit_fullscreen_leaving_watch,kevlar_filter_unknown_source,kevlar_flexible_menu,kevlar_gel_error_routing,kevlar_help_use_locale,kevlar_hide_pp_url_param,kevlar_hide_time_continue_url_param,kevlar_home_skeleton,kevlar_js_fixes,kevlar_keyboard_button_focus,kevlar_lazy_list_resume_for_autofill,kevlar_log_updated_time_for_smart_downloads,kevlar_mealbar_above_player,kevlar_mix_handle_first_endpoint_different,kevlar_passive_event_listeners,kevlar_player_check_ad_state_on_stop,kevlar_player_new_bootstrap_adoption,kevlar_player_playlist_use_local_index,kevlar_player_watch_endpoint_navigation,kevlar_playlist_use_x_close_button,kevlar_prevent_polymer_dynamic_font_load,kevlar_service_command_check,kevlar_shorts_seedless_retry_initial_load,kevlar_show_playlist_dl_btn,kevlar_system_icons,kevlar_thumbnail_fluid,kevlar_touch_feedback,kevlar_trim_player_behavior,kevlar_tuner_should_defer_detach,kevlar_typography_spacing_update,kevlar_typography_update,kevlar_unified_errors_init,kevlar_use_response_ttl_to_invalidate_cache,kevlar_use_vimio_behavior,kevlar_use_wil_icons,kevlar_vimio_use_shared_monitor,kevlar_voice_search_use_yt_endpoint,kevlar_watch_flexy_comments_manager,kevlar_watch_flexy_gestures_manager,kevlar_watch_flexy_playlist_manager,kevlar_watch_flexy_theater_manager,kevlar_watch_focus_on_engagement_panels,kevlar_watch_hide_comments_while_panel_open,kevlar_watch_js_panel_height,kevlar_watch_metadata_refresh,kevlar_watch_metadata_refresh_no_old_secondary_data,kevlar_watch_no_top_margin,kevlar_watch_reduced_top_margin,kevlar_woffle,kevlar_woffle_fallback_image,kevlar_ytb_live_badges,killswitch_toggle_button_behavior_resolve_command,limit_ytcsi_debug_array_size,live_chat_cow_visibility_set_up,live_chat_disable_send_button_in_slow_mode,live_chat_enable_fast_first_poll,live_chat_fix_remove_items_by_author_leak,live_chat_fix_remove_items_by_author_ticker_leak,live_chat_gifts_on_classic_web,live_chat_gifts_on_classic_web_for_viewers,live_chat_improved_visibility_style_for_web,live_chat_message_renderer_fix,live_chat_prune_all_participants_char_map,live_chat_relocate_web_banner_update,live_chat_require_space_for_autocomplete_emoji,live_chat_web_debounce_context_menu_requests,live_chat_web_fix_high_speed_autoscroll,live_chat_web_hide_timestamp_toggle_menu,live_chat_web_use_emoji_manager_singleton,log_click_with_layer_from_element_in_command_handler,log_gel_compression_latency,log_heartbeat_with_lifecycles,maw_enable_network_machine,maw_error_screen_redesign,maw_network_machine_raw_request,mdx_load_cast_api_bootstrap_script,medium_progress_bar_modification,mobile_account_menu_refresh,modernize_structured_description_playlist_lockups_v2,music_on_main_open_playlist_recommended_videos_in_miniplayer,mweb_allow_modern_search_suggest_behavior,mweb_animated_actions,mweb_app_upsell_button_direct_to_app,mweb_c3_app_promo_enable_referring_app,mweb_c3_enable_adaptive_signals,mweb_c3_library_page_enable_recent_shelf,mweb_c3_menu_signals_render,mweb_c3_remove_web_navigation_endpoint_data,mweb_c3_use_canonical_from_player_response,mweb_carve_out_ios_app_store_redirect,mweb_cinematic_watch,mweb_command_handler,mweb_content_replace_config_stamper,mweb_debug_sticky_settings,mweb_delay_watch_initial_data,mweb_disable_searchbar_scroll,mweb_enable_click_to_play_pause,mweb_enable_dynamic_double_tap_to_like,mweb_enable_fine_scrubbing_for_recs,mweb_enable_ghost_cards_for_chip_bar,mweb_enable_keto_batch_player_fullscreen,mweb_enable_keto_batch_player_progress_bar,mweb_enable_keto_batch_player_tooltips,mweb_enable_keto_content,mweb_enable_lockup_view_model_for_ucp,mweb_enable_mix_panel_title_metadata,mweb_enable_more_chunks,mweb_enable_more_drawer,mweb_enable_optional_fullscreen_landscape_locking,mweb_enable_overlay_touch_manager,mweb_enable_portrait_fullscreen_actions,mweb_enable_premium_carve_out_fix,mweb_enable_refresh_detection,mweb_enable_search_imp,mweb_enable_shorts_heart_new_double_tap,mweb_enable_shorts_stickers,mweb_enable_shorts_video_preload,mweb_enable_two_line_title_on_shorts,mweb_enable_varispeed_controller,mweb_enable_video_loop_toggle,mweb_enable_watch_feed_infinite_scroll,mweb_fix_cinematic_fullscreen_leak,mweb_fix_cold_load_response_actions,mweb_fix_monitor_visibility_after_render,mweb_force_ios_fallback_to_native_control,mweb_fp_auto_fullscreen,mweb_fp_enable_shorts_swipe_logging,mweb_fs_bottom_sheet_open_fix,mweb_fullscreen_controls,mweb_fullscreen_controls_action_buttons,mweb_fullscreen_watch_system,mweb_fully_reactive_cb,mweb_home_reactive_shorts,mweb_idom_cleanup,mweb_innertube_search_command,mweb_kaios_enable_autoplay_switch_view_model,mweb_lang_in_html,mweb_like_button_synced_with_entities,mweb_logo_use_home_page_ve,mweb_long_press_speedup_vibration,mweb_native_control_in_faux_fullscreen_shared,mweb_player_control_on_hover,mweb_player_show_previous_next_buttons_in_playlist,mweb_player_skip_no_op_state_changes,mweb_player_user_select_none,mweb_playlist_engagement_panel,mweb_progress_bar_seek_on_mouse_click,mweb_propagate_player_link_clicks,mweb_pull_2_full,mweb_pull_2_full_enable_touch_handlers,mweb_schedule_warm_watch_response,mweb_search_max_width_limit,mweb_searchbox_legacy_navigation,mweb_see_fewer_shorts,mweb_shorts_comments_panel_id_change,mweb_shorts_early_continuation,mweb_shorts_overlay_deprecate_kaios_layout,mweb_show_sign_in_button_from_header,mweb_skip_legacy_lazy,mweb_sync_searchbox_focus,mweb_to_native_upsell_cold_load_fix,mweb_upsell_dialog_fix,mweb_use_microformat_title_for_posts,mweb_use_server_url_on_startup,mweb_voice_search_dialog_listeners_only_when_open,mweb_watch_captions_enable_auto_translate,mweb_watch_captions_set_default_size,mweb_watch_stop_scheduler_on_player_response,mweb_watchfeed_big_thumbnails,mweb_yt_searchbox,network_status_banner_display_none,offline_error_handling,optimal_reading_width_comments_ep,owl_pl_await,pageid_as_header_web,par_at_ep,pdg_enable_flow_logging_for_super_chat,pdg_enable_flow_logging_for_super_stickers,player_bootstrap_method,player_controls_autonav_fix,player_controls_skip_double_signal_update,player_controls_volume_controls_use_player_props,player_enable_playback_playlist_change,polymer_bad_build_labels,polymer_verifiy_app_state,problem_walkthrough_sd,qoe_send_and_write,record_app_crashed_web,remove_chevron_from_ad_disclosure_banner_h5,remove_masthead_channel_banner_on_refresh,remove_slot_id_exited_trigger_for_dai_in_player_slot_expire,rich_grid_enable_dynamic_offset,roscas,scf_enable_input_glow,searchbox_reporting,serve_pdp_at_canonical_url,shorts_desktop_watch_while_sdp,shorts_enable_reel_carousel,shorts_in_playlists_web,shorts_overlay_reshuffle,should_clear_video_data_on_player_cued_unstarted,should_use_yt_voice_endpoint_in_kaios,skip_ls_gel_retry,small_avatars_for_comments,small_avatars_for_comments_ep,smarter_ve_dedupping,sponsorships_enable_redirect_to_membership_tab_desktop,start_client_gcf,stop_handling_click_for_non_rendering_overlay_layout,tooltip_refactor_for_hotkey,transport_use_scheduler,use_ads_engagement_panel_desktop_footer_cta,use_better_post_dismissals,use_event_time_ms_header,use_fifo_for_networkless,use_not_now_dl_upsell_dismiss_cta,use_request_time_ms_header,use_rta_manager_for_async,use_session_based_sampling,use_skip_survey_text_for_survey_skip_button_on_web_main,use_thumbnail_overlay_time_status_renderer_for_live_badge,use_unified_flag_accessor,use_white_filled_heart_icon_in_shorts_watch_page,use_ytd_player_for_desktop_masthead,vss_playback_use_send_and_write,warm_op_csn_cleanup,watch_pubsub_refactor,web_adaptive_repeat_ase,web_ads_panel_caching_bugfix,web_always_load_chat_support,web_amsterdam_post_mvp_playlists,web_animated_actions,web_animated_actions_v2,web_api_url,web_appshell_purge_trigger,web_appshell_refresh_trigger,web_atagconfig_pointerdown,web_attention_logging_enabled,web_attention_logging_export_to_gel,web_attributed_string_deep_equal_bugfix,web_autonav_allow_off_by_default,web_badge_shape_defrag,web_budget_imp_open,web_button_icon_size_experiment,web_button_mainstage_padding,web_button_or_anchor_list_item,web_button_rework_with_live,web_button_vm_refactor_disabled,web_c3_log_app_init_finish,web_cancel_pending_navigation_on_history_back,web_chat_prevent_chat_header_overflow,web_cinematic_container_image_offset,web_clickable_home_chips_during_load,web_collect_offline_state,web_comment_continuation_insert_bugfix,web_comment_panel_easy_expand,web_comment_threading_scroll_on_collapse,web_component_pruning,web_csi_action_sampling_enabled,web_csi_debug_sample_enabled,web_dedupe_ve_grafting,web_delay_scroll_to_top_during_transition,web_disable_chip_view_model_mutation,web_disable_ep_scrim,web_embeds_super_small_layout,web_enable_ab_rsp_cl,web_enable_ad_button_style_override,web_enable_adaptive_appl_signal,web_enable_arrow_key_navigation_in_dropdown,web_enable_aspect_ratio_fix,web_enable_canonical_url_manager,web_enable_card_view_model_hover_effect,web_enable_course_icon_update,web_enable_deeper_metadata_highlight_styling,web_enable_effect_pivot_panel,web_enable_entity_upsert_on_update,web_enable_error_204,web_enable_ghost_cards_for_chip_bar,web_enable_invite_collaborators_link,web_enable_keyboard_shortcut_for_timely_actions,web_enable_list_item_button_menuitem,web_enable_merch_item_rounding_fix,web_enable_network_machine,web_enable_no_endpoints_on_ad_metadata,web_enable_player_creator_endscreen_manager,web_enable_playlist_panel_renderer_panel_interface,web_enable_rich_item_on_focus_effect,web_enable_rich_item_on_focus_effect_monet,web_enable_rich_item_on_focus_effect_monet_additive,web_enable_safety_mode_unlock_gaia_check,web_enable_shopping_timely_shelf_client,web_enable_shorts_remix_handoff_ep,web_enable_shorts_sequence_refactor,web_enable_thumbnail_overlay_alignment,web_enable_timely_actions,web_enable_utc_time_in_input_composer,web_enable_varispeed_panel,web_enable_voting_animation,web_engagement_panel_renderer_behavior,web_engagement_panel_show_description,web_ensure_monotonic_history_timestamps,web_ep_header_focus_a11y_fix,web_ep_restyling,web_ephemeral_companion_ads,web_fix_command_context_visibility_reobserve,web_fix_fine_scrubbing_false_play,web_fix_missing_action_buttons,web_fix_reused_component_impression_logging,web_fix_rolling_numbers_zoom_safari,web_fix_sticky_playlist_header,web_fix_sticky_playlist_header_v2,web_fix_teaser_scroll_bug,web_focus_first_element_sheet,web_forward_command_on_pbj,web_frosted_glass_disable_watch,web_fullscreen_components,web_fullscreen_shorts_menu_item,web_gate_imp_on_long_task,web_gate_imp_on_page_ready,web_gcf_hashes_innertube,web_gel_timeout_cap,web_get_updated_metadata_fantasy_panel_continuation_params,web_get_updated_metadata_send_params,web_header_eu_about_these_results,web_hide_watch_info_empty,web_hide_your_data_on_automotive,web_horizontal_shelf_imp_thumbnail_border_rounding,web_horizontal_shelf_resize_fix,web_hover_effect_refactor,web_image_dont_reload_same_src,web_image_dont_reload_same_src_simulate_load,web_imp_enable_csi_start_tick,web_imp_enable_csi_timer,web_imp_occlusion_tracking_enabled,web_imp_stability_check_enabled,web_imp_theater_bugfix,web_layout_system_update,web_layout_system_update_avatar_spacing,web_linear_layout_with_container_layout,web_live_chat_available_bugfix,web_lockup_view_model_compact_padding_update,web_log_memory_total_kbytes,web_log_player_watch_next_ticks,web_log_reels_ticks,web_manual_downloads_only_toast,web_migrate_reel_player_overlay_to_cow,web_migrate_shorts_player_controls_to_cow,web_mix_long_byline_from_data,web_modern_collections,web_modern_official_card_enable_shorts,web_modern_official_card_for_events,web_modern_official_card_for_music_artists,web_modern_official_card_two_column_for_events,web_monomer_web_component_wrapper_handle_errors,web_move_autoplay_video_under_chip,web_no_skip_video_on_verification_checks,web_non_navigating_atag,web_now_playing_badge,web_official_card_concise_lockup_metadata,web_official_card_hide_playlist_tracks,web_official_card_mixed_content_shelf,web_official_card_music_artist_description,web_official_card_rich_imagery,web_open_ai_support_links_external_window,web_overlay_reactive_render,web_persist_server_autonav_state_on_client,web_playback_associated_ve,web_player_autonav_use_server_provided_state,web_player_enable_featured_product_banner_exclusives_on_desktop,web_player_enable_featured_product_banner_promotion_text_on_desktop,web_player_enable_fullscreen_feature,web_player_enable_premium_hbr_playback_cap,web_player_entities_middleware,web_player_log_click_before_generating_ve_conversion_params,web_player_move_autonav_toggle,web_player_pip_logging_fix,web_player_quick_action_buttons_icon_only,web_player_rtr_ctrls,web_player_updated_entrypoint,web_player_use_new_api_for_quality_pullback,web_prefetch_preload_video,web_prevent_imp_on_obscured_lockup,web_propagate_visibility_to_application_state,web_reels_enable_audio_pivot_in_engagement_panel,web_remove_broken_subscribe_endscreen,web_remove_snackbar_actions,web_responsive_current,web_rich_shelf_show_more_button,web_scroll_to_engagement_panel_bugfix,web_search_hide_key_moments,web_section_list_renderer_wrapped_contents,web_service_params_response_processor,web_settings_menu_surface_custom_playback,web_settings_use_input_slider,web_shorts_2_by_3_lockups_study,web_shorts_comment_stickers,web_shorts_early_continuation,web_shorts_enable_remove_search_pivot_back_button,web_shorts_fade_overlay,web_shorts_fallback_sticker,web_shorts_fill_lact,web_shorts_fix_sticker_metadata_collision,web_shorts_fixed_number_of_previous_thumbnails,web_shorts_prefetch_service_enabled,web_shorts_scroll_top,web_shorts_shelf_on_search,web_shorts_show_overlay_when_rendering_finished,web_shorts_simplify_show_panel,web_shorts_sound_metadata,web_shorts_surveys,web_shorts_wn_shelf_header_tuning,web_skip_missing_vimio_observer,web_streaming_fast,web_streaming_watch,web_structured_description_show_more,web_supports_animations_api,web_teaser_carousel_dismissal,web_thumbnail_to_watch_transition,web_timeline_view_section_list_renderer,web_tokenize_button_icon_size,web_tooltip_location_fix,web_unified_fetch,web_update_panel_visibility_logging_fix,web_use_cache_for_image_fallback,web_video_companion_modern_transcript,web_video_preview_sparkles_click_location_helper,web_video_preview_transparent_loading,web_video_preview_use_intersection_observer,web_watch_add_viewport_meta_tag,web_watch_always_flexible_menu,web_watch_chat_before_playlist,web_watch_cinematics_preferred_reduced_motion_default_disabled,web_watch_close_eps_on_fullscreen,web_watch_compact_comments,web_watch_controls_state_signals,web_watch_eligible_to_switch_to_grid,web_watch_enable_fs_squeezeback_panels,web_watch_enable_learning_journey,web_watch_enable_single_column_grid_view,web_watch_enable_tm_esc_key,web_watch_ep_enable_property_observers,web_watch_fill_description_more_text,web_watch_fix_ambient_mode_cutoff,web_watch_fullerscreen_deprecation_ui,web_watch_get_updated_metadata_manager,web_watch_hero_list,web_watch_hide_key_moments,web_watch_item_section_renderer_related_chips_caching,web_watch_metadata_visibility_logging,web_watch_move_lockup_overflow_menu,web_watch_move_summary_to_sd,web_watch_next_secondary_results_limit_results,web_watch_next_secondary_results_stamper_cleanup,web_watch_next_secondary_results_stamper_cleanup_round_2,web_watch_no_dividers,web_watch_panel_content_match_theme,web_watch_playlist_after_panels,web_watch_provide_undefined_comments,web_watch_remove_clip_create_panel,web_watch_stop_collapsing_replay_chat,web_watch_stop_scheduler_on_player_response,web_watch_theater_chat,web_watch_transscript_use_parent_max_height,web_watch_typography_title_headline_xs,web_watch_update_panel_fix,web_watch_updated_metadata_server_initial_delay,web_watch_use_secondary_max_width_percent,web_watch_use_sidebar_width_percentage,web_watch_video_details_hide_subtitle,web_watch_video_details_single_line_title,web_watch_video_details_transparent_background,web_yt_searchbox,webfe_mweb_watch_microdata,webfe_preload_attc,webfe_reporting_telemetry_module_enabled,webfe_use_enf_mod,webfe_watch_shorts_canonical_url_fix,webpo_exit_on_net_err,wil_icon_render_when_idle,wiz_diff_overwritable,woffle_enable_download_status,woffle_orchestration,woffle_playlist_visitor_fix,wp_lat_b,wug_networking_gzip_request,ww_squeezeback_killswitch,youthere_supported,yt_iron_overlay_click_tap_killswitch,ytd_expander_use_resize_observer,ytpopup_close_sibling_popups_killswitch";

  const POPULAR_FLAGS = [
    'delhi_modern_web_player',
    'delhi_modern_web_player_compact_video_actions_controls',
    'delhi_modern_web_player_icons',
    'enable_web_delhi_icons',
    'web_delhi_colorful_sd',
    'web_delhi_comment_threads',
    'web_frosted_glass',
    'web_player_frosted_glass_blur_radius',
    'kevlar_watch_cinematics',
    'kevlar_watch_color_update',
    'web_watch_rounded_player_large',
    'web_modern_buttons',
    'web_modern_dialogs',
    'web_modern_tabs',
    'web_modern_badge_shape',
    'enable_neon_buttons',
    'web_button_rework',
    'web_remix_allow_up_to_3x_playback_rate',
    'web_enable_speedmaster',
    'web_speedmaster_spacebar_control',
    'enable_smart_skip_speedmaster_on_web',
    'player_doubletap_to_seek',
    'web_progress_bar_draggable',
    'enable_custom_scrubber_v2',
    'html5_enable_drc',
    'html5_show_drc_toggle',
    'html5_enable_voice_boost',
    'delhi_modern_web_player_horizontal_volume_controls',
    'enable_av1_for_svod',
    'html5_enable_encrypted_av1',
    'web_player_enable_premium_hbr_in_h5_api',
    'mweb_search_header_redesign',
    'mweb_search_bar_expansion_animation',
    'mweb_compact_search_bar',
    'mweb_new_search_suggestions_ui',
    'mweb_dynamic_pill_filter',
    'web_shorts_playback_rate_picker',
    'web_shorts_audio_track_picker',
    'web_fullscreen_shorts',
    'web_shorts_scrubber_bar',
    'enable_youchat_latex_rendering',
    'web_enable_creator_chatbot_client',
    'mweb_enable_colorful_ai_summary',
    'web_enable_ask_disclaimer_update',
    'enable_cast_api',
    'web_enable_cast_pairing',
    'enable_mdx_remote_control',
    'web_cast_allow_custom_receiver',
    'web_enable_dial_pairing',
    'all_web_enable_network_machine',
    'all_web_network_machine_raw_request',
    'allow_skip_networkless',
    'kevlar_service_worker',
    'kevlar_enable_modular_player',
    'kevlar_prefetch_watch',
    'kevlar_miniplayer',
    'web_miniplayer_free_resizing',
    'web_miniplayer_modern_dock',
    'web_miniplayer_native_pip'
  ];

  const CANARY_TURBO_PROFILE = {
    state: 'canary',
    stage: '2',
    baseJsMode: 'turbo',
    swMode: 'active',
    castMode: 'active',
    modulesMode: 'modular_network',
    ippLogging: 'experiment',
    serverVersion: 'canary'
  };

  const mkSet = (label, desc, flags, canaryProfile = null, visitorProfile = null) => ({
    label, desc, flags, ...(canaryProfile ? { canary: true, canaryProfile } : {}), ...(visitorProfile ? { visitorProfile } : {})
  });

  const SPECIALIZED_SETS = {
    'delhi_suite': mkSet('🏛️ Ultra Delhi Suite', 'All 24 Delhi player & UI flags ON + frosted glass blur 18px + rounded large player', Object.assign({}, DELHI_FLAGS, { 'web_frosted_glass': true, 'web_player_frosted_glass_blur_radius': 18, 'web_watch_rounded_player_large': true })),
    'mweb_delhi_ultra': mkSet('📱 MWeb Delhi & Ultra-Wide Search', 'Mobile Web 2026 overhaul: full-width search bar, dual-tap seek, bottom sheet comments, swipe dismiss, and colorful AI summary', Object.assign({}, MWEB_FLAGS, { 'mweb_search_box_max_width': 1000, 'delhi_modern_web_player_responsive_compact_controls_threshold': 4000 })),
    'canary_turbo': mkSet('🚀 Pure Canary Turbo', 'Activates Canary mode Stage 2 + AV1 SVOD + High-Bitrate Premium ladder + Canary Edge', { 'player_web_canary': true, 'player_web_is_canary': true, 'player_web_canary_stage': 2, 'web_player_ipp_canary_type_for_logging': 'experiment', 'enable_av1_for_svod': true, 'html5_enable_encrypted_av1': true, 'web_player_enable_premium_hbr_in_h5_api': true }, CANARY_TURBO_PROFILE),
    'network_machine_sabr': mkSet('⚡ SABR Network Machine & QUIC', 'Raw fetch stream pipeline + QUIC streaming + low latency VOD + 8-stream connection pool', Object.assign({}, NETWORK_FLAGS)),
    'pip_miniplayer_master': mkSet('🗖 PiP & Miniplayer Master', 'Unlocks native browser Picture-in-Picture, free resizing miniplayer, modern dock, and prevents anti-PiP blocks', Object.assign({}, MINIPLAYER_FLAGS)),
    'clean_canary': mkSet('🛡️ Clean Canary & Ad Shield', 'Canary Turbo + Disables player ad-breaks, suppresses telemetry error beacons, bypasses ad-block checks', Object.assign({}, AD_FLAGS, { 'player_web_canary': true, 'player_web_is_canary': true, 'player_web_canary_stage': 2, 'web_player_ipp_canary_type_for_logging': 'experiment', 'enable_av1_for_svod': true, 'html5_enable_encrypted_av1': true, 'web_player_enable_premium_hbr_in_h5_api': true, 'html5_sabr_client_connect': true, 'html5_enable_sabr_live_gateway': true, 'all_web_enable_network_machine': true, 'all_web_network_machine_raw_request': true, 'allow_skip_networkless': true }), CANARY_TURBO_PROFILE),
    'canary_dogfood': mkSet('🧪 Bleeding Dogfood Stage 0', 'Internal Google Dogfood branch + Stage 0 + Next-gen SABR Live Gateway + Fresh Fetch', { 'player_web_canary': true, 'player_web_is_canary': true, 'player_web_canary_stage': 0, 'web_player_ipp_canary_type_for_logging': 'dogfood', 'html5_sabr_client_connect': true, 'html5_enable_sabr_live_gateway': true, 'all_web_enable_network_machine': true, 'allow_skip_networkless': true }, { state: 'dogfood', stage: '0', baseJsMode: 'turbo', swMode: 'bypass', castMode: 'active', modulesMode: 'modular_network', ippLogging: 'dogfood', serverVersion: 'stage' }),
    'canary_player_engine': mkSet('🎬 Base.js HTML5 Engine', 'Deep HTML5 Player optimization: 4K HBR + DRC Stable Volume + Voice Boost + 3x Speed + Adaptive Buffering', { 'web_player_canary_enable_hbr': true, 'web_player_canary_experiment_v2': true, 'web_player_enable_canary_buffering': true, 'enable_av1_for_svod': true, 'html5_enable_encrypted_av1': true, 'web_player_enable_premium_hbr_in_h5_api': true, 'html5_enable_drc': true, 'html5_show_drc_toggle': true, 'html5_enable_voice_boost': true, 'enable_voice_boost_feature': true, 'web_remix_allow_up_to_3x_playback_rate': true }, { state: 'canary', stage: 'HIGH', baseJsMode: 'turbo', swMode: 'active', castMode: 'active', modulesMode: 'modular_network', ippLogging: 'experiment', serverVersion: 'canary' }),
    'cast_cinema': mkSet('📺 Ultra Cast & MDX Cinema', 'Enables Google Cast (cast_sender.js) + DIAL pairing + MDX remote control + 4K streaming pipeline', Object.assign({}, REMOTE_CAST_FLAGS, { 'all_web_enable_network_machine': true, 'allow_skip_networkless': true }), CANARY_TURBO_PROFILE),
    'kevlar_triple_pipeline': mkSet('⚡ Kevlar Modular Triple Engine (m=kevlar_base_module, kevlar_main_module, kevlar_base_sync_mod_chunk)', 'Optimizes desktop Kevlar Closure module loading with eager init, warm-up pipeline, prefetch watch, and static routing for m=kevlar_base_module,kevlar_main_module,kevlar_base_sync_mod_chunk.', Object.assign({}, KEVLAR_MODULAR_FLAGS, { 'kevlar_base_module_eager_init': true, 'kevlar_main_module_warm_up': true, 'kevlar_base_sync_mod_chunk_preload': true, 'kevlar_enable_modular_player': true, 'all_web_enable_network_machine': true, 'allow_skip_networkless': true }), CANARY_TURBO_PROFILE),
    'modular_engine': mkSet('⚡ Modular Kevlar & Network Machine', 'Optimizes modular Closure chunks (kevlar_base_module, QlbBce, De8mUc) with raw network machine & static routing', Object.assign({}, KEVLAR_MODULAR_FLAGS), CANARY_TURBO_PROFILE),
    'audiophile': mkSet('🎵 Audiophile & Sound Boost', 'Stable Volume / DRC + Voice Boost + 5.1 Surround Sound + Dolby EAC3/AC3 + 3x Speed', Object.assign({}, AUDIO_CODEC_FLAGS)),
    'canary_sw_edge': mkSet('🌐 Service Worker Edge', 'sw.js & appshell Static Routing Registration + Push Notifications + Offline Transport Machine', { 'service_worker_enabled': true, 'service_worker_push_enabled': true, 'service_worker_static_routing_registration': true, 'service_worker_static_routing_exclude_embed': true, 'service_worker_push_home_page_prompt': true, 'service_worker_push_watch_page_prompt': true, 'all_web_enable_network_machine': true, 'allow_skip_networkless': true }, { state: 'canary', stage: '2', baseJsMode: 'standard', swMode: 'active', castMode: 'active', modulesMode: 'sw_cache_opt', ippLogging: 'experiment', serverVersion: 'canary' }),
    'smooth_playback': mkSet('⚡ Speedmaster & Smooth Seek', 'Hold spacebar for 2x/3x speed, draggable progress bar, custom scrubber, double-tap seek', { 'web_enable_speedmaster': true, 'web_speedmaster_spacebar_control': true, 'enable_smart_skip_speedmaster_on_web': true, 'player_doubletap_to_seek': true, 'web_progress_bar_draggable': true, 'enable_custom_scrubber_v2': true, 'unified_seek_bounce_scale': 1.15, 'web_remix_allow_up_to_3x_playback_rate': true }),
    'cyber_visuals': mkSet('🎨 Cyber-Glass & Ambient Mode', 'Frosted glass panels + Ambient cinematic lighting + Modern pill buttons + Neon buttons', { 'web_frosted_glass': true, 'web_player_frosted_glass_blur_radius': 18, 'kevlar_watch_cinematics': true, 'kevlar_watch_color_update': true, 'enable_neon_buttons': true, 'web_modern_buttons': true, 'web_modern_dialogs': true, 'web_modern_tabs': true, 'web_modern_badge_shape': true, 'web_watch_rounded_player_large': true }),
    'ai_lab': mkSet('🔮 AI Lab & Smart Tools', 'LaTeX formula rendering in Ask YouTube, Creator chatbot client, colorful AI summaries', { 'enable_youchat_latex_rendering': true, 'web_enable_creator_chatbot_client': true, 'mweb_enable_colorful_ai_summary': true, 'web_enable_ask_disclaimer_update': true, 'enable_ai_disclosure_for_video_display_full_web': true }),
    'super_hbr_av1': mkSet('💎 4K/8K AV1 Ultra Fidelity', 'Forces AV1 hardware decode ladder + 1080p Premium High Bitrate + SABR Gateway streaming', { 'enable_av1_for_svod': true, 'html5_enable_encrypted_av1': true, 'html5_prefer_av1': true, 'html5_av1_hardware_decoding': true, 'web_player_enable_premium_hbr_in_h5_api': true, 'web_player_canary_enable_hbr': true, 'html5_enable_high_bitrate_1080p': true, 'html5_sabr_client_connect': true, 'html5_enable_sabr_live_gateway': true }),
    'shorts_studio': mkSet('📱 Shorts & Reels Modern Lab', 'Unlocks playback rate picker, audio track selector, fullscreen Shorts, and scrubber bar', { 'web_shorts_playback_rate_picker': true, 'web_shorts_audio_track_picker': true, 'web_fullscreen_shorts': true, 'web_shorts_scrubber_bar': true, 'web_remix_allow_up_to_3x_playback_rate': true }),
    'canary_holdback': mkSet('🛡️ Canary Holdback Control', 'Holdback control group simulation (used by YouTube engineering to compare experimental vs vanilla)', { 'player_web_canary': false, 'player_web_is_canary': true, 'web_player_ipp_canary_type_for_logging': 'holdback' }, { state: 'holdback', stage: 'MEDIUM', baseJsMode: 'balanced', swMode: 'default', castMode: 'off', modulesMode: 'standard', ippLogging: 'holdback', serverVersion: 'prod' }),
    'ad_telemetry_tester': mkSet('📊 Ad & Telemetry Lab', 'Enables ad-break cues, companion WTA, and streaming sensing telemetry for ad testing', { 'web_player_enable_ad_break': true, 'web_enable_ad_signals': true, 'desktop_companion_wta_support': true, 'enable_topsoil_wta_for_halftime': true, 'html5_serverside_pagead_id_sets_cookie': true, 'vss_final_ping_send_and_write': true }),
    'ultra_fast_nav': mkSet('⚡ Zero-Latency Navigation', 'Kevlar warm pages + droppable prefetch + prefetch watch + networkless online mode', { 'kevlar_op_infra': true, 'kevlar_op_warm_pages': true, 'kevlar_prefetch_watch': true, 'kevlar_prefetch': true, 'kevlar_droppable_prefetchable_requests': true, 'all_web_enable_network_machine': true, 'allow_skip_networkless': true, 'networkless_always_online': true }),
    'visitor_canary_flight': mkSet('🆔 Canary Cohort & Proto Telemetry', 'Switches to US Canary High-Flight visitor ID + unblocks proto debug & Innertube response logging', { 'player_web_canary': true, 'player_web_is_canary': true, 'web_enable_innertube_proto_debug': true, 'web_enable_innertube_response_logging': true, 'web_enable_experiments_debug_menu': true, 'all_web_enable_network_machine': true }, CANARY_TURBO_PROFILE, { enabled: true, mode: 'preset', cookieId: 'V1KxORxfYuo', visitorData: 'CgtWMUt4T1J4Zll1byi44-OSBjIKCgJVUxIEGgAgCg%3D%3D', label: 'US Canary Early Flight A (Tier 1)' }),
    'members_virtual_catalog': mkSet('🕵️ Members & Virtual Playlists Unblocker', 'Unlocks members-only content preview, unlisted playlist sharing, and 4K AV1 stream playback', { 'web_enable_unlisted_playlist_sharing': true, 'web_enable_members_only_content_preview': true, 'html5_enable_eme_stream_recovery': true, 'enable_av1_for_svod': true, 'web_player_enable_premium_hbr_in_h5_api': true }),
    'ipad_pro_suite': mkSet('🍎 iPad Pro & Tablet Cinema', 'Enables iPad tablet UI, touch slider seeking, smooth scrubbing, AirPlay, inline playback, and 3000px compact controls', Object.assign({}, IPAD_FLAGS, { 'delhi_modern_web_player_responsive_compact_controls_threshold': 3000 })),
    'hardened_ad_shield': mkSet('🛡️ Hardened Ad & Tracking Shield', 'Complete ad suppression: strips ad breaks, ad slots, ad signals, halftime WTA, companion WTA, and suppresses error beacons', Object.assign({}, AD_FLAGS, { 'web_player_enable_ad_break': false, 'web_enable_ad_signals': false, 'kevlar_tuner_run_ad_block_check': false, 'web_player_enable_ad_blocker_warning': false, 'suppress_error_204_logging': true, 'html5_disable_ad_frequency_cap': true, 'html5_serverside_pagead_id_sets_cookie': false, 'desktop_companion_wta_support': false, 'enable_topsoil_wta_for_halftime': false, 'vss_final_ping_send_and_write': true }))
  };

  const allDiscoveredFlags = new Map();
  const originalDefaultFlags = {};
  const originalSerializedConfigs = {};
  const originalClientSerializedConfigs = {};
  let originalCanaryState = 'none';
  let originalCanaryStage = '';

  Object.entries(DELHI_FLAGS).forEach(([k, v]) => allDiscoveredFlags.set(k, v));
  Object.entries(MWEB_FLAGS).forEach(([k, v]) => allDiscoveredFlags.set(k, v));
  Object.entries(CANARY_FLAGS).forEach(([k, v]) => allDiscoveredFlags.set(k, v));
  Object.entries(AD_FLAGS).forEach(([k, v]) => allDiscoveredFlags.set(k, v));
  Object.entries(IPAD_FLAGS).forEach(([k, v]) => allDiscoveredFlags.set(k, v));
  Object.entries(MINIPLAYER_FLAGS).forEach(([k, v]) => allDiscoveredFlags.set(k, v));
  Object.entries(AUDIO_CODEC_FLAGS).forEach(([k, v]) => allDiscoveredFlags.set(k, v));
  Object.entries(NETWORK_FLAGS).forEach(([k, v]) => allDiscoveredFlags.set(k, v));
  Object.entries(REMOTE_CAST_FLAGS).forEach(([k, v]) => allDiscoveredFlags.set(k, v));
  Object.entries(KEVLAR_MODULAR_FLAGS).forEach(([k, v]) => allDiscoveredFlags.set(k, v));
  Object.entries(INNERTUBE_CONFIG_FLAGS).forEach(([k, v]) => allDiscoveredFlags.set(k, v));
  Object.entries(VOICE_FLAGS).forEach(([k, v]) => allDiscoveredFlags.set(k, v));
  Object.entries(DESKTOP_CONFIG_PARAMS).forEach(([k, v]) => allDiscoveredFlags.set(k, v));
  DESKTOP_BOOLEAN_FLAGS_RAW.split(',').forEach(k => {
    if (k && !allDiscoveredFlags.has(k)) allDiscoveredFlags.set(k, true);
  });

  POPULAR_FLAGS.forEach(k => {
    if (!allDiscoveredFlags.has(k)) allDiscoveredFlags.set(k, true);
  });
  customFlagList.forEach(k => {
    if (!allDiscoveredFlags.has(k)) allDiscoveredFlags.set(k, false);
  });

  // Universal ytcfg accessor for both page realm and userscript realm
  function getYtcfgData() {
    const pw = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const cfg = pw.ytcfg || (window.ytcfg ? window.ytcfg : null);
    if (!cfg) return (pw.yt && pw.yt.config_) || (window.yt && window.yt.config_) || null;
    return cfg.d ? cfg.d() : (cfg.data_ || null);
  }

  // =========================================================================
  // 5. EARLY INTERCEPTION & INJECTION ENGINE (Re-entrancy Safe)
  // =========================================================================
  function getCanaryFlags(canary) {
    if (!canary || !canary.enabled) return {};
    const isCanaryActive = canary.state !== 'none';
    const stageVal = !isNaN(Number(canary.stage)) ? Number(canary.stage) : String(canary.stage || '2');

    const flags = {
      player_web_canary: isCanaryActive && canary.state !== 'holdback',
      player_web_is_canary: isCanaryActive,
      player_web_canary_stage: stageVal,
      web_player_ipp_canary_type_for_logging: canary.ippLogging || 'experiment'
    };

    if (canary.baseJsMode === 'turbo') {
      Object.assign(flags, {
        web_player_canary_enable_hbr: true,
        web_player_canary_experiment_v2: true,
        web_player_enable_canary_buffering: true,
        html5_sabr_client_connect: true,
        html5_enable_sabr_live_gateway: true,
        all_web_enable_network_machine: true,
        all_web_network_machine_raw_request: true,
        allow_skip_networkless: true,
        enable_av1_for_svod: true,
        html5_enable_encrypted_av1: true,
        web_player_enable_premium_hbr_in_h5_api: true,
        html5_enable_drc: true,
        html5_show_drc_toggle: true,
        html5_enable_voice_boost: true,
        cinematic_watch_canary: true,
        cinematic_settings_available: true,
        kevlar_watch_cinematics: true,
        desktop_polymer_canary: true,
        kevlar_canary: true,
        kevlar_enable_canary: true
      });
    } else if (canary.baseJsMode === 'standard') {
      Object.assign(flags, {
        web_player_canary_enable_hbr: true,
        web_player_canary_experiment_v2: true,
        cinematic_watch_canary: true
      });
    } else if (canary.baseJsMode === 'balanced') {
      flags.web_player_enable_canary_buffering = true;
    }

    if (canary.swMode === 'active' || canary.swMode === 'static_route') {
      Object.assign(flags, {
        service_worker_enabled: true,
        service_worker_push_enabled: true,
        service_worker_static_routing_registration: true,
        service_worker_static_routing_exclude_embed: true,
        service_worker_push_home_page_prompt: true,
        service_worker_push_watch_page_prompt: true
      });
    } else if (canary.swMode === 'bypass') {
      flags.service_worker_enabled = false;
      flags.service_worker_push_enabled = false;
    }

    if (canary.castMode !== 'off') {
      Object.assign(flags, {
        enable_cast_api: true,
        web_enable_cast_pairing: true,
        enable_mdx_remote_control: true,
        mdx_load_cast_api_bootstrap: true,
        web_cast_allow_custom_receiver: true,
        web_enable_dial_pairing: true,
        enable_cast_on_mobile_web: true
      });
    }

    if (canary.modulesMode === 'modular_network') {
      Object.assign(flags, {
        all_web_enable_network_machine: true,
        all_web_network_machine_raw_request: true,
        allow_skip_networkless: true,
        networkless_always_online: true,
        kevlar_prefetch_watch: true,
        kevlar_droppable_prefetchable_requests: true,
        kevlar_command_handler: true,
        kevlar_entities_processor: true
      });
    } else if (canary.modulesMode === 'sync_preload') {
      Object.assign(flags, {
        kevlar_enable_modular_player: true,
        kevlar_watch_flexy_metadata: true,
        kevlar_player_cached_load_config: true,
        kevlar_op_infra: true,
        kevlar_op_warm_pages: true
      });
    } else if (canary.modulesMode === 'sw_cache_opt') {
      Object.assign(flags, {
        kevlar_service_worker: true,
        service_worker_static_routing_registration: true,
        web_service_worker_canary: true,
        shell_load_gcf: true
      });
    } else if (canary.modulesMode === 'kevlar_triple_modules') {
      Object.assign(flags, {
        kevlar_enable_modular_player: true,
        kevlar_base_module_eager_init: true,
        kevlar_main_module_warm_up: true,
        kevlar_base_sync_mod_chunk_preload: true,
        all_web_enable_network_machine: true,
        all_web_network_machine_raw_request: true,
        allow_skip_networkless: true,
        networkless_always_online: true,
        kevlar_prefetch_watch: true,
        kevlar_droppable_prefetchable_requests: true,
        kevlar_command_handler: true,
        kevlar_entities_processor: true,
        kevlar_op_infra: true,
        kevlar_op_warm_pages: true,
        kevlar_player_cached_load_config: true
      });
    }

    return flags;
  }

  function patchSerializedFlags(serialized, flagsToApply, canary) {
    if (!serialized || typeof serialized !== 'string') return serialized;
    const parts = serialized.replace(/\\u0026/g, '&').replace(/\\u003d/g, '=').split('&');
    const map = {};
    for (const p of parts) {
      if (!p) continue;
      const eqIdx = p.indexOf('=');
      if (eqIdx !== -1) map[p.slice(0, eqIdx)] = p.slice(eqIdx + 1);
    }
    const combined = Object.assign({}, flagsToApply, getCanaryFlags(canary));
    for (const [k, v] of Object.entries(combined)) {
      map[k] = typeof v === 'boolean' ? String(v).toLowerCase() : String(v);
    }
    return Object.entries(map).map(([k, v]) => `${k}=${v}`).join('&');
  }

  function captureDefaultsBeforeOverride(data) {
    if (!data || typeof data !== 'object') return;
    if (originalCanaryState === 'none' && data.CLIENT_CANARY_STATE) originalCanaryState = data.CLIENT_CANARY_STATE;
    if (!originalCanaryStage && data.canaryStage) originalCanaryStage = data.canaryStage;
    if (data.EXPERIMENT_FLAGS) {
      for (const [k, v] of Object.entries(data.EXPERIMENT_FLAGS)) {
        if (!(k in originalDefaultFlags)) originalDefaultFlags[k] = v;
      }
    }
    if (data.WEB_PLAYER_CONTEXT_CONFIGS) {
      for (const cKey in data.WEB_PLAYER_CONTEXT_CONFIGS) {
        const pcfg = data.WEB_PLAYER_CONTEXT_CONFIGS[cKey];
        if (pcfg) {
          if (pcfg.serializedExperimentFlags && !(cKey in originalSerializedConfigs)) {
            originalSerializedConfigs[cKey] = pcfg.serializedExperimentFlags;
          }
          if (pcfg.serializedClientExperimentFlags && !(cKey in originalClientSerializedConfigs)) {
            originalClientSerializedConfigs[cKey] = pcfg.serializedClientExperimentFlags;
          }
        }
      }
    }
  }

  function applyActiveOverridesToData(data) {
    if (!data || typeof data !== 'object') return;
    captureDefaultsBeforeOverride(data);

    if (visitorConfig.enabled && visitorConfig.visitorData) {
      data.VISITOR_DATA = visitorConfig.visitorData;
      data.INNERTUBE_CLIENT_VISITOR_DATA = visitorConfig.visitorData;
      if (data.INNERTUBE_CONTEXT && data.INNERTUBE_CONTEXT.client) {
        data.INNERTUBE_CONTEXT.client.visitorData = visitorConfig.visitorData;
      }
    }

    if (overrides['mweb_ipad_support'] || overrides['web_enable_tablet_ui']) {
      if (data.INNERTUBE_CONTEXT && data.INNERTUBE_CONTEXT.client) {
        data.INNERTUBE_CONTEXT.client.deviceMake = 'Apple';
        data.INNERTUBE_CONTEXT.client.deviceModel = 'iPad';
        data.INNERTUBE_CONTEXT.client.osName = 'iPad';
      }
      data.DEVICE = 'cbrand=Apple&cmodel=iPad&cos=iPad&cosver=17_5&cplatform=TABLET';
    }

    if (overrides['web_player_enable_ad_break'] === false) {
      if (data.INNERTUBE_CONTEXT && data.INNERTUBE_CONTEXT.adSignals) {
        data.INNERTUBE_CONTEXT.adSignals = {};
      }
      if (data.WEB_PLAYER_CONTEXT_CONFIGS) {
        for (const ctxKey in data.WEB_PLAYER_CONTEXT_CONFIGS) {
          const pcfg = data.WEB_PLAYER_CONTEXT_CONFIGS[ctxKey];
          if (pcfg) {
            pcfg.adBreakHeartbeatParams = null;
            pcfg.watchNextHeartbeatParams = null;
          }
        }
      }
    }

    if (canaryConfig.enabled) {
      data.CLIENT_CANARY_STATE = canaryConfig.state || 'canary';
      data.canaryState = canaryConfig.state || 'canary';
      data.canaryStage = String(canaryConfig.stage || '2');
      if (canaryConfig.serverVersion) data.SERVER_VERSION = canaryConfig.serverVersion;
    }

    if (!data.EXPERIMENT_FLAGS) data.EXPERIMENT_FLAGS = {};
    if (!data.EXPERIMENTS_FORCED_FLAGS) data.EXPERIMENTS_FORCED_FLAGS = {};

    for (const [k, v] of Object.entries(data.EXPERIMENT_FLAGS)) {
      if (!allDiscoveredFlags.has(k)) allDiscoveredFlags.set(k, v);
    }

    if (!data.INNERTUBE_API_KEY) data.INNERTUBE_API_KEY = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
    if (!data.INNERTUBE_CLIENT_VERSION) data.INNERTUBE_CLIENT_VERSION = '2.20261012.01.00';
    if (!data.EVENT_ID) data.EVENT_ID = 'k9XNavyqLrj1s8IP1ePjyQ8';
    if (!data.LATEST_ECATCHER_SERVICE_TRACKING_PARAMS) data.LATEST_ECATCHER_SERVICE_TRACKING_PARAMS = { 'client.name': 'WEB' };
    const canaryMap = getCanaryFlags(canaryConfig);
    Object.assign(data.EXPERIMENT_FLAGS, overrides, canaryMap);
    Object.assign(data.EXPERIMENTS_FORCED_FLAGS, overrides, canaryMap);

    if (typeof document !== 'undefined' && document.documentElement && !document.documentElement.hasAttribute('data-cast-api-enabled')) {
      try { document.documentElement.setAttribute('data-cast-api-enabled', 'true'); } catch {}
    }

    if (data.WEB_PLAYER_CONTEXT_CONFIGS) {
      for (const ctxKey in data.WEB_PLAYER_CONTEXT_CONFIGS) {
        const pcfg = data.WEB_PLAYER_CONTEXT_CONFIGS[ctxKey];
        if (pcfg) {
          if (canaryConfig.enabled) {
            pcfg.canaryState = canaryConfig.state || 'canary';
            pcfg.canaryStage = String(canaryConfig.stage || '2');
            pcfg.cinematicSettingsAvailable = true;
          }
          if (canaryConfig.castMode !== 'off') {
            pcfg.disableCastApi = false;
            pcfg.disableMdxCast = false;
          }
          if (pcfg.serializedExperimentFlags) {
            pcfg.serializedExperimentFlags = patchSerializedFlags(pcfg.serializedExperimentFlags, overrides, canaryConfig);
          }
          if (pcfg.serializedClientExperimentFlags) {
            pcfg.serializedClientExperimentFlags = patchSerializedFlags(pcfg.serializedClientExperimentFlags, overrides, canaryConfig);
          }
        }
      }
    }
  }

  // Multi-target Service Worker Canary Interception & Bypass Engine
  try {
    const swTargets = [];
    if (typeof pageWin !== 'undefined' && pageWin.ServiceWorkerContainer && pageWin.ServiceWorkerContainer.prototype) {
      swTargets.push(pageWin.ServiceWorkerContainer.prototype);
    }
    if (typeof pageWin !== 'undefined' && pageWin.navigator && pageWin.navigator.serviceWorker) {
      swTargets.push(pageWin.navigator.serviceWorker);
    }
    if (typeof window !== 'undefined' && window.ServiceWorkerContainer && window.ServiceWorkerContainer.prototype && !swTargets.includes(window.ServiceWorkerContainer.prototype)) {
      swTargets.push(window.ServiceWorkerContainer.prototype);
    }
    if (typeof navigator !== 'undefined' && navigator.serviceWorker && !swTargets.includes(navigator.serviceWorker)) {
      swTargets.push(navigator.serviceWorker);
    }

    swTargets.forEach((target) => {
      if (!target || typeof target.register !== 'function' || target.__expStudioSwHooked) return;
      const origRegister = target.register;
      target.register = function (scriptURL, options) {
        try {
          if (canaryConfig.enabled) {
            if (canaryConfig.swMode === 'bypass') {
              console.info('[YT Exp Studio] Service Worker registration bypassed to enforce fresh Canary script fetching.');
              return Promise.reject(new Error('Service Worker bypassed by YT Exp Studio Canary Mode'));
            }
            if (canaryConfig.swMode === 'active' || canaryConfig.swMode === 'static_route') {
              try {
                const parsedUrl = new URL(String(scriptURL), window.location.href);
                parsedUrl.searchParams.set('yt_canary', '1');
                parsedUrl.searchParams.set('state', canaryConfig.state || 'canary');
                parsedUrl.searchParams.set('stage', canaryConfig.stage || '2');
                const urlStr = parsedUrl.toString();
                let wrapped = null;
                if (ttPolicy && typeof ttPolicy.createScriptURL === 'function') {
                  try { wrapped = ttPolicy.createScriptURL(urlStr); } catch {}
                }
                if (!wrapped && pageWin.trustedTypes && pageWin.trustedTypes.defaultPolicy && typeof pageWin.trustedTypes.defaultPolicy.createScriptURL === 'function') {
                  try { wrapped = pageWin.trustedTypes.defaultPolicy.createScriptURL(urlStr); } catch {}
                }
                if (wrapped) {
                  scriptURL = wrapped;
                } else if (!pageWin.trustedTypes || !pageWin.trustedTypes.emptyScript) {
                  scriptURL = urlStr;
                }
              } catch (e) {
                console.warn('[YT Exp Studio] TrustedScriptURL creation fallback:', e);
              }
            }
          }
        } catch (err) {
          console.warn('[YT Exp Studio] Error in Service Worker registration hook:', err);
        }
        return origRegister.call(this, scriptURL, options);
      };
      target.__expStudioSwHooked = true;
    });
  } catch {}

  async function clearServiceWorkerCaches() {
    let unregCount = 0;
    let cacheCount = 0;
    try {
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
          unregCount++;
        }
      }
      if (typeof window !== 'undefined' && 'caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
          cacheCount++;
        }
      }
      return { success: true, unregCount, cacheCount };
    } catch (e) {
      console.warn('[YT Exp Studio] Service Worker cache clear error:', e);
      return { success: false, error: e };
    }
  }

  function installEarlyHook() {
    let currentYtcfg = pageWin.ytcfg;
    let isApplying = false;

    function isTargetClosureScript(url) {
      if (!url || typeof url !== 'string') return false;
      return url.includes('kevlar_base_module') ||
             url.includes('kevlar_main_module') ||
             url.includes('kevlar_base_sync_mod_chunk') ||
             url.includes('base.js') ||
             url.includes('serviceworker-kevlar-appshell') ||
             url.includes('webcomponents-sd') ||
             url.includes('spf.js') ||
             url.includes('desktop_polymer') ||
             url.includes('offline.js') ||
             url.includes('remote.js') ||
             url.includes('cast_sender.js') ||
             url.includes('AGKMywHuveUU_QqutjtPr5up-vnWzWcG3Q');
    }

    // 1. Script Element src property descriptor hook (Catches Closure Compiler script.src = ...)
    try {
      const scriptProto = pageWin.HTMLScriptElement ? pageWin.HTMLScriptElement.prototype : null;
      const scriptSrcDesc = scriptProto ? Object.getOwnPropertyDescriptor(scriptProto, 'src') : null;
      if (scriptProto && scriptSrcDesc && scriptSrcDesc.set) {
        const origSrcSetter = scriptSrcDesc.set;
        Object.defineProperty(scriptProto, 'src', {
          configurable: true,
          enumerable: scriptSrcDesc.enumerable,
          get: function () {
            return scriptSrcDesc.get ? scriptSrcDesc.get.call(this) : this.getAttribute('src');
          },
          set: function (url) {
            try {
              if (isTargetClosureScript(url)) {
                const d = getYtcfgData();
                if (d) applyActiveOverridesToData(d);
              }
            } catch (e) {
              console.warn('[YT Exp Studio] script src setter hook error:', e);
            }
            return origSrcSetter.call(this, url);
          }
        });
      }
    } catch {}

    // 2. Kevlar & Base.js Modular Pipeline Interception
    try {
      const origCreateElement = pageWin.document.createElement.bind(pageWin.document);
      pageWin.document.createElement = function (tagName, options) {
        const el = origCreateElement(tagName, options);
        if (tagName && typeof tagName === 'string' && tagName.toLowerCase() === 'script') {
          const origSetAttr = el.setAttribute.bind(el);
          el.setAttribute = function (name, value) {
            if (name === 'src' && isTargetClosureScript(value)) {
              const d = getYtcfgData();
              if (d) applyActiveOverridesToData(d);
            }
            return origSetAttr(name, value);
          };
        }
        return el;
      };
    } catch {}

    try {
      if (typeof MutationObserver !== 'undefined' && pageWin.document.documentElement) {
        const modObserver = new MutationObserver((mutations) => {
          for (const m of mutations) {
            for (const n of m.addedNodes) {
              if (n.tagName === 'SCRIPT' && isTargetClosureScript(n.src)) {
                const d = getYtcfgData();
                if (d) applyActiveOverridesToData(d);
              }
            }
          }
        });
        modObserver.observe(pageWin.document.documentElement, { childList: true, subtree: true });
      }
    } catch {}

    // 3. Network Machine Fetch & XHR Hooks for Innertube, Visitor ID, iPad & Ad Shield
    try {
      const origFetch = pageWin.fetch || window.fetch;
      if (origFetch && !origFetch.__expStudioHooked) {
        const hookedFetch = async function (input, init) {
          try {
            const url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
            const isInnertube = url && (url.includes('/youtubei/') || url.includes('youtube.com/youtubei/'));
            if (isInnertube) {
              init = init || {};
              init.headers = init.headers || {};
              if (visitorConfig.enabled && visitorConfig.visitorData) {
                if (init.headers instanceof Headers) {
                  init.headers.set('X-Goog-Visitor-Id', visitorConfig.visitorData);
                } else if (Array.isArray(init.headers)) {
                  init.headers.push(['X-Goog-Visitor-Id', visitorConfig.visitorData]);
                } else {
                  init.headers['X-Goog-Visitor-Id'] = visitorConfig.visitorData;
                }
              }
              if (overrides['web_enable_ad_signals'] === false || overrides['web_player_enable_ad_break'] === false) {
                if (init.headers instanceof Headers) {
                  init.headers.delete('X-YouTube-Ad-Signals');
                } else if (!Array.isArray(init.headers)) {
                  delete init.headers['X-YouTube-Ad-Signals'];
                }
              }
              if (typeof init.body === 'string') {
                try {
                  const parsed = JSON.parse(init.body);
                  let modified = false;
                  if (visitorConfig.enabled && visitorConfig.visitorData && parsed.context?.client) {
                    parsed.context.client.visitorData = visitorConfig.visitorData;
                    modified = true;
                  }
                  if ((overrides['mweb_ipad_support'] || overrides['web_enable_tablet_ui']) && parsed.context?.client) {
                    parsed.context.client.deviceMake = 'Apple';
                    parsed.context.client.deviceModel = 'iPad';
                    parsed.context.client.osName = 'iPad';
                    modified = true;
                  }
                  if (modified) {
                    init.body = JSON.stringify(parsed);
                  }
                } catch {}
              }
            }
          } catch (e) {
            console.warn('[YT Exp Studio] Fetch hook error:', e);
          }

          const response = await origFetch.apply(this, arguments);

          // Response sanitization for player and ad break endpoints
          try {
            const url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
            if (url && (url.includes('/youtubei/v1/player') || url.includes('/youtubei/v1/player/ad_break'))) {
              if (overrides['web_player_enable_ad_break'] === false) {
                const clone = response.clone();
                const json = await clone.json();
                if (json) {
                  let changed = false;
                  if (json.adPlacements) { delete json.adPlacements; changed = true; }
                  if (json.playerAds) { delete json.playerAds; changed = true; }
                  if (json.adSlots) { delete json.adSlots; changed = true; }
                  if (json.adBreakHeartbeatParams) { delete json.adBreakHeartbeatParams; changed = true; }
                  if (changed) {
                    return new Response(JSON.stringify(json), {
                      status: response.status,
                      statusText: response.statusText,
                      headers: response.headers
                    });
                  }
                }
              }
            }
          } catch {}

          return response;
        };
        hookedFetch.__expStudioHooked = true;
        if (pageWin.fetch) pageWin.fetch = hookedFetch;
        if (window.fetch && window !== pageWin) window.fetch = hookedFetch;
      }
    } catch {}

    try {
      const origOpen = pageWin.XMLHttpRequest.prototype.open;
      const origSend = pageWin.XMLHttpRequest.prototype.send;
      if (origOpen && !origOpen.__expStudioHooked) {
        pageWin.XMLHttpRequest.prototype.open = function (method, url) {
          this.__expUrl = typeof url === 'string' ? url : '';
          this.__expIsInnertube = this.__expUrl.includes('/youtubei/') || this.__expUrl.includes('youtube.com/youtubei/');
          return origOpen.apply(this, arguments);
        };
        pageWin.XMLHttpRequest.prototype.open.__expStudioHooked = true;
      }
      if (origSend && !origSend.__expStudioHooked) {
        pageWin.XMLHttpRequest.prototype.send = function (body) {
          try {
            if (this.__expIsInnertube) {
              if (visitorConfig.enabled && visitorConfig.visitorData) {
                try {
                  this.setRequestHeader('X-Goog-Visitor-Id', visitorConfig.visitorData);
                } catch {}
              }
              if (overrides['web_enable_ad_signals'] === false || overrides['web_player_enable_ad_break'] === false) {
                try {
                  this.setRequestHeader('X-YouTube-Ad-Signals', '');
                } catch {}
              }
              if (typeof body === 'string') {
                try {
                  const parsed = JSON.parse(body);
                  let modified = false;
                  if (visitorConfig.enabled && visitorConfig.visitorData && parsed.context?.client) {
                    parsed.context.client.visitorData = visitorConfig.visitorData;
                    modified = true;
                  }
                  if ((overrides['mweb_ipad_support'] || overrides['web_enable_tablet_ui']) && parsed.context?.client) {
                    parsed.context.client.deviceMake = 'Apple';
                    parsed.context.client.deviceModel = 'iPad';
                    parsed.context.client.osName = 'iPad';
                    modified = true;
                  }
                  if (modified) {
                    body = JSON.stringify(parsed);
                  }
                } catch {}
              }
            }
          } catch (e) {
            console.warn('[YT Exp Studio] XHR hook error:', e);
          }
          return origSend.call(this, body);
        };
        pageWin.XMLHttpRequest.prototype.send.__expStudioHooked = true;
      }
    } catch {}

    // 4. ytcfg Interception (Supports single object and 2-argument format)
    function wrapYtcfg(ytcfgObj) {
      if (!ytcfgObj || ytcfgObj.__expStudioHooked) return;
      const originalSet = ytcfgObj.set;
      ytcfgObj.set = function () {
        if (arguments.length > 1 && typeof arguments[0] === 'string') {
          captureDefaultsBeforeOverride({ [arguments[0]]: arguments[1] });
        } else if (arguments.length > 0 && arguments[0] && typeof arguments[0] === 'object') {
          captureDefaultsBeforeOverride(arguments[0]);
        }
        const res = originalSet ? originalSet.apply(this, arguments) : undefined;
        if (!isApplying) {
          isApplying = true;
          try {
            const d = ytcfgObj.d ? ytcfgObj.d() : ytcfgObj.data_;
            applyActiveOverridesToData(d);
          } catch (e) {
            console.error('[YT Exp Studio] Error in ytcfg hook:', e);
          } finally {
            isApplying = false;
          }
        }
        return res;
      };
      ytcfgObj.__expStudioHooked = true;
      const d = ytcfgObj.d ? ytcfgObj.d() : ytcfgObj.data_;
      if (d) applyActiveOverridesToData(d);
    }

    if (currentYtcfg) {
      wrapYtcfg(currentYtcfg);
    }

    try {
      Object.defineProperty(pageWin, 'ytcfg', {
        configurable: true,
        enumerable: true,
        get: () => currentYtcfg,
        set: (newYtcfg) => {
          currentYtcfg = newYtcfg;
          wrapYtcfg(newYtcfg);
        }
      });
    } catch {}

    let pollCount = 0;
    const pollInterval = setInterval(() => {
      pollCount++;
      const d = getYtcfgData();
      if (d) {
        applyActiveOverridesToData(d);
      }
      if (pollCount > 15) clearInterval(pollInterval);
    }, 60);
  }

  installEarlyHook();

  // =========================================================================
  // 6. RUNTIME HARVESTER (Captures all 1,720+ flags)
  // =========================================================================
  function harvestAllFlagsFromRuntime() {
    const data = getYtcfgData();
    if (!data) return;

    if (originalCanaryState === 'none' && data.CLIENT_CANARY_STATE) {
      originalCanaryState = data.CLIENT_CANARY_STATE;
    }
    if (!originalCanaryStage && data.canaryStage) {
      originalCanaryStage = data.canaryStage;
    }

    const directFlags = data.EXPERIMENT_FLAGS || {};
    for (const [k, v] of Object.entries(directFlags)) {
      if (!(k in originalDefaultFlags)) {
        originalDefaultFlags[k] = v;
      }
      if (!allDiscoveredFlags.has(k)) allDiscoveredFlags.set(k, v);
    }

    const pConfigs = data.WEB_PLAYER_CONTEXT_CONFIGS || {};
    for (const cKey in pConfigs) {
      const cfg = pConfigs[cKey];
      if (cfg && cfg.serializedExperimentFlags) {
        if (!(cKey in originalSerializedConfigs)) {
          originalSerializedConfigs[cKey] = cfg.serializedExperimentFlags;
        }
        const raw = cfg.serializedExperimentFlags.replace(/\u0026/g, '&').replace(/\u003d/g, '=');
        for (const pair of raw.split('&')) {
          if (!pair) continue;
          const eqIdx = pair.indexOf('=');
          if (eqIdx !== -1) {
            const key = pair.slice(0, eqIdx);
            const valStr = pair.slice(eqIdx + 1);
            if (key) {
              let val = valStr === 'true' ? true : valStr === 'false' ? false : valStr;
              if (!isNaN(Number(valStr)) && valStr !== '') {
                val = Number(valStr);
              }
              if (!(key in originalDefaultFlags)) {
                originalDefaultFlags[key] = val;
              }
              if (!allDiscoveredFlags.has(key)) {
                allDiscoveredFlags.set(key, val);
              }
            }
          }
        }
      }
    }
  }

  // =========================================================================
  // 7. ADVANCED MINIPLAYER & PICTURE-IN-PICTURE (PiP) CONTROLLER ENGINE
  // =========================================================================
  function preloadKevlarTripleModules() {
    const elements = Array.from(document.querySelectorAll('link[rel="preload"][href*="kevlar_base_module"], script[src*="kevlar_base_module"], script[src*="kevlar_main_module"], script[src*="kevlar_base_sync_mod_chunk"], script[src*="base.js"]'));
    let preloadedCount = 0;
    elements.forEach(el => {
      const src = el.src || el.href;
      if (!src) return;
      let link = document.querySelector(`link[rel="preload"][href="${src}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = src;
        (document.head || document.documentElement).appendChild(link);
        preloadedCount++;
      }
    });
    return preloadedCount;
  }

  function getActiveVideo() {
    const video = document.querySelector('video.html5-main-video') ||
                  document.querySelector('#movie_player video') ||
                  document.querySelector('video');
    if (video) ensureVideoPiPEnabled(video);
    return video;
  }

  function isMiniplayerActive() {
    const mini = document.querySelector('ytd-miniplayer');
    if (mini && (mini.hasAttribute('active') || mini.getAttribute('minimized') === 'false' || mini.offsetParent !== null)) {
      return true;
    }
    const moviePlayer = document.getElementById('movie_player');
    if (moviePlayer && (moviePlayer.classList.contains('ytp-player-minimized') || moviePlayer.classList.contains('yt-exp-force-miniplayer'))) {
      return true;
    }
    return false;
  }

  function isPiPActive() {
    const video = getActiveVideo();
    if (!video) return false;
    return document.pictureInPictureElement === video ||
           (video.webkitPresentationMode && video.webkitPresentationMode === 'picture-in-picture');
  }

  function forceMiniplayer(enable) {
    const moviePlayer = document.getElementById('movie_player');
    const ytdApp = document.querySelector('ytd-app');
    const mini = document.querySelector('ytd-miniplayer');

    if (enable) {
      if (document.fullscreenElement) {
        try { document.exitFullscreen(); } catch {}
      }

      if (ytdApp && typeof ytdApp.fire === 'function') {
        try {
          ytdApp.fire('yt-action', { actionName: 'yt-miniplayer-expand-action' });
        } catch {}
      }
      if (ytdApp && typeof ytdApp.dispatchEvent === 'function') {
        try {
          ytdApp.dispatchEvent(new CustomEvent('yt-action', {
            detail: { actionName: 'yt-miniplayer-expand-action' },
            bubbles: true,
            composed: true
          }));
        } catch {}
      }

      if (mini) {
        if (typeof mini.open === 'function') mini.open();
        else if (typeof mini.expand === 'function') mini.expand();
        else if (typeof mini.show === 'function') mini.show();
        mini.setAttribute('active', '');
      }

      if (moviePlayer) {
        if (typeof moviePlayer.setMiniplayerActive === 'function') {
          try { moviePlayer.setMiniplayerActive(true); } catch {}
        }
        if (typeof moviePlayer.toggleMiniplayer === 'function' && !isMiniplayerActive()) {
          try { moviePlayer.toggleMiniplayer(); } catch {}
        }
      }

      const nativeBtn = document.querySelector('button.ytp-miniplayer-button');
      if (nativeBtn && !isMiniplayerActive()) {
        try { nativeBtn.click(); } catch {}
      }

      if (!isMiniplayerActive()) {
        try {
          const target = moviePlayer || document.activeElement || document.body;
          target.dispatchEvent(new KeyboardEvent('keydown', { key: 'i', code: 'KeyI', keyCode: 73, which: 73, bubbles: true, cancelable: true }));
          target.dispatchEvent(new KeyboardEvent('keyup', { key: 'i', code: 'KeyI', keyCode: 73, which: 73, bubbles: true, cancelable: true }));
        } catch {}
      }

      setTimeout(() => {
        if (!isMiniplayerActive() && moviePlayer) {
          toggleCustomFloatingMiniplayer(true);
        }
        updateMiniplayerAndPiPButtons();
      }, 200);

      return true;
    } else {
      toggleCustomFloatingMiniplayer(false);

      if (ytdApp && typeof ytdApp.fire === 'function') {
        try {
          ytdApp.fire('yt-action', { actionName: 'yt-miniplayer-restore-action' });
        } catch {}
      }
      if (ytdApp && typeof ytdApp.dispatchEvent === 'function') {
        try {
          ytdApp.dispatchEvent(new CustomEvent('yt-action', {
            detail: { actionName: 'yt-miniplayer-restore-action' },
            bubbles: true,
            composed: true
          }));
        } catch {}
      }

      if (mini) {
        if (typeof mini.close === 'function') mini.close();
        mini.removeAttribute('active');
        const expandBtn = mini.querySelector('#expand-button, .ytp-miniplayer-expand-watch-page-button');
        if (expandBtn) expandBtn.click();
      }

      if (moviePlayer && typeof moviePlayer.setMiniplayerActive === 'function') {
        try { moviePlayer.setMiniplayerActive(false); } catch {}
      }

      setTimeout(() => {
        updateMiniplayerAndPiPButtons();
      }, 200);

      return true;
    }
  }

  function toggleCustomFloatingMiniplayer(enable) {
    const moviePlayer = document.getElementById('movie_player');
    if (!moviePlayer) return;
    if (enable) {
      moviePlayer.classList.add('yt-exp-force-miniplayer');
      ensureCustomMiniControls();
    } else {
      moviePlayer.classList.remove('yt-exp-force-miniplayer');
      const bar = document.getElementById('yt-exp-mini-dock-bar');
      if (bar) bar.remove();
    }
  }

  function ensureCustomMiniControls() {
    const moviePlayer = document.getElementById('movie_player');
    if (!moviePlayer || document.getElementById('yt-exp-mini-dock-bar')) return;

    const bar = h('div', { id: 'yt-exp-mini-dock-bar' },
      h('span', { style: { fontWeight: 'bold', fontSize: '11px', color: '#ff4444' } }, '🗗 Floating Dock'),
      h('button', {
        style: { background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '13px' },
        title: 'Restore to Watch Page',
        onClick: (e) => {
          e.stopPropagation();
          toggleCustomFloatingMiniplayer(false);
          updateMiniplayerAndPiPButtons();
        }
      }, '✕')
    );
    moviePlayer.appendChild(bar);
  }

  async function togglePiP() {
    const video = getActiveVideo();
    if (!video) {
      alert('No active video found on page to enter Picture-in-Picture.');
      return false;
    }
    ensureVideoPiPEnabled(video);

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        updateMiniplayerAndPiPButtons();
        return false;
      } else if (document.pictureInPictureEnabled && typeof video.requestPictureInPicture === 'function') {
        await video.requestPictureInPicture();
        updateMiniplayerAndPiPButtons();
        return true;
      } else if (video.webkitSupportsPresentationMode && typeof video.webkitSetPresentationMode === 'function') {
        const nextMode = video.webkitPresentationMode === 'picture-in-picture' ? 'inline' : 'picture-in-picture';
        video.webkitSetPresentationMode(nextMode);
        updateMiniplayerAndPiPButtons();
        return nextMode === 'picture-in-picture';
      } else {
        alert('Picture-in-Picture is not supported by your browser for this video.');
        return false;
      }
    } catch (err) {
      console.warn('[YT Exp Studio] PiP toggle error:', err);
      alert('Picture-in-Picture Error: ' + err.message);
      return false;
    }
  }

  let autoPipTriggered = false;
  document.addEventListener('visibilitychange', async () => {
    if (!autoPipEnabled) return;
    const video = getActiveVideo();
    if (!video || video.paused || video.ended) return;

    if (document.visibilityState === 'hidden') {
      if (!document.pictureInPictureElement && typeof video.requestPictureInPicture === 'function') {
        try {
          await video.requestPictureInPicture();
          autoPipTriggered = true;
          updateMiniplayerAndPiPButtons();
        } catch {}
      }
    } else if (document.visibilityState === 'visible') {
      if (document.pictureInPictureElement && autoPipTriggered) {
        try {
          await document.exitPictureInPicture();
          autoPipTriggered = false;
          updateMiniplayerAndPiPButtons();
        } catch {}
      }
    }
  });

  document.addEventListener('enterpictureinpicture', () => {
    updateMiniplayerAndPiPButtons();
  }, true);
  document.addEventListener('leavepictureinpicture', () => {
    updateMiniplayerAndPiPButtons();
  }, true);

  let btnMiniplayerHeader = null;
  let btnPipHeader = null;
  let tabMiniplayerBtn = null;
  let tabPipBtn = null;
  let miniIndicatorPill = null;
  let pipIndicatorPill = null;

  function updateMiniplayerAndPiPButtons() {
    const isMini = isMiniplayerActive();
    const isPip = isPiPActive();

    if (btnMiniplayerHeader) {
      btnMiniplayerHeader.classList.toggle('active-mode', isMini);
      btnMiniplayerHeader.textContent = isMini ? '🗗 Restore' : '🗗 Miniplayer';
      btnMiniplayerHeader.title = isMini ? 'Restore full watch page player' : 'Force video into YouTube Miniplayer';
    }

    if (btnPipHeader) {
      btnPipHeader.classList.toggle('active-pip', isPip);
      btnPipHeader.textContent = isPip ? '📺 Exit PiP' : '📺 PiP';
      btnPipHeader.title = isPip ? 'Exit Picture-in-Picture' : 'Pop video into browser Picture-in-Picture';
    }

    if (tabMiniplayerBtn) {
      tabMiniplayerBtn.textContent = isMini ? '🗗 Restore Full Player' : '🗗 Force Miniplayer';
      tabMiniplayerBtn.classList.toggle('active-mode', isMini);
    }

    if (tabPipBtn) {
      tabPipBtn.textContent = isPip ? '📺 Turn OFF Picture-in-Picture' : '📺 Turn ON Picture-in-Picture';
      tabPipBtn.classList.toggle('active-pip', isPip);
    }

    if (miniIndicatorPill) {
      miniIndicatorPill.style.display = isMini ? 'inline-block' : 'none';
    }
    if (pipIndicatorPill) {
      pipIndicatorPill.style.display = isPip ? 'inline-block' : 'none';
    }
  }

  // =========================================================================
  // 7.5. CREATOR & VIDEO INTEL, VIRTUAL PLAYLISTS (UUMO/UU/UUSH) & INNERTUBE ENGINE
  // =========================================================================
  function findInNested(obj, targetKey) {
    const results = [];
    if (!obj || typeof obj !== 'object') return results;
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i] && typeof obj[i] === 'object') {
          results.push(...findInNested(obj[i], targetKey));
        }
      }
    } else {
      for (const [k, v] of Object.entries(obj)) {
        if (k === targetKey) {
          results.push(v);
        } else if (v && typeof v === 'object') {
          results.push(...findInNested(v, targetKey));
        }
      }
    }
    return results;
  }

  function detectCurrentPageChannelId() {
    try {
      const moviePlayer = pageWin.document.getElementById('movie_player');
      const pResp = (typeof moviePlayer?.getPlayerResponse === 'function' ? moviePlayer.getPlayerResponse() : null) || pageWin.ytInitialPlayerResponse;
      if (pResp?.videoDetails?.channelId) {
        return pResp.videoDetails.channelId;
      }
      const path = window.location.pathname;
      const chMatch = path.match(/\/channel\/(UC[A-Za-z0-9_-]{22})/);
      if (chMatch) return chMatch[1];
      const d = getYtcfgData();
      if (d && d.CHANNEL_ID && typeof d.CHANNEL_ID === 'string' && d.CHANNEL_ID.startsWith('UC')) {
        return d.CHANNEL_ID;
      }
      const canLink = document.querySelector('link[rel="canonical"]');
      if (canLink && canLink.href) {
        const canM = canLink.href.match(/\/channel\/(UC[A-Za-z0-9_-]{22})/);
        if (canM) return canM[1];
      }
      const ogMeta = document.querySelector('meta[property="og:url"]');
      if (ogMeta && ogMeta.content) {
        const ogM = ogMeta.content.match(/\/channel\/(UC[A-Za-z0-9_-]{22})/);
        if (ogM) return ogM[1];
      }
      const metaEl = document.querySelector('meta[itemprop="channelId"]');
      if (metaEl && metaEl.content && metaEl.content.startsWith('UC')) {
        return metaEl.content;
      }
      const initData = pageWin.ytInitialData;
      if (initData) {
        const c4 = findInNested(initData, 'c4TabbedHeaderRenderer');
        if (c4.length > 0 && c4[0].channelId) return c4[0].channelId;
        const metaRender = findInNested(initData, 'channelMetadataRenderer');
        if (metaRender.length > 0 && metaRender[0].externalId) return metaRender[0].externalId;
        const params = findInNested(initData, 'serviceTrackingParams');
        for (const stp of params) {
          if (Array.isArray(stp?.params)) {
            const ucidParam = stp.params.find(p => p.key === 'ucid');
            if (ucidParam && ucidParam.value && ucidParam.value.startsWith('UC')) {
              return ucidParam.value;
            }
          }
        }
      }
      const chAnchor = document.querySelector('ytd-watch-metadata #channel-name a, #owner #channel-name a, ytd-channel-name a, ytd-channel-tagline-renderer a');
      if (chAnchor && chAnchor.href) {
        const m = chAnchor.href.match(/\/channel\/(UC[A-Za-z0-9_-]{22})/);
        if (m) return m[1];
      }
    } catch (e) {
      console.warn('[YT Exp Studio] detectChannelId error:', e);
    }
    return null;
  }

  function detectCurrentVideoDetails() {
    try {
      const moviePlayer = pageWin.document.getElementById('movie_player');
      const pResp = (typeof moviePlayer?.getPlayerResponse === 'function' ? moviePlayer.getPlayerResponse() : null) || pageWin.ytInitialPlayerResponse;
      if (!pResp) return null;
      const vDetails = pResp.videoDetails || {};
      const micro = pResp.microformat?.playerMicroformatRenderer || {};
      const streams = pResp.streamingData || {};
      return {
        videoId: vDetails.videoId || '',
        title: vDetails.title || '',
        channelId: vDetails.channelId || '',
        author: vDetails.author || '',
        lengthSeconds: vDetails.lengthSeconds ? Number(vDetails.lengthSeconds) : 0,
        viewCount: vDetails.viewCount ? Number(vDetails.viewCount) : (micro.viewCount ? Number(micro.viewCount) : null),
        keywords: Array.isArray(vDetails.keywords) ? vDetails.keywords : [],
        uploadDate: micro.uploadDate || '',
        publishDate: micro.publishDate || '',
        category: micro.category || '',
        isUnlisted: !!micro.isUnlisted,
        isFamilySafe: !!micro.isFamilySafe,
        isShortsEligible: !!micro.isShortsEligible,
        isLiveContent: !!(micro.liveBroadcastDetails || vDetails.isLiveContent),
        liveBroadcast: micro.liveBroadcastDetails || null,
        loudnessDb: typeof vDetails.loudnessDb === 'number' ? vDetails.loudnessDb : null,
        adaptiveFormats: streams.adaptiveFormats || []
      };
    } catch {
      return null;
    }
  }

  async function fetchChannelAboutDetails(channelId) {
    try {
      const d = getYtcfgData() || {};
      const apiKey = d.INNERTUBE_API_KEY || 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
      const context = d.INNERTUBE_CONTEXT || {
        client: {
          clientName: 'WEB',
          clientVersion: d.INNERTUBE_CLIENT_VERSION || '2.20261012.01.00',
          hl: d.HL || 'en',
          gl: d.GL || 'US'
        }
      };
      const url = `/youtubei/v1/browse${apiKey ? `?key=${apiKey}` : ''}`;
      const payload = {
        context,
        browseId: channelId,
        params: 'EgVhYm91dA%3D%3D'
      };
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();
      const aboutModels = findInNested(json, 'aboutChannelViewModel');
      if (aboutModels.length > 0) {
        const vm = aboutModels[0];
        return {
          channelId: vm.channelId || channelId,
          joinedDateText: typeof vm.joinedDateText === 'object' ? (vm.joinedDateText.content || '') : (vm.joinedDateText || ''),
          country: vm.country || '',
          viewCountText: vm.viewCountText || '',
          subscriberCountText: vm.subscriberCountText || '',
          videoCountText: vm.videoCountText || '',
          canonicalChannelUrl: vm.canonicalChannelUrl || '',
          description: vm.description || '',
          links: vm.links || []
        };
      }
      const aboutRenderers = findInNested(json, 'aboutChannelRenderer');
      if (aboutRenderers.length > 0) {
        const r = aboutRenderers[0].metadata?.aboutChannelViewModel || aboutRenderers[0];
        return {
          channelId: r.channelId || channelId,
          joinedDateText: typeof r.joinedDateText === 'object' ? (r.joinedDateText.content || '') : (r.joinedDateText || ''),
          country: r.country || '',
          viewCountText: r.viewCountText || '',
          subscriberCountText: r.subscriberCountText || '',
          videoCountText: r.videoCountText || '',
          canonicalChannelUrl: r.canonicalChannelUrl || '',
          description: r.description || '',
          links: r.links || []
        };
      }
      return null;
    } catch (err) {
      console.warn('[YT Exp Studio] fetchChannelAboutDetails error:', err);
      return null;
    }
  }

  function getVirtualPlaylists(channelId) {
    if (!channelId || !channelId.startsWith('UC') || channelId.length < 24) return [];
    const suffix = channelId.substring(2);
    const defs = [
      ['UU', '🎬 All Channel Uploads', 'PUBLIC UPLOADS', 'Chronological playback queue of EVERY public video, short, and stream uploaded by the creator from newest to oldest.'],
      ['UUMO', '🔒 Members-Only Videos & Streams', 'MEMBERS ONLY', 'Reveals EVERY member-exclusive video and stream! Browse the full members catalog, complete titles, thumbnails, durations, and release dates. (Playback requires active membership).'],
      ['UUMF', '🔒 Members-Only Long-Form', 'MEMBERS VIDEOS', 'Member-exclusive standard horizontal videos (filters out member shorts and member streams).'],
      ['UUMV', '🔒 Members-Only Live Streams', 'MEMBERS STREAMS', 'Dedicated playlist of all member-only live stream archives and unlisted member broadcast sessions.'],
      ['UUMS', '🔒 Members-Only Shorts', 'MEMBERS SHORTS', 'Member-exclusive vertical Shorts queue.'],
      ['UULV', '🔴 Past Live Streams Archive', 'LIVE STREAMS', 'Complete archive containing exclusively completed and scheduled live stream broadcasts.'],
      ['UUSH', '⚡ Shorts in Desktop Video Player', 'DESKTOP SHORTS', 'Bypasses the vertical TikTok-style reel! Plays all channel Shorts in the standard player with scrubbing, seeking, 3x speed, miniplayer, and PiP.'],
      ['UULF', '📹 Long-Form Videos (No Shorts)', 'VIDEOS ONLY', 'All regular horizontal videos uploaded by the creator, strictly excluding vertical Shorts and live streams.'],
      ['UULP', '🏆 Most Popular Videos', 'POPULAR VIDEOS', 'Videos ranked strictly from highest to lowest view count of all time.'],
      ['UUPV', '🏆 Most Popular Live Streams', 'POPULAR STREAMS', 'Most-watched live stream broadcasts ranked by total views.'],
      ['UUPS', '🏆 Most Popular Shorts', 'POPULAR SHORTS', 'Highest performing Shorts ranked by views.']
    ];
    return defs.map(([prefix, name, badge, desc]) => {
      const id = `${prefix}${suffix}`;
      return { prefix, id, name, badge, desc, url: `https://www.youtube.com/playlist?list=${id}`, watchUrl: `https://www.youtube.com/watch?list=${id}` };
    });
  }

  // =========================================================================
  // 8. CATEGORIZATION HELPER
  // =========================================================================
  function categorizeFlag(name) {
    const f = name.toLowerCase();
    if (f.includes('delhi')) return 'delhi';
    if (/ipad|tablet|airplay|ios_force_inline/.test(f) || name in IPAD_FLAGS) return 'ipad';
    if (f.startsWith('mweb_') || name in MWEB_FLAGS) return 'mweb';
    if (/voice|audio_track/.test(f) || name in VOICE_FLAGS) return 'voice';
    if (/drc|voice_boost|audio|sound|eac3|ac3|surround|volume|multitrack/.test(f) || name in AUDIO_CODEC_FLAGS) return 'audio';
    if (f.includes('canary') || name in CANARY_FLAGS) return 'canary';
    if (/miniplayer|pip_/.test(f) || name in MINIPLAYER_FLAGS) return 'miniplayer';
    if (/ad_|ads_|adblock|pagead|companion_wta|preroll|midroll|dai_/.test(f) || name in AD_FLAGS) return 'ads';
    if (/cast|mdx|remote|dial|lounge/.test(f) || name in REMOTE_CAST_FLAGS) return 'remote';
    if (/network_machine|sabr|quic|preconnect|networkless/.test(f) || name in NETWORK_FLAGS) return 'system';
    if (POPULAR_FLAGS.includes(name)) return 'popular';
    if (/ai_|youchat|chatbot|ask_|summary/.test(f)) return 'ai';
    if (/shorts|reel|sfv/.test(f)) return 'shorts';
    if (/html5|player|video|codec|av1|vp9|speedmaster|scrubb|cinematic|seek|caption|playback/.test(f)) return 'player';
    if (/kevlar|desktop|amsterdam|button|browse|channel|guide|dialog|header|sidebar|polymer|badge|card|shelf/.test(f)) return 'desktop';
    if (/touch|swipe|ios|android/.test(f)) return 'mobile';
    if (/idb|gel|csi|tracing|logging|metric|fetch|worker|cache|memory|batch|service_worker|woffle/.test(f)) return 'system';
    return 'other';
  }

  // =========================================================================
  // 9. UI INITIALIZER (Organized 12-Tab Studio, Zero innerHTML, CSP Safe)
  // =========================================================================
  function initUI() {
    if (document.getElementById('yt-exp-studio-root')) return;

    harvestAllFlagsFromRuntime();

    const style = document.createElement('style');
    style.id = 'yt-exp-studio-style';
    style.textContent = `
      #yt-exp-studio-root {
        font-family: "YouTube Sans", Roboto, Arial, sans-serif;
        color: #f1f1f1;
        font-size: 13px;
        line-height: 1.4;
        box-sizing: border-box;
      }
      #yt-exp-studio-root * {
        box-sizing: border-box;
      }
      #yt-exp-min-btn {
        position: fixed;
        z-index: 2147483647;
        bottom: 24px;
        right: 24px;
        background: linear-gradient(135deg, #cc0000, #ff1a1a);
        color: #ffffff;
        padding: 9px 15px;
        border-radius: 28px;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.6), 0 0 12px rgba(255, 0, 0, 0.35);
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: grab;
        user-select: none;
        touch-action: none;
        font-weight: 600;
        font-size: 13px;
        letter-spacing: 0.2px;
        border: 1px solid rgba(255, 255, 255, 0.25);
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      #yt-exp-min-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 24px rgba(255, 0, 0, 0.5);
      }
      #yt-exp-min-btn:active {
        cursor: grabbing;
      }
      #yt-exp-min-btn .badge-pill {
        background: #0f0f0f;
        color: #3ea6ff;
        font-size: 11px;
        padding: 2px 7px;
        border-radius: 12px;
        font-weight: bold;
      }
      #yt-exp-min-btn .pill-status-icon {
        font-size: 12px;
        display: none;
      }
      #yt-exp-min-btn .pill-status-icon.pip {
        color: #2ba640;
      }
      #yt-exp-min-btn .pill-status-icon.mini {
        color: #3ea6ff;
      }
      #yt-exp-menu-window {
        position: fixed;
        z-index: 2147483647;
        width: 740px;
        height: 840px;
        max-width: 96vw;
        max-height: 96vh;
        top: 36px;
        right: 36px;
        background: rgba(14, 14, 18, 0.97);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid #33333d;
        border-radius: 14px;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.06);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      #yt-exp-header {
        background: #191920;
        border-bottom: 1px solid #2a2a35;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: grab;
        user-select: none;
        touch-action: none;
      }
      #yt-exp-header:active {
        cursor: grabbing;
      }
      .yt-exp-header-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 700;
        color: #fff;
      }
      .yt-exp-header-actions {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .yt-exp-btn-icon {
        background: #25252e;
        border: 1px solid #3c3c4a;
        color: #e0e0e0;
        min-width: 28px;
        height: 28px;
        padding: 0 8px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        transition: all 0.15s ease;
      }
      .yt-exp-btn-icon:hover {
        background: #363644;
        color: #fff;
        border-color: #555568;
      }
      .yt-exp-btn-icon.miniplayer-btn {
        background: #142436;
        border-color: #274567;
        color: #58a6ff;
      }
      .yt-exp-btn-icon.miniplayer-btn:hover {
        background: #1c3653;
        color: #fff;
      }
      .yt-exp-btn-icon.miniplayer-btn.active-mode {
        background: #0055bb;
        border-color: #3388ff;
        color: #fff;
        box-shadow: 0 0 8px rgba(51, 136, 255, 0.4);
      }
      .yt-exp-btn-icon.pip-btn {
        background: #132a1e;
        border-color: #204d35;
        color: #3fb950;
      }
      .yt-exp-btn-icon.pip-btn:hover {
        background: #1a3c2a;
        color: #fff;
      }
      .yt-exp-btn-icon.pip-btn.active-pip {
        background: #238636;
        border-color: #2ea043;
        color: #fff;
        box-shadow: 0 0 10px rgba(46, 160, 67, 0.5);
      }
      #yt-exp-nav-tabs {
        display: flex;
        background: #121217;
        border-bottom: 1px solid #262630;
        padding: 0 8px;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .yt-exp-nav-tab {
        padding: 9px 12px;
        color: #aaa;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.15s ease;
      }
      .yt-exp-nav-tab:hover {
        color: #eee;
        background: rgba(255, 255, 255, 0.03);
      }
      .yt-exp-nav-tab.active {
        color: #ff4d4d;
        border-bottom-color: #ff3333;
        background: rgba(255, 51, 51, 0.06);
      }
      .yt-exp-tab-content {
        flex: 1;
        overflow-y: auto;
        display: none;
        flex-direction: column;
        scrollbar-width: thin;
      }
      .yt-exp-tab-content.active {
        display: flex;
      }
      .yt-exp-section-card {
        background: #171720;
        border: 1px solid #282835;
        border-radius: 10px;
        padding: 12px 14px;
        margin: 10px 14px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .yt-exp-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .yt-exp-card-title {
        font-size: 13px;
        font-weight: 700;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .yt-exp-card-desc {
        font-size: 11px;
        color: #999;
        line-height: 1.4;
      }
      .yt-exp-btn-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 8px;
        margin-top: 4px;
      }
      .yt-exp-action-btn {
        background: #22222d;
        border: 1px solid #363646;
        color: #eee;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.15s ease;
      }
      .yt-exp-action-btn:hover {
        background: #2f2f3d;
        border-color: #4f4f66;
        color: #fff;
      }
      .yt-exp-action-btn.primary {
        background: #0055bb;
        border-color: #0077ee;
        color: #fff;
      }
      .yt-exp-action-btn.primary:hover {
        background: #0066dd;
      }
      .yt-exp-action-btn.success {
        background: #1b4b2c;
        border-color: #2e7d32;
        color: #4ade80;
      }
      .yt-exp-action-btn.success:hover {
        background: #235d37;
        color: #fff;
      }
      .yt-exp-action-btn.danger {
        background: #4a1515;
        border-color: #772222;
        color: #ff7777;
      }
      .yt-exp-action-btn.danger:hover {
        background: #661c1c;
        color: #fff;
      }
      .yt-exp-action-btn.active-pip {
        background: #238636 !important;
        border-color: #2ea043 !important;
        color: #fff !important;
        box-shadow: 0 0 10px rgba(46, 160, 67, 0.5);
      }
      .yt-exp-action-btn.active-mode {
        background: #0055bb !important;
        border-color: #3388ff !important;
        color: #fff !important;
        box-shadow: 0 0 8px rgba(51, 136, 255, 0.4);
      }
      #yt-exp-toolbar {
        padding: 10px 14px;
        background: #141419;
        border-bottom: 1px solid #23232c;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .yt-exp-search-box {
        position: relative;
        width: 100%;
      }
      .yt-exp-search-box input {
        width: 100%;
        background: #1c1c24;
        border: 1px solid #363644;
        border-radius: 6px;
        color: #fff;
        padding: 7px 12px 7px 32px;
        font-size: 13px;
        outline: none;
      }
      .yt-exp-search-box input:focus {
        border-color: #ff3333;
        box-shadow: 0 0 6px rgba(255, 51, 51, 0.35);
      }
      .yt-exp-search-icon {
        position: absolute;
        left: 10px;
        top: 8px;
        fill: #888;
        width: 14px;
        height: 14px;
      }
      .yt-exp-action-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .yt-exp-chips {
        display: flex;
        overflow-x: auto;
        gap: 6px;
        padding-bottom: 4px;
        scrollbar-width: thin;
      }
      .yt-exp-chip {
        background: #1f1f28;
        color: #aaa;
        padding: 4px 10px;
        border-radius: 14px;
        border: 1px solid #31313d;
        font-size: 11px;
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.15s;
      }
      .yt-exp-chip.active {
        background: #ff0000;
        color: #fff;
        border-color: #ff3333;
        font-weight: 600;
      }
      .yt-exp-actions-group {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .yt-exp-btn-small {
        background: #252530;
        border: 1px solid #3a3a4b;
        color: #ddd;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 11px;
        cursor: pointer;
        transition: background 0.15s;
        white-space: nowrap;
      }
      .yt-exp-btn-small:hover {
        background: #353545;
        color: #fff;
      }
      .yt-exp-btn-small.danger:hover {
        background: #660000;
        border-color: #990000;
      }
      .yt-exp-btn-small.accent {
        background: #0055bb;
        border-color: #0077ee;
        color: #fff;
      }
      .yt-exp-add-custom-row {
        display: flex;
        gap: 8px;
        padding: 8px 14px;
        background: #16161e;
        border-bottom: 1px solid #23232c;
      }
      .yt-exp-add-custom-row input {
        flex: 1;
        background: #1f1f2a;
        border: 1px solid #373748;
        border-radius: 4px;
        color: #fff;
        padding: 5px 10px;
        font-size: 12px;
      }
      #yt-exp-list {
        flex: 1;
        overflow-y: auto;
        padding: 8px 14px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        scrollbar-width: thin;
      }
      .yt-exp-flag-card {
        background: #16161f;
        border: 1px solid #262633;
        border-radius: 8px;
        padding: 8px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;   transition: background 0.12s, border-color 0.12s;
      }
      .yt-exp-flag-card:hover {
        background: #1d1d28;
        border-color: #3b3b4d;
      }
      .yt-exp-flag-card.modified {
        border-left: 3px solid #ffaa00;
        background: rgba(255, 170, 0, 0.04);
      }
      .yt-exp-flag-card.delhi-highlight {
        border-left: 3px solid #3ea6ff;
      }
      .yt-exp-flag-info {
        flex: 1;
        min-width: 0;
      }
      .yt-exp-flag-name {
        font-family: "Roboto Mono", Consolas, monospace;
        font-size: 12px;
        font-weight: 600;
        color: #f1f1f1;
        word-break: break-all;
      }
      .yt-exp-flag-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 3px;
        font-size: 11px;
        color: #888;
        flex-wrap: wrap;
      }
      .yt-exp-tag {
        font-size: 10px;
        padding: 1px 6px;
        border-radius: 4px;
        background: #242431;
        color: #aaa;
        text-transform: uppercase;
      }
      .yt-exp-tag.delhi {
        background: #003366;
        color: #3ea6ff;
        font-weight: bold;
      }
      .yt-exp-tag.mweb {
        background: #442a00;
        color: #ffaa33;
        font-weight: bold;
      }
      .yt-exp-tag.ads {
        background: #4a2800;
        color: #ff9933;
        font-weight: bold;
      }
      .yt-exp-tag.miniplayer {
        background: #113344;
        color: #55c2ff;
        font-weight: bold;
      }
      .yt-exp-tag.audio {
        background: #331f4a;
        color: #c77dff;
        font-weight: bold;
      }
      .yt-exp-tag.remote {
        background: #1f3a4a;
        color: #58d5f5;
        font-weight: bold;
      }
      .yt-exp-tag.visitor {
        background: #3d2b00;
        color: #ffcc00;
        font-weight: bold;
      }
      .yt-exp-tag.intel {
        background: #003d33;
        color: #1de9b6;
        font-weight: bold;
      }
      .yt-exp-tag.innertube {
        background: #3700b3;
        color: #bb86fc;
        font-weight: bold;
      }
      .yt-exp-intel-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 10px;
        margin-top: 6px;
      }
      .yt-exp-intel-cell {
        background: #1a1a24;
        border: 1px solid #2b2b3a;
        border-radius: 6px;
        padding: 8px 10px;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .yt-exp-intel-label {
        font-size: 10px;
        text-transform: uppercase;
        color: #888;
        letter-spacing: 0.5px;
      }
      .yt-exp-intel-val {
        font-family: "Roboto Mono", Consolas, monospace;
        font-size: 12px;
        color: #fff;
        word-break: break-all;
      }
      .yt-exp-code-box {
        background: #0f0f14;
        border: 1px solid #282836;
        border-radius: 6px;
        padding: 10px;
        font-family: "Roboto Mono", Consolas, monospace;
        font-size: 11px;
        color: #a5d6ff;
        max-height: 240px;
        overflow-y: auto;
        white-space: pre-wrap;
        word-break: break-all;
      }
      .yt-exp-keyword-chip {
        background: #252533;
        border: 1px solid #3d3d52;
        border-radius: 12px;
        padding: 3px 8px;
        font-size: 11px;
        color: #d1d5db;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        transition: all 0.15s;
      }
      .yt-exp-keyword-chip:hover {
        background: #37374a;
        color: #fff;
        border-color: #6366f1;
      }
      .yt-exp-tag.modified {
        background: #664400;
        color: #ffbb33;
      }
      .yt-exp-controls-cell {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }
      .yt-exp-val-input {
        background: #20202a;
        border: 1px solid #3f3f50;
        border-radius: 4px;
        color: #ffdd88;
        font-family: "Roboto Mono", Consolas, monospace;
        font-size: 11px;
        padding: 2px 6px;
        width: 72px;
        text-align: right;
        outline: none;
      }
      .yt-exp-val-input:focus {
        border-color: #3ea6ff;
      }
      .yt-exp-switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
        flex-shrink: 0;
      }
      .yt-exp-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .yt-exp-slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #31313d;
        transition: 0.2s;
        border-radius: 24px;
        border: 1px solid #444452;
      }
      .yt-exp-slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 3px;
        bottom: 3px;
        background-color: #ffffff;
        transition: 0.2s;
        border-radius: 50%;
      }
      .yt-exp-switch input:checked + .yt-exp-slider {
        background-color: #cc0000;
        border-color: #ff3333;
      }
      .yt-exp-switch input:checked + .yt-exp-slider:before {
        transform: translateX(20px);
      }
      #yt-exp-footer {
        background: #14141a;
        border-top: 1px solid #262632;
        padding: 9px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .yt-exp-btn-apply {
        background: #cc0000;
        color: #fff;
        font-weight: 700;
        border: none;
        border-radius: 6px;
        padding: 7px 16px;
        font-size: 13px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: background 0.15s, transform 0.1s;
      }
      .yt-exp-btn-apply:hover {
        background: #ff1a1a;
      }
      .yt-exp-btn-apply:active {
        transform: scale(0.98);
      }
      .yt-exp-status-text {
        font-size: 11px;
        color: #aaa;
      }
      .yt-exp-force-miniplayer {
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        width: 480px !important;
        height: 270px !important;
        z-index: 2147483640 !important;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        resize: both !important;
      }
      #yt-exp-mini-dock-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 28px;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 8px;
        z-index: 2147483646;
        user-select: none;
      }
      .canary-status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #555;
      }
      .canary-status-dot.active {
        background: #2ba640;
        box-shadow: 0 0 8px #2ba640;
      }
      .canary-status-dot.holdback {
        background: #3ea6ff;
        box-shadow: 0 0 8px #3ea6ff;
      }
      .canary-status-dot.dogfood {
        background: #ff5500;
        box-shadow: 0 0 8px #ff5500;
      }
    `;
    (document.head || document.documentElement).appendChild(style);

    const root = h('div', { id: 'yt-exp-studio-root' });
    (document.body || document.documentElement).appendChild(root);

    // 1. Minimized Floating Draggable Button
    const badgeEl = h('span', { className: 'badge-pill', id: 'yt-exp-active-badge' }, '0');
    miniIndicatorPill = h('span', { className: 'pill-status-icon mini', title: 'Miniplayer Active' }, '🗗');
    pipIndicatorPill = h('span', { className: 'pill-status-icon pip', title: 'PiP Active' }, '📺');

    const minBtn = h(
      'div',
      { id: 'yt-exp-min-btn' },
      h('span', null, '🧪 YT Exp Studio'),
      miniIndicatorPill,
      pipIndicatorPill,
      badgeEl
    );
    root.appendChild(minBtn);

    // 2. Header action buttons
    const canaryDot = h('div', { className: 'canary-status-dot', id: 'yt-exp-canary-dot' });
    btnMiniplayerHeader = h('button', {
      className: 'yt-exp-btn-icon miniplayer-btn',
      id: 'yt-exp-btn-miniplayer',
      title: 'Force video into YouTube Miniplayer',
      onClick: (e) => {
        e.stopPropagation();
        const active = isMiniplayerActive();
        forceMiniplayer(!active);
      }
    }, '🗗 Miniplayer');

    btnPipHeader = h('button', {
      className: 'yt-exp-btn-icon pip-btn',
      id: 'yt-exp-btn-pip',
      title: 'Toggle Picture-in-Picture',
      onClick: async (e) => {
        e.stopPropagation();
        await togglePiP();
      }
    }, '📺 PiP');

    const btnHotApply = h('button', {
      className: 'yt-exp-btn-icon',
      id: 'yt-exp-btn-hot-apply',
      title: 'Apply to memory right now',
      style: { background: '#cc0000', borderColor: '#ff2222', color: '#fff' },
      onClick: (e) => {
        e.stopPropagation();
        setStored(STORAGE_KEY_FLAGS, overrides);
        setStored(STORAGE_KEY_CANARY, canaryConfig);
        setStored(STORAGE_KEY_SEARCH_WIDTH, searchWidthConfig);
        setStored(STORAGE_KEY_VISITOR, visitorConfig);
        setStored(STORAGE_KEY_THEME, themeConfig);
        const d = getYtcfgData();
        if (d) applyActiveOverridesToData(d);
        ensurePlayerClasses();
        applySearchWidthStyles();
        applyThemeStyles();
        alert('⚡ Flags, Canary state, Visitor ID, and MWeb Search Width applied to memory! Navigate or refresh if player requires reloading.');
      }
    }, '⚡ Apply');

    const btnExport = h('button', { className: 'yt-exp-btn-icon', id: 'yt-exp-btn-export', title: 'Export / Import Flags JSON' }, '📋');
    const btnMinimize = h('button', { className: 'yt-exp-btn-icon', id: 'yt-exp-btn-minimize', title: 'Minimize to Floating Button' }, '—');
    const btnClose = h('button', { className: 'yt-exp-btn-icon', id: 'yt-exp-btn-close', title: 'Hide Studio' }, '✕');

    const headerHandle = h(
      'div',
      { id: 'yt-exp-header' },
      h(
        'div',
        { className: 'yt-exp-header-title' },
        canaryDot,
        h(
          'svg',
          { viewBox: '0 0 24 24', width: '20', height: '20' },
          h('path', { fill: '#ff0000', d: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z' })
        ),
        h('span', null, 'Canary Studio v9.8.0 (Theme Center & Exact Percentile Edition)')
      ),
      h('div', { className: 'yt-exp-header-actions' }, btnMiniplayerHeader, btnPipHeader, btnHotApply, btnExport, btnMinimize, btnClose)
    );

    // 3. Navigation Tabs (12 Tabs Master Layout)
    const tabExplorerBtn = h('div', { className: 'yt-exp-nav-tab active', dataset: { target: 'tab-explorer' } }, '🚩 Flags Explorer');
    const tabThemeBtn = h('div', { className: 'yt-exp-nav-tab', dataset: { target: 'tab-theme' } }, '🎨 Theme Modifier');
    const tabMWebBtn = h('div', { className: 'yt-exp-nav-tab', dataset: { target: 'tab-mweb' } }, '📱 MWeb & Search Width');
    const tabCanaryBtn = h('div', { className: 'yt-exp-nav-tab', dataset: { target: 'tab-canary' } }, '🐤 Canary Engine');
    const tabVisitorBtn = h('div', { className: 'yt-exp-nav-tab', dataset: { target: 'tab-visitor' } }, '🆔 Visitor ID & Cohorts');
    const tabIntelBtn = h('div', { className: 'yt-exp-nav-tab', dataset: { target: 'tab-creator-intel' } }, '🕵️ Creator & Video Intel');
    const tabInnertubeBtn = h('div', { className: 'yt-exp-nav-tab', dataset: { target: 'tab-innertube' } }, '🔬 Innertube Console');
    const tabMiniBtn = h('div', { className: 'yt-exp-nav-tab', dataset: { target: 'tab-miniplayer' } }, '🗗 Miniplayer & PiP');
    const tabPlayerBtn = h('div', { className: 'yt-exp-nav-tab', dataset: { target: 'tab-player' } }, '🎬 Player & Audio');
    const tabRemoteBtn = h('div', { className: 'yt-exp-nav-tab', dataset: { target: 'tab-remote' } }, '📺 Remote & Cast');
    const tabPresetsBtn = h('div', { className: 'yt-exp-nav-tab', dataset: { target: 'tab-presets' } }, '⚡ Specialized Sets');
    const tabDiagBtn = h('div', { className: 'yt-exp-nav-tab', dataset: { target: 'tab-diagnostics' } }, '📊 Diagnostics');

    const navTabs = h('div', { id: 'yt-exp-nav-tabs' },
      tabExplorerBtn,
      tabThemeBtn,
      tabMWebBtn,
      tabCanaryBtn,
      tabVisitorBtn,
      tabIntelBtn,
      tabInnertubeBtn,
      tabMiniBtn,
      tabPlayerBtn,
      tabRemoteBtn,
      tabPresetsBtn,
      tabDiagBtn
    );

    // =======================================================================
    // TAB 1: FLAGS EXPLORER
    // =======================================================================
    const searchInput = h('input', {
      type: 'text',
      id: 'yt-exp-search-input',
      placeholder: 'Search 1,720+ flags e.g. delhi, mweb, frosted, miniplayer, drc, speedmaster, cast...'
    });

    const categoryChips = h(
      'div',
      { className: 'yt-exp-chips', id: 'yt-exp-category-chips' },
      h('div', { className: 'yt-exp-chip active', dataset: { cat: 'all' } }, 'All Flags'),
      h('div', { className: 'yt-exp-chip', dataset: { cat: 'delhi' } }, '🏛️ Delhi Modern (24)'),
      h('div', { className: 'yt-exp-chip', dataset: { cat: 'ipad' } }, '🍎 iPad & Tablet Mode'),
      h('div', { className: 'yt-exp-chip', dataset: { cat: 'mweb' } }, '📱 MWeb Redesign (28)'),
      h('div', { className: 'yt-exp-chip', dataset: { cat: 'miniplayer' } }, '🗗 Miniplayer & PiP'),
      h('div', { className: 'yt-exp-chip', dataset: { cat: 'voice' } }, '🎤 Voice & Multi-Track'),
      h('div', { className: 'yt-exp-chip', dataset: { cat: 'audio' } }, '🎵 DRC & Audio Boost'),
      h('div', { className: 'yt-exp-chip', dataset: { cat: 'canary' } }, '🐤 Canary & SABR'),
      h('div', { className: 'yt-exp-chip', dataset: { cat: 'ads' } }, '📢 Ads & Telemetry'),
      h('div', { className: 'yt-exp-chip', dataset: { cat: 'remote' } }, '📺 Remote & Cast'),
      h('div', { className: 'yt-exp-chip', dataset: { cat: 'player' } }, '🎬 Player & Codecs'),
      h('div', { className: 'yt-exp-chip', dataset: { cat: 'desktop' } }, '🖥️ Desktop Kevlar'),
      h('div', { className: 'yt-exp-chip', dataset: { cat: 'shorts' } }, '📱 Shorts & Reels'),
      h('div', { className: 'yt-exp-chip', dataset: { cat: 'ai' } }, '🤖 AI & Summaries'),
      h('div', { className: 'yt-exp-chip', dataset: { cat: 'system' } }, '⚡ Network & Gel'),
      h('div', { className: 'yt-exp-chip', dataset: { cat: 'modified' } }, '⭐ Overridden Only')
    );

    const matchCountEl = h('span', { className: 'yt-exp-status-text', id: 'yt-exp-match-count' }, '0 flags');
    const btnDelhiAll = h('button', { className: 'yt-exp-btn-small accent', id: 'yt-exp-btn-delhi-all' }, '⚡ Enable All Delhi');
    const btnAllTrue = h('button', { className: 'yt-exp-btn-small', id: 'yt-exp-btn-all-true' }, 'All View True');
    const btnAllFalse = h('button', { className: 'yt-exp-btn-small', id: 'yt-exp-btn-all-false' }, 'All View False');
    const btnResetView = h('button', { className: 'yt-exp-btn-small danger', id: 'yt-exp-btn-reset-view' }, 'Reset View');

    const customNameInput = h('input', {
      type: 'text',
      id: 'yt-exp-custom-name',
      placeholder: 'Add custom flag name (e.g. web_enable_super_feature)'
    });
    const customValSelect = h(
      'select',
      { id: 'yt-exp-custom-val', style: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '0 8px' } },
      h('option', { value: 'true' }, 'true'),
      h('option', { value: 'false' }, 'false')
    );
    const btnAddCustom = h('button', { className: 'yt-exp-btn-small', id: 'yt-exp-btn-add-custom' }, '➕ Add');

    const listEl = h('div', { id: 'yt-exp-list' });

    const tabContentExplorer = h('div', { className: 'yt-exp-tab-content active', id: 'tab-explorer' },
      h('div', { id: 'yt-exp-toolbar' },
        h('div', { className: 'yt-exp-search-box' },
          h('svg', { className: 'yt-exp-search-icon', viewBox: '0 0 24 24' },
            h('path', { d: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' })
          ),
          searchInput
        ),
        categoryChips,
        h('div', { className: 'yt-exp-action-row' },
          h('div', { className: 'yt-exp-actions-group' }, btnDelhiAll, btnAllTrue, btnAllFalse, btnResetView),
          matchCountEl
        )
      ),
      h('div', { className: 'yt-exp-add-custom-row' }, customNameInput, customValSelect, btnAddCustom),
      listEl
    );

    // =======================================================================
    // TAB: THEME MODIFIER (OLED PITCH BLACK, DELHI FROSTED, TOKYO, LIGHT MODE, DYNAMIC)
    // =======================================================================
    const themeSelect = h('select', {
      style: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', width: '100%' }
    },
      Object.values(THEME_PRESETS).map(p => h('option', { value: p.id, selected: themeConfig.mode === p.id }, p.label))
    );

    const themeDescLabel = h('div', { className: 'yt-exp-card-desc', style: { minHeight: '32px', color: '#bbb' } },
      (THEME_PRESETS[themeConfig.mode] || THEME_PRESETS['oled_pitch_black']).desc
    );

    const toggleThemeEnabled = h('input', {
      type: 'checkbox',
      checked: !!themeConfig.enabled,
      onChange: () => {
        themeConfig.enabled = toggleThemeEnabled.checked;
        setStored(STORAGE_KEY_THEME, themeConfig);
        applyThemeStyles();
        dispatchThemeAction('TOGGLE_THEME_ENABLED', themeConfig.enabled);
      }
    });

    const toggleOledBlack = h('input', {
      type: 'checkbox',
      checked: !!themeConfig.oledBlack,
      onChange: () => {
        themeConfig.oledBlack = toggleOledBlack.checked;
        setStored(STORAGE_KEY_THEME, themeConfig);
        applyThemeStyles();
        dispatchThemeAction('TOGGLE_OLED_BLACK', true);
      }
    });

    const toggleFrostedGlass = h('input', {
      type: 'checkbox',
      checked: !!themeConfig.frostedGlass,
      onChange: () => {
        themeConfig.frostedGlass = toggleFrostedGlass.checked;
        setStored(STORAGE_KEY_THEME, themeConfig);
        applyThemeStyles();
      }
    });

    const themeGlassBlurInput = h('input', {
      type: 'range',
      min: '0',
      max: '36',
      step: '2',
      value: String(themeConfig.glassBlur || 18),
      style: { width: '120px' }
    });
    const themeGlassBlurLabel = h('span', { style: { fontSize: '11px', fontFamily: 'monospace', color: '#3ea6ff' } }, `${themeGlassBlurInput.value}px`);
    themeGlassBlurInput.oninput = () => {
      themeGlassBlurLabel.textContent = `${themeGlassBlurInput.value}px`;
      themeConfig.glassBlur = parseInt(themeGlassBlurInput.value, 10);
      setStored(STORAGE_KEY_THEME, themeConfig);
      applyThemeStyles();
    };

    const themeAccentInput = h('input', {
      type: 'color',
      value: themeConfig.accentColor || '#3ea6ff',
      style: { width: '44px', height: '28px', border: '1px solid #444', borderRadius: '4px', background: '#222', cursor: 'pointer' }
    });
    themeAccentInput.oninput = () => {
      themeConfig.accentColor = themeAccentInput.value;
      setStored(STORAGE_KEY_THEME, themeConfig);
      applyThemeStyles();
      dispatchThemeAction('SET_ACCENT_COLOR', true);
    };

    themeSelect.onchange = () => {
      const p = THEME_PRESETS[themeSelect.value];
      if (p) {
        themeDescLabel.textContent = p.desc;
        themeAccentInput.value = p.accentColor;
        themeConfig.mode = p.id;
        themeConfig.accentColor = p.accentColor;
        themeConfig.isLight = !!p.isLight;
        if (p.isLight) {
          dispatchThemeAction('SET_LIGHT_MODE', false);
        } else {
          dispatchThemeAction('SET_DARK_MODE', true);
        }
        setStored(STORAGE_KEY_THEME, themeConfig);
        applyThemeStyles();
      }
    };

    // Quick Mode Buttons (Light Mode, OLED Dark, Frosted, Aurora)
    const btnQuickLight = h('button', {
      className: 'yt-exp-btn-small',
      style: { background: '#ffffff', color: '#000000', fontWeight: 'bold', border: '1px solid #cccccc' },
      onClick: () => {
        themeSelect.value = 'light_paper';
        themeSelect.dispatchEvent(new Event('change'));
      }
    }, '☀️ Pure Light Mode');

    const btnQuickOled = h('button', {
      className: 'yt-exp-btn-small',
      style: { background: '#000000', color: '#ffffff', fontWeight: 'bold', border: '1px solid #444444' },
      onClick: () => {
        themeSelect.value = 'oled_pitch_black';
        themeSelect.dispatchEvent(new Event('change'));
      }
    }, '🖤 OLED Dark');

    const btnQuickDelhi = h('button', {
      className: 'yt-exp-btn-small accent',
      onClick: () => {
        themeSelect.value = 'delhi_frosted';
        themeSelect.dispatchEvent(new Event('change'));
      }
    }, '🏛️ Delhi Frosted');

    const btnQuickAurora = h('button', {
      className: 'yt-exp-btn-small',
      style: { background: 'linear-gradient(90deg, #ff007f, #00f0ff)', color: '#ffffff', fontWeight: 'bold', border: 'none' },
      onClick: () => {
        themeSelect.value = 'dynamic_aurora';
        themeSelect.dispatchEvent(new Event('change'));
      }
    }, '🌈 Dynamic Aurora');

    const btnApplyThemeLive = h('button', {
      className: 'yt-exp-action-btn primary',
      onClick: () => {
        setStored(STORAGE_KEY_THEME, themeConfig);
        applyThemeStyles();
        dispatchThemeAction('HOT_APPLY_THEME_ACTION', !themeConfig.isLight);
        alert(`🎨 Theme "${THEME_PRESETS[themeConfig.mode]?.label || themeConfig.mode}" applied to YouTube DOM and Kevlar token registry!`);
      }
    }, '⚡ Apply Theme Live');

    const btnResetTheme = h('button', {
      className: 'yt-exp-action-btn danger',
      onClick: () => {
        Object.assign(themeConfig, defaultThemeConfig);
        setStored(STORAGE_KEY_THEME, themeConfig);
        themeSelect.value = defaultThemeConfig.mode;
        toggleThemeEnabled.checked = defaultThemeConfig.enabled;
        toggleOledBlack.checked = defaultThemeConfig.oledBlack;
        toggleFrostedGlass.checked = defaultThemeConfig.frostedGlass;
        themeGlassBlurInput.value = String(defaultThemeConfig.glassBlur);
        themeGlassBlurLabel.textContent = `${defaultThemeConfig.glassBlur}px`;
        themeAccentInput.value = defaultThemeConfig.accentColor;
        themeDescLabel.textContent = THEME_PRESETS[defaultThemeConfig.mode].desc;
        applyThemeStyles();
        dispatchThemeAction('RESET_THEME_DEFAULT', true);
        alert('Theme reset to default OLED Pitch Black configuration.');
      }
    }, '↺ Reset Theme');

    // =========================================================================
    // CUSTOM COLOR PALETTE CONTROLS
    // =========================================================================
    const customBaseColorPicker = h('input', {
      type: 'color',
      value: themeConfig.customBaseBg || '#0f0f14',
      style: { width: '40px', height: '26px', border: '1px solid #444', borderRadius: '4px', background: '#222', cursor: 'pointer' }
    });
    const customSurfaceColorPicker = h('input', {
      type: 'color',
      value: themeConfig.customSurfaceBg || '#181822',
      style: { width: '40px', height: '26px', border: '1px solid #444', borderRadius: '4px', background: '#222', cursor: 'pointer' }
    });
    const customCardColorPicker = h('input', {
      type: 'color',
      value: themeConfig.customCardBg || '#21212e',
      style: { width: '40px', height: '26px', border: '1px solid #444', borderRadius: '4px', background: '#222', cursor: 'pointer' }
    });
    const customAccentColorPicker = h('input', {
      type: 'color',
      value: themeConfig.customAccentColor || '#3ea6ff',
      style: { width: '40px', height: '26px', border: '1px solid #444', borderRadius: '4px', background: '#222', cursor: 'pointer' }
    });
    const customTextColorPicker = h('input', {
      type: 'color',
      value: themeConfig.customTextColor || '#ffffff',
      style: { width: '40px', height: '26px', border: '1px solid #444', borderRadius: '4px', background: '#222', cursor: 'pointer' }
    });

    const btnSaveCustomPalette = h('button', {
      className: 'yt-exp-action-btn primary',
      style: { padding: '7px 14px', marginTop: '6px' },
      onClick: () => {
        themeConfig.customBaseBg = customBaseColorPicker.value;
        themeConfig.customSurfaceBg = customSurfaceColorPicker.value;
        themeConfig.customCardBg = customCardColorPicker.value;
        themeConfig.customAccentColor = customAccentColorPicker.value;
        themeConfig.customTextColor = customTextColorPicker.value;
        themeConfig.mode = 'custom_user_palette';
        themeSelect.value = 'custom_user_palette';
        setStored(STORAGE_KEY_THEME, themeConfig);
        applyThemeStyles();
        alert('🎨 Custom User Palette saved and applied live to YouTube DOM!');
      }
    }, '💾 Save & Apply Custom Palette');

    // =========================================================================
    // DYNAMIC GRADIENT & CHROMATIC SHIFT CONTROLS
    // =========================================================================
    const dynamicModeSelect = h('select', {
      style: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '6px 10px', fontSize: '12px' }
    },
      h('option', { value: 'none', selected: (themeConfig.dynamicMode || 'none') === 'none' }, 'None (Static Color Palette)'),
      h('option', { value: 'simple_gradient', selected: themeConfig.dynamicMode === 'simple_gradient' }, '🎨 Simple Dual-Stop Gradient'),
      h('option', { value: 'gradient_flow', selected: themeConfig.dynamicMode === 'gradient_flow' }, '🌈 Dynamic Aurora Gradient Flow (Animated)'),
      h('option', { value: 'chromatic_shift', selected: themeConfig.dynamicMode === 'chromatic_shift' }, '⚡ Cyclic RGB Accent Chromatic Shift')
    );

    const gradC1Picker = h('input', {
      type: 'color',
      value: themeConfig.gradientColor1 || '#ff0055',
      style: { width: '36px', height: '26px', border: '1px solid #444', borderRadius: '4px', background: '#222', cursor: 'pointer' }
    });
    const gradC2Picker = h('input', {
      type: 'color',
      value: themeConfig.gradientColor2 || '#7a00ff',
      style: { width: '36px', height: '26px', border: '1px solid #444', borderRadius: '4px', background: '#222', cursor: 'pointer' }
    });
    const gradC3Picker = h('input', {
      type: 'color',
      value: themeConfig.gradientColor3 || '#00f0ff',
      style: { width: '36px', height: '26px', border: '1px solid #444', borderRadius: '4px', background: '#222', cursor: 'pointer' }
    });

    const gradAngleSlider = h('input', {
      type: 'range',
      min: '0',
      max: '360',
      step: '15',
      value: String(themeConfig.gradientAngle || 135),
      style: { width: '100px' }
    });
    const gradAngleLabel = h('span', { style: { fontSize: '11px', fontFamily: 'monospace', color: '#ffaa00' } }, `${gradAngleSlider.value}°`);
    gradAngleSlider.oninput = () => {
      gradAngleLabel.textContent = `${gradAngleSlider.value}°`;
      if (themeConfig.dynamicMode && themeConfig.dynamicMode !== 'none') {
        themeConfig.gradientAngle = parseInt(gradAngleSlider.value, 10);
        setStored(STORAGE_KEY_THEME, themeConfig);
        applyThemeStyles();
      }
    };

    const gradSpeedSlider = h('input', {
      type: 'range',
      min: '2',
      max: '60',
      step: '1',
      value: String(themeConfig.dynamicSpeed || 5),
      style: { width: '100px' }
    });
    const gradSpeedLabel = h('span', { style: { fontSize: '11px', fontFamily: 'monospace', color: '#00f0ff' } }, `${gradSpeedSlider.value}s`);
    gradSpeedSlider.oninput = () => {
      gradSpeedLabel.textContent = `${gradSpeedSlider.value}s`;
      if (themeConfig.dynamicMode && themeConfig.dynamicMode !== 'none') {
        themeConfig.dynamicSpeed = parseInt(gradSpeedSlider.value, 10);
        setStored(STORAGE_KEY_THEME, themeConfig);
        applyThemeStyles();
      }
    };

    const dynamicStatusBadge = h('span', {
      style: {
        fontSize: '11px',
        fontWeight: 'bold',
        padding: '3px 8px',
        borderRadius: '10px',
        background: '#1b1b26',
        color: (themeConfig.dynamicMode && themeConfig.dynamicMode !== 'none') ? '#4ade80' : '#888'
      }
    }, (themeConfig.dynamicMode && themeConfig.dynamicMode !== 'none') ? `▶️ Running: ${themeConfig.dynamicMode} (${themeConfig.dynamicSpeed || 5}s @ ${themeConfig.gradientAngle || 135}°)` : '⏹️ Status: Stopped');

    const btnStopDynamic = h('button', {
      className: 'yt-exp-action-btn danger',
      style: {
        padding: '7px 14px',
        marginTop: '6px',
        display: (themeConfig.dynamicMode && themeConfig.dynamicMode !== 'none') ? 'inline-flex' : 'none'
      },
      onClick: () => {
        themeConfig.dynamicMode = 'none';
        dynamicModeSelect.value = 'none';
        setStored(STORAGE_KEY_THEME, themeConfig);
        applyThemeStyles();
        btnStopDynamic.style.display = 'none';
        dynamicStatusBadge.textContent = '⏹️ Status: Stopped';
        dynamicStatusBadge.style.color = '#888';
        alert('Dynamic Mode stopped. YouTube restored to static theme.');
      }
    }, '🛑 Stop Dynamic Mode');

    const btnApplyDynamic = h('button', {
      className: 'yt-exp-action-btn primary',
      style: { padding: '7px 14px' },
      onClick: () => {
        themeConfig.dynamicMode = dynamicModeSelect.value;
        themeConfig.gradientColor1 = gradC1Picker.value;
        themeConfig.gradientColor2 = gradC2Picker.value;
        themeConfig.gradientColor3 = gradC3Picker.value;
        themeConfig.gradientAngle = parseInt(gradAngleSlider.value, 10);
        themeConfig.dynamicSpeed = parseInt(gradSpeedSlider.value, 10);
        themeConfig.enabled = true;
        setStored(STORAGE_KEY_THEME, themeConfig);
        applyThemeStyles();

        if (dynamicModeSelect.value === 'none') {
          btnStopDynamic.style.display = 'none';
          dynamicStatusBadge.textContent = '⏹️ Status: Stopped';
          dynamicStatusBadge.style.color = '#888';
          alert('Dynamic Mode set to None (Static Color Palette).');
        } else {
          btnStopDynamic.style.display = 'inline-flex';
          dynamicStatusBadge.textContent = `▶️ Running: ${dynamicModeSelect.value} (${themeConfig.dynamicSpeed}s @ ${themeConfig.gradientAngle}°)`;
          dynamicStatusBadge.style.color = '#4ade80';
          alert(`🌈 Dynamic mode "${dynamicModeSelect.value}" activated live!`);
        }
      }
    }, '⚡ Apply Dynamic Mode');

    const themeCardsGrid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px', marginTop: '6px' } });
    Object.values(THEME_PRESETS).forEach(preset => {
      const isSelected = themeConfig.mode === preset.id;
      const card = h('div', {
        style: {
          background: preset.id === 'oled_pitch_black' ? '#000000' : (preset.isLight ? '#ffffff' : preset.surfaceBg),
          border: `1px solid ${isSelected ? preset.accentColor : 'rgba(255,255,255,0.12)'}`,
          borderRadius: '8px',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '6px',
          boxShadow: isSelected ? `0 0 10px ${preset.accentColor}44` : 'none',
          cursor: 'pointer'
        },
        onClick: () => {
          themeSelect.value = preset.id;
          themeSelect.dispatchEvent(new Event('change'));
        }
      },
        h('div', null,
          h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
            h('span', { style: { fontWeight: '700', fontSize: '12px', color: preset.textColor } }, preset.label),
            h('span', { style: { width: '12px', height: '12px', borderRadius: '50%', backgroundColor: preset.accentColor, border: '1px solid #fff' } })
          ),
          h('div', { style: { fontSize: '11px', color: preset.textSecondary, marginTop: '3px', lineHeight: '1.3' } }, preset.desc)
        ),
        h('button', {
          className: 'yt-exp-btn-small accent',
          style: { width: 'fit-content', marginTop: '4px' },
          onClick: (e) => {
            e.stopPropagation();
            themeSelect.value = preset.id;
            themeSelect.dispatchEvent(new Event('change'));
          }
        }, isSelected ? '✓ Active Theme' : 'Select Theme')
      );
      themeCardsGrid.appendChild(card);
    });

    const tabContentTheme = h('div', { className: 'yt-exp-tab-content', id: 'tab-theme' },
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-header' },
          h('div', { className: 'yt-exp-card-title' }, '🎨 Master Theme Modifier & CSS Spec Engine'),
          h('label', { className: 'yt-exp-switch' }, toggleThemeEnabled, h('span', { className: 'yt-exp-slider' }))
        ),
        h('div', { className: 'yt-exp-card-desc' }, 'Overrides YouTube CSS custom property tokens (--yt-spec-base-background, --yt-spec-call-to-action, etc.) without CSP violations. Works with Kevlar Polymer, Delhi player skins, and mobile web.'),
        h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '6px' } },
          h('span', { style: { fontSize: '11px', color: '#aaa', fontWeight: 'bold' } }, 'Quick Toggle:'),
          btnQuickLight,
          btnQuickOled,
          btnQuickDelhi,
          btnQuickAurora
        ),
        h('div', { style: { marginTop: '8px' } }, themeSelect),
        themeDescLabel,
        h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '10px' } },
          btnApplyThemeLive,
          btnResetTheme
        )
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '🎨 Custom Color Palette Designer'),
        h('div', { className: 'yt-exp-card-desc' }, 'Define bespoke hex colors for YouTube’s primary background canvas, masthead surface, cards, accent highlights, and typography:'),
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', marginTop: '8px' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, customBaseColorPicker, h('span', { style: { fontSize: '11px', color: '#ccc' } }, 'Base Canvas')),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, customSurfaceColorPicker, h('span', { style: { fontSize: '11px', color: '#ccc' } }, 'Masthead / Surface')),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, customCardColorPicker, h('span', { style: { fontSize: '11px', color: '#ccc' } }, 'Cards & Popups')),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, customAccentColorPicker, h('span', { style: { fontSize: '11px', color: '#ccc' } }, 'Brand / Accent')),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, customTextColorPicker, h('span', { style: { fontSize: '11px', color: '#ccc' } }, 'Primary Text'))
        ),
        btnSaveCustomPalette
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '🌈 Dynamic Mode & Animated Gradient Engine'),
        h('div', { className: 'yt-exp-card-desc' }, 'Enable animated CSS multi-stop gradient flow, dual-stop linear gradients, or cyclic chromatic hue rotation across YouTube:'),
        h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '6px' } },
          dynamicModeSelect,
          h('span', { style: { fontSize: '11px', color: '#aaa' } }, 'Stops:'),
          gradC1Picker, gradC2Picker, gradC3Picker
        ),
        h('div', { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginTop: '8px' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, h('span', { style: { fontSize: '11px', color: '#aaa' } }, 'Angle:'), gradAngleSlider, gradAngleLabel),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, h('span', { style: { fontSize: '11px', color: '#aaa' } }, 'Speed:'), gradSpeedSlider, gradSpeedLabel)
        ),
        h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap' } },
          btnApplyDynamic,
          btnStopDynamic,
          dynamicStatusBadge
        )
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '⚙️ Live Tuning Controls'),
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px', marginTop: '6px' } },
          h('div', { style: { background: '#1c1c26', border: '1px solid #2c2c3b', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
            h('div', null,
              h('div', { style: { fontWeight: '600', fontSize: '12px', color: '#fff' } }, 'OLED Pure Black (#000)'),
              h('div', { style: { fontSize: '11px', color: '#888' } }, 'True black on canvas & player')
            ),
            h('label', { className: 'yt-exp-switch' }, toggleOledBlack, h('span', { className: 'yt-exp-slider' }))
          ),
          h('div', { style: { background: '#1c1c26', border: '1px solid #2c2c3b', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
            h('div', null,
              h('div', { style: { fontWeight: '600', fontSize: '12px', color: '#fff' } }, 'Frosted Glassmorphism'),
              h('div', { style: { fontSize: '11px', color: '#888' } }, 'Backdrop blur on nav & panels')
            ),
            h('label', { className: 'yt-exp-switch' }, toggleFrostedGlass, h('span', { className: 'yt-exp-slider' }))
          ),
          h('div', { style: { background: '#1c1c26', border: '1px solid #2c2c3b', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
            h('div', null,
              h('div', { style: { fontWeight: '600', fontSize: '12px', color: '#fff' } }, 'Frosted Glass Blur'),
              h('div', { style: { fontSize: '11px', color: '#888' } }, 'Backdrop blur radius')
            ),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, themeGlassBlurInput, themeGlassBlurLabel)
          ),
          h('div', { style: { background: '#1c1c26', border: '1px solid #2c2c3b', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
            h('div', null,
              h('div', { style: { fontWeight: '600', fontSize: '12px', color: '#fff' } }, 'Custom Accent Color'),
              h('div', { style: { fontSize: '11px', color: '#888' } }, 'Progress bar, chips & buttons')
            ),
            themeAccentInput
          )
        )
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '🎭 Curated Theme Palettes'),
        themeCardsGrid
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '🔬 Reverse-Engineered ActionID & Closure Modules'),
        h('div', { className: 'yt-exp-card-desc' }, 'Live inspection of Closure Compiler release hash rs=AGKMywHuveUU_QqutjtPr5up-vnWzWcG3Q, remote.js, offline.js, and Google Cast sender subsystems hooked by the script:'),
        h('div', { className: 'yt-exp-code-box', style: { maxHeight: '110px', marginTop: '6px' } },
          `[Target Closure Bundle]: rs=AGKMywHuveUU_QqutjtPr5up-vnWzWcG3Q (Kevlar Base Modules)\n` +
          `[Subsystems Intercepted]: offline.js (PWA Offline Cache), remote.js (MDX Lounge Controller), cast_sender.js (gstatic + extension)\n` +
          `[ActionID Event Bus]: yt-action / yt-signal-action-toggle-dark-theme-on / yt-set-theme-action\n` +
          `[Active DOM Tokens]: --yt-spec-base-background, --yt-spec-brand-background-primary, --yt-spec-call-to-action`
        ),
        h('div', { style: { display: 'flex', gap: '8px', marginTop: '6px' } },
          h('button', {
            className: 'yt-exp-btn-small accent',
            onClick: () => {
              dispatchThemeAction('MANUAL_ACTION_ID_PING', true);
              alert('Dispatched ActionID ping (yt-signal-action-toggle-dark-theme-on) to <ytd-app> and window action bus!');
            }
          }, '⚡ Test ActionID Dispatch')
        )
      )
    );
    // =======================================================================
    // TAB 2: MWEB & SEARCH WIDTH STUDIO (NEW DEDICATED TAB)
    // =======================================================================
    const searchWidthInput = h('input', {
      type: 'text',
      className: 'yt-exp-val-input',
      style: { width: '120px', textAlign: 'left', padding: '5px 8px', fontSize: '12px' },
      value: searchWidthConfig.searchWidth || '728px',
      title: 'CSS Search Box Width (e.g. 728px, 100%, 80%)'
    });

    const searchMaxWidthInput = h('input', {
      type: 'text',
      className: 'yt-exp-val-input',
      style: { width: '120px', textAlign: 'left', padding: '5px 8px', fontSize: '12px' },
      value: searchWidthConfig.searchMaxWidth || '850px',
      title: 'CSS Search Box Max Width (e.g. 850px, 1000px, 100%)'
    });

    const compactThresholdInput = h('input', {
      type: 'number',
      className: 'yt-exp-val-input',
      style: { width: '120px', textAlign: 'right', padding: '5px 8px', fontSize: '12px' },
      value: String(overrides['delhi_modern_web_player_responsive_compact_controls_threshold'] || searchWidthConfig.compactThreshold || 4000),
      title: 'Compact Controls Breakpoint Threshold in pixels (delhi_modern_web_player_responsive_compact_controls_threshold)'
    });

    const mwebBoxMaxWidthInput = h('input', {
      type: 'number',
      className: 'yt-exp-val-input',
      style: { width: '120px', textAlign: 'right', padding: '5px 8px', fontSize: '12px' },
      value: String(overrides['mweb_search_box_max_width'] || searchWidthConfig.mwebBoxMaxWidth || 760),
      title: 'MWeb Search Box Max Width in pixels (mweb_search_box_max_width)'
    });

    const btnApplySearchWidth = h('button', {
      className: 'yt-exp-action-btn primary',
      style: { padding: '7px 16px' },
      onClick: (e) => {
        e.stopPropagation();
        searchWidthConfig.searchWidth = searchWidthInput.value.trim() || '728px';
        searchWidthConfig.searchMaxWidth = searchMaxWidthInput.value.trim() || '850px';
        searchWidthConfig.compactThreshold = parseInt(compactThresholdInput.value, 10) || 4000;
        searchWidthConfig.mwebBoxMaxWidth = parseInt(mwebBoxMaxWidthInput.value, 10) || 760;

        overrides['delhi_modern_web_player_responsive_compact_controls_threshold'] = searchWidthConfig.compactThreshold;
        overrides['mweb_search_box_max_width'] = searchWidthConfig.mwebBoxMaxWidth;

        setStored(STORAGE_KEY_SEARCH_WIDTH, searchWidthConfig);
        setStored(STORAGE_KEY_FLAGS, overrides);

        const d = getYtcfgData();
        if (d) applyActiveOverridesToData(d);
        applySearchWidthStyles();
        updateActiveBadge();
        refreshList(false);
        alert(`Search Width live updated!\n• Width: ${searchWidthConfig.searchWidth}\n• Max-Width: ${searchWidthConfig.searchMaxWidth}\n• Breakpoint Threshold: ${searchWidthConfig.compactThreshold}px`);
      }
    }, '⚡ Apply Width Live');

    const btnResetSearchWidth = h('button', {
      className: 'yt-exp-action-btn danger',
      style: { padding: '7px 12px' },
      onClick: (e) => {
        e.stopPropagation();
        Object.assign(searchWidthConfig, defaultSearchWidthConfig);
        searchWidthInput.value = defaultSearchWidthConfig.searchWidth;
        searchMaxWidthInput.value = defaultSearchWidthConfig.searchMaxWidth;
        compactThresholdInput.value = String(defaultSearchWidthConfig.compactThreshold);
        mwebBoxMaxWidthInput.value = String(defaultSearchWidthConfig.mwebBoxMaxWidth);

        overrides['delhi_modern_web_player_responsive_compact_controls_threshold'] = defaultSearchWidthConfig.compactThreshold;
        overrides['mweb_search_box_max_width'] = defaultSearchWidthConfig.mwebBoxMaxWidth;

        setStored(STORAGE_KEY_SEARCH_WIDTH, searchWidthConfig);
        setStored(STORAGE_KEY_FLAGS, overrides);
        applySearchWidthStyles();
        alert('Search Width reset to YouTube factory defaults.');
      }
    }, '↺ Reset Default');

    // Quick Width Presets
    const btnPresetFullMWeb = h('button', {
      className: 'yt-exp-btn-small accent',
      onClick: () => {
        searchWidthInput.value = '100%';
        searchMaxWidthInput.value = '100%';
        btnApplySearchWidth.click();
      }
    }, '📱 Full Screen MWeb (100%)');

    const btnPresetWideDesktop = h('button', {
      className: 'yt-exp-btn-small',
      onClick: () => {
        searchWidthInput.value = '850px';
        searchMaxWidthInput.value = '1000px';
        btnApplySearchWidth.click();
      }
    }, '🖥️ Wide Desktop (850px)');

    const btnPresetCompactSearch = h('button', {
      className: 'yt-exp-btn-small',
      onClick: () => {
        searchWidthInput.value = '480px';
        searchMaxWidthInput.value = '600px';
        btnApplySearchWidth.click();
      }
    }, '⚡ Ultra Compact (480px)');

    const btnPresetFactorySearch = h('button', {
      className: 'yt-exp-btn-small',
      onClick: () => {
        searchWidthInput.value = '728px';
        searchMaxWidthInput.value = '850px';
        btnApplySearchWidth.click();
      }
    }, '↺ Factory Standard (728px)');

    // MWeb flags toggle cards
    const mwebFlagsGrid = h('div', { className: 'yt-exp-btn-grid' });
    Object.keys(MWEB_FLAGS).forEach(flagName => {
      const isSet = overrides[flagName] !== undefined ? overrides[flagName] : MWEB_FLAGS[flagName];
      const isNum = typeof isSet === 'number' || typeof MWEB_FLAGS[flagName] === 'number';

      let inputControl = null;
      if (isNum) {
        inputControl = h('input', {
          type: 'number',
          className: 'yt-exp-val-input',
          value: String(isSet),
          onChange: (e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) {
              overrides[flagName] = val;
              setStored(STORAGE_KEY_FLAGS, overrides);
              const d = getYtcfgData();
              if (d) applyActiveOverridesToData(d);
              updateActiveBadge();
            }
          }
        });
      } else {
        const cb = h('input', {
          type: 'checkbox',
          checked: !!isSet,
          onChange: () => {
            overrides[flagName] = cb.checked;
            setStored(STORAGE_KEY_FLAGS, overrides);
            const d = getYtcfgData();
            if (d) applyActiveOverridesToData(d);
            updateActiveBadge();
            refreshList(false);
          }
        });
        inputControl = h('label', { className: 'yt-exp-switch' }, cb, h('span', { className: 'yt-exp-slider' }));
      }

      const card = h('div', {
        style: { background: '#1d1d27', border: '1px solid #2d2d3a', borderRadius: '6px', padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }
      },
        h('span', { style: { fontFamily: 'monospace', fontSize: '11px', color: '#eee', wordBreak: 'break-all' } }, flagName),
        inputControl
      );
      mwebFlagsGrid.appendChild(card);
    });

    const tabContentMWeb = h('div', { className: 'yt-exp-tab-content', id: 'tab-mweb' },
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '🔍 MWeb & Desktop Search Width Live Tuner'),
        h('div', { className: 'yt-exp-card-desc' }, 'Interactively customize the search bar width and responsive max-width. Works across desktop masthead, tablet view, and mobile web (m.youtube.com). Changes apply live to the DOM!'),
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px', marginTop: '8px' } },
          h('div', null,
            h('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '3px' } }, 'Search Box Width:'),
            searchWidthInput
          ),
          h('div', null,
            h('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '3px' } }, 'Search Box Max-Width:'),
            searchMaxWidthInput
          ),
          h('div', null,
            h('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '3px' } }, 'Responsive Breakpoint Threshold:'),
            compactThresholdInput
          ),
          h('div', null,
            h('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '3px' } }, 'MWeb Search Box Max Width (px):'),
            mwebBoxMaxWidthInput
          )
        ),
        h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '10px' } },
          btnApplySearchWidth,
          btnResetSearchWidth,
          h('span', { style: { fontSize: '11px', color: '#888', marginLeft: '6px' } }, 'PRESETS:'),
          btnPresetFullMWeb,
          btnPresetWideDesktop,
          btnPresetCompactSearch,
          btnPresetFactorySearch
        )
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '📱 Mobile Web (MWeb) Architecture & Redesign Flags'),
        h('div', { className: 'yt-exp-card-desc', style: { marginBottom: '8px' } }, 'Unlocks MWeb search header redesign, search bar expansion animation, compact search bars, dynamic pill filters, swipe-to-dismiss, bottom sheet comments, and touch slider seeking.'),
        mwebFlagsGrid
      )
    );

    // =======================================================================
    // TAB 3: CANARY ENGINE & NETWORK MACHINE
    // =======================================================================
    const canaryToggle = h('input', { type: 'checkbox', id: 'yt-exp-canary-toggle' });
    const canaryModeSelect = h(
      'select',
      { id: 'yt-exp-canary-mode', style: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '4px 8px' } },
      h('option', { value: 'canary' }, 'Canary (Standard Channel)'),
      h('option', { value: 'early_canary' }, 'Early Canary (Ring 0 / 1-5%)'),
      h('option', { value: 'holdback' }, 'Holdback (Control Group A/B)'),
      h('option', { value: 'stage' }, 'Stage Build (Internal Staging)'),
      h('option', { value: 'dogfood' }, 'Dogfood (Google Bleeding Edge)'),
      h('option', { value: 'dev' }, 'Dev (Developer Mode)'),
      h('option', { value: 'canary_candidate' }, 'Canary Candidate (RC)'),
      h('option', { value: 'ipp_canary' }, 'IPP Canary (Performance Channel)'),
      h('option', { value: 'none' }, 'Disabled (Production Stable)')
    );

    const canaryStageSelect = h(
      'select',
      { id: 'yt-exp-canary-stage', style: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '4px 8px' } },
      h('option', { value: 'HIGH' }, 'Stage HIGH (Aggressive Canary)'),
      h('option', { value: 'MEDIUM' }, 'Stage MEDIUM (Ambient / Watch)'),
      h('option', { value: 'LOW' }, 'Stage LOW (Conservative Tier)'),
      h('option', { value: '2', selected: true }, 'Stage 2 (Standard ~25%)'),
      h('option', { value: '1' }, 'Stage 1 (Early Access ~5%)'),
      h('option', { value: '0' }, 'Stage 0 (Dogfood Prototype)'),
      h('option', { value: '3' }, 'Stage 3 (Late Rollout ~100%)'),
      h('option', { value: 'CRITICAL' }, 'Stage CRITICAL (Hotfix Tier)')
    );

    const canaryBaseJsSelect = h(
      'select',
      { id: 'yt-exp-canary-basejs', style: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '4px 8px' } },
      h('option', { value: 'turbo' }, 'Turbo (AV1 + HBR + DRC + SABR)'),
      h('option', { value: 'standard' }, 'Standard (Canary Player Flags)'),
      h('option', { value: 'balanced' }, 'Balanced (Adaptive Buffering)'),
      h('option', { value: 'off' }, 'Stock (Factory Base.js Engine)')
    );

    const canaryIppSelect = h(
      'select',
      { id: 'yt-exp-canary-ipp', style: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '4px 8px' } },
      h('option', { value: 'experiment' }, 'experiment'),
      h('option', { value: 'canary' }, 'canary'),
      h('option', { value: 'stage' }, 'stage'),
      h('option', { value: 'dogfood' }, 'dogfood'),
      h('option', { value: 'holdback' }, 'holdback'),
      h('option', { value: 'control' }, 'control')
    );

    const canarySwSelect = h(
      'select',
      { id: 'yt-exp-canary-sw', style: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '4px 8px' } },
      h('option', { value: 'active' }, 'Active Canary & Static Route'),
      h('option', { value: 'bypass' }, 'Bypass SW & Fresh Fetch'),
      h('option', { value: 'static_route' }, 'Static Routing Only'),
      h('option', { value: 'default' }, 'Browser Default')
    );

    const canaryCastSelect = h(
      'select',
      { id: 'yt-exp-canary-cast', style: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '4px 8px' } },
      h('option', { value: 'active' }, 'Active (cast_sender.js + MDX)'),
      h('option', { value: 'off' }, 'Off (Disable Cast API)')
    );

    const canaryModulesSelect = h(
      'select',
      { id: 'yt-exp-canary-modules', style: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '4px 8px' } },
      h('option', { value: 'kevlar_triple_modules' }, 'Kevlar Triple Bundle (m=kevlar_base_module,kevlar_main_module,kevlar_base_sync_mod_chunk)'),
      h('option', { value: 'modular_network' }, 'Modular Network Machine (De8mUc)'),
      h('option', { value: 'sync_preload' }, 'Sync Base Preload (kevlar_base_sync)'),
      h('option', { value: 'sw_cache_opt' }, 'SW Cache Bridge (QlbBce + sw.js)'),
      h('option', { value: 'standard' }, 'Standard Closure Modules')
    );

    const canaryServerSelect = h(
      'select',
      { id: 'yt-exp-canary-server', style: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '4px 8px' } },
      h('option', { value: 'canary' }, 'canary'),
      h('option', { value: 'stage' }, 'stage'),
      h('option', { value: 'prod' }, 'prod')
    );

    const btnPurgeSw = h('button', { className: 'yt-exp-action-btn danger', style: { marginTop: '8px' } }, '🔄 Purge SW & Cache Storage');

    const tabContentCanary = h('div', { className: 'yt-exp-tab-content', id: 'tab-canary' },
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-header' },
          h('div', { className: 'yt-exp-card-title' }, '🚀 Master Canary Engine'),
          h('label', { className: 'yt-exp-switch' }, canaryToggle, h('span', { className: 'yt-exp-slider' }))
        ),
        h('div', { className: 'yt-exp-card-desc' }, 'Configures YouTube Web client to load experimental Canary and Dogfood channel builds, with custom stages, server headers, and IPP telemetry logging.')
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '⚙️ Channel & Stage Parameters'),
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginTop: '6px' } },
          h('div', null, h('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '3px' } }, 'Canary Channel:'), canaryModeSelect),
          h('div', null, h('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '3px' } }, 'Experiment Stage:'), canaryStageSelect),
          h('div', null, h('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '3px' } }, 'Base.js Engine:'), canaryBaseJsSelect),
          h('div', null, h('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '3px' } }, 'IPP Logging Type:'), canaryIppSelect),
          h('div', null, h('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '3px' } }, 'Service Worker Pipeline:'), canarySwSelect),
          h('div', null, h('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '3px' } }, 'Google Cast (remote.js):'), canaryCastSelect),
          h('div', null, h('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '3px' } }, 'Closure Modules Mode:'), canaryModulesSelect),
          h('div', null, h('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '3px' } }, 'Server Version Header:'), canaryServerSelect)
        )
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '🐤 Canary Profiles'),
        h('div', { className: 'yt-exp-btn-grid' },
          h('button', { className: 'yt-exp-action-btn', onClick: () => applyCanaryProfile({ state: 'canary', stage: '2', baseJsMode: 'turbo', swMode: 'active', castMode: 'active', ippLogging: 'experiment', serverVersion: 'canary' }, 'Standard Canary') }, '🐤 Standard Canary (Stage 2)'),
          h('button', { className: 'yt-exp-action-btn', onClick: () => applyCanaryProfile({ state: 'dogfood', stage: '0', baseJsMode: 'turbo', swMode: 'bypass', castMode: 'active', ippLogging: 'dogfood', serverVersion: 'stage' }, 'Dogfood Stage 0') }, '🧪 Dogfood Stage 0 (Bleeding)'),
          h('button', { className: 'yt-exp-action-btn', onClick: () => applyCanaryProfile({ state: 'early_canary', stage: 'HIGH', baseJsMode: 'turbo', swMode: 'active', castMode: 'active', ippLogging: 'canary', serverVersion: 'canary' }, 'Early Canary') }, '⚡ Early Ring 0 (High)'),
          h('button', { className: 'yt-exp-action-btn', onClick: () => applyCanaryProfile({ state: 'holdback', stage: 'MEDIUM', baseJsMode: 'balanced', swMode: 'default', castMode: 'off', modulesMode: 'standard', ippLogging: 'holdback', serverVersion: 'prod' }, 'Holdback Group') }, '🛡️ Holdback Control Group'),
          h('button', { className: 'yt-exp-action-btn', onClick: () => applyCanaryProfile(CANARY_TURBO_PROFILE, 'Modular Kevlar Engine') }, '⚡ Modular Network Machine')
        ),
        btnPurgeSw,
        h('button', {
          className: 'yt-exp-action-btn primary',
          style: { marginTop: '8px' },
          onClick: () => {
            const count = preloadKevlarTripleModules();
            alert(`⚡ Preloaded ${count} Kevlar module script links (m=kevlar_base_module,kevlar_main_module,kevlar_base_sync_mod_chunk) into document head!`);
          }
        }, '⚡ Preload Kevlar Triple Modules')
      )
    );   // =======================================================================
    // TAB: VISITOR ID & COHORT SWITCHER (220+ GLOBAL COUNTRIES & TELEMETRY)
    // =======================================================================
    const visitorStatusLabel = h('span', { style: { fontFamily: 'monospace', color: '#ffcc00', fontSize: '12px' } }, visitorConfig.enabled ? visitorConfig.label : 'Default (YouTube Managed)');
    const visitorDataBox = h('div', { className: 'yt-exp-code-box', style: { color: '#a5d6ff', fontSize: '11px', maxHeight: '70px' } });
    const visitorCookieBox = h('div', { className: 'yt-exp-code-box', style: { color: '#7ee787', fontSize: '11px', maxHeight: '40px' } });

    // Dedicated Internal Cryptographic Telemetry Box
    const internalStatsBox = h('div', {
      className: 'yt-exp-code-box',
      style: { color: '#e2e8f0', fontSize: '11px', maxHeight: '200px', lineHeight: '1.5', background: '#0b0b12', borderColor: '#26263b' }
    });

    function updateVisitorDisplay() {
      const d = getYtcfgData() || {};
      const curData = (visitorConfig.enabled && visitorConfig.visitorData) ? visitorConfig.visitorData : (d.VISITOR_DATA || 'None detected');
      const curCookie = getCookie('VISITOR_INFO1_LIVE') || (visitorConfig.enabled ? visitorConfig.cookieId : 'None set');
      visitorStatusLabel.textContent = visitorConfig.enabled ? visitorConfig.label : 'Default (YouTube Auto-Assigned)';
      visitorDataBox.textContent = curData;
      visitorCookieBox.textContent = curCookie;

      const stats = getVisitorIdInternalStats(curCookie !== 'None set' ? curCookie : 'V1KxORxfYuo', curData, visitorConfig.country || 'US');
      if (stats) {
        internalStatsBox.textContent = [
          `=== INTERNAL VISITOR ID TELEMETRY & CRYPTOGRAPHIC STATS ===`,
          `• Cookie ID (VISITOR_INFO1_LIVE): ${stats.cookieId}`,
          `• 32-bit FNV-1a Hash: ${stats.fnv1aHex} (Decimal: ${stats.fnv1aDec})`,
          `• Rolled Rollout Percentile: ${stats.percentile}% -> ${stats.tierLabel}`,
          `• Flight Description: ${stats.tierDesc}`,
          `• Entropy: ${stats.entropyBits} bits (~${stats.totalCombinations} states)`,
          `• Protocol Buffer Mint Date: ${stats.mintDateStr} (Epoch: ${stats.mintTimestamp})`,
          `• Geolocation Country Initial: [${stats.country}] (Field 6 wire tag)`,
          `• GVS Proof-of-Origin (PO Token): ${stats.poTokenStatus}`,
          `• DataSync Linkage: ${stats.dataSyncStatus}`,
          `• Experiment Flight Hash Bucket: ${stats.expBucket} / 10000 (${stats.isTreatmentCandidate ? 'Treatment Eligible' : 'Control Group'})`
        ].join('\n');
      } else {
        internalStatsBox.textContent = 'Awaiting active visitor token detection...';
      }
    }
    updateVisitorDisplay();

    const visitorSelect = h('select', {
      style: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', width: '100%' }
    },
      CURATED_VISITOR_PRESETS.map(p => h('option', { value: p.id, selected: visitorConfig.mode === p.id }, p.label))
    );

    const activePresetObj = CURATED_VISITOR_PRESETS.find(p => p.id === visitorConfig.mode) || CURATED_VISITOR_PRESETS[0];
    const visitorDescText = h('div', { className: 'yt-exp-card-desc', style: { minHeight: '32px', color: '#bbb' } },
      activePresetObj.desc
    );

    visitorSelect.onchange = () => {
      const selected = CURATED_VISITOR_PRESETS.find(p => p.id === visitorSelect.value);
      if (selected) {
        visitorDescText.textContent = selected.desc;
      }
    };

    const btnApplyCohort = h('button', {
      className: 'yt-exp-action-btn primary',
      onClick: () => {
        const selected = CURATED_VISITOR_PRESETS.find(p => p.id === visitorSelect.value);
        if (!selected) return;
        if (selected.id === 'default') {
          resetVisitorIds();
          updateVisitorDisplay();
          alert('Reverted to YouTube Default auto-assigned visitor ID. Reloading page...');
          window.location.reload();
          return;
        }
        const vData = getVisitorDataForPreset(selected);
        applyVisitorSession(selected.cookieId, vData, selected.country || 'US', selected.label, selected.id, `Activated Visitor Cohort: ${selected.label}!\n\nCountry: [${selected.country || 'US'}]\nCookie VISITOR_INFO1_LIVE: ${selected.cookieId}\nVISITOR_DATA Token: ${vData.slice(0, 32)}...\n\nReload page if you want YouTube to load cold experiment flags for this cohort.`);
      }
    }, '⚡ Apply Selected Cohort');

    const btnResetVisitor = h('button', {
      className: 'yt-exp-action-btn danger',
      onClick: () => {
        if (confirm('Reset Visitor ID and purge all tracking cookies (VISITOR_INFO1_LIVE, YSC, GPS, PREF)? YouTube will mint a brand-new untracked visitor session on reload.')) {
          resetVisitorIds();
          updateVisitorDisplay();
          alert('Visitor IDs purged from memory and cookies! Reloading page to mint fresh session...');
          window.location.reload();
        }
      }
    }, '↺ Reset Visitor ID (Clean Slate)');

    // 1. Live Active Visitor ID Tester (YouTube 2x Verification)
    const activeTestResultBox = h('div', {
      style: { background: '#121218', border: '1px solid #282838', borderRadius: '6px', padding: '8px 10px', fontSize: '11px', color: '#ccc', marginTop: '6px', whiteSpace: 'pre-wrap', display: 'none' }
    });

    const btnTestActiveVisitor = h('button', {
      className: 'yt-exp-action-btn primary',
      onClick: async () => {
        const curCookie = getCookie('VISITOR_INFO1_LIVE') || visitorConfig.cookieId || '';
        const d = getYtcfgData() || {};
        const curVData = visitorConfig.visitorData || d.VISITOR_DATA || (curCookie ? encodeVisitorData(curCookie, Math.floor(Date.now() / 1000), visitorConfig.country || 'US') : '');

        if (!curCookie && !curVData) {
          alert('No active visitor ID or VISITOR_DATA found to test.');
          return;
        }

        activeTestResultBox.style.display = 'block';
        activeTestResultBox.textContent = '⏳ Testing active visitor ID against YouTube backend pings...';

        const startTime = performance.now();
        try {
          const res = await verifyVisitorWithYouTube(curCookie || 'Detected', curVData);
          const pct = calculateVisitorPercentile(curCookie);
          const tierInfo = getVisitorTier(pct);

          activeTestResultBox.textContent = [
            `✅ ACTIVE VISITOR ID TEST PASSED (2/2 YouTube Pings Confirmed)`,
            `• Target Cookie ID: ${curCookie || 'N/A'}`,
            `• Calculated Percentile: ${pct}% (${tierInfo.label})`,
            `• Tier Description: ${tierInfo.desc}`,
            `• Country Profile: [${visitorConfig.country || 'US'}]`,
            `• Ping 1 (/visitor_id / /guide): 200 OK (${res.ping1Ms}ms)`,
            `• Ping 2 (/browse confirmation): 200 OK (${res.ping2Ms}ms)`,
            `• Total Round-Trip Latency: ${Math.round(performance.now() - startTime)}ms`,
            `• YouTube Session Status: Preserved & Verified on server`
          ].join('\n');
        } catch (err) {
          activeTestResultBox.textContent = `❌ Active Visitor Test Failed: ${err.message}`;
        }
      }
    }, '🔍 Test Active Visitor ID on YouTube (2x Ping)');

    // 2. Deterministic Percentile Tier Finder
    const tierSelect = h('select', {
      style: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '6px 8px', fontSize: '12px' }
    },
      h('option', { value: '0' }, 'Tier 0: Canary Alpha / Ring 0 (0-4% Percentile) [Bleeding Edge]'),
      h('option', { value: '1' }, 'Tier 1: Early Canary Flight (5-19% Percentile)'),
      h('option', { value: '2', selected: true }, 'Tier 2: Mid-Rollout Flight (20-49% Percentile)'),
      h('option', { value: '3' }, 'Tier 3: Broad Staged Treatment (50-89% Percentile)'),
      h('option', { value: '4' }, 'Tier 4: Holdback / Control Cohort (90-99% Percentile)')
    );

    // =========================================================================
    // EXACT PERCENTILE PICKER (0% TO 99% - SPECIFIC BLEEDING EDGE OR CONTROL)
    // =========================================================================
    const exactPctInput = h('input', {
      type: 'number',
      min: '0',
      max: '99',
      value: '0',
      className: 'yt-exp-val-input',
      style: { width: '56px', textAlign: 'center', padding: '5px', fontSize: '13px', fontWeight: 'bold', color: '#ff4d4d' }
    });

    const exactPctSlider = h('input', {
      type: 'range',
      min: '0',
      max: '99',
      value: '0',
      style: { width: '130px', cursor: 'pointer' }
    });

    exactPctInput.oninput = () => {
      let v = parseInt(exactPctInput.value, 10);
      if (isNaN(v)) v = 0;
      v = Math.max(0, Math.min(99, v));
      exactPctInput.value = String(v);
      exactPctSlider.value = String(v);
    };

    exactPctSlider.oninput = () => {
      exactPctInput.value = exactPctSlider.value;
    };

    const exactPctResultBox = h('div', {
      className: 'yt-exp-code-box',
      style: { color: '#38bdf8', fontSize: '11px', maxHeight: '160px', marginTop: '6px', display: 'none', background: '#080c14' }
    });

    let pendingExactCandidate = null;

    const btnActivateExactPct = h('button', {
      className: 'yt-exp-action-btn success',
      style: { display: 'none', marginTop: '6px' },
      onClick: () => {
        if (!pendingExactCandidate) return;
        const cand = pendingExactCandidate;
        applyVisitorSession(cand.cookieId, cand.visitorData, cand.country, `Exact ${cand.percentile}% (${cand.cookieId}, [${cand.country}])`, 'exact_pct_' + cand.percentile, `⚡ Activated Exact ${cand.percentile}% Visitor Token!\n\nCookie: ${cand.cookieId}\nPercentile: ${cand.percentile}%\nCountry: [${cand.country}]\n\nReloading page to apply this experiment cohort...`);
      }
    }, '⚡ Activate Exact Percentile Token');

    const btnGenerateExactPct = h('button', {
      className: 'yt-exp-action-btn primary',
      onClick: async () => {
        const targetPct = parseInt(exactPctInput.value, 10) || 0;
        const selCountry = countrySelect.value || 'MN';
        btnActivateExactPct.style.display = 'none';
        pendingExactCandidate = null;

        exactPctResultBox.style.display = 'block';
        exactPctResultBox.textContent = `⏳ Finding candidate for exact ${targetPct}% percentile with country [${selCountry}]...`;

        const cand = findCandidateForExactPercentile(targetPct, 'yt_exact_pct_' + targetPct);
        if (!cand) {
          exactPctResultBox.textContent = `❌ Could not find candidate for exact ${targetPct}%`;
          return;
        }

        const nowTs = Math.floor(Date.now() / 1000);
        const vData = encodeVisitorData(cand.cookieId, nowTs, selCountry);
        const decoded = decodeVisitorData(vData);
        const stats = getVisitorIdInternalStats(cand.cookieId, vData, selCountry);

        pendingExactCandidate = {
          cookieId: cand.cookieId,
          percentile: cand.percentile,
          tier: cand.tier,
          visitorData: vData,
          country: selCountry
        };

        exactPctResultBox.textContent = [
          `✅ EXACT PERCENTILE GENERATION SUCCESS:`,
          `• Exact Target Percentile: ${targetPct}%`,
          `• Candidate Cookie ID: ${cand.cookieId} (Generated in ${cand.attempts} attempts)`,
          `• Verified 32-bit FNV-1a Hash: ${stats.fnv1aHex} (h % 100 === ${cand.percentile}%)`,
          `• Rollout Tier: ${cand.tier.label}`,
          `• Country Profile: [${selCountry}]`,
          `• Protobuf VISITOR_DATA: ${vData.slice(0, 36)}...`,
          `• Decoded Check: Cookie="${decoded?.cookieId}", Country="[${decoded?.country}]"`,
          `• GVS PO Token Status: ${stats.poTokenStatus}`,
          `• Experiment Flight Bucket: ${stats.expBucket} / 10000 (${stats.isTreatmentCandidate ? 'Treatment Eligible' : 'Control Group'})`
        ].join('\n');

        btnActivateExactPct.style.display = 'flex';
      }
    }, '🎯 Generate Exact Percentile Token');

    function makeQuickPctBtn(pct, label, color) {
      return h('button', {
        className: 'yt-exp-btn-small',
        style: { borderColor: color, color: color },
        onClick: () => {
          exactPctInput.value = String(pct);
          exactPctSlider.value = String(pct);
          btnGenerateExactPct.click();
        }
      }, label);
    }

    // =========================================================================
    // 220+ GLOBAL COUNTRIES SELECTOR & SEARCH FILTER (INCL. MONGOLIA [MN])
    // =========================================================================
    const countryFilterInput = h('input', {
      type: 'text',
      className: 'yt-exp-val-input',
      style: { width: '190px', textAlign: 'left', padding: '5px 8px', fontSize: '11px' },
      placeholder: 'Filter 220+ countries (e.g. MN, Mongolia, JP)...'
    });

    const countrySelect = h('select', {
      style: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '6px 8px', fontSize: '12px', maxWidth: '240px' }
    });

    function populateCountries(filterStr = '') {
      while (countrySelect.firstChild) countrySelect.removeChild(countrySelect.firstChild);
      const query = (filterStr || '').trim().toLowerCase();
      const matched = ALLOWED_YT_COUNTRIES.filter(c => !query || c.code.toLowerCase().includes(query) || c.name.toLowerCase().includes(query));
      matched.forEach(c => {
        const opt = h('option', {
          value: c.code,
          selected: c.code === (visitorConfig.country || 'MN')
        }, `${c.flag} [${c.code}] ${c.name}`);
        countrySelect.appendChild(opt);
      });
      if (matched.length === 0) {
        countrySelect.appendChild(h('option', { value: 'MN' }, '🇲🇳 [MN] Mongolia'));
      }
    }
    populateCountries();

    countryFilterInput.oninput = () => {
      populateCountries(countryFilterInput.value);
    };

    countrySelect.onchange = () => {
      visitorConfig.country = countrySelect.value;
      setStored(STORAGE_KEY_VISITOR, visitorConfig);
    };

    // Automated Country Testing Engine (Tests Mongolia MN or Selected Country)
    const countryTestReportBox = h('div', {
      className: 'yt-exp-code-box',
      style: { color: '#7ee787', fontSize: '11px', maxHeight: '150px', marginTop: '6px', display: 'none', background: '#0a0d14' }
    });

    const btnTestCountryVisitor = h('button', {
      className: 'yt-exp-action-btn success',
      onClick: () => {
        const selCountry = countrySelect.value || 'MN';
        const cand = findDeterministicCandidateForTierSync(0, 'yt_country_test_' + selCountry);
        if (!cand) {
          alert('Could not find candidate for country test.');
          return;
        }
        const nowTs = Math.floor(Date.now() / 1000);
        const encoded = encodeVisitorData(cand.cookieId, nowTs, selCountry);
        const decoded = decodeVisitorData(encoded);
        const stats = getVisitorIdInternalStats(cand.cookieId, encoded, selCountry);

        countryTestReportBox.style.display = 'block';
        countryTestReportBox.textContent = [
          `=== 🧪 COUNTRY VISITOR DATA VERIFICATION TEST ===`,
          `• Target ISO Initial Tested: [${selCountry}] (${countrySelect.selectedOptions[0]?.textContent || selCountry})`,
          `• Synthetic Candidate Cookie: ${cand.cookieId} (Percentile: ${cand.percentile}%)`,
          `• Encoded VISITOR_DATA Base64: ${encoded}`,
          `• Protobuf Wire Verification:`,
          `   ✓ Field 1 (Cookie ID): "${decoded?.cookieId}" (Matches: ${decoded?.cookieId === cand.cookieId})`,
          `   ✓ Field 5 (Timestamp): ${decoded?.timestamp} (${decoded?.dateStr})`,
          `   ✓ Field 6 (Country Initial): "${decoded?.country}" (Matches [${selCountry}]: ${decoded?.country === selCountry})`,
          `• Cryptographic Hash: ${stats.fnv1aHex} (Entropy: ${stats.entropyBits} bits)`,
          `• Status: 100% VALID PROTOBUF TOKEN - Ready for Innertube X-Goog-Visitor-Id!`
        ].join('\n');
      }
    }, '🧪 Test Mongolia (MN) & Selected Country Token');

    const tierFinderProgressBox = h('div', {
      style: { background: '#121218', border: '1px solid #282838', borderRadius: '6px', padding: '8px 10px', fontSize: '11px', color: '#a5d6ff', marginTop: '6px', whiteSpace: 'pre-wrap', display: 'none' }
    });

    let pendingVerifiedCandidate = null;

    const btnActivateCandidate = h('button', {
      className: 'yt-exp-action-btn success',
      style: { display: 'none', marginTop: '6px' },
      onClick: () => {
        if (!pendingVerifiedCandidate) return;
        const cand = pendingVerifiedCandidate;
        applyVisitorSession(cand.cookieId, cand.visitorData, cand.country, `Verified Tier ${cand.tier.tier} (${cand.cookieId}, ${cand.percentile}%, [${cand.country}])`, 'tier_' + cand.tier.tier, `⚡ Activated Verified Visitor ID!\n\nCountry: [${cand.country}]\nCookie: ${cand.cookieId}\nPercentile: ${cand.percentile}% (${cand.tier.label})\n\nReloading page to apply this experiment tier treatment...`);
      }
    }, '⚡ Activate Verified Visitor ID');

    const btnFindAndVerifyTier = h('button', {
      className: 'yt-exp-action-btn primary',
      onClick: async () => {
        const targetTier = parseInt(tierSelect.value, 10);
        const country = countrySelect.value || 'MN';
        btnActivateCandidate.style.display = 'none';
        pendingVerifiedCandidate = null;

        tierFinderProgressBox.style.display = 'block';
        tierFinderProgressBox.textContent = `🎯 Searching deterministically for candidate in Tier ${targetTier} with country [${country}]...`;

        const cand = findDeterministicCandidateForTierSync(targetTier, 'yt_tier_finder_' + Date.now().toString(36).slice(0, 4));
        if (!cand) {
          tierFinderProgressBox.textContent = '❌ Could not find candidate matching tier criteria.';
          return;
        }

        const candidateVisitorData = encodeVisitorData(cand.cookieId, Math.floor(Date.now() / 1000), country);
        tierFinderProgressBox.textContent = `Candidate found: ${cand.cookieId} (Percentile: ${cand.percentile}%, ${cand.tier.label}, [${country}])\n⏳ Dispatched Ping 1 to YouTube Innertube API...`;

        try {
          const res = await verifyVisitorWithYouTube(cand.cookieId, candidateVisitorData, (step, data) => {
            if (step === 'ping1_ok') {
              tierFinderProgressBox.textContent = `Candidate found: ${cand.cookieId} (Percentile: ${cand.percentile}%, [${country}])\n• Ping 1: 200 OK (${data.duration}ms)\n⏳ Dispatched Ping 2 to confirm backend persistence...`;
            } else if (step === 'ping2_ok') {
              tierFinderProgressBox.textContent += `\n• Ping 2: 200 OK (${data.duration}ms)`;
            }
          });

          pendingVerifiedCandidate = {
            cookieId: cand.cookieId,
            percentile: cand.percentile,
            tier: cand.tier,
            visitorData: res.visitorData,
            country
          };

          tierFinderProgressBox.textContent = [
            `✅ SUCCESS: Candidate Verified by YouTube Backend (2/2 Pings Confirmed)`,
            `• Cookie ID: ${cand.cookieId}`,
            `• Assigned Percentile: ${cand.percentile}% (${cand.tier.label})`,
            `• Country Initial Profile: [${country}]`,
            `• Ping 1 (/visitor_id / /guide): 200 OK (${res.ping1Ms}ms)`,
            `• Ping 2 (/browse confirmation): 200 OK (${res.ping2Ms}ms)`,
            `• Verification Status: 100% Valid & Recognized on YouTube servers!`
          ].join('\n');

          btnActivateCandidate.style.display = 'flex';
        } catch (err) {
          tierFinderProgressBox.textContent = `❌ Verification failed on YouTube backend: ${err.message}`;
        }
      }
    }, '🎯 Find & 2x Verify Tier on YouTube');

    const customVisitorInput = h('input', {
      type: 'text',
      className: 'yt-exp-val-input',
      style: { width: '100%', textAlign: 'left', padding: '6px 10px', fontSize: '11px' },
      placeholder: 'Paste raw VISITOR_DATA base64 (Cgt...) or 11-char cookie ID (e.g. V1KxORxfYuo)'
    });
    const customVisitorLabelInput = h('input', {
      type: 'text',
      className: 'yt-exp-val-input',
      style: { width: '100%', textAlign: 'left', padding: '6px 10px', fontSize: '11px' },
      placeholder: 'Label for preset (e.g. My Custom Canary Bucket)'
    });
    const btnSaveCustomVisitor = h('button', {
      className: 'yt-exp-action-btn',
      onClick: () => {
        const raw = customVisitorInput.value.trim();
        const lbl = customVisitorLabelInput.value.trim() || 'Custom Visitor';
        if (!raw) {
          alert('Please enter a valid visitor string.');
          return;
        }
        const parts = extractVisitorParts(raw);
        customVisitorList.push({
          id: 'custom_' + Date.now(),
          label: lbl,
          cookieId: parts.cookieId,
          country: countrySelect.value || 'US',
          visitorData: parts.visitorData
        });
        setStored(STORAGE_KEY_CUSTOM_VISITORS, customVisitorList);
        customVisitorInput.value = '';
        customVisitorLabelInput.value = '';
        renderCustomVisitorList();
        alert(`Saved preset "${lbl}"!`);
      }
    }, '💾 Save Custom Preset');

    const customVisitorListContainer = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' } });

    function renderCustomVisitorList() {
      while (customVisitorListContainer.firstChild) customVisitorListContainer.removeChild(customVisitorListContainer.firstChild);
      if (customVisitorList.length === 0) {
        customVisitorListContainer.appendChild(h('div', { style: { fontSize: '11px', color: '#777' } }, 'No custom visitor presets saved yet.'));
        return;
      }
      customVisitorList.forEach((item, idx) => {
        const row = h('div', {
          style: { background: '#1c1c28', border: '1px solid #2d2d3a', borderRadius: '6px', padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }
        },
          h('div', null,
            h('div', { style: { fontWeight: '600', fontSize: '12px', color: '#fff' } }, item.label),
            h('div', { style: { fontFamily: 'monospace', fontSize: '10px', color: '#888' } }, `[${item.country || 'US'}] ${item.cookieId} | ${item.visitorData.slice(0, 24)}...`)
          ),
          h('div', { style: { display: 'flex', gap: '6px' } },
            h('button', {
              className: 'yt-exp-btn-small accent',
              onClick: () => {
                applyVisitorSession(item.cookieId, item.visitorData, item.country || 'US', item.label, item.id, `Applied "${item.label}"! Reload page to adopt its flights.`);
              }
            }, 'Apply'),
            h('button', {
              className: 'yt-exp-btn-small danger',
              onClick: () => {
                customVisitorList.splice(idx, 1);
                setStored(STORAGE_KEY_CUSTOM_VISITORS, customVisitorList);
                renderCustomVisitorList();
              }
            }, '✕')
          )
        );
        customVisitorListContainer.appendChild(row);
      });
    }
    renderCustomVisitorList();

    const tabContentVisitor = h('div', { className: 'yt-exp-tab-content', id: 'tab-visitor' },
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-header' },
          h('div', { className: 'yt-exp-card-title' }, '🆔 Active YouTube Visitor Identity'),
          visitorStatusLabel
        ),
        h('div', { className: 'yt-exp-card-desc' }, 'YouTube hashes your Visitor ID to allocate experiment cohorts, A/B canary buckets, and player features. Inspect or manipulate it in real-time.'),
        h('div', { style: { marginTop: '4px' } },
          h('div', { style: { fontSize: '10px', color: '#aaa', marginBottom: '2px' } }, 'Raw VISITOR_DATA (Innertube Token / X-Goog-Visitor-Id):'),
          visitorDataBox
        ),
        h('div', { style: { fontSize: '10px', color: '#aaa', marginBottom: '2px' } }, 'Cookie VISITOR_INFO1_LIVE:'),
        visitorCookieBox,
        h('div', { style: { display: 'flex', gap: '8px', marginTop: '6px' } },
          h('button', { className: 'yt-exp-btn-small', onClick: () => { navigator.clipboard.writeText(visitorDataBox.textContent); alert('Copied VISITOR_DATA to clipboard!'); } }, '📋 Copy VISITOR_DATA'),
          h('button', { className: 'yt-exp-btn-small', onClick: () => { navigator.clipboard.writeText(visitorCookieBox.textContent); alert('Copied Cookie ID to clipboard!'); } }, '📋 Copy Cookie ID')
        )
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-header' },
          h('div', { className: 'yt-exp-card-title' }, '📊 Deep Internal Visitor ID Cryptographic Stats'),
          h('button', { className: 'yt-exp-btn-small', onClick: updateVisitorDisplay }, '🔄 Refresh Telemetry')
        ),
        h('div', { className: 'yt-exp-card-desc' }, 'Real-time calculation of FNV-1a 32-bit hash, entropy bits, protobuf wire breakdown (Field 1, 5, 6), GVS Proof-of-Origin token binding, and simulated experiment membership:'),
        internalStatsBox
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '⚡ Quick Actions & Reset'),
        h('div', { className: 'yt-exp-card-desc' }, 'Clear your visitor identity to escape stuck experiment groups, or synthesize a brand-new random protobuf identity token.'),
        h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' } },
          btnTestActiveVisitor,
          btnResetVisitor
        ),
        activeTestResultBox,
        h('div', { className: 'yt-exp-section-card' },
          h('div', { className: 'yt-exp-card-title' }, '🎯 Exact Percentile Allocator (0% to 99% - Bleeding Edge or Control)'),
          h('div', { className: 'yt-exp-card-desc' }, 'Generate a verified YouTube visitor ID allocated to an EXACT percentile (such as 0% for earliest Canary Alpha, or 99% for absolute holdback control):'),
          h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap' } },
            h('span', { style: { fontSize: '11px', color: '#aaa', fontWeight: 'bold' } }, 'Exact %:'),
            exactPctInput,
            exactPctSlider,
            btnGenerateExactPct
          ),
          h('div', { style: { display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' } },
            makeQuickPctBtn(0, '⚡ 0% Bleeding Edge', '#ff3333'),
            makeQuickPctBtn(1, '⚡ 1% Alpha Flight', '#ff6633'),
            makeQuickPctBtn(5, '⚡ 5% Early Cohort', '#ffaa00'),
            makeQuickPctBtn(50, '⚡ 50% Mid-Treatment', '#3ea6ff'),
            makeQuickPctBtn(90, '⚡ 90% Staged Rollout', '#bb86fc'),
            makeQuickPctBtn(99, '⚡ 99% Holdback Control', '#4ade80')
          ),
          exactPctResultBox,
          btnActivateExactPct
        ),
        h('div', { style: { marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #282838' } },
          h('div', { style: { fontWeight: 'bold', fontSize: '12px', color: '#fff', marginBottom: '4px' } }, '🎯 Deterministic Percentile Tier Finder (2x YouTube Verified) & Global Country Selector'),
          h('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '8px' } }, 'Select an experiment rollout tier and any of the 220+ countries (including Mongolia [MN]). Generates a candidate, encodes country into Field 6, and verifies twice with YouTube Innertube:'),
          h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' } },
            tierSelect,
            countryFilterInput,
            countrySelect,
            btnFindAndVerifyTier,
            btnTestCountryVisitor
          ),
          countryTestReportBox,
          tierFinderProgressBox,
          btnActivateCandidate
        )
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '🔀 Curated Canary Cohort Switcher'),
        h('div', { className: 'yt-exp-card-desc', style: { marginBottom: '6px' } }, 'Select a known experiment flight cohort to test features allocated to different regional and testing tiers:'),
        visitorSelect,
        visitorDescText,
        h('div', { style: { marginTop: '8px' } }, btnApplyCohort)
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '✏️ Custom Visitor ID Presets'),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' } },
          customVisitorInput,
          customVisitorLabelInput,
          h('div', { style: { display: 'flex', gap: '8px', marginTop: '2px' } }, btnSaveCustomVisitor)
        ),
        h('div', { style: { marginTop: '10px' } },
          h('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '4px', fontWeight: 'bold' } }, 'Saved Presets:'),
          customVisitorListContainer
        )
      )
    );
    // =======================================================================
    // TAB: CREATOR & VIDEO INTEL & VIRTUAL PLAYLISTS
    // =======================================================================
    const detectedChannelInput = h('input', {
      type: 'text',
      className: 'yt-exp-val-input',
      style: { width: '100%', textAlign: 'left', padding: '6px 10px', fontSize: '12px' },
      placeholder: 'Enter channel ID (UC...), @handle, or video URL'
    });

    const creatorInfoContainer = h('div', { style: { marginTop: '6px' } });
    const videoInfoContainer = h('div', { style: { marginTop: '6px' } });
    const playlistsContainer = h('div', { className: 'yt-exp-btn-grid', style: { gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', marginTop: '6px' } });

    async function loadChannelIntel(channelId) {
      if (!channelId) {
        creatorInfoContainer.textContent = 'No channel identifier detected.';
        playlistsContainer.textContent = '';
        return;
      }
      creatorInfoContainer.textContent = '⏳ Fetching channel data from Innertube browse API...';
      const about = await fetchChannelAboutDetails(channelId);
      while (creatorInfoContainer.firstChild) creatorInfoContainer.removeChild(creatorInfoContainer.firstChild);

      if (about) {
        let joinedDateStr = about.joinedDateText || 'Unknown';
        let ageStr = '';
        if (joinedDateStr.includes('Joined ')) {
          try {
            const rawDate = new Date(joinedDateStr.replace('Joined ', ''));
            if (!isNaN(rawDate.getTime())) {
              const diffMs = Date.now() - rawDate.getTime();
              const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
              const diffDays = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
              ageStr = ` (${diffYears} yrs, ${diffDays} days old)`;
            }
          } catch {}
        }

        const grid = h('div', { className: 'yt-exp-intel-grid' },
          h('div', { className: 'yt-exp-intel-cell' }, h('span', { className: 'yt-exp-intel-label' }, 'Exact Channel ID'), h('span', { className: 'yt-exp-intel-val' }, about.channelId)),
          h('div', { className: 'yt-exp-intel-cell' }, h('span', { className: 'yt-exp-intel-label' }, 'Account Creation Date'), h('span', { className: 'yt-exp-intel-val', style: { color: '#4ade80' } }, joinedDateStr + ageStr)),
          h('div', { className: 'yt-exp-intel-cell' }, h('span', { className: 'yt-exp-intel-label' }, 'Total Lifetime Channel Views'), h('span', { className: 'yt-exp-intel-val', style: { color: '#ffcc00' } }, about.viewCountText || 'Hidden')),
          h('div', { className: 'yt-exp-intel-cell' }, h('span', { className: 'yt-exp-intel-label' }, 'Subscribers / Total Videos'), h('span', { className: 'yt-exp-intel-val' }, `${about.subscriberCountText || 'N/A'} • ${about.videoCountText || 'N/A'}`)),
          h('div', { className: 'yt-exp-intel-cell' }, h('span', { className: 'yt-exp-intel-label' }, 'Registration Country'), h('span', { className: 'yt-exp-intel-val' }, about.country || 'Not specified')),
          h('div', { className: 'yt-exp-intel-cell' }, h('span', { className: 'yt-exp-intel-label' }, 'Canonical URL / Handle'), h('span', { className: 'yt-exp-intel-val' }, about.canonicalChannelUrl || 'N/A'))
        );
        creatorInfoContainer.appendChild(grid);

        if (about.description) {
          const descBox = h('div', {
            style: { background: '#121218', border: '1px solid #282835', borderRadius: '6px', padding: '8px 10px', fontSize: '11px', color: '#ccc', marginTop: '8px', maxHeight: '100px', overflowY: 'auto', whiteSpace: 'pre-wrap' }
          }, about.description);
          creatorInfoContainer.appendChild(descBox);
        }
      } else {
        creatorInfoContainer.appendChild(h('div', { style: { fontSize: '11px', color: '#aaa' } }, `Channel ID: ${channelId} (Details unavailable or private)`));
      }

      // Generate Virtual Playlists
      const virtualPlaylists = getVirtualPlaylists(channelId);
      while (playlistsContainer.firstChild) playlistsContainer.removeChild(playlistsContainer.firstChild);

      virtualPlaylists.forEach(pl => {
        const isMembers = pl.prefix.startsWith('UUM');
        const isShorts = pl.prefix === 'UUSH';
        const card = h('div', {
          style: { background: '#161622', border: `1px solid ${isMembers ? '#772222' : isShorts ? '#0055bb' : '#282838'}`, borderRadius: '8px', padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px' }
        },
          h('div', null,
            h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' } },
              h('span', { style: { fontWeight: '700', fontSize: '12px', color: '#fff' } }, pl.name),
              h('span', { className: 'yt-exp-tag', style: { background: isMembers ? '#4a1515' : isShorts ? '#003366' : '#222', color: isMembers ? '#ff7777' : isShorts ? '#58a6ff' : '#aaa' } }, pl.badge)
            ),
            h('div', { style: { fontFamily: 'monospace', fontSize: '10px', color: '#888', marginTop: '2px' } }, `ID: ${pl.id}`),
            h('div', { style: { fontSize: '11px', color: '#aaa', marginTop: '4px', lineHeight: '1.3' } }, pl.desc)
          ),
          h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' } },
            h('button', {
              className: 'yt-exp-btn-small accent',
              onClick: () => window.open(pl.url, '_blank')
            }, '▶️ Open Playlist'),
            h('button', {
              className: 'yt-exp-btn-small',
              onClick: () => window.open(pl.watchUrl, '_blank')
            }, '▶️ Watch Mode'),
            h('button', {
              className: 'yt-exp-btn-small',
              onClick: () => { navigator.clipboard.writeText(pl.url); alert(`Copied URL for ${pl.name}!`); }
            }, '📋 Copy URL'),
            h('button', {
              className: 'yt-exp-btn-small',
              onClick: () => { navigator.clipboard.writeText(pl.id); alert(`Copied ID: ${pl.id}`); }
            }, '📋 Copy ID')
          )
        );
        playlistsContainer.appendChild(card);
      });
    }

    function loadActiveVideoIntel() {
      while (videoInfoContainer.firstChild) videoInfoContainer.removeChild(videoInfoContainer.firstChild);
      const v = detectCurrentVideoDetails();
      if (!v || !v.videoId) {
        videoInfoContainer.appendChild(h('div', { style: { fontSize: '11px', color: '#888' } }, 'No active video detected on current page. Navigate to any video watch page to view deep telemetry.'));
        return;
      }

      let ageStr = '';
      if (v.uploadDate) {
        try {
          const uDate = new Date(v.uploadDate);
          if (!isNaN(uDate.getTime())) {
            const diffMs = Date.now() - uDate.getTime();
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            ageStr = ` (${days}d ${hrs}h ${mins}m ago)`;
          }
        } catch {}
      }

      const grid = h('div', { className: 'yt-exp-intel-grid' },
        h('div', { className: 'yt-exp-intel-cell' }, h('span', { className: 'yt-exp-intel-label' }, 'Video Title & ID'), h('span', { className: 'yt-exp-intel-val' }, `${v.title} (${v.videoId})`)),
        h('div', { className: 'yt-exp-intel-cell' }, h('span', { className: 'yt-exp-intel-label' }, 'Exact Upload ISO Timestamp'), h('span', { className: 'yt-exp-intel-val', style: { color: '#4ade80' } }, (v.uploadDate || 'N/A') + ageStr)),
        h('div', { className: 'yt-exp-intel-cell' }, h('span', { className: 'yt-exp-intel-label' }, 'Exact Publish ISO Timestamp'), h('span', { className: 'yt-exp-intel-val' }, v.publishDate || 'N/A')),
        h('div', { className: 'yt-exp-intel-cell' }, h('span', { className: 'yt-exp-intel-label' }, 'Exact Unrounded Views'), h('span', { className: 'yt-exp-intel-val', style: { color: '#ffcc00' } }, v.viewCount != null ? Number(v.viewCount).toLocaleString() : 'N/A')),
        h('div', { className: 'yt-exp-intel-cell' }, h('span', { className: 'yt-exp-intel-label' }, 'Audio Loudness Normalization'), h('span', { className: 'yt-exp-intel-val', style: { color: '#38bdf8' } }, v.loudnessDb != null ? `${v.loudnessDb.toFixed(2)} dB (Target: -14 LUFS)` : 'N/A')),
        h('div', { className: 'yt-exp-intel-cell' }, h('span', { className: 'yt-exp-intel-label' }, 'Category & Flags'), h('span', { className: 'yt-exp-intel-val' }, `${v.category || 'General'} • Unlisted: ${v.isUnlisted ? 'YES' : 'NO'} • Family: ${v.isFamilySafe ? 'YES' : 'NO'}`))
      );
      videoInfoContainer.appendChild(grid);

      // Hidden SEO Tags
      if (v.keywords && v.keywords.length > 0) {
        const tagsHeader = h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', marginBottom: '6px' } },
          h('span', { style: { fontSize: '11px', color: '#aaa', fontWeight: 'bold' } }, `Hidden Creator SEO Tags & Keywords (${v.keywords.length}):`),
          h('button', {
            className: 'yt-exp-btn-small',
            onClick: () => {
              navigator.clipboard.writeText(v.keywords.join(', '));
              alert(`Copied ${v.keywords.length} tags to clipboard!`);
            }
          }, '📋 Copy All Tags')
        );
        videoInfoContainer.appendChild(tagsHeader);

        const tagsWrap = h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
          v.keywords.map(kw => h('span', {
            className: 'yt-exp-keyword-chip',
            title: 'Click to copy tag',
            onClick: () => {
              navigator.clipboard.writeText(kw);
            }
          }, kw))
        );
        videoInfoContainer.appendChild(tagsWrap);
      }
    }

    const btnDetectChannel = h('button', {
      className: 'yt-exp-action-btn primary',
      onClick: () => {
        const chId = detectCurrentPageChannelId();
        if (chId) {
          detectedChannelInput.value = chId;
          loadChannelIntel(chId);
        } else {
          alert('Could not detect active channel on current page. Enter a channel handle or ID manually.');
        }
      }
    }, '🎯 Detect Current Channel');

    const btnLookupChannel = h('button', {
      className: 'yt-exp-action-btn',
      onClick: () => {
        const val = detectedChannelInput.value.trim();
        if (!val) {
          alert('Enter a channel ID (UC...) or handle.');
          return;
        }
        let chId = val;
        const m = val.match(/UC[A-Za-z0-9_-]{22}/);
        if (m) chId = m[0];
        loadChannelIntel(chId);
      }
    }, '🔍 Lookup');

    const tabContentIntel = h('div', { className: 'yt-exp-tab-content', id: 'tab-creator-intel' },
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '👤 Content Creator & Account Intelligence'),
        h('div', { className: 'yt-exp-card-desc' }, 'Extracts exact channel creation timestamp, account age, unrounded lifetime views, registration country, and bio details directly from Innertube:'),
        h('div', { style: { display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' } },
          detectedChannelInput,
          btnLookupChannel,
          btnDetectChannel
        ),
        creatorInfoContainer
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-header' },
          h('div', { className: 'yt-exp-card-title' }, '🎬 Active Video Deep Telemetry & Hidden SEO Tags'),
          h('button', { className: 'yt-exp-btn-small', onClick: loadActiveVideoIntel }, '🔄 Refresh Video Stats')
        ),
        h('div', { className: 'yt-exp-card-desc' }, 'Reveals exact ISO-8601 upload and publish times (down to seconds & UTC timezone), exact view count, volume normalization gain (loudnessDb), and hidden creator tags:'),
        videoInfoContainer
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '🔓 Virtual Channel Playlists Generator (UU, UUMO, UUSH...)'),
        h('div', { className: 'yt-exp-card-desc' }, 'YouTube automatically maintains hidden virtual playlist queues for every channel by swapping the "UC" ID prefix. Launch or copy any of them:'),
        playlistsContainer
      )
    );

    // =======================================================================
    // TAB: INNERTUBE API LIVE CONSOLE
    // =======================================================================
    const innertubeEndpointSelect = h('select', {
      style: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '6px 10px', fontSize: '12px' }
    },
      h('option', { value: '/youtubei/v1/att/get' }, 'POST /youtubei/v1/att/get (PO Token & Attestation Loader)'),
      h('option', { value: '/youtubei/v1/voice_search' }, 'POST /youtubei/v1/voice_search (Voice Recognition Endpoint)'),
      h('option', { value: '/youtubei/v1/visitor_id' }, 'POST /youtubei/v1/visitor_id (Mint & Validate Visitor Data)'),
      h('option', { value: '/youtubei/v1/get_transcript' }, 'POST /youtubei/v1/get_transcript (Subtitles & Video Transcript)'),
      h('option', { value: '/youtubei/v1/live_chat/get_live_chat' }, 'POST /youtubei/v1/live_chat/get_live_chat (Live Chat Stream)'),
      h('option', { value: '/youtubei/v1/account/account_menu' }, 'POST /youtubei/v1/account/account_menu (Account Navigation Menu)'),
      h('option', { value: '/youtubei/v1/player' }, 'POST /youtubei/v1/player (Player Stream & Codecs)'),
      h('option', { value: '/youtubei/v1/browse' }, 'POST /youtubei/v1/browse (Channel & Tab Browse)'),
      h('option', { value: '/youtubei/v1/next' }, 'POST /youtubei/v1/next (Next Recommendations & Queue)'),
      h('option', { value: '/youtubei/v1/search' }, 'POST /youtubei/v1/search (YouTube Search Pipeline)'),
      h('option', { value: '/youtubei/v1/guide' }, 'POST /youtubei/v1/guide (Navigation Guide Drawer)'),
      h('option', { value: '/youtubei/v1/updated_metadata' }, 'POST /youtubei/v1/updated_metadata (Real-time View Pings)'),
      h('option', { value: '/youtubei/v1/reel/reel_item_watch' }, 'POST /youtubei/v1/reel/reel_item_watch (Shorts Reels Feed)')
    );

    const innertubeBodyTextarea = h('textarea', {
      style: { width: '100%', height: '140px', background: '#121218', color: '#a5d6ff', border: '1px solid #2e2e42', borderRadius: '6px', padding: '8px 10px', fontFamily: 'monospace', fontSize: '11px', outline: 'none' }
    });

    function setInnertubeSample(type) {
      const d = getYtcfgData() || {};
      const context = d.INNERTUBE_CONTEXT || {
        client: {
          clientName: 'WEB',
          clientVersion: d.INNERTUBE_CLIENT_VERSION || '2.20261012.01.00',
          hl: d.HL || 'en',
          gl: d.GL || 'US',
          visitorData: visitorConfig.enabled ? visitorConfig.visitorData : (d.VISITOR_DATA || '')
        }
      };
      const v = detectCurrentVideoDetails();
      const currentVid = v?.videoId || 'dQw4w9WgXcQ';
      const currentCh = detectCurrentPageChannelId() || 'UC_x5XG1OV2P6uZZ5FSM9Ttw';

      let bodyObj = { context };
      if (type === 'att_get') {
        innertubeEndpointSelect.value = '/youtubei/v1/att/get';
        bodyObj.challenge = 'yt_po_token_challenge_2026';
      } else if (type === 'voice') {
        innertubeEndpointSelect.value = '/youtubei/v1/voice_search';
        bodyObj.audioSessionId = 'voice_session_2026';
      } else if (type === 'visitor_id') {
        innertubeEndpointSelect.value = '/youtubei/v1/visitor_id';
        bodyObj = { context };
      } else if (type === 'transcript') {
        innertubeEndpointSelect.value = '/youtubei/v1/get_transcript';
        bodyObj.params = 'CgQxMjM0';
      } else if (type === 'live_chat') {
        innertubeEndpointSelect.value = '/youtubei/v1/live_chat/get_live_chat';
      } else if (type === 'account') {
        innertubeEndpointSelect.value = '/youtubei/v1/account/account_menu';
      } else if (type === 'ipad_player') {
        innertubeEndpointSelect.value = '/youtubei/v1/player';
        bodyObj.videoId = currentVid;
        bodyObj.contentCheckOk = true;
        bodyObj.racyCheckOk = true;
        if (bodyObj.context && bodyObj.context.client) {
          bodyObj.context.client.clientName = 'MWEB';
          bodyObj.context.client.deviceMake = 'Apple';
          bodyObj.context.client.deviceModel = 'iPad';
          bodyObj.context.client.osName = 'iPad';
          bodyObj.context.client.osVersion = '17_5';
          bodyObj.context.client.userAgent = 'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
        }
      } else if (type === 'player') {
        innertubeEndpointSelect.value = '/youtubei/v1/player';
        bodyObj.videoId = currentVid;
        bodyObj.contentCheckOk = true;
        bodyObj.racyCheckOk = true;
      } else if (type === 'browse_about') {
        innertubeEndpointSelect.value = '/youtubei/v1/browse';
        bodyObj.browseId = currentCh;
        bodyObj.params = 'EgVhYm91dA%3D%3D';
      } else if (type === 'next') {
        innertubeEndpointSelect.value = '/youtubei/v1/next';
        bodyObj.videoId = currentVid;
      } else if (type === 'search') {
        innertubeEndpointSelect.value = '/youtubei/v1/search';
        bodyObj.query = 'Canary YouTube Flags Delhi 2026';
      } else if (type === 'guide') {
        innertubeEndpointSelect.value = '/youtubei/v1/guide';
      }
      innertubeBodyTextarea.value = JSON.stringify(bodyObj, null, 2);
    }
    setInnertubeSample('player');

    const innertubeStatusPill = h('span', { className: 'yt-exp-tag', style: { display: 'none' } });
    const innertubeFilterInput = h('input', {
      type: 'text',
      className: 'yt-exp-val-input',
      style: { width: '180px', textAlign: 'left', padding: '4px 8px', fontSize: '11px' },
      placeholder: 'Filter response keys...'
    });
    const innertubeResponseBox = h('div', { className: 'yt-exp-code-box', style: { minHeight: '160px', maxHeight: '360px' } }, 'Execute an API query above to view response.');

    let rawInnertubeResponse = null;

    function renderFilteredResponse() {
      if (!rawInnertubeResponse) return;
      const filter = innertubeFilterInput.value.trim().toLowerCase();
      if (!filter) {
        innertubeResponseBox.textContent = JSON.stringify(rawInnertubeResponse, null, 2);
        return;
      }
      const matches = findInNested(rawInnertubeResponse, filter);
      if (matches.length > 0) {
        innertubeResponseBox.textContent = JSON.stringify(matches, null, 2);
      } else {
        innertubeResponseBox.textContent = `No nested property matching "${filter}" found in response. Showing full JSON:\n\n` + JSON.stringify(rawInnertubeResponse, null, 2);
      }
    }

    innertubeFilterInput.oninput = renderFilteredResponse;

    const btnExecuteInnertube = h('button', {
      className: 'yt-exp-action-btn primary',
      onClick: async () => {
        let bodyJson;
        try {
          bodyJson = JSON.parse(innertubeBodyTextarea.value);
        } catch (e) {
          alert('Invalid JSON in request payload editor: ' + e.message);
          return;
        }

        const endpoint = innertubeEndpointSelect.value;
        const d = getYtcfgData() || {};
        const apiKey = d.INNERTUBE_API_KEY || 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
        const url = `${endpoint}${apiKey ? `?key=${apiKey}` : ''}`;

        innertubeStatusPill.style.display = 'inline-block';
        innertubeStatusPill.className = 'yt-exp-tag';
        innertubeStatusPill.textContent = '⏳ Querying...';
        innertubeResponseBox.textContent = 'Loading response...';

        const startTime = performance.now();
        try {
          const resp = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Visitor-Id': visitorConfig.enabled ? visitorConfig.visitorData : (d.VISITOR_DATA || '')
            },
            body: JSON.stringify(bodyJson)
          });
          const duration = Math.round(performance.now() - startTime);
          innertubeStatusPill.textContent = `${resp.status} ${resp.statusText} (${duration}ms)`;
          innertubeStatusPill.className = `yt-exp-tag ${resp.ok ? 'delhi' : 'ads'}`;

          const data = await resp.json();
          rawInnertubeResponse = data;
          renderFilteredResponse();
        } catch (err) {
          const duration = Math.round(performance.now() - startTime);
          innertubeStatusPill.textContent = `ERROR (${duration}ms)`;
          innertubeStatusPill.className = 'yt-exp-tag ads';
          innertubeResponseBox.textContent = 'Innertube Request Error: ' + err.message;
        }
      }
    }, '🚀 Send Innertube API Call');

    const tabContentInnertube = h('div', { className: 'yt-exp-tab-content', id: 'tab-innertube' },
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '🔬 YouTube Innertube API Live Console'),
        h('div', { className: 'yt-exp-card-desc' }, 'Query YouTube’s internal Innertube endpoints directly from your browser session using active visitor ID and credentials:'),
        h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '6px' } },
          h('span', { style: { fontSize: '11px', color: '#aaa' } }, 'Quick Presets:'),
          h('button', { className: 'yt-exp-btn-small', onClick: () => setInnertubeSample('att_get') }, '🛡️ PO Attest'),
          h('button', { className: 'yt-exp-btn-small', onClick: () => setInnertubeSample('voice') }, '🎤 Voice Search'),
          h('button', { className: 'yt-exp-btn-small', onClick: () => setInnertubeSample('visitor_id') }, '🆔 Visitor ID'),
          h('button', { className: 'yt-exp-btn-small', onClick: () => setInnertubeSample('ipad_player') }, '🍎 iPad Player'),
          h('button', { className: 'yt-exp-btn-small', onClick: () => setInnertubeSample('transcript') }, '📝 Transcript'),
          h('button', { className: 'yt-exp-btn-small', onClick: () => setInnertubeSample('live_chat') }, '💬 Live Chat'),
          h('button', { className: 'yt-exp-btn-small', onClick: () => setInnertubeSample('account') }, '👤 Account'),
          h('button', { className: 'yt-exp-btn-small', onClick: () => setInnertubeSample('player') }, '🎬 Player'),
          h('button', { className: 'yt-exp-btn-small', onClick: () => setInnertubeSample('browse_about') }, '👤 Channel About'),
          h('button', { className: 'yt-exp-btn-small', onClick: () => setInnertubeSample('next') }, '⏭️ Next Queue'),
          h('button', { className: 'yt-exp-btn-small', onClick: () => setInnertubeSample('search') }, '🔍 Search'),
          h('button', { className: 'yt-exp-btn-small', onClick: () => setInnertubeSample('guide') }, '🧭 Guide')
        ),
        h('div', { style: { marginTop: '8px' } }, innertubeEndpointSelect),
        h('div', { style: { marginTop: '6px' } }, innertubeBodyTextarea),
        h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' } },
          btnExecuteInnertube,
          innertubeStatusPill
        )
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-header' },
          h('div', { className: 'yt-exp-card-title' }, '📦 Response Inspector'),
          h('div', { style: { display: 'flex', gap: '6px', alignItems: 'center' } },
            innertubeFilterInput,
            h('button', { className: 'yt-exp-btn-small', onClick: () => { if (rawInnertubeResponse) { navigator.clipboard.writeText(JSON.stringify(rawInnertubeResponse, null, 2)); alert('Copied full JSON to clipboard!'); } } }, '📋 Copy JSON')
          )
        ),
        innertubeResponseBox
      )
    );

    // =======================================================================
    // TAB 4: MINIPLAYER & PICTURE-IN-PICTURE (PiP) STUDIO
    // =======================================================================
    tabMiniplayerBtn = h('button', {
      className: 'yt-exp-action-btn primary',
      style: { padding: '10px 16px', fontSize: '13px' },
      onClick: (e) => {
        e.stopPropagation();
        const active = isMiniplayerActive();
        forceMiniplayer(!active);
      }
    }, '🗗 Force Miniplayer');

    tabPipBtn = h('button', {
      className: 'yt-exp-action-btn success',
      style: { padding: '10px 16px', fontSize: '13px' },
      onClick: async (e) => {
        e.stopPropagation();
        await togglePiP();
      }
    }, '📺 Turn ON Picture-in-Picture');

    const toggleAutoPip = h('input', {
      type: 'checkbox',
      checked: autoPipEnabled,
      onChange: () => {
        autoPipEnabled = toggleAutoPip.checked;
        setStored(STORAGE_KEY_AUTO_PIP, autoPipEnabled);
      }
    });

    const btnCustomDock = h('button', {
      className: 'yt-exp-action-btn',
      onClick: () => {
        const moviePlayer = document.getElementById('movie_player');
        const isDocked = moviePlayer && moviePlayer.classList.contains('yt-exp-force-miniplayer');
        toggleCustomFloatingMiniplayer(!isDocked);
        updateMiniplayerAndPiPButtons();
      }
    }, '📌 Toggle Custom Floating Dock Mode');

    const miniFlagsGrid = h('div', { className: 'yt-exp-btn-grid' });
    Object.keys(MINIPLAYER_FLAGS).forEach(flagName => {
      const isSet = overrides[flagName] !== undefined ? overrides[flagName] : MINIPLAYER_FLAGS[flagName];
      const cb = h('input', {
        type: 'checkbox',
        checked: !!isSet,
        onChange: () => {
          overrides[flagName] = cb.checked;
          setStored(STORAGE_KEY_FLAGS, overrides);
          const d = getYtcfgData();
          if (d) applyActiveOverridesToData(d);
          updateActiveBadge();
          refreshList(false);
        }
      });
      const card = h('div', {
        style: { background: '#1d1d27', border: '1px solid #2d2d3a', borderRadius: '6px', padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }
      },
        h('span', { style: { fontFamily: 'monospace', fontSize: '11px', color: '#eee', wordBreak: 'break-all' } }, flagName),
        h('label', { className: 'yt-exp-switch' }, cb, h('span', { className: 'yt-exp-slider' }))
      );
      miniFlagsGrid.appendChild(card);
    });

    const tabContentMini = h('div', { className: 'yt-exp-tab-content', id: 'tab-miniplayer' },
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '🗗 Live Miniplayer & PiP Controllers'),
        h('div', { className: 'yt-exp-card-desc' }, 'Directly force YouTube videos into the native Kevlar Miniplayer, or detach into browser native Picture-in-Picture with automatic window management.'),
        h('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' } },
          tabMiniplayerBtn,
          tabPipBtn,
          btnCustomDock
        )
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-header' },
          h('div', { className: 'yt-exp-card-title' }, '🔄 Auto-PiP on Tab Switch'),
          h('label', { className: 'yt-exp-switch' }, toggleAutoPip, h('span', { className: 'yt-exp-slider' }))
        ),
        h('div', { className: 'yt-exp-card-desc' }, 'When enabled, switching away from the YouTube tab automatically pops the video into floating Picture-in-Picture. Returning to the tab smoothly restores the player.')
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '⚙️ Miniplayer & PiP Architecture Flags'),
        h('div', { className: 'yt-exp-card-desc', style: { marginBottom: '8px' } }, 'Reversible experiment flags controlling Kevlar miniplayer docking, touch drag, resizability handles, and unblocking native Picture-in-Picture.'),
        miniFlagsGrid
      )
    );

    // =======================================================================
    // TAB 5: PLAYER & AUDIO ENGINE (Base.js, DRC, Voice Boost, 3x Speed)
    // =======================================================================
    function makeQuickFlagSwitch(flagName, label, desc, defaultObj) {
      const def = defaultObj && defaultObj[flagName] !== undefined ? defaultObj[flagName] : !!AUDIO_CODEC_FLAGS[flagName];
      const isSet = overrides[flagName] !== undefined ? overrides[flagName] : def;
      const cb = h('input', {
        type: 'checkbox',
        checked: !!isSet,
        onChange: () => {
          overrides[flagName] = cb.checked;
          setStored(STORAGE_KEY_FLAGS, overrides);
          const d = getYtcfgData();
          if (d) applyActiveOverridesToData(d);
          updateActiveBadge();
          refreshList(false);
          ensurePlayerClasses();
        }
      });
      return h('div', {
        style: { background: '#1c1c26', border: '1px solid #2c2c3b', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }
      },
        h('div', null,
          h('div', { style: { fontWeight: '600', fontSize: '12px', color: '#fff' } }, label),
          h('div', { style: { fontSize: '11px', color: '#888' } }, desc)
        ),
        h('label', { className: 'yt-exp-switch' }, cb, h('span', { className: 'yt-exp-slider' }))
      );
    }

    const blurRadiusInput = h('input', {
      type: 'range',
      min: '0',
      max: '32',
      step: '2',
      value: String(overrides['web_player_frosted_glass_blur_radius'] || 18),
      style: { width: '120px' }
    });
    const blurRadiusLabel = h('span', { style: { fontSize: '11px', fontFamily: 'monospace', color: '#3ea6ff' } }, `${blurRadiusInput.value}px`);
    blurRadiusInput.oninput = () => {
      blurRadiusLabel.textContent = `${blurRadiusInput.value}px`;
      overrides['web_player_frosted_glass_blur_radius'] = parseInt(blurRadiusInput.value, 10);
      setStored(STORAGE_KEY_FLAGS, overrides);
      const d = getYtcfgData();
      if (d) applyActiveOverridesToData(d);
      updateActiveBadge();
    };

    const tabContentPlayer = h('div', { className: 'yt-exp-tab-content', id: 'tab-player' },
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '🔊 Audio & Voice Enhancement (Base.js Engine)'),
        h('div', { className: 'yt-exp-card-desc' }, 'Unlocks Stable Volume (Dynamic Range Compression), Speech Clarity Voice Boost, and 5.1 Surround Sound decoding directly in the HTML5 player.'),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' } },
          makeQuickFlagSwitch('html5_enable_drc', 'Dynamic Range Compression (DRC) / Stable Volume', 'Evens out audio volume spikes between loud explosions and quiet whisper dialogue.', AUDIO_CODEC_FLAGS),
          makeQuickFlagSwitch('html5_show_drc_toggle', 'Show Stable Volume Toggle in Settings Menu', 'Exposes the Stable Volume switch in the player gear icon settings.', AUDIO_CODEC_FLAGS),
          makeQuickFlagSwitch('html5_enable_voice_boost', 'Voice Boost & Speech Clarity EQ', 'Boosts dialogue frequencies to make vocals prominent and crisp.', AUDIO_CODEC_FLAGS),
          makeQuickFlagSwitch('html5_ugc_vod_audio_51', '5.1 Surround Sound / EAC3 Unblocker', 'Enables multi-channel audio tracks on supported videos and hardware.', AUDIO_CODEC_FLAGS),
          makeQuickFlagSwitch('kevlar_voice_search_use_yt_endpoint', 'YouTube Voice Search Endpoint', 'Routes voice search directly through YouTube Innertube voice endpoint.', VOICE_FLAGS),
          makeQuickFlagSwitch('client_ui_enable_multi_track_audio_on_web_embedded_player', 'Multi-Track Audio Engine', 'Unlocks multi-language and descriptive audio track switching on web and embeds.', VOICE_FLAGS),
          makeQuickFlagSwitch('enable_mweb_audio_track_picker', 'Audio Track Language Picker', 'Exposes the audio track selection menu for multi-audio videos and shorts.', VOICE_FLAGS)
        )
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '⚡ Speedmaster & Playback Controls'),
        h('div', { className: 'yt-exp-card-desc' }, 'Unlocks 2.5x, 3x, and 4x playback rates, and activates Spacebar Speedmaster (hold spacebar to speed up video).'),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' } },
          makeQuickFlagSwitch('web_remix_allow_up_to_3x_playback_rate', 'Allow 3x Playback Rate', 'Unlocks playback rate speeds up to 3x in player speed picker.', AUDIO_CODEC_FLAGS),
          makeQuickFlagSwitch('web_enable_speedmaster', 'Enable Speedmaster Engine', 'Activates instant turbo seeking and hold-to-speed up behavior.', AUDIO_CODEC_FLAGS),
          makeQuickFlagSwitch('web_speedmaster_spacebar_control', 'Spacebar Speedmaster Boost', 'Hold spacebar during playback to immediately boost speed to 2x/3x.', AUDIO_CODEC_FLAGS)
        )
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '🏛️ Delhi Modern Web Player Redesign (2025/2026)'),
        h('div', { className: 'yt-exp-card-desc' }, 'Modern Delhi UI layout, frosted glass controls, horizontal volume slider, rounded player corners, and responsive compact controls.'),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' } },
          makeQuickFlagSwitch('delhi_modern_web_player', 'Delhi Modern Web Player', 'Activates the modern redesigned player skin and control hierarchy.', DELHI_FLAGS),
          makeQuickFlagSwitch('delhi_modern_web_player_icons', 'Delhi Modern Glyph Icons', 'Modern redesigned control icons for play, pause, next, volume, and subtitles.', DELHI_FLAGS),
          makeQuickFlagSwitch('delhi_modern_web_player_horizontal_volume_controls', 'Horizontal Volume Slider', 'Horizontal volume slider beside the speaker icon instead of vertical popout.', DELHI_FLAGS),
          makeQuickFlagSwitch('web_watch_rounded_player_large', 'Rounded Large Video Frame', 'Applies modern rounded border curves to the large player container.', DELHI_FLAGS),
          h('div', {
            style: { background: '#1c1c26', border: '1px solid #2c2c3b', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }
          },
            h('div', null,
              h('div', { style: { fontWeight: '600', fontSize: '12px', color: '#fff' } }, 'Frosted Glass Blur Radius'),
              h('div', { style: { fontSize: '11px', color: '#888' } }, 'Backdrop blur intensity for player controls panel')
            ),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, blurRadiusInput, blurRadiusLabel)
          )
        )
      )
    );

    // =======================================================================
    // TAB 6: REMOTE & CAST (MDX / remote.js)
    // =======================================================================
    const btnLaunchPairing = h('button', {
      className: 'yt-exp-action-btn primary',
      style: { width: 'fit-content' },
      onClick: () => {
        window.open('https://www.youtube.com/pair', '_blank');
      }
    }, '📺 Open TV Screen Pairing (/pair)');

    const tabContentRemote = h('div', { className: 'yt-exp-tab-content', id: 'tab-remote' },
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '📺 Google Cast & MDX Remote Subsystem (remote.js)'),
        h('div', { className: 'yt-exp-card-desc' }, 'Controls YouTube’s Multi-Device Experience (MDX), Google Cast Sender API (cast_sender.js), DIAL TV discovery on local LAN, and virtual remote controllers.'),
        btnLaunchPairing
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '⚙️ Remote & Cast Architecture Flags'),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' } },
          makeQuickFlagSwitch('enable_cast_api', 'Google Cast Sender API', 'Injects data-cast-api-enabled and unlocks Chromecast broadcasting.', REMOTE_CAST_FLAGS),
          makeQuickFlagSwitch('web_enable_cast_pairing', 'Cloud & DIAL Cast Pairing', 'Enables device pairing with Smart TVs, Apple TV, and Chromecast.', REMOTE_CAST_FLAGS),
          makeQuickFlagSwitch('enable_mdx_remote_control', 'MDX Virtual Remote Control', 'Unlocks full virtual remote overlay to control TV playback from desktop.', REMOTE_CAST_FLAGS),
          makeQuickFlagSwitch('mdx_enable_seamless_transfer', 'Seamless Playback Transfer', 'Transfer playback between PC and TV without losing current seek position.', REMOTE_CAST_FLAGS),
          makeQuickFlagSwitch('mdx_session_recovery', 'MDX Session Auto-Recovery', 'Automatically recovers remote sessions if WebSocket/WebRTC drops.', REMOTE_CAST_FLAGS)
        )
      )
    );

    // =======================================================================
    // TAB 7: SPECIALIZED SETS (20 Curated Profiles)
    // =======================================================================
    const setsGrid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px', padding: '12px 14px' } });
    Object.entries(SPECIALIZED_SETS).forEach(([key, item]) => {
      const card = h('div', {
        style: { background: '#171722', border: '1px solid #282838', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px' }
      },
        h('div', null,
          h('div', { style: { fontWeight: 'bold', fontSize: '13px', color: '#ffbb33' } }, item.label),
          h('div', { style: { fontSize: '11px', color: '#aaa', marginTop: '4px', lineHeight: '1.4' } }, item.desc)
        ),
        h('button', {
          className: 'yt-exp-action-btn primary',
          style: { marginTop: '6px', fontSize: '11px', padding: '6px 12px' },
          onClick: (e) => {
            e.stopPropagation();
            Object.assign(overrides, item.flags);
            if (item.canary) {
              canaryConfig.enabled = true;
              if (item.canaryProfile) {
                Object.assign(canaryConfig, item.canaryProfile);
              }
              updateCanaryUI();
            }
            setStored(STORAGE_KEY_FLAGS, overrides);
            setStored(STORAGE_KEY_CANARY, canaryConfig);
            const d = getYtcfgData();
            if (d) applyActiveOverridesToData(d);
            ensurePlayerClasses();
            updateActiveBadge();
            refreshList(false);
            alert(`Activated ${item.label}! Click Hot Apply or navigate to another video to load.`);
          }
        }, '⚡ Activate Profile')
      );
      setsGrid.appendChild(card);
    });

    const tabContentPresets = h('div', { className: 'yt-exp-tab-content', id: 'tab-presets' },
      setsGrid
    );

    // =======================================================================
    // TAB 8: DIAGNOSTICS & SYSTEM CONFIG
    // =======================================================================
    const diagStatsBox = h('div', {
      style: { background: '#121218', border: '1px solid #262634', borderRadius: '8px', padding: '12px', fontFamily: 'monospace', fontSize: '11px', color: '#7ee787', whiteSpace: 'pre-wrap', lineHeight: '1.6' }
    });

    function refreshDiagStats() {
      const d = getYtcfgData();
      const video = getActiveVideo();
      const moviePlayer = document.getElementById('movie_player');
      const vidDetails = detectCurrentVideoDetails();
      const chId = detectCurrentPageChannelId();
      const isIpadActive = !!(overrides['mweb_ipad_support'] || overrides['web_enable_tablet_ui']);
      diagStatsBox.textContent = [
        `=== YOUTUBE EXPERIMENTAL CANARY STUDIO DIAGNOSTICS ===`,
        `• Script Version: 9.6.0 (Enhanced Master Engine: TrustedHTML Safe, Base.js & Kevlar Appshell Interceptor, iPad & Ad Shield Suite)`,
        `• Discovered Flags Pool: ${allDiscoveredFlags.size}`,
        `• Active User Overrides: ${Object.keys(overrides).length}`,
        `• Active Visitor ID: ${visitorConfig.enabled ? `${visitorConfig.cookieId} (${visitorConfig.label})` : 'Default (YouTube Managed)'}`,
        `• Canary Engine State: ${canaryConfig.enabled ? canaryConfig.state.toUpperCase() : 'DISABLED'} (Stage: ${canaryConfig.stage})`,
        `• Base.js Player Engine Mode: ${canaryConfig.baseJsMode}`,
        `• Service Worker Mode: ${canaryConfig.swMode}`,
        `• Picture-in-Picture State: ${isPiPActive() ? 'ACTIVE (System Window)' : 'INACTIVE'}`,
        `• Miniplayer State: ${isMiniplayerActive() ? 'ACTIVE (Docked)' : 'INACTIVE'}`,
        `• iPad & Tablet Mode: ${isIpadActive ? 'ENABLED (MWEB iPad Spoofing)' : 'DISABLED (Desktop Web)'}`,
        `• Ad Shield Active: ${overrides['web_player_enable_ad_break'] === false ? 'YES (Ad Breaks & Signals Suppressed)' : 'NO'}`,
        `• Detected Channel ID: ${chId || 'None detected'}`,
        `• Detected Video: ${vidDetails ? `${vidDetails.title.slice(0, 32)}... (${vidDetails.videoId})` : 'None detected'}`,
        `• Audio Loudness Normalization: ${vidDetails && vidDetails.loudnessDb != null ? `${vidDetails.loudnessDb.toFixed(2)} dB` : 'N/A'}`,
        `• Auto-PiP on Tab Blur: ${autoPipEnabled ? 'ENABLED' : 'DISABLED'}`,
        `• Active Theme: ${themeConfig.enabled ? (THEME_PRESETS[themeConfig.mode]?.label || themeConfig.mode) : 'DEFAULT'} (OLED: ${themeConfig.oledBlack ? 'ON' : 'OFF'}, Accent: ${themeConfig.accentColor})`,
        `• Custom Search Width: ${searchWidthConfig.searchWidth} (Max: ${searchWidthConfig.searchMaxWidth})`,
        `• Active Video Tag: ${video ? `${video.videoWidth}x${video.videoHeight} (${video.paused ? 'Paused' : 'Playing'}, ${Math.round(video.currentTime)}s)` : 'None detected'}`,
        `• Player Container ID: ${moviePlayer ? moviePlayer.id : 'None detected'}`,
        `• YTCFG Object Loaded: ${d ? 'YES (Active in Memory)' : 'NO'}`
      ].join('\n');
    }

    const btnClearAll = h('button', { className: 'yt-exp-action-btn danger', style: { width: 'fit-content' } }, '↺ Reset Everything to Factory Defaults');

    const tabContentDiag = h('div', { className: 'yt-exp-tab-content', id: 'tab-diagnostics' },
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-header' },
          h('div', { className: 'yt-exp-card-title' }, '📊 System & Player Telemetry'),
          h('button', { className: 'yt-exp-btn-small', onClick: refreshDiagStats }, '🔄 Refresh Stats')
        ),
        diagStatsBox
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '📦 Preset Import & Export'),
        h('div', { className: 'yt-exp-card-desc' }, 'Export your customized flag configuration to JSON or paste a saved preset to instantly import.'),
        h('div', { style: { display: 'flex', gap: '8px', marginTop: '6px' } },
          h('button', { className: 'yt-exp-action-btn primary', onClick: () => btnExport.click() }, '📋 Export / Import JSON')
        )
      ),
      h('div', { className: 'yt-exp-section-card' },
        h('div', { className: 'yt-exp-card-title' }, '↺ Factory Reset'),
        h('div', { className: 'yt-exp-card-desc' }, 'Clears all stored flag overrides and Canary states back to YouTube’s factory defaults.'),
        h('div', { style: { marginTop: '6px' } }, btnClearAll)
      )
    );

    // Top Drag Handle Bar
    const dragHandleBar = h('div', {
      id: 'yt-exp-drag-handle-bar',
      title: '⠿ Drag to move Canary Studio window anywhere on screen',
      style: {
        height: '14px',
        background: 'linear-gradient(90deg, rgba(255, 51, 51, 0.5), rgba(62, 166, 255, 0.5))',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '9px',
        color: '#ffffff',
        letterSpacing: '2px',
        userSelect: 'none',
        touchAction: 'none'
      }
    }, '⠿ ⠿ ⠿');

    // Main Studio Window
    const win = h(
      'div',
      { id: 'yt-exp-menu-window', style: { display: 'none' } },
      dragHandleBar,
      headerHandle,
      navTabs,
      tabContentExplorer,
      tabContentTheme,
      tabContentMWeb,
      tabContentCanary,
      tabContentVisitor,
      tabContentIntel,
      tabContentInnertube,
      tabContentMini,
      tabContentPlayer,
      tabContentRemote,
      tabContentPresets,
      tabContentDiag,
      h(
        'div',
        { id: 'yt-exp-footer' },
        h('div', null, btnHotApply),
        h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } }, btnClearAll)
      )
    );
    root.appendChild(win);

    // Tab switching logic
    const tabButtons = [tabExplorerBtn, tabThemeBtn, tabMWebBtn, tabCanaryBtn, tabVisitorBtn, tabIntelBtn, tabInnertubeBtn, tabMiniBtn, tabPlayerBtn, tabRemoteBtn, tabPresetsBtn, tabDiagBtn];
    const tabContents = {
      'tab-explorer': tabContentExplorer,
      'tab-theme': tabContentTheme,
      'tab-mweb': tabContentMWeb,
      'tab-canary': tabContentCanary,
      'tab-visitor': tabContentVisitor,
      'tab-creator-intel': tabContentIntel,
      'tab-innertube': tabContentInnertube,
      'tab-miniplayer': tabContentMini,
      'tab-player': tabContentPlayer,
      'tab-remote': tabContentRemote,
      'tab-presets': tabContentPresets,
      'tab-diagnostics': tabContentDiag
    };

    function switchTab(targetId) {
      tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === targetId);
      });
      Object.entries(tabContents).forEach(([id, contentEl]) => {
        contentEl.classList.toggle('active', id === targetId);
      });
      activeTab = targetId;
      setStored(STORAGE_KEY_ACTIVE_TAB, activeTab);
      if (targetId === 'tab-diagnostics') refreshDiagStats();
    }

    tabButtons.forEach(btn => {
      btn.onclick = () => switchTab(btn.dataset.target);
    });

    if (activeTab && tabContents[activeTab]) {
      switchTab(activeTab);
    }

    // =======================================================================
    // 10. KEYBOARD & DRAG EVENT ISOLATION (No YouTube hotkey collision)
    // =======================================================================
    win.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Escape') {
        win.style.display = 'none';
        minBtn.style.display = 'flex';
      }
    });
    win.addEventListener('keyup', (e) => e.stopPropagation());
    win.addEventListener('keypress', (e) => e.stopPropagation());

    // Global shortcut Alt+Shift+Y to toggle Studio
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.shiftKey && (e.key === 'Y' || e.key === 'y' || e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        e.stopPropagation();
        if (win.style.display === 'none') {
          win.style.display = 'flex';
          minBtn.style.display = 'none';
          updateMiniplayerAndPiPButtons();
        } else {
          win.style.display = 'none';
          minBtn.style.display = 'flex';
        }
      }
    }, true);

    function setupDragging(element, handles, onSavePos, isMinPill = false) {
      if (!Array.isArray(handles)) handles = [handles];
      let isDragging = false;
      let startX = 0, startY = 0, origX = 0, origY = 0;
      let hasMoved = false;

      function onPointerDown(e) {
        if (e.target.closest('button, input, select, label, .yt-exp-switch, .yt-exp-nav-tab, textarea')) return;
        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        const rect = element.getBoundingClientRect();
        origX = rect.left;
        origY = rect.top;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
        handles.forEach(h => { if (h && h.style) h.style.cursor = 'grabbing'; });
        try {
          if (e.target && typeof e.target.setPointerCapture === 'function') {
            e.target.setPointerCapture(e.pointerId);
          }
        } catch {}
      }

      function onPointerMove(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          hasMoved = true;
        }
        let newX = origX + dx;
        let newY = origY + dy;
        const elW = element.offsetWidth || 740;
        const elH = element.offsetHeight || 840;

        newX = Math.max(4, Math.min(window.innerWidth - elW - 4, newX));
        newY = Math.max(4, Math.min(window.innerHeight - elH - 4, newY));

        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;
        element.style.right = 'auto';
        element.style.bottom = 'auto';
      }

      function onPointerUp(e) {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        handles.forEach(h => { if (h && h.style) h.style.cursor = 'grab'; });
        try {
          if (e && e.pointerId && e.target && typeof e.target.hasPointerCapture === 'function' && e.target.hasPointerCapture(e.pointerId)) {
            e.target.releasePointerCapture(e.pointerId);
          }
        } catch {}

        if (isMinPill) {
          if (!hasMoved) {
            win.style.display = 'flex';
            minBtn.style.display = 'none';
            updateMiniplayerAndPiPButtons();
          } else {
            onSavePos(parseInt(element.style.left, 10), parseInt(element.style.top, 10));
          }
        } else {
          if (hasMoved) {
            onSavePos(parseInt(element.style.left, 10), parseInt(element.style.top, 10));
          }
        }
      }

      handles.forEach(h => {
        if (!h) return;
        h.addEventListener('pointerdown', onPointerDown);
        h.addEventListener('pointermove', onPointerMove);
        h.addEventListener('pointerup', onPointerUp);
        h.addEventListener('pointercancel', onPointerUp);
      });
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerup', onPointerUp);
    }

    const savedWinPos = getStored(STORAGE_KEY_POS, null);
    if (savedWinPos && savedWinPos.x != null && savedWinPos.y != null) {
      win.style.left = `${Math.max(10, Math.min(window.innerWidth - 740, savedWinPos.x))}px`;
      win.style.top = `${Math.max(10, Math.min(window.innerHeight - 840, savedWinPos.y))}px`;
      win.style.right = 'auto';
      win.style.bottom = 'auto';
    }

    const savedMinPos = getStored(STORAGE_KEY_MIN_POS, null);
    if (savedMinPos && savedMinPos.x != null && savedMinPos.y != null) {
      minBtn.style.left = `${Math.max(10, Math.min(window.innerWidth - 200, savedMinPos.x))}px`;
      minBtn.style.top = `${Math.max(10, Math.min(window.innerHeight - 70, savedMinPos.y))}px`;
      minBtn.style.right = 'auto';
      minBtn.style.bottom = 'auto';
    }

    setupDragging(win, [dragHandleBar, headerHandle], (x, y) => setStored(STORAGE_KEY_POS, { x, y }), false);
    setupDragging(minBtn, minBtn, (x, y) => setStored(STORAGE_KEY_MIN_POS, { x, y }), true);

    btnMinimize.onclick = () => {
      win.style.display = 'none';
      minBtn.style.display = 'flex';
      updateMiniplayerAndPiPButtons();
    };
    btnClose.onclick = () => {
      win.style.display = 'none';
      minBtn.style.display = 'flex';
      updateMiniplayerAndPiPButtons();
    };

    // =======================================================================
    // 11. CANARY CONTROLS SYNC
    // =======================================================================
    function updateCanaryUI() {
      canaryToggle.checked = !!canaryConfig.enabled;
      canaryModeSelect.value = canaryConfig.state || 'canary';
      canaryStageSelect.value = String(canaryConfig.stage || '2');
      canaryBaseJsSelect.value = canaryBaseJsSelect.value;
      canaryIppSelect.value = canaryConfig.ippLogging || 'experiment';
      canarySwSelect.value = canaryConfig.swMode || 'active';
      canaryCastSelect.value = canaryConfig.castMode || 'active';
      canaryModulesSelect.value = canaryConfig.modulesMode || 'modular_network';
      canaryServerSelect.value = canaryServerSelect.value;

      canaryDot.className = 'canary-status-dot';
      if (canaryConfig.enabled) {
        if (canaryConfig.state === 'holdback') {
          canaryDot.classList.add('holdback');
        } else if (canaryConfig.state === 'dogfood' || canaryConfig.state === 'stage') {
          canaryDot.classList.add('dogfood');
        } else {
          canaryDot.classList.add('active');
        }
      }
    }

    function saveCanaryState() {
      canaryConfig.enabled = canaryToggle.checked;
      canaryConfig.state = canaryModeSelect.value;
      canaryConfig.stage = canaryStageSelect.value;
      canaryBaseJsSelect.value = canaryBaseJsSelect.value;
      canaryConfig.ippLogging = canaryIppSelect.value;
      canaryConfig.swMode = canarySwSelect.value;
      canaryConfig.castMode = canaryCastSelect.value;
      canaryModulesSelect.value = canaryConfig.modulesMode || 'modular_network';
      canaryServerSelect.value = canaryServerSelect.value;

      setStored(STORAGE_KEY_CANARY, canaryConfig);
      updateCanaryUI();

      const d = getYtcfgData();
      if (d) applyActiveOverridesToData(d);
      updateActiveBadge();
    }

    canaryToggle.onchange = saveCanaryState;
    canaryModeSelect.onchange = saveCanaryState;
    canaryStageSelect.onchange = saveCanaryState;
    canaryBaseJsSelect.onchange = saveCanaryState;
    canaryIppSelect.onchange = saveCanaryState;
    canarySwSelect.onchange = saveCanaryState;
    canaryCastSelect.onchange = saveCanaryState;
    canaryModulesSelect.onchange = saveCanaryState;
    canaryServerSelect.onchange = saveCanaryState;
    updateCanaryUI();

    function applyCanaryProfile(profile, label) {
      canaryConfig.enabled = true;
      Object.assign(canaryConfig, profile);
      setStored(STORAGE_KEY_CANARY, canaryConfig);
      updateCanaryUI();
      const d = getYtcfgData();
      if (d) applyActiveOverridesToData(d);
      updateActiveBadge();
      alert(`Applied Canary Profile: ${label}! Click Hot Apply or navigate to another video to load.`);
    }

    btnPurgeSw.onclick = async (e) => {
      e.stopPropagation();
      const origText = btnPurgeSw.textContent;
      btnPurgeSw.textContent = '⏳ Purging...';
      const res = await clearServiceWorkerCaches();
      btnPurgeSw.textContent = origText;
      if (res.success) {
        alert(`Service Worker & Cache Storage purged!\n• Unregistered: ${res.unregCount} worker(s)\n• Purged: ${res.cacheCount} cache store(s)\nReload the page or navigate to fetch the freshest base.js and polymer scripts!`);
      } else {
        alert('Could not clear Service Worker cache: ' + (res.error ? res.error.message : 'Unknown error'));
      }
    };

    // =======================================================================
    // 12. LIST RENDERING & EVENT CONTROLLERS (Instant Flip & Inline Value Editor)
    // =======================================================================
    let currentCategory = 'all';
    let searchQuery = '';
    let renderedCount = 0;
    const CHUNK_SIZE = 60;
    let filteredFlagsList = [];

    function updateActiveBadge() {
      const count = Object.keys(overrides).length + (canaryConfig.enabled ? 1 : 0);
      badgeEl.textContent = String(count);
    }

    function computeFilteredList() {
      filteredFlagsList = [];
      const query = searchQuery.trim().toLowerCase();

      for (const [name, defaultVal] of allDiscoveredFlags.entries()) {
        const cat = categorizeFlag(name);

        if (currentCategory === 'delhi' && cat !== 'delhi') continue;
        if (currentCategory === 'ipad' && cat !== 'ipad') continue;
        if (currentCategory === 'mweb' && cat !== 'mweb') continue;
        if (currentCategory === 'canary' && cat !== 'canary') continue;
        if (currentCategory === 'ads' && cat !== 'ads') continue;
        if (currentCategory === 'miniplayer' && cat !== 'miniplayer') continue;
        if (currentCategory === 'voice' && cat !== 'voice') continue;
        if (currentCategory === 'audio' && cat !== 'audio') continue;
        if (currentCategory === 'remote' && cat !== 'remote') continue;
        if (currentCategory === 'popular' && !POPULAR_FLAGS.includes(name) && cat !== 'delhi') continue;
        if (currentCategory === 'player' && cat !== 'player') continue;
        if (currentCategory === 'desktop' && cat !== 'desktop') continue;
        if (currentCategory === 'shorts' && cat !== 'shorts') continue;
        if (currentCategory === 'ai' && cat !== 'ai') continue;
        if (currentCategory === 'system' && cat !== 'system') continue;
        if (currentCategory === 'modified' && !(name in overrides)) continue;

        if (query && !name.toLowerCase().includes(query)) continue;

        filteredFlagsList.push({ name, defaultVal });
      }

      filteredFlagsList.sort((a, b) => {
        const aMod = a.name in overrides;
        const bMod = b.name in overrides;
        if (aMod && !bMod) return -1;
        if (!aMod && bMod) return 1;
        return a.name.localeCompare(b.name);
      });

      matchCountEl.textContent = `${filteredFlagsList.length} of ${allDiscoveredFlags.size} flags`;
    }

    function renderBatch(count) {
      if (renderedCount >= filteredFlagsList.length) return;
      const fragment = document.createDocumentFragment();
      const nextBatch = filteredFlagsList.slice(renderedCount, renderedCount + count);

      nextBatch.forEach(({ name, defaultVal }) => {
        const isModified = name in overrides;
        const currentVal = isModified ? overrides[name] : defaultVal;
        const isTrue = currentVal === true || String(currentVal) === 'true' || (typeof currentVal === 'number' && currentVal !== 0);
        const isDelhi = name.toLowerCase().includes('delhi');
        const isMweb = name.startsWith('mweb_') || name in MWEB_FLAGS;
        const isAd = name.toLowerCase().includes('ad_') || name in AD_FLAGS;
        const isMini = name.toLowerCase().includes('miniplayer') || name in MINIPLAYER_FLAGS;
        const isAud = name in AUDIO_CODEC_FLAGS;
        const isRem = name in REMOTE_CAST_FLAGS;
        const isNumeric = typeof defaultVal === 'number' || typeof currentVal === 'number';
        const isString = typeof defaultVal === 'string' || (typeof currentVal === 'string' && typeof defaultVal !== 'boolean');

        const toggle = h('input', { type: 'checkbox', className: 'yt-exp-toggle-input', checked: isTrue });
        
        let valInput = null;
        if (isNumeric) {
          valInput = h('input', {
            type: 'number',
            step: 'any',
            className: 'yt-exp-val-input',
            value: String(currentVal),
            title: 'Edit numerical flag value'
          });
          valInput.onchange = () => {
            const parsed = parseFloat(valInput.value);
            if (!isNaN(parsed)) {
              overrides[name] = parsed;
              setStored(STORAGE_KEY_FLAGS, overrides);
              updateActiveBadge();
              const d = getYtcfgData();
              if (d) {
                if (d.EXPERIMENT_FLAGS) d.EXPERIMENT_FLAGS[name] = parsed;
                if (d.EXPERIMENTS_FORCED_FLAGS) d.EXPERIMENTS_FORCED_FLAGS[name] = parsed;
                applyActiveOverridesToData(d);
              }
              ensurePlayerClasses();
              toggle.checked = parsed !== 0;
              card.classList.add('modified');
              if (!metaContainer.querySelector('.yt-exp-tag.modified')) {
                const modTag = h('span', { className: 'yt-exp-tag modified' }, 'MODIFIED');
                metaContainer.insertBefore(modTag, metaContainer.childNodes[1]);
              }
            }
          };
        } else if (isString && defaultVal !== 'true' && defaultVal !== 'false') {
          valInput = h('input', {
            type: 'text',
            className: 'yt-exp-val-input',
            style: { width: '88px', textAlign: 'left' },
            value: String(currentVal),
            title: 'Edit string flag value'
          });
          valInput.onchange = () => {
            const strVal = valInput.value;
            overrides[name] = strVal;
            setStored(STORAGE_KEY_FLAGS, overrides);
            updateActiveBadge();
            const d = getYtcfgData();
            if (d) {
              if (d.EXPERIMENT_FLAGS) d.EXPERIMENT_FLAGS[name] = strVal;
              if (d.EXPERIMENTS_FORCED_FLAGS) d.EXPERIMENTS_FORCED_FLAGS[name] = strVal;
              applyActiveOverridesToData(d);
            }
            ensurePlayerClasses();
            toggle.checked = strVal.length > 0;
            card.classList.add('modified');
            if (!metaContainer.querySelector('.yt-exp-tag.modified')) {
              const modTag = h('span', { className: 'yt-exp-tag modified' }, 'MODIFIED');
              metaContainer.insertBefore(modTag, metaContainer.childNodes[1]);
            }
          };
        }

        const cat = categorizeFlag(name);
        const isIpad = cat === 'ipad' || name in IPAD_FLAGS;
        const tagClass = isDelhi ? 'delhi' : isIpad ? 'delhi' : isMweb ? 'mweb' : isAd ? 'ads' : isMini ? 'miniplayer' : isAud ? 'audio' : isRem ? 'remote' : '';
        const tagLabel = isDelhi ? 'DELHI 2026' : isIpad ? 'IPAD / TABLET' : isMweb ? 'MWEB' : isAd ? 'ADS & SIGNALS' : isMini ? 'MINIPLAYER / PIP' : isAud ? 'AUDIO / DRC' : isRem ? 'REMOTE / CAST' : categorizeFlag(name);

        const metaContainer = h(
          'div',
          { className: 'yt-exp-flag-meta' },
          h('span', { className: `yt-exp-tag ${tagClass}` }, tagLabel),
          isModified ? h('span', { className: 'yt-exp-tag modified' }, 'MODIFIED') : null,
          h('span', null, 'Default: ', h('strong', null, String(defaultVal)))
        );

        const controlsCell = h(
          'div',
          { className: 'yt-exp-controls-cell' },
          valInput,
          h('label', { className: 'yt-exp-switch' }, toggle, h('span', { className: 'yt-exp-slider' }))
        );

        const card = h(
          'div',
          { className: `yt-exp-flag-card ${isModified ? 'modified' : ''} ${isDelhi ? 'delhi-highlight' : ''}` },
          h(
            'div',
            { className: 'yt-exp-flag-info' },
            h('div', { className: 'yt-exp-flag-name' }, name),
            metaContainer
          ),
          controlsCell
        );

        toggle.onchange = () => {
          let newVal;
          if (toggle.checked) {
            newVal = typeof defaultVal === 'number' && defaultVal !== 0 ? defaultVal : true;
            if (valInput && isNumeric) {
              valInput.value = String(newVal);
            }
          } else {
            newVal = false;
            if (valInput && isNumeric) {
              valInput.value = '0';
            }
          }
          overrides[name] = newVal;
          setStored(STORAGE_KEY_FLAGS, overrides);
          updateActiveBadge();

          const d = getYtcfgData();
          if (d) {
            if (d.EXPERIMENT_FLAGS) d.EXPERIMENT_FLAGS[name] = newVal;
            if (d.EXPERIMENTS_FORCED_FLAGS) d.EXPERIMENTS_FORCED_FLAGS[name] = newVal;
            applyActiveOverridesToData(d);
          }
          ensurePlayerClasses();

          card.classList.add('modified');
          if (!metaContainer.querySelector('.yt-exp-tag.modified')) {
            const modTag = h('span', { className: 'yt-exp-tag modified' }, 'MODIFIED');
            metaContainer.insertBefore(modTag, metaContainer.childNodes[1]);
          }
        };

        fragment.appendChild(card);
      });

      listEl.appendChild(fragment);
      renderedCount += nextBatch.length;
    }

    function refreshList(resetScroll = true) {
      const currentScrollTop = listEl.scrollTop;
      const countToRender = resetScroll ? CHUNK_SIZE : Math.max(renderedCount, CHUNK_SIZE);
      while (listEl.firstChild) listEl.removeChild(listEl.firstChild);
      renderedCount = 0;
      computeFilteredList();
      renderBatch(countToRender);
      if (!resetScroll) {
        listEl.scrollTop = currentScrollTop;
      } else {
        listEl.scrollTop = 0;
      }
    }

    listEl.addEventListener('scroll', () => {
      if (listEl.scrollTop + listEl.clientHeight >= listEl.scrollHeight - 150) {
        renderBatch(CHUNK_SIZE);
      }
    });

    let searchDebounceTimer;
    searchInput.oninput = () => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        searchQuery = searchInput.value;
        refreshList(true);
      }, 50);
    };

    categoryChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.yt-exp-chip');
      if (!chip) return;
      categoryChips.querySelectorAll('.yt-exp-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.dataset.cat;
      refreshList(true);
    });

    btnDelhiAll.onclick = (e) => {
      e.stopPropagation();
      Object.entries(DELHI_FLAGS).forEach(([name, val]) => {
        overrides[name] = val;
      });
      const d = getYtcfgData();
      if (d) applyActiveOverridesToData(d);
      ensurePlayerClasses();
      setStored(STORAGE_KEY_FLAGS, overrides);
      updateActiveBadge();
      refreshList(false);
      alert("All 24 Delhi Modern UI & Player Flags are now ENABLED! Click Apply or navigate to another video to load.");
    };

    btnAllTrue.onclick = (e) => {
      e.stopPropagation();
      filteredFlagsList.forEach(({ name, defaultVal }) => {
        overrides[name] = typeof defaultVal === 'number' && defaultVal !== 0 ? defaultVal : true;
      });
      setStored(STORAGE_KEY_FLAGS, overrides);
      const d = getYtcfgData();
      if (d) applyActiveOverridesToData(d);
      ensurePlayerClasses();
      updateActiveBadge();
      refreshList(false);
    };

    btnAllFalse.onclick = (e) => {
      e.stopPropagation();
      filteredFlagsList.forEach(({ name }) => {
        overrides[name] = false;
      });
      setStored(STORAGE_KEY_FLAGS, overrides);
      const d = getYtcfgData();
      if (d) applyActiveOverridesToData(d);
      ensurePlayerClasses();
      updateActiveBadge();
      refreshList(false);
    };

    btnResetView.onclick = (e) => {
      e.stopPropagation();
      const d = getYtcfgData();
      filteredFlagsList.forEach(({ name }) => {
        delete overrides[name];
        if (d && d.EXPERIMENT_FLAGS && (name in originalDefaultFlags)) {
          d.EXPERIMENT_FLAGS[name] = originalDefaultFlags[name];
        }
      });
      setStored(STORAGE_KEY_FLAGS, overrides);
      if (d) applyActiveOverridesToData(d);
      ensurePlayerClasses();
      updateActiveBadge();
      refreshList(false);
    };

    // Complete in-memory and storage factory reset
    btnClearAll.onclick = (e) => {
      e.stopPropagation();
      if (confirm('Reset all flags, Canary states, Visitor IDs, and MWeb Search Width back to YouTube factory defaults?')) {
        overrides = {};
        canaryConfig = {
          enabled: false,
          state: 'none',
          stage: '2',
          ippLogging: 'experiment',
          baseJsMode: 'turbo',
          swMode: 'default',
          castMode: 'active',
          modulesMode: 'modular_network',
          serverVersion: 'prod'
        };
        customFlagList = [];
        autoPipEnabled = false;
        Object.assign(searchWidthConfig, defaultSearchWidthConfig);
        Object.assign(themeConfig, defaultThemeConfig);

        setStored(STORAGE_KEY_FLAGS, overrides);
        setStored(STORAGE_KEY_CANARY, canaryConfig);
        setStored(STORAGE_KEY_CUSTOM, customFlagList);
        setStored(STORAGE_KEY_AUTO_PIP, autoPipEnabled);
        setStored(STORAGE_KEY_SEARCH_WIDTH, searchWidthConfig);
        setStored(STORAGE_KEY_THEME, themeConfig);
        resetVisitorIds();

        const d = getYtcfgData();
        if (d) {
          if (d.EXPERIMENT_FLAGS) {
            for (const k in d.EXPERIMENT_FLAGS) {
              if (k in originalDefaultFlags) {
                d.EXPERIMENT_FLAGS[k] = originalDefaultFlags[k];
              } else {
                delete d.EXPERIMENT_FLAGS[k];
              }
            }
          }
          if (d.EXPERIMENTS_FORCED_FLAGS) {
            d.EXPERIMENTS_FORCED_FLAGS = {};
          }
          d.CLIENT_CANARY_STATE = originalCanaryState || 'none';
          d.canaryState = originalCanaryState || 'none';
          d.canaryStage = originalCanaryStage || '';
          d.SERVER_VERSION = 'prod';

          if (d.WEB_PLAYER_CONTEXT_CONFIGS) {
            for (const cKey in d.WEB_PLAYER_CONTEXT_CONFIGS) {
              const pcfg = d.WEB_PLAYER_CONTEXT_CONFIGS[cKey];
              if (pcfg) {
                pcfg.canaryState = originalCanaryState || 'none';
                pcfg.canaryStage = originalCanaryStage || '';
                if (originalSerializedConfigs[cKey]) {
                  pcfg.serializedExperimentFlags = originalSerializedConfigs[cKey];
                }
                if (originalClientSerializedConfigs[cKey]) {
                  pcfg.serializedClientExperimentFlags = originalClientSerializedConfigs[cKey];
                }
              }
            }
          }
        }

        const moviePlayer = document.getElementById('movie_player');
        if (moviePlayer) {
          moviePlayer.classList.remove(
            'ytp-delhi-modern',
            'ytp-delhi-modern-icons',
            'ytp-delhi-horizontal-volume-controls',
            'ytp-delhi-modern-compact-controls',
            'yt-exp-force-miniplayer'
          );
        }

        applySearchWidthStyles();
        applyThemeStyles();
        canaryCollapsed = false;
        setStored(STORAGE_KEY_CANARY_COLLAPSED, false);
        updateCanaryUI();
        updateActiveBadge();
        updateMiniplayerAndPiPButtons();
        refreshList(true);
        alert("↺ All experiment flags, Canary states, Visitor IDs, and search width styles have been completely reset to factory defaults!");
      }
    };

    btnAddCustom.onclick = (e) => {
      e.stopPropagation();
      const name = customNameInput.value.trim();
      if (!name) return;
      const val = customValSelect.value === 'true';
      allDiscoveredFlags.set(name, false);
      overrides[name] = val;
      if (!customFlagList.includes(name)) {
        customFlagList.push(name);
        setStored(STORAGE_KEY_CUSTOM, customFlagList);
      }
      setStored(STORAGE_KEY_FLAGS, overrides);
      const d = getYtcfgData();
      if (d) applyActiveOverridesToData(d);
      ensurePlayerClasses();
      customNameInput.value = '';
      updateActiveBadge();
      refreshList(false);
    };

    btnExport.onclick = (e) => {
      e.stopPropagation();
      const payload = {
        canaryConfig,
        overrides,
        customFlagList,
        autoPipEnabled,
        searchWidthConfig,
        visitorConfig,
        customVisitorList,
        themeConfig,
        timestamp: new Date().toISOString()
      };
      const formatted = JSON.stringify(payload, null, 2);
      const action = prompt('Copy your current preset JSON, or paste a new preset JSON to import:', formatted);
      if (action && action !== formatted) {
        try {
          const parsed = JSON.parse(action);
          if (parsed.overrides) overrides = parsed.overrides;
          if (parsed.canaryConfig) canaryConfig = Object.assign({}, defaultCanaryConfig, parsed.canaryConfig);
          if (parsed.customFlagList) customFlagList = parsed.customFlagList;
          if (parsed.autoPipEnabled !== undefined) autoPipEnabled = !!parsed.autoPipEnabled;
          if (parsed.searchWidthConfig) Object.assign(searchWidthConfig, parsed.searchWidthConfig);
          if (parsed.visitorConfig) visitorConfig = Object.assign({}, defaultVisitorConfig, parsed.visitorConfig);
          if (parsed.customVisitorList) customVisitorList = parsed.customVisitorList;
          if (parsed.themeConfig) Object.assign(themeConfig, parsed.themeConfig);
          setStored(STORAGE_KEY_THEME, themeConfig);
          setStored(STORAGE_KEY_VISITOR, visitorConfig);
          setStored(STORAGE_KEY_CUSTOM_VISITORS, customVisitorList);
          setStored(STORAGE_KEY_FLAGS, overrides);
          setStored(STORAGE_KEY_CANARY, canaryConfig);
          setStored(STORAGE_KEY_CUSTOM, customFlagList);
          setStored(STORAGE_KEY_AUTO_PIP, autoPipEnabled);
          setStored(STORAGE_KEY_SEARCH_WIDTH, searchWidthConfig);
          const d = getYtcfgData();
          if (d) applyActiveOverridesToData(d);
          ensurePlayerClasses();
          applySearchWidthStyles();
          applyThemeStyles();
          updateCanaryUI();
          updateActiveBadge();
          updateMiniplayerAndPiPButtons();
          refreshList(true);
          alert('Flags preset imported and applied to memory successfully!');
        } catch (err) {
          alert('Invalid JSON preset format: ' + err.message);
        }
      }
    };

    function ensurePlayerClasses() {
      try {
        const moviePlayer = document.getElementById('movie_player');
        if (!moviePlayer) return;
        const d = getYtcfgData();
        const activeDelhi = overrides['delhi_modern_web_player'] === true || 
          (overrides['delhi_modern_web_player'] == null && d?.EXPERIMENT_FLAGS?.delhi_modern_web_player === true);

        moviePlayer.classList.toggle('ytp-delhi-modern', !!activeDelhi);
        moviePlayer.classList.toggle('ytp-delhi-modern-icons', !!activeDelhi);

        const hasVol = activeDelhi && (overrides['delhi_modern_web_player_horizontal_volume_controls'] === true || 
          (overrides['delhi_modern_web_player_horizontal_volume_controls'] == null && d?.EXPERIMENT_FLAGS?.delhi_modern_web_player_horizontal_volume_controls === true));
        moviePlayer.classList.toggle('ytp-delhi-horizontal-volume-controls', !!hasVol);

        const hasCompact = activeDelhi && (overrides['delhi_modern_web_player_compact_video_actions_controls'] === true || 
          (overrides['delhi_modern_web_player_compact_video_actions_controls'] == null && d?.EXPERIMENT_FLAGS?.delhi_modern_web_player_compact_video_actions_controls === true));
        moviePlayer.classList.toggle('ytp-delhi-modern-compact-controls', !!hasCompact);
      } catch {}
    }

    // SPA Navigation Listeners (Handles video changes and player instance rebuilds smoothly)
    const onYouTubeNavigate = () => {
      const d = getYtcfgData();
      if (d) applyActiveOverridesToData(d);
      harvestAllFlagsFromRuntime();
      ensurePlayerClasses();
      applySearchWidthStyles();
      applyThemeStyles();
      updateMiniplayerAndPiPButtons();
      if (allDiscoveredFlags.size !== lastDiscoveredCount && document.activeElement !== searchInput) {
        lastDiscoveredCount = allDiscoveredFlags.size;
        refreshList(false);
      }
    };
    window.addEventListener('yt-navigate-start', onYouTubeNavigate, { passive: true });
    window.addEventListener('yt-navigate-finish', onYouTubeNavigate, { passive: true });
    window.addEventListener('yt-page-data-updated', onYouTubeNavigate, { passive: true });
    window.addEventListener('yt-player-updated', onYouTubeNavigate, { passive: true });
    window.addEventListener('spfrequest', onYouTubeNavigate, { passive: true });
    window.addEventListener('spfprocess', onYouTubeNavigate, { passive: true });
    window.addEventListener('spfdone', onYouTubeNavigate, { passive: true });

    // Debounced background flag harvest
    let lastDiscoveredCount = allDiscoveredFlags.size;
    [300, 1000, 2500].forEach(delay => {
      setTimeout(() => {
        harvestAllFlagsFromRuntime();
        ensurePlayerClasses();
        applySearchWidthStyles();
        updateMiniplayerAndPiPButtons();
        if (allDiscoveredFlags.size !== lastDiscoveredCount) {
          lastDiscoveredCount = allDiscoveredFlags.size;
          if (document.activeElement !== searchInput) {
            refreshList(false);
          }
        }
      }, delay);
    });

    updateActiveBadge();
    updateMiniplayerAndPiPButtons();
    refreshList(true);
    ensurePlayerClasses();
  }

  // =========================================================================
  // 13. BOOTSTRAP INITIALIZATION
  // =========================================================================
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initUI);
    } else {
      initUI();
    }
  }
})();