fetch(`dados.json?v=${Date.now()}`, { cache: "no-store" })
  .then(response => response.json())
  .then(data => {

    // ===== CONFIG =====

    const valorPorParticipante = data.valorPorParticipante;
    const participantes = data.participantesPagos;

    const total = valorPorParticipante * participantes;

    const premioPrincipal = total * 0.60;
    const premioCampeao = total * 0.20;
    const premioArtilheiro = total * 0.10;
    const premioGoleiro = total * 0.10;

    // ===== TOP CARDS =====

    const cards = document.querySelectorAll(".value");

    if(cards.length >= 5){

      cards[0].innerText =
        premioPrincipal.toLocaleString("pt-BR", {
          style:"currency",
          currency:"BRL"
        });

      cards[1].innerText =
        premioCampeao.toLocaleString("pt-BR", {
          style:"currency",
          currency:"BRL"
        });

      cards[2].innerText =
        premioArtilheiro.toLocaleString("pt-BR", {
          style:"currency",
          currency:"BRL"
        });

      cards[3].innerText =
        premioGoleiro.toLocaleString("pt-BR", {
          style:"currency",
          currency:"BRL"
        });

      cards[4].innerText = participantes;

    }

    // ===== RANKING =====

    const tbody = document.querySelector("tbody");

    tbody.innerHTML = "";

    data.ranking
      .sort((a,b) => b.pontos - a.pontos)
      .forEach((player,index) => {

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td class="rank">${index + 1}</td>
        <td>${player.nome}</td>
        <td>${player.pontos}</td>
        <td>${player.campeao}</td>
        <td>${player.artilheiro}</td>
        <td>${player.goleiro}</td>
      `;

      tbody.appendChild(tr);

    });

    // ===== JOGOS =====

    const gamesContainer = document.querySelector(".games");

    gamesContainer.innerHTML = "";

    data.jogosBrasil.forEach(jogo => {

      const card = document.createElement("div");

      card.className = "game-card";

      let tags = "";

      if(jogo.acertadores.length > 0){

        jogo.acertadores.forEach(nome => {

          tags += `<span class="tag">${nome}</span>`;

        });

      }else{

        tags = `<span style="color:#8ea3c0;">Ainda sem acertadores</span>`;

      }

      card.innerHTML = `
        <div class="fase">${jogo.fase}</div>

        <div class="jogo">
          ${jogo.jogo}
        </div>

        <div class="resultado">
          <span>Resultado</span>
          <strong>${jogo.resultado}</strong>
        </div>

        <div class="acertadores">
          <strong>Acertadores:</strong><br>
          ${tags}
        </div>
      `;

      gamesContainer.appendChild(card);

    });

  })
  .catch(error => {

    console.error("Erro ao carregar dados:", error);

  });

  const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSf60yjepXJCZlNm_utFqVvtkH5EJxs7Zl9kIcrzHi0YUxCuaQ/formResponse";

const palpiteForm = document.getElementById("palpiteForm");

if (palpiteForm) {
  palpiteForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formMsg = document.getElementById("formMsg");
    formMsg.innerText = "Enviando palpite...";

    const formData = new FormData();

    formData.append("entry.2005620554", document.getElementById("nome").value);
    formData.append("entry.1045781291", "");
    formData.append("entry.1166974658", document.getElementById("telefone").value);

    formData.append("entry.1073835788", document.getElementById("campeao").value);
    formData.append("entry.652600989", document.getElementById("vice").value);
    formData.append("entry.423639897", document.getElementById("artilheiro").value);
    formData.append("entry.1509334487", document.getElementById("goleiro").value);

    formData.append("entry.346244626", document.getElementById("brasilMarrocos").value);
    formData.append("entry.1227593723", document.getElementById("brasilHaiti").value);
    formData.append("entry.734359384", document.getElementById("escociaBrasil").value);

    await fetch(FORM_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });

    formMsg.innerText = "✅ Palpite enviado com sucesso! Agora envie o comprovante do Pix.";

    palpiteForm.reset();
  });
}

const jogosBrasil = [
  {
    titulo: "Brasil x Marrocos — 13/06 às 19h",
    data: "2026-06-13T19:00:00-03:00"
  },
  {
    titulo: "Brasil x Haiti — 19/06 às 22h",
    data: "2026-06-19T22:00:00-03:00"
  },
  {
    titulo: "Escócia x Brasil — 24/06 às 19h",
    data: "2026-06-24T19:00:00-03:00"
  }
];

function buscarProximoJogo() {
  const agora = new Date();

  return jogosBrasil.find(jogo => {
    return new Date(jogo.data) > agora;
  });
}


const BOLAO_API_URL = "https://script.google.com/macros/s/hum/exec";

async function carregarDadosBolao() {
  try {
    const resposta = await fetch(BOLAO_API_URL);
    const dados = await resposta.json();

    preencherUltimoJogoBrasil(dados.ultimoJogoBrasil);
    preencherRanking(dados.ranking);
    preencherAtualizacao(dados.atualizadoEm);
  } catch (erro) {
    console.error("Erro ao carregar dados do bolão:", erro);

    const rankingBody = document.getElementById("rankingBody");
    if (rankingBody) {
      rankingBody.innerHTML = `
        <tr>
          <td colspan="6">Não foi possível carregar o ranking agora.</td>
        </tr>
      `;
    }
  }
}

function preencherUltimoJogoBrasil(jogo) {
  const container = document.getElementById("ultimoJogoBrasil");

  if (!container) return;

  if (!jogo) {
    container.innerHTML = "Nenhum jogo do Brasil encontrado na planilha.";
    return;
  }

  const placarTexto = jogo.placar
    ? `<strong>${jogo.placar}</strong>`
    : `<span>Placar ainda não informado</span>`;

  container.innerHTML = `
    <div class="ultimo-jogo-titulo">🇧🇷 Último jogo do Brasil</div>
    <div class="ultimo-jogo-times">${jogo.timeCasa} x ${jogo.timeFora}</div>
    <div class="ultimo-jogo-placar">${placarTexto}</div>
    <div class="ultimo-jogo-status">${jogo.status || ""}</div>
  `;
}

function preencherRanking(ranking) {
  const rankingBody = document.getElementById("rankingBody");

  if (!rankingBody) return;

  if (!ranking || ranking.length === 0) {
    rankingBody.innerHTML = `
      <tr>
        <td colspan="6">Nenhum participante no ranking ainda.</td>
      </tr>
    `;
    return;
  }

  rankingBody.innerHTML = "";

  ranking.forEach((item, index) => {
    const linha = document.createElement("tr");

    if (index === 0) linha.classList.add("top-1");
    if (index === 1) linha.classList.add("top-2");
    if (index === 2) linha.classList.add("top-3");

   const grupoClasse = normalizarClasseGrupo(item.grupo);

  linha.innerHTML = `
    <td>${item.posicao}</td>
    <td>${item.nome}</td>
    <td>${item.pontos}</td>
    <td>${item.exatos}</td>
    <td>${item.palpiteUltimoJogo || "-"}</td>
    <td>
      <span class="grupo-badge ${grupoClasse}">
        ${item.grupo || "-"}
      </span>
    </td>
  `;

    rankingBody.appendChild(linha);
  });
}

function preencherAtualizacao(dataIso) {
  const elemento = document.getElementById("rankingAtualizadoEm");

  if (!elemento || !dataIso) return;

  const data = new Date(dataIso);

  elemento.textContent = `Atualizado em ${data.toLocaleDateString("pt-BR")} às ${data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  })}`;
}

carregarDadosBolao();

setInterval(carregarDadosBolao, 10 * 60 * 1000);

function normalizarClasseGrupo(grupo) {
  const texto = String(grupo || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (texto.includes("pimenta")) return "grupo-pimenta";
  if (texto.includes("giv")) return "grupo-giv";
  if (texto.includes("gsd")) return "grupo-gsd";

  return "grupo-gft";
}


async function enviarPalpiteBrasil16(event) {
  event.preventDefault();

  const nome = document.getElementById("nomePalpite16").value.trim();
  const golsBrasil = document.getElementById("golsBrasil16").value;
  const golsJapao = document.getElementById("golsJapao16").value;
  const mensagem = document.getElementById("mensagemPalpite16");

  if (!nome || golsBrasil === "" || golsJapao === "") {
    mensagem.textContent = "Preencha todos os campos antes de enviar.";
    mensagem.style.color = "#ffdf00";
    return false;
  }

  mensagem.textContent = "Enviando palpite...";
  mensagem.style.color = "#ffdf00";

  const dados = new FormData();
  dados.append("entry.2005620554", nome);
  dados.append("entry.346244626", golsBrasil);
  dados.append("entry.1227593723", golsJapao);

  try {
    await fetch("https://docs.google.com/forms/d/e/1FAIpQLSeqTLiRrAM5F0bDgqVtwcKInoMPe9iXmhmLgAU6bNu4E0isjg/formResponse", {
      method: "POST",
      mode: "no-cors",
      body: dados
    });

    mensagem.textContent = "Palpite enviado com sucesso!";
    mensagem.style.color = "#00ff88";

    document.getElementById("formPalpiteBrasil16").reset();

  } catch (erro) {
    mensagem.textContent = "Erro ao enviar. Tente novamente.";
    mensagem.style.color = "#ff6666";
    console.error("Erro ao enviar palpite:", erro);
  }

  return false;
}