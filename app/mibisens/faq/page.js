"use client";

import { useState } from "react";
import {
	Container,
	Typography,
	Box,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	TextField,
	IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import questions from "./questions";

/**
 * FAQ component displaying frequently asked questions with a search functionality.
 *
 * @returns {JSX.Element} A component with searchable FAQ items.
 */
const FAQ = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredQuestions, setFilteredQuestions] = useState(questions);

	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
		if (event.target.value) {
			const filtered = questions.filter(
				(q) =>
					q.question.toLowerCase().includes(event.target.value.toLowerCase()) ||
					q.answer.toLowerCase().includes(event.target.value.toLowerCase())
			);
			setFilteredQuestions(filtered);
		} else {
			setFilteredQuestions(questions);
		}
	};

	return (
		<Container
			style={{
				marginTop: "100px",
			}}
		>
			<Box mt={4}>
				<Typography
					variant="h3"
					gutterBottom
				>
					Frequently Asked Questions
				</Typography>
				<Typography
					variant="body1"
					paragraph
				>
					Here are some common questions and their respective answers.
				</Typography>

				<Box
					my={2}
					display="flex"
					justifyContent="flex-end"
				>
					<TextField
						variant="outlined"
						placeholder="Search question..."
						value={searchTerm}
						onChange={handleSearch}
						InputProps={{
							endAdornment: (
								<IconButton type="submit">
									<SearchIcon />
								</IconButton>
							),
						}}
					/>
				</Box>

				{filteredQuestions.map((q, index) => (
					<Accordion
						key={index}
						href={`#q${index + 1}`}
						style={{ borderBottom: "1px solid #ccc" }}
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls={`panel${index + 1}-content`}
							id={`q${index + 1}`}
						>
							<Typography>{q.question}</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>{q.answer}</Typography>
						</AccordionDetails>
					</Accordion>
				))}
			</Box>
		</Container>
	);
};

export default FAQ;
