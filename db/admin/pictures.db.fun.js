const db=require('../../firebase/firebase.config')


async function addImages(data)
{
    const {id}=data;
    

    try {
        let cityRef;
        if(id)
        {
            console.log("Gaving id", id);
            cityRef = db.collection('Tags').doc(id);
        }
        else{
            cityRef = db.collection('Tags').doc();
        }
        const res = await cityRef.set(data, { merge: true });
        console.log("RESSS:", res);
        if(tagsCache?.totalDocs)
        {
            tagsCache={...tagsCache, totalDocs: tagsCache?.totalDocs+1}
        }
        return {data:res}
    } catch (error) {
        console.log("ERR<", error);
        throw error;
    }


}

async function updateImages(data)
{
    const {id, customerTags}=data;
    console.log("Chaning i", id ,customerTags);
    try {
      const cityRef = db.collection('Tags').doc(id);
      const res = await cityRef.update({labels: data?.customerTags});
      return {data:res}
    } catch (error) {
        console.log("ERR<", error);
        throw error;
    }


}




async function removeImage(id)
{
 
    console.log("deelting ", id);

    try {
        let cityRef;
        const res = await db.collection('Tags').doc(id).delete();
     
        console.log("RESSS:", res);
        if(tagsCache?.totalDocs)
        {
            tagsCache={...tagsCache, totalDocs: tagsCache?.totalDocs-11}
        }
        return {data:res}
    } catch (error) {
        console.log("ERR<", error);
        throw error;
    }


}
let tagsCache={};
async function getImages(page, pageSize, category, labels) {
    let labelsArr = [];
    console.log("getting ", page, pageSize, category, labels, "FOR CUST");
    if (labels) {
        labelsArr = labels.split(',').map(word => word.trim().toLowerCase());
        // Make sure to apply the same treatment to the actual field in Firestore
      }
      
      // ...
      
  
    try {
      let query = db.collection("Tags");
  
      // Conditionally add where clause if category is provided
      if (category) {
        query = query.where("category", "==", category);
      }
  
      // Conditionally add where-in clause if labels array is provided
      if (labelsArr && labelsArr.length > 0) {
        query = query.where("labels", "array-contains-any", labelsArr);
        // Make sure to apply the same treatment to the actual field in Firestore
      }
  
      const lastDoc = await query
        .limit((page - 1) * pageSize + 1) // Get the last document on the previous page
        .get()
        .then((snapshot) => {
          const docs = snapshot.docs;
          return docs[docs.length - 1];
        });
  
      if (lastDoc) {
        const querySnapshot = await query
          .startAfter(lastDoc)
          .limit(parseInt(pageSize))
          .get();
  
        const data = [];
  
        querySnapshot.forEach((doc) => {
          const docWithId = { id: doc.id, data: doc.data() };
          data.push(docWithId);
        });
  
        let finalData;
  
        // implemented basic server caching here
        if (tagsCache?.totalDocs) {
          finalData = { data, count: tagsCache?.totalDocs };
        } else {
          const collectionRef = db.collection("Tags");
          const totalDocs = await collectionRef.get().then((snapshot) => snapshot.size);
          tagsCache = { ...tagsCache, totalDocs: totalDocs };
          finalData = { data, count: totalDocs };
        }
  
        return finalData;
      } else {
        const finalData = { data: [], count: 0 };
        return finalData;
      }
    } catch (err) {
      console.log("ER:", err);
      throw err;
    }
  }
  
  
  
module.exports={addImages, updateImages, getImages, removeImage}