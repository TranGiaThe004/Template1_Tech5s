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


/* ================= Quyền lợi khách hàng ================= */  
  (function () {
      const slides = document.querySelectorAll('.table-slide');
      const dots = document.querySelectorAll('.table-dot');
      const slider = document.getElementById('tableSlider');

      let currentIndex = 0;
      let startX = 0;
      let startY = 0;
      let isPointerDown = false;

      function showSlide(index) {
        currentIndex = Math.max(0, Math.min(index, slides.length - 1));

        slides.forEach((slide, i) => {
          slide.classList.toggle('hidden', i !== currentIndex);
        });

        dots.forEach((dot, i) => {
          if (i === currentIndex) {
            dot.classList.remove('bg-slate-300', 'w-[16px]');
            dot.classList.add('bg-[#F79433]', 'w-[24px]');
          } else {
            dot.classList.remove('bg-[#F79433]', 'w-[24px]');
            dot.classList.add('bg-slate-300', 'w-[16px]');
          }
        });
      }

      dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          showSlide(Number(dot.dataset.slide));
        });
      });

      function handleStart(x, y) {
        startX = x;
        startY = y;
        isPointerDown = true;
      }

      function handleEnd(x, y) {
        if (!isPointerDown) return;
        isPointerDown = false;

        const diffX = x - startX;
        const diffY = y - startY;

        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            showSlide(currentIndex + 1);
          } else {
            showSlide(currentIndex - 1);
          }
        }
      }

      slider.addEventListener(
        'touchstart',
        (e) => {
          const touch = e.changedTouches[0];
          handleStart(touch.clientX, touch.clientY);
        },
        { passive: true }
      );

      slider.addEventListener(
        'touchend',
        (e) => {
          const touch = e.changedTouches[0];
          handleEnd(touch.clientX, touch.clientY);
        },
        { passive: true }
      );

      slider.addEventListener('mousedown', (e) => {
        handleStart(e.clientX, e.clientY);
      });

      slider.addEventListener('mouseup', (e) => {
        handleEnd(e.clientX, e.clientY);
      });

      slider.addEventListener('mouseleave', (e) => {
        if (isPointerDown) {
          handleEnd(e.clientX, e.clientY);
        }
      });

      showSlide(0);
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

  function setActiveLink(hash) {
    desktopLinks.forEach((link) => {
      if (link.getAttribute("href") === hash) {
        link.classList.add("nav-link-active");
      } else {
        link.classList.remove("nav-link-active");
      }
    });
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", openMenu);
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", closeMenu);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener("click", closeMenu);
  }

  [...desktopLinks, ...mobileLinks].forEach((link) => {
    link.addEventListener("click", () => {
      const hash = link.getAttribute("href");
      setActiveLink(hash);
      closeMenu();
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

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
  /* =========================================================
    == DATA VIDEO ==
    ========================================================= */
  const customerVideos = [
    {
      image: './assets/images/Mask group (3).jpg',
      title: 'Diễn viên Mạnh Trường trải nghiệm dịch vụ Tư vấn & Tiêm chủng Vắc-xin',
      date: '22/07/2022',
      views: '149 người đã xem',
      url: '#'
    },
    {
      image: './assets/images/Mask group (1).png',
      title: 'Diễn viên Mạnh Trường trải nghiệm dịch vụ Tư vấn & Tiêm chủng Vắc-xin',
      date: '22/07/2022',
      views: '149 người đã xem',
      url: '#'
    },
    {
      image: './assets/images/Mask group (2).png',
      title: 'Diễn viên Mạnh Trường trải nghiệm dịch vụ Tư vấn & Tiêm chủng Vắc-xin',
      date: '22/07/2022',
      views: '149 người đã xem',
      url: '#'
    },
    {
      image: './assets/images/Mask group (3).jpg',
      title: 'Diễn viên Mạnh Trường trải nghiệm dịch vụ Tư vấn & Tiêm chủng Vắc-xin',
      date: '22/07/2022',
      views: '149 người đã xem',
      url: '#'
    }
  ];

  /* =========================================================
    == DOM ==
    ========================================================= */
  const customerVideoWrapper = document.getElementById('customerVideoWrapper');

  /* =========================================================
    == ICON SVG ==
    ========================================================= */
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

  /* =========================================================
    == RENDER SLIDE ==
    ========================================================= */
  function renderCustomerVideos() {
    if (!customerVideoWrapper) return;

    let html = '';

    customerVideos.forEach((item) => {
      html += `
        <div class="swiper-slide">
          <article class="video-card">
            <a href="${item.url}" class="video-thumb" aria-label="${item.title}">
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

  /* =========================================================
    == INIT SWIPER ==
    ========================================================= */
  function initCustomerVideoSwiper() {
    renderCustomerVideos();

    new Swiper('.customer-video-swiper', {
      loop: true,
      speed: 850,
      grabCursor: true,
      slidesPerView: 3,
      spaceBetween: 28,
      navigation: {
        prevEl: '.video-arrow-prev',
        nextEl: '.video-arrow-next'
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 16
        },
        640: {
          slidesPerView: 1.2,
          spaceBetween: 18
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 28
        }
      }
    });
  }

  /* =========================================================
    == START ==
    ========================================================= */
  document.addEventListener('DOMContentLoaded', initCustomerVideoSwiper);


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


/* ================= 9 mũi vắc xin ngoài chương trình tiêm chủng mở rộng cha mẹ không nên bỏ qua ================= */