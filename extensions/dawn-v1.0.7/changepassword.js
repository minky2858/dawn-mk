let token;
chrome.storage.local.get("token", async (result) => {
  if (
    result == undefined ||
    result == null ||
    result.token == undefined ||
    result.token == ""
  ) {
    alert("Login first!!");
  } else {
    token = result.token;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const currentpassword = document.getElementById("currentpassword");
  const newpassword = document.getElementById("newpassword");
  const cnfpassword = document.getElementById("cnfpassword");
  const btnChangePassword = document.getElementById("btnChangePassword");

  btnChangePassword.addEventListener("click", async () => {
    if (newpassword.value.length < 8) {
      alert("new password minimum length 8!!");
      return;
    }

    if (cnfpassword.value.length < 8) {
      alert("confirm password minimum length 8!!");
      return;
    }
    if (newpassword.value != cnfpassword.value) {
      alert("new password and confirm password must be match!!");
      return;
    }
    let data = {
      newpassword: newpassword.value,
      currentpassword: currentpassword.value,
    };
    await changePassword(token, data);
  });
});

function resetFields() {
  document.getElementById("currentpassword").value = "";
  document.getElementById("newpassword").value = "";
  document.getElementById("cnfpassword").value = "";
}

async function changePassword(token, data) {
  try {
    let url = "https://www.aeropres.in/chromeapi/dawn/v1/user/changepassword";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Berear " + token,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "An error occurred");
    }
    //alert("Password changed successfully!");
    window.location.href = "passwordsuccess.html";
  } catch (err) {
    alert("Exception!! " + err.message);
  }
}
