const calendar = document.getElementById("calendar");
const monthName = document.getElementById("monthName");
const daysContainer = document.querySelector(".days");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let currentDate = new Date();
let globalColorCount = 0;
let isColorPreviewActive = false;
let currentColorMode = "text"; // Default to text mode

// Listen for changes in the color mode selector
document.querySelectorAll('input[name="colorMode"]').forEach((radio) => {
  radio.addEventListener("change", (event) => {
    currentColorMode = event.target.value;
    const rgbPicker = document.getElementById("rgbColorPicker");
    rgbPicker.style.display =
      currentColorMode === "rgb" ? "inline-block" : "none";
  });
});

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthName.textContent = date.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  daysContainer.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("day");
    daysContainer.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day");
    dayCell.textContent = day;
    dayCell.addEventListener("click", () => handleDayClick(dayCell));
    daysContainer.appendChild(dayCell);
  }
}

function handleDayClick(dayCell) {
  // Only allow selecting a day for applying global colors if the cell has data
  if (dayCell.textContent.trim() !== "") {
    document
      .querySelectorAll(".day")
      .forEach((day) => day.classList.remove("selected"));
    dayCell.classList.add("selected");
  }
}

function addColorButtons() {
  // Remove the primary color buttons functionality
  // This function is no longer needed and can be left empty or removed entirely.
}

function updateColorPreview(color) {
  const colorPreview = document.getElementById("colorPreview");
  colorPreview.style.backgroundColor = color;

  // Add an "Activate" button inside the preview box
  let activateButton = document.getElementById("activateColorPreview");
  if (!activateButton) {
    activateButton = document.createElement("button");
    activateButton.id = "activateColorPreview";
    activateButton.textContent = "Activate";
    activateButton.style.marginTop = "10px";
    activateButton.style.padding = "5px 10px";
    activateButton.style.cursor = "pointer";
    activateButton.addEventListener("click", () => {
      isColorPreviewActive = !isColorPreviewActive;
      activateButton.textContent = isColorPreviewActive
        ? "Deactivate"
        : "Activate";
    });
    colorPreview.appendChild(activateButton);
  }

  // Add a "Delete" button inside the preview box
  let deleteButton = document.getElementById("deleteGlobalColor");
  if (!deleteButton) {
    deleteButton = document.createElement("button");
    deleteButton.id = "deleteGlobalColor";
    deleteButton.textContent = "Delete";
    deleteButton.style.marginTop = "10px";
    deleteButton.style.padding = "5px 10px";
    deleteButton.style.cursor = "pointer";
    deleteButton.addEventListener("click", () => {
      const selectedDay = document.querySelector(".day.selected");
      if (selectedDay) {
        selectedDay.style.backgroundColor = ""; // Reset the selected day's color
        selectedDay.classList.remove("selected");
      } else {
        alert("Please select a day to delete its color!");
      }
    });
    colorPreview.appendChild(deleteButton);
  }
}

function setGlobalColor() {
  let globalColor;
  if (currentColorMode === "text") {
    globalColor = prompt("Enter a global color (e.g., red, #ff0000):", "");
  } else if (currentColorMode === "rgb") {
    const rgbPicker = document.getElementById("rgbColorPicker");
    globalColor = rgbPicker.value;
  }

  if (globalColor) {
    createGlobalColorButton(globalColor);
  }
}

function createGlobalColorButton(color) {
  globalColorCount++;
  const globalColorId = `globalColor${globalColorCount}`; // Unique ID for the global color

  const globalColorContainer = document.createElement("div");
  globalColorContainer.classList.add("global-color-item");
  globalColorContainer.style.display = "flex";
  globalColorContainer.style.alignItems = "center";
  globalColorContainer.style.marginBottom = "5px";

  // Color preview box
  const colorBox = document.createElement("div");
  colorBox.style.width = "20px";
  colorBox.style.height = "20px";
  colorBox.style.backgroundColor = color;
  colorBox.style.marginRight = "10px";
  globalColorContainer.appendChild(colorBox);

  // Input for naming the color
  const colorNameInput = document.createElement("input");
  colorNameInput.type = "text";
  colorNameInput.value = `Color${globalColorCount}`;
  colorNameInput.style.marginRight = "10px";
  globalColorContainer.appendChild(colorNameInput);

  // Activate/Deactivate button
  const activateButton = document.createElement("button");
  activateButton.textContent = "Activate";
  activateButton.style.marginRight = "5px";
  activateButton.style.padding = "5px 10px";
  activateButton.style.cursor = "pointer";
  let isActive = false;

  activateButton.addEventListener("click", () => {
    // Deactivate all other active buttons
    document.querySelectorAll(".global-color-item button").forEach((button) => {
      if (button.textContent === "Deactivate") {
        button.textContent = "Activate";
        button.parentElement.isActive = false;
        daysContainer.removeEventListener(
          "click",
          button.parentElement.colorDay
        );
      }
    });

    // Toggle the current button's state
    isActive = !isActive;
    activateButton.textContent = isActive ? "Deactivate" : "Activate";

    if (isActive) {
      // Allow coloring multiple days
      daysContainer.addEventListener("click", colorDay);
    } else {
      // Remove the event listener to stop coloring
      daysContainer.removeEventListener("click", colorDay);
    }
  });

  function colorDay(event) {
    if (
      event.target.classList.contains("day") &&
      event.target.textContent.trim() !== ""
    ) {
      event.target.style.backgroundColor = color;
      event.target.dataset.globalColorId = globalColorId; // Assign the global color ID to the day

      // Adjust font color based on the background color
      if (isColorDark(getComputedStyle(event.target).backgroundColor)) {
        event.target.style.color = "white";
      } else {
        event.target.style.color = "black";
      }
    }
  }

  globalColorContainer.colorDay = colorDay; // Store the colorDay function for later removal
  globalColorContainer.isActive = isActive; // Track the activation state
  globalColorContainer.appendChild(activateButton);

  // Edit button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.style.marginRight = "5px";
  editButton.style.padding = "5px 10px";
  editButton.style.cursor = "pointer";
  editButton.addEventListener("click", () => {
    let newColor;
    if (currentColorMode === "text") {
      newColor = prompt("Enter a new color for this global color:", color);
    } else if (currentColorMode === "rgb") {
      const rgbPicker = document.getElementById("rgbColorPicker");
      newColor = rgbPicker.value;
    }

    if (newColor) {
      // Update the color preview box
      colorBox.style.backgroundColor = newColor;

      // Update all days with the current global color ID to the new color
      document.querySelectorAll(".day").forEach((day) => {
        if (day.dataset.globalColorId === globalColorId) {
          day.style.backgroundColor = newColor;

          // Adjust font color based on the new background color
          if (isColorDark(newColor)) {
            day.style.color = "white";
          } else {
            day.style.color = "black";
          }
        }
      });

      // Update the color reference
      color = newColor;
    }
  });
  globalColorContainer.appendChild(editButton);

  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.style.padding = "5px 10px";
  deleteButton.style.cursor = "pointer";
  deleteButton.addEventListener("click", () => {
    // Reset all days with the current global color ID to the default state
    document.querySelectorAll(".day").forEach((day) => {
      if (day.dataset.globalColorId === globalColorId) {
        day.style.backgroundColor = ""; // Reset to default
        day.style.color = "black"; // Reset font color to default
        delete day.dataset.globalColorId; // Remove the global color ID
      }
    });

    // Remove the global color container
    globalColorContainer.remove();

    // Ensure the event listener is removed if active
    if (isActive) {
      daysContainer.removeEventListener("click", colorDay);
    }
  });
  globalColorContainer.appendChild(deleteButton);

  document
    .getElementById("globalColorButtons")
    .appendChild(globalColorContainer);
}

document
  .getElementById("setGlobalColor")
  .addEventListener("click", setGlobalColor);

daysContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("day")) {
    document
      .querySelectorAll(".day")
      .forEach((day) => day.classList.remove("selected"));
    event.target.classList.add("selected");
  }
});

prevMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

renderCalendar(currentDate);

let isDeleteModeActive = false; // Track the state of the delete button

const deleteButton = document.getElementById("deleteColor");
deleteButton.style.color = "black"; // Set font color to black
deleteButton.addEventListener("click", () => {
  isDeleteModeActive = !isDeleteModeActive;
  deleteButton.textContent = isDeleteModeActive ? "Delete✅" : "Delete❌";

  if (isDeleteModeActive) {
    // Enable delete mode
    daysContainer.addEventListener("click", deleteDayColor);

    // Ensure all global colors are set to "Activate"
    document.querySelectorAll(".global-color-item").forEach((container) => {
      const activateButton = container.querySelector("button");
      if (activateButton.textContent !== "Activate") {
        activateButton.textContent = "Activate"; // Force the button text to "Activate"
        container.isActive = false; // Ensure the state is consistent
      }
    });
  } else {
    // Disable delete mode
    daysContainer.removeEventListener("click", deleteDayColor);
  }
});

function deleteDayColor(event) {
  if (
    event.target.classList.contains("day") &&
    event.target.textContent.trim() !== ""
  ) {
    event.target.style.backgroundColor = ""; // Reset the day's color
    event.target.style.color = "black"; // Reset the font color to default
  }
}

function isColorDark(color) {
  // Convert color to RGB
  const rgb = color.match(/\d+/g);
  if (!rgb) return false;

  // Calculate brightness using the formula: (0.299*R + 0.587*G + 0.114*B)
  const brightness = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
  return brightness < 128; // Return true if brightness is below the threshold
}
