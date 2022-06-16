import { FilterIcon, Grid, Segment, Text } from "@fluentui/react-northstar";
import React from "react";
import SearchBar from "../ui-elements/searchbar.component";

export default function Header() {
	return (
		<Grid
			sm={12}
			styles={{
				gridColumn: "span 3",
				boxShadow: "0 0.5px 0 0 #888888",
			}}
			columns='repeat(3,1fr)'
			rows='40px 400px'
		>
			<Segment
				styles={{
					height: "40px",
					padding: "0",
					margin: "0",
					gridColumn: "span 2",
					backgroundColor: "none",
					boxShadow: "0 0 0px 0",
				}}
			/>
			<Segment
				styles={{
					height: "40px",
					padding: "0",
					margin: "0",
					gridColumn: "span 1",
					backgroundColor: "none",
					boxShadow: " 0 0 0 0",
				}}
			>
				<FilterIcon
					styles={{
						padding: "5px 5px 5px 15px",
					}}
				/>
				<Text
					content='Filter'
					styles={{
						padding: "5px",
					}}
				/>
				<SearchBar
					styles={{
						padding: "10px",
					}}
				/>
			</Segment>
		</Grid>
	);
}
