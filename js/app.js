const loggedInUser =
  sessionStorage.getItem("sevaUser");


const userNames = {

  nicadmin: {
    name: "NIC Admin",
    role: "Administrator",
    initial: "A"
  },

  nicteam: {
    name: "NIC Team",
    role: "Team Member",
    initial: "T"
  }

};


const currentUser =
  userNames[loggedInUser];


if (currentUser) {

  const userName =
    document.getElementById("userName");

  const userRole =
    document.getElementById("userRole");

  const userAvatar =
    document.getElementById("userAvatar");


  if (userName) {
    userName.textContent =
      currentUser.name;
  }

  if (userRole) {
    userRole.textContent =
      currentUser.role;
  }

  if (userAvatar) {
    userAvatar.textContent =
      currentUser.initial;
  }

}


/* ==========================================================
   STORAGE
========================================================== */

const STORAGE_KEY =
  "sevaDashboardMeta";


const defaultMeta = {

  applicationsTotal: null,

  convenorsFilled: 0

};


let dashboardMeta =
  loadMeta();


function loadMeta() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );


    return saved
      ? {
          ...defaultMeta,
          ...JSON.parse(saved)
        }

      : {
          ...defaultMeta
        };

  }

  catch {

    return {
      ...defaultMeta
    };

  }

}


function saveMeta() {

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(
      dashboardMeta
    )

  );

}


/* ==========================================================
   HELPERS
========================================================== */

function formatNumber(value) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {

    return "—";

  }


  return Number(value)
    .toLocaleString("en-IN");

}


/* ==========================================================
   COUNT-UP ANIMATION
========================================================== */

function animateNumber(
  element,
  target,
  duration = 1000
) {

  if (!element) return;


  const finalValue =
    Number(target);


  if (
    !Number.isFinite(
      finalValue
    )
  ) {

    element.textContent = "—";

    return;

  }


  const startTime =
    performance.now();


  function update(
    currentTime
  ) {

    const elapsed =
      currentTime -
      startTime;


    const progress =
      Math.min(
        elapsed / duration,
        1
      );


    const easedProgress =
      1 -
      Math.pow(
        1 - progress,
        3
      );


    const currentValue =
      Math.floor(
        finalValue *
        easedProgress
      );


    element.textContent =
      currentValue
        .toLocaleString("en-IN");


    if (
      progress < 1
    ) {

      requestAnimationFrame(
        update
      );

    }

    else {

      element.textContent =
        finalValue
          .toLocaleString("en-IN");

    }

  }


  requestAnimationFrame(
    update
  );

}


/* ==========================================================
   DASHBOARD NUMBER ANIMATION
========================================================== */

function animateDashboardNumbers() {


  /* ZONES */

  animateNumber(

    document.getElementById(
      "zonesValue"
    ),

    dashboardData.zones.length,

    900

  );


  /* WEBSITES READY */

  const readyWebsites =
    dashboardData.websites
      .filter(item =>

        [
          "ready",
          "launched"
        ].includes(

          String(
            item.status
          ).toLowerCase()

        )

      ).length;


  animateNumber(

    document.getElementById(
      "webReady"
    ),

    readyWebsites,

    1000

  );


  /* TOTAL WEBSITES */

  animateNumber(

    document.getElementById(
      "webTotal"
    ),

    dashboardData.websites.length,

    1000

  );


  /* CONVENORS */

  const filledConvenors =
    dashboardData.convenors
      .filter(
        row => row.name
      ).length;


  animateNumber(

    document.getElementById(
      "convFilled"
    ),

    filledConvenors,

    1000

  );


  animateNumber(

    document.getElementById(
      "convTotal"
    ),

    dashboardData.convenors.length,

    1000

  );


  /* APPLICATIONS */

const applicationsTotal = dashboardData.zones.reduce(
    (total, zone) => {

        const states = zone.states
            .split(",")
            .map(state => state.trim());

        return total + states.reduce(
            (zoneTotal, state) => {

                const row =
                    dashboardData.applications.find(
                        item => item.state === state
                    );

                return zoneTotal + (
                    row ? Number(row.count) || 0 : 0
                );
            },
            0
        );

    },
    0
);

animateNumber(
    document.getElementById("appTotal"),
    applicationsTotal,
    1400
);


/* ==========================================================
   MAIN DASHBOARD
========================================================== */

function renderDashboard() {


  /* ZONES */

  const zonesValue =
    document.getElementById(
      "zonesValue"
    );

  if (zonesValue) {
    zonesValue.textContent = "0";
  }


  /* WEBSITES */

  const webReady =
    document.getElementById(
      "webReady"
    );

  const webTotal =
    document.getElementById(
      "webTotal"
    );


  if (webReady) {
    webReady.textContent = "0";
  }

  if (webTotal) {
    webTotal.textContent = "0";
  }


  /* CONVENORS */

  const convFilled =
    document.getElementById(
      "convFilled"
    );

  const convTotal =
    document.getElementById(
      "convTotal"
    );


  if (convFilled) {
    convFilled.textContent = "0";
  }

  if (convTotal) {
    convTotal.textContent = "0";
  }


 /* APPLICATIONS */

const appTotal =
    document.getElementById("appTotal");

if (appTotal) {

    const totalApplications =
        dashboardData.zones.reduce(
            (total, zone) => {

                const states = zone.states
                    .split(",")
                    .map(state => state.trim());

                return total + states.reduce(
                    (zoneTotal, state) => {

                        const row =
                            dashboardData.applications.find(
                                item => item.state === state
                            );

                        return zoneTotal +
                            (row ? Number(row.count) || 0 : 0);
                    },
                    0
                );

            },
            0
        );

    appTotal.textContent =
        formatNumber(totalApplications);
}


  /* LAST UPDATED */

  const lastUpdated =
    document.getElementById(
      "lastUpdated"
    );


  if (lastUpdated) {

    lastUpdated.textContent =
      new Date()
        .toLocaleString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }
        );

  }


  renderStages();

  renderNodal();

  renderZones();

  renderWebsites();

  renderConvenors();

  renderApplications();

}


/* ==========================================================
   STATE-WISE PROGRESS
========================================================== */

function renderStages() {

  const tableBody =
    document.querySelector(
      "#stageTable tbody"
    );


  if (!tableBody) return;


  tableBody.innerHTML =

    dashboardData.stages

      .map(
        (row, index) => `

          <tr
            class="stage-row"
            data-state="${encodeURIComponent(
              row.state
            )}"
          >

            <!-- SERIAL -->

            <td class="serial-number">
              ${String(
                index + 1
              ).padStart(2, "0")}
            </td>


            <!-- STATE -->

            <td>

              <button
                class="stage-state-button"
                type="button"
              >

                ${row.state}

              </button>

            </td>


            <!-- STAGES -->

            ${

              row.stages

                .map(
                  stage => `

                    <td>

                      <span
                        class="stage-date"
                      >
                        ${stage}
                      </span>

                    </td>

                  `
                )

                .join("")

            }

          </tr>

        `
      )

      .join("");


  document
    .querySelectorAll(
      ".stage-row"
    )
    .forEach(row => {


      row.addEventListener(
        "click",
        () => {


          const state =
            decodeURIComponent(
              row.dataset.state
            );


          /*
             These functions are only
             called if they exist.
          */

          if (
            state === "Assam" &&
            typeof openAssamCampaign ===
              "function"
          ) {

            openAssamCampaign();

          }


          else if (
            state === "Delhi" &&
            typeof openDelhiCampaign ===
              "function"
          ) {

            openDelhiCampaign();

          }


          else if (
            state === "Gujarat" &&
            typeof openGujaratCampaign ===
              "function"
          ) {

            openGujaratCampaign();

          }

        }
      );

    });

}


/* ==========================================================
   NODAL INSTITUTIONS
   7 FLIP CARDS
========================================================== */

function renderNodal() {

  const container =
    document.getElementById(
      "nodalZoneCards"
    );


  if (!container) return;


  container.innerHTML =

    dashboardData.nodalInstitutions

      .map(
        (zoneData, index) => {


          const stateCount =
            zoneData.states
              ? zoneData.states.length
              : 0;


          return `

            <div
              class="zone-card"
              data-zone-index="${index}"
              role="button"
              tabindex="0"
              aria-label="Open ${zoneData.zone}"
            >

              <div
                class="zone-card-inner"
              >
<!-- FRONT -->

<div
  class="zone-card-front"
>

  <img
    class="zone-card-bg"
    src="${zoneData.image}"
    alt=""
  >

  <div
    class="zone-card-overlay"
  >

    <div
      class="zone-number"
    >
      ZONE ${
        String(
          index + 1
        ).padStart(
          2,
          "0"
        )
      }
    </div>

    <div
      class="zone-card-info"
    >

      <h3>
        ${zoneData.zone}
      </h3>

      <p>
        ${stateCount}
        ${stateCount === 1 ? "state" : "states"} / UTs
      </p>

    </div>

    <div
      class="zone-arrow"
    >
      →
    </div>

  </div>

</div>


                <!-- BACK -->

                <div
                  class="zone-card-back"
                >

                  <span>
                    NODAL INSTITUTIONS
                  </span>

                  <h3>
                    ${zoneData.zone}
                  </h3>

                  <div
                    class="click-text"
                  >
                    Click to know more →
                  </div>

                </div>


              </div>

            </div>

          `;

        }
      )

      .join("");


  /* ========================================================
     CARD CLICK
  ======================================================== */

  container
    .querySelectorAll(
      ".zone-card"
    )
    .forEach(card => {


      const openZone =
        () => {

          const index =
            Number(
              card.dataset.zoneIndex
            );


          openNodalZone(
            index
          );

        };


      card.addEventListener(
        "click",
        openZone
      );


      card.addEventListener(
        "keydown",
        event => {


          if (
            event.key ===
              "Enter" ||

            event.key ===
              " "
          ) {

            event.preventDefault();

            openZone();

          }

        }
      );

    });

}


/* ==========================================================
   OPEN INDIVIDUAL NODAL ZONE
========================================================== */

function openNodalZone(
  index
) {

  const zoneData =
    dashboardData
      .nodalInstitutions[
        index
      ];


  if (!zoneData) return;


  const title =
    document.getElementById(
      "nodalDetailTitle"
    );


  if (title) {

   title.textContent = `${zoneData.zone} Zone - Nodal Institutions`;

  }


  const table =
    document.getElementById(
      "nodalDetailTable"
    );


  if (!table) return;


  table.innerHTML = `

  <thead>
    <tr>
      <th>State</th>
      <th>Nodal Institution</th>
      <th>Contact</th>
    </tr>
  </thead>

  <tbody>

    ${
      zoneData.states
        .map((stateData) => {

          const institutions =
            stateData.institutions || [];

          /* NO INSTITUTION */

          if (institutions.length === 0) {

            return `
              <tr>

                <td>
                  <strong>
                    ${stateData.state}
                  </strong>
                </td>

                <td>
                  <span class="unavailable">
                    Unavailable
                  </span>
                </td>

                <td>
                  <span class="unavailable">
                    Unavailable
                  </span>
                </td>

              </tr>
            `;

          }

          /* INSTITUTIONS */

          return institutions
            .map(
              (institution, institutionIndex) => `

                <tr>

                  <td>
                    ${
                      institutionIndex === 0
                        ? `<strong>${stateData.state}</strong>`
                        : ""
                    }
                  </td>

                  <td>
                    ${institution.name || "Unavailable"}
                  </td>

                  <td>
                    ${institution.contact || "Unavailable"}
                  </td>

                </tr>

              `
            )
            .join("");

        })
        .join("")
    }

  </tbody>

`;


  openModal(
    "nodalDetailModal"
  );

}


/* ==========================================================
   COMPLETE NODAL VIEW
========================================================== */

function openAllNodalInstitutions() {

  const title =
    document.getElementById(
      "nodalDetailTitle"
    );


  if (title) {

    title.textContent =
      "All Nodal Institutions";

  }


  const table =
    document.getElementById(
      "nodalDetailTable"
    );


  if (!table) return;


  table.innerHTML = `

    <thead>

      <tr>

        <th>Zone</th>

        <th>State</th>

        <th>Nodal Institution</th>

        <th>Contact</th>

      </tr>

    </thead>


    <tbody>

      ${

        dashboardData
          .nodalInstitutions

          .map(
            zoneData =>

              zoneData.states

                .map(
                  stateData => {


                    const institutions =
                      stateData
                        .institutions ||
                      [];


                    if (
                      institutions.length ===
                      0
                    ) {

                      return `

                        <tr>

                          <td>
                            <strong>
                              ${zoneData.zone}
                            </strong>
                          </td>

                          <td>
                            ${stateData.state}
                          </td>

                          <td>
                            <span
                              class="unavailable"
                            >
                              Unavailable
                            </span>
                          </td>

                          <td>
                            <span
                              class="unavailable"
                            >
                              Unavailable
                            </span>
                          </td>

                        </tr>

                      `;

                    }


                    return institutions

                      .map(
                        institution => `

                          <tr>

                            <td>
                              <strong>
                                ${zoneData.zone}
                              </strong>
                            </td>

                            <td>
                              ${stateData.state}
                            </td>

                            <td>
                              ${
                                institution.name ||
                                "Unavailable"
                              }
                            </td>

                            <td>
                              ${
                                institution.contact ||
                                "Unavailable"
                              }
                            </td>

                          </tr>

                        `
                      )

                      .join("");

                  }
                )

                .join("")

          )

          .join("")

      }

    </tbody>

  `;


  openModal(
    "nodalDetailModal"
  );

}


/* ==========================================================
   ZONES MODAL
========================================================== */

function renderZones() {

  const table =
    document.getElementById(
      "zonesTable"
    );


  if (!table) return;


  table.innerHTML = `

    <thead>

      <tr>

        <th>Zone / Centre</th>

        <th>States Covered</th>

        <th>Zone In-charge</th>

        <th>Phone</th>

      </tr>

    </thead>


    <tbody>

      ${

        dashboardData.zones

          .map(
            row => `

              <tr>

                <td>
                  <strong>
                    ${row.zone}
                  </strong>
                </td>

                <td>
                  ${row.states}
                </td>

                <td>
                  ${row.inCharge}
                </td>

                <td>
                  ${row.phone || "—"}
                </td>

              </tr>

            `
          )

          .join("")

      }

    </tbody>

  `;

}


/* ==========================================================
   WEBSITES MODAL
========================================================== */

function renderWebsites() {

  const table =
    document.getElementById(
      "websiteTable"
    );


  if (!table) return;


  table.innerHTML = `

    <thead>

      <tr>

        <th>State / Zone</th>

        <th>Status</th>

        <th>Website</th>

        <th>Launch Date</th>

      </tr>

    </thead>


    <tbody>

      ${

        dashboardData.websites

          .map(
            row => `

              <tr>

                <td>

                  <strong>
                    ${row.state}
                  </strong>

                </td>


                <td
                  class="${
                    String(
                      row.status
                    ).toLowerCase() ===
                    "ready"

                      ? "status-ready"

                      : "status-pending"
                  }"
                >

                  ${row.status}

                </td>


                <td>

                  ${
                    row.url ===
                    "—"

                      ? "—"

                      : `
                        <a
                          href="${row.url}"
                          target="_blank"
                          rel="noopener"
                        >
                          Open website
                        </a>
                      `
                  }

                </td>


                <td>
                  ${row.date}
                </td>

              </tr>

            `
          )

          .join("")

      }

    </tbody>

  `;

}


/* ==========================================================
   CONVENORS MODAL
========================================================== */

function renderConvenors() {

  const table =
    document.getElementById(
      "convenorTable"
    );


  if (!table) return;


  table.innerHTML = `

    <thead>

      <tr>

        <th>State / UT</th>

        <th>Zone</th>

        <th>State Type</th>

        <th>Convenor</th>

        <th>Mobile No.</th>

        <th>Photo</th>

      </tr>

    </thead>


    <tbody>

      ${

        dashboardData.convenors

          .map(
            row => `

              <tr>

                <td>
                  <strong>
                    ${row.state || "—"}
                  </strong>
                </td>

                <td>
                  ${row.zone || "—"}
                </td>

                <td>
                  ${row.stateType || "—"}
                </td>

                <td>
                  ${row.name || "—"}
                </td>

                <td>
                  ${row.phone || "—"}
                </td>

                <td>

                  ${
                    row.photo

                      ? `
                        <img
                          class="person-photo"
                          src="${row.photo}"
                          alt="${
                            row.name ||
                            "Convenor"
                          }"
                        >
                      `

                      : `
                        <div
                          class="photo-placeholder"
                        >
                          No photo
                        </div>
                      `
                  }

                </td>

              </tr>

            `
          )

          .join("")

      }

    </tbody>

  `;

}


/* ==========================================================
   APPLICATIONS MODAL
========================================================== */
function renderApplications() {

    const content = document.getElementById("applicationsContent");
    const title = document.getElementById("applicationsTitle");
    const subtitle = document.getElementById("applicationsSubtitle");
    const backBtn = document.getElementById("applicationsBackBtn");
    const downloadBtn = document.getElementById("applicationsDownloadBtn");

    if (!content) return;

    let currentZone = null;

    function getApplicationCount(state) {
        const row = dashboardData.applications.find(
            item => item.state === state
        );

        return row ? row.count : 0;
    }

    function getZoneStates(zoneName) {
        const zone = dashboardData.zones.find(
            z => z.zone === zoneName
        );

        if (!zone) return [];

        return zone.states
            .split(",")
            .map(state => state.trim())
            .filter(Boolean);
    }

    function getZoneTotal(zoneName) {
        const states = getZoneStates(zoneName);

        return states.reduce((total, state) => {
            return total + getApplicationCount(state);
        }, 0);
    }

    function getOverallTotal() {
        return dashboardData.zones.reduce((total, zone) => {
            return total + getZoneTotal(zone.zone);
        }, 0);
    }

    function showZones() {

        currentZone = null;

        title.textContent = "Applications Received";
        subtitle.textContent = "Zone-wise application overview.";

        backBtn.style.display = "none";
        downloadBtn.style.display = "none";

        let html = `
            <div class="applications-zone-grid">
        `;

        dashboardData.zones.forEach(zone => {

            const states = getZoneStates(zone.zone);
            const total = getZoneTotal(zone.zone);

            html += `
                <button
                    class="application-zone-card"
                    data-zone="${zone.zone}"
                    type="button"
                >
                    <div class="application-zone-info">
                        <strong>${zone.zone} Zone</strong>
                        <span>${states.length} States / UTs</span>
                    </div>

                    <div class="application-zone-count">
                        ${total.toLocaleString("en-IN")}
                    </div>

                    <span class="application-zone-arrow">
                        →
                    </span>
                </button>
            `;
        });

        html += `
            </div>
        `;

        content.innerHTML = html;

        content
            .querySelectorAll(".application-zone-card")
            .forEach(card => {

                card.addEventListener("click", () => {
                    showStates(card.dataset.zone);
                });

            });
    }

    function showStates(zoneName) {

        currentZone = zoneName;

        const states = getZoneStates(zoneName);

        title.textContent = `${zoneName} Zone — Applications`;
        subtitle.textContent = "State-wise application count.";

        backBtn.style.display = "inline-flex";
        downloadBtn.style.display = "inline-flex";

        let total = 0;

        let html = `
            <div class="table-wrap">

                <table id="applicationsTable">

                    <thead>
                        <tr>
                            <th>S. No.</th>
                            <th>State / UT</th>
                            <th>Applications</th>
                        </tr>
                    </thead>

                    <tbody>
        `;

        states.forEach((state, index) => {

            const count = getApplicationCount(state);

            total += count;

            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${state}</td>
                    <td>${count.toLocaleString("en-IN")}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>

                    <tfoot>
                        <tr>
                            <th colspan="2">Total</th>
                            <th>${total.toLocaleString("en-IN")}</th>
                        </tr>
                    </tfoot>

                </table>

            </div>
        `;

        content.innerHTML = html;

        downloadBtn.onclick = () => {

            downloadTableAsExcel(
                "applicationsTable",
                `${zoneName} Applications`
            );

        };
    }

    backBtn.onclick = () => {
        showZones();
    };

    showZones();
}



/* ==========================================================
   MODALS
========================================================== */

function openModal(id) {

  const modal =
    document.getElementById(id);


  if (!modal) return;


  modal.classList.add(
    "open"
  );

}


function closeModal(id) {

  const modal =
    document.getElementById(id);


  if (modal) {

    modal.classList.remove(
      "open"
    );

  }

}


/* ==========================================================
   CARD CLICK
========================================================== */

document.addEventListener(
  "click",
  event => {


    const card =
      event.target.closest(
        ".metric-card[data-modal]"
      );


    if (!card) return;


    const modalId =
      card.getAttribute(
        "data-modal"
      );


    const modal =
      document.getElementById(
        modalId
      );


    if (!modal) {

      console.error(
        "Modal not found:",
        modalId
      );

      return;

    }


    if (
      modalId ===
      "zonesModal"
    ) {

      renderZones();

    }


    else if (
      modalId ===
      "websiteModal"
    ) {

      renderWebsites();

    }


    else if (
      modalId ===
      "convenorModal"
    ) {

      renderConvenors();

    }


    else if (
      modalId ===
      "applicationsModal"
    ) {

      renderApplications();

    }


    openModal(
      modalId
    );

  }
);


/* ==========================================================
   CLOSE BUTTONS
========================================================== */

document
  .querySelectorAll(
    "[data-close]"
  )
  .forEach(button => {


    button.addEventListener(
      "click",
      () => {

        closeModal(
          button.dataset.close
        );

      }
    );

  });


/* ==========================================================
   CLICK OUTSIDE MODAL
========================================================== */

document
  .querySelectorAll(
    ".modal"
  )
  .forEach(modal => {


    modal.addEventListener(
      "click",
      event => {


        if (
          event.target ===
          modal
        ) {

          modal.classList.remove(
            "open"
          );

        }

      }
    );

  });


/* ==========================================================
   LOGOUT
========================================================== */

const logoutButton =
  document.getElementById(
    "logoutButton"
  );


if (logoutButton) {

  logoutButton.addEventListener(
    "click",
    () => {

      sessionStorage.removeItem(
        "sevaLoggedIn"
      );

      sessionStorage.removeItem(
        "sevaUser"
      );

      window.location.href =
        "login.html";

    }
  );

}


/* ==========================================================
   USER DROPDOWN
========================================================== */

const userProfileButton =
  document.getElementById(
    "userProfileButton"
  );


const userDropdown =
  document.getElementById(
    "userDropdown"
  );


if (
  userProfileButton &&
  userDropdown
) {


  userProfileButton.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      userDropdown.classList.toggle(
        "show"
      );

    }
  );


  document.addEventListener(
    "click",
    () => {

      userDropdown.classList.remove(
        "show"
      );

    }
  );

}


/* ==========================================================
   MEDIA CAROUSEL
========================================================== */

function initMediaCarousel() {

  const track = document.getElementById("mediaTrack");

  if (!track) return;

  const slides = Array.from(
    track.querySelectorAll(".media-slide")
  );

  if (slides.length === 0) return;

  // Duplicate all slides for seamless infinite scrolling
  slides.forEach(slide => {
    track.appendChild(
      slide.cloneNode(true)
    );
  });

}


/* ==========================================================
   INITIAL RENDER
========================================================== */

renderDashboard();


/* ==========================================================
   COUNT-UP
========================================================== */

setTimeout(
  () => {

    animateDashboardNumbers();

  },
  150
);


/* ==========================================================
   MEDIA
========================================================== */

initMediaCarousel();

function downloadTableAsExcel(tableId, fileName) {
    const table = document.getElementById(tableId);

    if (!table) {
        console.error("Table not found:", tableId);
        return;
    }

    const workbook = XLSX.utils.table_to_book(table, {
        sheet: "Data"
    });

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}