const PRODUCTS = [
  { id: 1, name: "轻暖羊毛混纺针织开衫", price: 129, emoji: "🧥", bg: "#ffe8df" },
  { id: 2, name: "降噪蓝牙耳机 Pro", price: 199, emoji: "🎧", bg: "#e8f0ff" },
  { id: 3, name: "316 不锈钢保温杯", price: 79, emoji: "🥤", bg: "#e9f7ef" },
  { id: 4, name: "基础纯棉圆领 T 恤", price: 59, emoji: "👕", bg: "#fff4e5" },
];

const PAGE_META = {
  login: { title: "登录", desc: "手机号验证码登录；演示账号预填，无需真实短信。" },
  home: { title: "首页", desc: "轮播、类目入口、推荐商品，支持后台配置跳转。" },
  category: { title: "分类", desc: "多级类目浏览，右侧展示商品列表。" },
  search: { title: "搜索", desc: "关键词搜索、历史记录、综合/销量/价格排序。" },
  detail: { title: "商品详情", desc: "SPU/SKU 规格选择，库存与价格联动，加购或立即购买。" },
  cart: { title: "购物车", desc: "增删改选、价格重算；提交前由服务端再次校验。" },
  checkout: { title: "结算", desc: "地址、优惠、运费、备注；提交订单携带幂等键。" },
  pay: { title: "模拟支付", desc: "模拟渠道下单；成功/失败均可演示，结果以服务端为准。" },
  orders: { title: "订单列表", desc: "按状态筛选订单，进入详情查看履约与售后入口。" },
  orderDetail: { title: "订单详情", desc: "支付、物流、售后信息同屏；支持确认收货。" },
  logistics: { title: "物流轨迹", desc: "模拟承运商与运单号，展示轨迹时间线。" },
  aftersale: { title: "申请售后", desc: "仅退款/退货退款，校验可退数量与金额。" },
  profile: { title: "个人中心", desc: "订单入口、优惠券、消息、地址与账号安全。" },
  coupons: { title: "优惠券", desc: "P1：可用券展示与门槛说明。" },
  messages: { title: "消息中心", desc: "P1：订单/物流/系统消息与已读状态。" },
};

const TAB_PAGES = new Set(["home", "category", "cart", "profile"]);

const state = {
  page: "home",
  mode: "h5",
  cart: [
    { id: 1, name: "轻暖羊毛混纺针织开衫", spec: "燕麦白 / M", price: 129, qty: 1, emoji: "🧥", bg: "#ffe8df", checked: true },
    { id: 3, name: "316 不锈钢保温杯", spec: "白色 / 500ml", price: 79, qty: 1, emoji: "🥤", bg: "#e9f7ef", checked: true },
  ],
};

function money(n) {
  return `¥${n.toFixed(2)}`;
}

function productCard(p) {
  return `
    <button class="product-card" data-go="detail" type="button">
      <div class="thumb" style="background:${p.bg}">${p.emoji}</div>
      <div class="info">
        <div class="name">${p.name}</div>
        <div class="price">${money(p.price)}</div>
      </div>
    </button>
  `;
}

function renderProducts() {
  const html = PRODUCTS.map(productCard).join("");
  ["homeProducts", "cateProducts", "searchProducts"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  });
}

function renderCart() {
  const list = document.getElementById("cartList");
  const checkout = document.getElementById("checkoutItems");
  if (!list) return;

  list.innerHTML = state.cart
    .map(
      (item, index) => `
      <div class="cart-item">
        <input type="checkbox" ${item.checked ? "checked" : ""} data-cart-check="${index}" />
        <div class="thumb" style="background:${item.bg}">${item.emoji}</div>
        <div>
          <div style="font-size:13px">${item.name}</div>
          <div class="muted" style="margin-top:4px">${item.spec}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
            <div class="price">${money(item.price)}</div>
            <div class="qty">
              <button type="button" data-qty="${index}" data-delta="-1">-</button>
              <span>${item.qty}</span>
              <button type="button" data-qty="${index}" data-delta="1">+</button>
            </div>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  const total = state.cart
    .filter((i) => i.checked)
    .reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartTotal = document.getElementById("cartTotal");
  if (cartTotal) cartTotal.textContent = money(total);

  if (checkout) {
    checkout.innerHTML = state.cart
      .filter((i) => i.checked)
      .map(
        (item) => `
        <div class="order-item" style="grid-template-columns:72px 1fr">
          <div class="thumb" style="background:${item.bg}">${item.emoji}</div>
          <div>
            <div style="font-size:13px">${item.name}</div>
            <div class="muted" style="margin-top:4px">${item.spec} × ${item.qty}</div>
            <div class="price" style="margin-top:8px">${money(item.price * item.qty)}</div>
          </div>
        </div>
      `
      )
      .join("");
  }

  const goods = document.getElementById("checkoutGoods");
  const pay = document.getElementById("checkoutPay");
  if (goods) goods.textContent = money(total);
  if (pay) pay.textContent = money(Math.max(total - 20, 0));
}

function renderOrders() {
  const el = document.getElementById("orderList");
  if (!el) return;
  el.innerHTML = `
    <div class="form-card" style="margin-top:12px">
      <div class="cell" data-go="orderDetail" style="cursor:pointer">
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between">
            <strong>SL202607230001</strong>
            <span class="badge brand">待收货</span>
          </div>
          <div class="muted" style="margin-top:8px">针织开衫 × 1</div>
          <div class="price" style="margin-top:8px">¥129.00</div>
        </div>
      </div>
      <div style="padding:0 14px 14px;display:flex;justify-content:flex-end;gap:8px">
        <button class="btn btn-sm btn-ghost" data-go="logistics">查看物流</button>
        <button class="btn btn-sm btn-primary" data-go="orderDetail">订单详情</button>
      </div>
    </div>
    <div class="form-card">
      <div class="cell">
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between">
            <strong>SL202607220088</strong>
            <span class="badge ok">已完成</span>
          </div>
          <div class="muted" style="margin-top:8px">保温杯 × 1</div>
          <div class="price" style="margin-top:8px">¥79.00</div>
        </div>
      </div>
      <div style="padding:0 14px 14px;display:flex;justify-content:flex-end;gap:8px">
        <button class="btn btn-sm btn-ghost">评价</button>
        <button class="btn btn-sm btn-ghost" data-go="detail">再次购买</button>
      </div>
    </div>
  `;
}

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 1800);
}

function setPage(page) {
  if (!PAGE_META[page]) return;
  state.page = page;

  document.querySelectorAll(".page").forEach((el) => el.classList.remove("active"));
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add("active");

  document.querySelectorAll("#h5Nav .nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });

  document.querySelectorAll("#tabbar button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });

  const tabbar = document.getElementById("tabbar");
  tabbar.style.display = TAB_PAGES.has(page) ? "grid" : "none";

  const meta = PAGE_META[page];
  document.getElementById("pageTitle").textContent = meta.title;
  document.getElementById("pageDesc").textContent = meta.desc;

  const body = document.getElementById("appBody");
  body.scrollTop = 0;
}

function setMode(mode) {
  state.mode = mode;
  document.getElementById("modeH5").classList.toggle("active", mode === "h5");
  document.getElementById("modeAdmin").classList.toggle("active", mode === "admin");
  document.getElementById("h5Nav").style.display = mode === "h5" ? "block" : "none";
  document.getElementById("adminNav").style.display = mode === "admin" ? "block" : "none";
  document.getElementById("h5View").style.display = mode === "h5" ? "block" : "none";
  document.getElementById("adminView").style.display = mode === "admin" ? "grid" : "none";

  if (mode === "admin") {
    document.getElementById("pageTitle").textContent = "运营后台";
    document.getElementById("pageDesc").textContent = "简化后台：看板、商品、订单、售后、库存。";
    setAdmin("dashboard");
  } else {
    setPage(state.page || "home");
  }
}

function setAdmin(panel) {
  const titles = {
    dashboard: "经营看板",
    products: "商品中心",
    orders: "订单中心",
    aftersale: "售后中心",
    inventory: "库存中心",
  };

  document.querySelectorAll(".admin-panel").forEach((el) => {
    el.style.display = el.id === `admin-${panel}` ? "block" : "none";
  });
  document.querySelectorAll("[data-admin-panel], #adminNav .nav-btn").forEach((btn) => {
    const key = btn.dataset.adminPanel || btn.dataset.admin;
    btn.classList.toggle("active", key === panel);
  });
  document.getElementById("adminTitle").textContent = titles[panel] || "运营后台";
  document.getElementById("pageTitle").textContent = titles[panel] || "运营后台";
}

function onAction(action) {
  switch (action) {
    case "addCart":
      toast("已加入购物车");
      break;
    case "fav":
      toast("已收藏");
      break;
    case "paySuccess":
      toast("支付成功，订单进入待发货");
      setTimeout(() => setPage("orderDetail"), 500);
      break;
    case "payFail":
      toast("支付失败，可重新发起或查单");
      break;
    case "confirmRecv":
      toast("已确认收货，订单完成");
      break;
    case "extend":
      toast("已延长收货时间 3 天");
      break;
    case "submitAftersale":
      toast("售后申请已提交，等待审核");
      break;
    default:
      break;
  }
}

function bindEvents() {
  document.body.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go) {
      setMode("h5");
      setPage(go.dataset.go);
      return;
    }

    const pageBtn = e.target.closest("[data-page]");
    if (pageBtn && pageBtn.dataset.page) {
      setMode("h5");
      setPage(pageBtn.dataset.page);
      return;
    }

    const adminBtn = e.target.closest("[data-admin], [data-admin-panel]");
    if (adminBtn) {
      setMode("admin");
      setAdmin(adminBtn.dataset.admin || adminBtn.dataset.adminPanel);
      return;
    }

    const modeBtn = e.target.closest("[data-mode]");
    if (modeBtn) {
      setMode(modeBtn.dataset.mode);
      return;
    }

    const actionBtn = e.target.closest("[data-action]");
    if (actionBtn) {
      onAction(actionBtn.dataset.action);
      return;
    }

    const qtyBtn = e.target.closest("[data-qty]");
    if (qtyBtn) {
      const index = Number(qtyBtn.dataset.qty);
      const delta = Number(qtyBtn.dataset.delta);
      const item = state.cart[index];
      item.qty = Math.max(1, item.qty + delta);
      renderCart();
      return;
    }
  });

  document.body.addEventListener("change", (e) => {
    const check = e.target.closest("[data-cart-check]");
    if (check) {
      const index = Number(check.dataset.cartCheck);
      state.cart[index].checked = check.checked;
      renderCart();
    }
  });

  document.querySelectorAll(".sku-options").forEach((group) => {
    group.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      group.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

renderProducts();
renderCart();
renderOrders();
bindEvents();
setPage("home");
