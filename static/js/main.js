"use strict";

// ── Constante ──────────────────────────────────
const FATOR_ARROBA = 15;

// ── DOM ────────────────────────────────────────
const elPeso          = document.getElementById("pesoBoi");
const elPreco         = document.getElementById("precoArroba");
const elRendimento    = document.getElementById("rendimento");
const elRendRange     = document.getElementById("rendimentoRange");
const elBtnCalc       = document.getElementById("btnCalcular");
const elBtnReset      = document.getElementById("btnReset");
const elBtnTheme      = document.getElementById("btnTheme");
const elThemeIcon     = document.getElementById("themeIcon");
const elAlertError    = document.getElementById("alertError");
const elErrorMsg      = document.getElementById("errorMsg");
const elRefsList      = document.getElementById("refsList");
const elPlaceholder   = document.getElementById("resultsPlaceholder");
const elResultContent = document.getElementById("resultsContent");
const elHistSection   = document.getElementById("historySection");
const elHistList      = document.getElementById("historyList");
const elBtnClearHist  = document.getElementById("btnClearHistory");
const elBtnLabel      = elBtnCalc.querySelector(".btn-label");
const elBtnLoading    = elBtnCalc.querySelector(".btn-loading");

// ── Estado ─────────────────────────────────────
let historico = [];
let _tema = "light";

// ── Formatação ─────────────────────────────────
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency", currency: "BRL",
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });
}
function formatarNum(num, decimais = 2) {
  const d = Math.max(0, Math.min(20, Math.round(decimais)));
  return parseFloat(num.toFixed(d)).toLocaleString("pt-BR", {
    minimumFractionDigits: d, maximumFractionDigits: d
  });
}

// ── Loading ────────────────────────────────────
function setBotaoLoading(on) {
  elBtnLabel.hidden   = on;
  elBtnLoading.hidden = !on;
  elBtnCalc.disabled  = on;
}

// ── Alertas ────────────────────────────────────
function mostrarErro(msg) {
  elErrorMsg.textContent = msg;
  elAlertError.hidden = false;
  elAlertError.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
function limparErro() {
  elAlertError.hidden = true;
  elErrorMsg.textContent = "";
}

// ── Range ↔ Input ──────────────────────────────
elRendRange.addEventListener("input", () => { elRendimento.value = elRendRange.value; });
elRendimento.addEventListener("input", () => {
  const v = parseFloat(elRendimento.value);
  if (!isNaN(v) && v >= 20 && v <= 75) elRendRange.value = v;
});

// ── Tema ───────────────────────────────────────
elBtnTheme.addEventListener("click", () => {
  _tema = _tema === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", _tema);
  elThemeIcon.className = _tema === "dark" ? "ti ti-sun" : "ti ti-moon";
});

// ── Cotações de referência ─────────────────────
async function carregarCotacoes() {
  try {
    const resp = await fetch("/cotacao-referencia");
    const data = await resp.json();
    if (data.sucesso && data.referencias.length) {
      elRefsList.innerHTML = "";
      data.referencias.forEach((ref) => {
        const item = document.createElement("div");
        item.className = "ref-item";
        item.title = `Clique para usar ${formatarMoeda(ref.preco)}/@ como preço`;
        item.innerHTML = `<span>${ref.regiao}</span><span class="ref-price">${formatarMoeda(ref.preco)}/@</span>`;
        item.addEventListener("click", () => {
          elPreco.value = ref.preco.toFixed(2);
          elPreco.style.boxShadow = "0 0 0 3px rgba(58,117,80,.25)";
          setTimeout(() => { elPreco.style.boxShadow = ""; }, 800);
        });
        elRefsList.appendChild(item);
      });
    }
  } catch {
    elRefsList.innerHTML = `<span class="ref-loading">Não foi possível carregar cotações.</span>`;
  }
}

// ── Validação frontend ─────────────────────────
function validarFormulario() {
  const peso  = elPeso.value.trim();
  const preco = elPreco.value.trim();
  if (!peso)                         { mostrarErro("Informe o peso do animal em quilogramas."); elPeso.focus(); return false; }
  if (isNaN(+peso) || +peso <= 0)    { mostrarErro("Peso inválido. Informe um número positivo (ex: 480)."); elPeso.focus(); return false; }
  if (+peso > 2000)                  { mostrarErro("Peso incomum (>2.000 kg). Verifique o valor."); elPeso.focus(); return false; }
  if (!preco)                        { mostrarErro("Informe o preço atual da arroba em R$."); elPreco.focus(); return false; }
  if (isNaN(+preco) || +preco <= 0)  { mostrarErro("Preço inválido. Informe um número positivo (ex: 290)."); elPreco.focus(); return false; }
  return true;
}

// ── Exibição dos resultados ────────────────────
function exibirResultados(data) {
  const r = data.resultado, e = data.entrada;
  document.getElementById("resultTimestamp").textContent  = data.timestamp;
  document.getElementById("rValorTotal").textContent      = formatarMoeda(r.valor_carcaca);
  document.getElementById("rBaseCarcaca").textContent     = `Baseado em ${formatarNum(r.arrobas_carcaca)} @ | Rendimento ${e.rendimento}%`;
  document.getElementById("rArrobasVivo").textContent     = `${formatarNum(r.arrobas_vivo)} @`;
  document.getElementById("rArrobasCarcaca").textContent  = `${formatarNum(r.arrobas_carcaca)} @`;
  document.getElementById("rPesoCarcaca").textContent     = `${formatarNum(r.peso_carcaca, 1)} kg`;
  document.getElementById("rPrecoPorKg").textContent      = formatarMoeda(r.preco_por_kg);
  document.getElementById("tArrobasVivo").textContent     = `${formatarNum(r.arrobas_vivo)} @`;
  document.getElementById("tValorVivo").textContent       = formatarMoeda(r.valor_vivo);
  document.getElementById("tArrobasCarcaca").textContent  = `${formatarNum(r.arrobas_carcaca)} @`;
  document.getElementById("tValorCarcaca").textContent    = formatarMoeda(r.valor_carcaca);
  document.getElementById("tRendBadge").textContent       = `${e.rendimento}%`;
  elPlaceholder.hidden   = true;
  elResultContent.hidden = false;
}

// ── Histórico ──────────────────────────────────
function adicionarAoHistorico(data) {
  const r = data.resultado, e = data.entrada;
  historico.unshift({ timestamp: data.timestamp, peso: e.peso_kg, preco: e.preco_arroba, rendimento: e.rendimento, arrobasVivo: r.arrobas_vivo, valorTotal: r.valor_carcaca });
  if (historico.length > 12) historico.pop();
  renderizarHistorico();
  elHistSection.hidden = false;
}
function renderizarHistorico() {
  elHistList.innerHTML = "";
  historico.forEach((h) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `
      <div class="history-meta">
        <span><i class="ti ti-clock" style="font-size:12px"></i> ${h.timestamp}</span>
        <span>Rend. ${h.rendimento}%</span>
      </div>
      <div class="history-main">
        <span class="history-peso">${h.peso.toLocaleString("pt-BR")} kg · R$ ${h.preco.toFixed(2)}/@</span>
        <span class="history-valor">${formatarMoeda(h.valorTotal)}</span>
      </div>
      <div class="history-arrobas">
        <i class="ti ti-scale" style="font-size:12px"></i>
        ${formatarNum(h.arrobasVivo)} arrobas (peso vivo)
      </div>`;
    elHistList.appendChild(div);
  });
}
elBtnClearHist.addEventListener("click", () => {
  historico = []; elHistList.innerHTML = ""; elHistSection.hidden = true;
});

// ── Reset ──────────────────────────────────────
function resetarFormulario() {
  elPeso.value = ""; elPreco.value = "";
  elRendimento.value = "52"; elRendRange.value = "52";
  limparErro();
  elResultContent.hidden = true;
  elPlaceholder.hidden   = false;
  elPeso.focus();
}
elBtnReset.addEventListener("click", resetarFormulario);
elBtnCalc.addEventListener("click", calcular);

function inicializarApp() {
  carregarCotacoes();
  resetarFormulario();
}

inicializarApp();

// ── Calcular (chama API Flask) ─────────────────
async function calcular() {
  limparErro();
  if (!validarFormulario()) return;
  setBotaoLoading(true);
  try {
    const payload = {
      peso_kg:      parseFloat(elPeso.value),
      preco_arroba: parseFloat(elPreco.value),
      rendimento:   parseFloat(elRendimento.value) || 52
    };
    const resp = await fetch("/calcular", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await resp.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      console.error("Falha ao parsear JSON da resposta:", e, text);
      mostrarErro("Resposta inválida do servidor.");
      return;
    }

    if (!resp.ok) {
      console.error("Resposta não-ok:", resp.status, data);
      mostrarErro((data && data.erro) ? data.erro : `Erro do servidor (${resp.status}).`);
      return;
    }

    if (!data || !data.sucesso) {
      mostrarErro((data && data.erro) ? data.erro : "Erro desconhecido.");
      return;
    }

    try {
      exibirResultados(data);
      adicionarAoHistorico(data);
      if (window.innerWidth < 769) elResultContent.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (e) {
      console.error("Erro ao exibir/processar resultados:", e);
      mostrarErro("Erro ao processar resultados.");
    }
  } catch (e) {
    console.error("Erro na requisição /calcular:", e);
    // Fallback: realizar cálculo no cliente quando o backend não responder corretamente
    try {
      const peso = parseFloat(elPeso.value);
      const preco = parseFloat(elPreco.value);
      const rendimento = parseFloat(elRendimento.value) || 52;
      const arrobas_vivo = peso / FATOR_ARROBA;
      const valor_vivo = arrobas_vivo * preco;
      const peso_carcaca = peso * (rendimento / 100.0);
      const arrobas_carc = peso_carcaca / FATOR_ARROBA;
      const valor_carcaca = arrobas_carc * preco;
      const preco_por_kg = preco / FATOR_ARROBA;
      const agora = new Date();
      const timestamp = agora.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const localData = {
        sucesso: true,
        timestamp,
        entrada: { peso_kg: peso, preco_arroba: preco, rendimento },
        resultado: {
          arrobas_vivo:    parseFloat(arrobas_vivo.toFixed(4)),
          valor_vivo:      parseFloat(valor_vivo.toFixed(2)),
          peso_carcaca:    parseFloat(peso_carcaca.toFixed(2)),
          arrobas_carcaca: parseFloat(arrobas_carc.toFixed(4)),
          valor_carcaca:   parseFloat(valor_carcaca.toFixed(2)),
          preco_por_kg:    parseFloat(preco_por_kg.toFixed(4)),
          fator_arroba:    FATOR_ARROBA
        }
      };
      console.info("Usando fallback client-side (backend indisponível)");
      exibirResultados(localData);
      adicionarAoHistorico(localData);
    } catch (err2) {
      console.error("Fallback também falhou:", err2);
      mostrarErro("Não foi possível efetuar o cálculo (erro no servidor e no fallback).");
    }
  } finally {
    setBotaoLoading(false);
  }
}

// ── Eventos ───────────────────────────────────
elBtnCalc.addEventListener("click", calcular);
[elPeso, elPreco, elRendimento].forEach((el) => {
  el.addEventListener("keydown", (e) => { if (e.key === "Enter") calcular(); });
});

// ── Init ───────────────────────────────────────
(function init() {
  carregarCotacoes();
  elPeso.focus();
})();
