const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const registration = require("./userRegistration");
const employeeModal = require("./employeeModal");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

//

const port = 3001;
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

mongoose.connect(
  "mongodb+srv://delhi93rsharma:XWlifv4AcKiUe99i@project00.vgacull.mongodb.net/?retryWrites=true&w=majority&appName=Project00"
);

// const middleWare = (req, res, next) => {
//   res.status(200);
// };

app.post("/registration", async (req, res) => {
  const { Name, Email, Password, Phone } = req.body;
  if (!(Name && Email && Password && Phone)) {
    res.status(500).send("Enter all your fields");
  } else {
    const ifUserAlreadyRegistered = await registration?.findOne({ Email });

    if (!!ifUserAlreadyRegistered) {
      res.status(501).send("User already Exists");
    } else {
      const codedPassword = await bcrypt.hash(
        Password,
        8
        // function (err, hash) {}
      );

      const registeredUser =
        (await !!codedPassword) &&
        registration.create({
          Name,
          Email,
          Password: codedPassword,
          Phone,
          Token: "",
        });

      var token = jwt.sign({ id: registeredUser?._id }, "shhhhh", {
        expiresIn: "1h",
      });

      res
        .json({
          message: "Registered Successflly",
          Token: token,
          Email,
          status: 200,
        })
        .status(200);
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!(Email && Password)) {
      res.status(500).send("All Fields are not available");
    } else {
      const isUserAvailable = await registration?.findOne({ Email });
      if (!!isUserAvailable) {
        const isPasswordMatch = await bcrypt.compare(
          Password,
          isUserAvailable?.Password
        );
        if (!!isPasswordMatch) {
          var token = jwt.sign({ id: isUserAvailable?._id }, "shhhhh", {
            expiresIn: "1h",
          });

          res
            .json({
              Token: token,
              message: "logged in successfully",
              Id: isUserAvailable?._id,
              Email: isUserAvailable?.Email,
              status: 200,
            })
            .status(200);
        } else {
          res.status(500).send("Incorrect Password");
        }
      } else res.status(500).send("user not found");
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/addEmployee", async (req, res) => {
  const { name, email, position, department, salary } = req.body;
  employeeModal.create({
    name,
    email,
    position,
    department,
    salary,
  });

  res.json({ message: "Employee Added Successfully", Status: 200 });
});

app.get("/allEmployee", async (req, res) => {
  try {
    const response = await employeeModal.find();

    res.status(200).json(response);
    // console.log(response, "response12 c");
  } catch (err) {
    console.log(err);
  }
});

app.get("/getEmployee/:id", async (req, res) => {
  const employeeId = req.params.id;
  try {
    const response = await employeeModal.find({ _id: employeeId });
    console.log(response, "responsew");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
  }
});

app.put("/updateEmployee/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { name, email, position, department, salary } = req.body;
    const response = await employeeModal.findByIdAndUpdate(employeeId, {
      name,
      email,
      position,
      department,
      salary,
    });

    // console.log(response, "responseresponse432");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
  }
});

app.delete("/deleteEmployee/:id", async (req, res) => {
  const employeeId = req.params.id;

  const response = await employeeModal.findByIdAndDelete({ _id: employeeId });

  console.log("employeeId:", employeeId);
  console.log("response:", response);
  res.status(200).send({ message: "Employee Deleted", status: 200 });
});

app.listen(port, () => console.log(`Listening    to ${port} `));
