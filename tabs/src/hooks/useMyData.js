import { useCallback, useReducer } from "react";

const dataReducer = ({ data: oldData }, { type, data, error }) => {
	switch (type) {
		case "loading":
			return { data: oldData, loading: true, error: null };
		case "result":
			return { data, loading: false, error: null };
		case "error":
			return { data: null, loading: false, error };
		default:
			return {};
	}
};

export function useMyData(options) {
	// const { auto } = { auto: true, ...options };
	const [{ data, loading, error }, dispatch] = useReducer(dataReducer, {
		data: null,
		loading: false,
		error: null,
	});
	const getData = useCallback((asyncFn) => {
		if (!loading) dispatch({ type: "loading" });
		if (typeof asyncFn != "function") {
			throw new Error(
				"invalid argument to useMyData, a function is required",
			);
		}
		asyncFn()
			.then((data) => dispatch({ type: "result", data }))
			.catch((error) => dispatch({ type: "error", error }));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return { data, loading, error, getData };
}
