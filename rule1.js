function quoteAllKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(quoteAllKeys);
    }

    if (obj !== null && typeof obj === "object") {
        var result = {};

        Object.keys(obj).forEach(function (key) {
            result[JSON.stringify(key)] = quoteAllKeys(obj[key]);
        });

        return result;
    }

    return obj;
}

function main(config) {
    if (!config || typeof config !== "object") {
        throw new Error("无法读取订阅配置");
    }

    if (!Array.isArray(config.rules)) {
        config.rules = [];
    }

    if (!Array.isArray(config["proxy-groups"])) {
        config["proxy-groups"] = [];
    }

    var groups = config["proxy-groups"];
    var rules = config.rules;

    var customNames = [
        "🔍 手动选择",
        "⚡ 自动选择",
        "🤖 AI",
        "🛑 广告过滤"
    ];

    // 移除旧的同名策略组
    groups = groups.filter(function (group) {
        return !group || customNames.indexOf(group.name) === -1;
    });

    // 自动测速
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

    // AI 专用策略组，排除香港节点
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
        proxies: [
            "⚡ 自动选择",
            "DIRECT"
        ]
    });

    // 广告过滤
    groups.push({
        name: "🛑 广告过滤",
        type: "select",
        proxies: [
            "REJECT",
            "DIRECT"
        ]
    });

    config["proxy-groups"] = groups;

    // AI 分流规则
    var aiRules = [
        "DOMAIN-SUFFIX,chatgpt.com,🤖 AI",
        "DOMAIN-SUFFIX,openai.com,🤖 AI",
        "DOMAIN-SUFFIX,oaistatic.com,🤖 AI",
        "DOMAIN-SUFFIX,oaiusercontent.com,🤖 AI",
        "DOMAIN-SUFFIX,anthropic.com,🤖 AI",
        "DOMAIN-SUFFIX,claude.ai,🤖 AI",
        "DOMAIN-SUFFIX,gemini.google.com,🤖 AI",
        "DOMAIN-SUFFIX,ai.google.dev,🤖 AI"
    ];

    // 广告过滤规则
    var adRules = [
        "DOMAIN-SUFFIX,doubleclick.net,🛑 广告过滤",
        "DOMAIN-SUFFIX,googlesyndication.com,🛑 广告过滤",
        "DOMAIN-SUFFIX,googleadservices.com,🛑 广告过滤"
    ];

    // 删除旧的自定义规则，避免重复
    var customRules = aiRules.concat(adRules);

    rules = rules.filter(function (rule) {
        return customRules.indexOf(rule) === -1;
    });

    // 调整原有 MATCH 规则
    var hasMatch = false;

    rules = rules.map(function (rule) {
        if (typeof rule === "string" &&
            rule.indexOf("MATCH,") === 0) {
            hasMatch = true;
            return "MATCH,🔍 手动选择";
        }

        return rule;
    });

    // 没有 MATCH 时补上
    if (!hasMatch) {
        rules.push("MATCH,🔍 手动选择");
    }

    // 自定义规则放在机场原有规则前面
    config.rules = aiRules.concat(adRules, rules);

    // 局域网共享
    config["mixed-port"] = 7890;
    config["allow-lan"] = true;
    config["bind-address"] = "*";

    // 基础设置
    config.mode = "rule";
    config.ipv6 = false;

    // 修复 YAML 键名引号兼容问题
    return quoteAllKeys(config);
}