const views = document.querySelectorAll(".view");
const navBtps = document.querySelectorAll(".nav-btn");
const toastEl = document.getElementById("toast");

const moduleOf = {
  workbench: "workbench",
  assistant: "assistant",
  apps: "apps",
  "app-portrait": "apps",
  "app-supplier": "apps",
  "app-bid": "apps",
  "app-risk": "apps",
  "app-trade": "apps",
  "app-eng": "apps",
  "app-contract": "apps",
  "app-policy-impl": "apps",
  "app-meeting": "apps",
  "app-expense": "apps",
  "app-data": "apps",
  "app-knowledge": "apps",
  agent: "apps",
  tools: "tools",
  toolbox: "tools",
  "tool-agent": "tools",
  "tool-doc": "tools",
  openplat: "openplat",
};

const AGENTS = {
  query: {
    title: "智能问数智能体",
    desc: "对 A8 产品数据进行多维度分析",
    prompts: ["近 12 个月中标金额按供应商排名", "往来款超过 100 万的关联方", "食堂食材月度支出趋势"],
    result:
      "<div class='result-block'><h4>问数结果</h4>海云信息近 12 个月中标 9 次、累计 2,160 万，位列第一；澜海商贸食堂配送 318 万，位列第二。</div><div class='result-block'><h4>可下钻</h4>按季度、标的类型、采购方式切片。建议与招投标专项交叉。<div style='margin-top:8px'><button class='btn sm' data-view='app-bid'>打开招投标专项</button></div></div>",
  },
  meeting: {
    title: "会议纪要分析智能体",
    desc: "对大量会议纪要进行综合分析",
    prompts: ["提取三重一大未闭环决议", "汇总 2024 年对外投资议题", "列出有资金无纪要的事项"],
    result:
      "<div class='result-block'><h4>纪要摘要</h4>41 次会议中，5 项对外投资/捐赠未形成闭环；8 项有资金流向但缺集体研究记录。</div><div class='result-block'><h4>待办</h4>对外投资设立子公司 1,200 万缺董事会纪要。<div style='margin-top:8px'><button class='btn ghost sm' data-view='assistant'>让助手起草取证单</button></div></div>",
  },
  law: {
    title: "法律法规智能体",
    desc: "查询法规资料知识库，匹配法规条款",
    prompts: ["匹配招投标围标串标条款", "查找报销标准上限", "三重一大决策依据"],
    result:
      "<div class='result-block'><h4>匹配条款</h4>《招标投标法》第三十二条：禁止投标人相互串通投标报价。<br/>《招标投标法实施条例》第四十条：视为串通投标的若干情形。</div><div class='cite'>可引用 · 写入招投标专项底稿</div>",
  },
  expense: {
    title: "报销合规智能体",
    desc: "通过报销制度，判断报销单据合规性",
    prompts: ["核验本月会议费报销", "检查超标准住宿", "发票与事由是否匹配"],
    result:
      "<div class='result-block'><h4>不合规 4 笔</h4>培训费与会议费交叉列支 27 万；两笔住宿超标准无说明；一张发票与出差审批单日期矛盾。</div><div class='result-block'><h4>建议</h4>按制度生成退回清单，并转入问数核对科目。</div>",
  },
  issue: {
    title: "审计问题智能体",
    desc: "按 A8 产品不同审计类型，匹配上下文关注的审计问题",
    prompts: ["招投标类型应关注哪些问题", "虚假贸易检查清单", "食堂专项问题库"],
    result:
      "<div class='result-block'><h4>本项目问题清单</h4>招投标：固定陪标、分差过小、联系方式撞库。<br/>虚假贸易：同日进销、无仓单、加价无服务。<br/>食堂：损耗偏高、未比价、供应商关联。</div><div class='result-block'><h4>跳转</h4><button class='btn sm' data-view='app-trade'>虚假贸易</button> <button class='btn ghost sm' data-view='app-bid'>招投标</button></div>",
  },
  research: {
    title: "深度研究智能体",
    desc: "对指定任务进行深度研究，依赖于网络检索",
    prompts: ["行业围标串标典型手法", "同类食堂审计案例", "通道业务监管口径"],
    result:
      "<div class='result-block'><h4>研究摘要</h4>公开案例中，固定三家报价、分差小于 1 分、联系方式相同是常见串标特征，与本项目海云/澜海/博远组合高度相似。</div><div class='result-block'><h4>来源</h4>监管通报、裁判文书与行业检查指引（示意检索）。建议回写招投标专项特征库。</div>",
  },
};

function renderAgent(key) {
  const agent = AGENTS[key] || AGENTS.query;
  const fromWorkbench = key === "query";
  const backView = fromWorkbench ? "workbench" : "apps";
  const backLabel = fromWorkbench ? "智能工作台" : "智能专项应用";
  document.getElementById("agent-title").textContent = agent.title;
  document.getElementById("agent-crumb").textContent = agent.title;
  document.getElementById("agent-desc").textContent = agent.desc;
  const crumbBtn = document.getElementById("agent-back");
  crumbBtn.dataset.view = backView;
  crumbBtn.textContent = backLabel;
  const backBtn = document.getElementById("agent-back-btn");
  backBtn.dataset.view = backView;
  backBtn.textContent = fromWorkbench ? "返回工作台" : "返回专项";
  document.getElementById("agent-prompts").innerHTML = agent.prompts
    .map((p, i) => `<button class="model${i === 0 ? " active" : ""}" type="button">${p}</button>`)
    .join("");
  document.getElementById("agent-result").innerHTML = agent.result;
  document.getElementById("agent-run").dataset.toast = `${agent.title}已完成分析`;
}

function showView(id) {
  if (!document.getElementById(id)) id = "workbench";
  views.forEach((v) => v.classList.toggle("active", v.id === id));
  navBtps.forEach((b) => b.classList.toggle("active", b.dataset.view === moduleOf[id]));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.body.addEventListener("click", (e) => {
  const parseBtn = e.target.closest("#parse-types [data-parse]");
  if (parseBtn) {
    document.querySelectorAll("#parse-types .model").forEach((b) => b.classList.toggle("active", b === parseBtn));
    renderParse(parseBtn.dataset.parse);
    return;
  }
  const gprompt = e.target.closest("#gagent-prompts .model");
  if (gprompt) {
    document.querySelectorAll("#gagent-prompts .model").forEach((b) => b.classList.toggle("active", b === gprompt));
    return;
  }
  const gtoolBtn = e.target.closest("[data-gtool]");
  if (gtoolBtn) {
    invokeGAgentTool(gtoolBtn.dataset.gtool);
    return;
  }
  if (e.target.closest("#gagent-run")) {
    runGAgent();
    return;
  }
  const viewBtn = e.target.closest("[data-view]");
  if (viewBtn) {
    if (viewBtn.dataset.agent === "contract") {
      showView("app-contract");
      return;
    }
    if (viewBtn.dataset.agent === "meeting") {
      showView("app-meeting");
      return;
    }
    if (viewBtn.dataset.agent === "report") {
      showView("assistant");
      setScene("report");
      return;
    }
    if (viewBtn.dataset.agent === "complete") {
      showView("assistant");
      setScene("complete");
      return;
    }
    if (viewBtn.dataset.agent === "portrait") {
      showView("app-portrait");
      return;
    }
    if (viewBtn.dataset.agent) renderAgent(viewBtn.dataset.agent);
    if (viewBtn.dataset.tool) renderToolbox(viewBtn.dataset.tool);
    showView(viewBtn.dataset.view);
    if (viewBtn.dataset.scene) setScene(viewBtn.dataset.scene);
    else if (viewBtn.dataset.view === "assistant") setScene("home");
    return;
  }
  const promptBtn = e.target.closest("#agent-prompts .model");
  if (promptBtn) {
    document.querySelectorAll("#agent-prompts .model").forEach((b) => b.classList.remove("active"));
    promptBtn.classList.add("active");
    return;
  }
  const toastBtn = e.target.closest("[data-toast]");
  if (toastBtn) {
    toastEl.textContent = toastBtn.dataset.toast;
    toastEl.classList.add("show");
    clearTimeout(showView._t);
    showView._t = setTimeout(() => toastEl.classList.remove("show"), 1800);
  }
});

document.querySelectorAll(".model").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".model").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

const AUDIT_TYPES = {
  spec: { label: "专项审计", tag: "ai" },
  safety: { label: "安全审计", tag: "ok" },
  er: { label: "经济责任审计", tag: "doing" },
  eng: { label: "工程审计", tag: "warn" },
  ic: { label: "内控监督评价", tag: "risk" },
};

const DETECT_UNITS = [
  {
    id: "u1",
    name: "城投建设有限公司",
    parent: "市城投集团",
    type: "eng",
    score: 91,
    trigger: "在建 12 个项目，变更率 18%",
    why: "在建规模大、变更率明显高于警戒线，超概和签证集中在少数包件。不安排工程审计，概算—招标—变更—结算链条上的价款失真和未批先建难以在年度内发现。",
  },
  {
    id: "u2",
    name: "轨道交通建设公司",
    parent: "市交通投资集团",
    type: "eng",
    score: 88,
    trigger: "配套工程签证密集、结算滞后",
    why: "轨道交通配套签证量大、结算长期挂账，存在先施工后补手续、价款被滞后锁定的风险。工程审计可核签证真实性、审批时点与结算口径是否一致。",
  },
  {
    id: "u3",
    name: "水利工程建设处",
    parent: "市水利局",
    type: "eng",
    score: 82,
    trigger: "分包拆分、监理资料不齐",
    why: "河道整治被拆成多个小包，监理日志与现场进度对不上。分包拆分常用来规避招标限额，不审则难以还原实际施工主体和资金去向。",
  },
  {
    id: "u4",
    name: "市教育局直属校群",
    parent: "市教育局",
    type: "ic",
    score: 79,
    trigger: "自评缺陷 11 项未整改，采购授权过大",
    why: "连续两年内控自评缺陷未闭环，基层采购授权集中在少数人。内控监督评价要查单位层面控制是否失效、授权是否可追溯，避免采购和经费在校群层面失控。",
  },
  {
    id: "u5",
    name: "市卫健委专项资金使用单位",
    parent: "市卫生健康委",
    type: "spec",
    score: 84,
    trigger: "专项资金闲置超期，合同与验收脱节",
    why: "专项到账后长期未形成支出，已列支部分缺少验收和成果物。闲置和「付了款交不出物」是专项资金审计的典型风险，需单独立项查资金用途和绩效。",
  },
  {
    id: "u6",
    name: "大数据局运维中心",
    parent: "市大数据管理局",
    type: "ic",
    score: 74,
    trigger: "运维集中一家，成果物清单缺失",
    why: "信息化运维长期由同一供应商承接，合同无成果物清单和扣款条款。内控评价应测采购、验收、信息系统授权是否形成闭环，防止服务类支出失实。",
  },
  {
    id: "u7",
    name: "市财政局本级预算处",
    parent: "市财政局",
    type: "spec",
    score: 80,
    trigger: "预算调剂频次偏高，绩效监控弱",
    why: "年中调剂频繁、绩效监控未闭环，资金用途在账上被反复改写。安排预算执行专项，是为核对调剂依据、时点与账务是否一致，防止「调剂」掩盖支出结构问题。",
  },
  {
    id: "u8",
    name: "城投贸易子公司",
    parent: "市城投集团",
    type: "spec",
    score: 87,
    trigger: "循环贸易、关联采购迹象",
    why: "进销同一标的、资金体内循环、供应商与集团其他子公司疑似关联。虚假贸易是穿透式监管和追责红线的高频事项，不安排专项则集团合并层面的收入和利润不可信。",
  },
  {
    id: "u9",
    name: "城投危化与矿山板块",
    parent: "市城投集团",
    type: "safety",
    score: 90,
    trigger: "高危作业与外包施工交叉",
    why: "危化、矿山高危作业与外包队伍交叉，安全投入、应急预案和现场管控责任边界不清。安全审计查的是责任是否压到作业面，避免以包代管后事故追责无据。",
  },
  {
    id: "u10",
    name: "城投集团党委书记（拟离任）",
    parent: "市城投集团",
    type: "er",
    score: 86,
    trigger: "任期届满，任内重大投资与担保集中",
    why: "拟离任，任内重大投资、对外担保和子企业设立集中发生。经责审计要在离任前把决策链、资金链和责任人钉住，否则终身问责没有底稿。",
  },
  {
    id: "u11",
    name: "市交通投资集团总经理",
    parent: "市交通投资集团",
    type: "er",
    score: 81,
    trigger: "任期内轨道交通投资决策集中",
    why: "任期内轨道交通投资决策密集，概算调整与融资方案多次上会。经责审计核的是决策程序、可研依据和投资后果是否可追到个人，而不是再做一遍工程结算。",
  },
  {
    id: "u12",
    name: "燃气热力公司",
    parent: "市城投集团",
    type: "safety",
    score: 83,
    trigger: "管网应急与外包施工管控薄弱",
    why: "燃气管网应急演练不到位，抢修大量外包且现场监管弱。公共安全相关企业一旦出事社会影响大，安全审计优先核应急、外包和隐患闭环是否空转。",
  },
];

const PLAN_QUARTER = {
  er: "2026年第一季度",
  safety: "2026年第二季度",
  eng: "2026年第二至三季度",
  spec: "2026年第三季度",
  ic: "2026年第四季度",
};
const PLAN_LEADS = ["张敏", "李强", "王倩", "赵磊"];

const POLICIES = [
  {
    id: "p1",
    title: "关于加强中央企业穿透式监管的指导意见（试行）",
    date: "2026-02",
    org: "国资发监督规〔2026〕2号",
    brief: "确立四全穿透标准，经营可视、资金可溯、风险可控。",
    interp:
      "本文件是穿透式监管的顶层设计。监管从「层层报表、一级报一级」改为「向下看清、横向关联」。审计应把「主体—业务—风险」写成可检查的三条线：主体看股权与最终受益人，业务看交易实质是否掩盖在层级和合同形式之后，风险看十大重点领域是否可监测。定性上宜写监管穿透力不足、风险不可见，避免空泛写「内控薄弱」。",
    points: [
      "主体穿透：子企业、特殊目的实体、最终受益人",
      "业务穿透：实质重于形式，透过法律形式看交易本质",
      "风险穿透：产权、投资、财务资金、采购、金融、合同、境外、债务、薪酬、担保",
      "理念：事中预警为主，事后追责为辅；放权与严监管统一",
    ],
    actions: [
      { kind: "审计", text: "实施方案单列股权链、资金链、合同链；虚假贸易、靠企吃企、过度负债列入必查。" },
      { kind: "数据分析", text: "企业画像做主体穿透；循环贸易与三流比对做业务/资金穿透。" },
    ],
  },
  {
    id: "p2",
    title: "2026年中央企业内部控制体系建设与监督工作通知",
    date: "2026",
    org: "国资厅监督〔2026〕15号",
    brief: "用约两年测试信息系统穿透性，把要求写入章程和合同。",
    interp:
      "15号文把2号文落到内控和系统。评价重点不是再出一本手册，而是测「系统能不能穿过去」：数据能否实时采集、横向关联、纵向贯通。审计/内控评价应列穿透缺陷：断点、口径不一致、异常交易无预警、制度未嵌入节点。报告要写清评价覆盖了哪些级次和系统，识别了哪些风险，问题清单是否可追溯。",
    points: [
      "目标：全级次覆盖、全业务在线、全系统联通、全要素监管",
      "测试产权、投资、财务资金、采购供应链、合同、境外等是否存在穿透缺陷",
      "穿透要求嵌入公司章程、投资协议、业务合同",
      "缺陷要转化为可执行、可监督、可追溯的管控节点",
    ],
    actions: [
      { kind: "审计", text: "内控监督评价改用穿透缺陷口径；评价报告写覆盖范围、风险识别、问题清单。" },
      { kind: "数据分析", text: "测主数据是否贯穿子企业；采购、合同、资金是否同口径；未授权数据列入缺口。" },
    ],
  },
  {
    id: "p3",
    title: "进一步深化国资国企改革方案中的穿透式监管要求",
    date: "2026-05",
    org: "改革部署 2026—2029",
    brief: "管资本要管得住，推进穿透式、全覆盖监管。",
    interp:
      "上一轮改革解决「管企业转向管资本」，这一轮要解决「资本怎么管得住」。穿透式、全覆盖被写成监管体制任务，不是信息化点缀。审计要回答：子企业是否可见、资金是否可溯、重大投资是否可追责。对标巡视审计高频问题（虚假贸易、过度负债、靠企吃企），检查现有模型能否识别，不能识别即监管能力缺口。",
    points: [
      "建立健全全级次、全流程、全要素穿透机制",
      "对央企数据实时监测、动态预警",
      "放权赋能与从严监管统一，避免信息衰减",
      "高频风险必须被系统识别，而不是事后汇总统报",
    ],
    actions: [
      { kind: "审计", text: "经责与集团审计增加「监管穿透力」评价，问题对接整改评估。" },
      { kind: "数据分析", text: "财务、供应链、合同、境外与股权联表；担保链、关联采购出预警。" },
    ],
  },
  {
    id: "p4",
    title: "关于推动中央企业加快财务数智化转型升级的指导意见",
    date: "2026",
    org: "国务院国资委",
    brief: "以司库和财务数智化为穿透监管的数据底座。",
    interp:
      "没有统一的资金和核算底座，穿透只能停留在报表。本意见要求财务数智化、司库全级次可见，使资金流动可溯。审计关注：司库是否覆盖重要子企业、是否存在账外循环和资金池外循环、银企流水与账套是否可对碰。数据分析优先接司库、核算、合同三条数据，再谈模型。",
    points: [
      "司库平台作为穿透监管的技术路径之一",
      "核算、资金、预算数据应可横向关联",
      "子企业资金可见性是底线",
      "数智化成果要能支撑动态预警，而不仅是报表自动化",
    ],
    actions: [
      { kind: "审计", text: "延伸核司库覆盖范围、大额对外付款审批链、与合同验收是否闭环。" },
      { kind: "数据分析", text: "银企流水、科目明细、合同金额三方一致性校验；识别体外循环候选。" },
    ],
  },
  {
    id: "p5",
    title: "国资委穿透式监管工作会议部署要点",
    date: "2026-07",
    org: "国务院国资委工作会议",
    brief: "年内多次专项部署，强调专业监管能力和监督协同。",
    interp:
      "工作会议把文件变成时间表：智能化、穿透式监管要与出资人监督、审计、巡视、纪检协同。审计应对是列出协同清单：哪些疑点由审计模型先扫、哪些需纪检或巡视交接。避免各监督各看各的表。本项目可把已确认疑点按「可溯资金 / 不可见子企业 / 无预警」分类，作为向监管会商提供的输入。",
    points: [
      "深入推进穿透式监管，提升专业监管能力",
      "经营行为可视、资金流动可溯、重大风险可控",
      "强化各类监督力量协同",
      "分行业、一企一策与纵向看清相结合",
    ],
    actions: [
      { kind: "审计", text: "形成会商清册：资金不可溯、子企业不可见、模型未覆盖的风险点。" },
      { kind: "数据分析", text: "按行业切片看负债、担保、关联采购；输出一企一册预警。" },
    ],
  },
  {
    id: "p6",
    title: "违规经营投资责任追究与穿透红线（追责情形）",
    date: "2026-01 施行",
    org: "责任追究制度修订",
    brief: "追责情形扩充，重大决策终身问责，对应系统必须能识别的红线。",
    interp:
      "制度解决「建了不执行怎么办」。追责情形增加后，每条红线都应能在系统里被抽出来：违规决策、虚假贸易、违规担保、境外失控等。审计不要只引用条文，而要对着本企业信息系统问：这条红线有没有数据采集点、有没有预警规则、有没有责任人。没有采集点就是15号文说的穿透缺陷，应写入评价和审计发现。",
    points: [
      "追责情形对应一条条可被系统识别的风险点",
      "重大决策终身问责，底稿须保留决策链",
      "虚假贸易、违规担保、投资失控是高频红线",
      "有制度无数据，视为穿透失败而非单纯合规宣贯不到位",
    ],
    actions: [
      { kind: "审计", text: "对照红线抽重大投资、担保、贸易业务，核决策纪要与资金流是否同链。" },
      { kind: "数据分析", text: "把红线规则配进模型：循环贸易、担保圈、关联收购；命中即生成取证单。" },
    ],
  },
];

const COCKPIT = {
  survey: {
    title: "审前调查智能体",
    status: "已完成",
    next: "scheme",
    prev: "cockpit",
    input: "检测结果 3 家 · 政策解读 2 份 · 单位画像摘要",
    output:
      "<div class='result-block'><h4>审前调查报告（摘要）</h4>建议将市住建局作为工程审计主延伸对象，市教育局作为内控评价对象。已梳理组织架构、资金规模、在建项目与历史问题 14 条。</div><div class='result-block'><h4>资料缺口与项目资料包</h4>变更签证台账、内控自评底稿、运维成果物清单尚未齐备。已生成资料清单、访谈提纲，并提取会议纪要待办。<div style='margin-top:8px'><button class='btn sm' type='button' data-scene='fieldpack'>打开项目资料包</button></div></div>",
  },
  scheme: {
    title: "方案制定智能体",
    status: "已完成",
    next: "doubt",
    prev: "survey",
    input: "审前调查 · 项目资料 · 历史实施方案 · 方案库 · 实施方案",
    output:
      "<div class='result-block'><h4>实施方案骨架</h4>（一）工程线：概算—招标—变更—结算；（二）内控线：单位层面控制、采购与建设项目控制；（三）数据分析：供应商关联、变更率、调剂对流。</div><div class='result-block'><h4>人员与日程</h4>现场 12 人日，工程组与内控组并行，第 2 周交叉复核疑点。</div>",
  },
  doubt: {
    title: "疑点确认智能体",
    status: "进行中",
    pane: "trace",
    next: "sample",
    prev: "scheme",
    input: "方案重点事项 · 问数结果 · 合同与凭证抽核",
    output: "",
  },
  sample: {
    title: "抽样与统计",
    status: "待启动",
    pane: "sample",
    next: "evidence",
    prev: "doubt",
    input: "已标记疑点 · 合同包与费用总体",
    output: "",
  },
  evidence: {
    title: "证据链管理",
    status: "待启动",
    pane: "evidence",
    next: "paper",
    prev: "sample",
    input: "已确认疑点 · 穿透路径 · 抽样异常",
    output: "",
  },
  paper: {
    title: "底稿编写智能体",
    status: "待启动",
    next: "report",
    prev: "evidence",
    input: "已确认疑点 · 取证单 · 法规引用",
    output:
      "<div class='result-block'><h4>底稿目录</h4>A. 审前调查 B. 内控测试 C. 工程变更 D. 采购关联。可按确认疑点自动灌入事实、法规与审计意见栏。</div><div class='result-block'><h4>取证单 / 底稿样例</h4>事项：超概变更未履行审批。事实栏已引用签证单号与概算对照表；取证单列需被审计单位补交的 2 份审批件，待主审确认定性用语。</div>",
  },
  report: {
    title: "报告生成智能体",
    status: "待启动",
    pane: "gen-report",
    next: "cockpit",
    prev: "paper",
    input: "已审核底稿 · 证据链已闭环事项",
    output: "",
  },
};

const CHAT_SCENES = {
  draft: {
    title: "取证单撰写",
    ph: "例如：把已确认疑点写成取证单",
  },
};

const detectState = {
  filter: "all",
  selected: new Set(["u1", "u8", "u9", "u10", "u4"]),
  synced: false,
};
const planState = { items: [] };
let currentScene = "detect";
let currentPolicy = "p1";
let policyMode = "index";

const ask = document.getElementById("ask");
const send = document.getElementById("send");
const msgs = document.getElementById("msgs");
const paneTitle = document.getElementById("pane-title");
const ctxEl = document.getElementById("assistant-ctx");

function toast(text) {
  toastEl.textContent = text;
  toastEl.classList.add("show");
  clearTimeout(showView._t);
  showView._t = setTimeout(() => toastEl.classList.remove("show"), 1800);
}

function selectedUnits() {
  return DETECT_UNITS.filter((u) => detectState.selected.has(u.id));
}

function typeTag(type) {
  const t = AUDIT_TYPES[type] || { label: type, tag: "" };
  return `<span class="tag ${t.tag}">${t.label}</span>`;
}

function renderDetect() {
  const filters = document.getElementById("detect-filters");
  filters.innerHTML =
    `<button class="tag${detectState.filter === "all" ? " doing active" : ""}" type="button" data-filter="all">全部</button>` +
    Object.entries(AUDIT_TYPES)
      .map(
        ([id, t]) =>
          `<button class="tag${detectState.filter === id ? " doing active" : ""}" type="button" data-filter="${id}">${t.label}</button>`
      )
      .join("");

  const counts = {};
  DETECT_UNITS.forEach((u) => {
    counts[u.type] = (counts[u.type] || 0) + 1;
  });
  document.getElementById("detect-stats").innerHTML =
    `<div class="stat"><b>${DETECT_UNITS.length}</b><span>下级单位</span></div>` +
    Object.entries(AUDIT_TYPES)
      .map(([id, t]) => `<div class="stat"><b>${counts[id] || 0}</b><span>${t.label}</span></div>`)
      .join("");

  const body = document.getElementById("detect-body");
  const rows = DETECT_UNITS.filter((u) => detectState.filter === "all" || u.type === detectState.filter);
  body.innerHTML = rows
    .map(
      (u) => `<tr data-type="${u.type}">
        <td><input type="checkbox" data-unit="${u.id}" ${detectState.selected.has(u.id) ? "checked" : ""} /></td>
        <td>${u.name}<div class="cell-sub">${u.parent}</div></td>
        <td>${typeTag(u.type)}</td>
        <td>${u.score}</td>
        <td><div class="why-trigger">${u.trigger}</div><div class="why-text">${u.why}</div></td>
      </tr>`
    )
    .join("");
  document.getElementById("detect-count").textContent = `已选 ${detectState.selected.size} 家下级单位，可纳入年度计划`;
}

function renderPlan() {
  const items = planState.items;
  const counts = {};
  items.forEach((u) => {
    counts[u.type] = (counts[u.type] || 0) + 1;
  });
  document.getElementById("plan-stats").innerHTML =
    `<div class="stat"><b>${items.length}</b><span>计划项目</span></div>` +
    Object.entries(AUDIT_TYPES)
      .map(([id, t]) => `<div class="stat"><b>${counts[id] || 0}</b><span>${t.label}</span></div>`)
      .join("");
  const body = document.getElementById("plan-body");
  if (!items.length) {
    body.innerHTML = `<tr><td colspan="7" class="muted" style="padding:20px">尚未纳入项目。请先在「审计对象筛查」勾选下级单位，再同步到本模块。</td></tr>`;
  } else {
    body.innerHTML = items
      .map(
        (u, i) => `<tr>
        <td>${i + 1}</td>
        <td>${u.name}<div class="cell-sub">${u.parent}</div></td>
        <td>${typeTag(u.type)}</td>
        <td>${u.quarter}</td>
        <td>${u.lead}</td>
        <td><div class="why-trigger">${u.trigger}</div><div class="why-text">${u.why}</div></td>
        <td><span class="tag doing">${u.status}</span></td>
      </tr>`
      )
      .join("");
  }
  const draft = document.getElementById("plan-draft");
  if (!items.length) {
    draft.innerHTML = "<p class='muted' style='margin:0'>同步检测结果后，将按审计类型生成年度计划草案摘要。</p>";
    return;
  }
  const byType = Object.entries(AUDIT_TYPES)
    .map(([id, t]) => {
      const list = items.filter((x) => x.type === id);
      if (!list.length) return "";
      return `<p><b>${t.label}（${list.length}）</b></p><ul>${list
        .map((x) => `<li><b>${x.name}</b>：${x.why}</li>`)
        .join("")}</ul>`;
    })
    .join("");
  draft.innerHTML = `<h4>2026 年度审计计划（草案）· 为什么审这几家</h4>
    <p>入选口径：业务特征 + 已暴露风险 + 监管/追责要求。经责优先拟离任，安全覆盖高危板块，工程盯超概与签证，专项盯虚假贸易和资金闲置，内控评价盯缺陷未闭环。</p>
    ${byType}`;
}

function renderPolicies() {
  const indexEl = document.getElementById("policy-index");
  const readEl = document.getElementById("policy-read");
  if (policyMode !== "read") {
    indexEl.hidden = false;
    readEl.hidden = true;
    paneTitle.textContent = "政策解读";
    const lead = document.getElementById("policy-lead");
    if (lead) lead.textContent = `共 ${POLICIES.length} 份政策。点进某一条看解读与应对。`;
    document.getElementById("policy-list").innerHTML = POLICIES.map(
      (p) => `<button class="policy-item" type="button" data-policy="${p.id}">
        <b>${p.title}</b>
        <span>${p.date} · ${p.org}</span>
        <em>${p.brief}</em>
      </button>`
    ).join("");
    return;
  }
  const p = POLICIES.find((x) => x.id === currentPolicy);
  if (!p) {
    policyMode = "index";
    renderPolicies();
    return;
  }
  indexEl.hidden = true;
  readEl.hidden = false;
  paneTitle.textContent = "政策解读";
  readEl.innerHTML = `
    <button class="btn ghost sm policy-back" type="button" data-policy-back>返回政策列表</button>
    <p class="policy-read-meta">${p.date} · ${p.org}</p>
    <h3 class="policy-read-title">${p.title}</h3>
    <div class="result-block"><h4>解读</h4><p>${p.interp}</p></div>
    <div class="result-block"><h4>要点</h4><ul>${p.points.map((x) => `<li>${x}</li>`).join("")}</ul></div>
    <div class="result-block"><h4>审计与数据分析应对</h4>${p.actions
      .map((a) => `<p><span class="tag ${a.kind === "审计" ? "doing" : "ai"}">${a.kind}</span> ${a.text}</p>`)
      .join("")}
      <div style="margin-top:8px">
        <button class="btn sm" type="button" data-scene="detect">按政策筛审计对象</button>
        <button class="btn ghost sm" type="button" data-scene="plan">写入计划安排</button>
      </div>
    </div>`;
}

function renderCockpit() {
  document.getElementById("cockpit-cards").innerHTML =
    Object.entries(COCKPIT)
      .filter(([key]) => key !== "sample")
      .map(
        ([key, a]) => `<article class="cockpit-card">
        <h4>${a.title} <span class="tag ${a.status === "进行中" ? "warn" : a.status === "已完成" ? "ok" : ""}">${a.status}</span></h4>
        <p>输入：${a.input}</p>
        <button class="btn sm" type="button" data-scene="${key}">打开智能体</button>
      </article>`
      )
      .join("") +
    `<article class="cockpit-card">
        <h4>项目资料包 <span class="tag">待启动</span></h4>
        <p>资料清单、访谈提纲、整改通知一并导出，发给被审计单位。</p>
        <button class="btn sm" type="button" data-scene="fieldpack">打开资料包</button>
      </article>
      <article class="cockpit-card">
        <h4>取证单撰写 <span class="tag">待启动</span></h4>
        <p>把已确认疑点写成取证单，列明需被审计单位补交的资料。</p>
        <button class="btn sm" type="button" data-scene="draft">打开取证单</button>
      </article>
      <article class="cockpit-card">
        <h4>访谈智能体 <span class="tag">待启动</span></h4>
        <p>起草访谈提纲，转写纪要、提取决议与待办。</p>
        <button class="btn sm" type="button" data-scene="interview">打开访谈</button>
      </article>
      <article class="cockpit-card">
        <h4>问题完整性检查 <span class="tag">待启动</span></h4>
        <p>核对疑点是否入报告、证据与定性是否闭合。</p>
        <button class="btn sm" type="button" data-scene="complete">打开检查</button>
      </article>`;
}

function renderAgentWorkspace(key) {
  const a = COCKPIT[key];
  document.getElementById("agent-workspace").innerHTML = `
    <p class="pane-lead">${a.title} · ${a.status}。输入来自上一阶段与检测 / 政策模块。</p>
    <div class="result-block"><h4>本阶段输入</h4>${a.input}</div>
    ${a.output}`;
  document.getElementById("agent-hint").textContent = `当前：${a.title}`;
  document.getElementById("agent-prev").dataset.scene = a.prev;
  document.getElementById("agent-next").dataset.scene = a.next;
}

const ASSIST_TOOLS = {
  fieldpack: { title: "项目资料包", hint: "资料清单、访谈提纲、整改通知一并导出。" },
  law: { title: "法规与政策检索", hint: "匹配法规条款，并解释定性口径。" },
  talkdata: { title: "问数", hint: "自然语言取数、分层抽样与差异估计。" },
  complete: { title: "问题完整性检查", hint: "核对疑点是否入报告、证据与定性是否闭合。" },
  interview: { title: "访谈智能体", hint: "起草提纲、转写纪要、提取决议与待办。" },
  mmsearch: { title: "资料智搜", hint: "跨文本、表格、影像与录音召回。" },
  icmatrix: { title: "内控矩阵", hint: "导入手册与制度，抽取控制域和控制点。" },
};

function ctxHtml(scene) {
  const units = selectedUnits();
  const detectChip = detectState.synced
    ? `<span class="tag ok">已引用检测 ${units.length} 家</span>`
    : `<span class="tag">检测结果未引用</span>`;
  if (scene === "detect") {
    return `<h3>检测范围</h3>
      <div class="chip-row"><span class="tag doing">全级次下级单位</span><span class="tag ai">类型推荐</span></div>
      <h3>数据来源</h3>
      <div class="file"><span>组织架构与股权穿透</span><span class="tag ok">已接入</span></div>
      <div class="file"><span>在建工程 / 专项资金 / 安监台账</span><span class="tag ok">已接入</span></div>
      <div class="file"><span>任期与经责对象库</span><span class="tag warn">部分</span></div>
      <h3 style="margin-top:16px">入选口径</h3>
      <p style="font-size:12px;color:var(--muted);line-height:1.6;">每家单位写清为什么审：工程看超概与签证，专项看资金闲置和虚假贸易，安全看高危与外包，经责看离任和重大决策，内控评价看缺陷未整改。</p>
      <button class="btn sm" type="button" data-scene="plan">纳入年度计划</button>`;
  }
  if (scene === "plan") {
    return `<h3>计划口径</h3>
      <div class="chip-row"><span class="tag doing">2026 年度计划</span>${detectChip}</div>
      <p style="font-size:12px;color:var(--muted);line-height:1.6;margin:0 0 10px;">按下级单位应安排的审计类型编计划，可回写检测勾选结果。</p>
      <button class="btn sm" type="button" data-scene="detect">打开审计对象筛查</button>`;
  }
  if (scene === "policy") {
    const reading = policyMode === "read" ? POLICIES.find((x) => x.id === currentPolicy) : null;
    return `<h3>解读口径</h3>
      <div class="chip-row"><span class="tag doing">现行有效</span><span class="tag ai">${POLICIES.length} 份政策</span></div>
      ${reading ? `<p style="font-size:12px;color:var(--muted);line-height:1.6;margin:0 0 10px;">正在阅读：${reading.title}</p>` : `<p style="font-size:12px;color:var(--muted);line-height:1.6;margin:0 0 10px;">解读现行政策，给出审计安排与数据分析应对。</p>`}
      <button class="btn sm" type="button" data-scene="detect">去筛查审计对象</button>`;
  }
  if (ASSIST_TOOLS[scene]) {
    const t = ASSIST_TOOLS[scene];
    return `<h3>${t.title}</h3>
      <div class="chip-row"><span class="tag doing">协审工具</span>${detectChip}</div>
      <p style="font-size:12px;color:var(--muted);line-height:1.6;margin:0 0 10px;">${t.hint}</p>
      <button class="btn sm" type="button" data-scene="cockpit">回驾驶舱</button>
      <button class="btn ghost sm" type="button" data-scene="evidence">打开证据链</button>`;
  }
  if (scene === "scheme") {
    return `<h3>编制依据</h3>
      <div class="chip-row"><span class="tag doing">预算执行审计</span>${detectChip}</div>
      <div class="file"><span>审前调查报告.docx</span><span class="tag ok">已引用</span></div>
      <div class="file"><span>项目资料包（批复/账套/合同）</span><span class="tag warn">部分缺口</span></div>
      <div class="file"><span>2023–2024 预算执行实施方案</span><span class="tag ok">历史 2 份</span></div>
      <div class="file"><span>方案库 · 预算执行类模板</span><span class="tag ok">已适配</span></div>
      <div class="file"><span>实施方案 v1.2</span><span class="tag doing">编写中</span></div>
      <p style="font-size:12px;color:var(--muted);line-height:1.6;margin:10px 0;">按当前项目类型「财政预算执行审计」编制与检查，方案库和历史方案只取同类。</p>
      <button class="btn sm" type="button" data-scene="survey">打开审前调查</button>
      <button class="btn ghost sm" type="button" data-scene="cockpit">回驾驶舱</button>`;
  }
  if (scene === "cockpit" || COCKPIT[scene]) {
    return `<h3>驾驶舱状态</h3>
      <div class="chip-row"><span class="tag doing">现场实施</span>${detectChip}<span class="tag">主审 hong</span></div>
      <h3>阶段产出</h3>
      <div class="file"><span>审前调查报告</span><span class="tag ok">已生成</span></div>
      <div class="file"><span>实施方案 v1.2</span><span class="tag ok">已生成</span></div>
      <div class="file"><span>疑点确认单</span><span class="tag warn">6 条待核</span></div>
      <h3 style="margin-top:16px">可执行动作</h3>
      <button class="btn sm" type="button" data-scene="paper">编写底稿</button>
      <button class="btn ghost sm" type="button" data-scene="report">打开报告生成</button>`;
  }
  return `<h3>当前上下文</h3>
    <div class="chip-row">
      <span class="tag doing">预算执行</span>
      ${detectChip}
      <span class="tag">主审 hong</span>
    </div>
    <h3>引用资料</h3>
    <div class="file"><span>2025 审计实施方案.docx</span><span class="tag ok">已解析</span></div>
    <div class="file"><span>科目余额表_8月.xlsx</span><span class="tag ok">已解析</span></div>
    <div class="file"><span>${detectState.synced ? "审计对象筛查结果.json" : "会议费管理办法.pdf"}</span><span class="tag ${detectState.synced ? "ok" : "warn"}">${detectState.synced ? "已引用" : "摘要"}</span></div>
    <h3 style="margin-top:16px">可执行动作</h3>
    <p style="font-size:12px;color:var(--muted);line-height:1.6;margin:0 0 10px;">计划模块按检测类型编列项目；政策应对可写入计划安排。</p>
    <button class="btn sm" type="button" data-scene="detect">调用审计对象筛查</button>
    <button class="btn ghost sm" type="button" data-scene="plan">打开计划制定</button>`;
}

function showPane(name) {
  document.querySelectorAll(".pane").forEach((p) => p.classList.toggle("active", p.dataset.pane === name));
}

function setScene(scene) {
  const home = document.getElementById("assist-home");
  const work = document.getElementById("assist-work");
  const alias = {
    "gen-report": "report",
    trace: "doubt",
    meethelp: "interview",
    issue: "doubt",
    askreview: "law",
    findings: "report",
    polish: "report",
    rectify: "report",
    sample: "talkdata",
  };
  scene = alias[scene] || scene;
  currentScene = scene;
  document.querySelectorAll(".scene").forEach((b) => b.classList.toggle("active", b.dataset.scene === scene));

  if (scene === "home") {
    home.hidden = false;
    work.classList.remove("open");
    return;
  }

  home.hidden = true;
  work.classList.add("open");
  ctxEl.innerHTML = ctxHtml(scene);

  if (scene === "detect") {
    showPane("detect");
    paneTitle.textContent = "审计对象筛查";
    renderDetect();
    return;
  }
  if (scene === "plan") {
    showPane("plan");
    paneTitle.textContent = "计划制定";
    renderPlan();
    return;
  }
  if (scene === "policy") {
    showPane("policy");
    policyMode = "index";
    renderPolicies();
    return;
  }
  if (scene === "cockpit") {
    showPane("cockpit");
    paneTitle.textContent = "项目驾驶舱智能助手";
    renderCockpit();
    return;
  }
  if (ASSIST_TOOLS[scene]) {
    showPane(scene);
    paneTitle.textContent = ASSIST_TOOLS[scene].title;
    return;
  }
  if (scene === "scheme") {
    showPane("chat");
    paneTitle.textContent = "实施方案智能体";
    ask.placeholder = "直接说需求即可，我会记住上面的对话";
    seedSchemeChat();
    return;
  }
  if (COCKPIT[scene]) {
    const a = COCKPIT[scene];
    paneTitle.textContent = a.title;
    if (a.pane) showPane(a.pane);
    else {
      showPane("agent");
      renderAgentWorkspace(scene);
    }
    return;
  }
  showPane("chat");
  const meta = CHAT_SCENES[scene] || CHAT_SCENES.draft;
  paneTitle.textContent = meta.title;
  ask.placeholder = meta.ph;
}

function injectPlanFromDetect() {
  const units = selectedUnits();
  if (!units.length) {
    toast("请先勾选下级单位");
    return;
  }
  detectState.synced = true;
  planState.items = units.map((u, i) => ({
    id: u.id,
    name: u.name,
    parent: u.parent,
    type: u.type,
    score: u.score,
    trigger: u.trigger,
    why: u.why,
    quarter: PLAN_QUARTER[u.type] || "2026年第三季度",
    lead: PLAN_LEADS[i % PLAN_LEADS.length],
    status: "草案",
  }));
  setScene("plan");
  toast(`已将 ${units.length} 家下级单位纳入计划草案`);
}

const SCHEME_UPDATE_ASK = `
      <p style="margin:12px 0 8px">是否需要帮您更新当前方案？</p>
      <div class="scheme-prompts">
        <button type="button" data-scheme-prompt="update">需要，请更新当前方案</button>
        <button type="button" data-scheme-prompt="noupdate">暂不需要</button>
      </div>`;

const schemeState = { started: false, mode: null, history: [] };

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function seedSchemeChat() {
  if (schemeState.started) {
    msgs.scrollTop = msgs.scrollHeight;
    return;
  }
  schemeState.started = true;
  msgs.innerHTML = `
    <div class="bubble ai">
      您好，欢迎使用实施方案智能体，我能帮您做什么呢？您可以直接说明需求，我会记住本次对话里已经检查或编制过的内容。
      <div class="scheme-prompts">
        <button type="button" data-scheme-prompt="quality">1、检查当前方案</button>
        <button type="button" data-scheme-prompt="draft">2、协助编制方案</button>
      </div>
    </div>`;
  msgs.scrollTop = 0;
}

function schemeCheckHtml() {
  return `已按四项口径检查实施方案 v1.2（对照审前调查、项目资料包、方案库预算执行模板）。
      <div class="result-block" style="margin-top:10px"><h4>1. 方案编制是否完整</h4>
        <span class="tag warn">不完整</span>
        <ul>
          <li>已有：目标范围、工程/内控/数据分析三条线、现场 12 人日。</li>
          <li>缺：抽核比例与超概阈值、数据来源与模型口径、取证与底稿目录对应、报告时点。</li>
        </ul>
      </div>
      <div class="result-block"><h4>2. 审前调查与项目资料问题是否列入档案</h4>
        <span class="tag risk">未入档 5 项</span>
        <ul>
          <li>已入档案：预算调剂频繁、运维合同 154 万（合同已解析）。</li>
          <li>调查提出但未入档案：签证台账缺口、内控自评底稿未交、运维成果物缺失、历史问题 14 条中的 9 条、变更签证部分未到件。</li>
          <li>未入档则现场无法按问题闭环取证，建议先写入项目档案再锁方案。</li>
        </ul>
      </div>
      <div class="result-block"><h4>3. 方案分工是否有冲突</h4>
        <span class="tag risk">有冲突</span>
        <ul>
          <li>市住建局延伸：工程组与数据分析组均写「变更率核查」，职责重叠，未指定主责。</li>
          <li>信息化运维：内控组抽凭与重点支出组查合同并行，同一 154 万事项两人主审未分主辅。</li>
          <li>第 2 周交叉复核与工程组结算抽审日程撞车（均为第 2 周前 3 日）。</li>
        </ul>
      </div>
      <div class="result-block"><h4>4. 方案事项是否完整</h4>
        <span class="tag warn">事项有缺口</span>
        <ul>
          <li>方案库预算执行必查：调剂、重点支出、绩效、延伸、数据分析 — 绩效监控闭环未单列事项。</li>
          <li>调查应审未写入方案：专项资金闲置（卫健委条线）、会议费与培训费交叉列支。</li>
          <li>已写事项缺「对象—步骤—资料—产出」四要素的：内控穿行、供应商关联撞库。</li>
        </ul>
      </div>
      建议优先：补档案 5 项 → 拆开冲突分工 → 补绩效与交叉列支事项 → 再定稿。
      <div class="cite">检查口径 · 编制完整 / 问题入档 / 分工冲突 / 事项完整</div>
      ${SCHEME_UPDATE_ASK}`;
}

function schemeDraftHtml() {
  return `当前项目类型为<strong>财政预算执行审计</strong>。已按该类型体例编制。以下先列方案全文，后附编制说明。
      <div class="result-block" style="margin-top:10px">
        <h4>XX 市 2025 年度财政预算执行审计实施方案</h4>
        <p style="margin:0 0 10px;font-size:12px;color:var(--muted)">项目类型：财政预算执行审计 · 不按工程审计或经济责任审计体例编写</p>
        <p><b>一、审计目标</b><br />审查本级预算收支的真实性、合法性和预算执行绩效，揭示虚列支出、违规调剂、专项闲置、采购与合同脱节等问题，促进预算约束和绩效管理。</p>
        <p><b>二、审计范围</b><br />2025 年度市本级预算执行及决算草案相关数据；抽审重点预算单位。对调查发现的异常支出可延伸至项目和供应商，延伸不改变本项目类型。</p>
        <p><b>三、审计内容和重点</b>（预算执行类型目录，取自方案库同类模板）</p>
        <ul>
          <li><b>（一）预算编制与批复</b>：核批复与调整文件是否完整，指标是否及时下达。</li>
          <li><b>（二）预算执行</b>：收入是否应收尽收；支出是否按预算科目和用途列支；年中调剂是否履行规定程序，批复时点与账务是否一致（本年调查：调剂频繁）。</li>
          <li><b>（三）重点支出</b>：会议费、培训费、信息化运维抽凭；运维合同 154 万与成果物、发票、账套三方核对；关注会议费与培训费交叉列支。</li>
          <li><b>（四）政府采购与合同履行</b>：采购程序、合同要素与付款进度；结合已收集运维合同做履约核验。</li>
          <li><b>（五）预算绩效</b>：不少于 2 个专项，核绩效目标、监控、评价是否闭环；关注专项资金闲置。</li>
          <li><b>（六）延伸核实</b>：市住建局相关支出中与本级预算列支相关的超概、签证；市教育局经费中影响预算执行的内控缺陷。不另按工程审计或内控评价项目写方案。</li>
        </ul>
        <p><b>四、审计步骤与方法</b><br />审前调查已完成。现场顺序：调剂穿行 → 重点支出抽凭 → 绩效抽样 → 必要延伸。数据分析服务本类型事项（调剂对流、重复列支、供应商关联），命中回写疑点。未到件资料列入补证后再抽核。</p>
        <p><b>五、组织分工</b><br />主审 hong。预算执行一组：编制批复、调剂、结转结余。预算执行二组：会议培训、运维等重点支出及采购合同。综合组：绩效、问数与疑点汇总。延伸核实指定一人对接，避免与二组对同一 154 万双主责。</p>
        <p><b>六、时间安排</b><br />现场 12 人日（沿用当前实施方案工期）。第 1 周完成本级执行与重点支出；第 2 周后段做绩效、延伸核实与交叉复核。</p>
        <p><b>七、底稿与报告</b><br />底稿按预算执行事项设目录：批复与调剂、重点支出、采购合同、绩效、延伸核实。现场结束 5 个工作日内形成征求意见稿。</p>
        <p><b>八、需补充并列入档案的资料</b><br />运维成果物清单、会议培训明细与发票、专项绩效材料、与预算列支相关的签证及审批件。未入档不作为已查实问题写入方案结论。</p>
      </div>
      <div class="result-block">
        <h4>编制说明</h4>
        <p>本方案按照当前项目类型「财政预算执行审计」编制，材料取舍与章节设置如下。</p>
        <ul>
          <li><b>体例</b>：以审计方案库中预算执行类模板为蓝本，设置审计目标、范围、内容和重点、步骤方法、组织分工、时间安排及底稿要求。未采用工程审计「概算—招标—变更—结算」总纲，亦未采用经济责任审计「任职期间权力运行」总纲。</li>
          <li><b>同类先例</b>：重点事项对齐本机关 2023 年、2024 年市本级预算执行实施方案中的调剂、抽凭与绩效等必查内容，未引用其他项目类型文本。</li>
          <li><b>调查与资料</b>：审前调查及已收集资料中的预算调剂、信息化运维支出 154 万元、会议费与培训费交叉列支、专项资金闲置等，分别写入预算执行相应章节。市住建局超概及市教育局内控缺陷，仅作为与本级预算列支相关的延伸核实事项，不改变本项目类型。</li>
          <li><b>现行稿衔接</b>：沿用现行实施方案确定的现场 12 人日。原「工程、内控、数据分析」三条线表述，已按预算执行章节重新归并，避免体例混用。</li>
        </ul>
        <p>编制原则：以项目类型确定体例，以审前调查确定重点，以已收集资料确定可实施深度；资料未齐备的事项列入第八章补证，不作为已查实问题表述。</p>
      </div>
      <div class="cite">财政预算执行审计 · 编制说明</div>
      ${SCHEME_UPDATE_ASK}`;
}

function schemeRecallLine() {
  const prev = schemeState.history.slice(0, -1).slice(-4);
  if (!prev.length) return "已读取当前项目审前调查、项目资料、历史方案、方案库和实施方案。";
  return `已记住上文：${prev.map((t) => `「${escapeHtml(t)}」`).join(" → ")}。`;
}

function schemeFollowUpHtml(text) {
  const q = escapeHtml(text);
  const modeHint =
    schemeState.mode === "quality"
      ? "接续刚才的检查结论（编制缺口、未入档 5 项、分工冲突、事项不齐）。"
      : schemeState.mode === "draft"
        ? "接续刚才按「财政预算执行审计」类型写成的方案正文。"
        : "未再区分检查或编制，按整份实施方案上下文处理。";
  return `${schemeRecallLine()}${modeHint}
      <div class="result-block" style="margin-top:10px"><h4>针对您刚说的</h4>${q}</div>
      <div class="result-block"><h4>处理</h4>
        已把该要求叠到当前方案讨论中：能对应上次缺口的，优先改档案、分工和事项；能对应汇编稿章节的，写入目标、重点事项或组织进度。不必重新点选检查或编制。
      </div>
      ${SCHEME_UPDATE_ASK}`;
}

function schemeIntent(text) {
  const t = text.trim();
  if (t === "暂不需要" || t === "不需要") return "noupdate";
  if (/更新当前方案/.test(t)) return "update";
  if (t === "检查当前方案" || t === "1、检查当前方案") return "quality";
  if (t === "协助编制方案" || t === "2、协助编制方案") return "draft";
  return "follow";
}

function schemeReplyHtml(text) {
  schemeState.history.push(text);
  const intent = schemeIntent(text);
  if (intent === "quality") schemeState.mode = "quality";
  if (intent === "draft") schemeState.mode = "draft";
  if (intent === "noupdate") {
    return `好的，当前实施方案保持不变。上面的检查和编制内容我仍保留，您接着说即可。
      <div class="cite">实施方案未改写</div>`;
  }
  if (intent === "update") {
    return `已结合上文（${schemeRecallLine()}）把实施方案更新为 <b>v1.3</b>：
      <ul>
        <li>补入档案：签证台账缺口、自评底稿、运维成果物、历史问题未入档 9 条、未到件签证。</li>
        <li>分工：变更率核查主责工程组、数据分析组复核；运维 154 万主责重点支出组、内控组配合穿行；交叉复核调至第 2 周后 2 日。</li>
        <li>事项：单列绩效监控闭环、专项资金闲置、会议费与培训费交叉列支；内控穿行与供应商关联补齐四要素。</li>
        <li>编制：写明抽核比例、超概 10% 阈值、数据口径与底稿目录对应。</li>
      </ul>
      已回写项目实施方案。后续提问仍按 v1.3 接着改。
      <div class="cite">实施方案 v1.3 · 已更新</div>`;
  }
  if (intent === "quality") return schemeCheckHtml();
  if (intent === "draft") return schemeDraftHtml();
  return schemeFollowUpHtml(text);
}

function reply(text) {
  const user = document.createElement("div");
  user.className = "bubble user";
  user.textContent = text;
  msgs.appendChild(user);

  const ai = document.createElement("div");
  ai.className = "bubble ai";
  if (currentScene === "scheme") {
    ai.innerHTML = schemeReplyHtml(text);
  } else {
    const detectHint =
      currentScene === "plan" && planState.items.length
        ? `当前计划草案已列 ${planState.items.length} 个项目（${planState.items.map((u) => AUDIT_TYPES[u.type].label + "·" + u.name).join("、")}）。`
        : "如需锁定审计对象与类型，可先运行审计对象筛查再纳入计划。";
    ai.innerHTML = `已记下。建议拆成：核实依据、核对应金额、形成底稿或方案段落。${detectHint}<div class='cite'>可执行 · 转检测 / 转驾驶舱 / 写入底稿</div>`;
  }
  msgs.appendChild(ai);
  msgs.scrollTop = msgs.scrollHeight;
}

document.querySelectorAll(".scene").forEach((btn) => {
  btn.addEventListener("click", () => setScene(btn.dataset.scene));
});

document.querySelectorAll("[data-hist]").forEach((btn) => {
  btn.addEventListener("click", () => setScene(btn.dataset.hist));
});

document.getElementById("detect-filters").addEventListener("click", (e) => {
  const tag = e.target.closest("[data-filter]");
  if (!tag) return;
  detectState.filter = tag.dataset.filter;
  document.querySelectorAll("#detect-filters .tag").forEach((t) => t.classList.toggle("active", t === tag));
  renderDetect();
});

document.getElementById("detect-body").addEventListener("change", (e) => {
  const box = e.target.closest("[data-unit]");
  if (!box) return;
  if (box.checked) detectState.selected.add(box.dataset.unit);
  else detectState.selected.delete(box.dataset.unit);
  document.getElementById("detect-count").textContent = `已选 ${detectState.selected.size} 家下级单位，可纳入年度计划`;
});

document.getElementById("sync-detect").addEventListener("click", injectPlanFromDetect);
document.getElementById("confirm-plan").addEventListener("click", () => {
  if (!planState.items.length) {
    toast("请先从审计对象筛查纳入项目");
    return;
  }
  planState.items = planState.items.map((x) => ({ ...x, status: "已生成草案" }));
  renderPlan();
  toast("已生成 2026 年度审计计划草案");
});

document.querySelector('[data-pane="policy"]').addEventListener("click", (e) => {
  if (e.target.closest("[data-policy-back]")) {
    policyMode = "index";
    renderPolicies();
    ctxEl.innerHTML = ctxHtml("policy");
    return;
  }
  const item = e.target.closest("[data-policy]");
  if (!item) return;
  currentPolicy = item.dataset.policy;
  policyMode = "read";
  renderPolicies();
  ctxEl.innerHTML = ctxHtml("policy");
});

document.body.addEventListener("click", (e) => {
  const schemePrompt = e.target.closest("[data-scheme-prompt]");
  if (schemePrompt) {
    const map = {
      quality: "检查当前方案",
      draft: "协助编制方案",
      update: "需要，请更新当前方案",
      noupdate: "暂不需要",
    };
    reply(map[schemePrompt.dataset.schemePrompt] || schemePrompt.textContent.trim());
    return;
  }
  const sceneBtn = e.target.closest("[data-scene]");
  if (sceneBtn && !sceneBtn.classList.contains("scene") && !sceneBtn.dataset.view) {
    e.preventDefault();
    showView("assistant");
    setScene(sceneBtn.dataset.scene);
  }
});

send.addEventListener("click", () => {
  const text = (ask.value || "").trim();
  if (!text) return;
  ask.value = "";
  reply(text);
});

ask.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send.click();
  }
});

function renderToolbox(key) {
  const tools = {
    seal: { title: "合同公章检测", desc: "识别印章主体是否与签约方一致。", result: "<div class='result-block'><h4>检测结果</h4>海云运维合同印章与营业执照一致；澜海配送合同印章主体为「澜海商贸（青岛）」，与中标通知「澜海商贸」不一致。</div>" },
    amount: { title: "金额一致性校验", desc: "合同、账套、结算三方核对。", result: "<div class='result-block'><h4>核对</h4>运维合同 154 万 = 账套列支 154 万；结算送审 168 万，差额 14 万待说明。</div>" },
    dup: { title: "重复项检测", desc: "重复支付、报销与合同。", result: "<div class='result-block'><h4>重复</h4>会议费与培训费交叉列支 27 万，发票号重复 1 张。</div>" },
    sign: { title: "签章页识别", desc: "定位签章页并抽取签署人。", result: "<div class='result-block'><h4>签章页</h4>第 18 页：甲方李某、乙方陈某；骑缝章完整。</div>" },
    qty: { title: "工程量快速计算", desc: "按图纸 / 清单估算工程量。", result: "<div class='result-block'><h4>估算</h4>车站装修饰面 2,860㎡，与送审 3,240㎡差 13.3%。</div>" },
    price: { title: "材料价格查询", desc: "对照信息价与认价。", result: "<div class='result-block'><h4>询价</h4>11 项材料认价高于当季信息价，其中石材高 18%。</div>" },
    diff: { title: "文档对比", desc: "合同 / 标书 / 制度多版本条款 diff。", result: "<div class='result-block'><h4>差异</h4>v2 删除验收扣款条款；付款节点由「验收后 15 日」改为「到货后 7 日」。新增「到货即视为验收」。</div>" },
    convert: { title: "文档格式转换", desc: "PDF / Word / Excel 互转。", result: "<div class='result-block'><h4>转换</h4>已输出 Word 可编辑稿，表格 14 张保留，签章页嵌入为图片。</div>" },
    pdf: { title: "PDF 结构检查", desc: "乱码、缺页、书签、加密与目录完整性。", result: "<div class='result-block'><h4>检查</h4>缺页提示 1 处（第 7–8 页页码跳跃）；书签未覆盖附件；未加密。建议修复后再入库。</div>" },
  };
  const t = tools[key] || tools.seal;
  document.getElementById("toolbox-title").textContent = t.title;
  document.getElementById("toolbox-crumb").textContent = t.title;
  document.getElementById("toolbox-desc").textContent = t.desc;
  document.getElementById("toolbox-result").innerHTML = t.result;
  document.getElementById("toolbox-run").dataset.toast = t.title + "已完成";
}

const PARSE_TYPES = {
  contract: "<div class='result-block'><h4>合同要素</h4>供应商：海云信息 · 金额 154 万 · 期限 2025.01—2025.12 · 验收：季度巡检报告</div><div class='result-block'><h4>风险提示</h4>未约定成果物清单与扣款条款；与账套「运维费」列支一致，现场未见巡检报告。</div>",
  minutes: "<div class='result-block'><h4>决议</h4>原则同意运维续约；要求补交 2024 年巡检报告后再付款。</div><div class='result-block'><h4>待办</h4>财务处核对列支科目；审计组延伸海云信息关联采购。</div>",
  report: "<div class='result-block'><h4>报表期间</h4>2025 年 1–6 月科目余额表，辅助核算「供应商」已识别 86 户。</div><div class='result-block'><h4>异常</h4>运维费与会议费交叉列支 27 万，建议转重复项检测。</div>",
  voucher: "<div class='result-block'><h4>凭证</h4>记-0847 摘要「信息化运维」154 万，对方科目其他应付款-海云信息。</div><div class='result-block'><h4>附件</h4>缺成果物清单；发票抬头与合同主体一致。</div>",
  scan: "<div class='result-block'><h4>OCR</h4>签证-07 手写体置信度 71%，金额栏建议人工复核。</div><div class='result-block'><h4>结构</h4>建议先做 PDF 结构检查后再入库。</div>",
};

function renderParse(key) {
  const el = document.getElementById("parse-result");
  if (el) el.innerHTML = PARSE_TYPES[key] || PARSE_TYPES.contract;
}

const GAGENT_TOOLS = {
  diff: {
    name: "文档对比",
    html: "<div class='result-block'><h4>文档对比 · 已返回</h4>v2 删除验收扣款条款；付款由验收后 15 日改为到货后 7 日。<div style='margin-top:8px'><button class='btn ghost sm' type='button' data-view='toolbox' data-tool='diff'>在工作台打开</button></div></div>",
  },
  parse: {
    name: "各类文档智能解析",
    html: "<div class='result-block'><h4>智能解析 · 已返回</h4>合同要素：海云信息 · 154 万 · 缺成果物条款。纪要待办 2 条已抽取。<div style='margin-top:8px'><button class='btn ghost sm' type='button' data-view='tool-doc'>在工作台打开</button></div></div>",
  },
  convert: {
    name: "文档格式转换",
    html: "<div class='result-block'><h4>格式转换 · 已返回</h4>签证-07.pdf → Word，表格保留，手写区标注待复核。<div style='margin-top:8px'><button class='btn ghost sm' type='button' data-view='toolbox' data-tool='convert'>在工作台打开</button></div></div>",
  },
  pdf: {
    name: "PDF 结构检查",
    html: "<div class='result-block'><h4>PDF 结构检查 · 已返回</h4>缺页 1 处，书签未覆盖附件。<div style='margin-top:8px'><button class='btn ghost sm' type='button' data-view='toolbox' data-tool='pdf'>在工作台打开</button></div></div>",
  },
};

function invokeGAgentTool(key) {
  const t = GAGENT_TOOLS[key];
  if (!t) return;
  document.getElementById("gagent-log").innerHTML = `<h4>编排</h4>已调用工具「${t.name}」，结果写入下方，可继续串联其他工具。`;
  document.getElementById("gagent-result").innerHTML = t.html;
  toast("已调用" + t.name);
}

function runGAgent() {
  document.getElementById("gagent-log").innerHTML =
    "<h4>编排</h4>① 文档对比 v1/v2 → ② 智能解析合同条款 → ③ 建议对签证 PDF 做结构检查后再转换。";
  document.getElementById("gagent-result").innerHTML = GAGENT_TOOLS.diff.html + GAGENT_TOOLS.parse.html;
  toast("已按任务编排并调用文档对比与智能解析");
}

renderParse("contract");

renderDetect();
renderPolicies();
renderCockpit();
setScene("home");
