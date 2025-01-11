import { useQuery } from "@tanstack/react-query";
import { Nav, NavDropdown } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import pipelineApi from "../../api/pipelines";

function NavPipeline() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    data: pipelines,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pipelines"],
    queryFn: () => pipelineApi.getAll(),
  });

  console.log("Pipelines data:", pipelines); // Debugging line
  console.log("isLoading:", isLoading);
  console.log("error:", error);

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading pipelines</div>;

  const handlePipelineSelect = (pipelineId) => {
    navigate(`/pipeline/${pipelineId}`);
  };

  return (
    <NavDropdown
      title="Pipelines"
      id="pipeline-nav-dropdown"
      active={location.pathname.includes("/pipeline")}
    >
      {pipelines.data.length > 0 ? (
        pipelines.data.map((pipeline) => (
          <NavDropdown.Item
            key={pipeline.id}
            onClick={() => handlePipelineSelect(pipeline.id)}
          >
            {pipeline.name}
          </NavDropdown.Item>
        ))
      ) : (
        <NavDropdown.Item disabled>No pipelines available</NavDropdown.Item>
      )}
    </NavDropdown>
  );
}

export default NavPipeline;
