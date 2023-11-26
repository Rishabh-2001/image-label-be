const route = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_KEY = "Rishabh#2206";
const path = require("path");
const { send } = require("process");
const { saveUser, verifyUser } = require("../../db/auth");

route.post("/login", (req, res) => {
  const { email, password, userType } = req.body;

  verifyUser({ email, password, userType })
    .then((response) => {
      let userDetails = response?.payload?.data;
      userDetails = { ...userDetails, id: response?.payload?.id };
      bcrypt.compare(password, userDetails.hash, function (err, resp) {
        if (err) {
          return res.status(401).json({ error: "Error comparing passwords." });
        }

        if (resp) {
          const token = jwt.sign(userDetails, "RANDOM-TOKEN", {
            expiresIn: "24h",
          });
          res.status(200).send({
            message: "Login Successful",
            email: response.email,
            userType: userType,
            token,
          });
        } else {
          console.log("Password does not match.");
          return res.status(401).json({ error: "Password does not match." });
        }
      });
    })
    .catch((err) => {
      console.log("ERROR:", err);
      return res.status(401).json({ error: err });
    });
});

route.post("/register", (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let password = req.body.password;
  let userType = req.body.userType;
  let agencyData = req.body.agencyData;

  if (password.length <= 6) {
    return res
      .status(415)
      .json({ error: "password length must be greater than 6 chanracters" });
  } else {
    bcrypt.genSalt(8, function (err, salt) {
      if (err) {
        throw err;
      } else {
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) {
            throw err;
          } else {
            saveUser({
              firstName,
              lastName,
              userType,
              email,
              hash,
              userType,
            })
              .then((response) => {
                console.log("RES CREATED USER:", response);
                return res.sendStatus(201, response);
              })
              .catch((err) => {
                console.log("ERROR in database:", err);
                return res.status(401).json({ error: err });
              });
          }
        });
      }
    });
  }
});

// async function updateStatus(id) {
//   await Users.update(
//     {
//       isVerified: true,
//     },
//     {
//       where: { id: id },
//     }
//   )
//     .then((DBres) => {
//       console.log("SUCCESS updated status ", DBres[0]);
//       return DBres;
//     })
//     .catch((err) => {
//       console.log("Error IN DB:", err);
//       throw err;
//     });
// }
// async function resendOTP(email) {
//   const verificationCode = Math.floor(100000 + Math.random() * 900000);
//   return await Users.update(
//     {
//       otp: verificationCode,
//       tokenCreated: new Date(),
//     },
//     {
//       where: { email: email },
//     }
//   )
//     .then((DBres) => {
//       console.log("SUCCESS DB OPERATION ", DBres[0]);
//       sendMailFn(verificationCode, email);
//       return DBres;
//     })
//     .catch((err) => {
//       console.log("Error IN DB:", err);
//       throw err;
//     });
// }

// route.post("/verify", async (req, response) => {
//   // console.log("TOP is :", req.body.email,req.body.otp);
//   const { email, otp } = req.body;

//   await verifyUser({ email })
//     .then((res) => {
//       console.log("RES:::", res);
//       if (res.isVerified) {
//         return response
//           .status(203)
//           .json({ message: "you are already veried. Please Log in" });
//       } else if (!res.isVerified) {
//         console.log("Coming in not verified email ");
//         const timeToken = res.tokenCreated;
//         const tokenTime = new Date(timeToken);
//         const currentTime = new Date();
//         const timeDiff = currentTime - tokenTime;
//         var seconds = Math.floor(timeDiff / 1000);
//         var minutes = Math.floor(seconds / 60);
//         console.log("MINUTESSSS VALLL #######:, ", minutes);

//         if (minutes > 2) {
//           resendOTP();
//           return response
//             .status(402)
//             .json({ error: "OTP expired, please regenerate" });
//         } else {
//           console.log("Compairing the val ", otp, res.otp);
//           if (otp == res.otp) {
//             console.log("OTP verified");
//             // await Users.update()
//             updateStatus(res.id);
//             return response
//               .status(201)
//               .json({ message: "OTP Verified, Please Log in now" });
//           } else if (otp != res.otp) {
//             return response.status(400).json({ error: "Incorrect OTP !" });
//           }
//         }
//       }
//     })
//     .catch((err) => {
//       console.log("ERR::", err);
//     });
// });

// route.post("/resendOTP", async (req, res) => {
//   const { email } = req.body;
  
//   await resendOTP(email)
//     .then((resp) => {
//       return res
//         .status(201)
//         .json({ message: "Code has been sent successfuly to your email" });
//     })
//     .catch((err) => {
//       return res.status(402).json({ message: "Something went wrong!" });
//     });
// });

module.exports = {
  authRoute: route,
};

