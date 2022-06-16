import React from "react";
import { Input } from "@fluentui/react-northstar";
import { SearchIcon } from "@fluentui/react-icons-northstar";

const SearchBar = ({ handleSearch }) => {
	return (
		<Input
			// onChangeCapture={handleSearch}
			inverted
			icon={<SearchIcon />}
			placeholder='Find...'
		/>
	);
};

export default SearchBar;
