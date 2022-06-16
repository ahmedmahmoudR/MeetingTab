import React, { useEffect } from "react";
import {
	Button,
	Flex,
	Text,
	Avatar,
	Card,
	Layout,
	Box,
} from "@fluentui/react-northstar";
import { CalendarIcon } from "@fluentui/react-icons-northstar";
import { useMyGraph } from "../../hooks/useMyGraph";

const CardExample = ({
	loading,
	data,
	error,
	title,
	dueDateTime,
	...otherProps
}) => {
	return (
		<Card
			fluid
			aria-roledescription='card with avatar, image and action buttons'
		>
			<Card.Header>
				<Flex gap='gap.small'>
					<Flex column>
						<Text content={title} weight='bold' color='grey' />
						{/* <Text content={description} size='small' color='grey' /> */}
					</Flex>
				</Flex>
			</Card.Header>
			<Card.Footer>
				<Flex space='between'>
					{!loading && data && (
						<Avatar
							image={!loading && data && data.photoUrl}
							label='Copy bandwidth'
							name='Evie yundt'
							status='unknown'
						/>
					)}
					<Flex vAlign='center'>
						<Button
							icon={<CalendarIcon />}
							iconOnly
							text
							title='Date'
						/>
						<Text
							content={new Date(dueDateTime).toLocaleDateString()}
							color='grey'
						/>
					</Flex>
				</Flex>
			</Card.Footer>
		</Card>
	);
};

const Task = ({ assignments, ...otherProps }) => {
	const userId = Object.keys(assignments);

	const { loading, error, data, sendGraphRequest } = useMyGraph();
	useEffect(() => {
		sendGraphRequest(
			async (graph) => {
				let photoUrl = "";
				try {
					const photo = await graph
						.api(`/users/${userId}/photo/$value`)
						.get();
					photoUrl = URL.createObjectURL(photo);
				} catch (error) {}

				return { photoUrl };
			},
			{
				scope: [
					"User.Read",
					"Tasks.ReadWrite",
					"Tasks.Read",
					"Group.Read.All",
					"Group.ReadWrite.All",
				],
			},
		);
	}, [sendGraphRequest]);

	return (
		<Box style={{ cursor: "pointer" }}>
			<Layout
				styles={{
					maxWidth: "600px",
				}}
				renderMainArea={() => (
					<CardExample
						data={data}
						loading={loading}
						error={error}
						{...otherProps}
					/>
				)}
			/>
		</Box>
	);
};

export default Task;
