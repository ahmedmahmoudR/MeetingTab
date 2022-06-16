import { Datepicker, Grid, Segment } from "@fluentui/react-northstar";
import React from "react";

import Header from "./header/header.component";
import PlannerTasks from "./planner-tasks.component";
import Agenda from "./agenda-items.component";
import Notes from "./notes.component";

const Home = () => {
	const groupId = "adb7d642-ae27-4735-9862-f4c69f6604d4";
	return (
		<Grid columns='repeat(4, 1fr)' rows='40px 595px'>
			<Header />
			<Segment
				styles={{
					height: "40px",
					padding: "0 0 0 20px",
					margin: "0",
					backgroundColor: "none",
					boxShadow: "0 0.5px 1px 0 #888888",
				}}
			>
				<Datepicker styles={{ margin: "0 0 20px 0" }} />
			</Segment>

			<PlannerTasks />

			<Segment
				styles={{
					backgroundColor: "none",
					gridColumn: "span 1",
					fontWeight: "bold",
				}}
			>
				<Segment
					styles={{
						backgroundColor: "none",
						gridColumn: "span 1",
						fontWeight: "normal",
						boxShadow: "none",
						padding: "0",
					}}
				>
					<h4>Agenda Items</h4>
					<Agenda />
				</Segment>
				<Segment
					styles={{
						backgroundColor: "none",
						boxShadow: "none",
						padding: "0",
						gridColumn: "span 1",
						fontWeight: "normal",
						height: "30vh",
					}}
				>
					<h4>Shared notes</h4>
					<Notes groupId={groupId} />
				</Segment>
			</Segment>
		</Grid>
	);
};

export default Home;
