import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemText,
	CssBaseline,
	Toolbar,
	ListItemIcon,
	Typography,
	Divider,
} from "@mui/material";

import Link from "next/link";
import ListIcon from "@mui/icons-material/List";
import FAQIcon from "@mui/icons-material/HelpOutline";
import SensorsIcon from "@mui/icons-material/Sensors";

const drawerWidth = 240;
const views = ["ligands", "fps", "organism"];
/**
 * Sidebar component for the MibiSens section of the application.
 * It includes navigation links to various parts of the MibiSens section.
 */
const MibiSensSidebar = () => {
	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: drawerWidth,
						boxSizing: "border-box",
					},
				}}
			>
				<Toolbar />
				<List>
					<Link
						key={"overview"}
						href="/mibisens"
						passHref
					>
						<ListItem>
							<ListItemIcon>
								<SensorsIcon />
							</ListItemIcon>
							<Typography
								variant="h7"
								fontWeight="bold"
							>
								Overview
							</Typography>
						</ListItem>
					</Link>

					<Divider />
					<ListItem>
						<ListItemIcon>
							<ListIcon />
						</ListItemIcon>
						<Typography
							variant="h7"
							fontWeight="bold"
						>
							Views
						</Typography>
					</ListItem>

					{views.map((text, index) => (
						<Link
							key={"mibisens-" + text}
							href={"/mibisens/" + text}
							passHref
						>
							<ListItem>
								<ListItemText primary={text} />
							</ListItem>
						</Link>
					))}
					<Divider />

					<Link
						key={"faq"}
						href="/mibisens/faq"
						passHref
					>
						<ListItem>
							<ListItemIcon>
								<FAQIcon />
							</ListItemIcon>
							<Typography
								variant="h7"
								fontWeight="bold"
							>
								FAQs
							</Typography>{" "}
						</ListItem>
					</Link>
				</List>
			</Drawer>
		</Box>
	);
};

export default MibiSensSidebar;
