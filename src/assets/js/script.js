(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
  key: process.env.SITE_API_KEY,
  v: "weekly",
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

function toggleMenu(e) {
  if (e.type == 'touchstart') e.preventDefault();
  const nav = document.getElementById('nav');
  nav.classList.toggle('aberto');
  const aberto = nav.classList.contains('aberto');
  e.currentTarget.setAttribute('aria-expanded', aberto);
  e.currentTarget.setAttribute('aria-label', `${aberto ? "Fechar" : "Abrir"} Menu`);
}

const mnuNavegacao = document.getElementById('menu');

const itensMenu = mnuNavegacao.childNodes;

itensMenu.forEach(i => { 
  if(i.nodeName == "LI") {
    i.addEventListener('click', toggleMenu);
  }
} );

btnMobile.addEventListener('click', toggleMenu);
btnMobile.addEventListener('touchstart', toggleMenu);

async function avaliacoes() {
  let contentString = "";
  const {Place} = await google.maps.importLibrary("places");
  
  const lugar = new Place({
    id: process.env.PLACE_ID,
  });
  
  await lugar.fetchFields({
    fields: ["reviews"],
  });
  
  if (lugar.reviews && lugar.reviews.length > 0) {
  
    for (let i = 0; i < lugar.reviews.length; i++) {
      let reviewRating = lugar.reviews[i].rating;
      let reviewText = !!lugar.reviews[i].text ?  lugar.reviews[i].text : "";
      let authorName = lugar.reviews[i].authorAttribution.displayName;
      let authorPhoto = lugar.reviews[i].authorAttribution.photoURI;
      let reviewPublishData = lugar.reviews[i].publishTime;
      let dataFormatada = formatarData(reviewPublishData);
  
      contentString += `<div class="slide swiper-slide">
            <img class="google" src="./src/assets/images/depoimentos/google.png"/>
            <p class="depoimentos-txt texto-justificado">${reviewText}</p>
            <div class="pessoa">
              <img src=${authorPhoto} />
              <div class="info-pessoa">
                <p class="nome-pessoa">${authorName}</p>
                <p class="func-pessoa">${dataFormatada}</p>
                <p class="aval-pessoa">${definirEstrelas(reviewRating)}</p>
              </div>
            </div>
          </div>`;
    } 
  } else {
    contentString = "Sem avaliações.";
  }
  
  console.log(contentString)
  
  document.getElementById("parentSlide").innerHTML+= contentString;
  
}

function formatarData(data) {
  const yyyy = data.getFullYear();
  let mm = data.getMonth() + 1;
  let dd = data.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const dataFormatada = dd + '/' + mm + '/' + yyyy;

  return dataFormatada;
}

function definirEstrelas(reviewRating) {
  let contentString = "";
  const maxStar = 5;
  const fullStar = `<i style="color: rgb(246, 187, 6)" class="bi bi-star-fill"></i>`;
  const halfStar = `<i style="color: rgb(246, 187, 6)" class="bi bi-star-half"></i>`
  const emptyStar = `<i style="color: rgb(246, 187, 6)" class="bi bi-star"></i>`;
  if(reviewRating === maxStar) {
    contentString = `${fullStar}
                     ${fullStar}
                     ${fullStar}
                     ${fullStar}
                     ${fullStar}`
  }
  else {
    const partesEstrelas = (reviewRating + "").split('.');
    const estrelasVazias = partesEstrelas.length > 1 ? (maxStar - partesEstrelas[0]) - 1 : maxStar - partesEstrelas[0];

    for(let i = 0; i < partesEstrelas[0]; i++) {
      contentString += `${fullStar}`;
    }

    if (partesEstrelas.length > 1) {
      contentString += `${halfStar}`
    }

    for(let i = 0; i < estrelasVazias; i++) {
      contentString += `${emptyStar}`
    }
  }

  return contentString
}

avaliacoes().then(e => {
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
  
});

