import { useMyData } from "./useMyData";
import {
	TeamsUserCredential,
	createMicrosoftGraphClient,
} from "@microsoft/teamsfx";
import { useCallback } from "react";

export function useLoopGraph(array, asyncFunc, options) {
	const { loading, data, error, getData } = useMyData();

	// const initial = getData(async (asyncFunc, options) => {
	// 	const { scope } = { scope: ["User.Read"], ...options };
	// 	try {
	// 		const credential = new TeamsUserCredential();
	// 		const graph = createMicrosoftGraphClient(credential, scope);
	// 		return await asyncFunc(graph);
	// 	} catch (err) {
	// 		if (err.code.includes("UiRequiredError")) {
	// 			// Silently fail for user didn't login error
	// 		} else {
	// 			throw err;
	// 		}
	// 	}
	// });
	const getGraphData = useCallback(
		(asyncFunc, options) => {
			const { scope } = { scope: ["User.Read"], ...options };
			getData(async () => {
				try {
					const credential = new TeamsUserCredential();
					// await credential.login(scope);
					const graph = createMicrosoftGraphClient(credential, scope);
					return await asyncFunc(graph);
				} catch (err) {
					if (err.code.includes("UiRequiredError")) {
						// Silently fail for user didn't login error
					} else {
						throw err;
					}
				}
			});
		},
		[getData],
	);
	const getArrayData = () => {
		array.map((item) => getGraphData(asyncFunc, options));
	};
	/*	getData((asyncFunc) => {
				const { data, error, loading } = (async () => {
					const credential = new TeamsUserCredential();
					await credential.login(scope);
					const graph = createMicrosoftGraphClient(credential, scope);
					return await asyncFunc(graph);
				});
				return { data, error, loading };
			});*/
	return { data, error, loading, getGraphData };
	// data || error || loading?
	// : {
	// 		data: initial.data,
	// 		error: initial.error,
	// 		loading: initial.loading,
	// 		getGraphData,
	//   };
}
