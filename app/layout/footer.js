import Link from "next/link";
import { Grid, Typography, Box } from "@mui/material";
import Image from "next/image";

/**
 * Footer component displaying information about funding, associated links,
 * participating institutions, and their logos.
 */
const Footer = () => {
	return (
		<Box
			component="footer"
			sx={{ padding: "20px" }}
		>
			<Grid
				container
				spacing={3}
				justifyContent="space-between"
			>
				{/* First module: DFG Image and Description */}
				<Grid
					item
					xs={12}
					md={4}
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							mb: 2,
						}}
					>
						<Image
							src="/dfg.png"
							alt="Funded by DFG"
							width="580"
							height="140"
							style={{ height: "auto" }}
						/>
					</Box>
					<Typography
						variant="header2"
						sx={{ fontSize: 25, maxWidth: "550px" }}
						align="justify"
					>
						The SFB 1535 MibiNet is funded by the German Research Foundation
						(DFG).
					</Typography>
					<Typography
						variant="h6"
						gutterBottom
						sx={{ mt: 4, fontSize: 25 }}
					>
						Associated Links
					</Typography>
					<Box sx={{ textAlign: "left", ml: 3 }}>
						<Link
							href="https://www.sfb1535.hhu.de/en/"
							passHref
						>
							<Typography
								variant="body1"
								sx={{
									fontSize: "20px",
									textDecoration: "underline",
									cursor: "pointer",
								}}
							>
								SFB 1535 MibiNet Homepage
							</Typography>
						</Link>
					</Box>
				</Grid>

				{/* Second module: MibiNet */}
				<Grid
					item
					xs={12}
					sm={4}
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Typography
						variant="h2"
						gutterBottom
						sx={{ fontSize: 25 }}
					>
						Microbial networking - from organelles to cross-kingdom communities
					</Typography>
					<Image
						src="/mibinet.png"
						alt="Participating Institutions"
						width="400"
						height="220"
					/>
				</Grid>

				{/* Third module: Associated Links */}
				<Grid
					item
					xs={12}
					sm={4}
					sx={{
						display: "flex",
						flexDirection: "column",
					}}
				>
					<Typography
						variant="h6"
						gutterBottom
						sx={{ fontSize: 25 }}
					>
						Participating Institutions
					</Typography>
					<Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
						<Link
							href="https://www.hhu.de/en/"
							passHref
						>
							<Image
								src="/hhu_logo.jpg"
								alt="hhu"
								width="190"
								height="50"
								style={{ height: "auto" }}
							/>
						</Link>
						<Link
							href="https://www.fz-juelich.de/en"
							passHref
						>
							<Image
								src="/fzj.png"
								alt="fzj"
								width="190"
								height="50"
								style={{ height: "auto" }}
							/>
						</Link>
						<Link
							href="https://portal.uni-koeln.de/en/uoc-home"
							passHref
						>
							<Image
								src="/uzk.jpg"
								alt="uzk"
								width="190"
								height="50"
								style={{ height: "auto" }}
							/>
						</Link>
					</Box>
					<Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
						<Link
							href="https://www.mpipz.mpg.de/en"
							passHref
						>
							<Image
								src="/mpi.png"
								alt="mpi"
								width="190"
								height="50"
								style={{ height: "auto" }}
							/>
						</Link>
						<Link
							href="https://www.rwth-aachen.de/"
							passHref
						>
							<Image
								src="/rwth.png"
								alt="rwth"
								width="190"
								height="50"
								style={{ height: "auto" }}
							/>
						</Link>
						<Link
							href="https://www.uni-bielefeld.de/"
							passHref
						>
							<Image
								src="/bielefeld.jpg"
								alt="bielefeld"
								width="190"
								height="50"
								style={{ height: "auto" }}
							/>
						</Link>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Footer;
