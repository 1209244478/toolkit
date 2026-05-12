export type ToolBadge = 'new' | 'hot' | 'pop';
export type ToolCategory = 'text' | 'image' | 'dev' | 'data' | 'design' | 'net' | 'calc' | 'fun';

export interface Tool {
  icon: string;
  name: string;
  desc: string;
  cat: ToolCategory;
  badge?: ToolBadge;
  slug: string;
  externalUrl?: string;
}

export const CAT_LABELS: Record<ToolCategory, string> = {
  text: '文本处理', image: '图片工具', dev: '开发者',
  data: '数据转换', design: '设计辅助', net: '网络工具',
  calc: '计算工具', fun: '趣味工具',
};

export const TOOLS: Tool[] = [
  { icon: '{ }', name: 'JSON 格式化', desc: '美化、压缩、校验 JSON 数据，支持语法高亮与错误定位', cat: 'text', badge: 'pop', slug: 'json-formatter' },
  { icon: '🔐', name: 'Base64 编解码', desc: '文本与 Base64 互相转换，支持中文和文件编码', cat: 'text', slug: 'base64' },
  { icon: '🔗', name: 'URL 编解码', desc: 'URL 编码与解码，处理中文参数和特殊字符', cat: 'text', slug: 'url-encode' },
  { icon: '📝', name: '文本差异对比', desc: '逐行对比两段文本，高亮标记新增、删除和修改', cat: 'text', badge: 'new', slug: 'text-diff' },
  { icon: '🔍', name: '正则表达式测试', desc: '实时测试正则表达式，高亮匹配结果，支持全局/多行模式', cat: 'text', slug: 'regex-tester' },
  { icon: '✏️', name: 'Markdown 编辑器', desc: '实时预览的 Markdown 编辑器，支持导出 HTML', cat: 'text', badge: 'pop', slug: 'markdown-editor' },
  { icon: '🔢', name: '字数统计', desc: '统计字符数、单词数、行数、段落数和阅读时间', cat: 'text', slug: 'word-count' },
  { icon: '📋', name: '文本去重排序', desc: '去除重复行、按字母/长度排序、去除空行', cat: 'text', slug: 'text-dedup' },
  { icon: '🔠', name: '大小写转换', desc: '全角半角、驼峰命名、蛇形命名、中划线等格式互转', cat: 'text', slug: 'case-converter' },
  { icon: '📃', name: 'HTML 转义/反转义', desc: 'HTML 实体编码与解码，防止 XSS 注入', cat: 'text', slug: 'html-escape' },
  { icon: '💬', name: '文本转语音', desc: '使用浏览器 Web Speech API 朗读文本内容', cat: 'text', slug: 'text-to-speech' },
  { icon: '📜', name: 'Lorem Ipsum 生成', desc: '快速生成中英文占位文本，自定义段落数量', cat: 'text', slug: 'lorem-ipsum' },

  { icon: '🗜️', name: '图片压缩', desc: '智能压缩 PNG/JPG/WebP 体积，支持选择输出格式', cat: 'image', badge: 'pop', slug: 'image-compress' },
  { icon: '🔄', name: '图片格式转换', desc: 'PNG、JPG、WebP、SVG 之间自由转换', cat: 'image', slug: 'image-convert' },
  { icon: '✂️', name: '图片调整', desc: '缩放、旋转图片，支持区域裁剪和自由比例调整', cat: 'image', slug: 'image-crop' },
  { icon: '📦', name: '图片转 Base64', desc: '将图片文件编码为 Base64 字符串，方便内嵌使用', cat: 'image', slug: 'image-to-base64' },
  { icon: '📱', name: '二维码生成器', desc: '生成自定义样式的二维码，支持颜色和 Logo 定制', cat: 'image', badge: 'new', slug: 'qr-generator' },
  { icon: '🎨', name: '图片取色器', desc: '上传图片后点击取色，获取 HEX/RGB 颜色值', cat: 'image', slug: 'color-picker' },
  { icon: '🖼️', name: '占位图生成器', desc: '生成自定义尺寸、颜色和文字的占位图片', cat: 'image', slug: 'placeholder-image' },
  { icon: '🧩', name: '图片像素化', desc: '将图片转换为像素风格，自定义像素大小', cat: 'image', slug: 'pixelate-image' },

  { icon: '🔑', name: 'JWT 解析器', desc: '解码 JWT Token，查看 Header、Payload 和签名信息', cat: 'dev', badge: 'pop', slug: 'jwt-parser' },
  { icon: '🆔', name: 'UUID 生成器', desc: '批量生成 UUID v4，支持自定义数量和格式', cat: 'dev', slug: 'uuid-generator' },
  { icon: '#️⃣', name: 'Hash 计算器', desc: '计算文本或文件的 MD5、SHA-1、SHA-256、SHA-384、SHA-512 哈希值', cat: 'dev', slug: 'hash-calculator' },
  { icon: '⏰', name: 'Cron 表达式生成', desc: '可视化生成 Cron 定时任务表达式，显示近几次执行时间', cat: 'dev', badge: 'new', slug: 'cron-generator' },
  { icon: '💻', name: '代码格式化', desc: '支持 JS/CSS/HTML/JSON 等多语言代码自动格式化', cat: 'dev', slug: 'code-formatter' },
  { icon: '📸', name: '代码截图生成', desc: '将代码片段转换为精美的分享截图，可选主题和背景', cat: 'dev', slug: 'code-screenshot' },
  { icon: '🌳', name: 'JSON 可视化', desc: '以树形结构展示 JSON 数据，支持展开/折叠节点', cat: 'dev', slug: 'json-viewer' },
  { icon: '👤', name: 'User-Agent 解析', desc: '解析浏览器 UA 字符串，展示系统和浏览器详细信息', cat: 'dev', slug: 'ua-parser' },

  { icon: '📑', name: '文本转 PDF', desc: '将文本、HTML、图片通过浏览器打印导出为 PDF 文件', cat: 'data', badge: 'pop', slug: 'pdf-convert' },
  { icon: '📊', name: 'CSV ↔ JSON', desc: 'CSV 表格数据与 JSON 格式互相转换', cat: 'data', slug: 'csv-json' },
  { icon: '🔀', name: 'YAML ↔ JSON', desc: 'YAML 与 JSON 数据格式互相转换', cat: 'data', slug: 'yaml-json' },
  { icon: '🔃', name: 'XML ↔ JSON', desc: 'XML 文档与 JSON 数据互相转换', cat: 'data', slug: 'xml-json' },
  { icon: '⏱️', name: '时间戳转换', desc: 'Unix 时间戳与人类可读日期互转，支持毫秒', cat: 'data', slug: 'timestamp' },
  { icon: '🔢', name: '进制转换', desc: '二进制、八进制、十进制、十六进制互相转换', cat: 'data', slug: 'base-converter' },
  { icon: '📐', name: '单位转换', desc: '长度、重量、温度、面积、体积等单位换算', cat: 'data', slug: 'unit-converter' },
  { icon: '📰', name: 'Markdown 转 HTML', desc: '将 Markdown 文档转换为格式化 HTML', cat: 'data', slug: 'md-to-html' },

  { icon: '🎨', name: '颜色格式转换', desc: 'HEX、RGB、HSL 颜色格式互转，实时预览颜色', cat: 'design', slug: 'color-converter' },
  { icon: '🌈', name: '渐变生成器', desc: '可视化生成线性和径向 CSS 渐变，一键复制代码', cat: 'design', badge: 'new', slug: 'gradient-generator' },
  { icon: '🌓', name: '阴影生成器', desc: '可视化调整 Box Shadow 参数，实时预览效果', cat: 'design', slug: 'shadow-generator' },
  { icon: '💬', name: '字体预览器', desc: '浏览 30+ Google Fonts 字体，实时预览并生成 CSS 代码', cat: 'design', slug: 'font-preview' },
  { icon: '✨', name: '调色板生成', desc: '基于色彩理论生成和谐配色方案，支持多种模式', cat: 'design', slug: 'palette-generator' },
  { icon: '⬜', name: '圆角生成器', desc: '可视化调整元素 Border Radius，实时预览并生成 CSS 代码', cat: 'design', slug: 'border-radius' },
  { icon: '📏', name: 'Flexbox 生成器', desc: '可视化配置 Flexbox 布局属性，实时预览布局效果', cat: 'design', slug: 'flexbox' },
  { icon: '🧱', name: 'Grid 生成器', desc: '可视化配置 CSS Grid 布局，自定义行列与间距', cat: 'design', slug: 'grid' },
  { icon: '🎬', name: 'CSS 动画生成', desc: '可视化创建 CSS 关键帧动画，实时预览并导出代码', cat: 'design', slug: 'css-animation' },

  { icon: '🔒', name: '密码强度检测', desc: '实时评估密码安全等级，给出强度评分和改善建议', cat: 'net', slug: 'password-strength' },
  { icon: '🔑', name: '随机密码生成', desc: '自定义长度、字符类型的强密码生成器', cat: 'net', badge: 'pop', slug: 'password-generator' },
  { icon: '🌐', name: '浏览器信息检测', desc: '查看浏览器类型、版本、屏幕分辨率等系统信息', cat: 'net', slug: 'browser-info' },
  { icon: '📡', name: 'IP 地址查询', desc: '通过公共 API 查询当前网络的公网 IP 地址', cat: 'net', slug: 'ip-lookup' },
  { icon: '📦', name: '本地存储查看', desc: '查看和编辑 localStorage、sessionStorage 数据', cat: 'net', badge: 'new', slug: 'storage-viewer' },
  { icon: '📨', name: 'HTTP Headers 查看', desc: '查看任意网址的 HTTP 响应头信息', cat: 'net', slug: 'http-headers' },

  { icon: '🧮', name: '科学计算器', desc: '支持三角函数、对数、幂运算等科学计算', cat: 'calc', slug: 'calculator' },
  { icon: '%', name: '百分比计算器', desc: '百分比增减、占比、变化率等计算', cat: 'calc', slug: 'percentage-calc' },
  { icon: '📅', name: '日期计算器', desc: '计算两个日期之间的天数、工作日、周数间隔', cat: 'calc', slug: 'date-calc' },
  { icon: '🎂', name: '年龄计算器', desc: '根据出生日期计算精确年龄、星座和生肖', cat: 'calc', slug: 'age-calc' },
  { icon: '🏠', name: '房贷计算器', desc: '等额本息/等额本金还款方式，计算月供和总利息', cat: 'calc', slug: 'mortgage-calc' },

  { icon: '👤', name: '头像生成器', desc: '在线生成自定义风格头像，支持多种样式', cat: 'image', badge: 'new', slug: 'avatar-generator', externalUrl: 'https://avatar.nishang2.top/' },
  { icon: '🎰', name: '抽奖器', desc: '导入名单后随机抽取，支持设置中奖人数', cat: 'fun', slug: 'lottery' },
  { icon: '🍅', name: '番茄钟', desc: '专注计时工具，25 分钟工作 + 5 分钟休息循环', cat: 'fun', slug: 'pomodoro' },
  { icon: '🖌️', name: '在线画板', desc: '简易绘画白板，支持画笔、形状和颜色选择', cat: 'fun', badge: 'new', slug: 'drawing-board' },
];

export const TOOL_MAP: Record<string, Tool> = {};
TOOLS.forEach(t => { TOOL_MAP[t.slug] = t; });
