/* BioVitta - JavaScript principal */
const PRODUCTS = [
  {id:1,name:"Dipirona Monoidratada 500mg Medley 20 Comprimidos",category:"Medicamentos",price:6.99,oldPrice:12.90,tag:"Oferta 24h",image:"assets/product-dipirona.svg"},
  {id:2,name:"Protetor Solar Facial La Roche-Posay Anthelios Airlicium FPS 60 40g",category:"Perfumaria & Cosméticos",price:89.90,tag:"Mais Vendido",image:"assets/product-solar.svg"},
  {id:3,name:"Desodorante Aerossol Rexona Men Impacto 150ml",category:"Cuidados Diários",price:14.90,oldPrice:18.50,image:"assets/product-rexona.svg"},
  {id:4,name:"Fralda Pampers Premium Care Tamanho M 80 Unidades",category:"Infantil",price:109.90,tag:"Frete Grátis",image:"assets/product-pampers.svg"},
  {id:5,name:"Vitamina C Enervit 1g 10 Comprimidos Efervescentes",category:"Suplementos & Vitaminas",price:19.90,image:"assets/product-vitc.svg"}
];

const WHATSAPP = "5519992990839";
let cart = JSON.parse(localStorage.getItem("biovitta-cart") || "[]");
let activeCategory = "Todos";
let currentSearch = "";

const money = value => value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const getProduct = id => PRODUCTS.find(p => p.id === Number(id));

function saveCart(){ localStorage.setItem("biovitta-cart", JSON.stringify(cart)); }
function toast(message){
  const el=document.getElementById("toast"); if(!el)return;
  el.textContent=message; el.classList.add("show");
  clearTimeout(window.__toastTimer); window.__toastTimer=setTimeout(()=>el.classList.remove("show"),2500);
}
function whatsappLink(product){
  const text=`Olá, gostaria de pedir o produto: ${product.name}`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}
function renderProducts(){
  const grid=document.getElementById("produtos"); if(!grid)return;
  const q=currentSearch.trim().toLowerCase();
  const filtered=PRODUCTS.filter(p =>
    (activeCategory==="Todos" || p.category===activeCategory) &&
    (!q || `${p.name} ${p.category}`.toLowerCase().includes(q))
  );
  grid.innerHTML=filtered.map(p=>`
    <article class="product-card">
      <div class="product-media">
        ${p.tag?`<span class="product-tag">${p.tag}</span>`:""}
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <div>${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:""}<div class="price">${money(p.price)}</div></div>
        <div class="product-actions">
          <button class="btn btn-primary btn-buy" data-add="${p.id}" type="button">Adicionar ao carrinho</button>
          <a class="whatsapp-btn" href="${whatsappLink(p)}" target="_blank" rel="noopener">Pedir pelo WhatsApp</a>
        </div>
      </div>
    </article>`).join("");
  document.getElementById("emptyState")?.classList.toggle("hidden", filtered.length>0);
}
function cartQuantity(){return cart.reduce((sum,item)=>sum+item.qty,0)}
function addToCart(id){
  const item=cart.find(i=>i.id===id);
  if(item)item.qty++;
  else cart.push({id,qty:1});
  saveCart(); renderCart(); toast("Produto adicionado ao carrinho.");
}
function changeQty(id,delta){
  const item=cart.find(i=>i.id===id); if(!item)return;
  item.qty+=delta; if(item.qty<=0)cart=cart.filter(i=>i.id!==id);
  saveCart(); renderCart();
}
function renderCart(){
  const count=document.getElementById("cartCount"), items=document.getElementById("cartItems"), total=document.getElementById("cartTotal");
  if(!items)return;
  count.textContent=cartQuantity();
  if(!cart.length){
    items.innerHTML='<div class="cart-empty">Seu carrinho está vazio.<br>Adicione produtos para começar.</div>';
    total.textContent=money(0); return;
  }
  let sum=0;
  items.innerHTML=cart.map(item=>{
    const p=getProduct(item.id); const subtotal=p.price*item.qty; sum+=subtotal;
    return `<div class="cart-item">
      <img src="${p.image}" alt="">
      <div><div class="cart-item-name">${p.name}</div><div class="cart-item-price">${money(p.price)} cada</div>
      <div class="qty"><button type="button" data-minus="${p.id}" aria-label="Diminuir">−</button><strong>${item.qty}</strong><button type="button" data-plus="${p.id}" aria-label="Aumentar">+</button></div></div>
      <button class="remove-item" type="button" data-remove="${p.id}">Remover</button>
    </div>`;
  }).join("");
  total.textContent=money(sum);
}
function openCart(){document.getElementById("cartOverlay")?.classList.remove("hidden");document.body.style.overflow="hidden"}
function closeCart(){document.getElementById("cartOverlay")?.classList.add("hidden");document.body.style.overflow=""}
function checkout(){
  if(!cart.length){toast("Adicione pelo menos um produto ao carrinho.");return}
  const lines=cart.map(item=>{const p=getProduct(item.id);return `• ${item.qty}x ${p.name} — ${money(p.price*item.qty)}`});
  const total=cart.reduce((s,i)=>s+getProduct(i.id).price*i.qty,0);
  const text=`Olá, BioVitta! Gostaria de finalizar meu pedido:%0A${encodeURIComponent(lines.join("\n"))}%0A%0ATotal estimado: ${encodeURIComponent(money(total))}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${text}`,"_blank","noopener");
}
function setupStore(){
  renderProducts();renderCart();
  document.getElementById("produtos")?.addEventListener("click",e=>{const btn=e.target.closest("[data-add]");if(btn)addToCart(Number(btn.dataset.add))});
  document.getElementById("cartItems")?.addEventListener("click",e=>{
    const minus=e.target.closest("[data-minus]"),plus=e.target.closest("[data-plus]"),remove=e.target.closest("[data-remove]");
    if(minus)changeQty(Number(minus.dataset.minus),-1);
    if(plus)changeQty(Number(plus.dataset.plus),1);
    if(remove)changeQty(Number(remove.dataset.remove),-999);
  });
  document.getElementById("cartBtn")?.addEventListener("click",openCart);
  document.getElementById("closeCart")?.addEventListener("click",closeCart);
  document.getElementById("cartOverlay")?.addEventListener("click",e=>{if(e.target.id==="cartOverlay")closeCart()});
  document.getElementById("checkoutWhatsapp")?.addEventListener("click",checkout);
  document.querySelectorAll(".chip").forEach(chip=>chip.addEventListener("click",()=>{
    activeCategory=chip.dataset.category;
    document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c===chip));
    renderProducts();
  }));
  document.querySelectorAll("[data-category]").forEach(link=>link.addEventListener("click",e=>{
    if(!link.classList.contains("chip")){
      activeCategory=link.dataset.category;
      document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c.dataset.category===activeCategory));
      setTimeout(renderProducts,0);
    }
  }));
  document.getElementById("clearFilters")?.addEventListener("click",()=>{activeCategory="Todos";currentSearch="";const s=document.getElementById("searchInput");if(s)s.value="";document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c.dataset.category==="Todos"));renderProducts()});
  document.getElementById("searchForm")?.addEventListener("submit",e=>{
    e.preventDefault();currentSearch=document.getElementById("searchInput").value;activeCategory="Todos";
    document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c.dataset.category==="Todos"));
    if(location.pathname.endsWith("trabalhe-conosco.html")) location.href=`index.html?busca=${encodeURIComponent(currentSearch)}#ofertas`;
    else {renderProducts();document.getElementById("ofertas")?.scrollIntoView({behavior:"smooth"})}
  });
  const params=new URLSearchParams(location.search);if(params.get("busca")){currentSearch=params.get("busca");const s=document.getElementById("searchInput");if(s)s.value=currentSearch;renderProducts()}
}
function setupMenu(){
  const toggle=document.getElementById("menuToggle"), nav=document.getElementById("navLinks");
  toggle?.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open))});
  document.querySelectorAll(".dropdown-btn").forEach(btn=>btn.addEventListener("click",()=>btn.parentElement.classList.toggle("open")));
}
function setupHero(){
  const title=document.getElementById("heroTitle");if(!title)return;
  const slides=[
    ["BIOVITTA • ATENDIMENTO 24H","Saúde e bem-estar quando você precisar.","Peça seus produtos pelo WhatsApp e conte com atendimento rápido em Piracicaba.","Pedir pelo WhatsApp"],
    ["CUIDADO TODOS OS DIAS","Seu cuidado começa com praticidade.","Encontre medicamentos, cuidados diários, beleza, vitaminas e itens infantis.","Ver ofertas"],
    ["FALE COM A BIOVITTA","Atendimento próximo, simples e humano.","Nossa equipe está disponível todos os dias para orientar seu pedido.","Falar com a equipe"]
  ];
  let index=0;
  const dots=[...document.querySelectorAll(".hero-dots button")];
  const render=()=>{const s=slides[index];document.getElementById("heroEyebrow").textContent=s[0];title.textContent=s[1];document.getElementById("heroText").textContent=s[2];const c=document.getElementById("heroCta");c.textContent=s[3];c.href=index===1?"#ofertas":`https://wa.me/${WHATSAPP}`;c.target=index===1?"":"_blank";dots.forEach((d,i)=>d.classList.toggle("active",i===index))};
  dots.forEach((d,i)=>d.addEventListener("click",()=>{index=i;render()}));setInterval(()=>{index=(index+1)%slides.length;render()},5000);
}
function validateCareer(){
  const form=document.getElementById("careerForm");if(!form)return;
  const status=document.getElementById("formStatus");
  const setError=(id,msg)=>{const input=document.getElementById(id);const el=document.querySelector(`[data-error-for="${id}"]`);input?.classList.toggle("invalid",Boolean(msg));if(el)el.textContent=msg||""};
  document.getElementById("telefone")?.addEventListener("input",e=>{
    let v=e.target.value.replace(/\D/g,"").slice(0,11);
    if(v.length>10)v=v.replace(/^(\d{2})(\d{5})(\d{4}).*/,"($1) $2-$3");
    else if(v.length>6)v=v.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/,"($1) $2-$3");
    else if(v.length>2)v=v.replace(/^(\d{2})(\d{0,5})/,"($1) $2");
    e.target.value=v;
  });
  form.addEventListener("submit",e=>{
    e.preventDefault();status.className="form-status";status.textContent="";
    ["nome","telefone","email","curriculo","consentimento"].forEach(id=>setError(id,""));
    let valid=true;
    const nome=document.getElementById("nome"),tel=document.getElementById("telefone"),email=document.getElementById("email"),file=document.getElementById("curriculo"),cons=document.getElementById("consentimento");
    if(nome.value.trim().length<3){setError("nome","Informe seu nome completo.");valid=false}
    if(tel.value.replace(/\D/g,"").length<10){setError("telefone","Informe um telefone válido.");valid=false}
    if(!email.validity.valid){setError("email","Informe um e-mail válido.");valid=false}
    if(!file.files.length){setError("curriculo","Anexe seu currículo.");valid=false}
    else {
      const f=file.files[0], ext=f.name.toLowerCase().split(".").pop();
      if(!["pdf","docx"].includes(ext)){setError("curriculo","Aceitamos apenas PDF ou DOCX.");valid=false}
      else if(f.size>5*1024*1024){setError("curriculo","O arquivo deve ter no máximo 5 MB.");valid=false}
    }
    if(!cons.checked){setError("consentimento","É necessário aceitar o uso dos dados.");valid=false}
    if(!valid){status.textContent="Revise os campos destacados.";status.classList.add("error");return}
    status.textContent="Cadastro validado no navegador. Para armazenar currículo de verdade, conecte o formulário a um backend ou serviço de formulários conforme indicado no HTML.";
    status.classList.add("success");
    toast("Candidatura validada com sucesso.");
  });
}
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll("#year").forEach(el=>el.textContent=new Date().getFullYear());
  setupMenu();setupStore();setupHero();validateCareer();
});
