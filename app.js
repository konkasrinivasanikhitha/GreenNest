const $ = (s) => document.querySelector(s),
  $$ = (s) => document.querySelectorAll(s);
const get = (k, d) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
document.addEventListener(
  "error",
  (e) => {
    let img = e.target;
    if (img.tagName === "IMG" && !img.dataset.fallback) {
      img.dataset.fallback = "true";
      img.src = "assets/leafy.jpg";
    }
  },
  true,
);
const photos = [
  "assets/monstera.jpg",
  "assets/leafy.jpg",
  "assets/bird.jpg",
  "assets/peace.jpg",
  "assets/succulent.jpg",
];
const data = [
  ["Monstera Deliciosa", "Indoor", 899],
  ["Snake Plant", "Indoor", 549],
  ["Bird of Paradise", "Outdoor", 1199],
  ["Peace Lily", "Flowering", 649],
  ["Rubber Plant", "Indoor", 749],
  ["Jade Plant", "Outdoor", 399],
  ["Anthurium", "Flowering", 799],
  ["Areca Palm", "Indoor", 999],
  ["Fiddle Leaf Fig", "Indoor", 1299],
  ["ZZ Plant", "Indoor", 699],
  ["Aloe Vera", "Outdoor", 349],
  ["Money Plant", "Indoor", 299],
  ["Boston Fern", "Indoor", 599],
  ["Chinese Evergreen", "Indoor", 649],
  ["Croton", "Outdoor", 499],
  ["Spider Plant", "Indoor", 399],
  ["Lavender", "Flowering", 449],
  ["Rose Bush", "Flowering", 599],
  ["Hibiscus", "Flowering", 549],
  ["Bougainvillea", "Outdoor", 649],
  ["Marigold Seeds", "Seeds", 99],
  ["Basil Seeds", "Seeds", 79],
  ["Sunflower Seeds", "Seeds", 99],
  ["Ceramic Planter", "Pots", 499],
  ["Terracotta Pot", "Pots", 299],
  ["Self-watering Pot", "Pots", 699],
  ["Garden Trowel", "Pots", 349],
  ["Watering Can", "Pots", 549],
  ["Orchid", "Flowering", 899],
  ["Calathea", "Indoor", 799],
  ["Succulent Set", "Indoor", 699],
  ["Tulsi Plant", "Outdoor", 249],
  ["Curry Leaf Plant", "Outdoor", 349],
  ["Petunia", "Flowering", 299],
  ["Garden Gloves", "Pots", 199],
  ["Plant Food", "Pots", 249],
].map((p, i) => ({
  name: p[0],
  type: p[1],
  price: p[2],
  photo: photos[i % photos.length],
}));
function requireUser() {
  if (
    !get("gnUser", null) &&
    !location.pathname.endsWith("index.html") &&
    !location.pathname.endsWith("login.html")
  )
    location.href = "index.html";
}
function updateCount() {
  const c = get("gnCart", []).length;
  if ($("#cartCount")) $("#cartCount").textContent = c;
}
function toast(t) {
  let e = document.createElement("div");
  e.className = "toast";
  e.textContent = t;
  document.body.append(e);
  setTimeout(() => e.remove(), 2700);
}
$("#registerForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  set("gnAccount", {
    name: $("#name").value,
    email: $("#email").value,
    password: $("#password").value,
    phone: $("#phone").value,
  });
  toast("Account created — please log in to continue.");
  setTimeout(() => (location.href = "login.html"), 800);
});
$("#loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  let a = get("gnAccount", null);
  if (
    a &&
    a.email.toLowerCase() === $("#loginEmail").value.toLowerCase() &&
    a.password === $("#loginPassword").value
  ) {
    set("gnUser", a);
    location.href = "dashboard.html";
  } else toast("Please use the email and password you registered with.");
});
requireUser();
updateCount();
$("#logoutButton")?.addEventListener("click", () => {
  localStorage.removeItem("gnUser");
  location.href = "login.html";
});
let u = get("gnUser", null);
if (u && $("#welcome"))
  $("#welcome").textContent = `Hello, ${u.name.split(" ")[0]}.`;
let filter = "All";
function renderCatalog() {
  let q = $("#searchInput")?.value.toLowerCase() || "";
  let list = data.filter(
    (p) =>
      (filter === "All" || p.type === filter) &&
      (p.name + " " + p.type).toLowerCase().includes(q),
  );
  $("#resultCount").textContent = `${list.length} products available`;
  $("#productGrid").innerHTML = list
    .map(
      (p) =>
        `<article class="product-card"><img src="${p.photo}" alt="${p.name}"><div class="product-info"><div><p>${p.type}</p><h3>${p.name}</h3></div><strong>₹${p.price}</strong></div><button class="add-button" data-name="${p.name}">Add to bag +</button></article>`,
    )
    .join("");
  $$(".add-button").forEach(
    (b) =>
      (b.onclick = () => {
        let p = data.find((x) => x.name === b.dataset.name),
          c = get("gnCart", []);
        c.push(p);
        set("gnCart", c);
        updateCount();
        toast(`${p.name} added to your bag`);
      }),
  );
}
if ($("#productGrid")) {
  $$(".filter").forEach(
    (b) =>
      (b.onclick = () => {
        filter = b.dataset.filter;
        $$(".filter").forEach((x) => x.classList.toggle("active", x === b));
        renderCatalog();
      }),
  );
  $("#searchInput").oninput = renderCatalog;
  renderCatalog();
}
function renderCart() {
  let c = get("gnCart", []),
    box = $("#cartItems");
  if (!box) return;
  box.innerHTML = c.length
    ? c
        .map(
          (p, i) =>
            `<article class="cart-item"><img src="${p.photo}" alt="${p.name}"><div><p>${p.type}</p><h3>${p.name}</h3><strong>₹${p.price}</strong></div><button class="remove" data-i="${i}">Remove</button></article>`,
        )
        .join("")
    : '<p class="empty">Your bag is empty. <a href="catalog.html">Explore the catalog.</a></p>';
  let total = c.reduce((s, p) => s + p.price, 0);
  $("#subtotal").textContent = "₹" + total;
  $$(".remove").forEach(
    (b) =>
      (b.onclick = () => {
        c.splice(+b.dataset.i, 1);
        set("gnCart", c);
        updateCount();
        renderCart();
      }),
  );
}
renderCart();
$("#checkoutForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  let c = get("gnCart", []);
  if (!c.length) return toast("Add a plant before placing an order.");
  let acts = get("gnActivities", []);
  acts.unshift({
    kind: "Order",
    title: `${c.length} plant${c.length > 1 ? "s" : ""} from GreenNest`,
    date: $("#deliveryDate").value,
    status: "Vendor confirmed · Delivery scheduled",
    done: false,
  });
  set("gnActivities", acts);
  set("gnCart", []);
  location.href = "orders.html";
});
const dialog = $("#bookingDialog");
$$(".book-service").forEach(
  (b) =>
    (b.onclick = () => {
      $("#selectedService").value = b.dataset.service;
      $("#serviceTitle").textContent = b.dataset.service;
      dialog.showModal();
    }),
);
$(".dialog-close")?.addEventListener("click", () => dialog.close());
$("#bookingForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  let a = get("gnActivities", []);
  a.unshift({
    kind: "Service",
    title: $("#selectedService").value,
    date: $("#serviceDate").value,
    status: "Request received · Awaiting gardener confirmation",
    done: false,
  });
  set("gnActivities", a);
  dialog.close();
  location.href = "orders.html";
});
function renderActivity() {
  let a = get("gnActivities", []),
    box = $("#activityList");
  if (!box) return;
  box.innerHTML = a.length
    ? a
        .map((x, i) => {
          let action = x.done
            ? `<button class="feedback" data-feedback="${i}">Leave feedback</button>`
            : x.status.includes("Awaiting")
              ? `<button class="confirm" data-confirm="${i}">Confirm booking</button>`
              : `<button class="complete" data-complete="${i}">Mark delivered</button>`;
          return `<article class="activity"><div class="activity-head"><span class="status-dot ${x.done ? "done" : ""}"></span><div><p>${x.kind} · ${x.date}</p><h3>${x.title}</h3><strong>${x.status}</strong></div></div>${action}</article>`;
        })
        .join("")
    : '<div class="empty activity-empty">Nothing here yet. Browse plants or book a gardener to get started.</div>';
  $$(".confirm").forEach(
    (b) =>
      (b.onclick = () => {
        let a = get("gnActivities", []);
        a[+b.dataset.confirm].status = "Gardener confirmed · Service scheduled";
        set("gnActivities", a);
        renderActivity();
        toast("Your gardener has confirmed the service.");
      }),
  );
  $$(".complete").forEach(
    (b) =>
      (b.onclick = () => {
        let a = get("gnActivities", []);
        a[+b.dataset.complete].done = true;
        a[+b.dataset.complete].status =
          a[+b.dataset.complete].kind === "Order"
            ? "Delivered"
            : "Service completed";
        set("gnActivities", a);
        renderActivity();
        toast("Marked as complete — thank you!");
      }),
  );
  $$(".feedback").forEach(
    (b) =>
      (b.onclick = () => {
        let note = prompt("How was your GreenNest experience?");
        if (note) {
          let a = get("gnActivities", []);
          a[+b.dataset.feedback].status = "Completed · Feedback received";
          set("gnActivities", a);
          renderActivity();
          toast("Thank you for your feedback!");
        }
      }),
  );
}
renderActivity();
