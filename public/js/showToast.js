function showToast(message, type = "info", customDuration = null) {
    let background;
    let duration;
  
    switch (type) {
      case "success":
        background = "#28a745";
        break;
      default:
        background = "#ff5151";
        break;
    }
  
    if (customDuration !== null) {
      duration = customDuration;
    } else {
      duration = type === "otp" ? 10000 : 3000;
    }
  
    Toastify({
      text: message,
      duration: duration,
      gravity: "top",
      position: "center",
      style: {
        textAlign: "center",
        background: background,
        padding: "20px",
        borderRadius: "10px",
        minWidth: "300px",
      }
    }).showToast();
  }
  