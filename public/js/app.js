"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    });
  });

  const taxSwitch = document.querySelector("#switchCheckDefault");

  if (taxSwitch) {
    taxSwitch.addEventListener("click", () => {
      const taxInfo = document.getElementsByClassName("tax-info");

      for (let tax of taxInfo) {
        if (tax.style.display !== "inline") {
          tax.style.display = "inline";
        } else {
          tax.style.display = "none";
        }
      }
    });
  }
});