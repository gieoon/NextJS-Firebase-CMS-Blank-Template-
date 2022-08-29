import { getFirestore, addDoc, collection, getDoc, getDocs, deleteDoc, doc, query, where, orderBy, OrderByDirection, updateDoc, QueryConstraint } from "firebase/firestore";
import { SearchResult } from "../models/SearchResult";

/*
export const FIRESTORE_search = async (
    searchTerm: string | null): Promise<SearchResult[]> => {
    
    const db = getFirestore();
    const collectionRef = collection(db, JOB_COLLECTION);

    const queryConstraints: QueryConstraint[] = [];

    if (searchTerm !== null) {
        
        // Use simplest solution for searching strings
        // Does not work for partial strings.
        // Can also use trigrams, but firestore document memory limit is 1MB.
        // Can also use Algolita/Elasticsearch
        
        // https://stackoverflow.com/questions/46568142/google-firestore-query-on-substring-of-a-property-value-text-search
        
        // Search title field.
        // queryConstraints.push(
        //     where(
        //         'title',
        //         '>=',
        //         searchTerm,
        //     ),
        // );

        // queryConstraints.push(
        //     where(
        //         'title',
        //         '<=',//'==',
        //         searchTerm + '\uf8ff'
        //     )
        // );

        // Search description field.
        queryConstraints.push(
            where(
                'desc',
                '>=',
                searchTerm,
            ),
        );

        queryConstraints.push(
            where(
                'desc',
                '<=',
                searchTerm// + '\uf8ff'
            )
        );
        
    }
    
    // if (filterBySelection.currentFilterBy !== null) {
    //     const filtering: QueryConstraint = where(
    //         filterBySelection.currentFilterBy?.fieldName,
    //         filterComparison2FirestoreString(filterBySelection.comparison),
    //         filterBySelection.comparisonValue,
    //     );

    //     queryConstraints.push(filtering);
    // }

    const q = query(collectionRef, ...queryConstraints);

    const querySnapshot = await getDocs(q);

    const out: SearchResult[] = [];

    querySnapshot.forEach((doc) => {
        console.log(`Job: ${doc.id} => ${doc.data()}`);
        const newJob = Job.fromJson(doc.id, doc.data());

        out.push(newJob);
    });

    return out;

}
*/
// export const FIRESTORE_addJob = async (newJob: Job) => {
    
//     const db = getFirestore();
//     const collectionRef = collection(db, JOB_COLLECTION);
//     try {
//         const docId = await addDoc(collectionRef, newJob.toJson());
//         console.log("Created new document with Id: ", docId);

//     } catch (err) {
//         console.error("Error adding document: ", err);

        
//     }
// }

// export const FIRESTORE_updateJob = async (job: Job) => {
    
//     const db = getFirestore();
//     const docRef = doc(db, JOB_COLLECTION, job.docId);
//     console.log(job.toJson());
//     try {
//         await updateDoc(docRef, job.toJson());
//     }
//     catch (err) {
//         console.error("Error updating document: ", err);
//     }
// }

// export const FIRESTORE_deleteJob = async (jobId: string) => {
    
//     const db = getFirestore();

//     const docRef = doc(db, JOB_COLLECTION, jobId);

//     return await deleteDoc(docRef);

// }