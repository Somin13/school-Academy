let promoContainer = document.querySelector("#promos-container");
let studentName = document.querySelector("#student");

const API_KEY = "c4f79550-9f4a-4ff8-8775-8e848412d687";
const URL_API = "http://146.59.242.125:3009";

// Création du bouton "Ajouter une promo"
let addPromoBtn = document.createElement("button");
addPromoBtn.textContent = "Ajouter une promo";
addPromoBtn.classList.add("add-promo-btn");
promoContainer.parentElement.insertBefore(addPromoBtn, promoContainer);

// Gestionnaire d'événement pour afficher le formulaire d'ajout
addPromoBtn.addEventListener("click", () => {
    displayAddPromoForm();
});

async function getPromo() {
    const response = await fetch(URL_API + "/promos", {
        method: "GET",
        headers: {
            authorization: "Bearer " + API_KEY,
        },
    });
    const data = await response.json();
    console.log(data);
    namePromo(data);
}

async function namePromo(data) {
    promoContainer.textContent = "";

    data.forEach((element) => {
        let promoBlock = document.createElement("article");
        promoBlock.classList.add("promos-block");

        let namepromotion = document.createElement("h2");
        let startDate = document.createElement("p");
        let endDate = document.createElement("p");

        namepromotion.textContent = element.name;
        startDate.textContent = new Date(element.startDate).toLocaleDateString();
        endDate.textContent = new Date(element.endDate).toLocaleDateString();

        namepromotion.classList.add("name-promos");
        startDate.classList.add("start-date");
        endDate.classList.add("end-date");

        promoBlock.appendChild(namepromotion);
        promoBlock.appendChild(startDate);
        promoBlock.appendChild(endDate);

        let btnContainer = document.createElement("div");
        btnContainer.classList.add("btn-Container");
        promoBlock.appendChild(btnContainer);

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "supprimer";
        promoBlock.classList.add("delet-btn");
        btnContainer.appendChild(deleteBtn);

        deleteBtn.addEventListener("click", () => {
            deletPromo(element._id);
            promoBlock.remove();
        });

        let editBtn = document.createElement("button");
        editBtn.textContent = "Modifier";
        editBtn.classList.add("Edit-Btn");
        btnContainer.appendChild(editBtn);

        editBtn.addEventListener("click", () => {
            displayFormUpdate(promoBlock, element);
        });

        promoContainer.appendChild(promoBlock);
    });
}

function displayFormUpdate(element, promo) {
    element.textContent = "";

    const inputName = document.createElement("input");
    inputName.classList.add("inputNameForm");
    inputName.value = promo.name;
    element.appendChild(inputName);

    const inputStartdate = document.createElement("input");
    inputStartdate.value = new Date(promo.startDate).toISOString().split("T")[0];
    inputStartdate.type = "date";
    element.appendChild(inputStartdate);

    const inputEndDate = document.createElement("input");
    inputEndDate.value = new Date(promo.endDate).toISOString().split("T")[0];
    inputEndDate.type = "date";
    element.appendChild(inputEndDate);

    let submitBtn = document.createElement("button");
    submitBtn.textContent = "Valider";
    element.appendChild(submitBtn);

    submitBtn.addEventListener("click", () => {
        editPromo(promo._id, {
            name: inputName.value,
            startDate: inputStartdate.value,
            endDate: inputEndDate.value,
        });
    });

    let cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    element.appendChild(cancelBtn);

    cancelBtn.addEventListener("click", () => {
        getPromo();
    });
}

function displayAddPromoForm() {
    promoContainer.textContent = "";

    let form = document.createElement("form");
    form.classList.add("add-promo-form");

    const inputName = document.createElement("input");
    inputName.type = "text";
    inputName.placeholder = "Nom de la promotion";
    inputName.required = true;

    const inputStartdate = document.createElement("input");
    inputStartdate.type = "date";
    inputStartdate.required = true;

    const inputEndDate = document.createElement("input");
    inputEndDate.type = "date";
    inputEndDate.required = true;

    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Ajouter";
    submitBtn.type = "submit"; 

    const cancelAdd = document.createElement("button")
    cancelAdd.textContent = "Annuler"
    

    form.appendChild(inputName);
    form.appendChild(inputStartdate);
    form.appendChild(inputEndDate);
    form.appendChild(submitBtn);
    form.appendChild(cancelAdd)

    promoContainer.appendChild(form);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        addPromo({
            name: inputName.value,
            startDate: inputStartdate.value,
            endDate: inputEndDate.value,
        });
    });

    cancelAdd.addEventListener("click", () =>{
        getPromo();
    })
}

async function deletPromo(id) {
    const response = await fetch(URL_API + "/promos/" + id, {
        method: "DELETE",
        headers: {
            authorization: "Bearer " + API_KEY,
        },
    });
}

async function editPromo(id, updateData) {
    const response = await fetch(URL_API + "/promos/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + API_KEY,
        },
        body: JSON.stringify(updateData),
    });
    if (response.ok) {
        console.log("Promotion mise à jour avec succès !");
        getPromo();
    } else {
        console.error("Erreur lors de la mise à jour :", response.statusText);
    }
}

async function addPromo(newPromo) {
    const response = await fetch(URL_API + "/promos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + API_KEY,
        },
        body: JSON.stringify(newPromo),
    });

    if (response.ok) {
        console.log("Promotion ajoutée avec succès !");
        getPromo(); 
    } else {
        console.error("Erreur lors de l'ajout :", response.statusText);
    }
}

getPromo();
