// ==============================
// 1. AI 趋势评分
// ==============================
function calculate() {
  const fg = Number(document.getElementById("fg").value);
  const pcr = Number(document.getElementById("pcr").value);
  const vix = Number(document.getElementById("vix").value);
  const us10y = Number(document.getElementById("us10y").value);
  const trend = Number(document.getElementById("trend").value);

  let score = 0;

  // Fear & Greed
  if (fg > 60) score += 2;
  else if (fg < 30) score -= 2;

  // Put/Call Ratio
  if (pcr < 0.8) score += 2;
  else if (pcr > 1.1) score -= 2;

  // VIX
  if (vix < 13) score += 1;
  else if (vix > 18) score -= 1;

  // 10Y
  if (us10y < 3.8) score += 1;
  else if (us10y > 4.2) score -= 1;

  // Trend Input
  score += trend;

  let suggestion = "";
  if (score >= 5) suggestion = "🔥 强看涨 — 可考虑 CALL（强趋势）";
  else if (score >= 1) suggestion = "📈 弱看涨 — CALL 仅小仓位（练习单）";
  else if (score <= -5) suggestion = "⚠️ 强看跌 — PUT（强趋势）";
  else if (score <= -1) suggestion = "📉 弱看跌 — PUT（小仓位）";
  else suggestion = "⛔ 横盘区间，不建议买入任何期权";

  document.getElementById("result").innerHTML =
    `<h3>趋势评分：${score}</h3><p>${suggestion}</p>`;
}


// ==============================
// 2. LocalStorage 私有交易记录
// ==============================
let trades = JSON.parse(localStorage.getItem("myTrades") || "[]");
renderTrades();

function addTrade() {
  const t = {
    type: document.getElementById("tradeType").value,
    underlying: document.getElementById("underlying").value,
    strike: document.getElementById("strike").value,
    premium: document.getElementById("premium").value,
    time: new Date().toLocaleString()
  };

  trades.push(t);
  localStorage.setItem("myTrades", JSON.stringify(trades));
  renderTrades();
}

function renderTrades() {
  let html = "";
  trades.forEach((t) => {
    html += `<li>${t.time} — ${t.type} @${t.strike}  成本 ${t.premium}</li>`;
  });
  document.getElementById("tradeList").innerHTML = html;
}


// ==============================
// 3. FAQ 注入
// ==============================
document.getElementById("faqContent").innerHTML = `
  <p><b>Q: 为什么昨天 0.16，今天变 0.14？</b><br>
  时间价值（Theta）消耗导致。</p>

  <p><b>Q: 今天买是不是更划算？</b><br>
  是的，因为成本更低，承担同样未来风险。</p>

  <p><b>Q: 横盘能不能买？</b><br>
  不行。横盘期权必亏。</p>

  <p><b>Q: 强上涨和弱上涨的区别？</b><br>
  弱上涨难赚，强上涨才是期权爆发点。</p>

  <p><b>Q: 交易记录会不会被别人看到？</b><br>
  不会，仅保存在本机 LocalStorage。</p>
`;
