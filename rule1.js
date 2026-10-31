function main(config) {

  // ================================================================
  // Clash Mi / Mihomo Perfect-Rules v1.7
  //
  // Architecture:
  //
  //   Airport Subscription
  //          ↓
  //   Preserve Airport Basic Groups
  //          ↓
  //   Dynamic Region Groups
  //          ↓
  //   Perfect-Rules Service Groups
  //          ↓
  //   Remote Rule Providers
  //
  // JS:
  //   Responsible for configuration architecture
  //
  // GitHub Rule Providers:
  //   Responsible for actual routing rules
  //
  // Network Test:
  //   Follow airport's default manual selector
  //
  // ================================================================


  // ================================================================
  // 1. Basic configuration
  // ================================================================

  config["mixed-port"] = 7890;

  config["mode"] = "rule";

  config["unified-delay"] = true;

  config["tcp-concurrent"] = true;

  config["log-level"] = "error";

  config["ipv6"] = false;

  config["allow-lan"] = false;

  config["find-process-mode"] = "always";

  config["keep-alive-interval"] = 30;

  config["keep-alive-idle"] = 30;

  config["disable-keep-alive"] = false;


  // ================================================================
  // 2. Profile
  // ================================================================

  config["profile"] = {

    "store-selected": true,

    "store-fake-ip": true

  };


  // ================================================================
  // 3. DNS
  // ================================================================

  config["dns"] = {

    "enable": true,

    "listen": "0.0.0.0:53",

    "prefer-h3": false,

    "ipv6": false,

    "enhanced-mode": "fake-ip",

    "fake-ip-range": "172.19.0.1/16",

    "fake-ip-filter": [

      "+.lan",
      "+.local",
      "+.localhost",
      "+.home.arpa",

      "time.*.com",
      "time.*.gov",
      "pool.ntp.org",

      "+.push.apple.com",

      "mesu.apple.com",
      "swscan.apple.com",

      "captive.apple.com",

      "connectivitycheck.gstatic.com",

      "connectivitycheck.android.com",

      "www.msftconnecttest.com",

      "www.msftncsi.com"

    ],

    "default-nameserver": [

      "223.5.5.5",
      "119.29.29.29"

    ],

    "nameserver": [

      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"

    ],

    "nameserver-policy": {

      "geosite:cn": [

        "https://dns.alidns.com/dns-query",
        "https://doh.pub/dns-query"

      ],

      "geosite:private": [

        "https://dns.alidns.com/dns-query",
        "https://doh.pub/dns-query"

      ],

      "geolocation-!cn": [

        "https://cloudflare-dns.com/dns-query",
        "https://dns.google/dns-query"

      ]

    },

    "proxy-server-nameserver": [

      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"

    ],

    "direct-nameserver": [

      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"

    ],

    "fallback": [

      "https://cloudflare-dns.com/dns-query",
      "https://dns.google/dns-query"

    ],

    "fallback-filter": {

      "geoip": true,

      "geoip-code": "CN",

      "geosite": [

        "gfw"

      ],

      "domain": [

        "+.google.com",
        "+.googleapis.com",
        "+.googlevideo.com",
        "+.youtube.com",
        "+.github.com",
        "+.openai.com",
        "+.chatgpt.com",
        "+.anthropic.com",
        "+.claude.ai"

      ]

    }

  };


  // ================================================================
  // 4. TUN
  // ================================================================

  config["tun"] = {

    "enable": true,

    "device": "Clash Mi",

    "stack": "gvisor",

    "dns-hijack": [

      "0.0.0.0:53"

    ],

    "auto-route": true,

    "auto-detect-interface": false,

    "strict-route": true,

    "mtu": 1280,

    "inet4-address": [

      "172.19.0.1/30"

    ],

    "auto-redirect": false,

    "disable-icmp-forwarding": true

  };


  // ================================================================
  // 5. Sniffer
  // ================================================================

  config["sniffer"] = {

    "enable": true,

    "parse-pure-ip": true,

    "force-dns-mapping": true,

    "override-destination": true,

    "sniff": {

      "HTTP": {

        "ports": [

          80,
          "8080-8880"

        ]

      },

      "TLS": {

        "ports": [

          443,
          8443

        ]

      },

      "QUIC": {

        "ports": [

          443,
          8443

        ]

      }

    },

    "skip-domain": [

      "+.push.apple.com",
      "+.mijia.cloud"

    ]

  };


  // ================================================================
  // 6. NTP
  // ================================================================

  config["ntp"] = {

    "enable": true,

    "write-to-system": false,

    "server": "time.apple.com",

    "port": 123,

    "interval": 30

  };


  // ================================================================
  // 7. Original airport proxies
  // ================================================================

  var originalProxies = Array.isArray(config["proxies"])
    ? config["proxies"]
    : [];


  var proxyNames = [];

  originalProxies.forEach(function(proxy) {

    if (proxy && proxy.name) {

      proxyNames.push(proxy.name);

    }

  });


  // ================================================================
  // 8. Original airport proxy groups
  // ================================================================

  var originalGroups = Array.isArray(config["proxy-groups"])
    ? config["proxy-groups"]
    : [];


  // ================================================================
  // 9. Perfect-Rules icon CDN
  // ================================================================

  var iconBaseURL =
    "https://cdn.jsdelivr.net/gh/n0de-sudo/Perfect-Rules@main/Clash/icons/";


  var groupIcons = {

    "一键代理": "Proxy.png",

    "国内直连": "China.png",

    "AI": "AI.png",

    "YouTube": "YouTube.png",

    "Google": "Google.png",

    "GitHub": "GitHub.png",

    "网络检测": "Network-test.png",

    "Netflix": "Netflix.png",

    "Spotify": "Spotify.png",

    "Steam": "Steam.png",

    "Telegram": "Telegram.png",

    "TikTok": "TikTok.png",

    "Apple": "Apple.png",

    "Microsoft": "Microsoft.png",

    "香港": "Hong_Kong.png",

    "台湾": "Taiwan.png",

    "日本": "Japan.png",

    "新加坡": "Singapore.png",

    "韩国": "Korea.png",

    "美国": "United_States.png",

    "加拿大": "Other.png",

    "英国": "Other.png",

    "其他地区": "Other.png"

  };


  function getGroupIcon(name) {

    if (!groupIcons[name]) {

      return undefined;

    }

    return iconBaseURL + groupIcons[name];

  }


  // ================================================================
  // 10. Managed groups
  // ======================================================