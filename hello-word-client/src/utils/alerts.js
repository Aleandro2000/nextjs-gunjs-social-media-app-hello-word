import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const displayToast = (message, isSuccessfull = true) => {
  Toast.fire({
    icon: isSuccessfull ? "success" : "error",
    title: message,
  });
};

module.exports = {
  displayToast,
};
