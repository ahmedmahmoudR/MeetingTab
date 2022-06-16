import React, { useEffect, useState } from "react";
import {
	List,
	Button,
	AddIcon,
	ListItem,
	Checkbox,
	Loader,
} from "@fluentui/react-northstar";
import { useHttp } from "../hooks/http-hook";
import CreateAgendaItem from "./create-agenda-item.component";

const Agenda = () => {
	const { data, isLoading, error, sendRequest } = useHttp();
	const [isAddingAgendaItem, setIsAddingAgendaItem] = useState(false);

	useEffect(() => {
		sendRequest(`https://jsonplaceholder.typicode.com/todos`, "GET");
	}, [sendRequest]);

	const handleAddItem = () => {
		setIsAddingAgendaItem(!isAddingAgendaItem);
	};
	return (
		<div style={{ maxHeight: "45vh", overflow: "auto", margin: "5px 0" }}>
			<Button
				onClick={handleAddItem}
				icon={<AddIcon />}
				iconPosition='before'
				content='Add agenda item'
				fluid
				tinted
				style={{ margin: "5px 0" }}
				loading={isLoading}
			/>
			{isAddingAgendaItem && (
				<CreateAgendaItem
					setIsAddingAgendaItem={setIsAddingAgendaItem}
				/>
			)}
			{isLoading && <Loader />}{" "}
			{data && (
				<List>
					{data &&
						data.map((item, index) => (
							<ListItem
								key={index}
								styles={{
									backgroundColor: "white",
									margin: "10px 0",
									borderRadius: "5px",
								}}
								media={
									<Checkbox
										// checked={item.completed}
										defaultChecked={item.completed}
									/>
								}
								header={item.title}
							/>
						))}
				</List>
			)}
			{error && <div>error:{error.toString()}</div>}
		</div>
	);
};
export default Agenda;
