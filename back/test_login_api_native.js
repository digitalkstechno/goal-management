const http = require("http");

const data = JSON.stringify({
  email: "staff@test.com",
  password: "123456"
});

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/v1/auth/login",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = "";

  res.on("data", (chunk) => {
    responseData += chunk;
  });

  res.on("end", () => {
    console.log("Status:", res.statusCode);
    try {
      console.log("Response:", JSON.parse(responseData));
    } catch (e) {
      console.log("Raw Response:", responseData);
    }
  });
});

req.on("error", (error) => {
  console.error("Error:", error.message);
});

req.write(data);
req.end();
