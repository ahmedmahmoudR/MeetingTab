import { useCallback } from "react";
import { useReducer } from "react";

const httpReducer = (currentHttpState, action) => {
	switch (action.type) {
		case "SEND":
			return { loading: true, error: null, data: null };
		case "RESPONSE":
			return {
				...currentHttpState,
				loading: false,
				data: action.responseData,
			};
		case "CLEAR":
			return { ...currentHttpState, error: null };
		default:
			throw new Error("Could not be reached!");
	}
};

export const useHttp = () => {
	const [httpState, dispatchHttp] = useReducer(httpReducer, {
		loading: false,
		error: null,
		data: null,
	});
	const sendRequest = useCallback((url, method, body) => {
		dispatchHttp({ type: "SEND" });
		fetch(url, {
			method,
			body,
			headers: { "Content-Type": "application/json" },
		})
			.then((response) => {
				return response.json();
			})
			.then((responseData) => {
				dispatchHttp({ type: "RESPONSE", responseData });
			})
			.catch((error) => {
				dispatchHttp({
					type: "ERROR",
					errorMessage: "Something went wrong!",
				});
			});
	}, []);
	return {
		data: httpState.data,
		error: httpState.error,
		isLoading: httpState.loading,
		sendRequest,
	};
};
