import React, { useState, useEffect } from "react";
import { Container, Row, Col, Offcanvas,Table } from "react-bootstrap";
import axios from 'axios';

const LeftBar = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [student, setStudent] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/list');
        console.log(response);
        setStudent(response.data.userData)
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);
  return (
    <Container fluid className="text-white" >
      <div className=" d-flex justify-content-center py-5">
        <h2>Logo</h2>
      </div>
      <Row>
        <Col lg={12} className="py-3"><i class="bi bi-person-fill"></i><label className="ms-2 fw-semibold ">Attendance</label></Col>
        <Col lg={12} className="py-3" onClick={handleShow}><i className="bi bi-menu-button-wide"></i><label className="ms-2 fw-semibold ">Report</label></Col>
      </Row>
      <Offcanvas show={show} onHide={handleClose} start>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Report</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Leave</th>
          <th>Half Day</th>
          <th>Full Day</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {student.map((user, index) => (
          <tr key={index}>
            <td>{user.name}</td>
            <td>{user.leave}</td>
            <td>{user.half}</td>
            <td>{user.full}</td>
            <td>{user.full + (user.half / 2)}</td>
          </tr>
        ))}
      </tbody>
    </Table>


        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default LeftBar;
