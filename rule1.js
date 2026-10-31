// Clash Mi / Mihomo JS Override
// 保留机场原有节点、策略组和规则
// 增加 AI 分流、广告过滤、自动选择及局域网共享

function main(config) {
  if (!config || typeof config !== "object") {
    throw new Error("配置读取失败：没有获得有效的 Clash 配置对象");
  }

  var groups = Array.isArray(config["proxy-groups"])
    ? config["proxy-groups"]
    : [];

  var rules = Array.isArray(config.rules)
    ? config.rules
    : [];

  var names = [
    "🔍 手动选择",
    "⚡ 自动选择",
    "🤖 AI",
    "🛑 广告过滤"
  ];

  // 删除同名旧组，避免重复定义
  groups = groups.filter(function (group) {
    return !group || names.indexOf(group.name) === -1;
  });

  // 自动选择：纳入订阅中的节点
  groups.push({
    name: "⚡ 自动选择",
    type: "url-test",
    "include-all": true,
    "exclude-type": "direct",
    url: "https://www.gstatic.com/generate_204",
    interval: 300,
    tolerance: 50,
    lazy: true
  });

  // AI：排除名称中标注香港的节点
  groups.push({
    name: "🤖 AI",
    type: "select",
    "include-all": true,
    "exclude-type": "direct",
    "exclude-filter": "(?i)(香港|港|🇭🇰|hong.?kong|(^|[^A-Za-z])HK([^A-Za-z]|$))"
  });

  // 手动选择
  groups.push({
    name: "🔍 手动选择",
    type: "select",
    "include-all": true,
    proxies: ["⚡ 自动选择", "DIRECT"]
  });

  // 广告过滤
  groups.push({
    name: "🛑 广告过滤",
    type: "select",
    proxies: ["REJECT", "DIRECT"]
  });

  config["proxy-groups"] = groups;

  // AI 与广告规则
  var addedRules = [
    "DOMAIN-SUFFIX,chatgpt.com,🤖 AI",
    "DOMAIN-SUFFIX,openai.com,🤖 AI",
    "DOMAIN-SUFFIX,oaistatic.com,🤖 AI",
    "DOMAIN-SUFFIX,oaiusercontent.com,🤖 AI",
    "DOMAIN-SUFFIX,anthropic.com,🤖 AI",
    "DOMAIN-SUFFIX,claude.ai,🤖 AI",
    "DOMAIN-SUFFIX,gemini.google.com,🤖 AI",
    "DOMAIN-SUFFIX,ai.google.dev,🤖 AI",
    "DOMAIN-SUFFIX,ab.chatgpt.com,🤖 AI",
    "DOMAIN-SUFFIX,doubleclick.net,🛑 广告过滤",
    "DOMAIN-SUFFIX,googlesyndication.com,🛑 广告过滤",
    "DOMAIN-SUFFIX,googleadservices.com,🛑 广告过滤"
  ];

  // 防止重复插入规则
  rules = rules.filter(function (rule) {
    return addedRules.indexOf(rule) === -1;
  });

  // 将原来的 MATCH 规则改为手动选择
  var hasMatch = false;

  rules = rules.map(function (rule) {
    if (typeof rule === "string" &&
        rule.indexOf("MATCH,") === 0) {
      hasMatch = true;
      return "MATCH,🔍 手动选择";
    }
    return rule;
  });

  if (!hasMatch) {
    rules.push("MATCH,🔍 手动选择");
  }

  config.rules = addedRules.concat(rules);

  // 局域网共享
  config["mixed-port"] = 7890;
  config["allow-lan"] = true;
  config["bind-address"] = "*";

  config.mode = "rule";
  config.ipv6 = false;

  return config;
}