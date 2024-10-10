import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardTitle, CardFooter } from 'reactstrap';
import '../css/ModulesByCohort.css';

function ModulesByCohort() {
  const [modules, setModules] = useState([]);
  const { cohortId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);

    async function fetchModulesByCohort() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/module/?delivered_to=${cohortId}`);
        if (!response.ok) {
          setError(`Cohort not found`);
          return;
        }
        const data = await response.json();

        if (data.length === 0) {
          setError(`This cohort does not have any modules at the moment.`);
          return;
        }

        // Sort modules by full name before setting them to state
        data.sort((a, b) => a.full_name.localeCompare(b.full_name));
        setModules(data);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchModulesByCohort();
  }, [cohortId]);

  if (isLoading) {
    return <Container className="modules-by-cohort-container"><h1>Loading...</h1></Container>;
  }

  return (
    <Container className="modules-by-cohort-container">
      <Row>
        <h1 className="text-center mb-4 w-100">Modules Delivered to {cohortId}</h1>
        {error && (
          <div className="w-100 text-center">
            <p>{error}</p>
          </div>
        )}
        {!error && modules.length === 0 && (
          <div className="w-100 text-center">
            <p>This cohort does not have any modules at the moment.</p>
          </div>
        )}
        {modules.length > 0 && (
          modules.map((module, index) => (
            <Col key={index} md="4" sm="6" className="mb-4 d-flex align-items-stretch">
              <Card className="module-card w-100">
                <CardBody>
                  <CardTitle tag="h5">{module.code} - {module.full_name}</CardTitle>
                </CardBody>
                <CardFooter>
                  <Link to={`/modules/${module.code}`}>View Module Details</Link>
                </CardFooter>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default ModulesByCohort;
