

async function loadEmployeesForTask() {
    const select = document.getElementById("taskAssignedTo");

    if (!select) {
        console.error("Dropdown not found");
        return;
    }

    try {
        const res = await fetch("/api/users?role=employee", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        });

        const data = await res.json();

        console.log("Employees received:", data.users);

        // clear existing options safely
        select.innerHTML = '<option value="">Select Employee</option>';

        data.users.forEach(emp => {
            const option = document.createElement("option");
            option.value = emp._id;
            option.textContent =
                emp.fullName + " (" + (emp.department || "No Dept") + ")";
            select.appendChild(option);
        });

        console.log("Inserted:", data.users.length);

    } catch (err) {
        console.error("Error loading employees:", err);
    }
}



async function loadTasks() {
    const res = await fetch("/api/tasks", {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    });

    const data = await res.json();

    const tbody = document.getElementById("tasksTableBody");

    tbody.innerHTML = data.tasks.map(task => `
        <tr>
            <td>${task.title}</td>
            <td>${task.assignedTo.fullName}</td>
            <td>${task.department}</td>
            <td>${task.priority}</td>
            <td>${task.status}</td>
            <td>${formatDate(task.dueDate)}</td>
            <td>—</td>
        </tr>
    `).join("");
}


document.getElementById("userForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const employeeData = {
        fullName: document.getElementById("userFullName").value,
        email: document.getElementById("userEmail").value,
        username: document.getElementById("userUsername").value,
        password: document.getElementById("userPassword").value,
        role: "employee",
        department: document.getElementById("userDepartment").value
    };

    try {
        const res = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(employeeData)
        });

        const data = await res.json();

        if (data.success) {
            alert("Employee created successfully");
            closeModal("userModal");
            loadUsers();   // refresh table
        } else {
            alert(data.message || "Error creating employee");
        }

    } catch (error) {
        console.error(error);
        alert("Server error");
    }
});


async function loadUsers() {
    const res = await fetch("/api/users", {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    });

    const data = await res.json();

    const tbody = document.getElementById("usersTableBody");

    tbody.innerHTML = data.users.map(user => `
        <tr>
            <td>${user.employeeId || '-'}</td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.department || '-'}</td>
            <td>${user.isActive ? 'Active' : 'Inactive'}</td>
            <td>—</td>
        </tr>
    `).join("");
}
document.addEventListener("click", function (e) {

    const btn = e.target.closest("#addTaskBtn");

    if (btn) {
        e.stopPropagation();   // 🔥 prevent dashboard click interference
        openModal("taskModal");
        loadEmployeesForTask();
    }

});


document.getElementById("taskForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const taskData = {
        title: document.getElementById("taskTitle").value,
        description: document.getElementById("taskDescription").value,
        assignedTo: document.getElementById("taskAssignedTo").value,
        department: document.getElementById("taskDepartment").value,
        priority: document.getElementById("taskPriority").value,
        dueDate: document.getElementById("taskDueDate").value
    };

    try {
        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(taskData)
        });

        const data = await res.json();

        if (data.success) {
            alert("Task assigned successfully");
            closeModal("taskModal");
            loadTasks(); // refresh table
        } else {
            alert(data.message || "Error assigning task");
        }

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
});

function openModal(id) {
    document.getElementById(id).style.display = "flex";
}