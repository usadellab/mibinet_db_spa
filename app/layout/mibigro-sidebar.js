import {
	Box,
	Drawer,
	List,
	ListItem,
	CssBaseline,
	Toolbar,
	ListItemIcon,
	Typography,
	Divider,
} from "@mui/material";
import Link from "next/link";
import FAQIcon from "@mui/icons-material/HelpOutline";
import { Dashboard } from "@mui/icons-material";

const drawerWidth = 240;
/**
 * Sidebar component for the MibiGro section of the application.
 * It includes navigation links to various parts of the MibiGro section.
 */
const MibiGroSidebar = () => {
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
						key={"introduction"}
						href="/wiki"
						passHref
					>
						<ListItem>
							<ListItemIcon>
								<Dashboard />
							</ListItemIcon>
							<Typography
								variant="h7"
								fontWeight="bold"
							>
								Introduction
							</Typography>
						</ListItem>
					</Link>

					<Divider />

					<Link
						key={"faq"}
						href="/wiki/faq"
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
							</Typography>
						</ListItem>
					</Link>
				</List>
			</Drawer>
		</Box>
	);
};

export default MibiGroSidebar;
