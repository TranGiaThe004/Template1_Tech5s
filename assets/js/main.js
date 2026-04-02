/* ================= quy trình ================= */
  (function () {
      const desktop = document.getElementById("processDesktop");
      const stepsWrap = document.getElementById("processSteps");
      const linesSvg = document.getElementById("processLines");

      if (!desktop || !stepsWrap || !linesSvg) return;

      const processData = [
        {
          step: "01",
          title: "Đăng ký thông tin",
          desc: "Khách hàng đăng ký thông tin tại quầy tiếp đón Trung tâm Tư vấn & Tiêm chủng vắc-xin."
        },
        {
          step: "02",
          title: "Tư vấn & Thăm khám",
          desc: "Khách hàng được thăm khám và tư vấn kỹ trước khi tiêm tại phòng khám với bác sĩ."
        },
        {
          step: "03",
          title: "Thanh toán chi phí",
          desc: "Khách hàng thanh toán chi phí tiêm tại quầy lễ tân và nhận phiếu thanh toán."
        },
        {
          step: "04",
          title: "Thực hiện tiêm chủng",
          desc: "Cầm theo phiếu thanh toán tới tiêm Vắc-xin tại phòng tiêm theo chỉ dẫn của nhân viên y tế."
        },
        {
          step: "05",
          title: "Theo dõi sức khỏe",
          desc: "Theo dõi 30 phút sau tiêm, kiểm tra sức khỏe trước khi ra về và hướng dẫn theo dõi tại nhà."
        }
      ];

      function buildSteps() {
        stepsWrap.innerHTML = "";
        stepsWrap.style.gridTemplateColumns = `repeat(${processData.length}, minmax(0, 1fr))`;

        processData.forEach((item, index) => {
          const isTop = index % 2 === 0;

          const step = document.createElement("div");
          step.className = `process-step ${isTop ? "top" : "bottom"}`;
          step.dataset.index = index;

          step.innerHTML = `
            <div class="process-copy">
              <h3>${item.title}</h3>
              <p>${item.desc}</p>
            </div>

            <div class="step-stem"></div>
            <div class="step-dot"></div>

            <div class="process-circle-wrap">
              <div class="process-circle-dashed"></div>
              <div class="process-circle-blue"></div>
              <div class="process-circle-white">
                <div class="process-circle-text">
                  <div class="label">Bước</div>
                  <div class="num">${item.step}</div>
                </div>
              </div>
            </div>
          `;

          stepsWrap.appendChild(step);
        });
      }

      function drawLines() {
        linesSvg.innerHTML = "";

        const desktopRect = desktop.getBoundingClientRect();
        const stepEls = Array.from(stepsWrap.querySelectorAll(".process-step"));

        const nodes = stepEls.map((stepEl) => {
          const circle = stepEl.querySelector(".process-circle-wrap");
          const rect = circle.getBoundingClientRect();
          return {
            x: rect.left - desktopRect.left + rect.width / 2,
            y: rect.top - desktopRect.top + rect.height / 2,
            r: rect.width / 2
          };
        });

        linesSvg.setAttribute("viewBox", `0 0 ${desktopRect.width} ${desktopRect.height}`);

        for (let i = 0; i < nodes.length - 1; i++) {
          const a = nodes[i];
          const b = nodes[i + 1];

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.sqrt(dx * dx + dy * dy);

          if (!len) continue;

          /* chỉ cho line chạm vòng nét đứt ngoài */
          const startX = a.x + (dx / len) * a.r;
          const startY = a.y + (dy / len) * a.r;
          const endX = b.x - (dx / len) * b.r;
          const endY = b.y - (dy / len) * b.r;

          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", startX);
          line.setAttribute("y1", startY);
          line.setAttribute("x2", endX);
          line.setAttribute("y2", endY);
          line.setAttribute("stroke", "rgba(255,255,255,0.85)");
          line.setAttribute("stroke-width", "2");
          line.setAttribute("stroke-dasharray", "6 6");
          line.setAttribute("stroke-linecap", "round");
          linesSvg.appendChild(line);
        }
      }

      function renderProcess() {
        buildSteps();
        requestAnimationFrame(drawLines);
      }

      window.addEventListener("resize", drawLines);
      renderProcess();
    })();




/* ================= Cảm nhận của khách hàng sau khi sử dụng ================= */
  (function () {
      const viewport = document.getElementById("testimonialViewport");
      const track = document.getElementById("testimonialTrack");
      const cards = Array.from(document.querySelectorAll(".testimonial-card"));
      const dots = Array.from(document.querySelectorAll(".testimonial-dot"));

      if (!viewport || !track || !cards.length) return;

      let active = 0;
      let startX = 0;
      let startY = 0;
      let dragging = false;

      function updateDots(index) {
        dots.forEach((dot, i) => {
          if (i === index) {
            dot.classList.remove("bg-slate-300", "w-[14px]");
            dot.classList.add("bg-[#F79433]", "w-[34px]");
          } else {
            dot.classList.remove("bg-[#F79433]", "w-[34px]");
            dot.classList.add("bg-slate-300", "w-[14px]");
          }
        });
      }

      function updateOrder() {
        cards.forEach((card, i) => {
          const visualOrder = (i - active + cards.length) % cards.length;
          card.style.order = visualOrder;

          if (visualOrder === 0) {
            card.classList.add("shadow-[0_14px_28px_rgba(15,23,42,0.05)]");
            card.classList.remove("shadow-[0_12px_24px_rgba(15,23,42,0.03)]");
          } else {
            card.classList.remove("shadow-[0_14px_28px_rgba(15,23,42,0.05)]");
            card.classList.add("shadow-[0_12px_24px_rgba(15,23,42,0.03)]");
          }
        });

        updateDots(active);
      }

      function goTo(index) {
        active = ((index % cards.length) + cards.length) % cards.length;
        updateOrder();
      }

      function goNext() {
        active = (active + 1) % cards.length;
        updateOrder();
      }

      function goPrev() {
        active = (active - 1 + cards.length) % cards.length;
        updateOrder();
      }

      function startDrag(x, y) {
        dragging = true;
        startX = x;
        startY = y;
      }

      function endDrag(x, y) {
        if (!dragging) return;
        dragging = false;

        const diffX = x - startX;
        const diffY = y - startY;

        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            goNext();
          } else {
            goPrev();
          }
        }
      }

      viewport.addEventListener("pointerdown", (e) => {
        startDrag(e.clientX, e.clientY);
      });

      viewport.addEventListener("pointerup", (e) => {
        endDrag(e.clientX, e.clientY);
      });

      viewport.addEventListener("pointerleave", (e) => {
        if (dragging && e.pointerType === "mouse") {
          endDrag(e.clientX, e.clientY);
        }
      });

      viewport.addEventListener("pointercancel", () => {
        dragging = false;
      });

      dots.forEach((dot) => {
        dot.addEventListener("click", () => {
          goTo(Number(dot.dataset.index));
        });
      });

      updateOrder();
    })();

/* ================= Những lưu ý cần thiết cho khách hàng ================= */
  (function () {
      const desktop = document.getElementById("luuyDesktop");
      const ring = document.getElementById("luuyRing");
      const svg = document.getElementById("luuyConnectors");

      if (!desktop || !ring || !svg) return;

      function drawConnectors() {
        svg.innerHTML = "";

        const desktopRect = desktop.getBoundingClientRect();
        const ringRect = ring.getBoundingClientRect();
        const cards = Array.from(desktop.querySelectorAll("[data-connector-side]"));

        const cx = ringRect.left - desktopRect.left + ringRect.width / 2;
        const cy = ringRect.top - desktopRect.top + ringRect.height / 2;

        /* chạm đúng vòng nét đứt ngoài */
        const r = ringRect.width / 2;

        svg.setAttribute("viewBox", `0 0 ${desktopRect.width} ${desktopRect.height}`);

        cards.forEach((card) => {
          const cardRect = card.getBoundingClientRect();
          const side = card.dataset.connectorSide;

          const anchor = side === "left"
            ? {
                x: cardRect.right - desktopRect.left,
                y: cardRect.top - desktopRect.top + cardRect.height / 2
              }
            : {
                x: cardRect.left - desktopRect.left,
                y: cardRect.top - desktopRect.top + cardRect.height / 2
              };

          /* đoạn ngang sát box */
          const elbowOffset = 42;
          const elbow = side === "left"
            ? { x: anchor.x + elbowOffset, y: anchor.y }
            : { x: anchor.x - elbowOffset, y: anchor.y };

          /* điểm chạm vòng nét đứt */
          const dx = elbow.x - cx;
          const dy = elbow.y - cy;
          const len = Math.hypot(dx, dy) || 1;

          const ringPoint = {
            x: cx + (dx / len) * r,
            y: cy + (dy / len) * r
          };

          /* line kiểu gãy góc: ngang rồi chéo */
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute(
            "d",
            `M ${anchor.x} ${anchor.y}
            L ${elbow.x} ${elbow.y}
            L ${ringPoint.x} ${ringPoint.y}`
          );
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", "rgba(38,168,246,0.72)");
          path.setAttribute("stroke-width", "2.2");
          path.setAttribute("stroke-dasharray", "8 9");
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("stroke-linejoin", "round");
          svg.appendChild(path);

          /* chấm ở box */
          const dotCard = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          dotCard.setAttribute("cx", anchor.x);
          dotCard.setAttribute("cy", anchor.y);
          dotCard.setAttribute("r", "5.2");
          dotCard.setAttribute("fill", "rgba(38,168,246,0.78)");
          svg.appendChild(dotCard);

          /* chấm ở vòng nét đứt */
          const dotRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          dotRing.setAttribute("cx", ringPoint.x);
          dotRing.setAttribute("cy", ringPoint.y);
          dotRing.setAttribute("r", "5.2");
          dotRing.setAttribute("fill", "rgba(38,168,246,0.78)");
          svg.appendChild(dotRing);
        });
      }

      window.addEventListener("resize", drawConnectors);
      requestAnimationFrame(drawConnectors);
    })();

/* ================= Đội ngũ bác sĩ ================= */
  (function () {
      const doctors = [
        {
          id: 0,
          name: "NGUYỄN TRUNG CHÍNH",
          title: "PGS.TS. Bác sĩ Ung bướu",
          image: "./assets/images/image 823.png",
          imageClass: "w-[228px]",
          bio:
            "Chuyên gia ung bướu với nhiều năm kinh nghiệm trong thăm khám, tư vấn và điều trị, luôn tận tâm đồng hành cùng người bệnh trong từng giai đoạn chăm sóc sức khỏe.",
          ratingText: "Được nhiều khách hàng tin tưởng"
        },
        {
          id: 1,
          name: "NGUYỄN HUY BẠO",
          title: "TTND.TS.Bác sĩ CKII Sản phụ khoa",
          image: "./assets/images/image 823 (1).png",
          imageClass: "w-[236px]",
          bio:
            "Với hơn 40 năm kinh nghiệm trong lĩnh vực Sản phụ khoa cùng nhiều nghiên cứu khoa học giá trị về sức khỏe sinh sản phụ nữ, TTND.TS.BS Nguyễn Huy Bạo - Nguyên Giám đốc Bệnh viện Phụ sản Hà Nội đã mang đến hạnh phúc cho hàng triệu thai phụ trong hành trình đón con yêu chào đời.",
          ratingText: "4.8/5 (38 bình chọn)"
        },
        {
          id: 2,
          name: "TRẦN KINH TRANG",
          title: "Bác sĩ CKII Nhi khoa - Siêu âm tim",
          image: "./assets/images/image 823 (2).png",
          imageClass: "w-[236px]",
          bio:
            "Bác sĩ CKII Nhi khoa - Siêu âm tim với phong cách thăm khám kỹ lưỡng, tận tâm và luôn chú trọng theo dõi sát sao tình trạng sức khỏe của trẻ nhỏ.",
          ratingText: "Được nhiều khách hàng tin tưởng"
        },
        {
          id: 3,
          name: "NGUYỄN THỊ KIM YẾN",
          title: "ThS. Dược sỹ",
          image: "./assets/images/image 823 (3).png",
          imageClass: "w-[250px]",
          bio:
            "ThS. Dược sỹ với kinh nghiệm tư vấn sử dụng thuốc an toàn, hiệu quả, hỗ trợ người bệnh và người nhà trong suốt quá trình điều trị tại bệnh viện.",
          ratingText: "Được nhiều khách hàng tin tưởng"
        }
      ];

      const desktopTrack = document.getElementById("doctorTrack");
      const desktopDots = document.getElementById("doctorDots");
      const desktopViewport = document.getElementById("doctorViewport");
      const mobileTrack = document.getElementById("doctorTrackMobile");
      const mobileDots = document.getElementById("doctorDotsMobile");

      if (!desktopTrack || !desktopDots || !desktopViewport || !mobileTrack || !mobileDots) return;

      const state = {
        order: [0, 1, 2, 3],
        activeSlotDesktop: 1,   // card ở giữa
        expandedSlot: null,     // KHÔNG mở sẵn card nào
        dragStartX: 0,
        dragging: false
      };

      function starsHtml() {
        return `
          <div class="doctor-stars text-[18px] leading-none text-[#F2A310]">★★★★★</div>
        `;
      }

      function createDesktopCard(doctor, slot) {
        const card = document.createElement("article");
        card.className = "doctor-card relative";
        card.dataset.slot = slot;
        card.dataset.id = doctor.id;

        card.innerHTML = `
          <div class="doctor-top">
            <img src="${doctor.image}" alt="${doctor.name}" class="${doctor.imageClass}" draggable="false" />
          </div>

          <div class="doctor-bottom">
            <div class="doctor-brief text-center">
              <h3 class="text-[17px] font-bold leading-[1.15] text-[#2E2E2E]">
                ${doctor.name}
              </h3>
              <p class="mt-2 text-[13px] font-normal leading-[1.25] text-[#18A357]">
                ${doctor.title}
              </p>
            </div>

            <div class="doctor-detail text-center">
              <h3 class="text-[17px] font-bold leading-[1.15] text-[#2E2E2E]">
                ${doctor.name}
              </h3>
              <p class="mt-2 text-[13px] font-normal leading-[1.25] text-[#18A357]">
                ${doctor.title}
              </p>

              <p class="mx-auto mt-4 max-w-[250px] text-[12px] font-normal leading-[1.23] text-[#555555]">
                ${doctor.bio}
              </p>

              <div class="mt-3 flex flex-col items-center">
                ${starsHtml()}
                <p class="mt-2 text-[12px] font-normal leading-none text-[#757575]">
                  ${doctor.ratingText}
                </p>
              </div>
            </div>
          </div>
        `;

        card.addEventListener("click", () => {
          state.expandedSlot = state.expandedSlot === slot ? null : slot;
          applyExpandedState();
        });

        return card;
      }

      function applyExpandedState() {
        const cards = Array.from(desktopTrack.querySelectorAll(".doctor-card"));
        cards.forEach((card, slot) => {
          card.classList.toggle("is-expanded", state.expandedSlot === slot);
        });
      }

      function renderDesktop() {
        desktopTrack.innerHTML = "";

        state.order.forEach((doctorIndex, slot) => {
          desktopTrack.appendChild(createDesktopCard(doctors[doctorIndex], slot));
        });

        renderDesktopDots();
        applyExpandedState();
      }

      function renderDesktopDots() {
        desktopDots.innerHTML = "";
        const activeDoctorId = state.order[state.activeSlotDesktop];

        doctors.forEach((doctor) => {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = `doctor-dot ${doctor.id === activeDoctorId ? "is-active" : ""}`;
          dot.setAttribute("aria-label", doctor.name);

          dot.addEventListener("click", () => {
            while (state.order[state.activeSlotDesktop] !== doctor.id) {
              state.order.push(state.order.shift());
            }
            state.expandedSlot = null;
            renderDesktop();
            renderMobileDots();
          });

          desktopDots.appendChild(dot);
        });
      }

      function rotateNext() {
        state.order.push(state.order.shift());
        state.expandedSlot = null;
        renderDesktop();
        renderMobileDots();
      }

      function rotatePrev() {
        state.order.unshift(state.order.pop());
        state.expandedSlot = null;
        renderDesktop();
        renderMobileDots();
      }

      desktopViewport.addEventListener("pointerdown", (e) => {
        state.dragging = true;
        state.dragStartX = e.clientX;
      });

      desktopViewport.addEventListener("pointerup", (e) => {
        if (!state.dragging) return;
        state.dragging = false;

        const diff = e.clientX - state.dragStartX;
        if (Math.abs(diff) < 50) return;

        if (diff < 0) {
          rotateNext();
        } else {
          rotatePrev();
        }
      });

      desktopViewport.addEventListener("pointerleave", () => {
        state.dragging = false;
      });

      desktopViewport.addEventListener("pointercancel", () => {
        state.dragging = false;
      });

      function createMobileCard(doctor) {
        const card = document.createElement("article");
        card.className = "doctor-card-mobile snap-center";
        card.innerHTML = `
          <div class="doctor-mobile-top">
            <img src="${doctor.image}" alt="${doctor.name}" class="${doctor.imageClass}" draggable="false" />
          </div>
          <div class="doctor-mobile-bottom text-center">
            <h3 class="text-[18px] font-bold leading-[1.15] text-[#2E2E2E]">
              ${doctor.name}
            </h3>
            <p class="mt-2 text-[13px] font-normal leading-[1.25] text-[#18A357]">
              ${doctor.title}
            </p>
            <p class="mx-auto mt-4 max-w-[240px] text-[12px] font-normal leading-[1.35] text-[#555555]">
              ${doctor.bio}
            </p>
            <div class="mt-4 flex flex-col items-center">
              ${starsHtml()}
              <p class="mt-2 text-[12px] font-normal leading-none text-[#757575]">
                ${doctor.ratingText}
              </p>
            </div>
          </div>
        `;
        return card;
      }

      function renderMobile() {
        mobileTrack.innerHTML = "";
        state.order.forEach((doctorIndex) => {
          mobileTrack.appendChild(createMobileCard(doctors[doctorIndex]));
        });
        renderMobileDots();
      }

      function renderMobileDots() {
        mobileDots.innerHTML = "";
        const activeDoctorId = state.order[state.activeSlotDesktop];

        doctors.forEach((doctor) => {
          const dot = document.createElement("span");
          dot.className = `doctor-dot-mobile ${doctor.id === activeDoctorId ? "is-active" : ""}`;
          mobileDots.appendChild(dot);
        });
      }

      renderDesktop();
      renderMobile();
    })();


/* ================= menu nav ================= */
const menuBtn = document.getElementById("menuBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileBackdrop = document.getElementById("mobileBackdrop");

const desktopLinks = document.querySelectorAll(".nav-link");
const mobileLinks = document.querySelectorAll(".mobile-nav-link");

/* ===== mobile menu ===== */
function openMenu() {
  document.body.classList.add("menu-open");

  mobileBackdrop.classList.remove("opacity-0", "pointer-events-none");
  mobileBackdrop.classList.add("opacity-100", "pointer-events-auto");

  mobileMenu.classList.remove("-translate-x-full");
  mobileMenu.classList.add("translate-x-0");

  if (menuBtn) {
    menuBtn.setAttribute("aria-expanded", "true");
  }
}

function closeMenu() {
  document.body.classList.remove("menu-open");

  mobileBackdrop.classList.remove("opacity-100", "pointer-events-auto");
  mobileBackdrop.classList.add("opacity-0", "pointer-events-none");

  mobileMenu.classList.remove("translate-x-0");
  mobileMenu.classList.add("-translate-x-full");

  if (menuBtn) {
    menuBtn.setAttribute("aria-expanded", "false");
  }
}

/* ===== desktop active nav ===== */
function setActiveDesktopLink(hash) {
  desktopLinks.forEach((link) => {
    if (link.getAttribute("href") === hash) {
      link.classList.add("nav-link-active");
    } else {
      link.classList.remove("nav-link-active");
    }
  });
}

/* mobile link active nếu bạn cần giữ highlight mobile */
function setActiveMobileLink(hash) {
  mobileLinks.forEach((link) => {
    if (link.getAttribute("href") === hash) {
      link.classList.add("text-[#2497e3]");
    } else {
      link.classList.remove("text-[#2497e3]");
    }
  });
}

function setActiveLink(hash) {
  setActiveDesktopLink(hash);
  setActiveMobileLink(hash);
}

/* ===== events mở / đóng menu ===== */
if (menuBtn) {
  menuBtn.addEventListener("click", openMenu);
}

if (closeMenuBtn) {
  closeMenuBtn.addEventListener("click", closeMenu);
}

if (mobileBackdrop) {
  mobileBackdrop.addEventListener("click", closeMenu);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

/* ===== click nav ===== */
[...desktopLinks, ...mobileLinks].forEach((link) => {
  link.addEventListener("click", () => {
    const hash = link.getAttribute("href");
    setActiveLink(hash);
    closeMenu();
  });
});

/* ===== tự đổi active theo section khi cuộn ===== */
const sectionIds = [
  "#gioithieu",
  "#doituong",
  "#quytrinh",
  "#banggia",
  "#camnhan",
  "#doingu",
  "#hinhanhvideo",
];

const sections = sectionIds
  .map((id) => document.querySelector(id))
  .filter(Boolean);

if (sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      let visibleSection = null;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSection = "#" + entry.target.id;
        }
      });

      if (visibleSection) {
        setActiveDesktopLink(visibleSection);
      }
    },
    {
      root: null,
      rootMargin: "-120px 0px -45% 0px",
      threshold: 0.2,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ===== active ban đầu ===== */
setActiveLink(window.location.hash || "#gioithieu");

/* ================= Hình ảnh của khách hàng khi sử dụng gói dịch vụ Tiêm chủng Vắc-xin ================= */
  /* =========================================================
   == DATA ẢNH: BẠN CHỈ CẦN THÊM / XOÁ ẢNH Ở ĐÂY ==
   ========================================================= */
  const galleryImages = [
    {
      full: './assets/images/main.jpg',
      thumb: './assets/images/main.jpg',
      alt: 'Khách hàng đang được tiêm vắc-xin - ảnh 1'
    },
    {
      full: './assets/images/thumb-1.jpg',
      thumb: './assets/images/thumb-1.jpg',
      alt: 'Khách hàng xếp hàng chờ tiêm - ảnh 2'
    },
    {
      full: './assets/images/thumb-2.png',
      thumb: './assets/images/thumb-2.png',
      alt: 'Chuẩn bị vắc-xin - ảnh 3'
    },
    {
      full: './assets/images/thumb-3.png',
      thumb: './assets/images/thumb-3.png',
      alt: 'Bác sĩ tiêm cho khách hàng - ảnh 4'
    },
    {
      full: './assets/images/thumb-4.png',
      thumb: './assets/images/thumb-4.png',
      alt: 'Tiêm phòng cho gia đình - ảnh 5'
    },
    {
      full: './assets/images/thumb-5.png',
      thumb: './assets/images/thumb-5.png',
      alt: 'Băng dán sau tiêm - ảnh 6'
    },
    {
      full: './assets/images/thumb-6.png',
      thumb: './assets/images/thumb-6.png',
      alt: 'Bác sĩ tiêm cho trẻ em - ảnh 7'
    },
    {
      full: './assets/images/thumb-7.png',
      thumb: './assets/images/thumb-7.png',
      alt: 'Băng cá nhân sau tiêm - ảnh 8'
    }
  ];

  /* =========================================================
    == DOM ELEMENTS ==
    ========================================================= */
  const galleryMainWrapper = document.getElementById('galleryMainWrapper');
  const galleryThumbsWrapper = document.getElementById('galleryThumbsWrapper');
  const prevButton = document.querySelector('.gallery-arrow-prev');
  const nextButton = document.querySelector('.gallery-arrow-next');

  let mainSwiper = null;
  let thumbsSwiper = null;

  /* =========================================================
    == RENDER MAIN SLIDES ==
    ========================================================= */
  function renderMainSlides() {
    if (!galleryMainWrapper) return;

    let html = '';

    galleryImages.forEach((item) => {
      html += `
        <div class="swiper-slide">
          <img
            src="${item.full}"
            alt="${item.alt}"
            class="gallery-main-image"
          />
        </div>
      `;
    });

    galleryMainWrapper.innerHTML = html;
  }

  /* =========================================================
    == RENDER THUMB SLIDES ==
    ========================================================= */
  function renderThumbSlides() {
    if (!galleryThumbsWrapper) return;

    let html = '';

    galleryImages.forEach((item) => {
      html += `
        <div class="swiper-slide">
          <div class="gallery-thumb-box">
            <img
              src="${item.thumb}"
              alt="${item.alt}"
              class="gallery-thumb-image"
            />
          </div>
        </div>
      `;
    });

    galleryThumbsWrapper.innerHTML = html;
  }

  /* =========================================================
    == CUSTOM NAVIGATION ==
    == Ở MÉP CUỐI / ĐẦU: NHẢY THẲNG, KHÔNG LƯỚT QUA ẢNH KHÁC ==
    ========================================================= */
  function bindCustomNavigation() {
    if (!mainSwiper || !prevButton || !nextButton) return;

    prevButton.addEventListener('click', () => {
      const lastIndex = galleryImages.length - 1;

      if (galleryImages.length <= 1) return;

      if (mainSwiper.activeIndex === 0) {
        mainSwiper.slideTo(lastIndex, 0);
      } else {
        mainSwiper.slidePrev();
      }
    });

    nextButton.addEventListener('click', () => {
      const lastIndex = galleryImages.length - 1;

      if (galleryImages.length <= 1) return;

      if (mainSwiper.activeIndex === lastIndex) {
        mainSwiper.slideTo(0, 0);
      } else {
        mainSwiper.slideNext();
      }
    });
  }

  /* =========================================================
    == INIT SWIPER ==
    ========================================================= */
  function initGallerySwiper() {
    renderMainSlides();
    renderThumbSlides();

    if (thumbsSwiper) {
      thumbsSwiper.destroy(true, true);
      thumbsSwiper = null;
    }

    if (mainSwiper) {
      mainSwiper.destroy(true, true);
      mainSwiper = null;
    }

    thumbsSwiper = new Swiper('.gallery-thumbs-slider', {
      slidesPerView: 'auto',
      spaceBetween: 12,
      freeMode: true,
      watchSlidesProgress: true,
      slideToClickedSlide: true,
      speed: 700,
      breakpoints: {
        0: {
          spaceBetween: 10
        },
        768: {
          spaceBetween: 12
        }
      }
    });

    mainSwiper = new Swiper('.gallery-main-slider', {
      speed: 850,
      grabCursor: galleryImages.length > 1,
      effect: 'slide',
      loop: false,
      rewind: false,
      allowTouchMove: true,
      observer: true,
      observeParents: true,
      thumbs: {
        swiper: thumbsSwiper
      }
    });

    bindCustomNavigation();
  }

  /* =========================================================
    == START ==
    ========================================================= */
  document.addEventListener('DOMContentLoaded', initGallerySwiper);

/* ================= Video khách hàng thăm khám tại bệnh viện Phương Đông ================= */
(function () {
  const customerVideos = [
    {
      image: './assets/images/Mask group (3).jpg',
      title: 'Diễn viên Mạnh Trường trải nghiệm dịch vụ Tư vấn & Tiêm chủng Vắc-xin',
      date: '22/07/2022',
      views: '149 người đã xem'
    },
    {
      image: './assets/images/Mask group (1).png',
      title: 'Diễn viên Mạnh Trường trải nghiệm dịch vụ Tư vấn & Tiêm chủng Vắc-xin',
      date: '22/07/2022',
      views: '149 người đã xem'
    },
    {
      image: './assets/images/Mask group (2).png',
      title: 'Diễn viên Mạnh Trường trải nghiệm dịch vụ Tư vấn & Tiêm chủng Vắc-xin',
      date: '22/07/2022',
      views: '149 người đã xem'
    },
    {
      image: './assets/images/Mask group (3).jpg',
      title: 'Diễn viên Mạnh Trường trải nghiệm dịch vụ Tư vấn & Tiêm chủng Vắc-xin',
      date: '22/07/2022',
      views: '149 người đã xem'
    }
  ];

  const customerVideoWrapper = document.getElementById('customerVideoWrapper');
  const modal = document.getElementById('videoPreviewModal');
  const modalImage = document.getElementById('videoPreviewImage');
  const modalClose = document.getElementById('videoPreviewClose');

  if (!customerVideoWrapper) return;

  const calendarIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="#9B9B9B" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3.5" y="5.5" width="17" height="15" rx="2.2"></rect>
        <path d="M7.5 3.5v4"></path>
        <path d="M16.5 3.5v4"></path>
        <path d="M3.5 9.5h17"></path>
      </g>
    </svg>
  `;

  const eyeIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="#9B9B9B" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1.8 12s3.7-6 10.2-6 10.2 6 10.2 6-3.7 6-10.2 6-10.2-6-10.2-6z"></path>
        <circle cx="12" cy="12" r="3.2"></circle>
      </g>
    </svg>
  `;

  function renderCustomerVideos() {
    let html = '';

    customerVideos.forEach((item, index) => {
      html += `
        <div class="swiper-slide">
          <article class="video-card">
            <a
              href="#"
              class="video-thumb js-open-video-preview"
              data-index="${index}"
              aria-label="${item.title}"
            >
              <img src="${item.image}" alt="${item.title}" />

              <div class="video-play-btn" aria-hidden="true">
                <span class="video-play-triangle"></span>
              </div>
            </a>

            <div class="video-info">
              <h3 class="video-title">${item.title}</h3>

              <div class="video-meta">
                <div class="video-meta-item">
                  ${calendarIcon}
                  <span>${item.date}</span>
                </div>

                <div class="video-meta-item">
                  ${eyeIcon}
                  <span>${item.views}</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      `;
    });

    customerVideoWrapper.innerHTML = html;
  }

  function openModal(imageSrc, imageAlt) {
    if (!modal || !modalImage) return;

    modalImage.src = imageSrc;
    modalImage.alt = imageAlt || 'Nội dung xem trước';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal || !modalImage) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    setTimeout(() => {
      modalImage.src = '';
    }, 200);
  }

  function bindModalEvents() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.js-open-video-preview');
      if (trigger) {
        e.preventDefault();
        const index = Number(trigger.dataset.index);
        const item = customerVideos[index];
        if (!item) return;
        openModal(item.image, item.title);
        return;
      }

      if (e.target.closest('[data-close-modal]') || e.target.closest('#videoPreviewClose')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  function initCustomerVideoSwiper() {
    renderCustomerVideos();

    new Swiper('.customer-video-swiper', {
      loop: true,
      speed: 850,
      grabCursor: true,
      navigation: {
        prevEl: '.video-arrow-prev',
        nextEl: '.video-arrow-next'
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 14,
          centeredSlides: true
        },
        641: {
          slidesPerView: 1.2,
          spaceBetween: 18,
          centeredSlides: false
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
          centeredSlides: false
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 28,
          centeredSlides: false
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCustomerVideoSwiper();
    bindModalEvents();

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }
  });
})();


/* ================= Chương trình ưu đãi đặc biệt dành cho gói Tư vấn & Tiêm chủng Vắc-xin ================= */
  /* =========================================================
    == DATA ==
    ========================================================= */
  const promoPlans = [
    {
      image: './assets/images/Rectangle 6609.png',
      title: 'Ưu đãi Tiêm chủng gói Cơ quan',
      price: '999k',
      oldPrice: '(Giá cũ: 1999k)',
      features: [
        'Chương trình ưu đãi dành cho Gia đình 4 người',
        'Chương trình ưu đãi dành cho Gia đình 4 người',
        'Chương trình ưu đãi dành cho Gia đình 4 người',
        'Chương trình ưu đãi dành cho Gia đình 4 người'
      ],
      link: '#'
    },
    {
      image: './assets/images/Rectangle 6602.jpg',
      title: 'Ưu đãi Tiêm chủng gói Gia Đình',
      price: '999k',
      oldPrice: '(Giá cũ: 1999k)',
      features: [
        'Chương trình ưu đãi dành cho Gia đình 4 người',
        'Chương trình ưu đãi dành cho Gia đình 4 người',
        'Chương trình ưu đãi dành cho Gia đình 4 người',
        'Chương trình ưu đãi dành cho Gia đình 4 người'
      ],
      link: '#'
    },
    {
      image: './assets/images/Rectangle 6609 (1).png',
      title: 'Ưu đãi Tiêm chủng gói Cơ quan',
      price: '999k',
      oldPrice: '(Giá cũ: 1999k)',
      features: [
        'Chương trình ưu đãi dành cho Gia đình 4 người',
        'Chương trình ưu đãi dành cho Gia đình 4 người',
        'Chương trình ưu đãi dành cho Gia đình 4 người',
        'Chương trình ưu đãi dành cho Gia đình 4 người'
      ],
      link: '#'
    }
  ];

  /* =========================================================
    == DOM ==
    ========================================================= */
  const promoTrack = document.getElementById('promoTrack');
  const promoPrevBtn = document.getElementById('promoPrevBtn');
  const promoNextBtn = document.getElementById('promoNextBtn');
  const promoStage = document.getElementById('promoStage');

  /* =========================================================
    == ICON CHECK ==
    ========================================================= */
  const checkIcon = `
    <svg class="promo-check" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"></circle>
      <path d="M7 12.5L10.2 15.6L17 8.8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `;

  /* =========================================================
    == STATE ==
    == order = thứ tự hiển thị từ trái qua phải ==
    ========================================================= */
  let order = [0, 1, 2];

  /* =========================================================
    == RENDER ==
    ========================================================= */
  function createCard(item, slotClass, realIndex) {
    const featuresHtml = item.features
      .map((feature) => {
        return `
          <li>
            ${checkIcon}
            <span>${feature}</span>
          </li>
        `;
      })
      .join('');

    return `
      <div class="promo-slot ${slotClass}" data-real-index="${realIndex}">
        <article class="promo-card">
          <div class="promo-media">
            <img src="${item.image}" alt="${item.title}" />
          </div>

          <div class="promo-body">
            <h3 class="promo-title">${item.title}</h3>
            <div class="promo-price">${item.price}</div>
            <div class="promo-old">${item.oldPrice}</div>

            <ul class="promo-list">
              ${featuresHtml}
            </ul>

            <a href="${item.link}" class="promo-btn">ĐĂNG KÝ NGAY</a>
          </div>
        </article>
      </div>
    `;
  }

  function renderPromo() {
    if (!promoTrack) return;

    const leftIndex = order[0];
    const centerIndex = order[1];
    const rightIndex = order[2];

    promoTrack.innerHTML = `
      ${createCard(promoPlans[leftIndex], 'promo-slot-left', leftIndex)}
      ${createCard(promoPlans[centerIndex], 'promo-slot-center', centerIndex)}
      ${createCard(promoPlans[rightIndex], 'promo-slot-right', rightIndex)}
    `;

    bindSideCardClick();
  }

  /* =========================================================
    == ROTATE ==
    == 1 2 3 -> 2 3 1 ==
    ========================================================= */
  function rotateNext() {
    order = [order[1], order[2], order[0]];
    renderPromo();
  }

  function rotatePrev() {
    order = [order[2], order[0], order[1]];
    renderPromo();
  }

  /* =========================================================
    == CLICK CARD BÊN TRÁI / PHẢI ĐỂ ĐƯA VÀO GIỮA ==
    ========================================================= */
  function bindSideCardClick() {
    const leftSlot = promoTrack.querySelector('.promo-slot-left');
    const rightSlot = promoTrack.querySelector('.promo-slot-right');

    if (leftSlot) {
      leftSlot.addEventListener('click', () => {
        rotatePrev();
      });
    }

    if (rightSlot) {
      rightSlot.addEventListener('click', () => {
        rotateNext();
      });
    }
  }

  /* =========================================================
    == SWIPE / DRAG ==
    == vuốt trái -> 1 2 3 => 2 3 1
    == vuốt phải -> 1 2 3 => 3 1 2
    ========================================================= */
  let startX = 0;
  let startY = 0;
  let dragging = false;

  function handleStart(x, y) {
    startX = x;
    startY = y;
    dragging = true;
  }

  function handleEnd(x, y) {
    if (!dragging) return;
    dragging = false;

    const diffX = x - startX;
    const diffY = y - startY;

    if (Math.abs(diffX) < 50 || Math.abs(diffX) < Math.abs(diffY)) return;

    if (diffX < 0) {
      rotateNext();
    } else {
      rotatePrev();
    }
  }

  function bindSwipe() {
    if (!promoStage) return;

    promoStage.addEventListener('touchstart', (e) => {
      const touch = e.changedTouches[0];
      handleStart(touch.clientX, touch.clientY);
    }, { passive: true });

    promoStage.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      handleEnd(touch.clientX, touch.clientY);
    }, { passive: true });

    promoStage.addEventListener('mousedown', (e) => {
      handleStart(e.clientX, e.clientY);
    });

    promoStage.addEventListener('mouseup', (e) => {
      handleEnd(e.clientX, e.clientY);
    });

    promoStage.addEventListener('mouseleave', (e) => {
      if (!dragging) return;
      handleEnd(e.clientX, e.clientY);
    });
  }

  /* =========================================================
    == EVENTS ==
    ========================================================= */
  function bindArrows() {
    if (promoPrevBtn) {
      promoPrevBtn.addEventListener('click', rotatePrev);
    }

    if (promoNextBtn) {
      promoNextBtn.addEventListener('click', rotateNext);
    }
  }

  /* =========================================================
    == START ==
    ========================================================= */
  document.addEventListener('DOMContentLoaded', () => {
    renderPromo();
    bindArrows();
    bindSwipe();
  });


/* ================= Quyền lợi khách hàng ================= */
(function () {
  const rightsTableData = [
    {
      titleTop: "GÓI VẮC XIN CHO TRẺ EM",
      titleBottom: "DANH MỤC GÓI VẮC XIN 0 - 6 THÁNG",
      headers: [
        "STT",
        "Phòng bệnh",
        "Tên Vắc xin",
        "Nước sản xuất",
        "Gói 1",
        "Gói 2",
        "Gói 3",
        "Gói 4"
      ],
      rows: [
        {
          cells: [
            "1",
            { text: "Lao", align: "left" },
            "BCG",
            "Việt Nam",
            "1",
            "1",
            "1",
            ""
          ],
          striped: true
        },
        {
          cells: [
            { text: "2", rowspan: 3 },
            { text: "Tiêu chảy do Rota virus", rowspan: 3, align: "left" },
            "Rotarix",
            "Bỉ",
            "2",
            "",
            "",
            "2"
          ]
        },
        {
          cells: [
            "Rotavin",
            "Việt Nam",
            "",
            "2",
            "",
            ""
          ]
        },
        {
          cells: [
            "Rotateq",
            "Mỹ",
            "",
            "",
            "3",
            ""
          ]
        },
        {
          cells: [
            "3",
            {
              text: "Ho gà, Bạch hầu, Uốn ván, Bại liệt, Viêm màng não mủ, Viêm họng, Viêm phổi do HIB (5 in 1)",
              align: "left"
            },
            "Pentaxim",
            "Pháp",
            "",
            "3",
            "",
            ""
          ],
          striped: true
        },
        {
          cells: [
            "4",
            { text: "Viêm gan B", align: "left" },
            "Engerix B 0,5 ml",
            "Bỉ",
            "",
            "3",
            "",
            ""
          ]
        },
        {
          cells: [
            { text: "5", rowspan: 2 },
            {
              text: "Ho gà, Bạch hầu, Uốn ván, Bại liệt, Viêm màng não mủ, Viêm họng, Viêm phổi do HIB, Viêm gan B (6 in 1)",
              rowspan: 2,
              align: "left"
            },
            "InfanrixHexa",
            "Bỉ",
            "3",
            "",
            "",
            "3"
          ],
          striped: true
        },
        {
          cells: [
            "Hexaxim",
            "Pháp",
            "",
            "",
            "3",
            ""
          ]
        },
        {
          cells: [
            { text: "6", rowspan: 2 },
            {
              text: "Hội chứng nhiễm trùng viêm màng não, viêm phổi, nhiễm khuẩn huyết, viêm tai giữa do phế cầu",
              rowspan: 2,
              align: "left"
            },
            "Prevenar 13",
            "Anh",
            "",
            "",
            "3",
            "3"
          ]
        },
        {
          cells: [
            "Synflorix",
            "Bỉ",
            "3",
            "3",
            "",
            ""
          ],
          striped: true
        },
        {
          cells: [
            {
              text: "Tổng số (liều)",
              colspan: 4,
              bold: true
            },
            "9",
            "12",
            "10",
            "8"
          ],
          striped: true,
          bold: true
        },
        {
          cells: [
            {
              text: "Giá gói (VNĐ)",
              colspan: 4,
              bold: true
            },
            "9,546,000",
            "8,598,000",
            "10,842,000",
            "10,278,000"
          ],
          bold: true,
          textColor: "text-sky-700"
        }
      ]
    },

    {
      titleTop: "GÓI VẮC XIN CHO TRẺ EM",
      titleBottom: "DANH MỤC GÓI VẮC XIN 6 - 12 THÁNG",
      headers: [
        "STT",
        "Phòng bệnh",
        "Tên Vắc xin",
        "Nước sản xuất",
        "Gói A",
        "Gói B",
        "Gói C",
        "Gói D"
      ],
      rows: [
        {
          cells: [
            "1",
            { text: "Cúm mùa", align: "left" },
            "Vaxigrip Tetra",
            "Pháp",
            "1",
            "1",
            "",
            ""
          ],
          striped: true
        },
        {
          cells: [
            "2",
            { text: "Sởi - Quai bị - Rubella", align: "left" },
            "MMR II",
            "Mỹ",
            "",
            "1",
            "1",
            ""
          ]
        },
        {
          cells: [
            "3",
            { text: "Thủy đậu", align: "left" },
            "Varivax",
            "Mỹ",
            "1",
            "",
            "1",
            "1"
          ],
          striped: true
        },
        {
          cells: [
            {
              text: "Tổng số (liều)",
              colspan: 4,
              bold: true
            },
            "2",
            "2",
            "2",
            "1"
          ],
          striped: true,
          bold: true
        },
        {
          cells: [
            {
              text: "Giá gói (VNĐ)",
              colspan: 4,
              bold: true
            },
            "3,200,000",
            "3,850,000",
            "4,150,000",
            "2,600,000"
          ],
          bold: true,
          textColor: "text-sky-700"
        }
      ]
    },

    {
      titleTop: "GÓI VẮC XIN CHO TRẺ EM",
      titleBottom: "DANH MỤC GÓI VẮC XIN 12 - 24 THÁNG",
      headers: [
        "STT",
        "Phòng bệnh",
        "Tên Vắc xin",
        "Nước sản xuất",
        "Gói X",
        "Gói Y",
        "Gói Z",
        "Gói VIP"
      ],
      rows: [
        {
          cells: [
            "1",
            { text: "Viêm não Nhật Bản", align: "left" },
            "Imojev",
            "Pháp",
            "2",
            "",
            "2",
            "2"
          ],
          striped: true
        },
        {
          cells: [
            "2",
            { text: "Viêm màng não mô cầu", align: "left" },
            "Bexsero",
            "Ý",
            "",
            "2",
            "2",
            "2"
          ]
        },
        {
          cells: [
            "3",
            { text: "Viêm gan A", align: "left" },
            "Havrix 720",
            "Bỉ",
            "2",
            "2",
            "",
            "2"
          ],
          striped: true
        },
        {
          cells: [
            {
              text: "Tổng số (liều)",
              colspan: 4,
              bold: true
            },
            "4",
            "4",
            "4",
            "6"
          ],
          striped: true,
          bold: true
        },
        {
          cells: [
            {
              text: "Giá gói (VNĐ)",
              colspan: 4,
              bold: true
            },
            "6,800,000",
            "7,400,000",
            "7,150,000",
            "9,900,000"
          ],
          bold: true,
          textColor: "text-sky-700"
        }
      ]
    }
  ];

  const wrapper = document.getElementById("rightsTableWrapper");
  if (!wrapper) return;

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderCell(cell, tag = "td") {
    const isObject = typeof cell === "object" && cell !== null;
    const text = isObject ? cell.text ?? "" : cell;
    const rowspan = isObject && cell.rowspan ? ` rowspan="${cell.rowspan}"` : "";
    const colspan = isObject && cell.colspan ? ` colspan="${cell.colspan}"` : "";
    const alignClass = isObject && cell.align === "left" ? " text-left" : "";
    const fontClass = isObject && cell.bold ? " font-semibold" : "";

    return `
      <${tag}${rowspan}${colspan}
        class="border border-slate-300 px-2 py-2${alignClass}${fontClass}">
        ${escapeHtml(text)}
      </${tag}>
    `;
  }

  function renderHeader(headers) {
    return `
      <thead>
        <tr class="bg-[#0F7FC6] text-white">
          ${headers.map((header) => `
            <th class="border border-slate-300 px-2 py-2">
              ${escapeHtml(header)}
            </th>
          `).join("")}
        </tr>
      </thead>
    `;
  }

  function renderRows(rows) {
    return rows.map((row) => {
      const bgClass = row.striped ? "bg-sky-50" : "";
      const fontClass = row.bold ? " font-semibold" : "";
      const textColor = row.textColor ? ` ${row.textColor}` : " text-slate-700";

      return `
        <tr class="${bgClass}${fontClass}${textColor}">
          ${row.cells.map((cell) => renderCell(cell)).join("")}
        </tr>
      `;
    }).join("");
  }

  function renderSlide(table) {
    return `
      <div class="swiper-slide">
        <div class="overflow-x-auto rounded-[12px] border border-slate-200">
          <div class="min-w-[460px] bg-white">
            <div class="flex items-start justify-between px-6 pt-5">
              <div class="flex items-center gap-3">
                <img src="./assets/logo/logo.png" alt="logo" class="h-12 w-auto" />
              </div>

              <div class="text-right">
                <h3 class="text-[17px] font-extrabold uppercase leading-tight text-sky-600">
                  ${escapeHtml(table.titleTop)}
                </h3>
                <p class="text-[17px] font-extrabold uppercase leading-tight text-sky-600">
                  ${escapeHtml(table.titleBottom)}
                </p>
              </div>
            </div>

            <table class="mt-5 w-full border-collapse text-center text-[11px] text-slate-700">
              ${renderHeader(table.headers)}
              <tbody>
                ${renderRows(table.rows)}
              </tbody>
            </table>

            <div class="flex items-center justify-between px-6 py-4 text-[12px] font-bold text-sky-600">
              <span>BỆNH VIỆN ĐA KHOA PHƯƠNG ĐÔNG</span>
              <span>1900 1806</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  rightsTableData.forEach((table) => {
    wrapper.insertAdjacentHTML("beforeend", renderSlide(table));
  });

  new Swiper(".rights-table-swiper", {
    slidesPerView: 1,
    spaceBetween: 16,
    speed: 700,
    grabCursor: true,
    autoHeight: true,
    resistanceRatio: 0.85,
    pagination: {
      el: "#rightsTablePagination",
      clickable: true
    }
  });
})();


/* ================= THẮC MẮC KHÁCH HÀNG ================= */
(function () {
  const qaData = [
    {
      questionImage: "./assets/images/Rectangle 6403.jpg",
      questionTitle: "Bệnh viện Phương Đông có tiêm phòng trước khi mang thai không?",
      questionText:
        "Xin chào bệnh viện, em chưa có kinh nghiệm về thai sản và sắp tới em có dự tính có em bé, em muốn hỏi bên bệnh viện mình có xét nghiệm và tiêm phòng trước khi mang thai không ạ và em mới bị COVID-19 hiện tại đã khỏi lúc có ảnh hưởng gì đến việc tiêm phòng không? Nếu có thì phải chờ bao lâu mới được tiêm phòng và chi phí các mũi tiêm là như thế nào ạ? Cảm ơn quý bệnh viện.",

      askerAvatar: "./assets/images/Ellipse 1054.png",
      askerName: "Nguyễn Minh Ánh",
      askerMeta: "Đã hỏi: Ngày 25/07/2022",

      doctorAvatar: "./assets/images/image 884.png",
      doctorName: "Bác sĩ Nguyễn Huy Bạo",
      doctorMeta: "Đã trả lời: Ngày 25/07/2022",

      answerTitle:
        "Cảm ơn quý khách đã đặt câu hỏi cho chuyên mục Hỏi đáp chuyên gia của Bệnh viện Đa khoa Phương Đông",
      answerParagraphs: [
        "Bệnh viện Đa khoa Phương Đông hiện cung cấp đa dạng các dịch vụ xét nghiệm tổng quát và tiêm chủng chất lượng cao dành cho phụ nữ dự định mang thai với quy trình khoa học, an toàn, hiệu quả, thực hiện bởi đội ngũ cán bộ y tế giỏi chuyên môn, giàu kinh nghiệm cùng hệ thống máy móc hiện đại.",
        "Nếu bạn từng mắc COVID-19 và đã khỏi, sau khi hết thời gian cách ly và xét nghiệm cho kết quả âm tính thì có thể tiêm các vắc-xin dành cho phụ nữ sắp mang thai. Tuy nhiên nếu còn cảm thấy mệt, chưa hồi phục sức khỏe hoặc trong gia đình còn người đang cách ly thì bạn nên trì hoãn đến khi cơ thể đảm bảo đủ sức khỏe và những người trong nhà đều đã âm tính mới nên tiêm ngừa vắc-xin."
      ]
    },

    {
      questionImage: "./assets/images/Rectangle 6403.jpg",
      questionTitle: "Sau khi tiêm vắc-xin cần theo dõi trong bao lâu?",
      questionText:
        "Em muốn hỏi sau khi tiêm tại bệnh viện thì cần ở lại theo dõi trong bao lâu, có cần kiêng ăn uống gì không và nếu bị sốt nhẹ sau tiêm thì nên xử lý như thế nào để an toàn?",

      askerAvatar: "./assets/images/Ellipse 1054.png",
      askerName: "Lê Thu Hà",
      askerMeta: "Đã hỏi: Ngày 27/07/2022",

      doctorAvatar: "./assets/images/Ellipse 1054 (1) copy.png",
      doctorName: "Bác sĩ Nguyễn Huy Bạo",
      doctorMeta: "Đã trả lời: Ngày 27/07/2022",

      answerTitle:
        "Bệnh viện xin giải đáp về thời gian theo dõi và chăm sóc sau tiêm",
      answerParagraphs: [
        "Sau khi tiêm, khách hàng thường được theo dõi tối thiểu 30 phút tại cơ sở y tế để kịp thời phát hiện và xử trí các phản ứng bất thường nếu có.",
        "Khi về nhà, bạn nên tiếp tục theo dõi sức khỏe trong 24 đến 48 giờ đầu, nghỉ ngơi hợp lý, uống đủ nước và liên hệ nhân viên y tế nếu có dấu hiệu bất thường kéo dài."
      ]
    },

    {
      questionImage: "./assets/images/Rectangle 6403.jpg",
      questionTitle: "Bệnh viện có hỗ trợ đặt lịch tiêm chủng online không?",
      questionText:
        "Tôi muốn đăng ký tiêm cho gia đình vào cuối tuần, bệnh viện có hỗ trợ đặt lịch trước qua website hoặc hotline không và khi đến có cần mang theo giấy tờ gì?",

      askerAvatar: "./assets/images/Ellipse 1054.png",
      askerName: "Phạm Hoài Nam",
      askerMeta: "Đã hỏi: Ngày 30/07/2022",

      doctorAvatar: "./assets/images/Ellipse 1054 (2) copy.png",
      doctorName: "Bác sĩ Nguyễn Huy Bạo",
      doctorMeta: "Đã trả lời: Ngày 30/07/2022",

      answerTitle:
        "Thông tin về hình thức đặt lịch tiêm chủng tại Bệnh viện Đa khoa Phương Đông",
      answerParagraphs: [
        "Bệnh viện hỗ trợ khách hàng đặt lịch trước qua các kênh trực tuyến và hotline để chủ động thời gian thăm khám, tư vấn và tiêm chủng.",
        "Khi đến bệnh viện, bạn nên mang theo giấy tờ tùy thân và các hồ sơ tiêm chủng liên quan nếu đã từng tiêm trước đó để bác sĩ dễ theo dõi."
      ]
    }
  ];

  const faqServiceList = document.getElementById("faqServiceList");
  if (!faqServiceList) return;
  function getOffsetTopRelativeToParent(element, parent) {
  let top = 0;
  let current = element;

  while (current && current !== parent) {
    top += current.offsetTop;
    current = current.offsetParent;
  }

  return top;
}

function updateFaqTimelineHeight() {
  const bottomDots = faqServiceList.querySelectorAll(".faq-center-dot.bottom");
  if (!bottomDots.length) return;

  const lastBottomDot = bottomDots[bottomDots.length - 1];
  const lineTop = 14;
  const lastBottomDotCenter =
    getOffsetTopRelativeToParent(lastBottomDot, faqServiceList) +
    lastBottomDot.offsetHeight / 2;

  faqServiceList.style.setProperty("--faq-line-top", `${lineTop}px`);
  faqServiceList.style.setProperty(
    "--faq-line-height",
    `${Math.max(0, lastBottomDotCenter - lineTop)}px`
  );
}

  function renderAnswerParagraphs(paragraphs) {
    return paragraphs.map((text) => `<p>${text}</p>`).join("");
  }

  function createQaItem(item) {
    const block = document.createElement("div");
    block.className = "faq-flow";

    block.innerHTML = `
      <div class="faq-center-axis"></div>
      <div class="faq-center-dot top"></div>
      <div class="faq-center-dot bottom"></div>

      <div class="faq-connector top-left"></div>
      <div class="faq-connector top-right"></div>
      <div class="faq-connector bottom-left"></div>
      <div class="faq-connector bottom-right"></div>

      <article class="faq-card faq-question-card">
        <div class="faq-question-image">
          <img src="${item.questionImage}" alt="Câu hỏi khách hàng" />
        </div>

        <div class="faq-question-content">
          <h3 class="faq-question-title">${item.questionTitle}</h3>
          <p class="faq-question-text">${item.questionText}</p>
        </div>
      </article>

      <article class="faq-card faq-asker-card">
        <div class="faq-avatar">
          <img src="${item.askerAvatar}" alt="${item.askerName}" />
        </div>

        <div class="faq-person-content">
          <h4 class="faq-person-name">${item.askerName}</h4>
          <p class="faq-person-meta">${item.askerMeta}</p>
        </div>
      </article>

      <article class="faq-card faq-doctor-card">
        <div class="faq-avatar">
          <img src="${item.doctorAvatar}" alt="${item.doctorName}" />
        </div>

        <div class="faq-person-content">
          <h4 class="faq-person-name">${item.doctorName}</h4>
          <p class="faq-person-meta">${item.doctorMeta}</p>
        </div>
      </article>

      <article class="faq-card faq-answer-card">
        <h3 class="faq-answer-title">${item.answerTitle}</h3>
        <div class="faq-answer-text">
          ${renderAnswerParagraphs(item.answerParagraphs)}
        </div>
      </article>
    `;

    return block;
  }

  function renderFaqService() {
  faqServiceList.innerHTML = "";
  qaData.forEach((item) => {
    faqServiceList.appendChild(createQaItem(item));
  });

  updateFaqTimelineHeight();
}

  renderFaqService();
  window.addEventListener("resize", updateFaqTimelineHeight);
})();