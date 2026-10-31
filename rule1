
function main(config) {

  // 1. 基础设置
  config["mixed-port"] = 7890;
  config["allow-lan"] = true;
  config["bind-address"] = "*";
  config["mode"] = "rule";
  config["log-level"] = "error";
  config["ipv6"] = false;
  config["unified-delay"] = true;
  config["tcp-concurrent"] = true;

  config["profile"] = {
    "store-selected": true,
    "store-fake-ip": true
  };

  // 2. DNS：Fake-IP + 加密 DNS
  config["dns"] = {
    "enable": true,
    "listen": "0.0.0.0:1053",
    "ipv6": false,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",

    "fake-ip-filter": [
      "*.lan",
      "*.local",
      "*.localhost",
      "*.home.arpa",
      "time.*.com",
      "time.*.gov",
      "pool.ntp.org",
      "+.push.apple.com",
      "captive.apple.com",
      "connectivitycheck.gstatic.com",
      "connectivitycheck.android.com"
    ],

    "default-nameserver": [
      "223.5.5.5",
      "119.29.29.29"
    ],

    "nameserver": [
      "https://cloudflare-dns.com/dns-query",
      "https://dns.google/dns-query"
    ],

    "proxy-server-nameserver": [
      "223.5.5.5",
      "119.29.29.29"
    ],

    "direct-nameserver": [
      "https://dns.alidns.com/dns-query"
    ],

    "respect-rules": true
  };

  // 3. TUN
  config["tun"] = {
    "enable": true,
    "stack": "system",
    "dns-hijack": [
      "any:53"
    ],
    "auto-route": true,
    "auto-detect-interface": true,
    "strict-route": true,
    "mtu": 1280
  };

  // 4. 地区识别
  var regions = [
    {
      name: "香港",
      pattern: /香港|Hong\s*Kong|HKG|(^|[^a-z])HK([^a-z]|$)/i
    },
    {
      name: "台湾",
      pattern: /台湾|台灣|Taiwan|Taipei|TPE|KHH|(^|[^a-z])TW([^a-z]|$)/i
    },
    {
      name: "日本",
      pattern: /日本|Japan|Tokyo|Osaka|NRT|HND|KIX|(^|[^a-z])JP([^a-z]|$)/i
    },
    {
      name: "新加坡",
      pattern: /新加坡|Singapore|SIN|(^|[^a-z])SG([^a-z]|$)/i
    },
    {
      name: "韩国",
      pattern: /韩国|韓國|Korea|Seoul|ICN|(^|[^a-z])KR([^a-z]|$)/i
    },
    {
      name: "美国",
      pattern: /美国|USA|United\s*States|America|LAX|SFO|JFK|(^|[^a-z])US([^a-z]|$)/i
    },
    {
      name: "其他地区",
      pattern: null
    }
  ];

  // 5. 获取机场原始节点
  var proxies = Array.isArray(config["proxies"])
    ? config["proxies"]
    : [];

  var providers = config["proxy-providers"] || {};

  var hasProviders = Object.keys(providers).length > 0;

  var regionGroups = [];
  var availableRegions = [];

  // 6. 自动生成地区测速组
  regions.forEach(function(region) {

    var nodes = proxies
      .filter(function(proxy) {
        if (!proxy || !proxy.name) return false;

        if (region.name === "其他地区") {
          return !regions.slice(0, 6).some(function(r) {
            return r.pattern.test(proxy.name);
          });
        }

        return region.pattern.test(proxy.name);
      })
      .map(function(proxy) {
        return proxy.name;
      });

    var group = {
      name: region.name,
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      lazy: true
    };

    if (nodes.length > 0) {
      group.proxies = nodes;
    } else if (hasProviders && proxies.length === 0) {
      group["include-all"] = true;

      if (region.name !== "其他地区") {
        group.filter = region.pattern.source;
      } else {
        group.filter =
          "^(?!.*(香港|Hong.?Kong|HKG|台湾|台灣|Taiwan|Taipei|日本|Japan|Tokyo|Osaka|新加坡|Singapore|韩国|韓國|Korea|Seoul|美国|USA|United States)).*$";
      }
    } else {
      return;
    }

    regionGroups.push(group);
    availableRegions.push(region.name);
  });

  // 7. 默认代理组
  var defaultNodes = availableRegions.slice();

  if (defaultNodes.length === 0) {
    defaultNodes = ["DIRECT"];
  }

  var defaultGroup = {
    name: "默认代理",
    type: "select",
    proxies: defaultNodes
  };

  // 8. AI 独立策略组（不包含香港）
  var aiNodes = availableRegions.filter(function(name) {
    return name !== "香港";
  });

  if (aiNodes.length === 0) {
    aiNodes = ["DIRECT"];
  }

  var aiGroup = {
    name: "AI",
    type: "select",
    proxies: aiNodes
  };

  // 9. 最终策略组
  config["proxy-groups"] = [
    aiGroup
  ].concat(regionGroups).concat([
    defaultGroup
  ]);

  // 10. AI 域名分流
  config["rules"] = [

    // 局域网
    "DOMAIN-SUFFIX,lan,DIRECT",
    "DOMAIN-SUFFIX,local,DIRECT",
    "DOMAIN-SUFFIX,localhost,DIRECT",

    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",

    // AI
    "DOMAIN-SUFFIX,openai.com,AI",
    "DOMAIN-SUFFIX,chatgpt.com,AI",
    "DOMAIN-SUFFIX,oaistatic.com,AI",
    "DOMAIN-SUFFIX,oaiusercontent.com,AI",
    "DOMAIN-SUFFIX,anthropic.com,AI",
    "DOMAIN-SUFFIX,claude.ai,AI",
    "DOMAIN-SUFFIX,claudeusercontent.com,AI",
    "DOMAIN-SUFFIX,gemini.google.com,AI",
    "DOMAIN-SUFFIX,aistudio.google.com,AI",
    "DOMAIN-SUFFIX,generativelanguage.googleapis.com,AI",
    "DOMAIN-SUFFIX,perplexity.ai,AI",

    // 中国大陆
    "GEOSITE,private,DIRECT",
    "GEOIP,private,DIRECT,no-resolve",
    "GEOSITE,cn,DIRECT",
    "GEOIP,CN,DIRECT,no-resolve",

    // 默认代理
    "MATCH,默认代理"
  ];

  return config;
}
