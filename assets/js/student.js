const API_KEY = "c4f79550-9f4a-4ff8-8775-8e848412d687";
const URL_API = "http://146.59.242.125:3009";


function getId() {
    const params = new URLSearchParams(window.location.search);
    const idPromo = params.get("id");
    if (!idPromo) {
        console.error("Erreur : Aucun ID de promo trouvé dans l'URL.");
        return null;
    }
    return idPromo;
}

async function getPromoName() {
    const promoId = getId();
    if (!promoId) return;

    const response = await fetch(URL_API + "/promos/" + promoId, {
        method: "GET",
        headers: {
            authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json",
        },
    });

    const promoData = await response.json();
    const promoTitleElement = document.querySelector("#promo-title");
    promoTitleElement.textContent = promoData.name || "Nom non disponible";
}

async function getStudent() {
    const response = await fetch(URL_API +"/promos/" +getId(), {
        method: "GET",
        headers: {
            authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json",
        },
    });

    const dataStudent = await response.json();
    console.log("Données récupérées depuis l'API :", dataStudent);
    return dataStudent.students || [];
}

async function getAvatar(idStudent) {
    const response = await fetch(URL_API + "/promos/" + getId() + "/students/" + idStudent + "/avatar", {
        method: "GET",
        headers: {
            authorization: "Bearer " + API_KEY,
        },
    });

    const avatarBlob = await response.blob();
    const avatarUrl = URL.createObjectURL(avatarBlob);
    return avatarUrl;
}

async function addStudent() {
    const studentContainer = document.querySelector("#student-container");
    studentContainer.textContent = "Chargement des étudiants...";

    const studentData = await getStudent();
    studentContainer.textContent = ""; 

    for (const student of studentData) {


        const studentBlock = document.createElement("ul");
        studentBlock.classList.add("student-block");

        const infoContainer = document.createElement("div")
        infoContainer.classList.add("info-container")

        const firstName = document.createElement("li");
        firstName.innerHTML = "<u>Prénom</u> : "   + student.firstName;

        const lastName = document.createElement("li");
        lastName.innerHTML = "<u>Nom</u> : " + student.lastName;

        const age = document.createElement("li");
        age.innerHTML = "<u>Age</u> : " + student.age;

        const avatar = document.createElement("img");
        avatar.alt = "Student Avatar";
        avatar.src = await getAvatar(student._id);
        avatar.classList.add("avatar");

        infoContainer.appendChild(firstName);
        infoContainer.appendChild(lastName);
        infoContainer.appendChild(age);
        infoContainer.appendChild(avatar);

        const btnContainer = document.createElement("div");
        btnContainer.classList.add("btn-contain");

        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.textContent = "Modifier";
        btnContainer.appendChild(editBtn);
        editBtn.addEventListener("click", () => {
            
            displayUpdate(studentBlock, student);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Suprimer";
        btnContainer.appendChild(deleteBtn);
        deleteBtn.addEventListener("click", () => {
            deleteStudent(student._id);
        });

        studentBlock.appendChild(infoContainer)
        studentBlock.appendChild(btnContainer);
        studentContainer.appendChild(studentBlock);
        
    }
}

function displayUpdate(element, student) {
    element.textContent = "";

    const inputEditName = document.createElement("input");
    inputEditName.value = student.firstName;

    const inputEditLastName = document.createElement("input");
    inputEditLastName.value = student.lastName;

    const inputAge = document.createElement("input");
    inputAge.value = student.age;

    const inputAvatar = document.createElement("input");
    inputAvatar.type = "file";
    inputAvatar.accept = "image/*";

    const submitBtn = document.createElement("button");
    submitBtn.classList.add("enr-btn")
    submitBtn.textContent = "Enregister";

    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("annul-btn")
    cancelBtn.textContent = "Annuler";

    element.appendChild(inputEditName);
    element.appendChild(inputEditLastName);
    element.appendChild(inputAge);
    element.appendChild(inputAvatar);
    element.appendChild(submitBtn);
    element.appendChild(cancelBtn);

    submitBtn.addEventListener("click", async () => {
        const formData = new FormData();
        formData.append("firstName", inputEditName.value);
        formData.append("lastName", inputEditLastName.value);
        formData.append("age", parseInt(inputAge.value, 10));

        //----- Ajoute l'avatar uniquement s'il est sélectionné
        if (inputAvatar.files[0]) {
            formData.append("avatar", inputAvatar.files[0]);
        }

        await editStudent(student._id, formData);
        addStudent();
    });

    cancelBtn.addEventListener("click", () => {
        addStudent();
    });
}

function addNewStudent() {
    const addContainer = document.querySelector("#add-container");
    const addButton = document.createElement("button");
    addButton.classList.add("add-btn")
    addButton.textContent = "Ajouter un nouvel étudiant";
    addButton.addEventListener("click", () => displayAddStudent());
    addContainer.appendChild(addButton);
}

function displayAddStudent() {
    const studentContainer = document.querySelector("#student-container");
    const addContainer = document.querySelector("#add-container");

    //------- Cachez tout le contenu sauf le formulaire
    studentContainer.style.display = "none";
    addContainer.style.display = "none";

    //------ Création du formulaire
    const form = document.createElement("form");
    form.id = "add-student-form";

    const inputName = document.createElement("input");
    inputName.type = "text";
    inputName.placeholder = "Prénom";
    inputName.required = true;

    const inputLastName = document.createElement("input");
    inputLastName.type = "text";
    inputLastName.placeholder = "Nom";
    inputLastName.required = true;

    const inputAge = document.createElement("input");
    inputAge.type = "Age";
    inputAge.placeholder = "Age";
    inputAge.required = true;

    const inputAvatar = document.createElement("input");
    inputAvatar.classList.add("choice-avatar")
    inputAvatar.type = "file";
    inputAvatar.accept = "image/*";

    const submitBtn = document.createElement("button");
    submitBtn.classList.add("enregister")
    submitBtn.textContent = "Enregistrer";

    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("annuler")
    cancelBtn.textContent = "Annuler";
    cancelBtn.type = "button";

    cancelBtn.addEventListener("click", () => {
        
        form.remove();
        studentContainer.style.display = "block";
        addContainer.style.display = "flex";
    });

    form.appendChild(inputName);
    form.appendChild(inputLastName);
    form.appendChild(inputAge);
    form.appendChild(inputAvatar);
    form.appendChild(submitBtn);
    form.appendChild(cancelBtn);

    document.body.appendChild(form); 
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("firstName", inputName.value);
        formData.append("lastName", inputLastName.value);
        formData.append("age", inputAge.value);
        formData.append("avatar", inputAvatar.files[0]);

        await createStudent(formData);

        form.remove();
        studentContainer.style.display = "block";
        addContainer.style.display = "flex";

        addStudent(); 
    });
}

async function createStudent(formData) {
    const response = await fetch(URL_API + "/promos/" + getId() + "/students/", {
        method: "POST",
        headers: {
            authorization: "Bearer " + API_KEY,
        },
        body: formData,
    });
}


async function editStudent(idStudent, formData) {
    const response = await fetch(URL_API + "/promos/" + getId() + "/students/" + idStudent, {
        method: "PUT",
        headers: {
            authorization: "Bearer " + API_KEY,
        },
        body: formData, //---- Envoie directement le FormData
    });

}


async function deleteStudent(idStudent) {
    const response = await fetch(URL_API + "/promos/" + getId() + "/students/" + idStudent, {
        method: "DELETE",
        headers: {
            authorization: "Bearer " + API_KEY,
        },
    });

    addStudent();
}

function addHomeButton() {
    const homeButton = document.createElement("button")
    homeButton.classList.add("home-btn")
    homeButton.innerHTML = '<ion-icon name="arrow-back-outline"></ion-icon>'

    homeButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });
    document.body.appendChild(homeButton);
}

addStudent();
addNewStudent();
addHomeButton()
getPromoName()
