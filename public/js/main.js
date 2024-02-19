"use strict";

const currentYear = new Date().getFullYear();
document.querySelector(".current-year").textContent = currentYear;

// const initComponent = (cls, options, component) => {
//   var elems = document.querySelector(cls);
//   const initString = eval(`"use strict"; M.${component}.init(elems, options)`);
//   var instance = initString;

// }

const initSideBar = () => {
  var elems = document.querySelector(".sidenav");
  var options = {
    edge: "right",
  };
  var instance = M.Sidenav.init(elems, options);
};

const initCarousel = () => {
  var elems = document.querySelectorAll(".carousel");
  var options = {
    fullWidth: true,
    indicators: true,
  };
  var instances = M.Carousel.init(elems, options);
};

const initFab = () => {
  var elems = document.querySelectorAll(".fixed-action-btn");
  var options = {
    directon: "top",
    hoverEnabled: true,
  };
  var instances = M.FloatingActionButton.init(elems, options);
};

const initAnnouncement = () => {
    var elems = document.querySelectorAll('.modal');
    var options = {
      endingTop : '20%'
    }
    var instances = M.Modal.init(elems, options);
}

const initContactAccordion = () => {
    var elems = document.querySelectorAll('.collapsible.expandable');
    var instances = M.Collapsible.init(elems, {accordion: false});
}

const cycleFns = (fns) => {
  fns.forEach((fn) => {
    document.addEventListener("DOMContentLoaded", fn);
  });
};

const fns = [initSideBar, initCarousel, initFab, initAnnouncement, initContactAccordion];

cycleFns(fns);
