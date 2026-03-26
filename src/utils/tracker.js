import { supabase } from '../lib/supabase';

// Helper to generate a unique session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('portfolio_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('portfolio_session_id', sessionId);
  }
  return sessionId;
};

// Main tracking function
export const trackVisit = async () => {
  try {
    // 1. Get basic info
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const referrer = document.referrer;
    const currentPage = window.location.pathname + window.location.hash;
    const fullUrl = window.location.href;
    const sessionId = getSessionId();

    // 2. Performance & Hardware Info
    const ramSize = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown';
    const cpuCores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : 'Unknown';

    // 3. Battery Info
    let batteryInfo = { level: 'Unknown', charging: false };
    try {
      if ('getBattery' in navigator) {
        const battery = await navigator.getBattery();
        batteryInfo = {
          level: `${Math.round(battery.level * 100)}%`,
          charging: battery.charging
        };
      }
    } catch (e) {
      console.warn('Battery API blocked');
    }

    // 4. Connection Info
    let connectionInfo = { type: 'Unknown', speed: 'Unknown' };
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connectionInfo = {
        type: connection.effectiveType || 'Unknown',
        speed: connection.downlink ? `${connection.downlink} Mbps` : 'Unknown'
      };
    }

    // 5. Get IP and Geo info using a more reliable API (ipapi.co)
    let geoInfo = {};
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        geoInfo = await response.json();
      } else {
        const fallback = await fetch('https://ip-api.com/json/');
        geoInfo = await fallback.json();
        geoInfo.ip = geoInfo.query;
        geoInfo.country_name = geoInfo.country;
      }
    } catch (e) {
      console.warn('Geo tracking blocked or failed', e);
    }

    // 6. Improved OS & Browser Detection
    const getOS = () => {
      const ua = navigator.userAgent;
      if (ua.indexOf("Win") !== -1) return "Windows";
      if (ua.indexOf("Mac") !== -1) return "MacOS";
      if (ua.indexOf("Linux") !== -1) return "Linux";
      if (ua.indexOf("Android") !== -1) return "Android";
      if (ua.indexOf("like Mac") !== -1) return "iOS";
      return "Unknown OS";
    };

    const getBrowser = () => {
      const ua = navigator.userAgent;
      if (ua.indexOf("Chrome") !== -1) return "Chrome";
      if (ua.indexOf("Firefox") !== -1) return "Firefox";
      if (ua.indexOf("Safari") !== -1) return "Safari";
      if (ua.indexOf("Edge") !== -1) return "Edge";
      return "Unknown Browser";
    };

    const getDeviceType = () => {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
      if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) return "mobile";
      return "desktop";
    };

    const data = {
      session_id: sessionId,
      ip_address: geoInfo.ip || 'Unknown',
      user_agent: userAgent,
      device_type: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      language,
      screen_resolution: screenResolution,
      timezone,
      country: geoInfo.country_name || 'Unknown',
      city: geoInfo.city || 'Unknown',
      region: geoInfo.region || 'Unknown',
      latitude: geoInfo.latitude?.toString(),
      longitude: geoInfo.longitude?.toString(),
      referrer,
      current_page: currentPage,
      full_url: fullUrl,
      ram_size: ramSize,
      cpu_cores: cpuCores,
      battery_level: batteryInfo.level,
      battery_charging: batteryInfo.charging,
      connection_type: connectionInfo.type,
      connection_speed: connectionInfo.speed,
      actions: [{ type: 'page_view', timestamp: new Date().toISOString(), page: currentPage }]
    };

    // 7. Save to Supabase
    const { error } = await supabase.from('visits').insert([data]);
    if (error) throw error;

    return sessionId;
  } catch (error) {
    console.error('Tracking failed:', error);
  }
};

// Function to track specific actions (section views, clicks)
export const trackAction = async (actionType, details = {}) => {
  try {
    const sessionId = getSessionId();
    if (!sessionId) return;

    // Get the current record for this session
    const { data: currentVisit, error: fetchError } = await supabase
      .from('visits')
      .select('id, actions')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !currentVisit) return;

    const updatedActions = [
      ...(currentVisit.actions || []),
      { type: actionType, timestamp: new Date().toISOString(), ...details }
    ];

    await supabase
      .from('visits')
      .update({ actions: updatedActions })
      .eq('id', currentVisit.id);

  } catch (error) {
    console.warn('Action tracking failed:', error);
  }
};
