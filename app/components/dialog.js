import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
	Divider,
	styled,
} from "@mui/material";
import { orange, grey } from "@mui/material/colors";

// Apply custom styles to DialogTitle using MUI's styled utility
const StyledDialogTitle = styled(DialogTitle)({
	backgroundColor: orange[500],
	color: "#fff",
	"& h2": {
		fontWeight: "bold",
	},
});

// Apply custom styles to DialogContent
const StyledDialogContent = styled(DialogContent)({
	marginTop: "20px",
});

// Apply custom styles to Button
const StyledButton = styled(Button)({
	"&.MuiButton-containedPrimary": {
		backgroundColor: orange[500],
		"&:hover": {
			backgroundColor: orange[700],
		},
	},
	"&.MuiButton-outlinedSecondary": {
		borderColor: grey[500],
		color: grey[600],
		"&:hover": {
			borderColor: grey[700],
			color: grey[800],
		},
	},
});

/**
 * Renders a confirmation dialog with custom styling.
 *
 * @param {boolean} open - Controls the visibility of the dialog.
 * @param {Function} onClose - Callback function when the dialog is requested to be closed.
 * @param {Function} onConfirm - Callback function when the confirmation action is triggered.
 * @param {string} title - The title text of the dialog.
 * @param {string} content - The content text of the dialog.
 *
 * @returns {JSX.Element} The styled confirmation dialog component.
 */
const ConfirmationDialog = ({ open, onClose, onConfirm, title, content }) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
		>
			<StyledDialogTitle id="dialog-title">{title}</StyledDialogTitle>
			<StyledDialogContent>
				<DialogContentText id="confirm-dialog-description">
					{content}
				</DialogContentText>
			</StyledDialogContent>
			<Divider />
			<DialogActions>
				<StyledButton
					onClick={onClose}
					variant="outlined"
					color="secondary"
				>
					Cancel
				</StyledButton>
				<StyledButton
					onClick={onConfirm}
					color="primary"
					variant="contained"
				>
					OK
				</StyledButton>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmationDialog;
