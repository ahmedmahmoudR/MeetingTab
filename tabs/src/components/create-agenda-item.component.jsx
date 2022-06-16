import React, { useState } from "react";

import {
	FlexItem,
	SendIcon,
	Flex,
	Button,
	Input,
} from "@fluentui/react-northstar";

import { useHttp } from "../hooks/http-hook";

const CreateAgendaItem = ({ setIsAddingAgendaItem }) => {
	const [itemValue, setItemValue] = useState("");
	const { sendRequest } = useHttp();

	const handleChange = (e) => {
		const { value } = e.target;
		setItemValue(value);
	};

	const handleSubmit = () => {
		sendRequest(`RAMI's API`, "POST", {
			date: "27/10/2022",
			item: itemValue,
		});
		setIsAddingAgendaItem(false);
	};

	return (
		<Flex gap='gap.small'>
			<FlexItem>
				<Input
					onChange={handleChange}
					value={itemValue}
					placeholder='Enter agenda item...'
					fluid
				/>
			</FlexItem>
			<FlexItem>
				<Button
					text
					onClick={handleSubmit}
					styles={
						{
							// backgroundColor: "none",
							// boxShadow: "none",
							// border: "none",
							// color: "brand",
						}
					}
					iconOnly
					icon={<SendIcon />}
				/>
			</FlexItem>
		</Flex>
	);
};

export default CreateAgendaItem;
