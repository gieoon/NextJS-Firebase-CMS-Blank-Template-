import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export async function STORAGE_addImage(uid, file) {
    
    const storageRef = ref(storage, `/${uid}`);

    const metadata = {
        uid: uid
    }

    return await uploadBytes(storageRef, file, metadata).then(snapshot => {
        console.log("Uploaded a blob or file!");

        const downloadUrl = await getDownloadURL(storageRef);
        console.log("Created downloadUrl: ", downloadUrl);

        return downloadUrl;
    });

}

export async function STORAGE_deleteImage(uid, fileName) {

    const storageRef = ref(storage, `${uid}/${fileName}`);

    deleteObject(storageRef).then(() => {
        // Deleted successfully
        console.log("File deleted successfully: ", fileName);
    })
    .catch(err => {
        console.error("Error deleting file: ", err);
    })
}