const views = document.querySelectorAll(".view");
const navBtps = document.querySelectorAll(".nav-btn");
const toastEl = document.getElementById("toast");

const moduleOf = {
  workbench: "workbench",
  regulate: "regulate",
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
  "app-data": "workbench",
  "app-knowledge": "workbench",
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
    prompts: ["提取预算调剂未闭环事项", "汇总 2024 年大额支出议题", "列出有资金无成果物的事项"],
    result:
      "<div class='result-block'><h4>纪要摘要</h4>41 次会议中，5 项预算调剂/大额支出未形成闭环；8 项有资金流向但缺批复或成果物。</div><div class='result-block'><h4>待办</h4>对外投资设立子公司列支 1,200 万缺完整预算安排依据。<div style='margin-top:8px'><button class='btn ghost sm' data-view='assistant' data-scene='draft'>让助手做发现取证智能体</button></div></div>",
  },
  law: {
    title: "法律法规智能体",
    desc: "查询法规资料知识库，匹配法规条款",
    prompts: ["匹配招投标围标串标条款", "查找报销标准上限", "预算安排与拨款依据"],
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
    desc: "按审计类型匹配常见关注问题与检查清单，不绑定单一项目",
    prompts: ["招投标类型应关注哪些问题", "虚假贸易检查清单", "企业预算执行问题库"],
    result:
      "<div class='result-block'><h4>问题库摘要</h4>招投标：固定陪标、分差过小、联系方式撞库。<br/>虚假贸易：同日进销、无仓单、加价无服务。<br/>企业预算执行：调剂倒置、成果物缺失、交叉列支。</div><div class='result-block'><h4>跳转</h4><button class='btn sm' data-view='app-trade'>虚假贸易智能体</button> <button class='btn ghost sm' data-view='app-bid'>招投标智能体</button></div>",
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
  if (id === "regulate") renderRegulate();
  if (id.startsWith("app-")) paintSpecialAgentChrome(id);
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
      setScene("report");
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
  const regHome = e.target.closest("[data-regulate='home']");
  if (regHome) {
    regulatePath = [];
    renderRegulate();
    return;
  }
  const regCrumb = e.target.closest("[data-regulate-crumb]");
  if (regCrumb) {
    const idx = Number(regCrumb.dataset.regulateCrumb);
    regulatePath = regulatePath.slice(0, idx + 1);
    renderRegulate();
    return;
  }
  const regOpen = e.target.closest("[data-regulate-open]");
  if (regOpen) {
    regulatePath.push(regOpen.dataset.regulateOpen);
    renderRegulate();
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
  budget: { label: "企业预算执行审计", tag: "doing" },
  spec: { label: "专项审计", tag: "ai" },
  safety: { label: "安全审计", tag: "ok" },
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
    name: "城投信息公司及所属业务单元",
    parent: "城投信息公司",
    type: "ic",
    score: 79,
    trigger: "自评缺陷 11 项未整改，采购授权过大",
    why: "连续两年内控自评缺陷未闭环，基层采购授权集中在少数人。内控监督评价要查单位层面控制是否失效、授权是否可追溯，避免采购和经费在校群层面失控。",
  },
  {
    id: "u5",
    name: "集团卫生板块专项预算单位",
    parent: "XX 集团",
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
    name: "集团财务部（预算管理）",
    parent: "XX 集团",
    type: "budget",
    score: 80,
    trigger: "全面预算调剂频次偏高，考核监控弱",
    why: "年中预算调剂频繁、预算考核监控未闭环，费用科目在账上被反复改写。安排企业预算执行审计，是为核对调剂审批、时点与账务是否一致，防止「调剂」掩盖成本费用结构问题。",
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
    name: "集团本部及重点子公司预算包",
    parent: "XX 集团",
    type: "budget",
    score: 86,
    trigger: "调剂频繁、重点费用与预算考核薄弱",
    why: "集团全面预算执行中年中调剂偏多、重点费用抽凭与预算考核材料不齐。安排企业预算执行审计，可核对调剂审批与账务时点、抽核会议培训与信息化支出、查预算考核闭环，防止费用结构被调剂掩盖。",
  },
  {
    id: "u11",
    name: "交通投资板块预算单位",
    parent: "市交通投资集团",
    type: "budget",
    score: 81,
    trigger: "轨道交通相关预算列支与调剂集中",
    why: "轨道交通相关预算列支与年中调剂集中，部分支出与项目进度脱节。企业预算执行审计核的是预算下达、用途合规与考核，而不是再做一遍工程结算。",
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
  budget: "2026年第一季度",
  safety: "2026年第二季度",
  eng: "2026年第二至三季度",
  spec: "2026年第三季度",
  ic: "2026年第四季度",
};
const PLAN_LEADS = ["张敏", "李强", "王倩", "赵磊"];

const POLICY_CATEGORIES = [
  {
    id: "penetrate",
    label: "穿透式监管",
    actions: [
      { kind: "审计", text: "方案单列股权链、资金链、合同链；企业预算执行与集团审计评价「监管穿透力」；延伸核司库覆盖、大额付款审批链；形成会商清册（资金不可溯 / 子企业不可见 / 模型未覆盖）。虚假贸易、靠企吃企、过度负债、违规担保列入必查。" },
      { kind: "数据分析", text: "企业画像做主体穿透；司库、核算、合同三方对碰；财务/供应链/合同/境外与股权联表；循环贸易、担保链、关联采购出预警；按行业切片输出一企一册。" },
      { kind: "前瞻预警", text: "按产权、投资、财务、资金、金融、采购供应链、合同、境外、债务、薪酬、担保十一类重点领域配置分级阈值；异常直达集团总部；迟报漏报瞒报纳入追责口径。" },
      { kind: "组织协同", text: "与内控、纪检、巡视、财会监督共享问题台账；重大疑点提级派单；整改销号与模型回标闭环，实现发现一类问题完善一批制度。" },
      { kind: "系统建设", text: "推动「五自动」：自动采集、自动识别、自动预警、自动派单、自动督办；管控节点可执行、可监督、可追溯；口径统一后再谈模型。" },
    ],
  },
  {
    id: "ic",
    label: "内控体系建设与监督",
    actions: [
      { kind: "审计", text: "内控监督评价改用穿透缺陷口径；评价报告写清覆盖级次与系统、风险识别、可追溯问题清单；断点、口径不一致、无预警、制度未嵌入节点一律列为缺陷。" },
      { kind: "数据分析", text: "测主数据是否贯穿子企业；采购、合同、资金是否同口径；未授权与断点数据列入缺口，支撑两年穿透性测试。" },
    ],
  },
  {
    id: "accountability",
    label: "责任追究与红线",
    actions: [
      { kind: "审计", text: "对照追责红线抽重大投资、担保、贸易业务，核决策纪要与资金流是否同链；底稿保留决策链以对应终身问责。" },
      { kind: "数据分析", text: "红线规则配进模型：循环贸易、担保圈、关联交易；命中即生成取证单，无采集点视为穿透失败写入发现。" },
    ],
  },
];

const POLICIES = [
  {
    id: "p1",
    category: "penetrate",
    title: "关于加强中央企业穿透式监管的指导意见（试行）",
    date: "2026-02",
    org: "国资发监督规〔2026〕2号",
    brief: "确立四全穿透标准，经营可视、资金可溯、风险可控。",
    interp:
      "本文件是穿透式监管的顶层设计（国资发监督规〔2026〕2号脉络）。监管从「层层报表」改为「向下看清、横向关联、事中预警」。审计应把「主体—业务—风险」写成可检查三条线，并对十一类重点领域建模型阈值。定性宜写监管穿透力不足、风险不可见，避免空泛写「内控薄弱」。应对上同步推进：规则模型、司库底座、监督协同与追责闭环。",
    points: [
      "主体穿透：子企业、特殊目的实体、最终受益人",
      "业务穿透：实质重于形式，透过法律形式看交易本质",
      "风险穿透：产权、投资、财务资金、采购、金融、合同、境外、债务、薪酬、担保等重点领域",
      "理念：事中预警为主，事后追责为辅；放权与严监管统一",
      "应对：分级预警阈值 + 问题台账全息画像 + 自动派单督办",
    ],
  },
  {
    id: "p2",
    category: "ic",
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
  },
  {
    id: "p3",
    category: "penetrate",
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
  },
  {
    id: "p4",
    category: "penetrate",
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
  },
  {
    id: "p5",
    category: "penetrate",
    title: "国资委穿透式监管工作会议部署要点",
    date: "2026-07",
    org: "国务院国资委工作会议",
    brief: "年内多次专项部署，强调专业监管能力和监督协同。",
    interp:
      "工作会议把文件变成时间表：智能化、穿透式监管要与出资人监督、审计、巡视、纪检协同。应对：列出协同清单（模型先扫 / 纪检交接 / 巡视移交）；按「可溯资金 / 不可见子企业 / 无预警」分类形成会商输入；重大风险直达集团总部。",
    points: [
      "深入推进穿透式监管，提升专业监管能力",
      "经营行为可视、资金流动可溯、重大风险可控",
      "强化各类监督力量协同",
      "分行业、一企一策与纵向看清相结合",
      "应对：会商清册 + 提级派单 + 典型案例警示",
    ],
  },
  {
    id: "p6",
    category: "accountability",
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
  },
];

const COCKPIT = {
  survey: {
    title: "审前调查智能体",
    status: "已完成",
    next: "scheme",
    prev: "cockpit",
    input: "被审计单位资料 · 企业画像 · 检测与政策",
    output:
      "<div class='result-block'><h4>审前调查报告</h4>综合单位资料与企业画像生成，含调查疑点 5 条。建议建设公司作工程延伸、信息公司作内控评价对象。</div><div class='result-block'><h4>资料与画像</h4>资料 7 项（缺件 3）；画像已标风险标签。可对话重新生成报告。<div style='margin-top:8px'><button class='btn sm' type='button' data-scene='fieldpack'>打开项目资料</button></div></div>",
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
    title: "审计指引智能体",
    status: "进行中",
    pane: "trace",
    next: "draft",
    prev: "scheme",
    input: "方案重点事项 · 问数结果 · 合同与凭证抽核",
    output: "",
  },
  sample: {
    title: "抽样与统计",
    status: "未进行",
    pane: "sample",
    next: "interview",
    prev: "draft",
    input: "已标记疑点 · 合同包与费用总体",
    output: "",
  },
  evidence: {
    title: "证据链管理",
    status: "未进行",
    pane: "evidence",
    next: "cockpit",
    prev: "report",
    input: "已确认疑点 · 穿透路径 · 抽样异常",
    output: "",
  },
  paper: {
    title: "底稿智能体",
    status: "未进行",
    next: "report",
    prev: "interview",
    input: "已确认疑点 · 取证单 · 法规引用。撰写指引（做什么/查什么/要什么资料）；检查已写底稿的深度、范围与定性。",
    output: "",
  },
  report: {
    title: "报告生成智能体",
    status: "未进行",
    next: "evidence",
    prev: "paper",
    input: "项目内底稿问题 · 按底稿成稿 · 报告内容完整性检查",
    output: "",
  },
};

const GUIDE_STATUS = {
  issue: { label: "已确认问题", tag: "risk" },
  clear: { label: "已确认无问题", tag: "ok" },
  pending: { label: "待确认", tag: "warn" },
};

/** 实施方案事项树：根节点为方案名称，下级为方案事项 */
const SCHEME_NAME = "XX 集团 2025 年度企业预算执行审计实施方案";
const SCHEME_MATTER_TREE = [
  {
    id: "sm-root",
    name: SCHEME_NAME,
    content: "本项目实施方案根节点。下挂预算调剂、工程变更、重点支出与专项绩效等事项，点击下级查看疑点与核查路径。",
    children: [
  {
    id: "sm1",
    name: "一、预算调剂与批复",
    content: "核对本级预算调整文件、批复时点与账务是否一致；关注调剂对流与超权限调整。",
    children: [
      {
        id: "sm1-1",
        name: "1.1 预算调剂程序",
        content: "调剂申请、集体决策、集团批复与入账时点四要素核对。",
        relate: {
          data: [
            { name: "预算调剂明细账", desc: "调剂前后科目、金额、记账日期", status: "已生成" },
            { name: "集团批复文号台账", desc: "批复日期与文号对照凭证", status: "部分已取" },
            { name: "科目对流清单", desc: "基建 ↔ 行政运行互调记录", status: "待调阅" },
          ],
          docs: [
            { name: "调剂申请及党组纪要", kind: "资料", status: "已齐" },
            {
              name: "集团批复扫描件",
              kind: "资料",
              status: "部分缺失",
              gap: "缺第 2、3 页（含批复金额与文号页）",
            },
            {
              name: "科目对流书面说明",
              kind: "资料",
              status: "缺失",
              gap: "基建与行政运行互调无逐笔书面说明",
            },
            { name: "实施方案 · 1.1 预算调剂程序", kind: "方案", status: "已齐" },
            { name: "问数 · 调剂时点差异表", kind: "数据", status: "已齐" },
          ],
          missingData: ["科目对流完整清单（含对方科目与金额）", "调剂凭证电子附件未全量挂接"],
          missingDocs: [
            "集团批复扫描件缺第 2、3 页（含批复金额与文号页）",
            "科目对流书面说明（逐笔）未提供",
          ],
          steps: [
            { no: 1, text: "调剂申请 → 党组纪要 → 批复文号 → 凭证日期", done: true },
            { no: 2, text: "比对入账日与批复日，标记倒置记录", done: true },
            { no: 3, text: "科目对流逐笔索取书面说明", done: false },
            { no: 4, text: "回写已确认问题 / 待确认状态", done: false },
          ],
        },
        doubts: [
          {
            title: "调剂入账早于批复 11 天",
            unit: "市交通运输局本级",
            reason: "两笔调剂凭证记账日期早于集团批复文，程序倒置。",
            path: "调剂申请 → 党组纪要 → 批复文号 → 凭证日期",
            status: "issue",
          },
          {
            title: "科目对流未见说明",
            unit: "市交通运输局本级",
            reason: "基建科目与行政运行科目互调，缺书面说明。",
            path: "科目余额表 → 调剂明细 → 说明附件",
            status: "pending",
          },
        ],
      },
      {
        id: "sm1-2",
        name: "1.2 结转结余管理",
        content: "核对结转结余规模、用途限定与绩效挂钩情况。",
        doubts: [
          {
            title: "专项结余长期挂账",
            unit: "集团卫生板块专项预算单位",
            reason: "专项到账后 9 个月未形成有效支出，绩效目标未启动。",
            path: "指标文 → 到账流水 → 支出进度 → 绩效监控表",
            status: "issue",
          },
          {
            title: "结转用途与指标一致",
            unit: "市交通运输局本级",
            reason: "抽核 6 笔结转，用途与指标文一致，未见挪用。",
            path: "结转明细 → 指标文 → 支出凭证",
            status: "clear",
          },
        ],
      },
    ],
  },
  {
    id: "sm2",
    name: "二、工程变更与结算",
    content: "沿概算—招标—变更—结算链条核查超概、签证真实性与审批权限。",
    children: [
      {
        id: "sm2-1",
        name: "2.1 变更超概控制",
        content: "超概阈值、联签审批、签证与监理日志一致性。",
        doubts: [
          {
            title: "车站装修变更超概 12.6%",
            unit: "市交通运输局本级",
            reason: "概算批复后连续签证，变更累计超概且未见联签审批。",
            path: "概算批复 → 招标控制价 → 变更签证册 → 监理日志 → 结算送审稿",
            status: "issue",
          },
          {
            title: "配套工程签证滞后结算",
            unit: "市轨道交通集团有限公司",
            reason: "签证集中补录，结算挂账超过 18 个月。",
            path: "施工日志 → 签证审批时点 → 监理确认 → 结算送审对比",
            status: "issue",
          },
        ],
      },
      {
        id: "sm2-2",
        name: "2.2 监理与旁站",
        content: "抽核旁站记录与现场影像、进度款支付节点是否对应。",
        doubts: [
          {
            title: "监理旁站记录抽核",
            unit: "市轨道交通集团有限公司",
            reason: "抽核 12 份旁站记录，时间与影像资料可对应。",
            path: "旁站记录 → 现场影像 → 进度款支付节点",
            status: "clear",
          },
        ],
      },
    ],
  },
  {
    id: "sm3",
    name: "三、重点支出与采购",
    content: "对会议费、培训费、信息化运维等重点支出抽凭，核合同、成果物与供应商关联。",
    children: [
      {
        id: "sm3-1",
        name: "3.1 信息化运维",
        content: "合同约定成果物、付款与现场交付是否闭环。",
        doubts: [
          {
            title: "信息化运维缺成果物 154 万",
            unit: "市交通运输局本级",
            reason: "合同约定季度巡检报告，账套已全额列支，现场未见成果物。",
            path: "运维合同 → 付款凭证 → 验收/巡检报告台账 → 供应商现场核对",
            status: "issue",
          },
        ],
      },
      {
        id: "sm3-2",
        name: "3.2 供应商关联与食堂配送",
        content: "中标人、运维商、配送商实控人撞库与交易流水比对。",
        relate: {
          data: [
            { name: "供应商主数据撞库结果", desc: "电话、邮箱、注册地址、法人", status: "已生成" },
            { name: "中标与投标组合表", desc: "同场投标、分差、固定三家", status: "已生成" },
            { name: "往来款互转流水", desc: "集团本部 → 海云 → 澜海 → 回款", status: "部分已取" },
            { name: "股权与任职穿透表", desc: "实控人、交叉任职", status: "待调阅" },
          ],
          docs: [
            { name: "中标通知书 / 合同", kind: "资料", status: "已齐" },
            {
              name: "营业执照与开户信息",
              kind: "资料",
              status: "部分缺失",
              gap: "澜海商贸开户许可证未提供",
            },
            { name: "食堂配送与运维合同", kind: "资料", status: "已齐" },
            {
              name: "仓储 / 物流单据",
              kind: "资料",
              status: "缺失",
              gap: "无仓单、运单及出库记录等实质性业务凭证",
            },
            { name: "关联图谱导出（示意）", kind: "数据", status: "已齐" },
          ],
          missingData: ["股权与任职穿透完整表", "往来互转对应的对方账户流水未齐"],
          missingDocs: [
            "澜海商贸开户许可证未提供",
            "仓储 / 物流单据（无仓单、运单及出库记录）",
          ],
          steps: [
            { no: 1, text: "中标通知 → 供应商主数据撞库", done: true },
            { no: 2, text: "实控人 / 股东穿透 → 交易流水比对", done: true },
            { no: 3, text: "银行流水 → 合同与发票 → 仓储/物流单据", done: false },
            { no: 4, text: "形成关联结论并转取证 / 询问函", done: false },
          ],
        },
        doubts: [
          {
            title: "食堂配送与运维商疑似同一实控",
            unit: "市交通运输局本级",
            reason: "中标食堂配送商与运维商手机号、注册地址撞库。",
            path: "中标通知 → 供应商主数据撞库 → 实控人/股东穿透 → 交易流水比对",
            status: "pending",
          },
          {
            title: "往来款互转 2,480 万",
            unit: "市轨道交通集团有限公司",
            reason: "集团本部 → 海云信息 → 澜海商贸 → 回款，资金闭环缺实质业务。",
            path: "银行流水 → 合同与发票 → 仓储/物流单据 → 关联方图谱",
            status: "pending",
          },
        ],
      },
      {
        id: "sm3-3",
        name: "3.3 会议费与培训费",
        content: "按月分层抽样，核交叉列支与审批事由。",
        doubts: [
          {
            title: "会议费季节性高峰",
            unit: "市交通运输局本级",
            reason: "3 月、9 月会议费明显高于均值，核实后属业务旺季，未见交叉列支。",
            path: "科目明细 → 按月分层抽样 → 发票与审批单日期核对",
            status: "clear",
          },
          {
            title: "培训费与会议费科目使用",
            unit: "集团卫生板块专项预算单位",
            reason: "抽凭 8 笔，科目归集与审批事由一致，未见交叉列支。",
            path: "费用明细 → 审批单 → 发票附件核对",
            status: "clear",
          },
        ],
      },
    ],
  },
  {
    id: "sm4",
    name: "四、专项资金与绩效",
    content: "选取专项资金核目标、监控、评价是否闭环；关注闲置与验收脱节。",
    children: [
      {
        id: "sm4-1",
        name: "4.1 专项闲置与绩效",
        content: "到账、支出进度与绩效监控表对照。",
        doubts: [
          {
            title: "设备采购验收脱节",
            unit: "集团卫生板块专项预算单位",
            reason: "已付款设备缺验收单，库房台账与发票型号不一致。",
            path: "采购合同 → 付款凭证 → 验收单 → 固定资产卡片",
            status: "pending",
          },
        ],
      },
    ],
  },
  ],
  },
];

const guideState = {
  selectedId: "sm-root",
  detailId: null,
  detailStatus: null,
  relateId: null,
  aiOpen: false,
  checked: new Set(),
};

(function assignDoubtIds(nodes, counter = { n: 1 }) {
  (nodes || []).forEach((node) => {
    (node.doubts || []).forEach((d) => {
      if (!d.id) d.id = `d${counter.n++}`;
    });
    if (node.children?.length) assignDoubtIds(node.children, counter);
  });
})(SCHEME_MATTER_TREE);

function findDoubtById(id, nodes = SCHEME_MATTER_TREE) {
  for (const n of nodes) {
    const hit = (n.doubts || []).find((d) => d.id === id);
    if (hit) return hit;
    if (n.children?.length) {
      const childHit = findDoubtById(id, n.children);
      if (childHit) return childHit;
    }
  }
  return null;
}

function setDoubtStatus(doubtId, status) {
  const doubt = findDoubtById(doubtId);
  if (!doubt || !GUIDE_STATUS[status]) return false;
  if (doubt.status === status) return false;
  doubt.status = status;
  return true;
}

function findMatter(id, nodes = SCHEME_MATTER_TREE) {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children?.length) {
      const hit = findMatter(id, n.children);
      if (hit) return hit;
    }
  }
  return null;
}

function matterOwnDoubts(node) {
  return node.doubts || [];
}

function matterAllDoubts(node) {
  const own = matterOwnDoubts(node);
  const child = (node.children || []).flatMap(matterAllDoubts);
  return [...own, ...child];
}

function matterStatusCounts(node) {
  const doubts = matterAllDoubts(node);
  return {
    issue: doubts.filter((d) => d.status === "issue").length,
    clear: doubts.filter((d) => d.status === "clear").length,
    pending: doubts.filter((d) => d.status === "pending").length,
    total: doubts.length,
  };
}

/** 关联分析包：需查看数据、相关资料、查的过程，并提示缺数缺料 */
function matterRelatePack(matter) {
  const doubts = matterAllDoubts(matter);
  const units = [...new Set(doubts.map((d) => d.unit).filter(Boolean))];
  const paths = [...new Set(doubts.map((d) => d.path).filter(Boolean))];
  const base = matter.relate
    ? { ...matter.relate }
    : {
        data: [
          { name: "科目余额 / 明细账", desc: units.length ? `覆盖 ${units.join("、")}` : "按事项范围拉取账套明细", status: "待调阅" },
          { name: "银行流水与往来科目", desc: "核对资金对流、互转与回款时点", status: "待调阅" },
          { name: "合同与付款凭证", desc: "合同要素、付款批次、附件完整性", status: "部分已取" },
          { name: "供应商主数据撞库结果", desc: "电话、地址、实控人、同场投标", status: "已生成" },
        ],
        docs: [
          { name: "实施方案 · " + matter.name, kind: "方案", status: "已齐" },
          { name: "审前调查报告（摘要）", kind: "调查", status: "已齐" },
          {
            name: "调剂批复 / 变更签证 / 合同扫描件",
            kind: "资料",
            status: "部分缺失",
            gap: "变更签证第 7–9 份未到件；运维合同缺签章页",
          },
          { name: "问数结果与抽样清单", kind: "数据", status: "已齐" },
          {
            name: "关键成果物 / 验收记录",
            kind: "资料",
            status: "缺失",
            gap: "巡检报告、成果物清单、验收单均未提供",
          },
        ],
        missingDocs: [
          "变更签证第 7–9 份未到件",
          "运维合同缺签章页",
          "巡检报告、成果物清单、验收单均未提供",
        ],
        steps: paths.length
          ? paths.map((p, i) => ({ no: i + 1, text: p, done: i < Math.ceil(paths.length / 2) }))
          : [
              { no: 1, text: "明确事项范围与被审计单位", done: true },
              { no: 2, text: "调取数据卡片与账套明细", done: true },
              { no: 3, text: "对照资料做穿行与比对", done: false },
              { no: 4, text: "形成疑点结论并回写状态", done: false },
            ],
      };

  const missingData = [
    ...(base.missingData ||
      (base.data || [])
        .filter((d) => d.status === "待调阅" || d.status === "缺失" || d.status === "未授权")
        .map((d) => `${d.name}${d.desc ? `（${d.desc}）` : ""}`)),
  ];
  const missingDocs = [
    ...(base.missingDocs ||
      (base.docs || [])
        .filter((d) => /缺失|缺页|未齐|未到/.test(d.status || ""))
        .map((d) => {
          if (d.gap) return `${d.name}：${d.gap}`;
          return `${d.name}${d.status && d.status !== "缺失" ? ` · ${d.status}` : ""}`;
        })),
  ];

  if (!missingData.length) {
    missingData.push("暂无明确缺数；请确认账套授权与卡片是否覆盖本事项全部被审计单位。");
  }
  if (!missingDocs.length) {
    missingDocs.push("暂无明确缺料；建议复核扫描件页码与签章是否齐全。");
  }

  return { ...base, missingData, missingDocs };
}

function guideGapTipsHtml(pack) {
  const dataItems = (pack.missingData || []).map((x) => `<li>${escapeHtml(x)}</li>`).join("");
  const docItems = (pack.missingDocs || []).map((x) => `<li>${escapeHtml(x)}</li>`).join("");
  return `<div class="guide-gap-tips">
      <div class="guide-gap data">
        <h5><span class="tag warn">提示</span> 缺少哪些数据</h5>
        <ul>${dataItems}</ul>
      </div>
      <div class="guide-gap docs">
        <h5><span class="tag warn">提示</span> 资料缺什么</h5>
        <ul>${docItems}</ul>
      </div>
    </div>`;
}

function guideRelateBtn(matterId) {
  return `<button type="button" class="btn ghost sm" data-relate="${matterId}">关联分析</button>`;
}

function guideStatusActionsHtml(matterId, counts) {
  return `<div class="guide-status-actions">
      <button type="button" class="guide-st issue" data-doubts="${matterId}" data-status="issue" title="查看已确认问题明细">
        已确认问题 <b>${counts.issue}</b>
      </button>
      <button type="button" class="guide-st clear" data-doubts="${matterId}" data-status="clear" title="查看已确认无问题明细">
        已确认无问题 <b>${counts.clear}</b>
      </button>
      <button type="button" class="guide-st pending" data-doubts="${matterId}" data-status="pending" title="查看待确认明细">
        待确认 <b>${counts.pending}</b>
      </button>
    </div>`;
}

function guideStatusCellsHtml(matterId, counts) {
  return `
      <td class="num-cell"><button type="button" class="guide-st issue" data-doubts="${matterId}" data-status="issue">${counts.issue}</button></td>
      <td class="num-cell"><button type="button" class="guide-st clear" data-doubts="${matterId}" data-status="clear">${counts.clear}</button></td>
      <td class="num-cell"><button type="button" class="guide-st pending" data-doubts="${matterId}" data-status="pending">${counts.pending}</button></td>
      <td>${guideRelateBtn(matterId)}</td>`;
}

function guideDoubtRowHtml(item) {
  const st = GUIDE_STATUS[item.status] || GUIDE_STATUS.pending;
  const id = item.id || "";
  const how = item.how || item.path || "—";
  return `<article class="doubt-row" data-doubt-row="${escapeHtml(id)}">
      <div class="doubt-row-main">
        <div class="doubt-row-hd">
          <h5>${escapeHtml(item.title)}</h5>
          <span class="tag ${st.tag}">${st.label}</span>
        </div>
        <p class="doubt-row-line">${escapeHtml(item.unit || "—")} · ${escapeHtml(item.reason)}</p>
        <p class="doubt-row-line muted">怎么查出来的：${escapeHtml(how)}</p>
      </div>
      <div class="doubt-ops">
        <button type="button" class="btn ghost sm ${item.status === "issue" ? "is-on" : ""}" data-set-doubt="${escapeHtml(id)}" data-set-status="issue">确认问题</button>
        <button type="button" class="btn ghost sm ${item.status === "clear" ? "is-on" : ""}" data-set-doubt="${escapeHtml(id)}" data-set-status="clear">确认无问题</button>
        <button type="button" class="btn ghost sm ${item.status === "pending" ? "is-on" : ""}" data-set-doubt="${escapeHtml(id)}" data-set-status="pending">待确认</button>
      </div>
    </article>`;
}

function guideDoubtTableHtml(doubts, focusStatus) {
  if (!doubts.length) {
    return `<p class="muted" style="margin:8px 0 0;font-size:12px">本事项暂无疑点。</p>`;
  }
  const keys = focusStatus ? [focusStatus] : ["issue", "clear", "pending"];
  const body = keys
    .map((key) => {
      const rows = doubts.filter((d) => d.status === key);
      if (!rows.length) return "";
      const st = GUIDE_STATUS[key];
      return `<div class="guide-group">
          <h5><span class="tag ${st.tag}">${st.label}</span> <span class="muted">${rows.length} 条</span></h5>
          <div class="doubt-row-list">${rows.map(guideDoubtRowHtml).join("")}</div>
        </div>`;
    })
    .join("");
  if (!body) {
    return `<p class="muted" style="margin:8px 0 0;font-size:12px">当前状态下暂无疑点，可切换其他状态查看，或在此重新确认。</p>`;
  }
  return body;
}

function matterTreeNodeHtml(node, depth) {
  const counts = matterStatusCounts(node);
  const active = guideState.selectedId === node.id ? "active" : "";
  const rootCls = depth === 0 ? "matter-root" : "";
  const kids = (node.children || []).map((c) => matterTreeNodeHtml(c, depth + 1)).join("");
  return `<div class="matter-node ${rootCls}" style="padding-left:${depth * 12}px">
      <button type="button" class="matter-item ${active}" data-matter="${node.id}">
        <span class="matter-name">${escapeHtml(node.name)}</span>
        <span class="matter-mini" title="已确认问题 / 已确认无问题 / 待确认">
          <span class="t-issue">${counts.issue}</span>/<span class="t-clear">${counts.clear}</span>/<span class="t-pending">${counts.pending}</span>
        </span>
      </button>
      ${kids}
    </div>`;
}

function guideChildListHtml(matter) {
  const children = matter.children || [];
  if (!children.length) {
    return `<p class="muted" style="font-size:12px;margin:0">本事项无下级；可勾选左侧事项后点右上角「生成底稿」。</p>`;
  }
  return `<table class="guide-child-table">
      <thead>
        <tr>
          <th style="width:36px"></th>
          <th>下级事项</th>
          <th>事项内容</th>
          <th>已确认问题</th>
          <th>已确认无问题</th>
          <th>待确认</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        ${children
          .map((c) => {
            const counts = matterStatusCounts(c);
            const checked = guideState.checked.has(c.id) ? "checked" : "";
            return `<tr>
              <td><input type="checkbox" data-matter-check="${c.id}" ${checked} title="勾选生成底稿" /></td>
              <td><button type="button" class="linkish" data-matter="${c.id}">${escapeHtml(c.name)}</button></td>
              <td>${escapeHtml(c.content || "—")}</td>
              ${guideStatusCellsHtml(c.id, counts)}
            </tr>`;
          })
          .join("")}
      </tbody>
    </table>`;
}

function guideDetailPanelHtml() {
  if (!guideState.detailId || guideState.relateId) return "";
  const matter = findMatter(guideState.detailId);
  if (!matter) return "";
  const doubts = matterAllDoubts(matter);
  const focus = guideState.detailStatus;
  const shown = focus ? doubts.filter((d) => d.status === focus) : doubts;
  const stLabel = focus ? GUIDE_STATUS[focus].label : "全部";
  return `<div class="result-block guide-doubts" id="guide-doubt-detail">
      <div class="guide-detail-hd">
        <h4>疑点明细 · ${escapeHtml(matter.name)} · ${stLabel}</h4>
        <button type="button" class="btn ghost sm" data-guide-close>关闭</button>
      </div>
      ${guideDoubtTableHtml(shown, focus || null)}
    </div>`;
}

function guideMissingStatusTag(status) {
  if (status === "缺失" || status === "部分缺失" || status === "部分缺页") {
    const label = status === "部分缺页" ? "部分缺失" : status;
    return `<span class="tag warn">${escapeHtml(label)}</span>`;
  }
  return "";
}

function guideDocGapNote(doc) {
  if (!doc) return "";
  const st = doc.status || "";
  if (!(st === "缺失" || st === "部分缺失" || st === "部分缺页" || /缺失|缺页|未齐|未到/.test(st))) {
    return "";
  }
  const gap = doc.gap || doc.missing || "";
  if (!gap) return `<span class="gap-note">需写明具体缺件</span>`;
  return `<span class="gap-note">缺：${escapeHtml(gap)}</span>`;
}

function guideRelatePanelHtml() {
  if (!guideState.relateId) return "";
  const matter = findMatter(guideState.relateId);
  if (!matter) return "";
  const pack = matterRelatePack(matter);
  const doubts = matterAllDoubts(matter);
  return `<div class="result-block guide-relate" id="guide-relate-panel">
      <div class="guide-detail-hd">
        <h4>关联分析 · ${escapeHtml(matter.name)}</h4>
        <button type="button" class="btn ghost sm" data-relate-close>返回事项</button>
      </div>
      <p class="muted" style="margin:0 0 12px;font-size:12px;line-height:1.5">围绕本事项汇总需查看的数据、相关资料与核查过程，并提示当前缺少的数据与资料。关联疑点 ${doubts.length} 条。</p>
      ${guideGapTipsHtml(pack)}
      <div class="guide-relate-grid">
        <div class="guide-relate-col">
          <h5>需要查看的数据</h5>
          <ul class="guide-relate-list">
            ${pack.data
              .map(
                (d) => `<li>
                  <b>${escapeHtml(d.name)}</b>
                  <span>${escapeHtml(d.desc)}</span>
                  ${guideMissingStatusTag(d.status)}
                </li>`
              )
              .join("")}
          </ul>
        </div>
        <div class="guide-relate-col">
          <h5>相关资料</h5>
          <ul class="guide-relate-list">
            ${pack.docs
              .map(
                (d) => `<li>
                  <b>${escapeHtml(d.name)}</b>
                  <span class="tag">${escapeHtml(d.kind)}</span>
                  ${guideMissingStatusTag(d.status)}
                  ${guideDocGapNote(d)}
                </li>`
              )
              .join("")}
          </ul>
        </div>
        <div class="guide-relate-col">
          <h5>查的过程</h5>
          <ol class="guide-process">
            ${pack.steps
              .map(
                (s) => `<li class="${s.done ? "done" : ""}">
                  <span class="step-no">${s.no}</span>
                  <span>${escapeHtml(s.text)}</span>
                </li>`
              )
              .join("")}
          </ol>
        </div>
      </div>
    </div>`;
}

function guideAiPanelHtml() {
  if (!guideState.aiOpen) return "";
  const matter = findMatter(guideState.selectedId) || SCHEME_MATTER_TREE[0];
  if (!matter) return "";
  const doubts = matterAllDoubts(matter);
  const counts = matterStatusCounts(matter);
  const pack = matterRelatePack(matter);
  const pending = doubts.filter((d) => d.status === "pending");
  const issues = doubts.filter((d) => d.status === "issue");
  const focus =
    pending[0] ||
    issues[0] ||
    doubts[0] || {
      title: matter.name,
      reason: matter.content || "暂无疑点明细",
      path: "按方案事项程序推进",
      unit: "本项目被审计单位",
      status: "pending",
    };

  return `<div class="result-block guide-ai" id="guide-ai-panel">
      <div class="guide-detail-hd">
        <h4>疑点分析 AI · ${escapeHtml(matter.name)}</h4>
        <button type="button" class="btn ghost sm" data-ai-close>关闭</button>
      </div>
      <div class="guide-ai-summary">
        <p>已汇总本事项及下级：已确认问题 <b>${counts.issue}</b>、已确认无问题 <b>${counts.clear}</b>、待确认 <b>${counts.pending}</b>。</p>
        <p>优先关注「${escapeHtml(focus.title)}」（${escapeHtml(focus.unit || "—")}）：${escapeHtml(focus.reason)}</p>
      </div>
      <div class="guide-relate-grid">
        <div class="guide-relate-col">
          <h5>AI 判断</h5>
          <ul class="guide-relate-list">
            <li><b>风险倾向</b><span>${counts.issue + counts.pending > counts.clear ? "偏高，建议先闭环待确认再扩面抽核" : "整体可控，保留抽核与复核即可"}</span></li>
            <li><b>关键路径</b><span>${escapeHtml(focus.path)}</span></li>
            <li><b>建议定性口径</b><span>${focus.status === "issue" ? "可按已确认问题写入取证要点，避免过度定性" : "暂以待核实表述，补齐证据后再定性"}</span></li>
          </ul>
        </div>
        <div class="guide-relate-col">
          <h5>建议下一步</h5>
          <ol class="guide-process">
            <li class="done"><span class="step-no">1</span><span>补齐缺数：${escapeHtml((pack.missingData || [])[0] || "核对账套授权")}</span><span class="tag doing">优先</span></li>
            <li><span class="step-no">2</span><span>补齐缺料：${escapeHtml((pack.missingDocs || [])[0] || "复核扫描件完整性")}</span><span class="tag warn">待办</span></li>
            <li><span class="step-no">3</span><span>对 ${pending.length || issues.length || 1} 条重点疑点做关联分析 / 询问函</span><span class="tag">建议</span></li>
            <li><span class="step-no">4</span><span>确认问题回写取证单与底稿目录</span><span class="tag">后续</span></li>
          </ol>
        </div>
        <div class="guide-relate-col">
          <h5>可追问</h5>
          <div class="scheme-prompts">
            <button type="button" data-ai-ask="path">这条疑点怎么查最稳？</button>
            <button type="button" data-ai-ask="gap">还缺什么数据和资料？</button>
            <button type="button" data-ai-ask="write">怎么写进取证单？</button>
          </div>
          <div class="guide-ai-answer" id="guide-ai-answer">
            <p class="muted" style="margin:8px 0 0;font-size:12px">点上方问题，AI 基于当前事项给出简要答复。</p>
          </div>
        </div>
      </div>
    </div>`;
}

function guideAiAskHtml(kind) {
  const matter = findMatter(guideState.selectedId) || SCHEME_MATTER_TREE[0];
  const doubts = matterAllDoubts(matter);
  const pack = matterRelatePack(matter);
  const focus = doubts.find((d) => d.status === "pending") || doubts.find((d) => d.status === "issue") || doubts[0];
  if (kind === "path") {
    return `<div class="result-block" style="margin-top:8px"><h4>AI 答复 · 核查路径</h4>
      建议按「${escapeHtml(focus?.path || "资料→数据→穿行→结论")}」推进：先固定被审计单位与事项边界，再调数对账，最后用成果物/审批链闭环。高风险点优先发询问函。</div>`;
  }
  if (kind === "gap") {
    return `<div class="result-block" style="margin-top:8px"><h4>AI 答复 · 缺数缺料</h4>
      <p><b>缺数据：</b>${(pack.missingData || []).map(escapeHtml).join("；")}</p>
      <p><b>缺资料：</b>${(pack.missingDocs || []).map(escapeHtml).join("；")}</p>
      建议先发补证清单，缺项未齐前不做最终定性。</div>`;
  }
  return `<div class="result-block" style="margin-top:8px"><h4>AI 答复 · 取证表述</h4>
    事实栏写清对象、金额/时点、已核路径；法规栏引用对应条款；意见栏用「审批手续不完整 / 真实性存疑 / 待补证」等可复核表述。事项：「${escapeHtml(focus?.title || matter.name)}」。</div>`;
}

function guideMainHtml(matter) {
  const counts = matterStatusCounts(matter);
  const nChecked = guideState.checked.size;
  return `
    <p class="pane-lead">左侧点选事项查看内容。在本下级事项中勾选后，点右上角「生成底稿」批量生成。</p>
    <div class="result-block">
      <h4>${escapeHtml(matter.name)}</h4>
      <p style="margin:0 0 10px;line-height:1.55">${escapeHtml(matter.content || "")}</p>
      ${guideStatusActionsHtml(matter.id, counts)}
      <div class="chip-row" style="margin:10px 0">
        <span class="tag ${nChecked ? "doing" : ""}">已勾选事项 ${nChecked}</span>
        <button type="button" class="btn ghost sm" data-guide-check-all>全选本级下级</button>
        <button type="button" class="btn ghost sm" data-guide-check-clear>清空勾选</button>
      </div>
      <h4 style="margin-top:4px">本下级事项</h4>
      ${guideChildListHtml(matter)}
    </div>
    ${guideDetailPanelHtml()}
    ${guideRelatePanelHtml()}
    ${guideAiPanelHtml()}`;
}

function renderGuidePane() {
  const box = document.getElementById("guide-pane");
  if (!box) return;
  if (!findMatter(guideState.selectedId)) guideState.selectedId = SCHEME_MATTER_TREE[0]?.id;
  const matter = findMatter(guideState.selectedId) || SCHEME_MATTER_TREE[0];
  const nChecked = guideState.checked.size;
  box.innerHTML = `
    <div class="split guide-layout">
      <aside class="card panel guide-tree-panel">
        <h2 style="font-size:15px;margin:0 0 8px">方案事项树</h2>
        <p class="muted" style="font-size:12px;margin:0 0 8px">点击事项查看内容；在右侧勾选后生成底稿 · 已选 ${nChecked}</p>
        <div class="data-tree matter-tree" id="matter-tree">
          ${SCHEME_MATTER_TREE.map((n) => matterTreeNodeHtml(n, 0)).join("")}
        </div>
      </aside>
      <div class="guide-main" id="guide-main">
        ${guideMainHtml(matter)}
      </div>
    </div>`;
}

document.getElementById("guide-pane")?.addEventListener("click", (e) => {
  const setDoubt = e.target.closest("[data-set-doubt]");
  if (setDoubt) {
    e.preventDefault();
    e.stopPropagation();
    const id = setDoubt.dataset.setDoubt;
    const status = setDoubt.dataset.setStatus;
    if (setDoubtStatus(id, status)) {
      toast(`已标记为「${GUIDE_STATUS[status].label}」`);
      renderGuidePane();
      document.getElementById("guide-doubt-detail")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      toast(`当前已是「${GUIDE_STATUS[status]?.label || status}」`);
    }
    return;
  }
  const checkAll = e.target.closest("[data-guide-check-all]");
  if (checkAll) {
    const matter = findMatter(guideState.selectedId);
    (matter?.children || []).forEach((c) => guideState.checked.add(c.id));
    if (matter && !(matter.children || []).length) guideState.checked.add(matter.id);
    renderGuidePane();
    return;
  }
  const checkClear = e.target.closest("[data-guide-check-clear]");
  if (checkClear) {
    guideState.checked.clear();
    renderGuidePane();
    return;
  }
  const close = e.target.closest("[data-guide-close]");
  if (close) {
    guideState.detailId = null;
    guideState.detailStatus = null;
    renderGuidePane();
    return;
  }
  const aiClose = e.target.closest("[data-ai-close]");
  if (aiClose) {
    guideState.aiOpen = false;
    renderGuidePane();
    return;
  }
  const aiAsk = e.target.closest("[data-ai-ask]");
  if (aiAsk) {
    const box = document.getElementById("guide-ai-answer");
    if (box) box.innerHTML = guideAiAskHtml(aiAsk.dataset.aiAsk);
    return;
  }
  const relateClose = e.target.closest("[data-relate-close]");
  if (relateClose) {
    guideState.relateId = null;
    renderGuidePane();
    return;
  }
  const relateBtn = e.target.closest("[data-relate]");
  if (relateBtn) {
    e.preventDefault();
    e.stopPropagation();
    const id = relateBtn.dataset.relate;
    guideState.selectedId = id;
    guideState.relateId = id;
    guideState.detailId = null;
    guideState.detailStatus = null;
    guideState.aiOpen = false;
    renderGuidePane();
    document.getElementById("guide-relate-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }
  const doubtsBtn = e.target.closest("[data-doubts]");
  if (doubtsBtn) {
    e.preventDefault();
    e.stopPropagation();
    const id = doubtsBtn.dataset.doubts;
    guideState.selectedId = id;
    guideState.detailId = id;
    guideState.detailStatus = doubtsBtn.dataset.status || null;
    guideState.relateId = null;
    guideState.aiOpen = false;
    renderGuidePane();
    document.getElementById("guide-doubt-detail")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }
  const matterBtn = e.target.closest("[data-matter]");
  if (matterBtn) {
    guideState.selectedId = matterBtn.dataset.matter;
    guideState.detailId = null;
    guideState.detailStatus = null;
    guideState.relateId = null;
    renderGuidePane();
    if (guideState.aiOpen) {
      document.getElementById("guide-ai-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
});

document.getElementById("guide-pane")?.addEventListener("change", (e) => {
  const box = e.target.closest("[data-matter-check]");
  if (!box) return;
  const id = box.dataset.matterCheck;
  if (box.checked) guideState.checked.add(id);
  else guideState.checked.delete(id);
  renderGuidePane();
});

document.getElementById("doubt-ai-btn")?.addEventListener("click", () => {
  if (currentScene !== "doubt") {
    setScene("doubt");
  }
  guideState.aiOpen = true;
  guideState.relateId = null;
  guideState.detailId = null;
  renderGuidePane();
  document.getElementById("guide-ai-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

const CHAT_SCENES = {
  draft: {
    title: "发现取证智能体",
    ph: "例如：帮我写取证单 / 超期未反馈 / 修改发现",
  },
};

/** 发现取证智能体清单：发现 · 已发送取证单 · 反馈状态 · 有异议 / 超期未反馈高亮 · 未发送可修改 */
const FINDING_EVIDENCE = [
  {
    id: "fe1",
    title: "信息化运维支出 154 万缺成果物",
    amount: "154 万",
    source: "预算执行 · 重点费用",
    unit: "集团本部 · 信息中心",
    evidenced: true,
    feedback: "done",
    overdue: false,
    draftNo: "QZ-2026-018",
    fact: "抽查信息化运维合同及付款凭证，合同额 154 万元，按月支付已列支完毕；凭证后未见巡检报告、成果物清单及验收记录，与合同第 8 条按月交付约定不符。",
    law: "《集团采购管理办法》履约验收条款；运维合同第 8 条成果物交付。",
    needDocs: ["按月巡检报告（全周期）", "成果物清单及签收记录", "验收纪要或验收单"],
    receivedDocs: [],
    opinion: "被审计单位称巡检报告在供应商处，需 5 个工作日内补交；对「验收形同虚设」表述有异议，建议改为「成果物未归档」。",
  },
  {
    id: "fe2",
    title: "预算调剂入账早于批复",
    amount: "3 笔",
    source: "预算执行 · 调剂",
    unit: "集团本部 · 财务部",
    evidenced: true,
    feedback: "pending",
    overdue: true,
    dueHint: "反馈截止 2026-09-20，已超期 10 天",
    draftNo: "QZ-2026-021",
    fact: "核对预算调剂台账与批复文号，发现 3 笔调剂业务入账日期早于批复日期，涉及科目调整与资金占用时点不一致。",
    law: "企业预算管理办法关于调剂审批与入账时点的规定。",
    needDocs: ["3 笔调剂的批复原件或扫描件", "入账凭证及审批链截图", "时点差异说明"],
    receivedDocs: ["入账凭证及审批链截图"],
    opinion: "",
  },
  {
    id: "fe3",
    title: "会议费与培训费交叉列支约 27 万",
    amount: "27 万",
    source: "预算执行 · 重点费用",
    unit: "集团本部 · 办公室 / 人力",
    evidenced: false,
    feedback: "pending",
    overdue: true,
    dueHint: "反馈截止 2026-09-22，已超期 8 天",
    draftNo: "",
    fact: "比对会议费、培训费明细账与发票，发现交叉列支约 27 万元，其中 1 张发票号重复入账；部分培训事项未见培训方案与签到。",
    law: "集团费用报销管理办法；会议费、培训费开支范围规定。",
    needDocs: ["交叉列支明细及原始凭证", "培训方案、通知与签到表", "重复发票入账情况说明"],
    receivedDocs: [],
    opinion: "",
  },
  {
    id: "fe4",
    title: "大额支出 1,200 万预算安排与决策依据不完整",
    amount: "1,200 万",
    source: "审前调查 · 发现",
    unit: "集团本部 · 战略投资",
    evidenced: true,
    feedback: "done",
    overdue: false,
    draftNo: "QZ-2026-009",
    fact: "对外投资设立子公司列支 1,200 万元，预算安排文件与集体决策纪要不完整，付款时点与决策文号对应关系待核实。",
    law: "「三重一大」决策制度；企业对外投资管理办法。",
    needDocs: ["预算安排文件", "集体决策纪要及文号", "付款审批单与资金流向"],
    receivedDocs: ["集体决策纪要及文号", "付款审批单与资金流向"],
    opinion: "财务部反馈：集体决策纪要已补录系统，请审计组复核文号与付款时点是否一致。",
  },
  {
    id: "fe5",
    title: "建设公司延伸：变更签证台账缺失",
    amount: "—",
    source: "延伸核实 · 工程",
    unit: "建设公司 · 项目部",
    evidenced: false,
    feedback: "done",
    overdue: false,
    draftNo: "",
    fact: "延伸建设公司工程项目，现场未能提供完整变更签证台账；被审计单位称资料按项目分散保管，集中调阅困难。",
    law: "工程变更管理办法；建设项目档案管理规定。",
    needDocs: ["变更签证台账（项目维度）", "签证单原件或扫描件", "现场核验配合安排"],
    receivedDocs: [],
    opinion: "建设公司不同意「台账缺失」定性，称已按项目分散保管；请审计组到项目部现场核验。",
  },
  {
    id: "fe6",
    title: "卫生板块专项预算闲置 860 万",
    amount: "860 万",
    source: "预算执行 · 专项",
    unit: "卫生板块 · 财务",
    evidenced: true,
    feedback: "pending",
    overdue: false,
    dueHint: "反馈截止 2026-10-05",
    draftNo: "QZ-2026-025",
    fact: "卫生板块专项预算执行进度偏低，年末仍有约 860 万元闲置未执行，未见调整或结转说明。",
    law: "专项资金管理办法；预算执行与结转规定。",
    needDocs: ["专项预算批复与分解表", "执行进度说明", "闲置原因及拟处置方案"],
    receivedDocs: ["专项预算批复与分解表", "执行进度说明", "闲置原因及拟处置方案"],
    opinion: "",
  },
];

const draftState = { started: false, filter: "all", writingId: null, editingId: null };
let draftFormSeq = 30;

function findingEvIsOverdue(item) {
  return item.feedback === "pending" && !!item.overdue;
}

function findingEvFeedbackTag(item) {
  if (item.feedback === "done") return `<span class="tag ok">已反馈</span>`;
  if (findingEvIsOverdue(item)) return `<span class="tag risk">超期未反馈</span>`;
  return `<span class="tag warn">待反馈</span>`;
}

function findingEvEvidenceTag(item) {
  return item.evidenced ? `<span class="tag doing">已发送取证单</span>` : "";
}

function findingEvDocRows(item) {
  const need = item.needDocs || [];
  const got = item.receivedDocs || [];
  return need.map((name) => ({
    name,
    ok: got.some((g) => g === name || name.includes(g) || g.includes(name)),
  }));
}

function findingEvMissingDocs(item) {
  return findingEvDocRows(item)
    .filter((r) => !r.ok)
    .map((r) => r.name);
}

function findingEvDocsIncomplete(item) {
  const need = item.needDocs || [];
  if (!need.length) return true;
  return findingEvMissingDocs(item).length > 0;
}

function findingEvDocsTipHtml(item) {
  if (!findingEvDocsIncomplete(item)) {
    return `<div class="finding-ev-docs-ok"><span class="tag ok">取证资料已齐</span><p>上列需补交资料均已收到，可进入复核。</p></div>`;
  }
  const missing = findingEvMissingDocs(item);
  const list = missing.map((d) => `<li>${escapeHtml(d)}</li>`).join("");
  return `<div class="finding-ev-docs-tip">
      <div class="finding-ev-docs-tip-hd"><span class="tag risk">取证资料不全</span><strong>请催办补齐后再闭合</strong></div>
      <p>下列资料尚未收到，取证链条不完整：</p>
      <ul class="finding-ev-need">${list || "<li>需补交资料清单为空，请先列明</li>"}</ul>
    </div>`;
}

function findingEvEnsureDraftNo(item) {
  if (!item.draftNo) {
    item.draftNo = `QZ-2026-${String(draftFormSeq).padStart(3, "0")}`;
    draftFormSeq += 1;
  }
  return item.draftNo;
}

function findingEvFormHtml(item, opts = {}) {
  const no = findingEvEnsureDraftNo(item);
  const rows = findingEvDocRows(item);
  const incomplete = findingEvDocsIncomplete(item);
  const docs = rows.length
    ? rows
        .map(
          (r) =>
            `<li class="${r.ok ? "doc-ok" : "doc-miss"}"><span class="tag ${r.ok ? "ok" : "risk"}">${r.ok ? "已收" : "未收"}</span>${escapeHtml(r.name)}</li>`
        )
        .join("")
    : `<li class="doc-miss"><span class="tag risk">未列</span>待列明需补交资料</li>`;
  const statusNote = opts.created
    ? `<span class="tag ok">已生成草稿</span>`
    : item.evidenced
      ? `<span class="tag doing">已发送取证单 · 可查看</span>`
      : `<span class="tag warn">草稿 · 待确认发送</span>`;
  const gapTag = incomplete ? `<span class="tag risk">取证资料不全</span>` : `<span class="tag ok">取证资料已齐</span>`;
  return `<div class="finding-ev-form${incomplete ? " docs-incomplete" : ""}">
      <div class="finding-ev-form-hd">
        <h4>取证单 · ${escapeHtml(no)}</h4>
        <div class="chip-row" style="margin:0">${statusNote}${findingEvEvidenceTag(item)}${findingEvFeedbackTag(item)}${gapTag}</div>
      </div>
      ${findingEvDocsTipHtml(item)}
      <table class="finding-ev-form-table">
        <tr><th>事项</th><td>${escapeHtml(item.title)}</td></tr>
        <tr><th>被审计单位</th><td>${escapeHtml(item.unit || "—")}</td></tr>
        <tr><th>来源 / 金额</th><td>${escapeHtml(item.source)} · ${escapeHtml(item.amount || "—")}</td></tr>
        <tr><th>审计事实</th><td>${escapeHtml(item.fact || "待补充")}</td></tr>
        <tr><th>法规依据</th><td>${escapeHtml(item.law || "待补充")}</td></tr>
        <tr><th>取证资料</th><td><ul class="finding-ev-need finding-ev-need-status">${docs}</ul></td></tr>
        <tr><th>反馈时限</th><td>${escapeHtml(item.dueHint || "自送达之日起 5 个工作日")}</td></tr>
        <tr><th>审计意见</th><td>${escapeHtml(item.opinion && item.opinion.trim() ? item.opinion : "请被审计单位按上列资料限期反馈；超期未反馈将标注「超期未反馈」。")}</td></tr>
      </table>
      <div class="scheme-prompts" style="margin-top:10px">
        ${item.evidenced ? "" : `<button type="button" data-draft-write="${item.id}">确认发送取证单</button>`}
        ${item.evidenced ? "" : `<button type="button" data-draft-edit="${item.id}">返回修改发现</button>`}
        <button type="button" data-draft-filter="all">返回清单</button>
      </div>
    </div>`;
}

function findingEvWriteForm(item) {
  findingEvEnsureDraftNo(item);
  if (!item.evidenced) item.evidenced = true;
  draftState.writingId = item.id;
  draftState.editingId = null;
  return findingEvFormHtml(item, { created: true });
}

function findingEvEditHtml(item) {
  if (item.evidenced) {
    return `<div class="result-block"><h4>不可修改</h4>
      <p>该发现已发送取证单，发现内容不可再改。可查看取证单。</p>
      ${findingEvFormHtml(item)}
    </div>`;
  }
  draftState.editingId = item.id;
  const docsText = (item.needDocs || []).join("；");
  return `<div class="finding-ev-edit" data-finding-edit="${item.id}">
      <div class="finding-ev-form-hd">
        <h4>修改发现</h4>
        <span class="tag warn">未发送取证单 · 可修改</span>
      </div>
      <p class="muted" style="margin:0 0 10px;font-size:12px">仅未发送取证单的发现可改。改完点「保存修改」，再撰写/发送取证单。</p>
      <label class="finding-ev-field">事项标题
        <input name="title" type="text" value="${escapeHtml(item.title)}" />
      </label>
      <label class="finding-ev-field">被审计单位
        <input name="unit" type="text" value="${escapeHtml(item.unit || "")}" />
      </label>
      <div class="finding-ev-field-row">
        <label class="finding-ev-field">来源
          <input name="source" type="text" value="${escapeHtml(item.source || "")}" />
        </label>
        <label class="finding-ev-field">金额
          <input name="amount" type="text" value="${escapeHtml(item.amount || "")}" />
        </label>
      </div>
      <label class="finding-ev-field">审计事实
        <textarea name="fact" rows="3">${escapeHtml(item.fact || "")}</textarea>
      </label>
      <label class="finding-ev-field">法规依据
        <textarea name="law" rows="2">${escapeHtml(item.law || "")}</textarea>
      </label>
      <label class="finding-ev-field">需补交资料（用；分隔）
        <textarea name="needDocs" rows="2">${escapeHtml(docsText)}</textarea>
      </label>
      <label class="finding-ev-field">反馈时限说明
        <input name="dueHint" type="text" value="${escapeHtml(item.dueHint || "")}" />
      </label>
      <div class="scheme-prompts" style="margin-top:12px">
        <button type="button" data-draft-save="${item.id}">保存修改</button>
        <button type="button" data-draft-write="${item.id}">保存并撰写取证单</button>
        <button type="button" data-draft-filter="all">返回清单</button>
      </div>
    </div>`;
}

function findingEvApplyFromForm(item, root) {
  if (!item || item.evidenced || !root) return false;
  const val = (name) => root.querySelector(`[name="${name}"]`)?.value?.trim() ?? "";
  const title = val("title");
  const unit = val("unit");
  const source = val("source");
  const amount = val("amount");
  const fact = val("fact");
  const law = val("law");
  const dueHint = val("dueHint");
  const needRaw = val("needDocs");
  if (title) item.title = title;
  if (unit) item.unit = unit;
  if (source) item.source = source;
  if (amount) item.amount = amount;
  if (fact) item.fact = fact;
  if (law) item.law = law;
  item.dueHint = dueHint;
  if (needRaw) {
    item.needDocs = needRaw
      .split(/[；;]\s*/)
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return true;
}

function findingEvApplyEditText(item, text) {
  if (!item || item.evidenced) return false;
  const body = text.replace(/^(请|帮我|把)?/, "").trim();
  if (/事实|经过|情况/.test(text)) item.fact = body.replace(/^(审计)?事实(改成|改为|为|是|:|：)?/, "").trim() || item.fact;
  else if (/法规|依据|条款/.test(text)) item.law = body.replace(/^(法规|依据|条款)(改成|改为|为|是|:|：)?/, "").trim() || item.law;
  else if (/标题|事项|名称/.test(text)) item.title = body.replace(/^(事项|标题|名称)(改成|改为|为|是|:|：)?/, "").trim() || item.title;
  else if (/单位|被审/.test(text)) item.unit = body.replace(/^(被审计单位|单位)(改成|改为|为|是|:|：)?/, "").trim() || item.unit;
  else if (/金额/.test(text)) item.amount = body.replace(/^金额(改成|改为|为|是|:|：)?/, "").trim() || item.amount;
  else if (/资料|补交/.test(text)) {
    item.needDocs = body
      .replace(/^(需)?(补交)?资料(改成|改为|为|是|:|：)?/, "")
      .split(/[；;、，,]\s*/)
      .map((x) => x.trim())
      .filter(Boolean);
  } else if (body) {
    item.fact = body;
  }
  return true;
}

function findingEvMatchItem(text) {
  const t = text.trim();
  return (
    FINDING_EVIDENCE.find((x) => t.includes(x.id)) ||
    FINDING_EVIDENCE.find((x) => t.includes(x.title.slice(0, 8))) ||
    FINDING_EVIDENCE.find((x) => x.draftNo && t.includes(x.draftNo))
  );
}

function findingEvCardHtml(item) {
  const hasOpinion = item.feedback === "done" && !!(item.opinion && item.opinion.trim());
  const isOverdue = findingEvIsOverdue(item);
  const docsIncomplete = findingEvDocsIncomplete(item);
  const cardClass = [
    "finding-ev-card",
    hasOpinion ? "has-opinion" : "",
    isOverdue ? "has-overdue" : "",
    item.evidenced && docsIncomplete ? "has-docs-gap" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const opinionBlock = hasOpinion
    ? `<div class="finding-ev-opinion"><span class="tag risk">有异议</span><p>${escapeHtml(item.opinion)}</p></div>`
    : isOverdue
      ? `<div class="finding-ev-overdue"><span class="tag risk">超期未反馈</span><p>${escapeHtml(item.dueHint || "已超过反馈时限，请催办被审计单位。")}</p></div>`
      : item.feedback === "done"
        ? `<p class="finding-ev-opinion-empty muted">已反馈 · 无异议</p>`
        : `<p class="finding-ev-opinion-empty muted">待被审计单位反馈${item.dueHint ? ` · ${escapeHtml(item.dueHint)}` : ""}</p>`;
  const docsTip =
    item.evidenced && docsIncomplete
      ? `<div class="finding-ev-docs-tip compact"><span class="tag risk">取证资料不全</span><p>缺 ${findingEvMissingDocs(item).length} 项：${escapeHtml(findingEvMissingDocs(item).slice(0, 2).join("、"))}${findingEvMissingDocs(item).length > 2 ? "…" : ""}</p></div>`
      : item.evidenced && !docsIncomplete
        ? `<p class="finding-ev-opinion-empty muted">取证资料已齐</p>`
        : "";
  const actions = item.evidenced
    ? `<button type="button" class="btn ghost sm" data-draft-write="${item.id}">查看取证单</button>`
    : `<button type="button" class="btn ghost sm" data-draft-edit="${item.id}">修改发现</button>
       <button type="button" class="btn sm" data-draft-write="${item.id}">协助撰写取证单</button>`;
  return `<article class="${cardClass}" data-finding-ev="${item.id}">
      <div class="finding-ev-hd">
        <h4>${escapeHtml(item.title)}</h4>
        <div class="chip-row" style="margin:0">${findingEvEvidenceTag(item)}${findingEvFeedbackTag(item)}${hasOpinion ? `<span class="tag risk">有异议</span>` : ""}${item.evidenced && docsIncomplete ? `<span class="tag risk">取证资料不全</span>` : ""}</div>
      </div>
      <p class="finding-ev-meta muted">${escapeHtml(item.source)} · 金额 ${escapeHtml(item.amount || "—")}</p>
      <div class="finding-ev-cols">
        <div><b>取证单</b><br />${item.evidenced ? `已发送 · ${escapeHtml(item.draftNo || "—")}` : "未发送 · 可修改发现"}</div>
        <div><b>反馈状态</b><br />${item.feedback === "done" ? "已反馈" : isOverdue ? "超期未反馈" : "待反馈"}</div>
      </div>
      ${opinionBlock}
      ${docsTip}
      <div class="finding-ev-actions">${actions}</div>
    </article>`;
}

function findingEvListHtml(filter) {
  let list = FINDING_EVIDENCE;
  if (filter === "pending") list = list.filter((x) => x.feedback === "pending");
  if (filter === "done") list = list.filter((x) => x.feedback === "done");
  if (filter === "opinion") list = list.filter((x) => x.feedback === "done" && x.opinion);
  if (filter === "overdue") list = list.filter((x) => findingEvIsOverdue(x));
  const nPending = FINDING_EVIDENCE.filter((x) => x.feedback === "pending").length;
  const nDone = FINDING_EVIDENCE.filter((x) => x.feedback === "done").length;
  const nOpinion = FINDING_EVIDENCE.filter((x) => x.feedback === "done" && x.opinion).length;
  const nOverdue = FINDING_EVIDENCE.filter((x) => findingEvIsOverdue(x)).length;
  const nSent = FINDING_EVIDENCE.filter((x) => x.evidenced).length;
  const nDocsGap = FINDING_EVIDENCE.filter((x) => x.evidenced && findingEvDocsIncomplete(x)).length;
  return `共 <b>${FINDING_EVIDENCE.length}</b> 条发现 · 已发送取证单 ${nSent}（取证资料不全 ${nDocsGap}）· 待反馈 ${nPending}（超期未反馈 ${nOverdue}）· 已反馈 ${nDone}（其中有异议 ${nOpinion}）
      <div class="finding-ev-list" style="margin-top:10px">
        ${list.length ? list.map(findingEvCardHtml).join("") : `<p class="muted">当前筛选无记录。</p>`}
      </div>`;
}

function seedDraftChat() {
  draftState.started = true;
  draftState.filter = "all";
  draftState.writingId = null;
  draftState.editingId = null;
  const unev = FINDING_EVIDENCE.filter((x) => !x.evidenced);
  msgs.innerHTML = `
    <div class="bubble ai">
      您好，欢迎使用<strong>发现取证智能体</strong>。可查看<strong>待反馈 / 已反馈</strong>；已发送会标注<strong>已发送取证单</strong>；<strong>有异议</strong>、<strong>超期未反馈</strong>、<strong>取证资料不全</strong>会提示。<strong>未发送取证单</strong>的发现可点「修改发现」调整内容，再协助撰写取证单。
      <div class="result-block" style="margin-top:10px"><h4>发现取证清单</h4>
        ${findingEvListHtml("all")}
      </div>
      ${
        unev.length
          ? `<div class="scheme-prompts" style="margin-top:10px">
              <button type="button" data-draft-edit="${unev[0].id}">修改发现 · ${escapeHtml(unev[0].title.slice(0, 12))}…</button>
              <button type="button" data-draft-write="${unev[0].id}">协助撰写取证单</button>
            </div>`
          : ""
      }
      <div class="cite">发现取证智能体 · 清单 / 反馈 / 撰写取证单</div>
    </div>`;
  msgs.scrollTop = 0;
}

function draftReplyHtml(text) {
  const t = text.trim();
  if (/超期|过期|逾期/i.test(t)) {
    draftState.filter = "overdue";
    return `<div class="result-block"><h4>筛选 · 超期未反馈</h4>${findingEvListHtml("overdue")}</div>`;
  }
  if (/待反馈/i.test(t)) {
    draftState.filter = "pending";
    return `<div class="result-block"><h4>筛选 · 待反馈</h4>${findingEvListHtml("pending")}</div>`;
  }
  if (/有异议|异议|有意见|意见高亮/i.test(t)) {
    draftState.filter = "opinion";
    return `<div class="result-block"><h4>筛选 · 有异议</h4>${findingEvListHtml("opinion")}</div>`;
  }
  if (/已反馈/i.test(t)) {
    draftState.filter = "done";
    return `<div class="result-block"><h4>筛选 · 已反馈</h4>${findingEvListHtml("done")}</div>`;
  }
  if (/已发送取证单|已发送/i.test(t)) {
    draftState.filter = "sent";
    const sent = FINDING_EVIDENCE.filter((x) => x.evidenced);
    return `<div class="result-block"><h4>筛选 · 已发送取证单</h4>
      <div class="finding-ev-list" style="margin-top:10px">
        ${sent.length ? sent.map(findingEvCardHtml).join("") : `<p class="muted">暂无已发送取证单。</p>`}
      </div></div>`;
  }
  if (/资料不全|取证资料|缺资料|补齐资料/i.test(t)) {
    draftState.filter = "docsgap";
    const gap = FINDING_EVIDENCE.filter((x) => x.evidenced && findingEvDocsIncomplete(x));
    return `<div class="result-block"><h4>筛选 · 取证资料不全</h4>
      <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">下列已发送取证单仍有资料未收齐，请催办补齐。</p>
      <div class="finding-ev-list" style="margin-top:10px">
        ${gap.length ? gap.map(findingEvCardHtml).join("") : `<p class="muted">暂无取证资料不全的条目。</p>`}
      </div></div>`;
  }
  if (/全部|清单|列表|刷新/i.test(t)) {
    draftState.filter = "all";
    return `<div class="result-block"><h4>发现取证清单</h4>${findingEvListHtml("all")}</div>`;
  }
  if (/^已保存修改/.test(t)) {
    const saved = findingEvMatchItem(t);
    return saved
      ? `<div class="result-block"><h4>已保存修改</h4>
          <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">发现内容已更新（仍未发送取证单，可继续改或撰写）。</p>
          ${findingEvCardHtml(saved)}</div>`
      : `<div class="result-block"><h4>发现取证清单</h4>${findingEvListHtml("all")}</div>`;
  }

  const pendingEditId = draftState.editingId;
  const wantEdit = !!pendingEditId || /修改发现|编辑发现|改发现/i.test(t);
  if (wantEdit && !/撰写|写.*取证|生成取证|确认发送|保存并撰写/i.test(t)) {
    const hit =
      (pendingEditId && FINDING_EVIDENCE.find((x) => x.id === pendingEditId)) || findingEvMatchItem(t);
    if (hit) {
      if (hit.evidenced) {
        draftState.editingId = null;
        return `<div class="result-block"><h4>不可修改</h4>
          <p>「${escapeHtml(hit.title)}」已发送取证单，发现内容不可再改。</p>
          ${findingEvCardHtml(hit)}</div>`;
      }
      if (pendingEditId && draftState.editingId === hit.id && !/^修改发现/.test(t) && !/^编辑发现/.test(t) && !/^修改 ·/.test(t)) {
        findingEvApplyEditText(hit, t);
        draftState.editingId = hit.id;
        return `<div class="result-block"><h4>已更新发现</h4>
          <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">可继续改，或点「协助撰写取证单」。</p>
          ${findingEvCardHtml(hit)}
          ${findingEvEditHtml(hit)}</div>`;
      }
      return `<div class="result-block"><h4>修改发现</h4>${findingEvEditHtml(hit)}</div>`;
    }
    const unev = FINDING_EVIDENCE.filter((x) => !x.evidenced);
    draftState.editingId = null;
    if (unev.length) {
      return `<div class="result-block"><h4>修改发现</h4>
        <p style="margin:0 0 8px">请选择未发送取证单的发现：</p>
        <div class="scheme-prompts">
          ${unev.map((x) => `<button type="button" data-draft-edit="${x.id}">修改 · ${escapeHtml(x.title)}</button>`).join("")}
        </div></div>`;
    }
    return `<div class="result-block"><h4>修改发现</h4><p>当前均已发送取证单，无可修改发现。</p>${findingEvListHtml("all")}</div>`;
  }

  const pendingWriteId = draftState.writingId;
  const wantWrite =
    !!pendingWriteId ||
    /撰写|写.*取证|生成取证|起草取证|协助撰写|确认发送取证|确认写入取证|再生成修订|查看取证单|帮我写|保存并撰写/i.test(t);
  if (wantWrite) {
    const hit =
      (pendingWriteId && FINDING_EVIDENCE.find((x) => x.id === pendingWriteId)) || findingEvMatchItem(t);
    draftState.writingId = null;
    if (hit) {
      if (hit.evidenced && /查看取证单/.test(t)) {
        const tip = findingEvDocsIncomplete(hit)
          ? `<p style="margin:0 0 8px;font-size:12px;color:var(--rust)">提示：该取证单<strong>取证资料不全</strong>，请催办补齐。</p>`
          : "";
        return `<div class="result-block"><h4>取证单</h4>${tip}${findingEvFormHtml(hit)}</div>`;
      }
      const wasNew = !hit.evidenced;
      const form = findingEvWriteForm(hit);
      const tip = findingEvDocsIncomplete(hit)
        ? `<p style="margin:0 0 8px;font-size:12px;color:var(--rust)">提示：当前<strong>取证资料不全</strong>，请按清单催办补齐后再闭合。</p>`
        : `<p style="margin:0 0 8px;font-size:12px;color:var(--muted)">取证资料已齐，可进入复核。</p>`;
      return `<div class="result-block"><h4>${wasNew ? "已协助撰写并发送取证单" : "取证单"}</h4>
        <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">已按发现要点整理事实、法规、需补交资料与反馈时限${wasNew ? "，并标记为已发送取证单" : ""}。</p>
        ${tip}
        ${form}</div>`;
    }
    const unev = FINDING_EVIDENCE.filter((x) => !x.evidenced);
    if (unev.length) {
      return `<div class="result-block"><h4>协助撰写取证单</h4>
        <p style="margin:0 0 8px">请选择要撰写的发现（可先修改发现再撰写）：</p>
        <div class="scheme-prompts">
          ${unev
            .map(
              (x) =>
                `<button type="button" data-draft-edit="${x.id}">先修改 · ${escapeHtml(x.title)}</button>
                 <button type="button" data-draft-write="${x.id}">撰写 · ${escapeHtml(x.title)}</button>`
            )
            .join("")}
        </div>
      </div>`;
    }
    const first = FINDING_EVIDENCE[0];
    return `<div class="result-block"><h4>取证单</h4>
      <p style="margin:0 0 8px">当前发现均已发送取证单。可查看：</p>
      ${findingEvFormHtml(first)}</div>`;
  }

  const hit = findingEvMatchItem(t);
  if (hit) {
    return `<div class="result-block"><h4>发现详情</h4>${findingEvCardHtml(hit)}
      <p style="margin-top:8px;font-size:12px;color:var(--muted)">可继续：${hit.evidenced ? "查看取证单" : "修改发现、协助撰写取证单"}、待反馈、超期未反馈、有异议。</p></div>`;
  }
  return `<div class="result-block"><h4>发现取证智能体</h4>
      <p>可查看清单（有异议 / 超期未反馈高亮）；未发送取证单的发现可修改；也可说「帮我写取证单」。</p>
      ${findingEvListHtml(draftState.filter || "all")}
    </div>`;
}


const detectState = {
  filter: "all",
  selected: new Set(["u1", "u8", "u9", "u10", "u4"]),
  synced: false,
};
const planState = { items: [] };
const CURRENT_AUDITOR = "hong";
const PAPER_CATS = ["A. 审前调查", "B. 内控测试", "C. 工程变更", "D. 采购关联", "E. 重点支出"];
const paperDocs = [
  {
    id: "wg03",
    no: "WG-03",
    title: "运维成果物缺失",
    owner: "hong",
    status: "草稿",
    cat: "D. 采购关联",
    fact: "信息化运维合同 154 万，抽凭未见巡检报告、成果物清单与验收记录，合同约定按月交付。",
    law: "集团采购管理办法关于履约验收；合同第 8 条成果物交付条款。",
    opinion: "建议定性为支出真实性存疑，待被审计单位限期补交成果物。",
  },
  {
    id: "wg11",
    no: "WG-11",
    title: "车站装修变更超概",
    owner: "hong",
    status: "草稿",
    cat: "C. 工程变更",
    fact: "3 号线车站装修变更累计超概 12.6%，签证与监理日志日期矛盾 3 处，缺 2 份变更审批。",
    law: "《政府投资条例》第十二条；政府投资项目审计监督通知关于变更控制。",
    opinion: "建议表述为审批手续不完整，避免直接写违规。",
  },
  {
    id: "wg07",
    no: "WG-07",
    title: "往来款体外循环",
    owner: "hong",
    status: "已退回",
    cat: "E. 重点支出",
    fact: "集团本部 → 海云信息 → 澜海商贸 → 回款，往来互转 2,480 万，缺资金流截图。",
    law: "集团资金管理制度关于资金体外循环与虚假贸易关注口径。",
    opinion: "复核意见：补资金流截图后再报。",
  },
  {
    id: "wg04",
    no: "WG-04",
    title: "会议费交叉列支",
    owner: "hong",
    status: "已提交",
    cat: "E. 重点支出",
    fact: "会议费与培训费交叉列支 27 万，发票号重复 1 张。",
    law: "机关会议费管理办法。",
    opinion: "建议调账并完善审批。",
  },
  {
    id: "wg08",
    no: "WG-08",
    title: "运维合同缺成果物条款",
    owner: "hong",
    status: "已提交",
    cat: "D. 采购关联",
    fact: "运维合同未约定成果物清单与扣款条款。",
    law: "集团采购管理办法履约验收。",
    opinion: "建议在报告管理建议中单列。",
  },
  {
    id: "wg02",
    no: "WG-02",
    title: "内控缺陷未整改",
    owner: "张敏",
    status: "已提交",
    cat: "B. 内控测试",
    fact: "信息公司内控自评缺陷 11 项未闭环。",
    law: "行政事业单位内部控制规范。",
    opinion: "已提交主审复核。",
  },
  {
    id: "wg05",
    no: "WG-05",
    title: "食堂关联采购",
    owner: "李强",
    status: "草稿",
    cat: "D. 采购关联",
    fact: "食堂供应商与中标运维商疑似同一实控。",
    law: "集团采购管理办法回避规定。",
    opinion: "组员草稿，待主审复核。",
  },
];
const PAPER_ISSUES = [
  {
    id: "i1",
    title: "运维成果物缺失",
    cat: "D. 采购关联",
    methods: ["核对运维合同验收与成果物条款", "抽凭付款凭证及发票", "比对巡检报告、成果物清单是否入库"],
    queries: [
      { name: "合同与付款", result: "海云运维合同 154 万，账套已全额列支，付款 4 笔。" },
      { name: "成果物检索", result: "项目资料无巡检报告、成果物清单、验收单；合同约定按月交付。" },
    ],
    findings: ["支出真实性存疑，缺成果物支撑", "合同未落实按月交付即付款的控制"],
    conclusion: "信息化运维支出 154 万元缺少成果物，真实性存疑，应限期补证并修订验收条款。",
    fact: "信息化运维合同 154 万，抽凭未见巡检报告、成果物清单与验收记录，合同约定按月交付。",
    law: "集团采购管理办法关于履约验收；合同第 8 条成果物交付条款。",
  },
  {
    id: "i2",
    title: "车站装修变更超概",
    cat: "C. 工程变更",
    methods: ["概算—变更—结算对照", "签证与监理日志日期核对", "变更审批权限穿行"],
    queries: [
      { name: "变更率", result: "车站装修变更累计超概 12.6%，大额包 860 万。" },
      { name: "审批链", result: "缺 2 份变更审批；签证与监理日志日期矛盾 3 处。" },
    ],
    findings: ["变更超概未履行完整审批", "现场签证与监理记录不一致"],
    conclusion: "车站装修变更审批手续不完整，超概 12.6%，应补齐审批并核减无依据变更价款。",
    fact: "3 号线车站装修变更累计超概 12.6%，签证与监理日志日期矛盾 3 处，缺 2 份变更审批。",
    law: "《政府投资条例》第十二条；政府投资项目审计监督通知关于变更控制。",
  },
  {
    id: "i3",
    title: "往来款体外循环",
    cat: "E. 重点支出",
    methods: ["往来科目余额及发生额查询", "资金流穿透（付款—收款对手）", "关联方撞库"],
    queries: [
      { name: "资金路径", result: "集团本部 → 海云信息 → 澜海商贸 → 回款，互转 2,480 万。" },
      { name: "截图与合同", result: "缺资金流截图；对手与食堂供应商疑似同一实控。" },
    ],
    findings: ["往来款存在体外循环迹象", "关联方披露不完整"],
    conclusion: "往来互转 2,480 万元具有体外循环迹象，须补资金流证据后定性，暂列入高风险事项。",
    fact: "集团本部 → 海云信息 → 澜海商贸 → 回款，往来互转 2,480 万，缺资金流截图。",
    law: "集团资金管理制度关于资金体外循环与虚假贸易关注口径。",
  },
  {
    id: "i4",
    title: "会议费交叉列支",
    cat: "E. 重点支出",
    methods: ["会议费/培训费科目比对", "发票号去重", "事由与审批单匹配"],
    queries: [
      { name: "交叉列支", result: "会议费与培训费交叉列支 27 万，8 月抽 12 笔。" },
      { name: "发票", result: "发票号重复 1 张；两笔住宿超标准无说明。" },
    ],
    findings: ["费用科目交叉列支", "发票重复、超标准无说明"],
    conclusion: "会议费与培训费交叉列支 27 万元，列支不规范，应调账并完善审批。",
    fact: "会议费与培训费交叉列支 27 万，发票号重复 1 张。",
    law: "机关会议费管理办法。",
  },
  {
    id: "i5",
    title: "运维合同缺成果物条款",
    cat: "D. 采购关联",
    methods: ["合同条款要素抽取", "与采购文件、验收办法对照", "付款节点与验收绑定检查"],
    queries: [
      { name: "合同文本", result: "未约定成果物清单与扣款条款；付款为到货后 7 日。" },
      { name: "版本对比", result: "v2 删除验收扣款条款，新增「到货即视为验收」。" },
    ],
    findings: ["合同控制条款缺失", "验收形同虚设"],
    conclusion: "运维合同缺少成果物与扣款条款，履约控制失效，应在管理建议中督促修订合同模板。",
    fact: "运维合同未约定成果物清单与扣款条款。",
    law: "集团采购管理办法履约验收。",
  },
  {
    id: "i6",
    title: "专项资金闲置",
    cat: "E. 重点支出",
    methods: ["核对专项批复、指标与账套结转结余", "查询支付进度与闲置时长", "抽查绩效目标、监控、评价是否闭环"],
    queries: [
      { name: "结余查询", result: "卫生板块专项预算结余 860 万，连续闲置超过 18 个月。" },
      { name: "绩效材料", result: "绩效目标已备案；监控报告缺 2025 年一、二季度；无评价报告。" },
    ],
    findings: ["专项资金长期闲置未按进度使用", "绩效监控与评价未形成闭环"],
    conclusion: "专项资金闲置 860 万元且绩效监控未闭环，属预算执行不到位，应查明原因并纳入报告。",
    fact: "卫生板块专项预算长期闲置，绩效目标与监控材料未闭环。",
    law: "预算绩效管理办法关于监控与评价闭环。",
  },
  {
    id: "i7",
    title: "循环贸易 1,860 万",
    cat: "D. 采购关联",
    methods: ["进销同一标的匹配", "资金流与发票时点穿透", "仓单、物流、仓储核对"],
    queries: [
      { name: "进销匹配", result: "同日进销 6 笔，标的相同，加价 4.2% 且无服务记录。" },
      { name: "实物流", result: "无仓单、无物流轨迹；对手与集团子公司疑似关联。" },
    ],
    findings: ["循环贸易、虚假贸易迹象", "货物流与资金流不匹配"],
    conclusion: "循环贸易 1,860 万元缺乏实物流，虚假贸易风险高，应延伸供应商并写入报告。",
    fact: "同日进销、无仓单、加价无服务，循环贸易迹象金额 1,860 万。",
    law: "虚假贸易监管口径。",
  },
  {
    id: "i8",
    title: "大额支出决策与预算安排依据不完整",
    cat: "A. 审前调查",
    methods: ["重大支出目录核对", "预算安排与会议纪要检索", "资金支付穿行"],
    queries: [
      { name: "支出台账", result: "对外投资设立子公司列支 1,200 万，资金已支付。" },
      { name: "依据检索", result: "未检索到完整预算安排或集体研究记录；可研报告未入项目档案。" },
    ],
    findings: ["大额支出缺少完整预算与决策依据", "决策依据资料缺失"],
    conclusion: "对外投资支出 1,200 万元预算安排与决策依据不完整，应作为预算执行关注问题。",
    fact: "预算单位对外投资支出 1,200 万，安排与决策依据不完整。",
    law: "集团全面预算管理办法及重大支出集体决策规定。",
  },
  {
    id: "i9",
    title: "预算调剂程序不合规",
    cat: "E. 重点支出",
    methods: ["调剂文件与指标账对照", "批复时点与账务处理时点比对", "按月对流分录查询"],
    queries: [
      { name: "调剂频次", result: "2025 年中调剂 11 次，涉及重点支出科目 4 个。" },
      { name: "时点核对", result: "3 笔调剂账务处理早于批复 15–40 天；1 笔无调剂文件。" },
    ],
    findings: ["先调账后补批", "个别调剂缺少文件依据"],
    conclusion: "预算调剂未严格履行规定程序，批复与账务时点不一致，应要求纠正并完善内控。",
    fact: "年中频繁调剂，批复时点与账务处理不一致。",
    law: "集团全面预算管理办法关于预算调整。",
  },
];
const paperState = { mode: "list", selectedId: null, pendingId: null, pendingIssue: null, pendingAction: null };
let paperSeq = 12;
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
    <p>入选口径：业务特征 + 已暴露风险 + 监管要求。预算执行优先调剂与重点支出异常单位，安全覆盖高危板块，工程盯超概与签证，专项盯虚假贸易和资金闲置，内控评价盯缺陷未闭环。</p>
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
    if (lead) lead.textContent = `共 ${POLICIES.length} 份政策，按同类归组。分类下看整体应对，点进单条看解读。`;
    document.getElementById("policy-list").innerHTML = POLICY_CATEGORIES.map((cat) => {
      const items = POLICIES.filter((p) => p.category === cat.id);
      if (!items.length) return "";
      return `<section class="policy-group">
        <h3 class="policy-group-hd">${cat.label}<span>${items.length}</span></h3>
        <div class="policy-cards">
          ${items
            .map(
              (p) => `<button class="policy-item" type="button" data-policy="${p.id}">
            <b>${p.title}</b>
            <span>${p.date} · ${p.org}</span>
            <em>${p.brief}</em>
          </button>`
            )
            .join("")}
        </div>
        <div class="policy-cat-actions result-block">
          <h4>本类整体应对</h4>
          ${(cat.actions || [])
            .map((a) => `<p><span class="tag ${a.kind === "审计" ? "doing" : "ai"}">${a.kind}</span> ${a.text}</p>`)
            .join("")}
          <div class="policy-cat-ops">
            <button class="btn sm" type="button" data-scene="detect">按本类筛审计对象</button>
            <button class="btn ghost sm" type="button" data-scene="plan">写入计划安排</button>
          </div>
        </div>
      </section>`;
    }).join("");
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
    <div class="result-block"><h4>要点</h4><ul>${p.points.map((x) => `<li>${x}</li>`).join("")}</ul></div>`;
}

function cockpitStats() {
  const root = SCHEME_MATTER_TREE[0];
  const doubtCounts = root ? matterStatusCounts(root) : { total: 0, issue: 0, pending: 0, clear: 0 };
  const evidenceN = FINDING_EVIDENCE.length;
  const evidenceSent = FINDING_EVIDENCE.filter((x) => x.evidenced).length;
  const evidenceIssue = FINDING_EVIDENCE.filter((x) => x.feedback === "done" && x.opinion).length;
  const paperN = paperDocs.length;
  const paperIssue = typeof reportPaperProblems === "function" ? reportPaperProblems().length : paperDocs.filter((p) => {
    const issue = typeof issueByTitle === "function" ? issueByTitle(p.title) : null;
    const findings = p.findings || issue?.findings || [];
    return findings.length > 0;
  }).length;
  const docsN = typeof FIELDPACK_DOCS !== "undefined" ? FIELDPACK_DOCS.length : 0;
  const docsGap = typeof fieldpackGapList === "function" ? fieldpackGapList().length : 0;
  return { doubtCounts, evidenceN, evidenceSent, evidenceIssue, paperN, paperIssue, docsN, docsGap };
}

function cockpitPipeHtml() {
  const s = cockpitStats();
  const doubtSpan = `疑点 ${s.doubtCounts.total} · 有问题 ${s.doubtCounts.issue}`;
  const draftSpan = `取证 ${s.evidenceN} · 有问题 ${s.evidenceN}`;
  const paperSpan = `底稿 ${s.paperN} · 有问题 ${s.paperIssue}`;
  const docsSpan = `资料 ${s.docsN} · 缺件 ${s.docsGap}`;
  return `
    <button class="pipe-step done" type="button" data-scene="survey"><b>审前调查</b><span>已完成</span></button>
    <button class="pipe-step done" type="button" data-scene="scheme"><b>方案制定</b><span>已完成</span></button>
    <button class="pipe-step now" type="button" data-scene="doubt"><b>审计指引</b><span>${doubtSpan}</span></button>
    <button class="pipe-step" type="button" data-scene="draft"><b>发现取证</b><span>${draftSpan}</span></button>
    <button class="pipe-step" type="button" data-scene="talkdata"><b>问数 / 抽样</b><span>可进入</span></button>
    <button class="pipe-step" type="button" data-scene="interview"><b>访谈</b><span>对话</span></button>
    <button class="pipe-step" type="button" data-scene="paper"><b>底稿</b><span>${paperSpan}</span></button>
    <button class="pipe-step" type="button" data-scene="report"><b>报告生成</b><span>可进入</span></button>
    <button class="pipe-step" type="button" data-scene="fieldpack" data-open-docs="1"><b>项目资料</b><span>${docsSpan}</span></button>
    <button class="pipe-step" type="button" data-scene="evidence"><b>证据链</b><span>可进入</span></button>`;
}

function renderCockpit() {
  const pipe = document.getElementById("cockpit-pipe");
  if (pipe) pipe.innerHTML = cockpitPipeHtml();
  seedCockpitChat(true);
}

function cockpitNextWorkHtml() {
  return `<div class="result-block" style="margin-top:10px"><h4>建议接下来的工作</h4>
      <ol>
        <li>在<strong>审计指引</strong>中核完待确认疑点，区分已确认问题 / 无问题；</li>
        <li>对已确认问题生成<strong>取证单</strong>，列明需补交资料；</li>
        <li>视需要再做问数/抽样或访谈，之后进入底稿与报告。</li>
      </ol>
      <p style="margin:8px 0 0;font-size:12px;color:var(--muted)">当前焦点在审计指引，优先把疑点核清再往后推进。也可点上方「项目资料」直接看资料清单。</p>
    </div>
    <div class="scheme-prompts">
      <button type="button" data-cockpit-prompt="next">下一步怎么推进</button>
      <button type="button" data-cockpit-prompt="doubt">打开审计指引</button>
      <button type="button" data-cockpit-prompt="draft">去发现取证智能体</button>
      <button type="button" data-cockpit-prompt="docs">打开项目资料</button>
    </div>`;
}

function cockpitWelcomeHtml() {
  const s = cockpitStats();
  return `<div class="bubble ai">
      您好，这里是<strong>项目工作台</strong>。上方流程条看阶段并点进智能体；指引 / 取证 / 底稿已标数量，点「项目资料」可直接查看资料。
      <div class="result-block" style="margin-top:10px"><h4>数量速览</h4>
        指引疑点 <b>${s.doubtCounts.total}</b>（有问题 ${s.doubtCounts.issue}）·
        取证 <b>${s.evidenceN}</b>（有问题 ${s.evidenceN}）·
        底稿 <b>${s.paperN}</b>（有问题 ${s.paperIssue}）·
        项目资料 <b>${s.docsN}</b>（缺件 ${s.docsGap}）
      </div>
      ${cockpitNextWorkHtml()}
    </div>`;
}

function seedCockpitChat(force) {
  const box = document.getElementById("cockpit-msgs");
  if (!box) return;
  if (!force && box.dataset.seeded === "1") {
    box.scrollTop = box.scrollHeight;
    return;
  }
  box.dataset.seeded = "1";
  box.innerHTML = cockpitWelcomeHtml();
  box.scrollTop = 0;
}

function cockpitReplyHtml(text) {
  const t = text.trim();
  if (/指引|疑点|doubt/i.test(t) || t === "打开审计指引") {
    const s = cockpitStats();
    return `审计指引进行中：疑点 <b>${s.doubtCounts.total}</b> 条（有问题 ${s.doubtCounts.issue} · 待确认 ${s.doubtCounts.pending}）。
      <div style="margin-top:8px"><button class="btn sm" type="button" data-scene="doubt">进入审计指引</button></div>`;
  }
  if (/项目资料|资料清单|打开项目资料|fieldpack/i.test(t) || t === "打开项目资料") {
    fieldpackState.openList = true;
    return `可直接查看项目资料清单与缺件。
      <div style="margin-top:8px"><button class="btn sm" type="button" data-scene="fieldpack" data-open-docs="1">打开项目资料</button></div>`;
  }
  if (/取证|发现取证|draft/i.test(t) || t === "去写取证单" || t === "去发现取证智能体") {
    const s = cockpitStats();
    return `发现取证：取证 <b>${s.evidenceN}</b> 条（有问题 ${s.evidenceN} · 已发送 ${s.evidenceSent}）。
      <div style="margin-top:8px"><button class="btn sm" type="button" data-scene="draft">打开发现取证智能体</button></div>`;
  }
  if (/下一步|推进|next|建议|工作/i.test(t) || t === "下一步怎么推进") {
    return cockpitNextWorkHtml();
  }
  if (/进度|状态|status|总览/i.test(t)) {
    return `阶段状态见上方流程条。当前建议按下面顺序推进：
      ${cockpitNextWorkHtml()}`;
  }
  if (/底稿|报告|证据|访谈|问数|抽样|调查|方案/i.test(t)) {
    const map = [
      [/调查/, "survey", "审前调查"],
      [/方案/, "scheme", "方案制定"],
      [/问数|抽样/, "talkdata", "问数 / 抽样"],
      [/访谈/, "interview", "访谈"],
      [/底稿/, "paper", "底稿智能体"],
      [/报告/, "report", "报告生成"],
      [/证据/, "evidence", "证据链"],
    ];
    const hit = map.find(([re]) => re.test(t));
    if (hit) {
      return `可以打开「${hit[2]}」继续。
        <div style="margin-top:8px"><button class="btn sm" type="button" data-scene="${hit[1]}">进入${hit[2]}</button></div>`;
    }
  }
  return `已记下。可问「下一步怎么推进」，或点上方阶段条跳转（含项目资料）。
    <div class="cite">项目工作台 · 对话统筹 · 流程条保留</div>`;
}

function cockpitReply(text) {
  const box = document.getElementById("cockpit-msgs");
  if (!box) return;
  const user = document.createElement("div");
  user.className = "bubble user";
  user.textContent = text;
  box.appendChild(user);
  const ai = document.createElement("div");
  ai.className = "bubble ai";
  ai.innerHTML = cockpitReplyHtml(text);
  box.appendChild(ai);
  box.scrollTop = box.scrollHeight;
}

function myPapers() {
  return paperDocs.filter((p) => p.owner === CURRENT_AUDITOR);
}

function paperEditable(p) {
  return p.owner === CURRENT_AUDITOR && (p.status === "草稿" || p.status === "已退回");
}

function myDraftPapers() {
  return paperDocs.filter(paperEditable);
}

function paperStatsHtml() {
  const mine = myPapers();
  const drafts = mine.filter((p) => p.status === "草稿" || p.status === "已退回").length;
  const submitted = mine.filter((p) => p.status === "已提交").length;
  const returned = mine.filter((p) => p.status === "已退回").length;
  const needAdjust = mine.filter((p) => paperAdjustHints(p).length).length;
  return `共 <b>${mine.length}</b> 份底稿 · 可改 ${drafts} · 已提交 ${submitted} · 已退回 ${returned} · 建议调整 ${needAdjust}
      <div class="finding-ev-list" style="margin-top:10px">`;
}

function paperAdjustHints(doc) {
  const issue = issueByTitle(doc.title);
  const methods = doc.methods || issue?.methods || [];
  const queries = doc.queries || issue?.queries || [];
  const findings = doc.findings || issue?.findings || [];
  const fact = doc.fact || issue?.fact || "";
  const law = doc.law || issue?.law || "";
  const conclusion = doc.conclusion || doc.opinion || issue?.conclusion || "";
  const hints = [];

  if (doc.status === "已退回") hints.push({ level: "risk", tag: "已退回", text: "按复核意见补证据或改表述后再提交。" });
  if ((fact || "").length < 40) hints.push({ level: "warn", tag: "事实偏短", text: "补充对象、时点、金额/笔数与已核路径。" });
  if (!law || /待对话|待补充/.test(law)) hints.push({ level: "warn", tag: "缺法规", text: "补引对应管理办法或法规条款。" });
  if (!methods.length) hints.push({ level: "warn", tag: "缺程序", text: "写清本事项审计程序与方法。" });
  if (queries.length < 2) hints.push({ level: "warn", tag: "取证偏少", text: "增加查询/取证记录，扩大核查范围。" });
  if (findings.length && /违规|违法|虚假|套取/.test(conclusion + findings.join("")) && /缺|未见|未交|无/.test(fact + queries.map((q) => q.result || "").join(""))) {
    hints.push({ level: "risk", tag: "定性偏重", text: "证据仍有缺口，建议改为「真实性存疑 / 手续不完整」等审慎表述。" });
  }
  if (!(conclusion || "").trim()) {
    hints.push({ level: "warn", tag: "缺结论", text: "补充审计结论；若无问题写明未见需报告事项。" });
  } else if (doc.status === "草稿" && findings.length && !/建议|应|须/.test(conclusion)) {
    hints.push({ level: "warn", tag: "缺处理意见", text: "已有问题，请在结论中写出可执行的处理意见（限期补证 / 调账等）。" });
  }
  return hints.slice(0, 4);
}

function paperListItemHtml(doc) {
  const issue = issueByTitle(doc.title);
  const findings = doc.findings || issue?.findings || [];
  const hints = paperAdjustHints(doc);
  const can = paperEditable(doc);
  const statusTag =
    doc.status === "已提交" ? "ok" : doc.status === "已退回" ? "risk" : doc.status === "草稿" ? "warn" : "doing";
  const needAdjust = hints.length > 0;
  const cardClass = ["finding-ev-card", "paper-list-card", needAdjust ? "has-adjust" : "", doc.status === "已退回" ? "has-overdue" : ""]
    .filter(Boolean)
    .join(" ");
  const tipBlock = needAdjust
    ? `<div class="finding-ev-docs-tip paper-adjust-tip">
        <div class="finding-ev-docs-tip-hd"><span class="tag risk">建议调整</span><strong>${hints.length} 项</strong></div>
        <ul class="finding-ev-need">${hints
          .map((h) => `<li><span class="tag ${h.level}">${escapeHtml(h.tag)}</span> ${escapeHtml(h.text)}</li>`)
          .join("")}</ul>
      </div>`
    : `<p class="finding-ev-opinion-empty muted">暂无强制调整项 · 可继续完善过程记录与结论</p>`;
  const actions = can
    ? `<button type="button" class="btn sm" data-paper-prompt="open" data-paper-id="${doc.id}">打开修改</button>
       <button type="button" class="btn ghost sm" data-paper-prompt="guide" data-paper-id="${doc.id}">撰写指引</button>
       <button type="button" class="btn ghost sm" data-paper-prompt="review" data-paper-id="${doc.id}">检查本底稿</button>`
    : `<button type="button" class="btn ghost sm" data-paper-prompt="open" data-paper-id="${doc.id}">查看底稿</button>
       <button type="button" class="btn ghost sm" data-paper-prompt="review" data-paper-id="${doc.id}">检查本底稿</button>`;

  return `<article class="${cardClass}" data-paper-id="${doc.id}">
      <div class="finding-ev-hd">
        <h4>${escapeHtml(doc.no)} · ${escapeHtml(doc.title)}</h4>
        <div class="chip-row" style="margin:0">
          <span class="tag ${statusTag}">${escapeHtml(doc.status)}</span>
          ${findings.length ? `<span class="tag risk">问题 ${findings.length}</span>` : `<span class="tag ok">未见单列问题</span>`}
          ${can ? `<span class="tag doing">可修改</span>` : ""}
        </div>
      </div>
      <p class="finding-ev-meta muted">${escapeHtml(doc.cat || "—")} · 编制人 ${escapeHtml(doc.owner || "—")}</p>
      <div class="finding-ev-cols">
        <div><b>过程记录</b><br />${(doc.methods || issue?.methods || []).length ? "已写程序" : "程序待补"} · ${(doc.queries || issue?.queries || []).length || 0} 条取证</div>
        <div><b>审计结论</b><br />${findings.length ? "有问题 · 须含处理意见" : "结论可复核"}</div>
      </div>
      ${tipBlock}
      <div class="finding-ev-actions">${actions}</div>
    </article>`;
}

function paperListHtml() {
  const mine = myPapers();
  const editable = myDraftPapers();
  const list = mine.length ? mine : editable;
  const cards = list.length
    ? list.map(paperListItemHtml).join("")
    : `<p class="muted">暂无底稿。可从下方待编制事项新增。</p>`;
  return `${paperStatsHtml()}
        ${cards}
      </div>
    <p style="margin:12px 0 6px;font-size:12px;color:var(--muted)">列表直接标出「建议调整」（类似发现取证高亮）。点卡片按钮打开、看指引或检查。</p>
    ${paperPendingHtml()}`;
}

function paperIssueCovered(issue) {
  return myPapers().some((p) => p.title === issue.title || p.title.includes(issue.title) || issue.title.includes(p.title));
}

function pendingPaperIssues() {
  return PAPER_ISSUES.filter((issue) => !paperIssueCovered(issue));
}

function issueByTitle(title) {
  return PAPER_ISSUES.find((issue) => title === issue.title || title.includes(issue.title) || issue.title.includes(title));
}

function paperFromIssueFields(issue) {
  return {
    methods: issue.methods || [],
    queries: issue.queries || [],
    findings: issue.findings || [],
    conclusion: issue.conclusion || "",
    fact: issue.fact,
    law: issue.law,
    opinion: issue.conclusion || "待主审确认定性用语。",
  };
}

paperDocs.forEach((doc) => {
  const issue = PAPER_ISSUES.find((x) => doc.title === x.title || doc.title.includes(x.title) || x.title.includes(doc.title));
  if (!issue || doc.methods) return;
  Object.assign(doc, paperFromIssueFields(issue));
});

function paperCreateFromIssue(issue) {
  const extra = paperFromIssueFields(issue);
  const doc = {
    id: `wg${paperSeq}`,
    no: `WG-${String(paperSeq).padStart(2, "0")}`,
    title: issue.title,
    owner: CURRENT_AUDITOR,
    status: "草稿",
    cat: issue.cat,
    ...extra,
  };
  paperSeq += 1;
  paperDocs.unshift(doc);
  paperState.mode = "edit";
  paperState.selectedId = doc.id;
  return doc;
}

function paperCatForMatter(matter) {
  const name = matter.name || "";
  if (/工程|变更|签证|超概/.test(name)) return PAPER_CATS[2];
  if (/采购|运维|供应商|食堂/.test(name)) return PAPER_CATS[3];
  if (/会议|培训|专项|绩效|结转|调剂|预算/.test(name)) return PAPER_CATS[4];
  if (/内控/.test(name)) return PAPER_CATS[1];
  return PAPER_CATS[4];
}

function paperCreateFromMatter(matter) {
  const doubts = matterAllDoubts(matter).filter((d) => d.status === "issue" || d.status === "pending");
  const focusList = doubts.length ? doubts : matterAllDoubts(matter);
  const title = (focusList[0]?.title || matter.name).replace(/^[0-9一二三四五六七八九十\.、\s]+/, "").trim() || matter.name;
  const exists = paperDocs.find(
    (p) => p.owner === CURRENT_AUDITOR && p.status === "草稿" && (p.title === title || p.matterId === matter.id)
  );
  if (exists) return { doc: exists, created: false };

  const factParts = focusList.map((d) => `${d.unit || "被审计单位"}：${d.reason}（路径：${d.path}）`);
  const findings = focusList.filter((d) => d.status === "issue").map((d) => d.title);
  const methods = [
    `按实施方案事项「${matter.name}」执行核查`,
    ...(focusList.slice(0, 3).map((d) => d.path)),
  ];
  const doc = {
    id: `wg${paperSeq}`,
    no: `WG-${String(paperSeq).padStart(2, "0")}`,
    title,
    owner: CURRENT_AUDITOR,
    status: "草稿",
    cat: paperCatForMatter(matter),
    matterId: matter.id,
    methods,
    queries: focusList.slice(0, 4).map((d) => ({
      name: d.title,
      result: `${d.reason} · ${GUIDE_STATUS[d.status]?.label || d.status}`,
    })),
    findings: findings.length ? findings : [`事项「${matter.name}」已形成核查记录，待补充证据`],
    conclusion:
      findings.length > 0
        ? `事项「${matter.name}」已确认问题 ${findings.length} 项，建议写入取证单并限期补证。`
        : `事项「${matter.name}」以待确认为主，补齐证据后再定性。`,
    fact: factParts.join("；") || matter.content || "",
    law: "对照实施方案程序方法与相关法规条款复核后引用。",
    opinion:
      findings.length > 0
        ? `事项「${matter.name}」已确认问题 ${findings.length} 项，建议写入取证单并限期补证。`
        : `事项「${matter.name}」以待确认为主，补齐证据后再定性。`,
  };
  paperSeq += 1;
  paperDocs.unshift(doc);
  return { doc, created: true };
}

function batchGeneratePapersFromGuide() {
  const ids = [...guideState.checked];
  if (!ids.length) {
    toast("请先勾选事项");
    return;
  }
  const created = [];
  const skipped = [];
  ids.forEach((id) => {
    const matter = findMatter(id);
    if (!matter) return;
    const { doc, created: isNew } = paperCreateFromMatter(matter);
    if (isNew) created.push(doc);
    else skipped.push(doc);
  });
  if (!created.length && skipped.length) {
    toast(`所选事项已有草稿底稿 ${skipped.length} 份`);
    setScene("paper");
    return;
  }
  toast(`已批量生成底稿 ${created.length} 份${skipped.length ? `，跳过已有 ${skipped.length}` : ""}`);
  guideState.checked.clear();
  setScene("paper");
}

document.getElementById("paper-gen-btn")?.addEventListener("click", () => {
  if (currentScene !== "doubt") setScene("doubt");
  batchGeneratePapersFromGuide();
});

function paperPendingHtml() {
  const pending = pendingPaperIssues();
  if (!pending.length) {
    return `<p style="margin:12px 0 6px">您的事项均已编制底稿。</p>`;
  }
  return `<p style="margin:12px 0 6px">您的以下事项还未编制底稿，点击可以直接新增底稿：</p>
    <div class="scheme-prompts">${pending
      .map(
        (issue) =>
          `<button type="button" data-paper-prompt="create" data-paper-issue="${issue.id}">新增底稿 · ${issue.title}</button>`
      )
      .join("")}</div>`;
}

function paperMenuHtml() {
  return `<div class="scheme-prompts">
      <button type="button" data-paper-prompt="guide">撰写指引</button>
      <button type="button" data-paper-prompt="review">检查已写底稿</button>
      <button type="button" data-paper-prompt="list">返回底稿列表</button>
    </div>`;
}

function paperDocActionsHtml(doc) {
  return `<div class="scheme-prompts">
      <button type="button" data-paper-prompt="guide" data-paper-id="${doc.id}">撰写指引 · ${escapeHtml(doc.no)}</button>
      <button type="button" data-paper-prompt="review" data-paper-id="${doc.id}">检查本底稿</button>
      <button type="button" data-paper-prompt="list">返回底稿列表</button>
    </div>`;
}

function paperFindDoc(text) {
  const t = (text || "").trim();
  const noHit = t.match(/WG-\d+/i);
  if (noHit) {
    const byNo = paperDocs.find((p) => p.no.toUpperCase() === noHit[0].toUpperCase());
    if (byNo) return byNo;
  }
  if (paperState.selectedId) {
    const cur = paperDocs.find((p) => p.id === paperState.selectedId);
    if (cur) return cur;
  }
  return (
    paperDocs.find((p) => t.includes(p.title.slice(0, 6))) ||
    myDraftPapers()[0] ||
    paperDocs.find((p) => p.owner === CURRENT_AUDITOR) ||
    paperDocs[0]
  );
}

function paperMaterialsFor(doc) {
  const issue = issueByTitle(doc.title);
  const cat = doc.cat || "";
  const base = [
    "实施方案对应事项及程序方法",
    "账套明细 / 科目余额（相关期间）",
    "合同、批复、审批单及原始凭证",
  ];
  if (/调剂|预算/.test(doc.title + cat)) {
    return [...base, "预算调剂台账与批复原件", "入账凭证与时点对照表", "全面预算管理办法"];
  }
  if (/会议|培训|交叉/.test(doc.title)) {
    return [...base, "会议费/培训费明细与发票", "培训方案、通知与签到", "费用报销管理办法"];
  }
  if (/运维|成果物|采购/.test(doc.title + cat)) {
    return [...base, "运维合同及验收条款", "巡检报告 / 成果物清单 / 验收单", "付款凭证与发票"];
  }
  if (/专项|闲置|绩效/.test(doc.title)) {
    return [...base, "专项批复与分解表", "执行进度说明", "绩效目标 / 监控 / 评价材料"];
  }
  if (/变更|超概|工程/.test(doc.title + cat)) {
    return [...base, "概算与变更签证台账", "监理日志", "变更审批文件"];
  }
  if (/决策|1,200|1200|三重/.test(doc.title + (doc.fact || ""))) {
    return [...base, "集体决策纪要及文号", "预算安排文件", "付款审批与资金流向"];
  }
  if (issue?.queries?.length) {
    return [...base, ...issue.queries.map((q) => `支撑「${q.name}」的原始资料`)];
  }
  return base;
}

function paperGuideHtml(doc) {
  if (!doc) {
    return `<div class="result-block"><h4>撰写指引</h4>
      <p>请先打开或点选一份底稿，再查看应做什么、查什么、需要什么资料。</p>
      ${paperListHtml()}</div>`;
  }
  const issue = issueByTitle(doc.title);
  const methods = doc.methods || issue?.methods || ["核对资料与账套", "抽凭或穿行", "对照法规给出结论"];
  const materials = paperMaterialsFor(doc);
  const checks = [
    "事实是否写清对象、时点、金额/笔数、已核路径",
    "查询结果是否覆盖程序方法中的关键步骤",
    "法规引用是否与结论定性匹配",
    "问题表述是否可复核，避免证据不足时写死「违规」",
  ];
  return `<div class="result-block"><h4>撰写指引 · ${escapeHtml(doc.no)} ${escapeHtml(doc.title)}</h4>
      <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">企业预算执行审计 · 底稿撰写指引</p>
      <h4>一、应该做什么</h4>
      <ol>
        <li>按实施方案「${escapeHtml(doc.cat)}」事项执行程序，固定审计路径与抽样口径。</li>
        <li>把查询结果写入底稿事实栏，问题单列，结论与法规对应。</li>
        <li>缺证处写清「缺什么、找谁要、时限」，衔接发现取证智能体催办。</li>
        <li>定性用语可复核：有证据写「真实性存疑 / 手续不完整」；证据不足勿写死「违规」。</li>
      </ol>
      <h4>二、查什么（程序方法）</h4>
      <ol>${methods.map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ol>
      <h4>三、需要什么资料</h4>
      <ul class="finding-ev-need">${materials.map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ul>
      <h4>四、撰写自检要点</h4>
      <ul>${checks.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
    </div>
    ${paperDocActionsHtml(doc)}`;
}

function paperReviewHtml(doc) {
  if (!doc) {
    return `<div class="result-block"><h4>检查已写底稿</h4>
      <p>请先打开一份底稿再检查。</p>${paperListHtml()}</div>`;
  }
  const issue = issueByTitle(doc.title);
  const methods = doc.methods || issue?.methods || [];
  const queries = doc.queries || issue?.queries || [];
  const findings = doc.findings || issue?.findings || [];
  const fact = doc.fact || "";
  const law = doc.law || issue?.law || "";
  const conclusion = doc.conclusion || doc.opinion || issue?.conclusion || "";
  const materials = paperMaterialsFor(doc);

  const writeIssues = [];
  const writeOk = [];
  if (fact.length < 40) writeIssues.push("事实表述偏短，对象/时点/金额或路径写得不够清楚。");
  else writeOk.push("事实栏具备基本要素（对象、金额或路径有体现）。");
  if (!law || /待对话|待补充/.test(law)) writeIssues.push("法规依据缺失或仍为占位，结论缺少引用支撑。");
  else writeOk.push("已引用法规或管理办法条款。");
  if (!conclusion || conclusion.length < 20) writeIssues.push("审计结论过简，未形成可复核的定性表述。");
  else writeOk.push("已形成审计结论表述。");
  if (!findings.length) writeIssues.push("未单列查出的问题，问题与结论对应关系弱。");
  else writeOk.push(`已单列问题 ${findings.length} 项。`);

  const dataIssues = [];
  const dataOk = [];
  if (!methods.length) dataIssues.push("未写清程序方法，审查深度难以判断。");
  else dataOk.push(`程序方法 ${methods.length} 步，路径基本清楚。`);
  if (queries.length < 2) dataIssues.push("查询结果偏少，范围可能不足以支撑结论。");
  else dataOk.push(`查询结果 ${queries.length} 项，覆盖一定范围。`);
  if (/缺|未见|未交|无/.test(fact + queries.map((q) => q.result).join(""))) {
    dataOk.push("已提示资料缺口，有利于限定结论边界。");
  } else {
    dataIssues.push("未提示资料缺口；若实际未齐，应在事实中写明，避免范围虚高。");
  }
  const shallow =
    queries.length > 0 &&
    queries.every((q) => (q.result || "").length < 28) &&
    methods.length < 3;
  if (shallow) dataIssues.push("查询结果粒度偏粗，深度不够（建议补穿行、抽样明细或时点对照）。");
  else if (queries.length) dataOk.push("查询结果有一定粒度，可支撑初步结论。");

  const qualIssues = [];
  const qualOk = [];
  const harsh = /违规|违法|虚假|套取/.test(conclusion + findings.join(""));
  const soft = /存疑|不完整|不完善|待补|建议/.test(conclusion);
  const evidenceGap = /缺|未见|未交|无截图|无报告/.test(fact + queries.map((q) => q.result).join(""));
  if (harsh && evidenceGap) {
    qualIssues.push("证据仍有缺口，但结论/问题使用了偏重定性（如违规、虚假），建议改为「真实性存疑 / 手续不完整 / 存在…迹象」，待补证后再升格。");
  } else if (harsh && !evidenceGap) {
    qualOk.push("使用了较重定性用语，且事实侧未见明显缺证表述，需主审确认口径是否一致。");
  } else if (soft) {
    qualOk.push("定性偏审慎（存疑/不完整/建议），与缺证或待核实情形较匹配。");
  } else {
    qualIssues.push("定性表述一般，建议明确「问题性质 + 处理建议」，避免空泛。");
  }
  if (law && conclusion && !/建议|应|须/.test(conclusion)) {
    qualIssues.push("结论有定性但处理建议偏弱，可补「限期补证 / 调账 / 完善审批」等可执行意见。");
  } else if (/建议|应|须/.test(conclusion)) {
    qualOk.push("结论含处理建议，可执行性较好。");
  }
  if (findings.length && !conclusion.includes(findings[0].slice(0, 4)) && conclusion.length > 10) {
    /* soft check - skip strict */
  }

  const scoreWrite = writeIssues.length ? (writeIssues.length >= 2 ? "待改" : "一般") : "较好";
  const scoreData = dataIssues.length ? (dataIssues.length >= 2 ? "不足" : "一般") : "较够";
  const scoreQual = qualIssues.length ? (qualIssues.some((x) => x.includes("偏重定性")) ? "不准" : "可调") : "较准";

  return `<div class="result-block"><h4>底稿检查 · ${escapeHtml(doc.no)} ${escapeHtml(doc.title)}</h4>
      <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">从撰写质量、资料深度与范围、问题定性与描述三方面评价（企业预算执行口径）</p>
      <div class="chip-row">
        <span class="tag ${scoreWrite === "较好" ? "ok" : "warn"}">撰写 ${scoreWrite}</span>
        <span class="tag ${scoreData === "较够" ? "ok" : "risk"}">资料深度/范围 ${scoreData}</span>
        <span class="tag ${scoreQual === "较准" ? "ok" : "risk"}">定性描述 ${scoreQual}</span>
      </div>
      <h4>1. 已经写的怎么样</h4>
      ${writeOk.length ? `<ul>${writeOk.map((x) => `<li><span class="tag ok">好</span> ${escapeHtml(x)}</li>`).join("")}</ul>` : ""}
      ${writeIssues.length ? `<ul>${writeIssues.map((x) => `<li><span class="tag warn">改</span> ${escapeHtml(x)}</li>`).join("")}</ul>` : `<p class="muted">撰写方面暂无明显硬伤。</p>`}
      <h4>2. 查询到的数据资料 · 深度与范围</h4>
      ${dataOk.length ? `<ul>${dataOk.map((x) => `<li><span class="tag ok">够</span> ${escapeHtml(x)}</li>`).join("")}</ul>` : ""}
      ${dataIssues.length ? `<ul>${dataIssues.map((x) => `<li><span class="tag risk">缺</span> ${escapeHtml(x)}</li>`).join("")}</ul>` : `<p class="muted">深度与范围基本可支撑当前结论。</p>`}
      <p style="font-size:12px;color:var(--muted)">建议必备资料：${escapeHtml(materials.slice(0, 4).join("；"))}${materials.length > 4 ? "…" : ""}</p>
      <h4>3. 底稿内问题 · 定性与描述是否准确</h4>
      ${qualOk.length ? `<ul>${qualOk.map((x) => `<li><span class="tag ok">准</span> ${escapeHtml(x)}</li>`).join("")}</ul>` : ""}
      ${qualIssues.length ? `<ul>${qualIssues.map((x) => `<li><span class="tag risk">调</span> ${escapeHtml(x)}</li>`).join("")}</ul>` : `<p class="muted">定性与描述未见明显偏差。</p>`}
      <h4>当前结论摘录</h4>
      <p>${escapeHtml(conclusion || "（无）")}</p>
    </div>
    ${paperCardHtml(doc)}
    ${paperDocActionsHtml(doc)}`;
}

function paperSuggestFromDoc(doc, findings, conclusion) {
  if (doc.suggest) return Array.isArray(doc.suggest) ? doc.suggest : [doc.suggest];
  if (!findings.length) return [];
  const text = `${conclusion || ""} ${doc.opinion || ""}`;
  const tips = [];
  if (/补交|补证|限期/.test(text)) tips.push("限期补交相关资料并复核原件与系统记录是否一致。");
  if (/调账|列支|交叉/.test(text)) tips.push("按费用开支范围调账，完善审批与发票匹配控制。");
  if (/审批|手续|决策|批复/.test(text)) tips.push("补齐审批/决策/批复手续，并核对入账时点与批准时点。");
  if (/成果物|验收|合同/.test(text)) tips.push("完善合同验收与成果物条款，未齐备成果物前控制付款。");
  if (/闲置|绩效|专项/.test(text)) tips.push("查明专项闲置原因，加快执行或按规定结转，补齐绩效监控评价。");
  if (/资金流|体外|循环|虚假/.test(text)) tips.push("补齐资金流与实物流证据，必要时延伸相关单位核实。");
  if (!tips.length) {
    tips.push("针对上述问题完善资料与内控，审计组复核后按程序写入报告或管理建议。");
  }
  // Prefer explicit suggestion sentences from conclusion
  const fromText = text
    .split(/[。；;]/)
    .map((s) => s.trim())
    .filter((s) => /建议|应|须|督促|限期|调账|补交|补齐/.test(s) && s.length > 6);
  if (fromText.length) return fromText.slice(0, 4);
  return tips.slice(0, 3);
}

function paperCardHtml(doc) {
  const issue = issueByTitle(doc.title);
  const methods = doc.methods || issue?.methods || [];
  const queries = doc.queries || issue?.queries || [];
  const findings = doc.findings || issue?.findings || [];
  const conclusion = doc.conclusion || issue?.conclusion || doc.opinion || "";
  const fact = doc.fact || issue?.fact || "";
  const law = doc.law || issue?.law || "";
  const materials = paperMaterialsFor(doc);
  const suggestions = paperSuggestFromDoc(doc, findings, conclusion);
  const hasProblem = findings.length > 0;
  const statusTag =
    doc.status === "已提交"
      ? "ok"
      : doc.status === "已退回"
        ? "risk"
        : doc.status === "草稿"
          ? "warn"
          : "doing";

  const processHtml = `
      <div class="audit-paper-sec">
        <b>（一）实施的程序与方法</b>
        ${
          methods.length
            ? `<ol class="audit-paper-ol">${methods.map((m, i) => `<li>${i + 1}. ${escapeHtml(m)}</li>`).join("")}</ol>`
            : `<p class="muted">（待补充）</p>`
        }
      </div>
      <div class="audit-paper-sec">
        <b>（二）查证过程与情况</b>
        <p class="audit-paper-fact">${escapeHtml(fact || "（待补充过程记录）")}</p>
      </div>
      <div class="audit-paper-sec">
        <b>（三）查询 / 取证记录</b>
        ${
          queries.length
            ? `<table class="audit-paper-sub">
                <thead><tr><th style="width:28%">项目</th><th>过程记录</th></tr></thead>
                <tbody>${queries
                  .map((q) => `<tr><td>${escapeHtml(q.name)}</td><td>${escapeHtml(q.result)}</td></tr>`)
                  .join("")}</tbody>
              </table>`
            : `<p class="muted">（待补充）</p>`
        }
      </div>`;

  const findingHtml = hasProblem
    ? `<ol class="audit-paper-ol">${findings
        .map((f, i) => `<li><b>问题 ${i + 1}：</b>${escapeHtml(f)}</li>`)
        .join("")}</ol>`
    : `<p class="muted">本次检查未发现需单列的问题。</p>`;

  const suggestHtml = hasProblem
    ? `<ol class="audit-paper-ol audit-paper-suggest">${suggestions
        .map((s, i) => `<li><b>建议 ${i + 1}：</b>${escapeHtml(s)}</li>`)
        .join("")}</ol>`
    : `<p class="muted">无问题，不单列审计建议。</p>`;

  const conclusionBody = hasProblem
    ? `<p class="audit-paper-conclusion">${escapeHtml(conclusion || "（待形成审计结论）")}</p>
       <div class="audit-paper-sec" style="margin-top:10px">
         <b>审计建议（针对发现问题）</b>
         ${suggestHtml}
       </div>`
    : `<p class="audit-paper-conclusion">${escapeHtml(
        conclusion || "经核查，本事项未见需报告的问题；过程记录见上。"
      )}</p>`;

  const attachHtml = `<ul class="audit-paper-ol">${materials
    .slice(0, 5)
    .map((m) => `<li>${escapeHtml(m)}</li>`)
    .join("")}</ul>`;

  return `<div class="audit-paper">
      <div class="audit-paper-title">审 计 工 作 底 稿</div>
      <div class="audit-paper-subhd">
        <span>企业预算执行审计</span>
        <span class="tag ${statusTag}">${escapeHtml(doc.status)}</span>
        ${hasProblem ? `<span class="tag risk">有问题 · 须写建议</span>` : `<span class="tag ok">未见单列问题</span>`}
      </div>
      <table class="audit-paper-meta">
        <tr>
          <th>底稿编号</th><td>${escapeHtml(doc.no)}</td>
          <th>索引号</th><td>${escapeHtml(doc.cat || "—")}／${escapeHtml(doc.no)}</td>
        </tr>
        <tr>
          <th>审计项目</th><td colspan="3">企业预算执行审计（2025 年度）</td>
        </tr>
        <tr>
          <th>被审计单位</th><td>${escapeHtml(doc.unit || "集团本部及相关下级单位")}</td>
          <th>审计事项</th><td>${escapeHtml(doc.title)}</td>
        </tr>
        <tr>
          <th>底稿目录</th><td>${escapeHtml(doc.cat || "—")}</td>
          <th>编制人</th><td>${escapeHtml(doc.owner || "—")}</td>
        </tr>
        <tr>
          <th>编制日期</th><td>${escapeHtml(doc.date || "2026-09-28")}</td>
          <th>复核人 / 日期</th><td>${escapeHtml(doc.reviewer || "（待复核）")}</td>
        </tr>
      </table>
      <table class="audit-paper-body">
        <tr>
          <th>一、过程记录</th>
          <td>${processHtml}</td>
        </tr>
        <tr>
          <th>二、审计发现问题</th>
          <td>${findingHtml}</td>
        </tr>
        <tr>
          <th>三、审计结论${hasProblem ? "<br />（含建议）" : ""}</th>
          <td>${conclusionBody}</td>
        </tr>
        <tr>
          <th>四、法规依据</th>
          <td>${escapeHtml(law || "（待引用法规条款）")}</td>
        </tr>
        <tr>
          <th>五、附件资料索引</th>
          <td>${attachHtml}</td>
        </tr>
      </table>
    </div>`;
}

function paperOpenHtml(doc) {
  const can = paperEditable(doc);
  if (!can) {
    return `已打开 ${doc.no}，但该底稿为 ${doc.owner} / ${doc.status}，不能修改。仍可查看指引与检查意见。
      ${paperCardHtml(doc)}
      ${paperDocActionsHtml(doc)}`;
  }
  paperState.mode = "edit";
  paperState.selectedId = doc.id;
  return `已打开您的${doc.status} ${doc.no}。可继续修改，或查看撰写指引 / 检查本底稿。
    ${paperCardHtml(doc)}
    ${paperDocActionsHtml(doc)}`;
}

function paperApplyEdit(doc, text) {
  const body = text.replace(/^(请|帮我|把)?/, "").trim();
  if (/法规|条款|依据/.test(text)) doc.law = body;
  else if (/意见|定性|结论/.test(text)) {
    doc.opinion = body;
    doc.conclusion = body;
  } else if (/事项|标题|名称/.test(text)) doc.title = body.replace(/^(事项|标题|名称)(改成|改为|为|是|:|：)?/, "").trim() || doc.title;
  else if (/目录/.test(text)) {
    const hit = PAPER_CATS.find((c) => text.includes(c.slice(3)) || text.includes(c));
    if (hit) doc.cat = hit;
  } else if (/事实|经过|情况/.test(text)) doc.fact = body;
  else {
    doc.opinion = body;
    doc.conclusion = body;
  }
}

function paperCreateFromText(text) {
  const first = text.split(/[。\n]/)[0].replace(/^(新增|新建)?(底稿)?(：|:)?/, "").trim() || "未命名事项";
  const title = first.slice(0, 24);
  const issue = issueByTitle(title);
  if (issue) return paperCreateFromIssue(issue);
  const doc = {
    id: `wg${paperSeq}`,
    no: `WG-${String(paperSeq).padStart(2, "0")}`,
    title,
    owner: CURRENT_AUDITOR,
    status: "草稿",
    cat: PAPER_CATS[4],
    methods: ["核对资料与账套", "抽凭或穿行", "对照法规给出结论"],
    queries: [{ name: "对话输入", result: text }],
    findings: [title],
    conclusion: `已记录事项「${title}」，待补充查询证据后确认问题。`,
    fact: text,
    law: "待对话补充法规依据。",
    opinion: `已记录事项「${title}」，待补充查询证据后确认问题。`,
  };
  paperSeq += 1;
  paperDocs.unshift(doc);
  paperState.mode = "edit";
  paperState.selectedId = doc.id;
  return doc;
}

function paperReplyHtml(text) {
  const raw = text.trim();
  const pendingId = paperState.pendingId;
  const pendingAction = paperState.pendingAction;
  paperState.pendingId = null;
  paperState.pendingAction = null;
  if (pendingId) {
    const doc = paperDocs.find((p) => p.id === pendingId);
    if (doc) {
      if (pendingAction === "guide") {
        paperState.selectedId = doc.id;
        return paperGuideHtml(doc);
      }
      if (pendingAction === "review") {
        paperState.selectedId = doc.id;
        return paperReviewHtml(doc);
      }
      return paperOpenHtml(doc);
    }
  }
  const pendingIssueId = paperState.pendingIssue;
  paperState.pendingIssue = null;
  if (pendingIssueId) {
    const issue = PAPER_ISSUES.find((x) => x.id === pendingIssueId);
    if (issue) {
      const doc = paperCreateFromIssue(issue);
      const n = (doc.findings || issue.findings || []).length;
      return `已按事项「${escapeHtml(issue.title)}」的程序方法完成查询，形成草稿 ${doc.no}。共查出 <b>${n}</b> 个问题。建议先看撰写指引，再检查定性。
        ${paperCardHtml(doc)}
        ${paperDocActionsHtml(doc)}`;
    }
  }
  if (/撰写指引|应该做什么|查什么|需要什么资料|怎么写底稿|指引/.test(raw)) {
    const doc = paperFindDoc(raw);
    if (doc) {
      paperState.selectedId = doc.id;
      return paperGuideHtml(doc);
    }
    return paperGuideHtml(null);
  }
  if (/检查底稿|检查本底稿|写的怎么样|评价资料|深度|范围|定性|描述是否准确|复核底稿|检查已写/.test(raw)) {
    const doc = paperFindDoc(raw);
    if (doc) {
      paperState.selectedId = doc.id;
      return paperReviewHtml(doc);
    }
    return paperReviewHtml(null);
  }
  if (/列出|已有底稿|底稿列表/.test(raw)) {
    paperState.mode = "list";
    paperState.selectedId = null;
    return paperListHtml();
  }
  if (/新增底稿|再新增|改为新增/.test(raw) || raw === "新增") {
    paperState.mode = "new";
    paperState.selectedId = null;
    return `好，用对话新增底稿。请直接说事项名称和事实要点，例如：「车站装修超概，缺 2 份变更审批」。我会写成 ${CURRENT_AUDITOR} 的草稿；完成后可点「撰写指引」「检查本底稿」。`;
  }
  const noHit = raw.match(/WG-\d+/i);
  const byNo = noHit ? paperDocs.find((p) => p.no.toUpperCase() === noHit[0].toUpperCase()) : null;
  if (byNo && !/指引|检查/.test(raw)) return paperOpenHtml(byNo);
  if (paperState.mode === "new") {
    const doc = paperCreateFromText(raw);
    return `已按您刚才说的内容写成草稿 ${doc.no}。可继续改事实、法规或意见，也可看指引 / 检查。
      ${paperCardHtml(doc)}
      ${paperDocActionsHtml(doc)}`;
  }
  if (paperState.mode === "edit" && paperState.selectedId && !/指引|检查|列表/.test(raw)) {
    const doc = paperDocs.find((p) => p.id === paperState.selectedId);
    if (doc) {
      paperApplyEdit(doc, raw);
      return `已按您的说明更新 ${doc.no}。
        ${paperCardHtml(doc)}
        ${paperDocActionsHtml(doc)}`;
    }
  }
  return `底稿智能体可协助：<b>撰写指引</b>（做什么、查什么、要什么资料）、<b>检查已写底稿</b>（撰写质量、资料深度范围、定性描述是否准确），以及对话新增/修改底稿。
    <div class="scheme-prompts" style="margin-top:10px">
      <button type="button" data-paper-prompt="guide">撰写指引</button>
      <button type="button" data-paper-prompt="review">检查已写底稿</button>
      <button type="button" data-paper-prompt="list">列出已有底稿</button>
    </div>
    ${paperListHtml()}`;
}

function seedPaperChat() {
  paperState.mode = "list";
  paperState.selectedId = null;
  paperState.pendingId = null;
  paperState.pendingIssue = null;
  paperState.pendingAction = null;
  msgs.innerHTML = `
    <div class="bubble ai">
      您好，欢迎使用<strong>底稿智能体</strong>。列表样式对齐发现取证：卡片上直接标出<strong>建议调整</strong>。也可点「撰写指引」「检查已写底稿」。
      <div class="scheme-prompts">
        <button type="button" data-paper-prompt="guide">撰写指引</button>
        <button type="button" data-paper-prompt="review">检查已写底稿</button>
        <button type="button" data-paper-prompt="list">刷新底稿列表</button>
      </div>
      <div class="result-block" style="margin-top:10px"><h4>底稿清单</h4>
        ${paperListHtml()}
      </div>
      <div class="cite">底稿智能体 · 建议调整 / 指引 / 检查</div>
    </div>`;
  msgs.scrollTop = 0;
}

/** 报告生成智能体：按项目底稿问题成稿，并检查报告内容完整性 */
const reportState = {
  started: false,
  tone: "safe",
  draftExported: false,
  /** @type {string[]} 已写入报告的底稿 id */
  includedIds: [],
};

function reportToneLabel() {
  return reportState.tone === "strong" ? "较强口径" : "稳妥口径";
}

function reportExtractAmount(text) {
  const m = String(text || "").match(/([\d,.]+)\s*万/);
  return m ? `${m[1]} 万` : "—";
}

/** 项目内底稿中的问题条目（有 findings 或问题性结论/事实） */
function reportPaperProblems() {
  return paperDocs
    .map((doc) => {
      const issue = issueByTitle(doc.title);
      const findings = doc.findings || issue?.findings || [];
      const fact = doc.fact || issue?.fact || "";
      const law = doc.law || issue?.law || "";
      // 报告正文用结论，不用 opinion（常为草稿备注/复核意见）
      const conclusion = doc.conclusion || issue?.conclusion || "";
      const methods = doc.methods || issue?.methods || [];
      const queries = doc.queries || issue?.queries || [];
      const body = `${findings.join("")}${fact}${conclusion}`;
      const hasProblem =
        findings.length > 0 ||
        /存疑|不完整|缺失|不合规|闲置|循环|超概|缺|未批|未闭环|形同虚设|虚假|体外/.test(body);
      if (!hasProblem) return null;
      const statusTag =
        doc.status === "已提交" ? "ok" : doc.status === "已退回" ? "risk" : doc.status === "草稿" ? "warn" : "doing";
      return {
        id: doc.id,
        no: doc.no,
        title: doc.title,
        owner: doc.owner,
        status: doc.status,
        statusTag,
        cat: doc.cat || issue?.cat || "—",
        findings,
        fact,
        law,
        conclusion,
        methods,
        queries,
        amount: reportExtractAmount(`${fact} ${conclusion} ${findings.join(" ")}`),
        suggest: paperSuggestFromDoc(doc, findings.length ? findings : [conclusion || doc.title], conclusion),
        ready: doc.status === "已提交" && !!(fact && law && (conclusion || findings.length)),
      };
    })
    .filter(Boolean)
    .sort((a, b) => String(a.no).localeCompare(String(b.no), "zh"));
}

function reportIncludedProblems() {
  const all = reportPaperProblems();
  if (!reportState.includedIds.length) return [];
  return all.filter((p) => reportState.includedIds.includes(p.id));
}

function reportPendingProblems() {
  const all = reportPaperProblems();
  if (!reportState.includedIds.length) return all;
  return all.filter((p) => !reportState.includedIds.includes(p.id));
}

/** 首次或汇集：默认写入已提交；生成报告时可纳入全部有问题底稿 */
function reportSyncFromPapers(opts = {}) {
  const { includeDraft = false, includeAll = false } = opts;
  const all = reportPaperProblems();
  reportState.includedIds = all
    .filter((p) => {
      if (includeAll) return true;
      if (p.status === "已提交") return true;
      if (includeDraft && (p.status === "草稿" || p.status === "已退回")) return true;
      return false;
    })
    .map((p) => p.id);
  return all;
}

/** 将底稿问题写成报告用语（不用「事实：/依据：」标签，不用草稿备注） */
function reportFindingNarrative(p) {
  let text = (p.conclusion || "").trim();
  if (!text || /^(建议定性|复核意见|组员草稿|已提交主审|待主审)/.test(text)) {
    const bits = [];
    if (p.fact) bits.push(p.fact.replace(/[。；;]+$/, ""));
    if (p.findings.length) bits.push(p.findings.join("；"));
    text = bits.join("。");
  }
  text = text.replace(/[。；;]+$/, "");
  if (!text) text = p.title;
  if (reportState.tone === "strong" && !/形同虚设|未批先变|严重|违反/.test(text)) {
    text = text.replace(/存疑/g, "存在较大疑点").replace(/不完整/g, "严重不完整");
  }
  return `${text}。`;
}

/** 事实段：优先 fact，避免与结论重复堆叠 */
function reportFindingFact(p) {
  const fact = (p.fact || "").trim().replace(/[。；;]+$/, "");
  if (fact) return `${fact}。`;
  if (p.findings.length) return `${p.findings.join("；")}。`;
  return "";
}

function reportMenuHtml() {
  return `<div class="scheme-prompts" style="margin-top:10px">
      <button type="button" data-report-prompt="complete">检查报告完整性</button>
      <button type="button" data-report-prompt="draft">生成审计报告</button>
      <button type="button" data-report-prompt="export">导出 Word 草稿</button>
    </div>`;
}

function reportFindingsTableHtml(list) {
  const items = list || reportPaperProblems();
  if (!items.length) return `<p class="muted">项目内底稿暂未识别到问题条目。</p>`;
  const rows = items
    .map((f) => {
      const inR = reportState.includedIds.includes(f.id);
      return `<tr>
      <td>${escapeHtml(f.no)}</td>
      <td>${escapeHtml(f.title)}</td>
      <td>${escapeHtml(f.owner)}</td>
      <td>${escapeHtml(f.amount)}</td>
      <td><span class="tag ${f.statusTag}">${escapeHtml(f.status)}</span></td>
      <td>${inR ? `<span class="tag ok">已入报告</span>` : `<span class="tag risk">未入报告</span>`}</td>
    </tr>`;
    })
    .join("");
  return `<table>
      <thead><tr><th>底稿</th><th>问题事项</th><th>编制人</th><th>金额</th><th>底稿状态</th><th>入报告</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

/** 单条问题：沿用原先（一）（二）… + 查明事实的展示方式 */
function reportItemBlockHtml(p, idx) {
  const n = ["（一）", "（二）", "（三）", "（四）", "（五）", "（六）", "（七）", "（八）", "（九）", "（十）"][idx] || `（${idx + 1}）`;
  const fact = reportFindingFact(p);
  const conclusion = reportFindingNarrative(p);
  const same =
    fact &&
    conclusion &&
    (conclusion.includes(fact.replace(/。$/, "").slice(0, 18)) || fact.includes(conclusion.replace(/。$/, "").slice(0, 18)));
  const amt = p.amount !== "—" ? `<span class="ar-amt">涉及金额 ${escapeHtml(p.amount)}</span>。` : "";
  const body = same
    ? `<p class="ar-p">经审计查明，${escapeHtml(conclusion.replace(/^经审计查明，/, "").replace(/。$/, ""))}。${amt}</p>`
    : `${
        fact
          ? `<p class="ar-p">经审计查明，${escapeHtml(fact.replace(/。$/, ""))}。${amt}</p>`
          : ""
      }<p class="ar-p">${escapeHtml(conclusion)}</p>`;
  return `<div class="ar-item">
      <div class="ar-item-hd">${n}${escapeHtml(p.title)}</div>
      ${body}
      <p class="ar-ref">取证底稿：${escapeHtml(p.no)}${p.law ? `；制度 / 法规参考：${escapeHtml(p.law)}` : ""}</p>
    </div>`;
}

function reportDraftBodyHtml() {
  const items = reportIncludedProblems();
  const today = "2026年3月28日";

  const findingHtml =
    items.length > 0
      ? items.map((p, i) => reportItemBlockHtml(p, i)).join("")
      : `<p class="ar-p">本次审计未汇集到可写入报告的底稿问题。</p>`;

  const suggestItems = items.filter((p) => (p.suggest && p.suggest.length) || /建议|应|须/.test(p.conclusion || ""));
  const suggestHtml =
    suggestItems.length > 0
      ? suggestItems
          .map((p, i) => {
            const tip = (p.suggest && p.suggest[0]) || p.conclusion || "完善相关管理与内控，按程序整改并反馈。";
            return `<p class="ar-p">（${["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][i] || i + 1}）针对「${escapeHtml(
              p.title
            )}」：${escapeHtml(String(tip).replace(/[。；;]+$/, ""))}。</p>`;
          })
          .join("")
      : `<p class="ar-p">请对照本报告第三部分问题，制定整改计划并明确责任单位与时限。</p>`;

  return `<article class="audit-report-doc">
      <p class="ar-org">审计智能应用 · 企业预算执行审计</p>
      <h2 class="ar-title">审 计 报 告</h2>
      <p class="ar-subtitle">关于 XX 集团 2025 年度企业预算执行情况的审计报告</p>
      <div class="ar-meta">
        <span>被审计单位：XX 集团</span>
        <span>审计期间：2025 年度</span>
        <span>报告状态：草稿</span>
        <span>问题 ${items.length} 项</span>
      </div>
      <p class="ar-to">XX 集团：</p>
      <p class="ar-p">根据年度审计计划和集团内部审计工作安排，审计组对你单位 2025 年度企业预算执行情况进行了审计。现将审计情况报告如下：</p>

      <h3 class="ar-h">一、基本情况</h3>
      <p class="ar-p">XX 集团为市属国有企业，实行全面预算管理。本次审计范围覆盖集团本部及重点所属单位 2025 年 1 月 1 日至 12 月 31 日预算执行相关业务，重点关注预算调剂与批复、重点费用支出、采购与合同履约、工程变更及内控缺陷整改等事项。审计组查阅了预算文件、财务账套、合同与付款凭证、工程签证及内控评价资料，并结合数据分析、访谈与穿行测试，重要问题已形成工作底稿。</p>

      <h3 class="ar-h">二、履行经济责任所做的主要工作和总体评价</h3>
      <p class="ar-p">审计期间，被审计单位围绕年度经营与预算目标推进预算分解下达、重点项目执行与内控自评等工作，预算管理框架总体建立，预算执行总体受控。同时，在重点费用真实性、预算调剂程序、工程变更审批、采购履约控制及内控缺陷闭环等方面仍存在薄弱环节。综合底稿问题 ${items.length} 项，审计认为：预算约束与执行监督需进一步压实，相关问题应限期整改并完善长效机制。</p>

      <h3 class="ar-h">三、审计发现的主要问题和责任认定</h3>
      ${findingHtml}

      <h3 class="ar-h">四、审计建议<span class="ar-h-note">（审计建议应与前述审计问题相对应）</span></h3>
      ${suggestHtml}

      <div class="ar-sign">
        <div><b>审计组</b></div>
        <div>主审：hong</div>
        <div>${today}</div>
      </div>
      <div class="ar-attach">
        <b>附件：问题清册</b>
        ${reportFindingsTableHtml(items)}
      </div>
    </article>`;
}

/** 检查报告内容完整性：对照底稿问题覆盖 + 要素齐备 */
function reportCompletenessCheck() {
  const all = reportPaperProblems();
  const included = reportIncludedProblems();
  const pending = reportPendingProblems();
  const issues = [];
  const oks = [];

  if (!all.length) {
    issues.push({ level: "warn", tag: "无问题源", text: "项目底稿中未识别到问题，无法成稿。请先在底稿智能体确认问题。" });
  } else {
    oks.push({ level: "ok", tag: "底稿源", text: `已从项目 ${paperDocs.length} 份底稿识别问题 ${all.length} 条。` });
  }

  if (pending.length) {
    issues.push({
      level: "risk",
      tag: "覆盖不全",
      text: `有 ${pending.length} 条底稿问题未入报告：${pending.map((p) => `${p.no}「${p.title}」`).join("、")}。`,
    });
  } else if (all.length) {
    oks.push({ level: "ok", tag: "覆盖完整", text: "已识别底稿问题均已写入报告。" });
  }

  const notReady = included.filter((p) => p.status === "草稿" || p.status === "已退回");
  if (notReady.length) {
    issues.push({
      level: "warn",
      tag: "底稿未定稿",
      text: `${notReady.map((p) => p.no).join("、")} 仍为草稿/已退回，入报告风险较高，建议先闭环底稿。`,
    });
  }

  included.forEach((p) => {
    if (!p.fact || p.fact.length < 20) {
      issues.push({ level: "warn", tag: "缺事实", text: `${p.no} 事实描述偏短或不完整。` });
    }
    if (!p.law || /待对话|待补充/.test(p.law)) {
      issues.push({ level: "risk", tag: "缺法规", text: `${p.no} 定性缺法规/制度依据。` });
    } else {
      oks.push({ level: "ok", tag: "有依据", text: `${p.no} 已挂法规引用。` });
    }
    if (!p.conclusion && !p.findings.length) {
      issues.push({ level: "warn", tag: "缺结论", text: `${p.no} 缺少审计结论或问题表述。` });
    }
    if (p.findings.length && !(p.suggest && p.suggest.length) && !/建议|应|须/.test(p.conclusion || "")) {
      issues.push({ level: "warn", tag: "缺处理意见", text: `${p.no} 有问题但缺整改/处理意见。` });
    }
  });

  if (included.length && !issues.some((x) => x.tag === "缺处理意见")) {
    const withSug = included.filter((p) => (p.suggest && p.suggest.length) || /建议|应|须/.test(p.conclusion || ""));
    if (withSug.length === included.length && included.length) {
      oks.push({ level: "ok", tag: "建议齐", text: "已入报告问题均有处理/整改意见可落。" });
    }
  }

  if (!included.length && all.length) {
    issues.push({ level: "risk", tag: "报告空", text: "尚未从底稿写入任何问题，请先「从底稿汇集问题」。" });
  }

  // Deduplicate ok noise — keep at most 4 oks, all issues
  return { all, included, pending, issues, oks: oks.slice(0, 5) };
}

function reportCompletenessHtml() {
  const c = reportCompletenessCheck();
  const score =
    c.all.length === 0 ? 0 : Math.max(0, Math.round(((c.all.length - c.pending.length) / c.all.length) * 100 - c.issues.length * 8));
  const scoreClamped = Math.min(100, Math.max(0, score));
  const list = (arr) =>
    arr.length
      ? `<ul class="finding-ev-need">${arr
          .map((h) => `<li><span class="tag ${h.level}">${escapeHtml(h.tag)}</span> ${escapeHtml(h.text)}</li>`)
          .join("")}</ul>`
      : `<p class="muted">无</p>`;
  return `<div class="result-block"><h4>报告完整性检查</h4>
      对照<strong>项目内底稿问题</strong>核对覆盖与要素。完整度约 <b>${scoreClamped}%</b>
      （问题 ${c.all.length} · 已入 ${c.included.length} · 未入 ${c.pending.length} · 待改 ${c.issues.length}）
    </div>
    <div class="result-block finding-ev-docs-tip paper-adjust-tip ${c.issues.length ? "has-adjust" : ""}">
      <div class="finding-ev-docs-tip-hd"><span class="tag ${c.issues.length ? "risk" : "ok"}">${c.issues.length ? "待补齐" : "已完整"}</span><strong>${c.issues.length || c.oks.length} 项</strong></div>
      ${c.issues.length ? list(c.issues) : list(c.oks)}
    </div>
    ${c.oks.length && c.issues.length ? `<div class="result-block"><h4>已通过项</h4>${list(c.oks)}</div>` : ""}
    <div class="scheme-prompts">
      <button type="button" data-report-prompt="include">写入未入报告问题</button>
      <button type="button" data-report-prompt="draft">生成审计报告</button>
    </div>`;
}

function reportStatsLine() {
  const all = reportPaperProblems();
  const inR = reportState.includedIds.filter((id) => all.some((p) => p.id === id)).length;
  const pending = Math.max(0, all.length - inR);
  const c = reportCompletenessCheck();
  return `底稿问题 ${all.length} · 已入报告 ${inR} · 未入 ${pending} · 定性 ${reportToneLabel()}${
    c.issues.length ? ` · 完整性待补 ${c.issues.length}` : " · 完整性通过"
  }${reportState.draftExported ? " · 已导出草稿" : ""}`;
}

function seedReportChat() {
  reportState.started = true;
  if (!reportState.includedIds.length) reportSyncFromPapers({ includeDraft: true });
  const all = reportPaperProblems();
  const pending = reportPendingProblems();
  msgs.innerHTML = `
    <div class="bubble ai">
      您好，欢迎使用<strong>报告生成智能体</strong>。可按<strong>项目内底稿问题</strong>自动汇集成审计报告，并<strong>检查报告内容完整性</strong>（覆盖是否漏项、事实/法规/结论/处理意见是否齐）。
      ${reportMenuHtml()}
      <div class="result-block" style="margin-top:10px"><h4>本阶段概览</h4>${reportStatsLine()}
        <p style="margin:8px 0 0;font-size:12px;color:var(--muted)">已默认识别项目底稿问题 ${all.length} 条，写入已提交底稿 ${reportState.includedIds.length} 条${
          pending.length ? `；另有 ${pending.length} 条草稿/退回未入，可检查完整性后补入。` : "。"
        }</p>
      </div>
      <div class="cite">报告生成 · 底稿问题 → 成稿 → 完整性检查</div>
    </div>`;
  msgs.scrollTop = 0;
}

function reportReplyHtml(text) {
  const raw = (text || "").trim();

  if (/从底稿|汇集问题|同步底稿|按底稿/i.test(raw) || raw === "从底稿汇集问题") {
    reportSyncFromPapers({ includeDraft: false });
    const pending = reportPendingProblems();
    return `已从项目底稿汇集问题：写入已提交底稿 <b>${reportState.includedIds.length}</b> 条${
      pending.length ? `；草稿/退回 ${pending.length} 条暂未入报告` : ""
    }。
      <div class="result-block" style="margin-top:10px"><h4>问题清册（底稿来源）</h4>${reportFindingsTableHtml()}</div>
      <div class="scheme-prompts">
        <button type="button" data-report-prompt="include">写入未入报告问题</button>
        <button type="button" data-report-prompt="include-all">全部底稿问题写入</button>
        <button type="button" data-report-prompt="complete">检查报告完整性</button>
      </div>
      ${reportMenuHtml()}`;
  }

  if (/问题清册|发现清册|发现清单|清册/i.test(raw) || raw === "问题清册" || raw === "发现清册") {
    return `以下问题来自<strong>项目内底稿</strong>（${paperDocs.length} 份），并标注是否已入报告。
      <div class="result-block" style="margin-top:10px"><h4>问题清册</h4>${reportFindingsTableHtml()}</div>
      ${reportMenuHtml()}`;
  }

  if (/完整性|检查报告|漏写|还有哪些|覆盖/i.test(raw) || raw === "检查报告完整性" || raw === "问题完整性") {
    return `已对照项目底稿问题检查报告内容完整性。
      ${reportCompletenessHtml()}
      ${reportMenuHtml()}`;
  }

  if (/全部底稿问题写入|全部写入/i.test(raw) || raw === "全部底稿问题写入") {
    reportSyncFromPapers({ includeAll: true });
    return `已将项目内全部底稿问题写入报告骨架（含草稿/退回，请留意定稿风险）。
      <div class="result-block"><h4>更新后清册</h4>${reportFindingsTableHtml()}</div>
      ${reportCompletenessHtml()}
      ${reportMenuHtml()}`;
  }

  if (/写入未入|补入报告|纳入报告/i.test(raw) || raw === "写入未入报告问题" || raw === "写入未入报告发现") {
    const before = reportPendingProblems().map((p) => p.no);
    reportSyncFromPapers({ includeAll: true });
    return `已将未入报告的底稿问题写入：${before.length ? before.join("、") : "无新增"}。
      <div class="result-block"><h4>更新后清册</h4>${reportFindingsTableHtml()}</div>
      ${reportMenuHtml()}`;
  }

  if (/稳妥口径|应用稳妥/i.test(raw) || raw === "应用稳妥口径") {
    reportState.tone = "safe";
    if (!reportState.includedIds.length) reportSyncFromPapers({ includeAll: true });
    return `已按稳妥口径更新表述。
      ${reportDraftBodyHtml()}
      ${reportMenuHtml()}`;
  }

  if (/较强口径|应用较强|强硬/i.test(raw) || raw === "应用较强口径") {
    reportState.tone = "strong";
    if (!reportState.includedIds.length) reportSyncFromPapers({ includeAll: true });
    return `已按较强口径更新表述。
      ${reportDraftBodyHtml()}
      ${reportMenuHtml()}`;
  }

  if (/润色|定性|口径/i.test(raw) || raw === "润色定性") {
    return `报告正文为审计发现（按底稿结论成稿）。可直接生成审计报告查看全文。
      <div class="scheme-prompts">
        <button type="button" data-report-prompt="draft">生成审计报告</button>
      </div>
      ${reportMenuHtml()}`;
  }

  if (/整改|建议整改|管理建议/i.test(raw) || raw === "整改建议") {
    return `当前报告草稿以审计发现为主，不再单列整改建议。可生成审计报告查看全文。
      <div class="scheme-prompts">
        <button type="button" data-report-prompt="draft">生成审计报告</button>
      </div>
      ${reportMenuHtml()}`;
  }

  if (/闭合|缺口|法规引用|取证单编号/i.test(raw) || raw === "闭合缺口") {
    return `请用「检查报告完整性」对照底稿核对覆盖与要素；缺法规/结论的条目需回底稿智能体补齐。
      ${reportCompletenessHtml()}
      ${reportMenuHtml()}`;
  }

  if (/生成报告|报告草稿|审计报告|一、审计/i.test(raw) || raw === "生成审计报告" || raw === "生成报告草稿") {
    reportSyncFromPapers({ includeAll: true });
    return `已按项目底稿问题生成审计报告草稿。
      ${reportDraftBodyHtml()}
      ${reportMenuHtml()}`;
  }

  if (/导出|Word|word|下载草稿/i.test(raw) || raw === "导出 Word 草稿") {
    const c = reportCompletenessCheck();
    if (c.issues.length) {
      return `导出前完整性检查未通过（${c.issues.length} 项）。建议先补齐再导出。
        ${reportCompletenessHtml()}
        <div class="scheme-prompts">
          <button type="button" data-report-prompt="force-export">仍要导出</button>
        </div>
        ${reportMenuHtml()}`;
    }
    reportState.draftExported = true;
    return `已导出 Word 草稿（示意）：<b>XX集团2025企业预算执行审计报告_草稿.docx</b>
      <div class="result-block"><h4>含</h4>审计发现（底稿 ${reportIncludedProblems()
        .map((p) => p.no)
        .join("、")}）· 问题清册附件</div>
      <div class="scheme-prompts">
        <button type="button" data-scene="fieldpack">并入项目资料</button>
        <button type="button" data-scene="paper">回底稿智能体</button>
        <button type="button" data-scene="cockpit">回项目工作台</button>
      </div>
      ${reportMenuHtml()}`;
  }

  if (/仍要导出|强制导出/i.test(raw) || raw === "仍要导出") {
    reportState.draftExported = true;
    return `已按当前底稿问题导出 Word 草稿（完整性未完全通过，正文已标注待补项）。
      <div class="cite">文件 · XX集团2025企业预算执行审计报告_草稿.docx</div>
      ${reportMenuHtml()}`;
  }

  return `可从<strong>项目底稿问题</strong>汇集成审计报告，并检查内容完整性（是否漏写底稿问题、事实/法规/结论/处理意见是否齐）。
    <p style="margin:8px 0 0;font-size:12px;color:var(--muted)">${reportStatsLine()}</p>
    ${reportMenuHtml()}`;
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
  icmatrix: { title: "内控矩阵", hint: "导入手册与制度，抽取控制域和控制点。" },
};

/** 项目资料：对话管理资料清单、缺件催收、提纲与整改通知 */
const fieldpackState = {
  started: false,
  exported: false,
  remindSent: false,
  openList: false,
};

const FIELDPACK_DOCS = [
  { name: "组织架构与人员编制表", status: "已齐", tag: "ok", cat: "基础" },
  { name: "近三年预算批复与调整文件", status: "已齐", tag: "ok", cat: "预算" },
  { name: "科目明细账 / 凭证抽样包", status: "已齐", tag: "ok", cat: "财务" },
  { name: "在建项目台账与概算批复", status: "部分", tag: "warn", cat: "工程" },
  { name: "招标文件 / 中标通知 / 合同", status: "已齐", tag: "ok", cat: "采购" },
  { name: "变更签证与监理日志", status: "缺件", tag: "risk", cat: "工程" },
  { name: "信息化运维成果物与验收", status: "缺件", tag: "risk", cat: "采购" },
  { name: "内控自评底稿与整改台账", status: "部分", tag: "warn", cat: "内控" },
];

function fieldpackMenuHtml() {
  return `<div class="scheme-prompts" style="margin-top:10px">
      <button type="button" data-fieldpack-prompt="list">资料清单</button>
      <button type="button" data-fieldpack-prompt="gap">缺件催收</button>
      <button type="button" data-fieldpack-prompt="outline">访谈提纲</button>
      <button type="button" data-fieldpack-prompt="minutes">会议纪要待办</button>
      <button type="button" data-fieldpack-prompt="rectify">整改通知</button>
      <button type="button" data-fieldpack-prompt="export">导出资料</button>
    </div>`;
}

function fieldpackListHtml() {
  const rows = FIELDPACK_DOCS.map(
    (d) => `<tr>
      <td>${escapeHtml(d.cat)}</td>
      <td>${escapeHtml(d.name)}</td>
      <td><span class="tag ${d.tag}">${escapeHtml(d.status)}</span></td>
    </tr>`
  ).join("");
  return `<table>
      <thead><tr><th>类别</th><th>资料名称</th><th>状态</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function fieldpackGapList() {
  return FIELDPACK_DOCS.filter((d) => d.status !== "已齐");
}

function fieldpackStatsLine() {
  const ok = FIELDPACK_DOCS.filter((d) => d.status === "已齐").length;
  const gap = fieldpackGapList().length;
  return `资料 ${FIELDPACK_DOCS.length} 项 · 已齐 ${ok} · 缺件/部分 ${gap}${fieldpackState.remindSent ? " · 已发催收" : ""}${fieldpackState.exported ? " · 已导出" : ""}`;
}

function seedFieldpackChat() {
  fieldpackState.started = true;
  const openList = !!fieldpackState.openList;
  fieldpackState.openList = false;
  const listBlock = openList
    ? `<div class="result-block" style="margin-top:10px"><h4>资料清单</h4>${fieldpackListHtml()}</div>`
    : `<div class="result-block" style="margin-top:10px"><h4>本阶段概览</h4>${fieldpackStatsLine()}
        <p style="margin:8px 0 0;font-size:12px;color:var(--muted)">面向 XX 集团 2025 企业预算执行审计 · 住建延伸 / 工程与内控资料一并管理。</p>
      </div>`;
  msgs.innerHTML = `
    <div class="bubble ai">
      您好，欢迎使用<strong>项目资料</strong>。${openList ? "已直接打开资料清单：" : "可对话查看资料清单、催收缺件、生成访谈提纲与整改通知，并导出发给被审计单位。"}
      ${fieldpackMenuHtml()}
      ${listBlock}
      <div class="cite">项目资料 · 清单 / 缺件 / 提纲 / 导出</div>
    </div>`;
  msgs.scrollTop = 0;
}

function fieldpackReplyHtml(text) {
  const raw = (text || "").trim();

  if (/资料清单|清单|有哪些资料|资料目录/i.test(raw) || raw === "资料清单") {
    return `当前项目资料清单如下。
      <div class="result-block" style="margin-top:10px"><h4>资料清单</h4>${fieldpackListHtml()}</div>
      ${fieldpackMenuHtml()}`;
  }

  if (/缺件|催收|缺口|未齐|补齐/i.test(raw) || raw === "缺件催收") {
    const gap = fieldpackGapList();
    fieldpackState.remindSent = true;
    return `已识别缺件 / 部分齐备 <b>${gap.length}</b> 项，并生成催收口径（示意已同步催收清单）。
      <div class="result-block"><h4>缺件催收</h4>
        ${gap.map((d) => `· ${escapeHtml(d.name)}（${escapeHtml(d.status)}）`).join("<br />")}
      </div>
      <div class="result-block"><h4>催收说明</h4>请于 5 个工作日内补交上述资料原件或扫描件；变更签证与运维成果物为重点催收项。</div>
      ${fieldpackMenuHtml()}`;
  }

  if (/访谈提纲|提纲/i.test(raw) || raw === "访谈提纲") {
    return `已按项目资料与延伸对象生成访谈提纲。
      <div class="result-block"><h4>访谈提纲（信息公司 / 内控评价）</h4>
        1. 内控自评缺陷 11 项未整改原因与责任人；<br />
        2. 采购授权链条与验收控制；<br />
        3. 专项资金闲置与绩效监控闭环情况。
      </div>
      <div class="result-block"><h4>访谈提纲（建设公司 / 工程）</h4>
        1. 车站装修变更超概审批路径；<br />
        2. 签证与监理日志日期矛盾说明；<br />
        3. 概算调整与付款依据交叉核对。
      </div>
      <div class="scheme-prompts">
        <button type="button" data-scene="interview">去访谈智能体</button>
      </div>
      ${fieldpackMenuHtml()}`;
  }

  if (/会议纪要|纪要|待办/i.test(raw) || raw === "会议纪要待办") {
    return `已汇集与项目资料相关的访谈 / 会议纪要要点。
      <div class="result-block"><h4>访谈 / 会议纪要</h4>
        城投建设公司工程部称车站装修变更为现场签证、审批「事后补」，与监理日志日期矛盾 3 处。
      </div>
      <div class="result-block"><h4>待办</h4>
        · 补调变更审批单；<br />
        · 与预算安排及付款依据交叉；<br />
        · 催收运维成果物与验收记录。
      </div>
      <div class="scheme-prompts">
        <button type="button" data-view="app-meeting">打开会议纪要分析</button>
      </div>
      ${fieldpackMenuHtml()}`;
  }

  if (/整改通知|整改/i.test(raw) || raw === "整改通知") {
    return `已形成整改通知草稿（可并入资料一并发给被审计单位）。
      <div class="result-block"><h4>整改通知草稿</h4>
        就超概变更未履行审批、运维成果物缺失两项，要求 <b>15 个工作日内</b>书面说明并补证；逾期未反馈的，审计组将在报告中如实反映。
      </div>
      ${fieldpackMenuHtml()}`;
  }

  if (/导出|下载|打包/i.test(raw) || raw === "导出资料") {
    fieldpackState.exported = true;
    return `已导出项目资料（示意）：<b>XX集团2025企业预算执行_项目资料.zip</b>
      <div class="result-block"><h4>含</h4>资料清单 · 缺件催收单 · 访谈提纲 · 会议纪要待办 · 整改通知草稿</div>
      <div class="scheme-prompts">
        <button type="button" data-scene="survey">回审前调查</button>
        <button type="button" data-scene="cockpit">回项目工作台</button>
      </div>
      ${fieldpackMenuHtml()}`;
  }

  return `可在对话中管理<strong>项目资料</strong>：查看清单、催收缺件、生成提纲与整改通知并导出。
    <p style="margin:8px 0 0;font-size:12px;color:var(--muted)">${fieldpackStatsLine()}</p>
    ${fieldpackMenuHtml()}`;
}

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
      <div class="file"><span>预算单位与指标库</span><span class="tag warn">部分</span></div>
      <h3 style="margin-top:16px">入选口径</h3>
      <p style="font-size:12px;color:var(--muted);line-height:1.6;">每家单位写清为什么审：工程看超概与签证，专项看资金闲置和虚假贸易，安全看高危与外包，预算执行看调剂与重点支出，内控评价看缺陷未整改。</p>
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
      <button class="btn sm" type="button" data-scene="cockpit">回项目工作台</button>
      <button class="btn ghost sm" type="button" data-scene="evidence">打开证据链</button>`;
  }
  if (scene === "fieldpack") {
    const ok = FIELDPACK_DOCS.filter((d) => d.status === "已齐").length;
    const gap = fieldpackGapList().length;
    return `<h3>项目资料</h3>
      <div class="chip-row"><span class="tag doing">对话模式</span><span class="tag ok">已齐 ${ok}</span><span class="tag risk">缺件/部分 ${gap}</span>${fieldpackState.exported ? `<span class="tag ok">已导出</span>` : ""}</div>
      <p style="font-size:12px;color:var(--muted);line-height:1.6;margin:0 0 10px;">资料清单、缺件催收、访谈提纲与整改通知，可对话导出发给被审计单位。</p>
      <button class="btn sm" type="button" data-fieldpack-prompt="list">资料清单</button>
      <button class="btn ghost sm" type="button" data-fieldpack-prompt="gap">缺件催收</button>
      <button class="btn ghost sm" type="button" data-fieldpack-prompt="export">导出资料</button>`;
  }
  if (scene === "scheme") {
    return `<h3>编制依据</h3>
      <div class="chip-row"><span class="tag doing">方案检查</span><span class="tag ai">完整性 / 分工</span>${detectChip}</div>
      <div class="file"><span>审前调查报告.docx</span><span class="tag ok">已引用</span></div>
      <div class="file"><span>项目资料（批复/账套/合同）</span><span class="tag warn">部分缺口</span></div>
      <div class="file"><span>实施方案 v1.2</span><span class="tag doing">编写中</span></div>
      <p style="font-size:12px;color:var(--muted);line-height:1.6;margin:10px 0;">方案检查两项：编制完整性（章节/内容/方法/进度要素）与分工冲突。</p>
      <button class="btn sm" type="button" data-scene="survey">打开审前调查</button>
      <button class="btn ghost sm" type="button" data-scene="cockpit">回项目工作台</button>`;
  }
  if (scene === "survey") {
    return `<h3>调查材料</h3>
      <div class="chip-row"><span class="tag doing">对话模式</span><span class="tag ok">已完成</span>${detectChip}</div>
      <div class="file"><span>被审计单位资料</span><span class="tag ok">${SURVEY_MATERIALS.length} 项</span></div>
      <div class="file"><span>被审单位企业画像</span><span class="tag ok">已生成</span></div>
      <div class="file"><span>调查大纲</span><span class="tag ${surveyState.outlineGenerated ? "ok" : "warn"}">${surveyState.outlineGenerated ? "已生成" : "待生成"}</span></div>
      <div class="file"><span>审前调查记录</span><span class="tag ok">${SURVEY_RECORDS.length} 条</span></div>
      <div class="file"><span>调查问卷</span><span class="tag warn">${SURVEY_QUESTIONNAIRES.length} 套</span></div>
      <div class="file"><span>调查报告（含疑点）</span><span class="tag ${surveyState.reportGenerated ? "ok" : "warn"}">${surveyState.reportGenerated ? "已生成" : "待生成"}</span></div>
      <h3 style="margin-top:16px">可执行动作</h3>
      <button class="btn sm" type="button" data-scene="fieldpack">打开项目资料</button>
      <button class="btn ghost sm" type="button" data-scene="scheme">进入方案制定</button>`;
  }
  if (scene === "draft") {
    const nPending = FINDING_EVIDENCE.filter((x) => x.feedback === "pending").length;
    const nDone = FINDING_EVIDENCE.filter((x) => x.feedback === "done").length;
    const nOpinion = FINDING_EVIDENCE.filter((x) => x.feedback === "done" && x.opinion).length;
    const nOverdue = FINDING_EVIDENCE.filter((x) => findingEvIsOverdue(x)).length;
    const nSent = FINDING_EVIDENCE.filter((x) => x.evidenced).length;
    return `<h3>发现取证智能体</h3>
      <div class="chip-row"><span class="tag doing">发现 ${FINDING_EVIDENCE.length}</span><span class="tag doing">已发送取证单 ${nSent}</span><span class="tag risk">取证资料不全 ${FINDING_EVIDENCE.filter((x) => x.evidenced && findingEvDocsIncomplete(x)).length}</span><span class="tag warn">待反馈 ${nPending}</span><span class="tag risk">超期未反馈 ${nOverdue}</span><span class="tag ok">已反馈 ${nDone}</span><span class="tag risk">有异议 ${nOpinion}</span></div>
      <p style="font-size:12px;color:var(--muted);line-height:1.6;margin:10px 0;">有异议、超期未反馈、取证资料不全会提示；未发送取证单的发现可修改后再撰写发送。</p>
      <button class="btn sm" type="button" data-draft-ask-write>协助撰写取证单</button>
      <button class="btn ghost sm" type="button" data-scene="doubt">回审计指引</button>
      <button class="btn ghost sm" type="button" data-scene="paper">编写底稿</button>`;
  }
  if (scene === "interview") {
    const n = interviewState.files.length;
    return `<h3>访谈智能体</h3>
      <div class="chip-row"><span class="tag doing">对话模式</span><span class="tag doing">企业预算执行</span><span class="tag ${n ? "ok" : "warn"}">结果文件 ${n}</span></div>
      <p style="font-size:12px;color:var(--muted);line-height:1.6;margin:0 0 10px;">可起草提纲、转写纪要、提取待办，并形成访谈结果文件（Word 示意）。</p>
      <h3>已形成文件</h3>
      ${n ? interviewFilesListHtml() : `<div class="file"><span>暂无结果文件</span><span class="tag warn">待形成</span></div>`}
      <button class="btn sm" type="button" data-interview-prompt="result">形成访谈结果文件</button>
      <button class="btn ghost sm" type="button" data-interview-prompt="files">查看文件</button>
      <button class="btn ghost sm" type="button" data-scene="draft">去发现取证智能体</button>`;
  }
  if (scene === "paper") {
    const mine = myDraftPapers();
    return `<h3>底稿智能体</h3>
      <div class="chip-row"><span class="tag doing">对话模式</span><span class="tag doing">企业预算执行</span><span class="tag warn">可改草稿 ${mine.length}</span></div>
      <p style="font-size:12px;color:var(--muted);line-height:1.6;margin:0 0 10px;">撰写指引：做什么、查什么、要什么资料；检查已写：撰写质量、资料深度范围、定性描述是否准确。</p>
      <button class="btn sm" type="button" data-paper-prompt="guide">撰写指引</button>
      <button class="btn ghost sm" type="button" data-paper-prompt="review">检查已写底稿</button>
      <button class="btn ghost sm" type="button" data-scene="draft">发现取证智能体</button>`;
  }
  if (scene === "report") {
    const all = reportPaperProblems();
    const inR = reportState.includedIds.filter((id) => all.some((p) => p.id === id)).length;
    const pending = Math.max(0, all.length - inR);
    const c = reportCompletenessCheck();
    return `<h3>报告生成智能体</h3>
      <div class="chip-row"><span class="tag doing">对话模式</span><span class="tag ok">底稿问题 ${all.length}</span><span class="tag ok">已入 ${inR}</span><span class="tag risk">未入 ${pending}</span><span class="tag">${reportToneLabel()}</span>${c.issues.length ? `<span class="tag risk">完整性 ${c.issues.length}</span>` : `<span class="tag ok">完整性通过</span>`}</div>
      <p style="font-size:12px;color:var(--muted);line-height:1.6;margin:0 0 10px;">按项目底稿问题成稿；检查覆盖、事实、法规、结论与处理意见是否齐全。</p>
      <button class="btn sm" type="button" data-report-prompt="draft">生成审计报告</button>
      <button class="btn ghost sm" type="button" data-report-prompt="complete">检查报告完整性</button>
      <button class="btn ghost sm" type="button" data-report-prompt="export">导出 Word</button>`;
  }
  if (scene === "cockpit" || COCKPIT[scene]) {
    return `<h3>工作台状态</h3>
      <div class="chip-row"><span class="tag doing">对话模式</span><span class="tag doing">现场实施</span>${detectChip}<span class="tag">主审 hong</span></div>
      <h3>阶段产出</h3>
      <div class="file"><span>审前调查报告</span><span class="tag ok">已生成</span></div>
      <div class="file"><span>实施方案 v1.2</span><span class="tag ok">已生成</span></div>
      <div class="file"><span>审计指引单</span><span class="tag warn">6 条待核</span></div>
      <h3 style="margin-top:16px">可执行动作</h3>
      <button class="btn sm" type="button" data-scene="doubt">打开审计指引</button>
      <button class="btn ghost sm" type="button" data-scene="fieldpack" data-open-docs="1">打开项目资料</button>
      <button class="btn ghost sm" type="button" data-scene="paper">编写底稿</button>`;
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
    complete: "report",
    sample: "talkdata",
  };
  scene = alias[scene] || scene;
  if (scene === "law" || scene === "mmsearch") {
    showView("app-knowledge");
    return;
  }
  currentScene = scene;
  document.querySelectorAll(".scene").forEach((b) => b.classList.toggle("active", b.dataset.scene === scene));
  const doubtAiBtn = document.getElementById("doubt-ai-btn");
  if (doubtAiBtn) doubtAiBtn.hidden = scene !== "doubt";
  const paperGenBtn = document.getElementById("paper-gen-btn");
  if (paperGenBtn) paperGenBtn.hidden = scene !== "doubt";
  if (scene !== "doubt") guideState.aiOpen = false;

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
    paneTitle.textContent = "项目工作台";
    renderCockpit();
    return;
  }
  if (ASSIST_TOOLS[scene]) {
    showPane(scene);
    paneTitle.textContent = ASSIST_TOOLS[scene].title;
    return;
  }
  if (scene === "fieldpack") {
    showPane("chat");
    paneTitle.textContent = "项目资料";
    ask.placeholder = "例如：资料清单 / 缺件催收 / 访谈提纲 / 导出资料";
    seedFieldpackChat();
    return;
  }
  if (scene === "survey") {
    showPane("chat");
    paneTitle.textContent = "审前调查智能体";
    ask.placeholder = "例如：调查记录 / 调查问卷 / 生成调查大纲 / 生成调查报告";
    seedSurveyChat();
    return;
  }
  if (scene === "scheme") {
    showPane("chat");
    paneTitle.textContent = "实施方案智能体";
    ask.placeholder = "可直接提问，例如：完整性缺什么？分工怎么改？进度怎么排？";
    seedSchemeChat();
    return;
  }
  if (scene === "draft") {
    showPane("chat");
    paneTitle.textContent = "发现取证智能体";
    ask.placeholder = "例如：帮我写取证单 / 超期未反馈 / 修改发现";
    seedDraftChat();
    return;
  }
  if (scene === "interview") {
    showPane("chat");
    paneTitle.textContent = "访谈智能体";
    ask.placeholder = "例如：形成访谈结果文件 / 起草预算调剂提纲 / 转写纪要";
    seedInterviewChat();
    return;
  }
  if (scene === "paper") {
    showPane("chat");
    paneTitle.textContent = "底稿智能体";
    ask.placeholder = "例如：撰写指引 / 检查 WG-03 / 定性准不准 / 新增底稿";
    seedPaperChat();
    return;
  }
  if (scene === "report") {
    showPane("chat");
    paneTitle.textContent = "报告生成智能体";
    ask.placeholder = "例如：生成审计报告 / 检查报告完整性 / 导出草稿";
    seedReportChat();
    return;
  }
  if (scene === "talkdata") {
    showPane("chat");
    paneTitle.textContent = "智能问数";
    ask.placeholder = "直接提问，例如：2026 年一季度销售收入按供应商排名";
    seedTalkChat();
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
    if (scene === "doubt") renderGuidePane();
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

const surveyState = {
  started: false,
  reportGenerated: false,
  outlineGenerated: false,
  reminderSent: false,
  reminderAt: null,
};

const SURVEY_MATERIALS = [
  { name: "组织架构与人员编制表", status: "已齐", tag: "ok" },
  { name: "近三年预算批复与调整文件", status: "已齐", tag: "ok" },
  { name: "科目明细账 / 凭证抽样包", status: "已齐", tag: "ok" },
  { name: "信息化运维合同及验收", status: "部分", tag: "warn" },
  { name: "变更签证台账", status: "缺", tag: "risk" },
  { name: "内控自评缺陷台账", status: "缺", tag: "risk" },
  { name: "运维成果物清单", status: "缺", tag: "risk" },
];

const SURVEY_PORTRAIT = {
  unit: "XX 集团本部及纳入合并范围重点子公司（主审范围）",
  extend: ["城投建设公司（工程延伸）", "城投信息公司（内控评价）"],
  scale: "集团年度预算支出约 86 亿；抽审本部部门 6 个、重点子公司 4 家",
  risk: ["预算调剂频繁", "信息化运维 154 万缺成果物", "会议费/培训费交叉列支倾向", "专项结余挂账"],
  history: "近三年同类问题 14 条，其中运维缺成果物、调剂程序不合规已多次出现",
};

const SURVEY_DOUBTS = [
  { title: "预算调剂程序时点异常", why: "调剂入账早于批复 11 天，涉及 3 笔", level: "高" },
  { title: "信息化运维支出缺成果物", why: "合同 154 万，验收与成果物未到件", level: "高" },
  { title: "会议费与培训费交叉列支", why: "发票号重复 1 张，交叉列支约 27 万", level: "中" },
  { title: "专项资金长期挂账", why: "结余专项超过两年未清理", level: "中" },
  { title: "工程变更签证台账缺失", why: "建设公司延伸所需签证台账未提供", level: "高" },
];

const SURVEY_RECORDS = [
  {
    date: "2026-03-04",
    form: "资料调阅",
    unit: "集团财务部预算科",
    summary: "调取全面预算批复、调整文件与调剂台账；确认年中调剂 11 笔。",
    by: "hong",
  },
  {
    date: "2026-03-05",
    form: "座谈了解",
    unit: "城投建设公司工程部",
    summary: "了解车站装修变更与签证报送流程；对方承诺补交签证台账。",
    by: "hong / 工程组",
  },
  {
    date: "2026-03-06",
    form: "现场查看",
    unit: "城投信息公司综合部",
    summary: "查看内控自评底稿存放情况；11 项缺陷整改台账未闭环。",
    by: "内控组",
  },
  {
    date: "2026-03-07",
    form: "问卷回收",
    unit: "集团本部重点部门",
    summary: "回收调查问卷 6 份，其中 2 份反映运维验收与成果物脱节。",
    by: "综合组",
  },
];

const SURVEY_QUESTIONNAIRES = [
  {
    id: "q1",
    title: "企业预算执行审前调查问卷（单位层面）",
    to: "集团本部部门 / 重点子公司",
    items: [
      "本年度预算调剂次数、主要原因与审批层级？",
      "会议费、培训费管理制度及归口部门？",
      "信息化运维类合同是否约定成果物与验收标准？",
      "专项预算结余及清理计划？",
    ],
    status: "已回收 6 份",
  },
  {
    id: "q2",
    title: "工程延伸审前调查问卷",
    to: "城投建设公司及相关项目办",
    items: [
      "在建项目超概情况及审批链条？",
      "变更签证台账是否完整、是否与监理记录一致？",
      "结算送审与合同金额差异说明？",
    ],
    status: "待发放",
  },
  {
    id: "q3",
    title: "内控评价审前调查问卷",
    to: "城投信息公司",
    items: [
      "近两年内控自评缺陷数量与整改闭环情况？",
      "单位层面控制与业务层面控制责任人？",
      "采购与建设项目控制抽测覆盖范围？",
    ],
    status: "草稿",
  },
];

function surveyMissingMaterials() {
  return SURVEY_MATERIALS.filter((m) => m.status === "缺" || m.status === "部分");
}

function surveyMaterialsHtml() {
  const missing = surveyMissingMaterials();
  const remindNote = surveyState.reminderSent
    ? `<p style="margin:8px 0 0;font-size:12px;color:var(--teal)">已于 ${surveyState.reminderAt} 发送催收提醒，被审计单位可在门户上传缺件（${missing.length} 项）。</p>`
    : `<p style="margin:8px 0 0;font-size:12px;color:var(--muted)">已齐资料可直接引用；缺件 / 部分 ${missing.length} 项可发送提醒，由被审计单位上传补齐。</p>`;
  return `<div class="result-block"><h4>被审计单位资料</h4>
      <ul>${SURVEY_MATERIALS.map(
        (m) => `<li><b>${m.name}</b> <span class="tag ${m.tag}">${m.status}</span></li>`
      ).join("")}</ul>
      ${remindNote}
    </div>
    <div style="margin-top:8px">
      <button class="btn teal sm" type="button" data-survey-prompt="remind">${surveyState.reminderSent ? "再次发送提醒" : "发送提醒"}</button>
      <button class="btn sm" type="button" data-scene="fieldpack">打开项目资料</button>
      <button class="btn ghost sm" type="button" data-survey-prompt="portrait">看企业画像</button>
    </div>`;
}

function surveyRemindHtml() {
  const missing = surveyMissingMaterials();
  if (!missing.length) {
    return `<div class="result-block"><h4>发送提醒</h4>
        <p>当前无缺件或部分资料，无需催收。</p>
      </div>
      <div style="margin-top:8px">
        <button class="btn ghost sm" type="button" data-survey-prompt="materials">回看单位资料</button>
      </div>`;
  }
  const now = new Date();
  const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  surveyState.reminderSent = true;
  surveyState.reminderAt = stamp;
  return `<div class="result-block"><h4>已发送资料上传提醒</h4>
      <p>已向被审计单位联系人推送催收通知，对方登录后可在「资料上传」中补交以下 ${missing.length} 项：</p>
      <ul>${missing
        .map((m) => `<li><b>${m.name}</b> <span class="tag ${m.tag}">${m.status}</span> → 待上传</li>`)
        .join("")}</ul>
      <p style="margin:8px 0 0;font-size:12px;color:var(--muted)">发送时间：${stamp} · 接收方：集团财务部 / 城投建设 / 城投信息资料联络人</p>
    </div>
    <div class="result-block" style="margin-top:10px"><h4>被审计单位侧提示</h4>
      <p>您收到审前调查资料催收提醒，请按清单上传变更签证台账、内控自评缺陷台账、运维成果物等缺件，上传后审计组可自动回写资料状态。</p>
    </div>
    <div style="margin-top:8px">
      <button class="btn sm" type="button" data-survey-prompt="materials">回看单位资料</button>
      <button class="btn ghost sm" type="button" data-toast="已同步至项目资料催收清单">同步资料</button>
    </div>`;
}

function surveyPortraitHtml() {
  const p = SURVEY_PORTRAIT;
  return `<div class="result-block"><h4>被审单位企业画像</h4>
      <p><b>主审范围</b>：${p.unit}</p>
      <p><b>延伸对象</b>：${p.extend.join("；")}</p>
      <p><b>规模特征</b>：${p.scale}</p>
      <p><b>风险标签</b>：${p.risk.map((r) => `<span class="tag warn">${r}</span>`).join(" ")}</p>
      <p><b>历史问题</b>：${p.history}</p>
    </div>
    <div class="cite">画像来源 · 组织架构 / 预算与账套 / 政策解读 / 历史问题库</div>
    <div style="margin-top:8px">
      <button class="btn sm" type="button" data-survey-prompt="materials">看单位资料</button>
      <button class="btn teal sm" type="button" data-survey-prompt="generate">生成调查报告</button>
    </div>`;
}

function surveyRecordsHtml() {
  return `<div class="result-block"><h4>审前调查记录</h4>
      <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">共 ${SURVEY_RECORDS.length} 条：资料调阅、座谈、现场查看与问卷回收。</p>
      <ul>${SURVEY_RECORDS.map(
        (r) =>
          `<li><b>${r.date}</b> · ${r.form} · ${r.unit}<br /><span style="font-size:12px;color:var(--muted)">${r.summary}</span><br /><span class="tag">${r.by}</span></li>`
      ).join("")}</ul>
    </div>
    <div style="margin-top:8px">
      <button class="btn sm" type="button" data-survey-prompt="questionnaire">调查问卷</button>
      <button class="btn ghost sm" type="button" data-survey-prompt="generate">生成调查报告</button>
      <button class="btn ghost sm" type="button" data-toast="调查记录已导出">导出记录</button>
    </div>`;
}

function surveyQuestionnaireHtml() {
  return `<div class="result-block"><h4>调查问卷</h4>
      <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">可按对象选用或一键生成空白卷，回收结果回写调查记录。</p>
      ${SURVEY_QUESTIONNAIRES.map(
        (q) => `<div style="margin:0 0 12px;padding:10px 0;border-top:1px solid var(--line)">
          <p style="margin:0 0 6px"><b>${q.title}</b> <span class="tag ${q.status === "待发放" ? "warn" : q.status === "草稿" ? "" : "ok"}">${q.status}</span></p>
          <p style="margin:0 0 6px;font-size:12px;color:var(--muted)">发放对象：${q.to}</p>
          <ol style="margin:0;padding-left:18px;font-size:13px;line-height:1.55">${q.items
            .map((item) => `<li>${item}</li>`)
            .join("")}</ol>
        </div>`
      ).join("")}
    </div>
    <div style="margin-top:8px">
      <button class="btn teal sm" type="button" data-toast="已生成空白调查问卷（Word）">生成空白问卷</button>
      <button class="btn sm" type="button" data-toast="已发送至被审计单位联系人">发送问卷</button>
      <button class="btn ghost sm" type="button" data-survey-prompt="records">看调查记录</button>
    </div>`;
}

function surveyOutlineHtml() {
  surveyState.outlineGenerated = true;
  const missing = surveyMissingMaterials();
  return `<div class="result-block"><h4>审前调查大纲</h4>
      <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">按单位资料、企业画像与延伸对象生成，用于安排调查步骤；正式结论仍以调查报告为准。</p>
      <p><b>一、调查目标</b><br />摸清集团企业预算执行对象特征、资料完备度与主要风险点，形成可写入审计方案的调查结论与疑点线索。</p>
      <p><b>二、调查对象</b></p>
      <ul>
        <li>主审范围：${SURVEY_PORTRAIT.unit}</li>
        ${SURVEY_PORTRAIT.extend.map((x) => `<li>延伸：${x}</li>`).join("")}
      </ul>
      <p><b>三、调查内容与步骤</b></p>
      <ol>
        <li><b>资料核查</b>：核对已齐 ${SURVEY_MATERIALS.filter((m) => m.status === "已齐").length} 项；催收缺件 / 部分 ${missing.length} 项（${missing.map((m) => m.name).join("、") || "无"}）。</li>
        <li><b>画像研判</b>：对照风险标签（${SURVEY_PORTRAIT.risk.join("、")}）确定重点部门与延伸方向。</li>
        <li><b>问卷与座谈</b>：发放 / 回收调查问卷 ${SURVEY_QUESTIONNAIRES.length} 套；结合调查记录做交叉印证。</li>
        <li><b>疑点初筛</b>：围绕调剂时点、运维成果物、会议培训交叉列支、专项挂账、签证台账等形成疑点清单。</li>
        <li><b>形成报告</b>：汇总范围、资料、过程与疑点，写入审计方案（不直接写入审计指引）。</li>
      </ol>
      <p><b>四、人员与时间（建议）</b><br />主审 hong 统筹；综合组负责资料与问卷；工程组对接建设公司延伸；内控组对接信息公司。建议 5 个工作日内完成大纲落地与报告草稿。</p>
      <p><b>五、产出</b><br />调查记录持续更新 · 问卷回收台账 · 审前调查报告（含疑点）· 资料催收闭环。</p>
    </div>
    <div style="margin-top:8px">
      <button class="btn teal sm" type="button" data-survey-prompt="generate">生成调查报告</button>
      <button class="btn sm" type="button" data-survey-prompt="questionnaire">调查问卷</button>
      <button class="btn ghost sm" type="button" data-toast="调查大纲已存入项目知识库">存入项目</button>
    </div>`;
}

function surveyReportHtml() {
  surveyState.reportGenerated = true;
  return `<div class="result-block"><h4>审前调查报告</h4>
      <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">已综合单位资料、企业画像、调查记录与问卷回收生成。报告含调查疑点。</p>
      <p><b>一、调查范围与对象</b><br />集团企业预算执行主审范围；延伸城投建设公司（工程）、城投信息公司（内控评价）。</p>
      <p><b>二、单位画像摘要</b><br />${SURVEY_PORTRAIT.scale}。风险标签：${SURVEY_PORTRAIT.risk.join("、")}。</p>
      <p><b>三、资料掌握情况</b><br />已齐 ${SURVEY_MATERIALS.filter((m) => m.status === "已齐").length} 项；部分 ${SURVEY_MATERIALS.filter((m) => m.status === "部分").length} 项；缺件 ${SURVEY_MATERIALS.filter((m) => m.status === "缺").length} 项（变更签证台账、内控自评底稿、运维成果物清单）。</p>
      <p><b>四、调查过程</b><br />调查记录 ${SURVEY_RECORDS.length} 条；问卷 ${SURVEY_QUESTIONNAIRES.length} 套（已回收单位层面卷 6 份）。</p>
      <p><b>五、调查疑点（${SURVEY_DOUBTS.length}）</b></p>
      <ul>${SURVEY_DOUBTS.map(
        (d) =>
          `<li><b>${d.title}</b> <span class="tag ${d.level === "高" ? "risk" : "warn"}">${d.level}</span><br /><span style="font-size:12px;color:var(--muted)">${d.why}</span></li>`
      ).join("")}</ul>
      <p><b>六、调查结论与建议</b><br />优先核调剂时点与运维成果物；建设公司延伸盯签证与超概；信息公司盯内控缺陷未整改。上述疑点建议写入审计方案重点事项，不直接写入审计指引。</p>
    </div>
    <div style="margin-top:8px">
      <button class="btn teal sm" type="button" data-scene="scheme">写入审计方案</button>
      <button class="btn ghost sm" type="button" data-toast="调查报告已存入项目知识库">存入项目</button>
    </div>`;
}

function surveyOverviewStats() {
  const matOk = SURVEY_MATERIALS.filter((m) => m.status === "已齐").length;
  const matPart = SURVEY_MATERIALS.filter((m) => m.status === "部分").length;
  const matMiss = SURVEY_MATERIALS.filter((m) => m.status === "缺").length;
  const qDone = SURVEY_QUESTIONNAIRES.filter((q) => /已回收/.test(q.status)).length;
  const qPending = SURVEY_QUESTIONNAIRES.filter((q) => q.status === "待发放" || q.status === "草稿").length;
  const doubtHigh = SURVEY_DOUBTS.filter((d) => d.level === "高").length;
  const forms = [...new Set(SURVEY_RECORDS.map((r) => r.form))];
  return {
    matTotal: SURVEY_MATERIALS.length,
    matOk,
    matPart,
    matMiss,
    portraitRisks: SURVEY_PORTRAIT.risk.length,
    portraitExtend: SURVEY_PORTRAIT.extend.length,
    recordTotal: SURVEY_RECORDS.length,
    recordForms: forms.join("、"),
    qTotal: SURVEY_QUESTIONNAIRES.length,
    qDone,
    qPending,
    doubtTotal: SURVEY_DOUBTS.length,
    doubtHigh,
  };
}

const interviewState = {
  started: false,
  lastTopic: "预算调剂与重点费用",
  files: [],
  seq: 1,
};

function interviewMenuHtml() {
  return `<div class="scheme-prompts">
      <button type="button" data-interview-prompt="outline-adjust">起草 · 预算调剂访谈提纲</button>
      <button type="button" data-interview-prompt="outline-expense">起草 · 重点费用访谈提纲</button>
      <button type="button" data-interview-prompt="outline-special">起草 · 专项预算访谈提纲</button>
      <button type="button" data-interview-prompt="outline-decision">起草 · 大额支出决策访谈提纲</button>
      <button type="button" data-interview-prompt="minutes">转写访谈纪要</button>
      <button type="button" data-interview-prompt="todos">提取决议与待办</button>
      <button type="button" data-interview-prompt="result">形成访谈结果文件</button>
      <button type="button" data-interview-prompt="files">查看已形成文件</button>
    </div>`;
}

function interviewFilesListHtml() {
  if (!interviewState.files.length) {
    return `<p class="muted" style="margin:0">尚未形成访谈结果文件。可先转写纪要 / 提取待办，再点「形成访谈结果文件」。</p>`;
  }
  return interviewState.files
    .map(
      (f) => `<div class="file interview-result-file">
        <span>${escapeHtml(f.name)}</span>
        <span class="tag ok">${escapeHtml(f.status)}</span>
      </div>`
    )
    .join("");
}

function interviewCreateResultFile(topic) {
  const theme = topic || interviewState.lastTopic || "企业预算执行访谈";
  const no = String(interviewState.seq).padStart(2, "0");
  interviewState.seq += 1;
  const file = {
    id: `ivf${interviewState.seq}`,
    no: `FT-2026-${no}`,
    name: `访谈结果_预算执行_${theme.slice(0, 12)}_FT-2026-${no}.docx`,
    topic: theme,
    status: "已形成",
    createdAt: "2026-09-30",
    unit: "集团本部",
    audience: "财务部 / 业务部门",
  };
  interviewState.files.unshift(file);
  if (typeof ctxEl !== "undefined" && currentScene === "interview") {
    ctxEl.innerHTML = ctxHtml("interview");
  }
  return file;
}

function interviewResultFileHtml(file) {
  return `<div class="result-block interview-result-doc">
      <div class="finding-ev-form-hd">
        <h4>访谈结果文件 · ${escapeHtml(file.no)}</h4>
        <div class="chip-row" style="margin:0">
          <span class="tag ok">已形成</span>
          <span class="tag doing">企业预算执行</span>
        </div>
      </div>
      <p class="muted" style="margin:0 0 10px;font-size:12px">文件名：${escapeHtml(file.name)}</p>
      <table class="finding-ev-form-table">
        <tr><th>审计类型</th><td>企业预算执行审计</td></tr>
        <tr><th>访谈主题</th><td>${escapeHtml(file.topic)}</td></tr>
        <tr><th>被访谈单位</th><td>${escapeHtml(file.unit)} · ${escapeHtml(file.audience)}</td></tr>
        <tr><th>形成日期</th><td>${escapeHtml(file.createdAt)}</td></tr>
        <tr><th>一、访谈目的</th><td>核实预算调剂程序与入账时点、重点费用真实性、专项执行及大额支出决策依据，固定口头说明与需补交资料。</td></tr>
        <tr><th>二、主要情况</th><td>
          <ul class="finding-ev-need">
            <li>调剂：存在先入账后补批情形，对方承认与管理办法不完全一致。</li>
            <li>重点费用：运维成果物待补交；会议费与培训费交叉列支约 27 万待说明。</li>
            <li>专项 / 决策：按主题补充闲置原因或「三重一大」文号与付款时点对应关系。</li>
          </ul>
        </td></tr>
        <tr><th>三、决议</th><td>同意按预算管理办法整改调剂程序；限期补交批复、成果物与交叉列支说明。</td></tr>
        <tr><th>四、待办清单</th><td>
          <ul class="finding-ev-need">
            <li>预算岗：3 个工作日内补交调剂批复与入账对照表</li>
            <li>信息中心：5 个工作日内补交巡检报告、成果物与验收记录</li>
            <li>办公室/人力：5 个工作日内书面说明交叉列支 27 万</li>
          </ul>
        </td></tr>
        <tr><th>五、审计跟进</th><td>转入发现取证智能体催办；超期未反馈、取证资料不全继续提示；可写入底稿。</td></tr>
      </table>
    </div>
    <div class="scheme-prompts" style="margin-top:10px">
      <button type="button" data-toast="已下载 ${escapeHtml(file.name)}（示意）">下载 Word</button>
      <button type="button" data-scene="draft">转入发现取证智能体</button>
      <button type="button" data-interview-prompt="files">查看全部结果文件</button>
    </div>`;
}

function seedInterviewChat() {
  interviewState.started = true;
  const nFiles = interviewState.files.length;
  msgs.innerHTML = `
    <div class="bubble ai">
      您好，欢迎使用<strong>访谈智能体</strong>。当前按<strong>企业预算执行审计</strong>场景协助：可起草访谈提纲、转写纪要、提取决议与待办，并可<strong>形成访谈结果文件</strong>（Word 示意）。
      ${interviewMenuHtml()}
      ${nFiles ? `<div class="result-block" style="margin-top:10px"><h4>已形成结果文件 ${nFiles} 份</h4>${interviewFilesListHtml()}</div>` : ""}
      <div class="cite">访谈智能体 · 企业预算执行 · 可形成结果文件</div>
    </div>`;
  msgs.scrollTop = 0;
}

function interviewOutlineAdjustHtml() {
  interviewState.lastTopic = "预算调剂";
  return `<div class="result-block"><h4>访谈提纲 · 预算调剂（财务部 / 预算岗）</h4>
      <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">企业预算执行审计 · 调剂程序与入账时点</p>
      <ol>
        <li>本年度预算调剂次数、金额分布及主要原因？是否存在频繁调剂、年底突击调剂？</li>
        <li>调剂审批权限与集体决策要求如何执行？请说明 3 笔入账早于批复的业务依据。</li>
        <li>调剂文号、批复日期与账务处理日期如何核对？系统是否控制「无批不入」？</li>
        <li>调剂后指标是否同步业务部门？有无影响专项或刚性支出执行？</li>
        <li>请提供调剂台账、批复原件及对应入账凭证备查。</li>
      </ol>
    </div>
    <div class="scheme-prompts" style="margin-top:10px">
      <button type="button" data-interview-prompt="minutes">据此转写纪要模板</button>
      <button type="button" data-interview-prompt="todos">提取待办</button>
      <button type="button" data-interview-prompt="result">形成访谈结果文件</button>
    </div>`;
}

function interviewOutlineExpenseHtml() {
  interviewState.lastTopic = "重点费用";
  return `<div class="result-block"><h4>访谈提纲 · 重点费用（办公室 / 人力 / 信息中心）</h4>
      <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">企业预算执行审计 · 会议费、培训费、信息化运维等</p>
      <ol>
        <li>会议费与培训费开支范围、审批链条如何划分？有无交叉列支或重复报销情形？</li>
        <li>信息化运维合同 154 万：按月交付成果物如何验收？巡检报告、成果物清单存放何处？</li>
        <li>培训是否均有方案、通知、签到与效果评估？发票与事项是否一一对应？</li>
        <li>供应商选定、关联方回避如何落实？有无同一主体多科目列支？</li>
        <li>请配合提供合同、验收、成果物及原始凭证备抽查。</li>
      </ol>
    </div>
    <div class="scheme-prompts" style="margin-top:10px">
      <button type="button" data-interview-prompt="minutes">据此转写纪要模板</button>
      <button type="button" data-interview-prompt="result">形成访谈结果文件</button>
      <button type="button" data-scene="draft">关联发现取证智能体</button>
    </div>`;
}

function interviewOutlineSpecialHtml() {
  interviewState.lastTopic = "专项预算";
  return `<div class="result-block"><h4>访谈提纲 · 专项预算（业务部门 / 财务）</h4>
      <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">企业预算执行审计 · 专项下达、执行进度与结转</p>
      <ol>
        <li>专项预算如何分解到项目/单位？执行进度监控频次与责任人是谁？</li>
        <li>卫生板块专项闲置约 860 万：闲置原因、是否履行调整或结转程序？</li>
        <li>专项绩效目标、监控与评价是否闭环？未完成目标如何追责？</li>
        <li>有无「有预算无项目、有资金无成果」情形？请举例说明。</li>
        <li>请提供专项批复、分解表、执行进度说明及拟处置方案。</li>
      </ol>
    </div>
    <div class="scheme-prompts" style="margin-top:10px">
      <button type="button" data-interview-prompt="todos">提取待办</button>
      <button type="button" data-interview-prompt="result">形成访谈结果文件</button>
    </div>`;
}

function interviewOutlineDecisionHtml() {
  interviewState.lastTopic = "大额支出决策";
  return `<div class="result-block"><h4>访谈提纲 · 大额支出决策（战略投资 / 财务 / 办公室）</h4>
      <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">企业预算执行审计 · 「三重一大」与预算安排依据</p>
      <ol>
        <li>对外投资设立子公司列支 1,200 万：预算安排文件、集体决策文号与付款时点如何对应？</li>
        <li>大额支出是否均纳入年度预算？临时动议如何补批？</li>
        <li>决策纪要是否完整记载议题、表决与回避？补录系统的情形如何说明？</li>
        <li>资金流向与合同、章程约定是否一致？有无体外循环迹象？</li>
        <li>请提供决策纪要、预算安排、付款审批与资金流向材料。</li>
      </ol>
    </div>
    <div class="scheme-prompts" style="margin-top:10px">
      <button type="button" data-interview-prompt="minutes">据此转写纪要模板</button>
      <button type="button" data-interview-prompt="result">形成访谈结果文件</button>
      <button type="button" data-interview-prompt="outline-adjust">再看调剂提纲</button>
    </div>`;
}

function interviewMinutesHtml() {
  return `<div class="result-block"><h4>访谈纪要（转写稿 · 示意）</h4>
      <p><b>项目：</b>企业预算执行审计 &nbsp; <b>对象：</b>集团本部财务部预算岗 &nbsp; <b>时间：</b>2026-09-28</p>
      <p><b>一、访谈目的</b><br />核实预算调剂程序、入账时点与重点费用真实性相关情况。</p>
      <p><b>二、主要内容</b></p>
      <ul>
        <li>对方称 3 笔调剂「先入账后补批」系系统关账节点压力所致，承认与管理办法不完全一致。</li>
        <li>运维成果物称在供应商处，承诺 5 个工作日内补交巡检报告与验收单。</li>
        <li>会议费与培训费交叉列支约 27 万，对方表示将核对发票号并说明。</li>
      </ul>
      <p><b>三、需进一步核实</b><br />调剂批复原件时点、成果物全周期归档、交叉列支明细。</p>
    </div>
    <div class="scheme-prompts" style="margin-top:10px">
      <button type="button" data-interview-prompt="todos">提取决议与待办</button>
      <button type="button" data-interview-prompt="result">形成访谈结果文件</button>
      <button type="button" data-scene="draft">转入发现取证智能体</button>
      <button type="button" data-scene="paper">写入底稿</button>
    </div>`;
}

function interviewTodosHtml() {
  return `<div class="result-block"><h4>决议与待办（企业预算执行访谈）</h4>
      <table class="finding-ev-form-table">
        <tr><th>类型</th><th>内容</th><th>责任</th><th>时限</th></tr>
        <tr><td>决议</td><td>承认部分调剂存在先入账后补批，同意按管理办法整改。</td><td>财务部</td><td>—</td></tr>
        <tr><td>待办</td><td>补交 3 笔调剂批复原件及入账凭证对照表。</td><td>预算岗</td><td>3 个工作日</td></tr>
        <tr><td>待办</td><td>补交运维巡检报告、成果物清单与验收记录。</td><td>信息中心</td><td>5 个工作日</td></tr>
        <tr><td>待办</td><td>梳理会议费/培训费交叉列支 27 万明细并书面说明。</td><td>办公室/人力</td><td>5 个工作日</td></tr>
        <tr><td>审计跟进</td><td>超期未反馈记入发现取证清单；资料不全继续催办。</td><td>审计组</td><td>持续</td></tr>
      </table>
    </div>
    <div class="scheme-prompts" style="margin-top:10px">
      <button type="button" data-interview-prompt="result">形成访谈结果文件</button>
      <button type="button" data-scene="draft">打开发现取证智能体</button>
      <button type="button" data-interview-prompt="outline-expense">继续起草费用提纲</button>
    </div>`;
}

function interviewReplyHtml(text) {
  const t = text.trim();
  if (/结果文件|形成访谈|生成访谈结果|导出访谈|result/i.test(t) || t === "形成访谈结果文件") {
    const file = interviewCreateResultFile(interviewState.lastTopic);
    return `<div class="result-block"><h4>已形成访谈结果文件</h4>
      <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">已按企业预算执行审计口径汇总目的、情况、决议与待办，生成 Word 结果文件（示意）。</p>
      ${interviewResultFileHtml(file)}</div>`;
  }
  if (/已形成文件|查看.*文件|files|结果列表/i.test(t) || t === "查看已形成文件") {
    return `<div class="result-block"><h4>访谈结果文件</h4>
      ${interviewFilesListHtml()}
      <div class="scheme-prompts" style="margin-top:10px">
        <button type="button" data-interview-prompt="result">再形成一份</button>
        <button type="button" data-interview-prompt="minutes">转写访谈纪要</button>
      </div>
    </div>`;
  }
  if (/调剂|outline-adjust/i.test(t) || t === "起草 · 预算调剂访谈提纲") {
    return interviewOutlineAdjustHtml();
  }
  if (/重点费用|会议费|培训费|运维|outline-expense/i.test(t) || t === "起草 · 重点费用访谈提纲") {
    return interviewOutlineExpenseHtml();
  }
  if (/专项|闲置|outline-special/i.test(t) || t === "起草 · 专项预算访谈提纲") {
    return interviewOutlineSpecialHtml();
  }
  if (/大额|决策|三重一大|1200|1,200|outline-decision/i.test(t) || t === "起草 · 大额支出决策访谈提纲") {
    return interviewOutlineDecisionHtml();
  }
  if (/纪要|转写|minutes/i.test(t) || t === "转写访谈纪要" || t === "据此转写纪要模板") {
    return interviewMinutesHtml();
  }
  if (/待办|决议|todos/i.test(t) || t === "提取决议与待办" || t === "提取待办") {
    return interviewTodosHtml();
  }
  if (/提纲|起草|访谈要点|怎么访/i.test(t)) {
    return `<div class="result-block"><h4>按企业预算执行审计选提纲</h4>
      <p style="margin:0 0 8px">请选择要访谈的重点，或直接说对象与事项；完成后可形成访谈结果文件。</p>
      ${interviewMenuHtml()}
    </div>`;
  }
  if (/预算执行|提示|怎么用|帮助|菜单/i.test(t)) {
    return `<div class="result-block"><h4>预算执行审计 · 访谈提示</h4>
      <ul>
        <li><b>编制下达</b>：指标分解是否到部门/项目，有无无预算安排支出。</li>
        <li><b>执行调剂</b>：批复时点与入账时点、频繁调剂与年底突击。</li>
        <li><b>重点费用</b>：会议培训交叉列支、运维成果物、关联采购。</li>
        <li><b>专项资金</b>：闲置、结转、绩效闭环。</li>
        <li><b>大额决策</b>：「三重一大」、预算安排与付款对应关系。</li>
        <li><b>结果文件</b>：汇总目的、情况、决议与待办，形成 Word 访谈结果文件。</li>
      </ul>
      ${interviewMenuHtml()}
    </div>`;
  }
  return `<div class="result-block"><h4>访谈智能体</h4>
      <p>当前按<strong>企业预算执行审计</strong>协助访谈。可点下方提示，或直接说「起草预算调剂提纲」「转写纪要」「形成访谈结果文件」。</p>
      ${interviewMenuHtml()}
      <div class="cite">访谈 · 企业预算执行 · 可形成结果文件</div>
    </div>`;
}

function surveyWelcomeHtml() {
  const s = surveyOverviewStats();
  const reportMeta = surveyState.reportGenerated
    ? `已生成 · 含疑点 ${s.doubtTotal} 条`
    : `待生成 · 可写入疑点 ${s.doubtTotal} 条（高 ${s.doubtHigh}）`;
  const outlineMeta = surveyState.outlineGenerated
    ? `已生成 · 5 章调查步骤`
    : `待生成 · 目标 / 对象 / 步骤 / 产出`;
  return `<div class="bubble ai">
      您好，欢迎使用审前调查智能体。点下方模块查看明细，或生成调查大纲与报告。
      <div class="scheme-prompts survey-entry-prompts">
        <button type="button" data-survey-prompt="materials"><b>被审计单位资料</b><span class="survey-btn-meta">共 ${s.matTotal} 份 · 已齐 ${s.matOk} · 部分 ${s.matPart} · 缺 ${s.matMiss}</span></button>
        <button type="button" data-survey-prompt="portrait"><b>被审单位企业画像</b><span class="survey-btn-meta">已生成 · 延伸 ${s.portraitExtend} 家 · 风险标签 ${s.portraitRisks} 个</span></button>
        <button type="button" data-survey-prompt="outline"><b>生成调查大纲</b><span class="survey-btn-meta">${outlineMeta}</span></button>
        <button type="button" data-survey-prompt="records"><b>审前调查记录</b><span class="survey-btn-meta">共 ${s.recordTotal} 条 · ${s.recordForms}</span></button>
        <button type="button" data-survey-prompt="questionnaire"><b>调查问卷</b><span class="survey-btn-meta">共 ${s.qTotal} 套 · 已回收 ${s.qDone} · 待办 ${s.qPending}</span></button>
        <button type="button" data-survey-prompt="generate"><b>生成调查报告</b><span class="survey-btn-meta">${reportMeta}</span></button>
      </div>
    </div>`;
}

function seedSurveyChat() {
  surveyState.started = true;
  msgs.innerHTML = surveyWelcomeHtml();
  msgs.scrollTop = 0;
}

function surveyDoubtsOnlyHtml() {
  return `<div class="result-block"><h4>调查报告中的疑点</h4>
      <ul>${SURVEY_DOUBTS.map(
        (d) =>
          `<li><b>${d.title}</b> <span class="tag ${d.level === "高" ? "risk" : "warn"}">${d.level}</span> — ${d.why}</li>`
      ).join("")}</ul>
      ${
        surveyState.reportGenerated
          ? `<p style="margin:8px 0 0;font-size:12px;color:var(--muted)">以上疑点已写入本轮调查报告第五节。</p>`
          : `<p style="margin:8px 0 0;font-size:12px;color:var(--muted)">尚未生成完整报告，可先生成报告一并输出。</p>`
      }
    </div>
    <div style="margin-top:8px">
      <button class="btn teal sm" type="button" data-survey-prompt="generate">生成调查报告</button>
      <button class="btn ghost sm" type="button" data-scene="scheme">写入审计方案</button>
    </div>`;
}

function surveyReplyHtml(text) {
  const t = text.trim();
  if (/生成.*大纲|调查大纲|outline/i.test(t) || t === "生成调查大纲") {
    return surveyOutlineHtml();
  }
  if ((/生成.*报告|调查报告/i.test(t) && !/大纲/.test(t)) || t === "生成调查报告" || t === "generate") {
    return surveyReportHtml();
  }
  if (/问卷|questionnaire/i.test(t) || t === "调查问卷") {
    return surveyQuestionnaireHtml();
  }
  if (/调查记录|records|调阅|座谈/i.test(t) || t === "审前调查记录" || t === "看调查记录") {
    return surveyRecordsHtml();
  }
  if (/企业画像|单位画像|画像|portrait/i.test(t) || t === "被审单位企业画像" || t === "看企业画像") {
    return surveyPortraitHtml();
  }
  if (
    (/被审计单位资料|单位资料|materials/i.test(t) && !/缺口|缺件|提醒/.test(t)) ||
    t === "被审计单位资料" ||
    t === "看单位资料"
  ) {
    return surveyMaterialsHtml();
  }
  if (/发送提醒|催收|提醒上传|remind/i.test(t) || t === "发送提醒" || t === "再次发送提醒") {
    return surveyRemindHtml();
  }
  if (/疑点|doubts/i.test(t) || t === "报告里有哪些疑点") {
    return surveyDoubtsOnlyHtml();
  }
  if (/缺口|缺件|未齐|gap/i.test(t) || t === "资料缺口有哪些") {
    const missing = surveyMissingMaterials();
    return `<div class="result-block"><h4>资料缺口</h4>
        <ul>${missing.map((m) => `<li><b>${m.name}</b> <span class="tag ${m.tag}">${m.status}</span></li>`).join("")}</ul>
      </div>
      <div style="margin-top:8px">
        <button class="btn teal sm" type="button" data-survey-prompt="remind">发送提醒</button>
        <button class="btn sm" type="button" data-scene="fieldpack">打开项目资料</button>
        <button class="btn ghost sm" type="button" data-survey-prompt="materials">看全部资料</button>
      </div>`;
  }
  if (/延伸|住建|教育|extend/i.test(t) || t === "延伸对象建议") {
    return surveyPortraitHtml();
  }
  if (/方案|下一|scheme/i.test(t) || t === "进入方案制定" || t === "写入审计方案") {
    return `调查报告及其中疑点只写入审计方案重点事项，不直接转入审计指引。
      <div style="margin-top:8px"><button class="btn teal sm" type="button" data-scene="scheme">写入审计方案</button></div>`;
  }
  if (/驾驶舱|工作台/i.test(t)) {
    return `可返回项目工作台查看全流程。
      <div style="margin-top:8px"><button class="btn ghost sm" type="button" data-scene="cockpit">回项目工作台</button></div>`;
  }
  return `可查看「单位资料」「企业画像」「调查记录」，或「调查问卷」，再「生成调查报告」。
    <div class="cite">审前调查 · 资料 / 画像 / 记录 / 问卷 / 报告</div>`;
}

function seedSchemeChat() {
  if (schemeState.started) {
    msgs.scrollTop = msgs.scrollHeight;
    return;
  }
  schemeState.started = true;
  msgs.innerHTML = `
    <div class="bubble ai">
      您好，欢迎使用实施方案智能体。可<strong>直接提问</strong>（如完整性缺什么、分工怎么改、进度怎么排），也可检查或编制方案。
      <div class="scheme-prompts">
        <button type="button" data-scheme-prompt="quality">1、检查当前方案</button>
        <button type="button" data-scheme-prompt="draft">2、协助编制方案</button>
      </div>
    </div>`;
  msgs.scrollTop = 0;
}

function schemeCheckHtml() {
  return `已按<strong>企业预算执行审计</strong>实施方案体例检查当前稿 v1.2。检查口径两项：编制完整性、分工冲突。
      <div class="result-block" style="margin-top:10px"><h4>1. 方案编制完整性检查</h4>
        <span class="tag warn">不完整</span>
        <p style="margin:6px 0 8px;font-size:12px;color:var(--muted)">企业预算执行方案常见结构：审计目标 → 审计范围 → 审计内容和重点 → 步骤与方法 → 组织分工 → 时间安排 → 底稿与报告要求。</p>
        <ul>
          <li><b>章节结构</b>：宜覆盖目标、范围、内容重点（预算编制下达 / 执行与调剂 / 成本费用 / 采购合同 / 预算考核 / 延伸）、步骤方法、分工、进度与底稿要求。当前稿骨架已有，但部分章节深度不足。</li>
          <li><b>内容与方法</b>：调剂、运维 154 万、会议培训交叉列支等已点到，但费用穿行、供应商关联缺「对象—步骤—资料—产出」；调查疑点未入方案 5 项（签证台账缺口、自评底稿、运维成果物、历史问题未入 9 条、未到件签证）。</li>
          <li><b>组织与进度</b>：有人日安排，但主责边界仍含糊；报告时点、征求意见与归档节点未写清。底稿×编制人对照表非必须，文字写清主责即可。</li>
        </ul>
      </div>
      <div class="result-block"><h4>2. 方案分工是否有冲突</h4>
        <span class="tag risk">有冲突</span>
        <p style="margin:6px 0 8px;font-size:12px;color:var(--muted)">对照口径：一人一稿、主责清晰、进度不撞车。</p>
        <ul>
          <li>建设公司延伸：工程组与数据分析组均写「变更率核查」，职责重叠，未指定主责。</li>
          <li>信息化运维 154 万：内控组抽凭与重点费用组查合同并行，同一事项双主审未分主辅。</li>
          <li>第 2 周交叉复核与结算抽审日程撞车；宜按「现场—初稿—征求意见—终稿」错开高峰。</li>
        </ul>
      </div>
      建议优先：按企业预算执行章节补齐完整性（含疑点入方案）→ 拆开冲突分工 → 再定稿。
      <div class="cite">检查口径 · 企业预算执行 · 编制完整性 / 分工冲突</div>
      ${SCHEME_UPDATE_ASK}`;
}

function schemeDraftHtml() {
  return `当前项目类型为<strong>企业预算执行审计</strong>。已按该类型体例编制。以下先列方案全文，后附编制说明。
      <div class="result-block" style="margin-top:10px">
        <h4>XX 集团 2025 年度企业预算执行审计实施方案</h4>
        <p style="margin:0 0 10px;font-size:12px;color:var(--muted)">项目类型：企业预算执行审计</p>
        <p><b>一、审计目标</b><br />审查集团全面预算编制、下达与执行的真实性、合规性及预算约束效果，揭示虚列费用、违规调剂、专项闲置、采购与合同脱节等问题，促进预算刚性与考核闭环。</p>
        <p><b>二、审计范围</b><br />2025 年度集团本部及纳入审计范围的重点子公司全面预算执行情况；抽审重点部门与费用科目。对调查发现的异常支出可延伸至项目和供应商，延伸不改变本项目类型。</p>
        <p><b>三、审计内容和重点</b>（企业预算执行类型目录，取自方案库同类模板）</p>
        <ul>
          <li><b>（一）预算编制与下达</b>：核预算批复、分解下达是否完整，指标是否及时到部门 / 子公司。</li>
          <li><b>（二）预算执行与调剂</b>：收入与回款是否按预算进度；费用是否按科目和用途列支；年中调剂是否履行集团规定程序，审批时点与账务是否一致（本年调查：调剂频繁）。</li>
          <li><b>（三）重点费用</b>：会议费、培训费、信息化运维抽凭；运维合同 154 万与成果物、发票、账套三方核对；关注会议费与培训费交叉列支。</li>
          <li><b>（四）采购与合同履行</b>：采购程序、合同要素与付款进度；结合已收集运维合同做履约核验。</li>
          <li><b>（五）预算考核</b>：不少于 2 个专项或责任单元，核预算目标、监控、考核是否闭环；关注专项预算闲置。</li>
          <li><b>（六）延伸核实</b>：建设公司相关支出中与集团预算列支相关的超概、签证；信息公司经费中影响预算执行的内控缺陷。不另按工程审计或内控评价项目写方案。</li>
        </ul>
        <p><b>四、审计步骤与方法</b><br />审前调查已完成。现场顺序：调剂穿行 → 重点费用抽凭 → 预算考核抽样 → 必要延伸。数据分析服务本类型事项（调剂对流、重复列支、供应商关联），命中回写疑点。未到件资料列入补证后再抽核。</p>
        <p><b>五、组织分工</b><br />主审 hong。预算执行一组：编制下达、调剂、结转结余。预算执行二组：会议培训、运维等重点费用及采购合同。综合组：考核、问数与疑点汇总。延伸核实指定一人对接，避免与二组对同一 154 万双主责。</p>
        <p><b>六、时间安排</b><br />现场 12 人日（沿用当前实施方案工期）。第 1 周完成本部执行与重点费用；第 2 周后段做考核、延伸核实与交叉复核。</p>
        <p><b>七、底稿与报告</b><br />底稿按企业预算执行事项设目录：编制与调剂、重点费用、采购合同、预算考核、延伸核实。现场结束 5 个工作日内形成征求意见稿。</p>
        <p><b>八、需补充并列入档案的资料</b><br />运维成果物清单、会议培训明细与发票、专项考核材料、与预算列支相关的签证及审批件。未入档不作为已查实问题写入方案结论。</p>
      </div>
      <div class="result-block">
        <h4>编制说明</h4>
        <p>本方案按照当前项目类型「企业预算执行审计」编制，材料取舍与章节设置如下。</p>
        <ul>
          <li><b>体例</b>：以审计方案库中企业预算执行类模板为蓝本，设置审计目标、范围、内容和重点、步骤方法、组织分工、时间安排及底稿要求。</li>
          <li><b>同类先例</b>：重点事项对齐本集团 2023 年、2024 年企业预算执行实施方案中的调剂、抽凭与考核等必查内容。</li>
          <li><b>调查与资料</b>：审前调查及已收集资料中的预算调剂、信息化运维支出 154 万元、会议费与培训费交叉列支、专项闲置等，分别写入预算执行相应章节。建设公司超概及信息公司内控缺陷，仅作为与集团预算列支相关的延伸核实事项，不改变本项目类型。</li>
          <li><b>现行稿衔接</b>：沿用现行实施方案确定的现场 12 人日。原「工程、内控、数据分析」三条线表述，已按企业预算执行章节重新归并，避免体例混用。</li>
        </ul>
        <p>编制原则：以项目类型确定体例，以审前调查确定重点，以已收集资料确定可实施深度；资料未齐备的事项列入第八章补证，不作为已查实问题表述。</p>
      </div>
      <div class="cite">企业预算执行审计 · 编制说明</div>
      ${SCHEME_UPDATE_ASK}`;
}

function schemeRecallLine() {
  const prev = schemeState.history.slice(0, -1).slice(-4);
  if (!prev.length) return "已读取当前项目审前调查、项目资料、历史方案、方案库和实施方案。";
  return `已记住上文：${prev.map((t) => `「${escapeHtml(t)}」`).join(" → ")}。`;
}

function schemeAnswerHtml(text) {
  const t = text.trim();
  const recall = schemeRecallLine();

  // 底稿×编制人表：只是表达分工的一种写法，不是实施方案硬性必备章节
  if (/底稿.{0,8}编制人|编制人.{0,8}(对照)?表|底稿安排表|必须.*(底稿|对照表)|(底稿|对照表).*必须/i.test(t)) {
    return `${recall}
      <div class="result-block" style="margin-top:10px"><h4>回答 · 底稿—编制人对照表是否必须</h4>
        <p><b>不是必须。</b>审计实施方案的硬性要求是把<strong>组织分工写清楚</strong>（谁主责什么事项、进度不冲突），不是必须附一张「底稿—编制人对照表」。</p>
        <p>有的方案在「组织分工」下用「审计底稿安排」（底稿名称 × 编制人员）落实一人一稿，这是<strong>表达分工的一种写法</strong>；用文字写清组别与主责同样可以。完整性检查不应把「有没有这张表」当成达标门槛。</p>
        <p>当前稿更需要补的是：冲突事项指定唯一主责，以及报告/征求意见/归档时间节点。</p>
      </div>
      <div class="cite">问答 · 底稿安排非必备表</div>`;
  }

  if (/完整|缺什么|缺哪些|缺口|章节|结构|必备/i.test(t)) {
    return `${recall}
      <div class="result-block" style="margin-top:10px"><h4>回答 · 方案完整性</h4>
        <p>企业预算执行方案通常覆盖：审计目标、审计范围、审计内容和重点（编制下达 / 执行与调剂 / 重点费用 / 采购合同 / 预算考核 / 延伸）、步骤方法、组织分工、时间安排、底稿与报告要求。</p>
        <p>当前稿主要缺口：部分事项缺「对象—步骤—资料—产出」、调查疑点未入方案 5 项、报告/征求意见/归档节点未写清。组织分工须写清主责，但<strong>不必</strong>强制做成「底稿—编制人对照表」。</p>
      </div>
      <div style="margin-top:8px">
        <button class="btn sm" type="button" data-scheme-prompt="quality">再跑一遍方案检查</button>
        <button class="btn ghost sm" type="button" data-scheme-prompt="update">按检查结果更新方案</button>
      </div>
      <div class="cite">问答 · 编制完整性</div>`;
  }

  if (/分工|冲突|谁负责|主责|底稿安排|人员/i.test(t)) {
    return `${recall}
      <div class="result-block" style="margin-top:10px"><h4>回答 · 方案分工</h4>
        <p>要求是「一人一稿、主责清晰」；可用底稿安排表或文字分工，表本身非必须。当前冲突点：</p>
        <ul>
          <li>变更率核查：工程组与数据分析组重叠 → 建议工程组主责、数据分析复核；</li>
          <li>运维 154 万：内控与重点费用双主审 → 建议重点费用主责、内控配合穿行；</li>
          <li>第 2 周复核与结算抽审撞车 → 复核后移 2 日。</li>
        </ul>
      </div>
      <div style="margin-top:8px">
        <button class="btn sm" type="button" data-scheme-prompt="quality">打开分工冲突检查</button>
      </div>
      <div class="cite">问答 · 分工冲突</div>`;
  }

  if (/依据|按什么检查|检查口径|怎么检查/i.test(t)) {
    return `${recall}
      <div class="result-block" style="margin-top:10px"><h4>回答 · 检查口径</h4>
        <p>方案检查按<strong>企业预算执行审计</strong>体例，只查两项：①方案编制完整性；②方案分工是否有冲突。疑点是否入方案、事项四要素等已并入完整性。</p>
      </div>
      <div class="cite">问答 · 检查口径</div>`;
  }

  if (/目标|写目标|审计目标怎么写/i.test(t)) {
    return `${recall}
      <div class="result-block" style="margin-top:10px"><h4>回答 · 审计目标</h4>
        <p>企业预算执行审计目标侧重：审查全面预算编制、下达与执行的真实性、合规性及预算约束效果；揭示虚列费用、违规调剂、专项闲置、采购与合同脱节等问题；促进预算刚性与考核闭环。</p>
      </div>
      <div class="cite">问答 · 审计目标</div>`;
  }

  if (/范围|审计期间|审谁|对象/i.test(t)) {
    return `${recall}
      <div class="result-block" style="margin-top:10px"><h4>回答 · 审计范围</h4>
        <p>宜写明预算年度、集团本部及纳入范围子公司、重点部门与费用科目；可对异常支出延伸至项目和供应商，延伸不改变本项目类型。</p>
        <p>本项目示例：2025 年度 XX 集团企业预算执行及相关抽审单位。</p>
      </div>
      <div class="cite">问答 · 审计范围</div>`;
  }

  if (/内容|程序|方法|查什么|重点事项/i.test(t)) {
    return `${recall}
      <div class="result-block" style="margin-top:10px"><h4>回答 · 审计内容与方法</h4>
        <p>企业预算执行内容通常包括：预算编制与下达、预算执行与调剂、重点费用抽凭、采购与合同履约、预算考核、必要延伸核实。</p>
        <p>每个重点事项建议写清——查什么、怎么查、抽哪些、产出什么底稿；调查已发现的疑点应写入对应事项，否则现场无法闭环。</p>
      </div>
      <div style="margin-top:8px">
        <button class="btn sm" type="button" data-scheme-prompt="draft">协助编制方案</button>
      </div>
      <div class="cite">问答 · 审计内容</div>`;
  }

  if (/进度|时间|几天|日程|进场|离场/i.test(t)) {
    return `${recall}
      <div class="result-block" style="margin-top:10px"><h4>回答 · 进度安排</h4>
        <p>常见节点：现场审计（约 15 个工作日）→ 核实反馈与报告初稿 → 征求意见稿 → 底稿归档 → 报告终稿。</p>
        <p>当前稿现场 12 人日；请把交叉复核与结算抽审错开，并补写征求意见与归档日期。</p>
      </div>
      <div class="cite">问答 · 进度安排</div>`;
  }

  if (/疑点|调查|入方案|未列入/i.test(t)) {
    return `${recall}
      <div class="result-block" style="margin-top:10px"><h4>回答 · 调查疑点入方案</h4>
        <p>已列入：预算调剂频繁、运维合同 154 万。未列入 5 项：签证台账缺口、内控自评底稿未交、运维成果物缺失、历史问题未入方案 9 条、变更签证部分未到件。</p>
        <p>建议写入对应审计内容章节，并指定底稿责任人；审前调查报告只写入审计方案，不直接进审计指引。</p>
      </div>
      <div class="cite">问答 · 疑点入方案</div>`;
  }

  if (/纪律|八不准|廉洁/i.test(t)) {
    return `${recall}
      <div class="result-block" style="margin-top:10px"><h4>回答 · 审计纪律</h4>
        <p>现场作业应遵守审计纪律（诚信公正、廉洁自律、保密等），可在方案中单列纪律要求或引用集团「审计纪律八不准」。预算执行方案以目标、范围、内容、分工、进度为主，纪律可简要专节或附则。</p>
      </div>
      <div class="cite">问答 · 工作纪律</div>`;
  }

  if (/怎么写|如何写|模板|体例|类型/i.test(t)) {
    return `${recall}
      <div class="result-block" style="margin-top:10px"><h4>回答 · 怎么写方案</h4>
        <p>本项目类型为<strong>企业预算执行审计</strong>，按企业预算执行体例取方案库模板；用审前调查定重点，用已收集资料定可实施深度。</p>
        <p>可点「协助编制方案」生成示例全文；点「检查当前方案」做完整性与分工检查。</p>
      </div>
      <div class="scheme-prompts" style="margin-top:8px">
        <button type="button" data-scheme-prompt="draft">2、协助编制方案</button>
        <button type="button" data-scheme-prompt="quality">1、检查当前方案</button>
      </div>
      <div class="cite">问答 · 编制方法</div>`;
  }

  if (/更新|修改|改一下|补齐|写入/i.test(t)) {
    return `${recall}
      <div class="result-block" style="margin-top:10px"><h4>回答</h4>
        <p>可以。若要按刚才检查结论改稿，请确认更新；也可直接说明要改的章节（目标/范围/内容/分工/进度）。</p>
      </div>
      <div class="scheme-prompts" style="margin-top:8px">
        <button type="button" data-scheme-prompt="update">需要，请更新当前方案</button>
        <button type="button" data-scheme-prompt="noupdate">暂不需要</button>
      </div>`;
  }

  // generic Q&A: treat as a question about the scheme
  return `${recall}
      <div class="result-block" style="margin-top:10px"><h4>回答</h4>
        <p>针对「${escapeHtml(t)}」，结合当前实施方案说明如下：</p>
        <ul>
          <li>若问结构/缺口 → 看完整性（章节、内容方法、进度要素、疑点是否入方案）；</li>
          <li>若问谁做/是否撞车 → 看分工冲突（一人一稿、主责、日程）；</li>
          <li>若要成稿 → 可协助编制或按检查结果更新 v1.3。</li>
        </ul>
        <p>您也可以更具体地问：例如「完整性缺什么」「分工怎么改」「进度怎么排」「疑点怎么写入」。</p>
      </div>
      <div class="scheme-prompts" style="margin-top:8px">
        <button type="button" data-scheme-prompt="quality">1、检查当前方案</button>
        <button type="button" data-scheme-prompt="draft">2、协助编制方案</button>
      </div>
      <div class="cite">方案智能体 · 问答</div>`;
}

function schemeIntent(text) {
  const t = text.trim();
  if (t === "暂不需要" || t === "不需要") return "noupdate";
  if (/更新当前方案/.test(t) || t === "需要，请更新当前方案") return "update";
  if (t === "检查当前方案" || t === "1、检查当前方案" || t === "再跑一遍方案检查" || t === "打开分工冲突检查") return "quality";
  if (t === "协助编制方案" || t === "2、协助编制方案") return "draft";
  if (/按检查结果更新方案/.test(t)) return "update";
  return "answer";
}

function schemeReplyHtml(text) {
  schemeState.history.push(text);
  const intent = schemeIntent(text);
  if (intent === "quality") schemeState.mode = "quality";
  if (intent === "draft") schemeState.mode = "draft";
  if (intent === "noupdate") {
    return `好的，当前实施方案保持不变。上面的检查和编制内容我仍保留，您接着提问即可。
      <div class="cite">实施方案未改写</div>`;
  }
  if (intent === "update") {
    return `已结合上文（${schemeRecallLine()}）按检查结论将实施方案更新为 <b>v1.3</b>：
      <ul>
        <li><b>编制完整性</b>：按企业预算执行章节补齐内容方法四要素；补入未入方案疑点；写明报告/征求意见/归档节点。</li>
        <li><b>分工冲突</b>：按「一人一稿」用文字写清主责（不必强行补底稿—编制人对照表）——变更率核查主责工程组、数据分析组复核；运维 154 万主责重点费用组、内控组配合；交叉复核调至第 2 周后 2 日。</li>
      </ul>
      已回写项目实施方案。后续可继续提问或再检查。
      <div class="cite">实施方案 v1.3 · 已按检查结论更新</div>`;
  }
  if (intent === "quality") return schemeCheckHtml();
  if (intent === "draft") return schemeDraftHtml();
  return schemeAnswerHtml(text);
}

function talkMenuHtml() {
  return `<div class="scheme-prompts">
      <button type="button" data-talk-prompt="rank">近 12 个月中标金额按供应商排名</button>
      <button type="button" data-talk-prompt="sample">对工程变更做分层抽样</button>
      <button type="button" data-talk-prompt="filter">加上关联方过滤后再看</button>
    </div>`;
}

function talkReplyHtml(text) {
  const raw = text.trim();
  if (/抽样|样本|PPS|分层/.test(raw)) {
    return `已按合同包分层抽样（示意）：
      <div class="stat-row" style="margin:10px 0">
        <div class="stat"><b>128</b><span>总体（合同包）</span></div>
        <div class="stat"><b>24</b><span>已抽样本</span></div>
        <div class="stat"><b>12.6%</b><span>变更率点估计</span></div>
      </div>
      <div class="result-block"><h4>抽样方案</h4>工程变更：&gt;500 万全查，其余 PPS 抽 12 包。会议费/培训费按月每层 8 笔。</div>
      <div class="result-block"><h4>异常样本</h4>车站装修超概未批；信息化运维缺成果物；会议费交叉列支。
        <div style="margin-top:8px">
          <button class="btn sm" type="button" data-toast="已生成抽样底稿">写入底稿</button>
          <button class="btn ghost sm" type="button" data-scene="doubt">对异常样本做穿透</button>
        </div>
      </div>
      ${talkMenuHtml()}`;
  }
  if (/关联方|过滤|工程域/.test(raw)) {
    return `已叠加关联方过滤（示意）。海云信息与澜海商贸疑似同一实控后，排名前两位仍居首，合计占比上升。
      <div class="cite">过滤条件 · 关联方 / 工程域可选</div>
      ${talkMenuHtml()}`;
  }
  if (/排名|中标|销售|金额|供应商|往来|问数/.test(raw) || raw.length > 2) {
    return `已查询卡片 impstru_2026Q1Sales…（4,671 条）。
      <div class="result-block"><h4>问数结果</h4>海云信息近 12 个月中标 9 次、累计 2,160 万，位列第一；澜海商贸食堂配送 318 万，位列第二；博远建设第三。</div>
      <div class="result-block"><h4>可继续</h4>「加上关联方过滤」「对异常做抽样」「只看工程域」</div>
      ${talkMenuHtml()}`;
  }
  return `可以直接提问取数或抽样，例如「按供应商排名」「对工程变更分层抽样」。
    ${talkMenuHtml()}`;
}

function seedTalkChat() {
  msgs.innerHTML = `
    <div class="bubble ai">
      您好，欢迎使用智能问数。用对话即可取数、抽样与对比，结果可写入底稿或转到审计指引。
      ${talkMenuHtml()}
    </div>`;
  msgs.scrollTop = 0;
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
  } else if (currentScene === "survey") {
    ai.innerHTML = surveyReplyHtml(text);
  } else if (currentScene === "draft") {
    ai.innerHTML = draftReplyHtml(text);
  } else if (currentScene === "interview") {
    ai.innerHTML = interviewReplyHtml(text);
  } else if (currentScene === "paper") {
    ai.innerHTML = paperReplyHtml(text);
  } else if (currentScene === "report") {
    ai.innerHTML = reportReplyHtml(text);
  } else if (currentScene === "fieldpack") {
    ai.innerHTML = fieldpackReplyHtml(text);
  } else if (currentScene === "talkdata") {
    ai.innerHTML = talkReplyHtml(text);
  } else {
    const detectHint =
      currentScene === "plan" && planState.items.length
        ? `当前计划草案已列 ${planState.items.length} 个项目（${planState.items.map((u) => AUDIT_TYPES[u.type].label + "·" + u.name).join("、")}）。`
        : "如需锁定审计对象与类型，可先运行审计对象筛查再纳入计划。";
    ai.innerHTML = `已记下。建议拆成：核实依据、核对应金额、形成底稿或方案段落。${detectHint}<div class='cite'>可执行 · 转检测 / 转项目工作台 / 写入底稿</div>`;
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
  const interviewPrompt = e.target.closest("[data-interview-prompt]");
  if (interviewPrompt) {
    const map = {
      "outline-adjust": "起草 · 预算调剂访谈提纲",
      "outline-expense": "起草 · 重点费用访谈提纲",
      "outline-special": "起草 · 专项预算访谈提纲",
      "outline-decision": "起草 · 大额支出决策访谈提纲",
      minutes: "转写访谈纪要",
      todos: "提取决议与待办",
      result: "形成访谈结果文件",
      files: "查看已形成文件",
    };
    reply(map[interviewPrompt.dataset.interviewPrompt] || interviewPrompt.textContent.trim());
    return;
  }
  const surveyPrompt = e.target.closest("[data-survey-prompt]");
  if (surveyPrompt) {
    const map = {
      materials: "被审计单位资料",
      portrait: "被审单位企业画像",
      records: "审前调查记录",
      questionnaire: "调查问卷",
      outline: "生成调查大纲",
      generate: "生成调查报告",
      remind: "发送提醒",
      doubts: "报告里有哪些疑点",
      report: "生成调查报告",
      gap: "资料缺口有哪些",
      extend: "被审单位企业画像",
      scheme: "写入审计方案",
    };
    reply(map[surveyPrompt.dataset.surveyPrompt] || surveyPrompt.textContent.trim());
    return;
  }
  const talkPrompt = e.target.closest("[data-talk-prompt]");
  if (talkPrompt) {
    const map = {
      rank: "近 12 个月中标金额按供应商排名",
      sample: "对工程变更做分层抽样",
      filter: "加上关联方过滤后再看",
    };
    reply(map[talkPrompt.dataset.talkPrompt] || talkPrompt.textContent.trim());
    return;
  }
  const paperPrompt = e.target.closest("[data-paper-prompt]");
  if (paperPrompt) {
    const act = paperPrompt.dataset.paperPrompt;
    if (act === "open") {
      paperState.pendingId = paperPrompt.dataset.paperId;
      paperState.pendingAction = null;
    }
    if (act === "guide" || act === "review") {
      paperState.pendingAction = act;
      if (paperPrompt.dataset.paperId) paperState.pendingId = paperPrompt.dataset.paperId;
    }
    if (act === "create") {
      paperState.pendingIssue = paperPrompt.dataset.paperIssue;
    }
    const map = {
      list: "列出已有底稿",
      guide: "撰写指引",
      review: "检查已写底稿",
    };
    reply(map[act] || paperPrompt.textContent.trim());
    return;
  }
  const reportPrompt = e.target.closest("[data-report-prompt]");
  if (reportPrompt) {
    const map = {
      findings: "问题清册",
      complete: "检查报告完整性",
      polish: "润色定性",
      rectify: "整改建议",
      gaps: "检查报告完整性",
      draft: "生成审计报告",
      export: "导出 Word 草稿",
      include: "写入未入报告问题",
      "include-all": "全部底稿问题写入",
      "from-papers": "从底稿汇集问题",
      "tone-safe": "应用稳妥口径",
      "tone-strong": "应用较强口径",
      "force-export": "仍要导出",
    };
    reply(map[reportPrompt.dataset.reportPrompt] || reportPrompt.textContent.trim());
    return;
  }
  const fieldpackPrompt = e.target.closest("[data-fieldpack-prompt]");
  if (fieldpackPrompt) {
    const map = {
      list: "资料清单",
      gap: "缺件催收",
      outline: "访谈提纲",
      minutes: "会议纪要待办",
      rectify: "整改通知",
      export: "导出资料",
    };
    reply(map[fieldpackPrompt.dataset.fieldpackPrompt] || fieldpackPrompt.textContent.trim());
    return;
  }
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
  const draftSave = e.target.closest("[data-draft-save]");
  if (draftSave) {
    const id = draftSave.dataset.draftSave;
    const item = FINDING_EVIDENCE.find((x) => x.id === id);
    const root = draftSave.closest(".finding-ev-edit");
    if (item && item.evidenced) {
      reply(`修改发现 · ${item.title}`);
      return;
    }
    if (item) findingEvApplyFromForm(item, root);
    draftState.editingId = null;
    reply(item ? `已保存修改 · ${item.title}` : "全部清单");
    return;
  }
  const draftEdit = e.target.closest("[data-draft-edit]");
  if (draftEdit) {
    draftState.editingId = draftEdit.dataset.draftEdit;
    draftState.writingId = null;
    const item = FINDING_EVIDENCE.find((x) => x.id === draftState.editingId);
    reply(item ? `修改发现 · ${item.title}` : "修改发现");
    return;
  }
  const draftWrite = e.target.closest("[data-draft-write]");
  if (draftWrite) {
    const id = draftWrite.dataset.draftWrite;
    const item = FINDING_EVIDENCE.find((x) => x.id === id);
    const root = draftWrite.closest(".finding-ev-edit");
    if (item && !item.evidenced && root) findingEvApplyFromForm(item, root);
    draftState.writingId = id;
    draftState.editingId = null;
    reply(item ? (item.evidenced ? `查看取证单 · ${item.title}` : `协助撰写取证单 · ${item.title}`) : "协助撰写取证单");
    return;
  }
  const draftAskWrite = e.target.closest("[data-draft-ask-write]");
  if (draftAskWrite) {
    draftState.writingId = null;
    reply("协助撰写取证单");
    return;
  }
  const draftFilter = e.target.closest("[data-draft-filter]");
  if (draftFilter) {
    const f = draftFilter.dataset.draftFilter;
    const map = {
      all: "全部清单",
      pending: "待反馈",
      done: "已反馈",
      opinion: "有异议",
      overdue: "超期未反馈",
      sent: "已发送取证单",
      docsgap: "取证资料不全",
    };
    reply(map[f] || "全部清单");
    return;
  }
  const sceneBtn = e.target.closest("[data-scene]");
  if (sceneBtn && !sceneBtn.classList.contains("scene") && !sceneBtn.dataset.view) {
    e.preventDefault();
    if (sceneBtn.dataset.openDocs === "1") {
      fieldpackState.openList = true;
    }
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

const dataState = { domain: "财务域", models: [], lastPack: null, modelSeq: 1 };

const DATA_DOMAIN_HINT = {
  财务域: "财务域卡片 · 业务辅助核算 / 季度销售",
  营销域: "营销域 · 合同履约台账",
  工程域: "工程域 · 变更签证明细",
  供应链域: "供应链 · 供应商主数据",
  办公域: "办公域 · 会议费报销明细",
  "SAP（财务记账）": "SAP · 科目余额",
};

const DATA_DOMAIN_TABLE = {
  财务域: "ads_fin_sales_detail",
  营销域: "ads_mkt_contract_fulfill",
  工程域: "ads_eng_change_visa",
  供应链域: "ads_scm_supplier_master",
  办公域: "ads_office_meeting_exp",
  "SAP（财务记账）": "sap_gl_balance",
};

function dataBuildPack(text) {
  const raw = text.trim();
  const domain = dataState.domain;
  const table = DATA_DOMAIN_TABLE[domain] || "ads_query_base";
  const source = DATA_DOMAIN_HINT[domain] || domain;

  if (/抽样|分层|PPS|样本/.test(raw)) {
    return {
      kind: "sample",
      title: "工程变更与费用分层抽样",
      modelName: `${domain}·分层抽样模型`,
      resultHtml: `<div class="result-block"><h4>抽样结果</h4>
        工程变更：&gt;500 万全查，其余 PPS 抽 12 包；会议费/培训费按月每层 8 笔。异常样本：车站装修超概未批、信息化运维缺成果物、会议费交叉列支。
      </div>
      <div class="result-block"><h4>数据来源</h4>变更签证明细 · 会议费报销明细 · 共命中 4,671 条相关记录。</div>`,
      sql: `WITH base AS (
  SELECT package_id, amount, change_rate, subject
  FROM ${table}
  WHERE domain = '${domain}' AND period >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
)
SELECT *
FROM (
  SELECT * FROM base WHERE amount > 5000000
  UNION ALL
  SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY subject ORDER BY amount DESC) rn
    FROM base WHERE amount <= 5000000
  ) t WHERE rn <= 12
) sample_set;`,
      models: [
        { name: "超概全查层", desc: "金额 > 500 万全查" },
        { name: "PPS 抽包层", desc: "其余按金额 PPS 抽 12 包" },
        { name: "费用按月分层", desc: "会议费/培训费每层 8 笔" },
      ],
      source,
    };
  }
  if (/会议费|培训费|报销|办公/.test(raw)) {
    return {
      kind: "meeting",
      title: "会议费培训费交叉列支监测",
      modelName: `${domain}·会议培训交叉列支模型`,
      resultHtml: `<div class="result-block"><h4>问数结果</h4>
        近 12 个月会议费 186 万、培训费 94 万；交叉列支疑点 27 万（4 笔）；高峰月为 3 月、9 月。
      </div>
      <div class="result-block"><h4>明细摘要</h4>
        <ul>
          <li>培训与会议交叉列支 · 27 万 · 4 笔</li>
          <li>住宿超标准无说明 · 2 笔</li>
          <li>发票与出差审批日期矛盾 · 1 笔</li>
        </ul>
      </div>`,
      sql: `SELECT
  voucher_no, subject_name, amount, invoice_no, approve_date, invoice_date
FROM ${table}
WHERE subject_name IN ('会议费','培训费')
  AND fiscal_year = YEAR(CURRENT_DATE)
  AND (
    invoice_no IN (
      SELECT invoice_no FROM ${table}
      GROUP BY invoice_no HAVING COUNT(DISTINCT subject_name) > 1
    )
    OR ABS(DATEDIFF(invoice_date, approve_date)) > 7
  )
ORDER BY amount DESC;`,
      models: [
        { name: "交叉列支识别", desc: "同一发票跨会议费/培训费" },
        { name: "超标准住宿筛查", desc: "住宿超标准且无说明" },
        { name: "日期矛盾核验", desc: "发票与审批日差 > 7 天" },
      ],
      source,
    };
  }
  if (/变更|超概|工程|签证/.test(raw)) {
    return {
      kind: "eng",
      title: "工程变更超概监测",
      modelName: `${domain}·变更超概监测模型`,
      resultHtml: `<div class="result-block"><h4>问数结果</h4>
        工程变更累计 18 包、超概未批 3 包、金额合计 1,240 万；其中车站装修单项超概 520 万且无联签。
      </div>
      <div class="result-block"><h4>明细摘要</h4>
        <ul>
          <li>车站装修 · 超概未批 · 520 万</li>
          <li>机房改造 · 签证滞后结算 · 180 万</li>
          <li>信息化运维 · 缺成果物 · 154 万</li>
        </ul>
      </div>`,
      sql: `SELECT
  project_name, package_id, budget_amt, change_amt,
  ROUND(change_amt / NULLIF(budget_amt,0) * 100, 2) AS over_pct,
  approve_flag, visa_lag_days
FROM ${table}
WHERE change_amt > 0
  AND (approve_flag = 0 OR change_amt / NULLIF(budget_amt,0) > 0.10)
ORDER BY change_amt DESC;`,
      models: [
        { name: "超概未批", desc: "变更率超阈值且无联签" },
        { name: "签证滞后", desc: "签证至结算滞后天数" },
        { name: "成果物缺失", desc: "已付款缺巡检/验收" },
      ],
      source,
    };
  }
  if (/关联|过滤|往来/.test(raw)) {
    return {
      kind: "relate",
      title: "供应商关联方过滤排名",
      modelName: `${domain}·关联方过滤排名模型`,
      resultHtml: `<div class="result-block"><h4>问数结果</h4>
        叠加关联方过滤后，海云信息与澜海商贸疑似同一实控，合计中标占比由 41% 升至 58%；博远建设仍居第三。
      </div>`,
      sql: `WITH hit AS (
  SELECT supplier_id, related_group_id
  FROM ads_supplier_relation
  WHERE match_type IN ('same_phone','same_ctrl','same_addr')
)
SELECT
  COALESCE(r.related_group_id, s.supplier_id) AS group_key,
  MAX(s.supplier_name) AS supplier_name,
  SUM(s.win_amt) AS win_amt,
  COUNT(*) AS win_cnt
FROM ${table} s
LEFT JOIN hit r ON s.supplier_id = r.supplier_id
WHERE s.period >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
GROUP BY group_key
ORDER BY win_amt DESC
LIMIT 20;`,
      models: [
        { name: "撞库关联", desc: "电话/地址/实控人一致" },
        { name: "合并排名", desc: "按关联组汇总中标金额" },
        { name: "占比抬升监测", desc: "过滤前后占比对比" },
      ],
      source,
    };
  }
  return {
    kind: "rank",
    title: "供应商中标金额排名",
    modelName: `${domain}·供应商中标排名模型`,
    resultHtml: `<div class="result-block"><h4>问数结果</h4>
        海云信息近 12 个月中标 9 次、累计 2,160 万，位列第一；澜海商贸食堂配送 318 万，位列第二；博远建设 276 万，位列第三。
      </div>
      <div class="result-block"><h4>明细摘要</h4>
        <ul>
          <li>海云信息 · 9 次 · 2,160 万</li>
          <li>澜海商贸 · 6 次 · 318 万</li>
          <li>博远建设 · 4 次 · 276 万</li>
        </ul>
      </div>`,
    sql: `SELECT
  supplier_name,
  COUNT(*) AS win_cnt,
  SUM(win_amt) AS win_amt
FROM ${table}
WHERE period >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
  AND domain = '${domain}'
GROUP BY supplier_name
ORDER BY win_amt DESC
LIMIT 20;`,
    models: [
      { name: "中标次数统计", desc: "近 12 个月按供应商计数" },
      { name: "中标金额汇总", desc: "累计金额降序" },
      { name: "TOP N 切片", desc: "可下钻季度/标的类型" },
    ],
    source,
  };
}

function dataSqlBlockHtml(sql) {
  return `<div class="result-block"><h4>生成 SQL</h4>
      <pre class="data-sql">${escapeHtml(sql)}</pre>
      <div style="margin-top:8px">
        <button type="button" class="btn ghost sm" data-data-copy-sql>复制 SQL</button>
      </div>
    </div>`;
}

function dataModelSuggestHtml(pack) {
  const rows = (pack.models || [])
    .map((m) => `<li><b>${escapeHtml(m.name)}</b> · ${escapeHtml(m.desc)}</li>`)
    .join("");
  return `<div class="result-block"><h4>可形成模型</h4>
      <p style="margin:0 0 8px">建议模型名：<b>${escapeHtml(pack.modelName)}</b> · 域「${escapeHtml(dataState.domain)}」</p>
      <ul>${rows}</ul>
      <div style="margin-top:8px">
        <button type="button" class="btn teal sm" data-data-save-model>加入模型列表</button>
      </div>
    </div>`;
}

function renderDataModelList() {
  const box = document.getElementById("data-model-list");
  const count = document.getElementById("data-model-count");
  if (count) count.textContent = String(dataState.models.length);
  if (!box) return;
  if (!dataState.models.length) {
    box.innerHTML = `<p class="muted" style="font-size:12px;margin:0">问数后可将 SQL 沉淀为模型，列表在此展示。</p>`;
    return;
  }
  box.innerHTML = dataState.models
    .map(
      (m) => `<button type="button" class="data-model-item" data-data-model="${m.id}">
        <b>${escapeHtml(m.name)}</b>
        <span>${escapeHtml(m.domain)} · ${escapeHtml(m.kindLabel || m.kind)}</span>
      </button>`
    )
    .join("");
}

function dataReplyHtml(text) {
  const pack = dataBuildPack(text);
  dataState.lastPack = pack;
  const domain = dataState.domain;
  const cite = `<div class="cite">数据域 · ${escapeHtml(domain)} · ${escapeHtml(pack.source)}</div>`;
  return `${pack.resultHtml}
    ${dataSqlBlockHtml(pack.sql)}
    ${dataModelSuggestHtml(pack)}
    ${cite}`;
}

function dataReply(text) {
  const box = document.getElementById("data-msgs");
  if (!box) return;
  const user = document.createElement("div");
  user.className = "bubble user";
  user.textContent = text;
  box.appendChild(user);
  const ai = document.createElement("div");
  ai.className = "bubble ai";
  ai.innerHTML = dataReplyHtml(text);
  box.appendChild(ai);
  box.scrollTop = box.scrollHeight;
}

function setDataDomain(domain) {
  dataState.domain = domain;
  document.querySelectorAll("#data-domains [data-domain]").forEach((b) => {
    b.classList.toggle("active", b.dataset.domain === domain);
  });
  const tag = document.getElementById("data-domain-tag");
  if (tag) tag.textContent = domain;
}

document.getElementById("data-domains")?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-domain]");
  if (!btn) return;
  const domain = btn.dataset.domain;
  if (domain === dataState.domain) return;
  setDataDomain(domain);
  const box = document.getElementById("data-msgs");
  if (!box) return;
  const ai = document.createElement("div");
  ai.className = "bubble ai";
  ai.innerHTML = `<div class="result-block"><h4>已切换数据域</h4>当前范围：「${escapeHtml(domain)}」。直接提问即可返回结果、SQL 与可形成模型。</div>`;
  box.appendChild(ai);
  box.scrollTop = box.scrollHeight;
});

document.getElementById("data-send")?.addEventListener("click", () => {
  const input = document.getElementById("data-ask");
  const text = (input?.value || "").trim();
  if (!text) return;
  input.value = "";
  dataReply(text);
});

document.getElementById("data-ask")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    document.getElementById("data-send")?.click();
  }
});

document.getElementById("data-msgs")?.addEventListener("click", (e) => {
  if (e.target.closest("[data-data-copy-sql]")) {
    const sql = dataState.lastPack?.sql;
    if (!sql) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(sql).then(() => toast("SQL 已复制")).catch(() => toast("复制失败，请手动选择"));
    } else {
      toast("请手动选择 SQL 复制");
    }
    return;
  }
  if (e.target.closest("[data-data-save-model]")) {
    const pack = dataState.lastPack;
    if (!pack) {
      toast("请先完成一次问数");
      return;
    }
    const dup = dataState.models.find((m) => m.name === pack.modelName && m.domain === dataState.domain);
    if (dup) {
      toast("该模型已在列表中");
      return;
    }
    dataState.models.unshift({
      id: `dm${dataState.modelSeq++}`,
      name: pack.modelName,
      domain: dataState.domain,
      kind: pack.kind,
      kindLabel: pack.title,
      sql: pack.sql,
      models: pack.models,
      question: pack.title,
    });
    renderDataModelList();
    toast(`已加入模型：${pack.modelName}`);
  }
});

document.getElementById("data-model-list")?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-data-model]");
  if (!btn) return;
  const model = dataState.models.find((m) => m.id === btn.dataset.dataModel);
  if (!model) return;
  const box = document.getElementById("data-msgs");
  if (!box) return;
  dataState.lastPack = {
    kind: model.kind,
    title: model.kindLabel || model.name,
    modelName: model.name,
    sql: model.sql,
    models: model.models || [],
    source: DATA_DOMAIN_HINT[model.domain] || model.domain,
    resultHtml: `<div class="result-block"><h4>模型回放</h4>已打开「${escapeHtml(model.name)}」，可复用下方 SQL 或再次加入列表。</div>`,
  };
  const ai = document.createElement("div");
  ai.className = "bubble ai";
  ai.innerHTML = `${dataState.lastPack.resultHtml}
    ${dataSqlBlockHtml(model.sql)}
    ${dataModelSuggestHtml(dataState.lastPack)}
    <div class="cite">模型列表 · ${escapeHtml(model.domain)}</div>`;
  box.appendChild(ai);
  box.scrollTop = box.scrollHeight;
});

renderDataModelList();

const KNOWLEDGE_LIBS = {
  matter: {
    title: "审计事项库",
    keywords: ["事项", "超概", "变更", "调剂", "验收", "预算安排", "工程", "预算", "履约"],
    items: [
      { name: "预算调剂程序合规性", desc: "预算执行 · 调剂文件与账务时点" },
      { name: "工程变更超概审批", desc: "工程审计 · 概算—变更—结算" },
      { name: "企业采购履约验收", desc: "内控 / 采购 · 成果物与扣款" },
      { name: "大额支出依据闭环", desc: "预算执行 · 安排与资金对应" },
    ],
    hit: "事项：工程变更控制。关注点：超概阈值、审批权限、签证与监理一致性。",
  },
  law: {
    title: "法律法规库",
    keywords: ["法规", "条例", "法", "条款", "定性", "招标", "串通", "内控规范", "政策", "政府投资"],
    items: [
      { name: "《政府投资条例》第十二条", desc: "变更控制与审批" },
      { name: "《招标投标法》第三十二条", desc: "禁止串通投标" },
      { name: "集团全面预算管理办法 · 预算调整", desc: "调剂程序" },
      { name: "行政事业单位内部控制规范", desc: "单位层面与业务层面控制" },
    ],
    hit: "《政府投资条例》第十二条；政府投资项目审计监督通知。建议定性用「审批手续不完整」。",
  },
  docs: {
    title: "项目资料库",
    keywords: ["资料", "智搜", "扫描", "录音", "表格", "影像", "签证", "合同", "纪要", "台账", "方案", "底稿"],
    items: [
      { name: "实施方案 3.2 · 变更控制", desc: "文本 · 项目方案" },
      { name: "签证单-07（扫描件）", desc: "影像 · 工程变更" },
      { name: "访谈录音 04:12", desc: "录音 · 建设方答复超概审批" },
      { name: "变更签证台账.xlsx", desc: "表格 · 23 笔变更" },
    ],
    hit: "资料召回：实施方案 3.2、签证单-07（扫描件）、访谈录音 04:12、变更签证台账；可与法规条款交叉引用。",
  },
  issue: {
    title: "内部问题库",
    keywords: ["历史", "本机关", "问题", "整改", "运维", "会议费", "闲置", "虚假贸易", "通道"],
    items: [
      { name: "运维支出缺成果物", desc: "2024 · 已整改" },
      { name: "会议费与培训费交叉列支", desc: "2023 · 已调账" },
      { name: "专项资金长期闲置", desc: "2024 · 部分整改" },
      { name: "循环贸易通道业务", desc: "2022 · 已移交" },
    ],
    hit: "本机关近三年同类问题 3 件：同日进销、无仓单、加价无服务；整改要求延伸供应商并核销虚增收入。",
  },
  case: {
    title: "外部案例库",
    keywords: ["案例", "对标", "围标", "串标", "中石化", "海运", "能化", "关联", "食堂"],
    items: [
      { name: "中石化 · 围标串标典型手法", desc: "固定三家报价、分差过小" },
      { name: "海运集团 · 关联采购", desc: "实控人撞库" },
      { name: "能化监管 · 虚假贸易通报", desc: "资金体内循环" },
      { name: "行业检查 · 食堂配送关联", desc: "供应商与运维商同一实控" },
    ],
    hit: "公开案例中，固定三家报价、分差小于 1 分、联系方式相同是常见串标特征，与本项目海云/澜海/博远组合高度相似。",
  },
};

function knowledgeScoreLib(lib, text) {
  const raw = text.toLowerCase();
  let score = 0;
  lib.keywords.forEach((k) => {
    if (raw.includes(k.toLowerCase()) || text.includes(k)) score += 2;
  });
  lib.items.forEach((item) => {
    if (text.includes(item.name.slice(0, 4)) || text.includes(item.name)) score += 3;
  });
  return score;
}

function knowledgeReplyHtml(text) {
  const all = Object.values(KNOWLEDGE_LIBS);
  const ranked = all
    .map((lib) => ({ lib, score: knowledgeScoreLib(lib, text) }))
    .sort((a, b) => b.score - a.score);
  const focused = ranked.filter((x) => x.score > 0);
  const primary = (focused.length ? focused : ranked).map((x) => x.lib);

  const conclusionBits = primary.map((lib) => lib.hit).join(" ");
  const evidence = [];
  primary.forEach((lib) => {
    lib.items.slice(0, focused.length ? 2 : 1).forEach((item) => {
      evidence.push(`${item.name}（${item.desc}）`);
    });
  });
  const uniqEvidence = [...new Set(evidence)].slice(0, 6);

  return `<div class="result-block"><h4>全量分析结论</h4>
      <p>${escapeHtml(conclusionBits)}</p>
    </div>
    <div class="result-block"><h4>支撑依据（跨库摘录）</h4>
      <ul>${uniqEvidence.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
      <p class="muted" style="margin:8px 0 0;font-size:12px;color:var(--muted)">已对照事项、法规、项目资料、内部问题与外部案例全量检索（含原法规检索与资料智搜）。</p>
    </div>`;
}

function knowledgeReply(text) {
  const box = document.getElementById("knowledge-msgs");
  if (!box) return;
  const user = document.createElement("div");
  user.className = "bubble user";
  user.textContent = text;
  box.appendChild(user);
  const ai = document.createElement("div");
  ai.className = "bubble ai";
  ai.innerHTML = knowledgeReplyHtml(text);
  box.appendChild(ai);
  box.scrollTop = box.scrollHeight;
}

document.getElementById("knowledge-send")?.addEventListener("click", () => {
  const input = document.getElementById("knowledge-ask");
  const text = (input?.value || "").trim();
  if (!text) return;
  input.value = "";
  knowledgeReply(text);
});

document.getElementById("knowledge-ask")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    document.getElementById("knowledge-send")?.click();
  }
});

document.getElementById("cockpit-send")?.addEventListener("click", () => {
  const input = document.getElementById("cockpit-ask");
  const text = (input?.value || "").trim();
  if (!text) return;
  input.value = "";
  cockpitReply(text);
});

document.getElementById("cockpit-ask")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    document.getElementById("cockpit-send")?.click();
  }
});

document.getElementById("cockpit-msgs")?.addEventListener("click", (e) => {
  const prompt = e.target.closest("[data-cockpit-prompt]");
  if (!prompt) return;
  const map = {
    next: "下一步怎么推进",
    doubt: "打开审计指引",
    draft: "去发现取证智能体",
    docs: "打开项目资料",
  };
  if (prompt.dataset.cockpitPrompt === "docs") fieldpackState.openList = true;
  cockpitReply(map[prompt.dataset.cockpitPrompt] || prompt.textContent.trim());
});

renderDetect();
renderPolicies();
renderCockpit();
setScene("home");

/* ========== AI风控预警监管平台（穿透式监管风险块 + 前瞻预警） ========== */
let regulatePath = [];

const REGULATE_RISKS = [
  {
    id: "equity",
    title: "产权穿透",
    level: "高",
    summary: "子企业、SPE、最终受益人不可见或股权链条断裂。",
    warn: "3 户四级及以下企业未入主数据",
    detail: "对照穿透式监管「主体穿透」要求：全级次股权与最终受益人应可查。预警侧重层级衰减、影子公司、代持迹象。",
    sources: ["工商股权图谱", "集团主数据", "并表范围清单"],
    children: [
      {
        id: "equity-spe",
        title: "特殊目的实体 / 代持",
        level: "高",
        summary: "SPE 与代持线索导致受益人不可溯。",
        warn: "2 条代持关键词命中合同侧备注",
        detail: "下钻核验：工商显名股东与资金出资人是否一致；合同收款账户是否第三方。",
        sources: ["工商变更", "银行流水对手", "合同收款账户"],
        children: [
          {
            id: "equity-spe-cash",
            title: "资金出资人不一致",
            level: "高",
            summary: "显名股东未出资，实际出资来自集团外自然人账户。",
            warn: "预警：受益人穿透失败",
            detail: "建议：冻结相关股权变更审批；移送内控评价缺陷；审计形成取证单。",
            sources: ["银企流水", "验资报告", "股权转让协议"],
          },
        ],
      },
      {
        id: "equity-orphan",
        title: "并表外经营实体",
        level: "中",
        summary: "实际经营但未纳入并表与主数据。",
        warn: "1 户门店级主体有收入无股权节点",
        detail: "核验是否应并表或应注销；补录入主数据。",
        sources: ["收入明细", "税务登记", "并表清单"],
      },
    ],
  },
  {
    id: "invest",
    title: "投资穿透",
    level: "高",
    summary: "重大投资缺可研 / 越权审批 / 决策链不可追。",
    warn: "1,200 万对外投资缺完整决策包",
    detail: "前瞻预警：投资立项金额跃迁、可研缺失、事后补批。",
    sources: ["投资台账", "党委会/董事会纪要", "可研与评估"],
    children: [
      {
        id: "invest-post",
        title: "事后补批投资",
        level: "高",
        summary: "资金已支付，纪要晚于付款。",
        warn: "付款早于纪要 18 天",
        detail: "红线场景：违规决策迹象。建议提级查办并回写责任追究模型。",
        sources: ["付款凭证", "会议纪要日期", "审批流"],
      },
    ],
  },
  {
    id: "finance",
    title: "财务与核算穿透",
    level: "中",
    summary: "口径不一致、跨级报表不可对碰、收入利润不可比。",
    warn: "4 家子公司收入确认政策不一致",
    detail: "统一指标口径是穿透地基；口径漂移触发集团级预警。",
    sources: ["核算系统", "会计政策清单", "合并抵消底稿"],
    children: [
      {
        id: "finance-cut",
        title: "跨期收入切割异常",
        level: "中",
        summary: "季末收入脉冲与合同进度不匹配。",
        warn: "3 月末收入环比 +62%",
        detail: "下钻合同进度与验收单；必要时延伸虚假贸易模型。",
        sources: ["收入明细", "合同进度", "验收单"],
      },
    ],
  },
  {
    id: "treasury",
    title: "资金穿透",
    level: "高",
    summary: "司库未覆盖、账外循环、资金池外循环。",
    warn: "2 户重要子企业未进司库",
    detail: "资金流动可溯是底线。前瞻：大额互转、周末集中出账、对手循环。",
    sources: ["司库平台", "银企直连", "账套资金科目"],
    children: [
      {
        id: "treasury-loop",
        title: "往来互转闭环",
        level: "高",
        summary: "集团本部→供应商→关联方→回款，缺实质业务。",
        warn: "互转 2,480 万 · 无仓单",
        detail: "联动虚假贸易智能体；派单至审计与纪检会商。",
        sources: ["银行流水", "合同", "物流/仓单"],
        children: [
          {
            id: "treasury-loop-party",
            title: "对手穿透：海云 / 澜海",
            level: "高",
            summary: "对手股权与联系方式撞库，疑似同一实控。",
            warn: "关联采购 + 循环资金叠加",
            detail: "建议：暂停付款权限；生成取证清单；写入监管问题台账。",
            sources: ["工商关联", "电话邮箱撞库", "投标组合"],
          },
        ],
      },
    ],
  },
  {
    id: "finprod",
    title: "金融业务",
    level: "中",
    summary: "担保圈、融资通道、表外融资风险。",
    warn: "担保余额接近授权上限 92%",
    detail: "阈值预警：担保集中度、互保、通道费率异常。",
    sources: ["担保台账", "融资合同", "授权额度"],
    children: [
      {
        id: "finprod-guarantee",
        title: "互保链条",
        level: "中",
        summary: "A 保 B、B 保 C、C 保 A 形成圈。",
        warn: "圈内 3 户",
        detail: "压降互保；纳入风险全息画像。",
        sources: ["担保合同", "反担保", "征信"],
      },
    ],
  },
  {
    id: "procure",
    title: "采购与供应链",
    level: "高",
    summary: "围标串标、关联采购、验收缺失。",
    warn: "海云组合 11 个月中标 9 次",
    detail: "前瞻：分差过小、联系方式撞库、固定陪标三件套。",
    sources: ["招投标系统", "供应商主数据", "合同履约"],
    children: [
      {
        id: "procure-bid",
        title: "疑似围标组合",
        level: "高",
        summary: "固定三家、分差 <1.2、联系方式同源。",
        warn: "模型置信度 0.86",
        detail: "转招投标智能体复核；必要时延伸虚假贸易。",
        sources: ["评标明细", "投标文件元数据", "联系方式库"],
      },
    ],
  },
  {
    id: "contract",
    title: "合同穿透",
    level: "中",
    summary: "阴阳合同、关键条款缺失、付款与标的脱节。",
    warn: "运维合同 154 万无成果物条款",
    detail: "预警：无验收、无扣款、变更无审批。",
    sources: ["合同系统", "版本库", "付款计划"],
    children: [
      {
        id: "contract-deliver",
        title: "成果物条款缺失",
        level: "中",
        summary: "服务类合同缺交付物与验收标准。",
        warn: "已付 70% · 无巡检报告",
        detail: "暂停尾款；补签补充协议；回写内控缺陷。",
        sources: ["合同文本", "付款凭证", "验收记录"],
      },
    ],
  },
  {
    id: "overseas",
    title: "境外业务",
    level: "中",
    summary: "境外投资、资金与内控覆盖薄弱。",
    warn: "1 个境外主体报表滞后 45 天",
    detail: "全覆盖短板领域；预警报送迟滞与资金跨境异常。",
    sources: ["境外报表", "跨境资金", "境外内控评价"],
    children: [
      {
        id: "overseas-lag",
        title: "报表迟报",
        level: "中",
        summary: "超期未报触发迟报责任口径。",
        warn: "迟报风险",
        detail: "提级督办；记入监管评价扣分项。",
        sources: ["报送台账", "催报记录"],
      },
    ],
  },
  {
    id: "debt",
    title: "债务与过度负债",
    level: "中",
    summary: "资产负债率跃升、隐性债务、期限错配。",
    warn: "合并口径负债率较年初 +4.2pt",
    detail: "前瞻：短债长投、明股实债。",
    sources: ["合并报表", "融资台账", "有息负债"],
    children: [
      {
        id: "debt-short",
        title: "短债覆盖缺口",
        level: "中",
        summary: "一年内到期债务大于可变现流动资产。",
        warn: "覆盖倍数 0.82",
        detail: "启动流动性应急预案评估。",
        sources: ["到期债务表", "货币资金", "可变现资产"],
      },
    ],
  },
  {
    id: "pay",
    title: "薪酬与履职待遇",
    level: "低",
    summary: "超标准、体外发放、与考核脱钩。",
    warn: "2 笔履职待遇超标准待核",
    detail: "对接报销合规智能体；预警超标与拆分发放。",
    sources: ["薪酬系统", "报销系统", "考核结果"],
    children: [
      {
        id: "pay-split",
        title: "拆分发放迹象",
        level: "低",
        summary: "同事项多科目列支规避限额。",
        warn: "会议费+培训费交叉",
        detail: "生成退回清单。",
        sources: ["报销明细", "制度限额"],
      },
    ],
  },
  {
    id: "guarantee",
    title: "担保穿透",
    level: "中",
    summary: "超授权担保、互保、担保代偿风险。",
    warn: "1 笔担保未履行集体决策",
    detail: "与金融业务、债务领域联防。",
    sources: ["担保台账", "授权文件", "决策纪要"],
    children: [
      {
        id: "guarantee-over",
        title: "超授权担保",
        level: "高",
        summary: "单笔超集团授权标准。",
        warn: "越权风险",
        detail: "暂停新增担保；责任追究模型打标。",
        sources: ["授权矩阵", "担保合同"],
      },
    ],
  },
];

function findRegulateNode(path) {
  let nodes = REGULATE_RISKS;
  let cur = null;
  for (const id of path) {
    cur = nodes.find((n) => n.id === id);
    if (!cur) return null;
    nodes = cur.children || [];
  }
  return cur;
}

function regulateLevelTag(level) {
  const map = { 高: "risk", 中: "warn", 低: "ai" };
  return `<span class="tag ${map[level] || ""}">${level}</span>`;
}

function renderRegulate() {
  const warnEl = document.getElementById("regulate-warn");
  const crumbEl = document.getElementById("regulate-crumbs");
  const body = document.getElementById("regulate-body");
  if (!body) return;

  const topWarns = REGULATE_RISKS.filter((r) => r.level === "高").map((r) => r.warn);
  if (warnEl) {
    warnEl.innerHTML = `<div class="regulate-warn-inner"><span class="tag risk">前瞻预警</span>
      <b>今日高风险 ${topWarns.length} 条直达总部</b>
      <span>${topWarns.slice(0, 3).join(" · ")}</span>
      <button class="btn ghost sm" type="button" data-toast="已生成预警派单（示意）">一键派单</button>
    </div>`;
  }

  if (crumbEl) {
    const bits = [`<button type="button" data-regulate="home">风险总览</button>`];
    regulatePath.forEach((id, i) => {
      const n = findRegulateNode(regulatePath.slice(0, i + 1));
      if (n) bits.push(` / <button type="button" data-regulate-crumb="${i}">${n.title}</button>`);
    });
    crumbEl.innerHTML = bits.join("");
  }

  if (!regulatePath.length) {
    body.innerHTML = `<p class="pane-lead">依据穿透式监管重点领域分块监测（产权、投资、财务、资金、金融、采购供应链、合同、境外、债务、薪酬、担保）。点击卡片多层穿透；预警强调早发现、早处置。</p>
      <div class="apps regulate-grid">${REGULATE_RISKS.map(
        (r) => `<article class="app-card" data-regulate-open="${r.id}">
          <div class="app-ico">${r.title.slice(0, 1)}</div>
          <h3>${r.title} ${regulateLevelTag(r.level)}</h3>
          <p>${r.summary}</p>
          <div class="foot"><span class="tag warn">预警</span><span>${r.warn}</span></div>
        </article>`
      ).join("")}</div>
      <div class="cite" style="margin-top:14px">口径参考 · 国资穿透式监管指导意见及内控监督部署（主体/业务/风险穿透 · 事中预警）</div>`;
    return;
  }

  const node = findRegulateNode(regulatePath);
  if (!node) {
    regulatePath = [];
    renderRegulate();
    return;
  }

  const kids = node.children || [];
  body.innerHTML = `
    <div class="result-block">
      <h4>${node.title} ${regulateLevelTag(node.level)}</h4>
      <p>${node.detail || node.summary}</p>
      <p style="margin:8px 0 0"><span class="tag warn">预警</span> ${node.warn || "—"}</p>
      <p style="margin:8px 0 0;font-size:12px;color:var(--muted)"><b>数据来源</b>：${(node.sources || []).join(" · ")}</p>
    </div>
    ${
      kids.length
        ? `<h2 class="section-hd">继续穿透</h2>
      <div class="apps regulate-grid">${kids
        .map(
          (c) => `<article class="app-card" data-regulate-open="${c.id}">
          <div class="app-ico">${c.title.slice(0, 1)}</div>
          <h3>${c.title} ${regulateLevelTag(c.level)}</h3>
          <p>${c.summary}</p>
          <div class="foot"><span>下钻</span><span>进入 →</span></div>
        </article>`
        )
        .join("")}</div>`
        : `<div class="result-block" style="margin-top:12px"><h4>已至最深层</h4>
        <p>可派单至协审助手形成取证 / 写入监管问题台账，或转到对应专项智能体复核。</p>
        <div style="margin-top:8px">
          <button class="btn sm" type="button" data-view="assistant" data-scene="home">打开协审助手</button>
          <button class="btn ghost sm" type="button" data-view="app-trade">虚假贸易智能体</button>
          <button class="btn ghost sm" type="button" data-toast="已写入监管问题台账">写入台账</button>
        </div></div>`
    }`;
}

const SPECIAL_APPS = {
  "app-portrait": {
    title: "企业画像智能体",
    role: "汇集工商、股权、经营、诉讼与公开风险标签，输出体检结论；面向任意经营主体，不绑定单一审计项目。",
    prompts: ["生成主体风险体检", "列出关联企业与实控线索", "导出可写入审前的画像摘要"],
    sources: ["工商公示", "司法公开", "招投标中标", "集团主数据（可选接入）"],
  },
  "app-supplier": {
    title: "供应商关联智能体",
    role: "以供应商/投标人为中心做股权、人员、联系方式与地址撞库，识别隐性关联与围标嫌疑组合。",
    prompts: ["同一实控人穿透", "电话邮箱地址撞库", "输出关联网络与证据要点"],
    sources: ["供应商主数据", "工商股权", "投标联系方式", "历史中标记录"],
  },
  "app-bid": {
    title: "招投标审计智能体",
    role: "识别围标串标、评分异常、高频中标与履约偏差，输出特征底稿素材。",
    prompts: ["扫描围标三件套特征", "分差与报价规律异常", "高频中标主体清单"],
    sources: ["招投标系统", "评标明细", "投标文件元数据", "合同履约"],
  },
  "app-contract": {
    title: "合同审查智能体",
    role: "抽取关键条款，复核多版本与付款合规，发现成果物/验收/扣款缺口。",
    prompts: ["抽取验收与成果物条款", "比对合同版本 diff", "付款计划与标的是否匹配"],
    sources: ["合同文本/OCR", "版本库", "付款计划", "印章页"],
  },
  "app-risk": {
    title: "经营风险智能体",
    role: "从偿债、盈利质量、关联交易与资金链压力生成风险雷达，强调前瞻预警。",
    prompts: ["输出风险雷达", "列出资金链压力指标", "关联交易异常切片"],
    sources: ["财务报表", "有息负债", "关联交易台账", "现金流"],
  },
  "app-trade": {
    title: "虚假贸易智能体",
    role: "识别循环贸易、货物流与资金流错配、即进即出与通道业务。",
    prompts: ["同日进销扫描", "无仓单无物流清单", "通道加价无服务"],
    sources: ["进销存", "发票", "银行流水", "物流/仓单"],
  },
  "app-eng": {
    title: "工程审计智能体",
    role: "核合同包、变更签证、概算执行与结算，识别超概与拆分发包。",
    prompts: ["超概变更清单", "签证与监理日志矛盾", "拆分发包嫌疑包件"],
    sources: ["工程合同", "变更签证", "监理日志", "结算送审"],
  },
  "app-policy-impl": {
    title: "政策落实智能体",
    role: "跟踪重大政策部署、资金配套与执行偏差，对接政策解读库。",
    prompts: ["政策任务分解对照", "资金配套到位率", "执行偏差清单"],
    sources: ["政策文本", "任务台账", "预算下达", "执行反馈"],
  },
  "app-meeting": {
    title: "会议纪要智能体",
    role: "综合分析纪要，提炼决议、待办、未闭环与「有资金无依据」事项。",
    prompts: ["提取未闭环决议", "大额支出议题汇总", "有资金无成果物事项"],
    sources: ["会议纪要文本", "附件清单", "议题编号"],
  },
  "app-expense": {
    title: "报销合规智能体",
    role: "对照制度核验单据：超标准、交叉列支、票事不符。",
    prompts: ["会议培训交叉列支", "超标准住宿", "发票与事由日期矛盾"],
    sources: ["报销系统", "差旅/会议制度", "发票验真"],
  },
};

function paintSpecialAgentChrome(viewId) {
  const meta = SPECIAL_APPS[viewId];
  const root = document.getElementById(viewId);
  if (!meta || !root) return;
  let box = root.querySelector(".special-agent-chrome");
  if (!box) {
    box = document.createElement("div");
    box.className = "special-agent-chrome result-block";
    const head = root.querySelector(".page-head");
    if (head) head.insertAdjacentElement("afterend", box);
    else root.prepend(box);
  }
  box.innerHTML = `<h4>${meta.title}</h4>
    <p><b>做什么</b>：${meta.role}</p>
    <p style="margin:8px 0 0"><b>提示</b>：${meta.prompts.map((p) => `「${p}」`).join(" ")}</p>
    <p style="margin:8px 0 0;font-size:12px;color:var(--muted)"><b>数据来源</b>：${meta.sources.join(" · ")}</p>
    <p style="margin:8px 0 0;font-size:12px;color:var(--muted)">独立于具体审计项目运行；结果可按需写入任一项目资料或底稿。</p>`;
}

