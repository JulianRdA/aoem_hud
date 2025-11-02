const gods = ['poseidon', 'zeus', 'hades', 'ra', 'isis', 'set', 'thor', 'odin', 'loki', 'freyr', 'kronos', 'oranos', 'gaia', 'nuwa', 'fuxi', 'shennong', 'amaterasu', 'tsukuyomi', 'susanoo'];
const maps = ['random', 'acropolis', 'air', 'alfheim', 'anatolia', 'archipelago', 'arena', 'asograsslands', 'bamboogrove', 'blacksea', 'bluelagoon', 'elysium', 'erebus', 'ghostlake', 'giza', 'goldrush', 'highland', 'ironwood', 'islands', 'jotunheim', 'kerlaugar', 'kii', 'landunknown', 'landnomad', 'marsh', 'mediterranean', 'megalopolis', 'midgard', 'mirage', 'mirkwood', 'mountolympus', 'muspellheim', 'nileshallows', 'nomad', 'oasis', 'okuchichibu', 'peachblossomland', 'rivernile', 'riverstyx', 'savannah', 'seaofworms', 'senjogahara', 'setonaikai', 'silkroad', 'snakedance', 'steppe', 'teammigration', 'tundra', 'valleyofkings', 'vindlandsaga', 'wateringhole', 'yellowriver'];

window.onload = () => {

  carregarItens('god', 1);
  carregarItens('god', 2);
  carregarItens('map', 1);
  carregarItens('map', 2);

  // Restaurar dados do localStorage, se houver
  const salvos = localStorage.getItem("dadosInterface");
  if (salvos) {
    const linhas = JSON.parse(salvos);
    let dados = {};
    linhas.forEach(linha => {
      const [chave, valor] = linha.split('=');
      if (chave && valor !== undefined) dados[chave.trim()] = valor.trim();
    });

    if (dados.jogador_1) {
      document.getElementById("jogador1").value = dados.jogador_1;
      document.querySelector(".jogadorv1").textContent = `${dados.jogador_1} Venceu`;
    }

    if (dados.jogador_2) {
      document.getElementById("jogador2").value = dados.jogador_2;
      document.querySelector(".jogadorv2").textContent = `${dados.jogador_2} Venceu`;
    }

    // Restaurar campos básicos
    if (dados.logo_camp) document.getElementById("logo_camp").value = dados.logo_camp;
    if (dados.fase) document.getElementById("fase").value = dados.fase;
    if (dados.mapa) document.getElementById("mapaSelect").value = dados.mapa;

    if (dados.interface) document.getElementById("interface").value = dados.interface;
    if (dados.letreiro) document.getElementById("letreiro").value = dados.letreiro;
    if (dados.flagE) {
      const cor1 = dados.flagE.replace('flagE_', '');
      document.getElementById('cor1').value = cor1;
    }
    if (dados.flagD) {
      const cor2 = dados.flagD.replace('flagD_', '');
      document.getElementById('cor2').value = cor2;
    }

    if (dados.gods) {
      const [g1, g2] = dados.gods.split(',');
      document.getElementById("versusSelect1").value = g1;
      document.getElementById("versusSelect2").value = g2;
    }

    if (dados.placar_1) document.getElementById("placar1").textContent = dados.placar_1;
    if (dados.placar_2) document.getElementById("placar2").textContent = dados.placar_2;

    if (dados.jogador_1) document.getElementById("jogador1").value = dados.jogador_1;
    if (dados.jogador_2) document.getElementById("jogador2").value = dados.jogador_2;

    if (dados.pais_1) {
      document.getElementById("pais1").value = dados.pais_1;
      atualizarBandeira("pais1", "bandeira1");
    }
    if (dados.pais_2) {
      document.getElementById("pais2").value = dados.pais_2;
      atualizarBandeira("pais2", "bandeira2");
    }

    // Restaurar draft gods e mapas para jogadores 1 e 2
    restaurarDraft(1, 'god', dados);
    restaurarDraft(1, 'map', dados);
    restaurarDraft(2, 'god', dados);
    restaurarDraft(2, 'map', dados);
  }
};

function atualizarImagem(selectId, imgId) {
  const cor = document.getElementById(selectId).value;
  const img = document.getElementById(imgId);

  if (!img) return;

  // Define tipo com base no selectId (não no imgId)
  let tipo = '';
  if (imgId === 'cor1') tipo = 'flagE';
  else if (imgId === 'cor2') tipo = 'flagD';

  if (cor) {
    img.src = `assets/color_side/${tipo}_${cor}.png`;
  } else {
    img.src = "";
  }
}

function atualizarBandeira(selectId, imgId) {
  const pais = document.getElementById(selectId).value;
  const img = document.getElementById(imgId);
  if (pais) {
    img.src = `assets/country_flags/${pais}.png`;
    img.alt = pais;
  } else {
    img.src = "";
    img.alt = "";
  }
}

function atualizarNomesDosBotoes() {
  const nome1 = document.getElementById("jogador1").value || "Jogador 1";
  const nome2 = document.getElementById("jogador2").value || "Jogador 2";

  document.querySelector(".jogadorv1").textContent = `${nome1} Venceu`;
  document.querySelector(".jogadorv2").textContent = `${nome2} Venceu`;
}

function carregarItens(tipo, jogador) {
  const container = document.querySelector(`.${tipo}-grid[data-jogador="${jogador}"]`);
  const itens = tipo === 'god' ? gods : maps;
  const pasta = tipo === 'god' ? 'gods' : 'mapas';

  itens.forEach(nome => {
    const img = document.createElement('img');
    img.src = `${pasta}/${nome}.png`;
    img.alt = nome;
    img.dataset.nome = nome;
    img.dataset.estado = '';
    img.classList.add('item-img');

    img.onclick = () => {
      alternarEstadoImagem(img, 'pick', pasta);
    };

    img.oncontextmenu = (e) => {
      e.preventDefault();
      alternarEstadoImagem(img, 'ban', pasta);
    };

    container.appendChild(img);
  });
}

function atualizarLetreiroComNomes() {
  const nome1 = document.getElementById("jogador1").value || "Player 1";
  const nome2 = document.getElementById("jogador2").value || "Player 2";

  const letreiroSelect = document.getElementById("letreiro");
  letreiroSelect.options[0].textContent = `${nome1} | ${nome2}`;
  letreiroSelect.options[1].textContent = `${nome2} | ${nome1}`;
}


function alternarEstadoImagem(img, tipo, pasta) {
  const nome = img.dataset.nome;
  const estadoAtual = img.dataset.estado;

  if (tipo === 'pick') {
    if (estadoAtual === 'pick') {
      img.src = `${pasta}/${nome}.png`;
      img.dataset.estado = '';
    } else {
      img.src = `${pasta}/${nome}_p.png`;
      img.dataset.estado = 'pick';
    }
  } else if (tipo === 'ban') {
    if (estadoAtual === 'ban') {
      img.src = `${pasta}/${nome}.png`;
      img.dataset.estado = '';
    } else {
      img.src = `${pasta}/${nome}_b.png`;
      img.dataset.estado = 'ban';
    }
  }
}

function registrarResultado(vencedorId) {
  const mapa = document.getElementById("mapaSelect").value;
  const g1 = document.getElementById("versusSelect1").value.replace("_1", "");
  const g2 = document.getElementById("versusSelect2").value.replace("_2", "");
  const j1 = document.getElementById("jogador1").value || "Jogador 1";
  const j2 = document.getElementById("jogador2").value || "Jogador 2";

  if (!vencedorId || !mapa === "null" || g1 === "null" || g2 === "null") {
    alert("Preencha todos os campos corretamente para registrar o resultado.");
    return;
  }

  // Atualiza o placar direto no DOM
  const placar1El = document.getElementById("placar1");
  const placar2El = document.getElementById("placar2");

  if (vencedorId === 1) {
    placar1El.textContent = parseInt(placar1El.textContent) + 1;
  } else {
    placar2El.textContent = parseInt(placar2El.textContent) + 1;
  }

  const valorJogador1 = "A";
  const valorJogador2 = "B";
  const vencedorValor = vencedorId === 1 ? valorJogador1 : valorJogador2;
  const vencedorNome = vencedorId === 1 ? j1 : j2;
  const vencedorGod = vencedorId === 1 ? g1 : g2;
  const perdedorGod = vencedorId === 1 ? g2 : g1;

  const novaPartida = `${vencedorNome}:${vencedorGod},${perdedorGod},${mapa},${vencedorValor}`;
  // Carrega dados existentes
  const salvos = localStorage.getItem("dadosInterface");
  const linhas = salvos ? JSON.parse(salvos) : [];
  const dados = {};
  linhas.forEach(linha => {
    const [chave, valor] = linha.split('=');
    if (chave && valor !== undefined) dados[chave.trim()] = valor.trim();
  });

  // Atualiza placar no objeto de dados
  if (vencedorId === 1) {
    placar1El.textContent = parseInt(placar1El.textContent);
  } else {
    placar2El.textContent = parseInt(placar2El.textContent);
  }
  dados["placar_1"] = placar1El.textContent;
  dados["placar_2"] = placar2El.textContent;

  // Registra a nova partida
  for (let i = 1; i <= 9; i++) {
    const partida = dados[`partida${i}`];
    const textoLimpo = partida ? partida.replace(/^\d+\.\s*/, "") : "";
    if (!textoLimpo || textoLimpo === ":,") {
      dados[`partida${i}`] = novaPartida;
      break;
    }
  }

  // Atualiza localStorage e salva no txt
  const novasLinhas = Object.entries(dados).map(([k, v]) => {
    if (k.startsWith("partida")) {
      const num = k.replace("partida", "");
      const semPrefixo = v.replace(/^\d+\.\s*/, ""); // remove "1. ", "2. ", etc.
      return `${k}= ${num}. ${semPrefixo}`;
    }
    return `${k}= ${v}`;
  });

  localStorage.setItem("dadosInterface", JSON.stringify(novasLinhas));

  const blob = new Blob([novasLinhas.join("\n")], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "dados.txt";
  link.click();
}

function limparMarcacoes(jogador) {
  ['god', 'map'].forEach(tipo => {
    const pasta = tipo === 'god' ? 'gods' : 'mapas';
    const imgs = document.querySelectorAll(`.${tipo}-grid[data-jogador="${jogador}"] .item-img`);
    imgs.forEach(img => {
      const nome = img.dataset.nome;
      img.src = `${pasta}/${nome}.png`;
      img.dataset.estado = '';
    });
  });
}


function salvarDadosLocal() {
  // mesma lógica de salvarDados, mas só salva no localStorage, sem criar arquivo
  const dados = [];

  function coletarDraft(jogador, tipo) {
    const pasta = tipo === 'god' ? 'gods' : 'mapas';
    const imagens = document.querySelectorAll(`.${tipo}-grid[data-jogador="${jogador}"] .item-img`);
    const picks = [];
    const bans = [];

    imagens.forEach(img => {
      const nome = img.dataset.nome;
      const estado = img.dataset.estado;
      if (estado === 'pick') picks.push(`${nome}_p`);
      if (estado === 'ban') bans.push(`${nome}_b`);
    });

    return [...picks, ...bans];
  }

  dados.push(`interface= ${document.getElementById('interface').value}`);
  dados.push(`letreiro= ${document.getElementById('letreiro').value}`);
  dados.push(`logo_camp= ${document.getElementById('logo_camp').value}`);
  dados.push(`fase= ${document.getElementById('fase').value}`);

  dados.push(`mapa= ${document.getElementById('mapaSelect').value}`);
  const g1 = document.getElementById('versusSelect1').value || "null_1";
  const g2 = document.getElementById('versusSelect2').value || "null_2";
  dados.push(`gods= ${g1},${g2}`);

  dados.push(`placar_1= ${document.getElementById('placar1').textContent}`);
  dados.push(`jogador_1= ${document.getElementById('jogador1').value}`);
  dados.push(`pais_1= ${document.getElementById('pais1').value}`);
  dados.push(`gods_1= ${coletarDraft(1, 'god').join(',') || 'null'}`);
  dados.push(`maps_1= ${coletarDraft(1, 'map').join(',') || 'null'}`);

  dados.push(`placar_2= ${document.getElementById('placar2').textContent}`);
  dados.push(`jogador_2= ${document.getElementById('jogador2').value}`);
  dados.push(`pais_2= ${document.getElementById('pais2').value}`);
  dados.push(`gods_2= ${coletarDraft(2, 'god').join(',') || 'null'}`);
  dados.push(`maps_2= ${coletarDraft(2, 'map').join(',') || 'null'}`);

  localStorage.setItem("dadosInterface", JSON.stringify(dados));
}

// === Carregar dados do localStorage ao abrir a página ===
window.addEventListener("DOMContentLoaded", () => {
  const dadosSalvos = localStorage.getItem("dadosInterface");
  if (!dadosSalvos) return;

  const linhas = JSON.parse(dadosSalvos);
  const mapa = {};

  // Converte o array salvo (ex: ["letreiro= player 1 | player 2", ...]) em chave/valor
  linhas.forEach(linha => {
    const [chave, valor] = linha.split("=").map(s => s.trim());
    mapa[chave] = valor;
  });

  // Restaura os principais campos
  if (mapa.interface) document.getElementById("interface").value = mapa.interface;
  if (mapa.letreiro) document.getElementById("letreiro").value = mapa.letreiro;
  if (mapa.logo_camp) document.getElementById("logo_camp").value = mapa.logo_camp;
  if (mapa.fase) document.getElementById("fase").value = mapa.fase;
  if (mapa.mapa) document.getElementById("mapaSelect").value = mapa.mapa;

  if (mapa.jogador_1) document.getElementById("jogador1").value = mapa.jogador_1;
  if (mapa.jogador_2) document.getElementById("jogador2").value = mapa.jogador_2;
  if (mapa.pais_1) document.getElementById("pais1").value = mapa.pais_1;
  if (mapa.pais_2) document.getElementById("pais2").value = mapa.pais_2;

  // Atualiza letreiro visualmente
  if (typeof atualizarLetreiroComNomes === "function") {
    atualizarLetreiroComNomes();
  }

  console.log("✅ Dados restaurados do localStorage");
});


function salvarDados() {
  const dados = [];

  function coletarDraft(jogador, tipo) {
    const pasta = tipo === 'god' ? 'gods' : 'mapas';
    const imagens = document.querySelectorAll(`.${tipo}-grid[data-jogador="${jogador}"] .item-img`);
    const picks = [];
    const bans = [];

    imagens.forEach(img => {
      const nome = img.dataset.nome;
      const estado = img.dataset.estado;
      if (estado === 'pick') picks.push(`${nome}_p`);
      if (estado === 'ban') bans.push(`${nome}_b`);
    });

    return [...picks, ...bans]; // picks primeiro, depois bans
  }


  dados.push(`letreiro= ${document.getElementById('letreiro').value}`);

  dados.push(`\nlogo_camp= ${document.getElementById('logo_camp').value}`);
  dados.push(`fase= ${document.getElementById('fase').value}`);

  dados.push(`\nmapa= ${document.getElementById('mapaSelect').value}`);
  const g1 = document.getElementById('versusSelect1').value || "null_1";
  const g2 = document.getElementById('versusSelect2').value || "null_2";
  dados.push(`gods= ${g1},${g2}`);

  dados.push(`\nplacar_1= ${document.getElementById('placar1').textContent}`);
  dados.push(`jogador_1= ${document.getElementById('jogador1').value}`);
  dados.push(`pais_1= ${document.getElementById('pais1').value}`);
  dados.push(`gods_1= ${coletarDraft(1, 'god').join(',') || 'null'}`);
  dados.push(`maps_1= ${coletarDraft(1, 'map').join(',') || 'null'}`);

  dados.push(`\nplacar_2= ${document.getElementById('placar2').textContent}`);
  dados.push(`jogador_2= ${document.getElementById('jogador2').value}`);
  dados.push(`pais_2= ${document.getElementById('pais2').value}`);
  dados.push(`gods_2= ${coletarDraft(2, 'god').join(',') || 'null'}`);
  dados.push(`maps_2= ${coletarDraft(2, 'map').join(',') || 'null'}`);

  const cor1 = document.getElementById('cor1').value || 'null';
  const cor2 = document.getElementById('cor2').value || 'null';
  dados.push(`cor1=${cor1}`);
  dados.push(`cor2=${cor2}`);


  // Recupera partidas anteriores do localStorage
  const salvosAntigos = localStorage.getItem("dadosInterface");
  const linhasAntigas = salvosAntigos ? JSON.parse(salvosAntigos) : [];
  const partidasExistentes = linhasAntigas.filter(l => l.trim().startsWith("partida"));

  // Adiciona as partidas existentes ao novo conjunto de dados
  dados.push(...partidasExistentes);

  // Atualiza localStorage e arquivo
  localStorage.setItem("dadosInterface", JSON.stringify(dados));

  const blob = new Blob([dados.join("\n")], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "dados.txt";
  link.click();

}

function limparDados() {
  if (!confirm("Quer mesmo limpar todos os dados?")) return;

  const salvos = localStorage.getItem("dadosInterface");
  let linhas = salvos ? JSON.parse(salvos) : [];

  // Preserva apenas logo_camp e fase
  const preservados = {};
  linhas.forEach(linha => {
    const [chave, valor] = linha.split('=');
    if (chave && valor !== undefined) {
      if (chave.trim() === 'logo_camp' || chave.trim() === 'fase') {
        preservados[chave.trim()] = valor.trim();
      }
    }
  });

  // Limpa localStorage
  localStorage.removeItem("dadosInterface");

  // Grava os campos preservados de volta
  const novasLinhas = [];
  if (preservados.logo_camp) novasLinhas.push(`logo_camp= ${preservados.logo_camp}`);
  if (preservados.fase) novasLinhas.push(`fase= ${preservados.fase}`);
  localStorage.setItem("dadosInterface", JSON.stringify(novasLinhas));

  // Limpa os campos visualmente (exceto logo_camp e fase)
  document.getElementById("mapaSelect").value = "null";
  document.getElementById("versusSelect1").value = "null";
  document.getElementById("versusSelect2").value = "null";
  document.getElementById("placar1").textContent = "0";
  document.getElementById("placar2").textContent = "0";
  document.getElementById("jogador1").value = "";
  document.getElementById("jogador2").value = "";
  document.getElementById("pais1").value = "null";
  document.getElementById("pais2").value = "null";
  document.getElementById("bandeira1").src = "null";
  document.getElementById("bandeira2").src = "null";
  document.getElementById("interface").value = "1";
  document.getElementById("letreiro").value = "1";

  // Limpa os drafts
  limparMarcacoes(1);
  limparMarcacoes(2);

  location.reload();
}

function restaurarDraft(jogador, tipo, dados) {
  const container = document.querySelector(`.${tipo}-grid[data-jogador="${jogador}"]`);
  const linhaKey = tipo === 'god' ? `gods_${jogador}` : `maps_${jogador}`;
  const lista = (dados[linhaKey] || '').split(',').filter(x => x);

  if (!container) return;

  const imgs = container.querySelectorAll('.item-img');
  imgs.forEach(img => {
    const nome = img.dataset.nome;
    const pick = lista.includes(`${nome}_p`);
    const ban = lista.includes(`${nome}_b`);
    if (pick) {
      img.src = `${tipo === 'god' ? 'gods' : 'maps'}/${nome}_p.png`;
      img.dataset.estado = 'pick';
    } else if (ban) {
      img.src = `${tipo === 'god' ? 'gods' : 'maps'}/${nome}_b.png`;
      img.dataset.estado = 'ban';
    } else {
      img.src = `${tipo === 'god' ? 'gods' : 'maps'}/${nome}.png`;
      img.dataset.estado = '';
    }
  });
}

async function importarDraftAoE2CM() {
  const link = document.getElementById("draftLink").value.trim();
  if (!link) {
    alert("Cole o link do draft do aoe2cm.net antes de importar.");
    return;
  }

  const match = link.match(/draft\/([A-Za-z0-9_-]+)/);
  if (!match) {
    alert("Link inválido. O formato deve ser como: https://aoe2cm.net/draft/xxxxx");
    return;
  }

  const draftId = match[1];
  const apiUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://aoe2cm.net/api/draft/${draftId}`)}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Erro ao buscar o draft");
    const draft = await response.json();

    // === Jogadores ===
    const jogador1 = draft.nameHost || "Jogador 1";
    const jogador2 = draft.nameGuest || "Jogador 2";

    document.getElementById("jogador1").value = jogador1;
    document.getElementById("jogador2").value = jogador2;
    atualizarNomesDosBotoes();
    atualizarLetreiroComNomes();

    // === Função para normalizar nomes ===
    const normalizarNome = (id) => {
      if (!id) return "";
      return id
        .replace(/^aomgods\./i, "") // remove prefixo
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
        .toLowerCase(); // minúsculas
    };

    // === Eventos (picks e bans) ===
    const events = draft.events || [];
    const picks1 = [], picks2 = [];
    const bans1 = [], bans2 = [];

    events.forEach(ev => {
      const player = ev.player;
      const type = (ev.actionType || "").toLowerCase();
      const god = normalizarNome(ev.chosenOptionId);

      if (!god) return;

      if (player === "HOST") {
        if (type === "pick") picks1.push(`${god}_p`);
        if (type === "ban") bans1.push(`${god}_b`);
      } else if (player === "GUEST") {
        if (type === "pick") picks2.push(`${god}_p`);
        if (type === "ban") bans2.push(`${god}_b`);
      }
    });

    console.log("Host picks:", picks1);
    console.log("Guest picks:", picks2);
    console.log("Host bans:", bans1);
    console.log("Guest bans:", bans2);

    // === Atualiza HUD ===
    function aplicarDraft(jogador, tipo, picks, bans) {
      const pasta = tipo === 'god' ? 'gods' : 'mapas';
      const container = document.querySelector(`.${tipo}-grid[data-jogador="${jogador}"]`);
      if (!container) return;
      const imgs = container.querySelectorAll('.item-img');

      imgs.forEach(img => {
        const nome = img.dataset.nome;
        if (picks.includes(`${nome}_p`)) {
          img.src = `${pasta}/${nome}_p.png`;
          img.dataset.estado = 'pick';
        } else if (bans.includes(`${nome}_b`)) {
          img.src = `${pasta}/${nome}_b.png`;
          img.dataset.estado = 'ban';
        } else {
          img.src = `${pasta}/${nome}.png`;
          img.dataset.estado = '';
        }
      });
    }

    aplicarDraft(1, 'god', picks1, bans1);
    aplicarDraft(2, 'god', picks2, bans2);

    alert(`✅ Draft importado!\n${jogador1} vs ${jogador2}\nPicks e bans aplicados com sucesso.`);
  } catch (err) {
    console.error(err);
    alert("❌ Falha ao importar o draft. Verifique o link e tente novamente.");
  }
}

async function importarDraftMapas() {
  const link = document.getElementById("draftLinkMapas").value.trim();
  if (!link) {
    alert("Cole o link do draft de MAPAS do aoe2cm.net antes de importar.");
    return;
  }

  const match = link.match(/draft\/([A-Za-z0-9_-]+)/);
  if (!match) {
    alert("Link inválido. O formato deve ser como: https://aoe2cm.net/draft/xxxxx");
    return;
  }

  const draftId = match[1];
  const apiUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://aoe2cm.net/api/draft/${draftId}`)}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Erro ao buscar o draft");
    const draft = await response.json();

    const jogador1 = draft.nameHost || "Jogador 1";
    const jogador2 = draft.nameGuest || "Jogador 2";

    // === Normaliza nomes de mapas ===
    const normalizarNome = (id) => {
      if (!id) return "";
      return id
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/\s+/g, "") // remove espaços
        .toLowerCase(); // minúsculas
    };

    const events = draft.events || [];
    const picks1 = [], picks2 = [];
    const bans1 = [], bans2 = [];

    events.forEach(ev => {
      const player = ev.player;
      const type = (ev.actionType || "").toLowerCase();
      const mapa = normalizarNome(ev.chosenOptionId);

      if (!mapa) return;

      if (player === "HOST") {
        if (type === "pick") picks1.push(`${mapa}_p`);
        if (type === "ban") bans1.push(`${mapa}_b`);
      } else if (player === "GUEST") {
        if (type === "pick") picks2.push(`${mapa}_p`);
        if (type === "ban") bans2.push(`${mapa}_b`);
      }
    });

    console.log("Mapas HOST picks:", picks1);
    console.log("Mapas GUEST picks:", picks2);
    console.log("Mapas HOST bans:", bans1);
    console.log("Mapas GUEST bans:", bans2);

    function aplicarDraftMapas(jogador, picks, bans) {
      const container = document.querySelector(`.map-grid[data-jogador="${jogador}"]`);
      if (!container) return;
      const imgs = container.querySelectorAll('.item-img');

      imgs.forEach(img => {
        const nome = img.dataset.nome.toLowerCase().replace(/\s+/g, "");
        if (picks.includes(`${nome}_p`)) {
          img.src = `mapas/${nome}_p.png`;
          img.dataset.estado = 'pick';
        } else if (bans.includes(`${nome}_b`)) {
          img.src = `mapas/${nome}_b.png`;
          img.dataset.estado = 'ban';
        } else {
          img.src = `mapas/${nome}.png`;
          img.dataset.estado = '';
        }
      });
    }

    aplicarDraftMapas(1, picks1, bans1);
    aplicarDraftMapas(2, picks2, bans2);

    alert(`✅ Draft de mapas importado com sucesso!\n${jogador1} vs ${jogador2}`);
  } catch (err) {
    console.error(err);
    alert("❌ Falha ao importar o draft de mapas. Verifique o link e tente novamente.");
  }
}