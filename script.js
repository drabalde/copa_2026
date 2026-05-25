fetch("dados.json")
  .then(response => response.json())
  .then(data => {

    // ===== CONFIG =====

    const valorPorParticipante = data.valorPorParticipante;
    const participantes = data.participantesPagos;

    const total = valorPorParticipante * participantes;

    const premioPrincipal = total * 0.60;
    const premioCampeao = total * 0.15;
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