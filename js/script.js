var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
});

const questionarios = document.querySelectorAll(".questionario");

function esconderRespostas(questionarios) {

  questionarios.forEach(q => {
    const pergunta = q.childNodes[1];
    const icone = pergunta.childNodes[1];
    q.style.height = `${pergunta.clientHeight + 10}px`;
    if(!q.classList.contains("fechado")) {
      q.classList.remove("aberto");
      q.classList.add("fechado");
    }

    if(!icone.classList.contains("bi-caret-right-fill")) {
      icone.classList.remove("bi-caret-down-fill");
      icone.classList.add("bi-caret-right-fill");
    }
  });

};

function atribuirEventoClique(questionarios) {

  questionarios.forEach(q => {
    const pergunta = q.childNodes[1];
    const icone = pergunta.childNodes[1];
    const resposta = q.childNodes[3];

    pergunta.addEventListener('click', e => {
      const isFechado = q.classList.contains("fechado");
      q.style.height = isFechado ? `${q.clientHeight + resposta.clientHeight + 10}px` : `${pergunta.clientHeight + 10}px`;
      q.classList.remove( isFechado ? "fechado" : "aberto");
      q.classList.add(isFechado ? "aberto" : "fechado");
      icone.classList.remove(isFechado ? "bi-caret-right-fill" : "bi-caret-down-fill");
      icone.classList.add(isFechado ? "bi-caret-down-fill" : "bi-caret-right-fill");  
    });
  });

}

esconderRespostas(questionarios);
atribuirEventoClique(questionarios);

window.addEventListener("resize", () => {
  esconderRespostas(questionarios);
});

const btnMobile = document.getElementById('menu-mobile');

function toggleMenu() {
  const nav = document.getElementById('nav');
  nav.classList.toggle('aberto');
}

btnMobile.addEventListener('click', toggleMenu);