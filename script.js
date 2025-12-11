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
  <p><b>Q: 为什么期权会每天掉价？</b><br>
  因为 Theta（时间价值衰减），到期越近，价值消失越快。</p>
  
  <p><b>Q: 为什么今天买 0.14 比昨天 0.16 更划算？</b><br>
  你少付了时间成本。昨天买早一天，并没有优势。</p>
  
  <p><b>Q: 什么时候不能买期权？</b><br>
  横盘、弱趋势 + 快到期、重大事件前（IV 高）。</p>
  
  <p><b>Q: 什么是强上涨？</b><br>
  连续大阳线、低回调、下午强势、放量上涨。</p>
  
  <p><b>Q: 弱上涨是什么？为什么难赚钱？</b><br>
  上涨太慢，不足以抵消 Theta → 期权继续掉价。</p>
  
  <p><b>Q: SPY 涨了，我的期权却跌？</b><br>
  因为涨得太弱 + 时间损耗 + IV 下跌，三者都可能让期权变便宜。</p>
  
  <p><b>Q: 为什么 OTM（远价外）期权很便宜？</b><br>
  因为行权价太远，市场认为“很难到达”，所以定价低。</p>
  
  <p><b>Q: 到期不卖会怎样？</b><br>
  如果没到达行权价 → 归零。</p>
  
  <p><b>Q: 什么时候最适合买 CALL？</b><br>
  当评分 ≥ 5：强趋势（强上涨 + 市场同步）。</p>
  
  <p><b>Q: 什么时候可以买 PUT？</b><br>
  评分 ≤ -5：强下跌 + 恐慌增强。</p>
  
  <p><b>Q: 为什么散户大多数亏？</b><br>
  没有系统、情绪化、盯盘过度、不懂 Theta。</p>
  
  <p><b>Q: 这套系统能让我赚很多吗？</b><br>
  它能让你避免亏钱行为，获得统计优势，收益来自长期坚持。</p>


`;
