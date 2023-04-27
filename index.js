const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.routes");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT;
const app = express();
const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Authentication App (Full Stack APP)");
});

app.get("/auth/github", async (req, res) => {
  const { code } = req.query;
  console.log(code);

  const accessToken = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientID,
        client_secret: clientSecret,
        code: code,
      }),
    }
  ).then((res) => res.json());
  console.log(accessToken);

  const userDetail = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken.access_token}`,
    },
  }).then((res) => res.json());
  console.log(userDetail);
  res.send(userDetail);
});

app.use("/user", userRouter);

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log("Error while connecting to DB");
  }
});
