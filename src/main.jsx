import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./styles.css";

const names = [
  "Monstera Deliciosa",
  "Snake Plant",
  "Bird of Paradise",
  "Peace Lily",
  "Rubber Plant",
  "Jade Plant",
  "Anthurium",
  "Areca Palm",
  "Fiddle Leaf Fig",
  "ZZ Plant",
  "Aloe Vera",
  "Money Plant",
  "Boston Fern",
  "Chinese Evergreen",
  "Croton",
  "Spider Plant",
  "Lavender",
  "Rose Bush",
  "Hibiscus",
  "Bougainvillea",
  "Marigold Seeds",
  "Basil Seeds",
  "Sunflower Seeds",
  "Ceramic Planter",
  "Terracotta Pot",
  "Self-watering Pot",
  "Garden Trowel",
  "Watering Can",
  "Orchid",
  "Calathea",
  "Succulent Set",
  "Tulsi Plant",
  "Curry Leaf Plant",
  "Petunia",
  "Garden Gloves",
  "Plant Food",
];
const productTypes = [
  "Indoor",
  "Indoor",
  "Outdoor",
  "Flowering",
  "Indoor",
  "Outdoor",
  "Flowering",
  "Indoor",
  "Indoor",
  "Indoor",
  "Outdoor",
  "Indoor",
  "Indoor",
  "Indoor",
  "Outdoor",
  "Indoor",
  "Flowering",
  "Flowering",
  "Flowering",
  "Outdoor",
  "Seeds",
  "Seeds",
  "Seeds",
  "Pots & tools",
  "Pots & tools",
  "Pots & tools",
  "Pots & tools",
  "Pots & tools",
  "Flowering",
  "Indoor",
  "Indoor",
  "Outdoor",
  "Outdoor",
  "Flowering",
  "Pots & tools",
  "Pots & tools",
];
const images = [
  "monstera.jpg",
  "leafy.jpg",
  "bird.jpg",
  "peace.jpg",
  "succulent.jpg",
];
const products = names.map((name, i) => ({
  name,
  type: productTypes[i],
  price: [899, 549, 1199, 649, 749, 399][i % 6],
  image: `/assets/${images[i % images.length]}`,
}));
const load = (key, fallback) =>
  JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function Header({ cart, logout }) {
  return (
    <header className="site-header">
      <Link className="brand" to="/dashboard">
        GreenNest
      </Link>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/catalog">Plants & supplies</Link>
        <Link to="/services">Gardener services</Link>
        <Link to="/activity">My activity</Link>
      </nav>
      <div className="header-actions">
        <Link className="bag" to="/cart">
          Bag <b>{cart.length}</b>
        </Link>
        <button className="avatar" onClick={logout} title="Log out">
          ↪
        </button>
      </div>
    </header>
  );
}
function Register({ setUser }) {
  const nav = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  function submit(e) {
    e.preventDefault();
    if (!isLogin) {
      save("gnAccount", form);
      setIsLogin(true);
      alert("Account created. Please log in to continue.");
      return;
    }
    const account = load("gnAccount", null);
    if (
      !account ||
      account.email !== form.email ||
      account.password !== form.password
    )
      return alert("Use the email and password you registered with.");
    setUser(account);
    nav("/dashboard");
  }
  return (
    <main className="auth-page">
      <section className="auth-photo">
        <div>
          <span className="brand light">GreenNest</span>
          <p>{isLogin ? "Good things grow here." : "Grow at your own pace."}</p>
        </div>
      </section>
      <section className="auth-card">
        <p className="eyebrow">
          {isLogin ? "Welcome back" : "Welcome to your green space"}
        </p>
        <h1>{isLogin ? "Log in to your garden." : "Create your account"}</h1>
        <p className="muted">
          Save plants you love, book trusted gardeners, and track every order.
        </p>
        <form className="form" onSubmit={submit}>
          {!isLogin && (
            <label>
              Full name
              <input
                name="name"
                required
                value={form.name}
                onChange={set}
                placeholder="e.g. Aanya Sharma"
              />
            </label>
          )}
          <label>
            Email address
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={set}
              placeholder="you@example.com"
            />
          </label>
          {!isLogin && (
            <label>
              Phone number
              <input
                name="phone"
                required
                value={form.phone}
                onChange={set}
                placeholder="98765 43210"
              />
            </label>
          )}
          <label>
            Password
            <input
              name="password"
              type="password"
              minLength="4"
              required
              value={form.password}
              onChange={set}
              placeholder="At least 4 characters"
            />
          </label>
          <button className="button" type="submit">
            {isLogin ? "Log in" : "Create account"} <span>→</span>
          </button>
        </form>
        <button className="text-button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "New here? Create an account"
            : "Already have an account? Log in"}
        </button>
      </section>
    </main>
  );
}
function Dashboard({ user }) {
  return (
    <main className="dashboard">
      <p className="eyebrow">Your GreenNest dashboard</p>
      <h1>Hello, {user.name?.split(" ")[0] || "plant parent"}.</h1>
      <p className="intro">
        Everything you need to keep your space green and thriving.
      </p>
      <section className="dash-hero">
        <div>
          <p className="eyebrow">This week’s pick</p>
          <h2>A quieter, greener corner.</h2>
          <p>
            Find plants that make a home feel more alive — delivered fresh from
            trusted local nurseries.
          </p>
          <Link className="button" to="/catalog">
            Explore the catalog <span>→</span>
          </Link>
        </div>
      </section>
      <section className="quick-actions">
        <Link to="/catalog">
          <b>01</b>
          <h3>Shop plants</h3>
          <p>Browse 36+ indoor, outdoor, flowering plants and essentials.</p>
          <span>Explore →</span>
        </Link>
        <Link to="/services">
          <b>02</b>
          <h3>Book a gardener</h3>
          <p>Choose a verified expert and schedule the care you need.</p>
          <span>Book now →</span>
        </Link>
        <Link to="/activity">
          <b>03</b>
          <h3>Track activity</h3>
          <p>See vendor updates, delivery status, and leave feedback.</p>
          <span>View activity →</span>
        </Link>
      </section>
      <section className="journey">
        <p className="eyebrow">How GreenNest works</p>
        <div>
          Register <i>→</i> Browse <i>→</i> Schedule <i>→</i> Order / book{" "}
          <i>→</i> Delivered <i>→</i> Share feedback
        </div>
      </section>
    </main>
  );
}
function Catalog({ cart, setCart }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const list = useMemo(
    () =>
      products.filter(
        (p) =>
          (filter === "All" || p.type === filter) &&
          p.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [filter, query],
  );
  return (
    <main className="page catalog">
      <p className="eyebrow">Fresh from partner nurseries</p>
      <h1>Plants for every kind of home.</h1>
      <input
        className="search"
        placeholder="Search plants, seeds, pots and tools"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="filters">
        {["All", "Indoor", "Outdoor", "Flowering", "Seeds", "Pots & tools"].map(
          (x) => (
            <button
              key={x}
              className={filter === x ? "active" : ""}
              onClick={() => setFilter(x)}
            >
              {x}
            </button>
          ),
        )}
      </div>
      <p className="result-count">{list.length} products available</p>
      <section className="product-grid">
        {list.map((p) => (
          <article className="product-card" key={p.name}>
            <img
              src={p.image}
              alt={p.name}
              onError={(e) => {
                e.currentTarget.src = "/assets/leafy.jpg";
              }}
            />
            <div className="product-info">
              <div>
                <p>{p.type}</p>
                <h3>{p.name}</h3>
              </div>
              <strong>₹{p.price}</strong>
            </div>
            <button onClick={() => setCart([...cart, p])}>Add to bag +</button>
          </article>
        ))}
      </section>
    </main>
  );
}
function Cart({ cart, setCart, addActivity }) {
  const nav = useNavigate();
  const total = cart.reduce((s, p) => s + p.price, 0);
  function checkout(e) {
    e.preventDefault();
    if (!cart.length) return alert("Add a product before placing an order.");
    addActivity({
      kind: "Order",
      title: `${cart.length} plant${cart.length > 1 ? "s" : ""} from GreenNest`,
      status: "Vendor confirmed · Delivery scheduled",
      done: false,
    });
    setCart([]);
    nav("/activity");
  }
  return (
    <main className="page">
      <p className="eyebrow">Your selection</p>
      <h1>Your bag</h1>
      <div className="checkout-grid">
        <section>
          {cart.length ? (
            cart.map((p, i) => (
              <article className="cart-item" key={`${p.name}-${i}`}>
                <img src={p.image} alt={p.name} />
                <div>
                  <p>{p.type}</p>
                  <h3>{p.name}</h3>
                  <strong>₹{p.price}</strong>
                </div>
                <button onClick={() => setCart(cart.filter((_, n) => n !== i))}>
                  Remove
                </button>
              </article>
            ))
          ) : (
            <p className="empty">
              Your bag is empty. <Link to="/catalog">Explore the catalog.</Link>
            </p>
          )}
        </section>
        <form className="checkout-card form" onSubmit={checkout}>
          <h2>Delivery schedule</h2>
          <p className="muted">Choose when your plants should arrive.</p>
          <label>
            Delivery date
            <input type="date" required />
          </label>
          <label>
            Preferred time
            <select required>
              <option value="">Select a time</option>
              <option>9 AM – 12 PM</option>
              <option>12 PM – 3 PM</option>
              <option>3 PM – 6 PM</option>
            </select>
          </label>
          <div className="total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>
          <button className="button">
            Place order <span>→</span>
          </button>
        </form>
      </div>
    </main>
  );
}
function Services({ addActivity }) {
  const nav = useNavigate();
  const [service, setService] = useState("");
  function book(e) {
    e.preventDefault();
    addActivity({
      kind: "Service",
      title: service,
      status: "Request received · Awaiting gardener confirmation",
      done: false,
    });
    nav("/activity");
  }
  return (
    <main className="page services">
      <p className="eyebrow">Verified local experts</p>
      <h1>Let your garden be cared for.</h1>
      <p className="intro">
        Pick a service, choose a date and time, and a trusted gardener will
        confirm your request.
      </p>
      <section className="service-grid">
        {[
          [
            "Home garden setup",
            "leafy.jpg",
            "Design, soil preparation, and planting for a fresh new start.",
            "₹1,499",
          ],
          [
            "Plant care & pruning",
            "monstera.jpg",
            "Healthy trimming, repotting, feeding, and practical care advice.",
            "₹699",
          ],
          [
            "Lawn maintenance",
            "bird.jpg",
            "Keep your lawn neat, nourished, and ready for every season.",
            "₹899",
          ],
        ].map(([name, image, text, price]) => (
          <article key={name}>
            <img src={`/assets/${image}`} alt={name} />
            <h3>{name}</h3>
            <p>{text}</p>
            <strong>From {price}</strong>
            <button className="button" onClick={() => setService(name)}>
              Schedule <span>→</span>
            </button>
          </article>
        ))}
      </section>
      {service && (
        <form className="booking form" onSubmit={book}>
          <h2>Book: {service}</h2>
          <label>
            Preferred date
            <input required type="date" />
          </label>
          <label>
            Preferred time
            <select required>
              <option value="">Select a time</option>
              <option>9 AM – 12 PM</option>
              <option>12 PM – 3 PM</option>
              <option>3 PM – 6 PM</option>
            </select>
          </label>
          <label>
            Address / garden note
            <textarea
              required
              placeholder="Your address and a brief note about your garden"
            />
          </label>
          <button className="button">
            Request booking <span>→</span>
          </button>
        </form>
      )}
    </main>
  );
}
function Activity({ activities, setActivities }) {
  function progress(i) {
    const a = activities[i];
    const next = a.status.includes("Awaiting")
      ? { ...a, status: "Gardener confirmed · Service scheduled" }
      : {
          ...a,
          status: a.kind === "Order" ? "Delivered" : "Service completed",
          done: true,
        };
    setActivities(activities.map((x, n) => (n === i ? next : x)));
  }
  return (
    <main className="page">
      <p className="eyebrow">Orders and bookings</p>
      <h1>Your green journey.</h1>
      <section className="activity-list">
        {activities.length ? (
          activities.map((a, i) => (
            <article className="activity" key={i}>
              <div>
                <p>{a.kind}</p>
                <h3>{a.title}</h3>
                <strong>{a.status}</strong>
              </div>
              {a.done ? (
                <button onClick={() => alert("Thank you for your feedback!")}>
                  Leave feedback
                </button>
              ) : (
                <button onClick={() => progress(i)}>
                  {a.status.includes("Awaiting")
                    ? "Confirm booking"
                    : "Mark delivered"}
                </button>
              )}
            </article>
          ))
        ) : (
          <div className="empty activity-empty">
            Nothing here yet. Browse plants or book a gardener to get started.
          </div>
        )}
      </section>
    </main>
  );
}
function App() {
  const [user, setUser] = useState(load("gnUser", null));
  const [cart, setCartState] = useState(load("gnCart", []));
  const [activities, setActivitiesState] = useState(load("gnActivities", []));
  const setCart = (v) => {
    setCartState(v);
    save("gnCart", v);
  };
  const setActivities = (v) => {
    setActivitiesState(v);
    save("gnActivities", v);
  };
  const addActivity = (x) =>
    setActivities([
      { ...x, date: new Date().toLocaleDateString() },
      ...activities,
    ]);
  const auth = (u) => {
    setUser(u);
    save("gnUser", u);
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("gnUser");
  };
  return (
    <BrowserRouter>
      {!user ? (
        <Routes>
          <Route path="*" element={<Register setUser={auth} />} />
        </Routes>
      ) : (
        <>
          <Header cart={cart} logout={logout} />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route
              path="/catalog"
              element={<Catalog cart={cart} setCart={setCart} />}
            />
            <Route
              path="/cart"
              element={
                <Cart cart={cart} setCart={setCart} addActivity={addActivity} />
              }
            />
            <Route
              path="/services"
              element={<Services addActivity={addActivity} />}
            />
            <Route
              path="/activity"
              element={
                <Activity
                  activities={activities}
                  setActivities={setActivities}
                />
              }
            />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}
createRoot(document.getElementById("root")).render(<App />);
