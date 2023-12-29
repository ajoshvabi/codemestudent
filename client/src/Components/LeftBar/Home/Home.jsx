import React, { useState, useEffect } from "react";
import LeftBar from "../LeftBar";
import TopBar from "../TopBar/TopBar";
import './home.css'
import { Row, Col, Container, Button, Table, Modal } from "react-bootstrap";
import axios from 'axios';

const Home = () => {
    const [date, setDate] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
    const [studentdata, setData] = useState({});
    const [fetchData, setFetchData] = useState([]);
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState();
    const [selecteddate, setSelectedDate] = useState();
    const [selecteduser, setSelectedUser] = useState({});
    const [mark, setMark] = useState(0);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentyear, setCurrentYear] = useState(2023);
    const [attentance, setattentance] = useState([]);

    let currentM = new Date().getMonth();
    const monthNames = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const decrementMonth = () => {
        setCurrentMonth(prevMonth => {
            const newMonth = prevMonth === 0 ? 11 : prevMonth - 1;
            return newMonth;
        });
    };
    const incrementMonth = () => {
        setCurrentMonth(prevMonth => {
            const newMonth = prevMonth === 11 ? 0 : prevMonth + 1;
            return newMonth;
        });
    };
    const decrementYear = () => {
        setCurrentYear(prevYear => {
            const newYear = prevYear - 1;
            return newYear;
        });
    };
    const incrementYear = () => {
        setCurrentYear(prevYear => {
            const newYear = prevYear + 1;
            return newYear;
        });
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('/data', { currentMonth, currentyear });
                setFetchData(response.data.userData);
                setattentance()
                console.log(response.data.userData[0].attendances[1].month);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, [show1, currentMonth]);

    const handleInputChange = (e) => {
        const { name, value, } = e.target;
        setData({
            ...studentdata,
            [name]: value,
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/addstudent', studentdata);
            console.log(response.data);
            setShow1(response)
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const attendance = (date, user) => {
        handleShow()
        setSelectedDate(date)
        setSelectedUser(user)

        console.log("add attendance", date);
        console.log("add attendance", user);
    }

    const markattendance = async () => {
        try {
            const response = await axios.post('/markattendance', { selecteduser, mark, currentMonth, date: selecteddate, year: currentyear });
            console.log(response.data);
            handleClose()
            setShow1(response)
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };
    const renderAttendanceIcon = (user, columnIndex) => {
        const attendanceItem = user.attendances.find(item => item.date === (columnIndex + 1));

        if (attendanceItem) {
            if (attendanceItem.status === 1) {
                return <i className="bi bi-x-octagon text-danger" />;
            } else if (attendanceItem.status === 2) {
                return <i className="bi bi-circle-half text-success" />;
            } else if (attendanceItem.status === 3) {
                return <i className="bi bi-check2-square text-success" />;
            }
        }

        return <i className="bi bi-dash-circle text-black" />;
    };





    return (
        <Container fluid>
            <Row>
                <Col className="left-main-bar">
                    <LeftBar />
                </Col>
                <Col>
                    <TopBar />
                    <Row >
                        <Col>
                            <form action="">
                                <input type="text" name="name" placeholder="Name" onChange={handleInputChange} /><br />
                                <input type="number" name="rollno" placeholder="Roll NUmber" className="mt-2" onChange={handleInputChange} /><br />
                                <input type="submit" name="" id="" className="btn btn-secondary mt-2" onClick={handleSubmit} />
                            </form>
                        </Col>
                        <Col className="d-flex justify-content-center my-5">
                            <Button onClick={decrementMonth}><i class="bi bi-caret-left-fill"></i></Button>
                            <h3 className="mx-4">{monthNames[currentMonth]}</h3>
                            <Button onClick={incrementMonth}><i class="bi bi-caret-right-fill"></i></Button>

                        </Col>
                        <Col className="d-flex justify-content-center my-5">
                            <Button onClick={decrementYear} ><i class="bi bi-caret-left-fill"></i></Button>
                            <h3 className="mx-4">{currentyear}</h3>
                            <Button onClick={incrementYear}><i class="bi bi-caret-right-fill"></i></Button>
                        </Col>

                    </Row>
                    <Row className="my-2 mt-4 mb-4">
                        <Col xs={7}>
                            <Row>
                                <Col>
                                    <i class="bi bi-check2-square me-2 text-success  mx-4"></i><b>Full Present</b>
                                    <i class="bi bi-circle-half me-2 text-success  mx-4"></i><b>Half Day</b>
                                    <i class="bi bi-x-octagon me-2 text-danger  mx-4"></i><b>Absent</b>
                                    <i class="bi bi-dash-circle me-2 text-black mx-4"></i><b>Not Updated</b>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Table className=" overflow-x-scroll ">
                        <thead>
                            <tr>
                                <th>Name</th>
                                {date.map((date) => (
                                    <th key={date}>{date}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {fetchData.map((user, userIndex) => (
                                <tr key={userIndex}>
                                    <td>{user.name}</td>
                                    {date.map((dateof, columnIndex) => (
                                        <td key={columnIndex} onClick={() => attendance(dateof, user)}>
                                            {user.attendances.some(attendanceItem => attendanceItem.date === (columnIndex + 1) && attendanceItem.month === currentMonth) ?
                                                renderAttendanceIcon(user, columnIndex) :
                                                <i className="bi bi-dash-circle text-black"></i>
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>


                    </Table>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Mark Attendance</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6><b>{selecteduser.name}</b></h6>
                    <p>Seleted date:{selecteddate}/{currentMonth + 1}/2023</p>
                    <Row >
                        <Col className="ms-5">
                            <Button variant="danger" onClick={() => setMark(1)}>
                                Leave
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="primary" onClick={() => setMark(2)}>
                                Half Day
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="success" onClick={() => setMark(3)}>
                                Full Day
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="dark" onClick={markattendance}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Home;
