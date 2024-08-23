var puzzle_id_g = "";

document.addEventListener("DOMContentLoaded", () => {
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  const errorDiv = document.getElementById("error");

  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  forgotPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const puzzelAns = document.getElementById("puzzelAns").value;

    if (!isValidEmail(email)) {
      alert("Please Enter valid email!!");
      return;
    }

    try {
      const response = await fetch(
        "https://www.aeropres.in/chromeapi/dawn/v1/user/sendforgotpasswordlink/v2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email,
            puzzle_id: puzzle_id_g,
            ans: puzzelAns,
          }),
        }
      );

      const data = await response.json();
      //alert(JSON.stringify(data));
      if (response.ok) {
        alert("reset password link sent to email, please check inbox/spam");
        getPuzzel();
        document.getElementById("email").value = "";
        document.getElementById("puzzelAns").value = "";
        errorDiv.textContent = "";
        window.location.href = "signin.html";
      } else {
        throw new Error(data.message || "An error occurred");
      }
    } catch (error) {
      errorDiv.textContent = error.message;
      if (error.message == "refresh your captcha!!") {
        errorDiv.textContent = "Please Enter Your Captcha Again!";
        getPuzzel();
      }
      if (error.message == "Incorrect answer. Try again!") {
        errorDiv.textContent = "Incorrect answer. Try again!";
      }
      if (error.message.includes("#11")) {
        alert(error.message);
      }
    }
  });
  getPuzzel();
});
async function getPuzzel() {
  try {
    const response = await fetch(
      `https://www.aeropres.in/chromeapi/dawn/v1/puzzle/get-puzzle`
    );

    if (!response.ok) {
      throw new Error(
        response.message || `HTTP error! status: ${response.status}`
      );
    }
    const data = await response.json();
    puzzle_id_g = data.puzzle_id;
    getPuzzelbase64(data.puzzle_id);
    return data;
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error.message
    );
  }
}
async function getPuzzelbase64(puzzelid) {
  try {
    const response = await fetch(
      `https://www.aeropres.in/chromeapi/dawn/v1/puzzle/get-puzzle-image?puzzle_id=${puzzelid}`
    );

    if (!response.ok) {
      throw new Error(
        response.message || `HTTP error! status: ${response.status}`
      );
    }
    const data = await response.json();
    const puzzleImage = document.getElementById("puzzleImage");
    const puzzle = document.getElementById("captcha");
    const loader = document.getElementById("loader");
    puzzleImage.src = "data:image/jpeg;base64," + data.imgBase64;
    puzzle.style.display = "inline";
    loader.style.display = "none";

    return data;
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error.message
    );
  }
}
