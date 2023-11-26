const db=require('../../firebase/firebase.config')

//function for verifying user while login
async function verifyUser(userData) {
    console.log("DB:", userData);
    try {
      const citiesRef = db.collection("auth");
      const snapshot = await citiesRef
        .where("email", "==", userData?.email)
        .where("userType", "==", userData?.userType)
        .get();
      if (snapshot.empty) {
        console.log("No matching documents.");
        throw { status: false, error: "User doesn't exist" };
      }
      let ress;
      snapshot.forEach((doc) => {
        // console.log(doc.id, '=>', doc.data());
        const dataWithId = { id: doc.id, data: doc.data() };
        console.log(">>>", dataWithId);
        ress = { status: true, payload: dataWithId };
      });
      return ress;
    } catch (error) {
      throw { error };
    }
  }

  //to check if user already registered
async function ifUserAlreadyExist(email) {
    try {
      const citiesRef = db.collection("auth");
      const snapshot = await citiesRef.where("email", "==", email).get();
      if (snapshot.empty) {
        console.log("No matching documents.");
        return { status: false };
      } else {
        return { status: true };
      }
    } catch (error) {
      console.log("Error while checking credentials.");
      return { error };
    }
  }

  // add the user
  async function saveUser({ firstName, lastName, email, hash, userType }) {
    const { status, error } = await ifUserAlreadyExist(email);
    if (error) {
      throw error;
    } else {
      if (status) {
        throw { error: "User Already Exist" };
      } else {
        try {
          const batch = db.batch();
          const nycRef = db.collection("auth").doc(); // Use .doc() to generate a new document ID
          batch.set(nycRef, { email, hash, userType }); // Use batch.set for adding a new document
          console.log("DID:", nycRef.id);
  
          const userData = {
            email,
            firstName,
            lastName,
            userType,
            id: nycRef.id,
          };
          let sfRef;
          if (userType === "CUSTOMER") {
            sfRef = db.collection("Users").doc(nycRef.id); // Use the same ID generated above
          } else {
            sfRef = db.collection("Admin").doc(nycRef.id);
          }
          batch.set(sfRef, userData);
          await batch.commit();
          return { data: "user added successfuly", id: nycRef.id };
        } catch (error) {
          console.error("Error:", error);
          throw error;
        }
      }
    }
  }

  //get user data with email
async function getUser({email})
{

}



module.exports={saveUser, verifyUser}


