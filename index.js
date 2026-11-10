

const API_URL = "https://crudcrud.com/api/YOUR_API_KEY/appointmentData";

const appointmentForm = document.getElementById("appointmentForm");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const submitBtn = document.getElementById("submitBtn");
const appointmentList = document.getElementById("appointmentList");
const message = document.getElementById("message");

let editId = null;

// Show messages
function showMessage(text, color = "red") {
    message.textContent = text;
    message.style.color = color;
}

// GET - Fetch all appointments
async function getAppointments() {
    try {
        const response = await axios.get(API_URL);

        appointmentList.innerHTML = "";

        response.data.forEach(appointment => {
            displayAppointment(appointment);
        });

    } catch (error) {
        console.error("GET Error:", error.response?.data || error.message);
        showMessage("Unable to load appointments.");
    }
}

// DISPLAY - Show appointment on screen
function displayAppointment(appointment) {
    const li = document.createElement("li");

    const details = document.createElement("div");

    details.textContent =
        `${appointment.username} | ${appointment.email} | ${appointment.phone}`;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.type = "button";

    editButton.addEventListener("click", () => {
        usernameInput.value = appointment.username;
        emailInput.value = appointment.email;
        phoneInput.value = appointment.phone;

        editId = appointment._id;

        submitBtn.textContent = "Update Appointment";
        showMessage("Edit appointment details.", "blue");
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", async () => {
        await deleteAppointment(appointment._id);
    });

    li.appendChild(details);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    appointmentList.appendChild(li);
}

// POST - Add appointment
async function addAppointment(appointment) {
    try {
        const response = await axios.post(API_URL, appointment);

        console.log("Appointment saved:", response.data);

        return response.data;

    } catch (error) {
        console.error("POST Error:", error.response?.data || error.message);
        throw error;
    }
}

// PUT - Update appointment
async function updateAppointment(id, appointment) {
    try {
        const response = await axios.put(`${API_URL}/${id}`, appointment);

        console.log("Appointment updated successfully");

        return response.data;

    } catch (error) {
        console.error("PUT Error:", error.response?.data || error.message);
        throw error;
    }
}

// DELETE - Delete appointment
async function deleteAppointment(id) {
    try {
        await axios.delete(`${API_URL}/${id}`);

        showMessage("Appointment deleted successfully.", "green");

        await getAppointments();

    } catch (error) {
        console.error("DELETE Error:", error.response?.data || error.message);
        showMessage("Unable to delete appointment.");
    }
}

// FORM SUBMIT - Add or Update
appointmentForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const appointment = {
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim()
    };

    if (!appointment.username || !appointment.email || !appointment.phone) {
        showMessage("Please fill all fields.");
        return;
    }

    try {
        submitBtn.disabled = true;

        if (editId) {
            await updateAppointment(editId, appointment);

            showMessage("Appointment updated successfully.", "green");

            editId = null;
            submitBtn.textContent = "Add Appointment";

        } else {
            await addAppointment(appointment);

            showMessage("Appointment added successfully.", "green");
        }

        appointmentForm.reset();

        await getAppointments();

    } catch (error) {
        showMessage("Unable to save appointment.");
    } finally {
        submitBtn.disabled = false;
    }
});

// INITIALIZE
document.addEventListener("DOMContentLoaded", getAppointments);
