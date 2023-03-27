const addBtn = $(".add");
const removeBtn = $(".remove");
const addRow = $(".add-row");
const removeRow = $(".remove-row");
const nextRow = $("#nextRow");
const rowNext = $("#lastRowNext");
const select = $("select");
const option = $("option");


function resizingTextarea() {
  $("textarea")
    .each(function () {
      this.setAttribute(
        "style",
        "height:" + this.scrollHeight + "px;overflow-y:hidden;"
      );
    })
    .on("input", function () {
      this.style.height = 0;
      this.style.height = this.scrollHeight + "px";
    });

  $("textarea").trigger("input");
}

resizingTextarea();

addRow.on("click", () => {
  nextRow.append(
    `
      <tr>
        <td>
            <select name="disease_name" id="disease_name" class="select_area" style="padding: 0.8rem;">
              <option value="<%= patientDetails.disease_name %>"><%= patientDetails.disease_name %></option>
              <option value="Typhoid">Typhoid</option>
              <option value="Malaria">Malaria</option>
              <option value="Dengue">Dengue</option>
              <option value="Chikungunya">Chikungunya</option>
              <option value="Measles">Measles</option>
              <option value="Jaundice">Jaundice</option>
              <option value="Mumps">Mumps</option>
              <option value="Ch. Pox">Ch. Pox</option>
              <option value="Diphtheria">Diphtheria</option>
              <option value="Diarrhoea">Diarrhoea</option>
              <option value="Pneumonia">Pneumonia</option>
              <option value="Tuberculosis">Tuberculosis</option>
              <option value="Asthma">Asthma</option>
              <option value="Rheumatic fever">Rheumatic fever</option>
              <option value="Tonsillitis">Tonsillitis</option>
              <option value="Tumours">Tumours</option>
              <option value="Warts">Warts</option>
              <option value="Ringworm">Ringworm</option>
              <option value="Other skin disease">Other skin disease</option>
              <option value="Otorrhoea">Otorrhoea</option>
              <option value="Convulsion">Convulsion</option>
              <option value="Rectal disease">Rectal disease</option>
              <option value="Hernia">Hernia</option>
              <option value="Scrotal swelling">Scrotal swelling</option>
              <option value="Renal disease">Renal disease</option>
              <option value="Gall bladder stone">Gall bladder stone</option>
              <option value="Rheumatism">Rheumatism</option>
              <option value="Carcinoma">Carcinoma</option>
              <option value="Unconscious">Unconscious</option>
              <option value="Burn">Burn</option>
              <option value="Other">Other</option>
              <option value="injury/accident">injury/accident</option>
              <option value="Sexual indulgence">Sexual indulgence</option>
              <option value="Venereal diseases">Venereal diseases</option>
              <option value="Abuse of drugs">Abuse of drugs</option>
              <option value="Radiation">Radiation</option>
              <option value="Thyroid">Thyroid</option>
              <option value="Animal bite & vaccination">Animal bite & vaccination</option>
            </select>
          </td>
        <td><textarea class="w-100" name="timeOf"></textarea>
        <td><textarea class="w-100" name="treatment"></textarea>
        <td><textarea class="w-100" name="result"></textarea>
      </tr>
    `
  );

  resizingTextarea();
});

addBtn.on("click", () => {
  rowNext.append(
    `
      <tr>
        <td class="text-uppercase"><input class="w-100" type="date" name="prescriptionDate"></td>
        <td><textarea class="w-100" name="prescriptionRemarks"></textarea>
        <td><textarea class="w-100" name="prescriptionRx"></textarea>
      </tr>
    `
  );

  resizingTextarea();
});

removeBtn.on("click", () => {
  $("#lastRowNext tr:last-child").remove();
});



removeRow.on("click", () => {
  $("#nextRow tr:last-child").remove();
});

// preloader

const loader = $("#preloader");
$(window).on("load", () => {
  loader.css("display", "none");
});

// const loader = document.getElementById("preloader");
// window.addEventListener("load", () => {
//   loader.style.display = "none"
// })
