import { useEffect, useRef } from "react";

/**
 * Renders a 3D structure viewer using the $3Dmol library.
 *
 * @param {string} pdbData The PDB formatted data as a string for the structure to be visualized.
 * @param {string} id A unique identifier for the DOM element of the viewer.
 *
 * @returns {JSX.Element} A div element containing the 3D structure viewer.
 */
const ThreeDmolViewer = ({ pdbData, id }) => {
	const viewerRef = useRef(null);

	useEffect(() => {
		if (viewerRef.current && pdbData) {
			const viewer = window.$3Dmol.createViewer(viewerRef.current, {
				defaultcolors: window.$3Dmol.rasmolElementColors,
			});

			viewer.addModel(pdbData, "pdb");
			viewer.setStyle({}, { cartoon: { color: "spectrum" } });

			viewer.zoomTo();
			viewer.render();

			viewer.spin(true);
			return () => {
				console.log("3DmolViewer unmounting");

				viewer.spin(false);
				viewer.removeAllModels();
				viewer.stopAnimate();
				viewer.clear();
			};
		}
	}, [pdbData]);

	return (
		<div
			id={`3DmolViewer_${id}`}
			style={{ position: "relative", width: "400px", height: "400px" }}
			ref={viewerRef}
		></div>
	);
};

export default ThreeDmolViewer;
