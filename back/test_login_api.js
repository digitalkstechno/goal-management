const axios = require("axios");

async function testLoginApi() {
  try {
    const response = await axios.post("http://localhost:5000/api/v1/auth/login", {
      email: "staff@test.com",
      password: "123456"
    });
    console.log("Login Success!");
    console.log("Data:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Login Failed!");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Message:", error.response.data.message);
    } else {
      console.error("Error:", error.message);
    }
  }
}

testLoginApi();
