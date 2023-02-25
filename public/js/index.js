const addBtn = $(".add");
const removeBtn = $(".remove");
const addRow = $(".add-row");
const removeRow = $(".remove-row");
const nextRow = $("#nextRow");
const rowNext = $("#rowNext");

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
  rowNext.append(
    `
            <tr>
                <td class="col-2 p-0">
                    <select name="disease_name" id="disease_name" class="w-10">
                        <option value="1">Typhoid</option>
                        <option value="2">Malaria</option>
                        <option value="3">Dengue</option>
                        <option value="4">Chikungunya</option>
                        <option value="5">Measles</option>
                        <option value="6">Jaundice</option>
                        <option value="7">Mumps</option>
                        <option value="8">Ch. Pox</option>
                        <option value="9">Diphtheria</option>
                        <option value="10">Diarrhoea</option>
                        <option value="11">Pneumonia</option>
                        <option value="12">Tuberculosis</option>
                        <option value="13">Asthma</option>
                        <option value="14">Rheumatic fever</option>
                        <option value="15">Tonsillitis</option>
                        <option value="16">Tumours</option>
                        <option value="17">Warts</option>
                        <option value="18">Ringworm</option>
                        <option value="19">Other skin disease</option>
                        <option value="20">Otorrhoea</option>
                        <option value="21">Convulsion</option>
                        <option value="22">Rectal disease</option>
                        <option value="23">Hernia</option>
                        <option value="24">Scrotal swelling</option>
                        <option value="25">Scrotal swelling</option>
                        <option value="26">Gall bladder stone</option>
                        <option value="27">Rheumatism</option>
                        <option value="28">Carcinoma</option>
                        <option value="29">Unconscious</option>
                        <option value="30">Burn</option>
                        <option value="31">Other</option>
                        <option value="32">injury/accident</option>
                        <option value="33">Sexual indulgence</option>
                        <option value="35">Venereal diseases</option>
                        <option value="36">Abuse of drugs</option>
                        <option value="37">Radiation</option>
                        <option value="38">Animal bite & vaccination</option>
                    </select>
                </td>
                <td class="col-4 p-0"><textarea name="" id="text2" class="text"></textarea></td>
                <td class="col-4 p-0"><textarea name="" id="text2" class="text"></textarea></td>
                <td class="col-2 p-0"><textarea name="" id="text2" class="text"></textarea></td>                          
            </tr>
        `
  );
});

addBtn.on("click", () => {
  nextRow.append(
    `
            <tr class="row">
                <td class="col-1">1</td>
                <td class="col-3 p-0"><input type="date"></td>
                <td class="col-4 p-0"><textarea name="" class="text" ></textarea></td>
                <td class="col-4 p-0"><textarea name="" class="text" ></textarea></td>
            </tr>
        
        `
  );

  resizingTextarea();
});

removeBtn.on("click",()=>{
    $("#nextRow tr:last-child").remove();
})




// preloader

const loader = $("#preloader");
$(window).on("load", () => {
  loader.css("display", "none");
});

// const loader = document.getElementById("preloader");
// window.addEventListener("load", () => {
//   loader.style.display = "none"
// })
