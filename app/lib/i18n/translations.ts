export type Locale = 'zh' | 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
};

export const DEFAULT_LOCALE: Locale = 'zh';

export interface Translations {
  header: {
    tools: string;
    toolCount: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    safeTag: string;
    subtitle: string;
    searchPlaceholder: string;
    resultCount: string;
    statTools: string;
    statCategories: string;
    statUpload: string;
    hotTools: string;
  };
  filter: {
    all: string;
    text: string;
    image: string;
    dev: string;
    data: string;
    design: string;
    net: string;
    calc: string;
    fun: string;
  };
  footer: {
    text: string;
    github: string;
    feedback: string;
    about: string;
  };
  toolPage: {
    back: string;
    notFound: string;
    notFoundDesc: string;
    backHome: string;
  };
  common: {
    copy: string;
    copied: string;
    download: string;
    generate: string;
    convert: string;
    format: string;
    compress: string;
    encode: string;
    decode: string;
    result: string;
    input: string;
    output: string;
    error: string;
    reset: string;
    save: string;
    delete: string;
    edit: string;
    clear: string;
    add: string;
    remove: string;
    upload: string;
    select: string;
    preview: string;
    settings: string;
  };
  tools: Record<string, {
    name: string;
    desc: string;
    [key: string]: string | Record<string, string>;
  }>;
}

const zh: Translations = {
  header: {
    tools: '工具',
    toolCount: '{count} 个工具',
  },
  hero: {
    badge: '纯前端运行 · 无需后端 · 隐私安全',
    title1: '你的在线',
    title2: '工具箱',
    safeTag: '所有数据均在浏览器本地处理，不上传、不存储、不追踪',
    subtitle: '为开发者和创作者打造的工具集合。所有工具均在浏览器本地运行，数据不会上传至服务器，安全、快速、免费。',
    searchPlaceholder: '搜索工具，例如：JSON、密码、图片压缩...',
    resultCount: '{count} 个结果',
    statTools: '在线工具',
    statCategories: '工具分类',
    statUpload: '数据上传',
    hotTools: '热门工具',
  },
  filter: {
    all: '全部',
    text: '文本处理',
    image: '图片工具',
    dev: '开发者',
    data: '数据转换',
    design: '设计辅助',
    net: '网络工具',
    calc: '计算工具',
    fun: '趣味工具',
  },
  footer: {
    text: 'TOOLKIT © 2024 — 纯前端工具箱，数据不离开你的浏览器',
    github: 'GitHub',
    feedback: '反馈建议',
    about: '关于',
  },
  toolPage: {
    back: '返回',
    notFound: '工具未找到',
    notFoundDesc: '未找到该工具，请返回首页查看所有工具。',
    backHome: '← 返回首页',
  },
  common: {
    copy: '复制',
    copied: '已复制',
    download: '下载',
    generate: '生成',
    convert: '转换',
    format: '格式化',
    compress: '压缩',
    encode: '编码',
    decode: '解码',
    result: '结果',
    input: '输入',
    output: '输出',
    error: '错误',
    reset: '重置',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    clear: '清空',
    add: '添加',
    remove: '移除',
    upload: '上传',
    select: '选择',
    preview: '预览',
    settings: '设置',
  },
  tools: {
    'json-formatter': { name: 'JSON 格式化', desc: '美化、压缩、校验 JSON 数据，支持语法高亮与错误定位', inputJson: '输入 JSON', format2: '格式化（2空格）', format4: '格式化（4空格）', output: '输出' },
    'base64': { name: 'Base64 编解码', desc: '文本与 Base64 互相转换，支持中文和文件编码', rawText: '原始文本', base64Str: 'Base64 字符串', encode: '编码', decode: '解码', encodeBtn: '编码', decodeBtn: '解码', encodeFail: '编码失败', decodeFail: '解码失败，请确认输入是有效的 Base64' },
    'url-encode': { name: 'URL 编解码', desc: 'URL 编码与解码，处理中文参数和特殊字符', rawText: '原始文本', encodedUrl: '已编码 URL', convert: '转换', convertFail: '转换失败' },
    'text-diff': { name: '文本差异对比', desc: '逐行对比两段文本，高亮标记新增、删除和修改', original: '原始文本', modified: '修改文本', compare: '对比', diffResult: '差异结果' },
    'regex-tester': { name: '正则表达式测试', desc: '实时测试正则表达式，高亮匹配结果，支持全局/多行模式', pattern: '正则表达式', flags: '标志', testText: '测试文本', matchResult: '匹配结果', matches: '个匹配', matchDetail: '匹配详情', match: '匹配', position: '位置' },
    'markdown-editor': { name: 'Markdown 编辑器', desc: '实时预览的 Markdown 编辑器，支持导出 HTML', mdInput: 'Markdown 输入', preview: '预览', copyHtml: '复制 HTML' },
    'word-count': { name: '字数统计', desc: '统计字符数、单词数、行数、段落数和阅读时间', inputText: '输入文本', inputPlaceholder: '输入或粘贴文本...', chars: '字符数', charsNoSpace: '字符数（不含空格）', words: '单词数', lines: '行数', paragraphs: '段落数', readTime: '阅读时间', minutes: '分钟' },
    'text-dedup': { name: '文本去重排序', desc: '去除重复行、按字母/长度排序、去除空行', inputText: '输入文本（每行一项）', removeEmpty: '去除空行', noSort: '不排序', alphaSort: '按字母排序', lengthSort: '按长度排序', result: '结果', removed: '个重复', lines: '行' },
    'case-converter': { name: '大小写转换', desc: '全角半角、驼峰命名、蛇形命名、中划线等格式互转', inputText: '输入文本', uppercase: '大写', lowercase: '小写', capitalize: '首字母大写', camelCase: '驼峰命名', snakeCase: '蛇形命名', kebabCase: '中划线命名', fullToHalf: '全角转半角', halfToFull: '半角转全角' },
    'html-escape': { name: 'HTML 转义/反转义', desc: 'HTML 实体编码与解码，防止 XSS 注入', escape: '转义', unescape: '反转义', rawHtml: '原始 HTML', escapedHtml: '转义后的 HTML' },
    'text-to-speech': { name: '文本转语音', desc: '使用浏览器 Web Speech API 朗读文本内容', inputText: '输入文本', inputPlaceholder: '输入要朗读的文本...', language: '语言', speed: '语速', pitch: '音调', speak: '朗读', stop: '停止' },
    'lorem-ipsum': { name: 'Lorem Ipsum 生成', desc: '快速生成中英文占位文本，自定义段落数量', paragraphCount: '段落数量', language: '语言', chinese: '中文', english: 'English', generate: '生成' },
    'image-compress': { name: '图片压缩', desc: '智能压缩 PNG/JPG/WebP 体积，画质几乎无损', selectImage: '选择图片', quality: '压缩质量', compress: '压缩', original: '原始', compressed: '压缩后', saved: '节省', download: '下载' },
    'image-convert': { name: '图片格式转换', desc: 'PNG、JPG、WebP、SVG 之间自由转换', selectImage: '选择图片', targetFormat: '目标格式', convert: '转换', download: '下载' },
    'image-crop': { name: '图片裁剪调整', desc: '在线裁剪、缩放、旋转图片，支持自由和固定比例', selectImage: '选择图片', scale: '缩放', rotation: '旋转', downloadResult: '下载结果', saveImage: '保存图片' },
    'image-to-base64': { name: '图片转 Base64', desc: '将图片文件编码为 Base64 字符串，方便内嵌使用', selectImage: '选择图片', base64Result: 'Base64 结果' },
    'qr-generator': { name: '二维码生成器', desc: '生成自定义样式的二维码，支持颜色和 Logo 定制', content: '内容', size: '尺寸', fgColor: '前景色', bgColor: '背景色', generate: '生成二维码', download: '下载' },
    'color-picker': { name: '图片取色器', desc: '上传图片后点击取色，获取 HEX/RGB 颜色值', uploadImage: '上传图片', clickToPick: '点击图片任意位置取色', copyHex: '复制 HEX' },
    'placeholder-image': { name: '占位图生成器', desc: '生成自定义尺寸、颜色和文字的占位图片', width: '宽度', height: '高度', bgColor: '背景色', textColor: '文字色', customText: '自定义文字（留空显示尺寸）', generate: '生成', download: '下载' },
    'pixelate-image': { name: '图片像素化', desc: '将图片转换为像素风格，自定义像素大小', selectImage: '选择图片', pixelSize: '像素大小', pixelate: '像素化', download: '下载' },
    'jwt-parser': { name: 'JWT 解析器', desc: '解码 JWT Token，查看 Header、Payload 和签名信息', inputToken: 'JWT Token', parse: '解析', invalidJwt: '无效的 JWT 格式，应包含 3 个部分' },
    'uuid-generator': { name: 'UUID 生成器', desc: '批量生成 UUID v4，支持自定义数量和格式', count: '数量', uppercase: '大写', noDash: '无连字符', generate: '生成' },
    'hash-calculator': { name: 'Hash 计算器', desc: '计算文本或文件的 MD5、SHA-1、SHA-256 哈希值', inputText: '输入文本', calculate: '计算哈希', calculating: '计算中...' },
    'cron-generator': { name: 'Cron 表达式生成', desc: '可视化生成 Cron 定时任务表达式，显示近几次执行时间', second: '秒', minute: '分', hour: '时', day: '日', month: '月', weekday: '周', everyHour: '每时', every6Hours: '每6小时', everyDay: '每天', everyMonday: '每周一', cronExpression: 'Cron 表达式' },
    'code-formatter': { name: '代码格式化', desc: '支持 JS/CSS/HTML/JSON 等多语言代码自动格式化', inputCode: '输入代码', pasteCode: '粘贴代码...', format: '格式化', compress: '压缩', formatFail: '格式化失败', compressFail: '压缩失败' },
    'code-screenshot': { name: '代码截图生成', desc: '将代码片段转换为精美的分享截图，可选主题和背景', language: '语言', theme: '主题', dark: '暗色', light: '亮色', padding: '内边距', code: '代码', downloadScreenshot: '下载截图' },
    'json-viewer': { name: 'JSON 可视化', desc: '以树形结构展示 JSON 数据，支持展开/折叠节点', inputJson: '输入 JSON', parse: '解析' },
    'ua-parser': { name: 'User-Agent 解析', desc: '解析浏览器 UA 字符串，展示系统和浏览器详细信息', inputUa: 'User-Agent 字符串（留空使用当前浏览器）', pasteUa: '粘贴 UA 字符串...', browser: '浏览器', os: '操作系统', deviceType: '设备类型', mobile: '移动端', desktop: '桌面端', fullUa: '完整 UA' },
    'pdf-convert': { name: '文本转 PDF', desc: '将文本、HTML、图片通过浏览器打印导出为 PDF 文件', inputText: '输入文本', exportText: '导出文本文件', enterText: '请输入文本内容', downloaded: '已下载文本文件' },
    'csv-json': { name: 'CSV ↔ JSON', desc: 'CSV 表格数据与 JSON 格式互相转换', csvInput: 'CSV 输入', jsonInput: 'JSON 输入', convert: '转换' },
    'yaml-json': { name: 'YAML ↔ JSON', desc: 'YAML 与 JSON 数据格式互相转换', yamlInput: 'YAML 输入', jsonInput: 'JSON 输入', convert: '转换', convertFail: '转换失败' },
    'xml-json': { name: 'XML ↔ JSON', desc: 'XML 文档与 JSON 数据互相转换', xmlInput: 'XML 输入', jsonInput: 'JSON 输入', convert: '转换', parseFail: 'XML 解析失败', convertFail: '转换失败' },
    'timestamp': { name: '时间戳转换', desc: 'Unix 时间戳与人类可读日期互转，支持毫秒', currentTime: '当前时间', tsToDate: '时间戳 → 日期', dateToTs: '日期 → 时间戳', invalidTs: '无效时间戳', invalidDate: '无效日期', seconds: '秒', milliseconds: '毫秒' },
    'base-converter': { name: '进制转换', desc: '二进制、八进制、十进制、十六进制互相转换', inputDecimal: '输入十进制数', inputNumber: '输入数字...', binary: '二进制', octal: '八进制', decimal: '十进制', hexadecimal: '十六进制' },
    'unit-converter': { name: '单位转换', desc: '长度、重量、温度、面积、体积等单位换算', length: '长度', weight: '重量', temperature: '温度', area: '面积', from: '从', to: '到', inputValue: '输入数值' },
    'md-to-html': { name: 'Markdown 转 HTML', desc: '将 Markdown 文档转换为格式化 HTML', mdInput: 'Markdown 输入', htmlOutput: 'HTML 输出', convert: '转换' },
    'color-converter': { name: '颜色格式转换', desc: 'HEX、RGB、HSL 颜色格式互转，实时预览颜色' },
    'gradient-generator': { name: '渐变生成器', desc: '可视化生成线性和径向 CSS 渐变，一键复制代码', direction: '方向', leftToRight: '从左到右', rightToLeft: '从右到左', topToBottom: '从上到下', bottomToTop: '从下到上', custom: '自定义', color: '颜色', addColor: '添加', cssCode: 'CSS 代码' },
    'shadow-generator': { name: '阴影生成器', desc: '可视化调整 Box Shadow 参数，实时预览效果', xOffset: 'X 偏移', yOffset: 'Y 偏移', blur: '模糊', spread: '扩展', color: '颜色', opacity: '透明度', inset: '内阴影', cssCode: 'CSS 代码' },
    'font-preview': { name: '字体预览器', desc: '浏览 Google Fonts 字体，实时预览中文显示效果', previewText: '预览文本', fontFamily: '字体', fontSize: '字号', fontWeight: '字重', letterSpacing: '字距', lineHeight: '行高', color: '颜色', cssCode: 'CSS 代码' },
    'palette-generator': { name: '调色板生成', desc: '基于色彩理论生成和谐配色方案，支持多种模式', baseHue: '基础色相', saturation: '饱和度', lightness: '亮度', complementary: '互补色', analogous: '类似色', triadic: '三等分', splitComplementary: '分裂互补', tetradic: '四等分', cssVariables: 'CSS 变量', clickToCopy: '点击复制' },
    'css-animation': { name: 'CSS 动画生成', desc: '可视化创建 CSS 关键帧动画，实时预览并导出代码', property: '属性', fromValue: '起始值', toValue: '结束值', duration: '时长', easing: '缓动', delay: '延迟', iterations: '次数', direction: '方向', play: '播放', reset: '重置', cssCode: 'CSS 代码' },
    'password-strength': { name: '密码强度检测', desc: '实时评估密码安全等级，给出强度评分和改善建议', inputPassword: '输入密码', suggestions: '改善建议', length: '长度', lowercase: '小写', uppercase: '大写', digits: '数字', specialChars: '特殊字符', strengthLevels: { veryWeak: '非常弱', weak: '弱', fair: '一般', strong: '强', veryStrong: '非常强', extreme: '极强' }, feedback: { minLength: '建议至少 8 个字符', addLower: '添加小写字母', addUpper: '添加大写字母', addDigit: '添加数字', addSpecial: '添加特殊字符', noRepeat: '避免连续重复字符' } },
    'password-generator': { name: '随机密码生成', desc: '自定义长度、字符类型的强密码生成器', passwordLength: '密码长度', upperLetters: '大写字母 (A-Z)', lowerLetters: '小写字母 (a-z)', digits: '数字 (0-9)', specialChars: '特殊字符 (!@#$)', excludeAmbiguous: '排除易混淆字符 (0O1lI)', generate: '生成密码', selectCharType: '请至少选择一种字符类型' },
    'browser-info': { name: '浏览器信息检测', desc: '查看浏览器类型、版本、屏幕分辨率等系统信息', browser: '浏览器', os: '操作系统', userAgent: 'User-Agent', screenRes: '屏幕分辨率', availArea: '可用区域', devicePixelRatio: '设备像素比', colorDepth: '颜色深度', language: '语言', cookieEnabled: 'Cookie 启用', onlineStatus: '在线状态', platform: '平台', logicalProcessors: '逻辑处理器', maxTouchPoints: '最大触控点', windowSize: '窗口大小', yes: '是', no: '否', online: '在线', offline: '离线', unknown: '未知', bit: '位' },
    'ip-lookup': { name: 'IP 地址查询', desc: '通过公共 API 查询当前网络的公网 IP 地址', lookupMyIp: '查询我的 IP', querying: '查询中...', queryFail: '查询失败，请检查网络连接', ipAddress: 'IP 地址', city: '城市', region: '地区', country: '国家', postalCode: '邮政编码', latitude: '纬度', longitude: '经度', timezone: '时区', isp: 'ISP', asn: 'ASN' },
    'storage-viewer': { name: '本地存储查看', desc: '查看和编辑 localStorage、sessionStorage 数据', save: '保存', refresh: '刷新', clearAll: '清空', noData: '暂无数据', edit: '编辑', delete: '删除', key: '键', value: '值' },
    'http-headers': { name: 'HTTP Headers 查看', desc: '查看任意网址的 HTTP 响应头信息', url: '网址', viewHeaders: '查看 Headers', querying: '查询中...', corsNote: '由于 CORS 限制，部分响应头无法读取。以下为可获取的信息：', status: '状态', corsRestricted: 'opaque (跨域受限)' },
    'calculator': { name: '科学计算器', desc: '支持三角函数、对数、幂运算等科学计算', clear: 'C', backspace: '⌫' },
    'percentage-calc': { name: '百分比计算器', desc: '百分比增减、占比、变化率等计算', xPercentOfY: 'X 的 Y%', changeRate: '变化率', xIsYPercent: 'X 是 Y 的 %', valueA: '数值 A', valueB: '数值 B', originalValue: '原始值', newValue: '新值', changeRateResult: '变化率' },
    'date-calc': { name: '日期计算器', desc: '计算两个日期之间的天数、工作日、周数间隔', startDate: '开始日期', endDate: '结束日期', days: '天数', weeks: '周数', workDays: '工作日', hours: '小时', minutes: '分钟' },
    'age-calc': { name: '年龄计算器', desc: '根据出生日期计算精确年龄、星座和生肖', birthDate: '出生日期', age: '年龄', totalDays: '总天数', zodiac: '生肖', constellation: '星座', yearsOld: '岁', monthsOld: '月', daysOld: '天', day: '天' },
    'mortgage-calc': { name: '房贷计算器', desc: '等额本息/等额本金还款方式，计算月供和总利息', loanAmount: '贷款金额（元）', annualRate: '年利率 (%)', loanYears: '贷款年限', equalPayment: '等额本息', equalPrincipal: '等额本金', repaymentMethod: '还款方式', monthlyPayment: '每月还款', firstMonthPayment: '首月还款', lastMonthPayment: '末月还款', totalRepayment: '还款总额', totalInterest: '利息总额' },
    'lottery': { name: '抽奖器', desc: '导入名单后随机抽取，支持设置中奖人数', nameList: '名单（每行一个）', winnerCount: '中奖人数', startDraw: '开始抽奖', drawing: '抽奖中...', congratulations: '恭喜以下人员中奖！' },
    'pomodoro': { name: '番茄钟', desc: '专注计时工具，25 分钟工作 + 5 分钟休息循环', workDuration: '工作时长', breakDuration: '休息时长', minute: '分钟', ready: '准备开始', working: '专注工作中', breakTime: '休息时间', completed: '已完成', tomatoes: '个番茄', start: '开始', pause: '暂停', reset: '重置' },
    'avatar-generator': { name: '头像生成器', desc: '在线生成自定义风格头像，支持多种样式', redirecting: '正在跳转到头像生成工具...' },
    'tool-collection': { name: '工具大全', desc: '收录1000+在线工具，包含图片处理、PDF转换、文字识别等', redirecting: '正在跳转到工具大全...' },
    'drawing-board': { name: '在线画板', desc: '简易绘画白板，支持画笔、形状和颜色选择', pen: '画笔', eraser: '橡皮', thickness: '粗细', undo: '撤销', clear: '清空', download: '下载' },
    'border-radius': { name: '圆角生成器', desc: '可视化调整元素 Border Radius，实时预览并生成 CSS 代码' },
    'flexbox': { name: 'Flexbox 生成器', desc: '可视化配置 Flexbox 布局属性，实时预览布局效果' },
    'grid': { name: 'Grid 生成器', desc: '可视化配置 CSS Grid 布局，自定义行列与间距' },
  },
};

const en: Translations = {
  header: {
    tools: 'Tools',
    toolCount: '{count} Tools',
  },
  hero: {
    badge: 'Client-side Only · No Backend · Privacy Safe',
    title1: 'Your Online',
    title2: 'Toolkit',
    safeTag: 'All data processed locally in your browser — no upload, no storage, no tracking',
    subtitle: 'A collection of tools for developers and creators. All tools run locally in your browser — no data is uploaded to any server. Safe, fast, and free.',
    searchPlaceholder: 'Search tools, e.g. JSON, password, image compress...',
    resultCount: '{count} results',
    statTools: 'Online Tools',
    statCategories: 'Categories',
    statUpload: 'Data Upload',
    hotTools: 'Hot Tools',
  },
  filter: {
    all: 'All',
    text: 'Text',
    image: 'Image',
    dev: 'Developer',
    data: 'Data',
    design: 'Design',
    net: 'Network',
    calc: 'Calculator',
    fun: 'Fun',
  },
  footer: {
    text: 'TOOLKIT © 2024 — Client-side toolkit, your data never leaves your browser',
    github: 'GitHub',
    feedback: 'Feedback',
    about: 'About',
  },
  toolPage: {
    back: 'Back',
    notFound: 'Tool Not Found',
    notFoundDesc: 'The tool you are looking for does not exist. Please go back to the homepage.',
    backHome: '← Back to Home',
  },
  common: {
    copy: 'Copy',
    copied: 'Copied',
    download: 'Download',
    generate: 'Generate',
    convert: 'Convert',
    format: 'Format',
    compress: 'Compress',
    encode: 'Encode',
    decode: 'Decode',
    result: 'Result',
    input: 'Input',
    output: 'Output',
    error: 'Error',
    reset: 'Reset',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    clear: 'Clear',
    add: 'Add',
    remove: 'Remove',
    upload: 'Upload',
    select: 'Select',
    preview: 'Preview',
    settings: 'Settings',
  },
  tools: {
    'json-formatter': { name: 'JSON Formatter', desc: 'Beautify, minify, and validate JSON data with syntax highlighting and error detection', inputJson: 'Input JSON', format2: 'Format (2 spaces)', format4: 'Format (4 spaces)', output: 'Output' },
    'base64': { name: 'Base64 Codec', desc: 'Convert between text and Base64, supports Chinese and file encoding', rawText: 'Raw Text', base64Str: 'Base64 String', encode: 'Encode', decode: 'Decode', encodeBtn: 'Encode', decodeBtn: 'Decode', encodeFail: 'Encoding failed', decodeFail: 'Decoding failed, please verify the input is valid Base64' },
    'url-encode': { name: 'URL Encode/Decode', desc: 'URL encoding and decoding, handle Chinese parameters and special characters', rawText: 'Raw Text', encodedUrl: 'Encoded URL', convert: 'Convert', convertFail: 'Conversion failed' },
    'text-diff': { name: 'Text Diff', desc: 'Compare two texts line by line, highlight additions, deletions, and modifications', original: 'Original Text', modified: 'Modified Text', compare: 'Compare', diffResult: 'Diff Result' },
    'regex-tester': { name: 'Regex Tester', desc: 'Test regular expressions in real-time, highlight matches, support global/multiline mode', pattern: 'Regex Pattern', flags: 'Flags', testText: 'Test Text', matchResult: 'Match Result', matches: 'matches', matchDetail: 'Match Details', match: 'Match', position: 'position' },
    'markdown-editor': { name: 'Markdown Editor', desc: 'Live preview Markdown editor with HTML export', mdInput: 'Markdown Input', preview: 'Preview', copyHtml: 'Copy HTML' },
    'word-count': { name: 'Word Count', desc: 'Count characters, words, lines, paragraphs, and reading time', inputText: 'Input Text', inputPlaceholder: 'Type or paste text...', chars: 'Characters', charsNoSpace: 'Characters (no spaces)', words: 'Words', lines: 'Lines', paragraphs: 'Paragraphs', readTime: 'Reading Time', minutes: 'min' },
    'text-dedup': { name: 'Text Dedup & Sort', desc: 'Remove duplicate lines, sort alphabetically/by length, remove empty lines', inputText: 'Input Text (one per line)', removeEmpty: 'Remove empty lines', noSort: 'No sort', alphaSort: 'Alphabetical', lengthSort: 'By length', result: 'Result', removed: 'duplicates', lines: 'lines' },
    'case-converter': { name: 'Case Converter', desc: 'Full/half-width, camelCase, snake_case, kebab-case and more format conversions', inputText: 'Input Text', uppercase: 'UPPERCASE', lowercase: 'lowercase', capitalize: 'Capitalize', camelCase: 'camelCase', snakeCase: 'snake_case', kebabCase: 'kebab-case', fullToHalf: 'Full→Half', halfToFull: 'Half→Full' },
    'html-escape': { name: 'HTML Escape/Unescape', desc: 'HTML entity encoding and decoding, prevent XSS injection', escape: 'Escape', unescape: 'Unescape', rawHtml: 'Raw HTML', escapedHtml: 'Escaped HTML' },
    'text-to-speech': { name: 'Text to Speech', desc: 'Read text aloud using the browser Web Speech API', inputText: 'Input Text', inputPlaceholder: 'Enter text to read aloud...', language: 'Language', speed: 'Speed', pitch: 'Pitch', speak: 'Speak', stop: 'Stop' },
    'lorem-ipsum': { name: 'Lorem Ipsum Generator', desc: 'Generate Chinese/English placeholder text with custom paragraph count', paragraphCount: 'Paragraph Count', language: 'Language', chinese: 'Chinese', english: 'English', generate: 'Generate' },
    'image-compress': { name: 'Image Compress', desc: 'Smart PNG/JPG/WebP compression with near-lossless quality', selectImage: 'Select Image', quality: 'Quality', compress: 'Compress', original: 'Original', compressed: 'Compressed', saved: 'Saved', download: 'Download' },
    'image-convert': { name: 'Image Convert', desc: 'Convert between PNG, JPG, WebP, and SVG formats', selectImage: 'Select Image', targetFormat: 'Target Format', convert: 'Convert', download: 'Download' },
    'image-crop': { name: 'Image Crop & Adjust', desc: 'Crop, resize, and rotate images online with free and fixed ratios', selectImage: 'Select Image', scale: 'Scale', rotation: 'Rotation', downloadResult: 'Download Result', saveImage: 'Save Image' },
    'image-to-base64': { name: 'Image to Base64', desc: 'Encode image files to Base64 strings for inline embedding', selectImage: 'Select Image', base64Result: 'Base64 Result' },
    'qr-generator': { name: 'QR Code Generator', desc: 'Generate custom QR codes with color and logo options', content: 'Content', size: 'Size', fgColor: 'Foreground', bgColor: 'Background', generate: 'Generate QR Code', download: 'Download' },
    'color-picker': { name: 'Color Picker', desc: 'Pick colors from images, get HEX/RGB values', uploadImage: 'Upload Image', clickToPick: 'Click anywhere on the image to pick a color', copyHex: 'Copy HEX' },
    'placeholder-image': { name: 'Placeholder Generator', desc: 'Generate placeholder images with custom size, color, and text', width: 'Width', height: 'Height', bgColor: 'Background', textColor: 'Text Color', customText: 'Custom Text (leave empty for size)', generate: 'Generate', download: 'Download' },
    'pixelate-image': { name: 'Pixelate Image', desc: 'Convert images to pixel art style with custom pixel size', selectImage: 'Select Image', pixelSize: 'Pixel Size', pixelate: 'Pixelate', download: 'Download' },
    'jwt-parser': { name: 'JWT Parser', desc: 'Decode JWT Tokens, view Header, Payload, and signature info', inputToken: 'JWT Token', parse: 'Parse', invalidJwt: 'Invalid JWT format, should contain 3 parts' },
    'uuid-generator': { name: 'UUID Generator', desc: 'Batch generate UUID v4 with custom count and format', count: 'Count', uppercase: 'Uppercase', noDash: 'No dashes', generate: 'Generate' },
    'hash-calculator': { name: 'Hash Calculator', desc: 'Calculate MD5, SHA-1, SHA-256 hash values for text or files', inputText: 'Input Text', calculate: 'Calculate Hash', calculating: 'Calculating...' },
    'cron-generator': { name: 'Cron Generator', desc: 'Visual cron expression builder with upcoming execution times', second: 'Second', minute: 'Minute', hour: 'Hour', day: 'Day', month: 'Month', weekday: 'Weekday', everyHour: 'Every hour', every6Hours: 'Every 6h', everyDay: 'Every day', everyMonday: 'Every Mon', cronExpression: 'Cron Expression' },
    'code-formatter': { name: 'Code Formatter', desc: 'Auto-format JS/CSS/HTML/JSON and more languages', inputCode: 'Input Code', pasteCode: 'Paste code...', format: 'Format', compress: 'Minify', formatFail: 'Formatting failed', compressFail: 'Minification failed' },
    'code-screenshot': { name: 'Code Screenshot', desc: 'Convert code snippets into beautiful shareable screenshots', language: 'Language', theme: 'Theme', dark: 'Dark', light: 'Light', padding: 'Padding', code: 'Code', downloadScreenshot: 'Download Screenshot' },
    'json-viewer': { name: 'JSON Viewer', desc: 'Display JSON data in a tree structure with expand/collapse nodes', inputJson: 'Input JSON', parse: 'Parse' },
    'ua-parser': { name: 'User-Agent Parser', desc: 'Parse browser UA strings, show OS and browser details', inputUa: 'User-Agent String (leave empty for current browser)', pasteUa: 'Paste UA string...', browser: 'Browser', os: 'OS', deviceType: 'Device', mobile: 'Mobile', desktop: 'Desktop', fullUa: 'Full UA' },
    'pdf-convert': { name: 'Text to PDF', desc: 'Export text, HTML, and images as PDF via browser print', inputText: 'Input Text', exportText: 'Export Text File', enterText: 'Please enter text content', downloaded: 'Text file downloaded' },
    'csv-json': { name: 'CSV ↔ JSON', desc: 'Convert between CSV table data and JSON format', csvInput: 'CSV Input', jsonInput: 'JSON Input', convert: 'Convert' },
    'yaml-json': { name: 'YAML ↔ JSON', desc: 'Convert between YAML and JSON data formats', yamlInput: 'YAML Input', jsonInput: 'JSON Input', convert: 'Convert', convertFail: 'Conversion failed' },
    'xml-json': { name: 'XML ↔ JSON', desc: 'Convert between XML documents and JSON data', xmlInput: 'XML Input', jsonInput: 'JSON Input', convert: 'Convert', parseFail: 'XML parsing failed', convertFail: 'Conversion failed' },
    'timestamp': { name: 'Timestamp Converter', desc: 'Convert between Unix timestamps and human-readable dates, supports milliseconds', currentTime: 'Current Time', tsToDate: 'Timestamp → Date', dateToTs: 'Date → Timestamp', invalidTs: 'Invalid timestamp', invalidDate: 'Invalid date', seconds: 'seconds', milliseconds: 'milliseconds' },
    'base-converter': { name: 'Base Converter', desc: 'Convert between binary, octal, decimal, and hexadecimal', inputDecimal: 'Input decimal number', inputNumber: 'Enter number...', binary: 'Binary', octal: 'Octal', decimal: 'Decimal', hexadecimal: 'Hexadecimal' },
    'unit-converter': { name: 'Unit Converter', desc: 'Convert length, weight, temperature, area, volume units', length: 'Length', weight: 'Weight', temperature: 'Temperature', area: 'Area', from: 'From', to: 'To', inputValue: 'Enter value' },
    'md-to-html': { name: 'Markdown to HTML', desc: 'Convert Markdown documents to formatted HTML', mdInput: 'Markdown Input', htmlOutput: 'HTML Output', convert: 'Convert' },
    'color-converter': { name: 'Color Converter', desc: 'Convert between HEX, RGB, HSL color formats with live preview' },
    'gradient-generator': { name: 'Gradient Generator', desc: 'Visual CSS gradient builder, one-click copy code', direction: 'Direction', leftToRight: 'Left to Right', rightToLeft: 'Right to Left', topToBottom: 'Top to Bottom', bottomToTop: 'Bottom to Top', custom: 'Custom', color: 'Color', addColor: 'Add', cssCode: 'CSS Code' },
    'shadow-generator': { name: 'Shadow Generator', desc: 'Visual Box Shadow parameter adjustment with live preview', xOffset: 'X Offset', yOffset: 'Y Offset', blur: 'Blur', spread: 'Spread', color: 'Color', opacity: 'Opacity', inset: 'Inset', cssCode: 'CSS Code' },
    'font-preview': { name: 'Font Preview', desc: 'Browse Google Fonts, preview Chinese display in real-time', previewText: 'Preview Text', fontFamily: 'Font Family', fontSize: 'Font Size', fontWeight: 'Font Weight', letterSpacing: 'Letter Spacing', lineHeight: 'Line Height', color: 'Color', cssCode: 'CSS Code' },
    'palette-generator': { name: 'Palette Generator', desc: 'Generate harmonious color schemes based on color theory', baseHue: 'Base Hue', saturation: 'Saturation', lightness: 'Lightness', complementary: 'Complementary', analogous: 'Analogous', triadic: 'Triadic', splitComplementary: 'Split Comp.', tetradic: 'Tetradic', cssVariables: 'CSS Variables', clickToCopy: 'Click to copy' },
    'css-animation': { name: 'CSS Animation', desc: 'Visual CSS keyframe animation builder with live preview', property: 'Property', fromValue: 'From', toValue: 'To', duration: 'Duration', easing: 'Easing', delay: 'Delay', iterations: 'Iterations', direction: 'Direction', play: 'Play', reset: 'Reset', cssCode: 'CSS Code' },
    'password-strength': { name: 'Password Strength', desc: 'Evaluate password security level in real-time with improvement suggestions', inputPassword: 'Enter Password', suggestions: 'Suggestions', length: 'Length', lowercase: 'Lowercase', uppercase: 'Uppercase', digits: 'Digits', specialChars: 'Special', strengthLevels: { veryWeak: 'Very Weak', weak: 'Weak', fair: 'Fair', strong: 'Strong', veryStrong: 'Very Strong', extreme: 'Extreme' }, feedback: { minLength: 'At least 8 characters recommended', addLower: 'Add lowercase letters', addUpper: 'Add uppercase letters', addDigit: 'Add digits', addSpecial: 'Add special characters', noRepeat: 'Avoid consecutive repeated characters' } },
    'password-generator': { name: 'Password Generator', desc: 'Customizable strong password generator with length and character options', passwordLength: 'Password Length', upperLetters: 'Uppercase (A-Z)', lowerLetters: 'Lowercase (a-z)', digits: 'Digits (0-9)', specialChars: 'Special (!@#$)', excludeAmbiguous: 'Exclude ambiguous (0O1lI)', generate: 'Generate Password', selectCharType: 'Please select at least one character type' },
    'browser-info': { name: 'Browser Info', desc: 'View browser type, version, screen resolution and system information', browser: 'Browser', os: 'OS', userAgent: 'User-Agent', screenRes: 'Screen Resolution', availArea: 'Available Area', devicePixelRatio: 'Device Pixel Ratio', colorDepth: 'Color Depth', language: 'Language', cookieEnabled: 'Cookies Enabled', onlineStatus: 'Online Status', platform: 'Platform', logicalProcessors: 'Logical Processors', maxTouchPoints: 'Max Touch Points', windowSize: 'Window Size', yes: 'Yes', no: 'No', online: 'Online', offline: 'Offline', unknown: 'Unknown', bit: 'bit' },
    'ip-lookup': { name: 'IP Lookup', desc: 'Query your public IP address via a public API', lookupMyIp: 'Lookup My IP', querying: 'Querying...', queryFail: 'Query failed, please check your network', ipAddress: 'IP Address', city: 'City', region: 'Region', country: 'Country', postalCode: 'Postal Code', latitude: 'Latitude', longitude: 'Longitude', timezone: 'Timezone', isp: 'ISP', asn: 'ASN' },
    'storage-viewer': { name: 'Storage Viewer', desc: 'View and edit localStorage and sessionStorage data', save: 'Save', refresh: 'Refresh', clearAll: 'Clear All', noData: 'No Data', edit: 'Edit', delete: 'Delete', key: 'Key', value: 'Value' },
    'http-headers': { name: 'HTTP Headers', desc: 'View HTTP response headers for any URL', url: 'URL', viewHeaders: 'View Headers', querying: 'Querying...', corsNote: 'Due to CORS restrictions, some response headers cannot be read. Available info:', status: 'Status', corsRestricted: 'opaque (CORS restricted)' },
    'calculator': { name: 'Scientific Calculator', desc: 'Supports trigonometric, logarithmic, and power functions', clear: 'C', backspace: '⌫' },
    'percentage-calc': { name: 'Percentage Calculator', desc: 'Percentage increase/decrease, proportion, and change rate calculations', xPercentOfY: 'X% of Y', changeRate: 'Change Rate', xIsYPercent: 'X is ?% of Y', valueA: 'Value A', valueB: 'Value B', originalValue: 'Original', newValue: 'New', changeRateResult: 'Change Rate' },
    'date-calc': { name: 'Date Calculator', desc: 'Calculate days, workdays, and weeks between two dates', startDate: 'Start Date', endDate: 'End Date', days: 'Days', weeks: 'Weeks', workDays: 'Workdays', hours: 'Hours', minutes: 'Minutes' },
    'age-calc': { name: 'Age Calculator', desc: 'Calculate exact age, zodiac sign, and constellation from birth date', birthDate: 'Birth Date', age: 'Age', totalDays: 'Total Days', zodiac: 'Zodiac', constellation: 'Constellation', yearsOld: 'years', monthsOld: 'months', daysOld: 'days', day: 'days' },
    'mortgage-calc': { name: 'Mortgage Calculator', desc: 'Equal payment / equal principal repayment, calculate monthly payment and total interest', loanAmount: 'Loan Amount (¥)', annualRate: 'Annual Rate (%)', loanYears: 'Loan Years', equalPayment: 'Equal Payment', equalPrincipal: 'Equal Principal', repaymentMethod: 'Method', monthlyPayment: 'Monthly Payment', firstMonthPayment: 'First Month', lastMonthPayment: 'Last Month', totalRepayment: 'Total Repayment', totalInterest: 'Total Interest' },
    'lottery': { name: 'Lottery', desc: 'Random draw from a name list with customizable winner count', nameList: 'Name List (one per line)', winnerCount: 'Winner Count', startDraw: 'Start Draw', drawing: 'Drawing...', congratulations: 'Congratulations to the winners!' },
    'pomodoro': { name: 'Pomodoro Timer', desc: 'Focus timer with 25-minute work + 5-minute break cycles', workDuration: 'Work Duration', breakDuration: 'Break Duration', minute: 'min', ready: 'Ready', working: 'Focus Mode', breakTime: 'Break Time', completed: 'Completed', tomatoes: 'pomodoros', start: 'Start', pause: 'Pause', reset: 'Reset' },
    'avatar-generator': { name: 'Avatar Generator', desc: 'Generate custom style avatars online with various styles', redirecting: 'Redirecting to avatar generator...' },
    'tool-collection': { name: 'Tool Collection', desc: '1000+ online tools including image processing, PDF conversion, OCR, and more', redirecting: 'Redirecting to tool collection...' },
    'drawing-board': { name: 'Drawing Board', desc: 'Simple drawing canvas with pen, shapes, and color selection', pen: 'Pen', eraser: 'Eraser', thickness: 'Thickness', undo: 'Undo', clear: 'Clear', download: 'Download' },
    'border-radius': { name: 'Border Radius Gen', desc: 'Visually adjust element border radius, preview and generate CSS' },
    'flexbox': { name: 'Flexbox Generator', desc: 'Visually configure Flexbox layout properties with live preview' },
    'grid': { name: 'Grid Generator', desc: 'Visually configure CSS Grid layout, customize columns, rows and gap' },
  },
};

export const translations: Record<Locale, Translations> = { zh, en };
