import { getFunctions, httpsCallable } from "firebase/functions";



export const addAlert = async (data) => {
    const result = await httpsCallable(getFunctions(), 'addAlert')(data);
    console.log(`Add alerts result: ${JSON.stringify(result, null, 4)}`);
    return result.data;
}
