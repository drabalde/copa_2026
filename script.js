fetch("dados.json")
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

function atualizarContagem() {
  const inicioCopa = new Date("2026-06-11T16:00:00-03:00").getTime();
  const agora = new Date().getTime();
  const distancia = inicioCopa - agora;

  if (distancia <= 0) {
    document.getElementById("days").innerText = "00";
    document.getElementById("hours").innerText = "00";
    document.getElementById("minutes").innerText = "00";
    document.getElementById("seconds").innerText = "00";
    return;
  }

  const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((distancia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((distancia / (1000 * 60)) % 60);
  const segundos = Math.floor((distancia / 1000) % 60);

  document.getElementById("days").innerText = String(dias).padStart(2, "0");
  document.getElementById("hours").innerText = String(horas).padStart(2, "0");
  document.getElementById("minutes").innerText = String(minutos).padStart(2, "0");
  document.getElementById("seconds").innerText = String(segundos).padStart(2, "0");
}

setInterval(atualizarContagem, 1000);
atualizarContagem();